import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import {
  Logger,
  createErrorResponse,
  createSuccessResponse,
  generateRequestId,
  getClientIP,
  PerformanceTimer,
  withRetry
} from '@/lib/validation';

// Transcribe için sabitler
const BASE_TRANSCRIBE_COST = 5; // 5 kredi per dakika
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/m4a'];
const MAX_DURATION_MINUTES = 30; // 30 dakika maksimum

// Model-specific cost multipliers
function getTranscribeCostMultiplier(model: string): number {
  switch(model) {
    case 'subformer-turbo':
      return 0.5; // %50 daha ucuz
    case 'meta-omnilingual-asr-3b':
    default:
      return 1.0; // Standart fiyat
  }
}

// Polling function for transcription completion
async function pollForTranscriptionCompletion(pollingUrl: string, apiKey: string, requestId: string, maxAttempts: number = 60) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(pollingUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const data = response.data;
      Logger.info(`Transcription polling attempt ${attempts + 1}`, { requestId, status: data.status });

      if (data.status === 'succeeded' || data.status === 'completed') {
        return data;
      }

      if (data.status === 'failed' || data.status === 'error') {
        throw new Error(`Transcription failed: ${data.error || 'Unknown error'}`);
      }

      // Wait before next attempt (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(1.5, attempts), 10000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      attempts++;

    } catch (error) {
      Logger.warn(`Transcription polling error on attempt ${attempts + 1}`, { 
        requestId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      if (attempts >= maxAttempts - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
  }

  throw new Error('Transcription timeout - maximum attempts reached');
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const timer = new PerformanceTimer('transcribe-api');
  const clientIP = getClientIP(request);
  
  try {
    // Session kontrolü
    const session = await auth();
    if (!session?.user?.id) {
      Logger.warn('Yetkisiz transcribe denemesi', { requestId, clientIP });
      return NextResponse.json(
        createErrorResponse('Oturum açmanız gerekiyor.', 'UNAUTHORIZED', undefined, undefined, requestId),
        { status: 401 }
      );
    }

    // API Key kontrolü
    const apiKey = process.env.CORTEX_API_KEY;
    if (!apiKey) {
      Logger.error('API Key eksik', { requestId });
      return NextResponse.json(
        createErrorResponse('Sistem hatası.', 'SERVER_ERROR', undefined, undefined, requestId),
        { status: 500 }
      );
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true
      }
    });

    if (!user) {
      Logger.warn('Kullanıcı bulunamadı', { requestId, userId: session.user.id });
      return NextResponse.json(
        createErrorResponse('Kullanıcı bulunamadı.', 'UNAUTHORIZED', undefined, undefined, requestId),
        { status: 401 }
      );
    }

    // Form data'yı al
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'auto';
    const model = formData.get('model') as string || 'meta-omnilingual-asr-3b';
    const includeTimestamps = formData.get('include_timestamps') === 'true';
    const includeSpeakerLabels = formData.get('include_speaker_labels') === 'true';

    // Audio file validasyonu
    if (!audioFile) {
      return NextResponse.json(
        createErrorResponse('Ses dosyası gerekli.', 'VALIDATION_ERROR', 'audio', undefined, requestId),
        { status: 400 }
      );
    }

    // Dosya boyut kontrolü
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        createErrorResponse(`Ses dosyası ${MAX_FILE_SIZE / (1024 * 1024)}MB'dan büyük olamaz.`, 'VALIDATION_ERROR', 'audio', { fileSize: audioFile.size }, requestId),
        { status: 400 }
      );
    }

    // Dosya format kontrolü
    if (!ALLOWED_AUDIO_TYPES.includes(audioFile.type)) {
      return NextResponse.json(
        createErrorResponse('Desteklenen formatlar: WAV, MP3, OGG, FLAC, M4A', 'VALIDATION_ERROR', 'audio', { fileType: audioFile.type }, requestId),
        { status: 400 }
      );
    }

    // Tahmini süre hesaplama (yaklaşık, dosya boyutuna göre)
    const estimatedMinutes = Math.min(Math.ceil(audioFile.size / (1024 * 1024)), MAX_DURATION_MINUTES);
    
    // Kredi hesabı ve kontrolü
    const costMultiplier = getTranscribeCostMultiplier(model);
    const requiredCredits = Math.ceil(BASE_TRANSCRIBE_COST * estimatedMinutes * costMultiplier);
    
    if (user.credits < requiredCredits) {
      Logger.warn('Yetersiz kredi - transcribe', {
        requestId,
        userId: session.user.id,
        model,
        estimatedMinutes,
        costMultiplier,
        requiredCredits,
        availableCredits: user.credits
      });
      return NextResponse.json({
        success: false,
        error: `Yetersiz kredi! Deşifre için ${requiredCredits} kredi gerekli, ${user.credits} krediniz var.`,
        needsMoreCredits: true,
        requiredCredits,
        availableCredits: user.credits,
        estimatedMinutes,
        requestId,
        model
      }, { status: 402 });
    }

    Logger.info('Transcription başlatılıyor', {
      requestId,
      userId: session.user.id,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      language,
      model,
      includeTimestamps,
      includeSpeakerLabels,
      estimatedMinutes,
      costMultiplier,
      requiredCredits,
      credits: user.credits
    });

    // Ses dosyasını buffer'a çevir
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    // ASR API çağrısı
    const modelVersion = model === 'subformer-turbo' ? 'subformer/asr-turbo' : 'meta/omnilingual-asr-3b';
    const response = await withRetry(
      () => axios.post(
        "https://api.gateai.app/v1/predictions",
        {
          version: modelVersion,
          input: {
            audio_data: audioBase64,
            language: language === 'auto' ? null : language,
            include_timestamps: includeTimestamps,
            include_speaker_labels: includeSpeakerLabels,
            model_type: "neural",
            quality: "high"
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 dakika timeout
        }
      ),
      3, // 3 deneme
      2000 // 2 saniye bekleme
    );

    const responseData = response.data;
    Logger.info("Transcription API ilk yanıt alındı", { requestId, status: responseData.status });

    // Polling URL varsa bekle
    let finalResult = responseData;
    if (responseData.polling_url && (responseData.status === 'starting' || responseData.status === 'processing')) {
      Logger.info('Transcription polling başlatılıyor', { requestId, pollingUrl: responseData.polling_url });
      
      finalResult = await pollForTranscriptionCompletion(responseData.polling_url, apiKey, requestId);
    }

    // Sonuç kontrolü
    if (finalResult.status !== 'succeeded' && finalResult.status !== 'completed') {
      Logger.error('Transcription başarısız', { requestId, status: finalResult.status, error: finalResult.error });
      return NextResponse.json(
        createErrorResponse('Deşifre işlemi başarısız.', 'EXTERNAL_API_ERROR', undefined, finalResult, requestId),
        { status: 500 }
      );
    }

    const transcription = finalResult.output?.transcription || finalResult.output?.text;
    if (!transcription) {
      Logger.error('Transcription alınamadı', { requestId, output: finalResult.output });
      return NextResponse.json(
        createErrorResponse('Deşifre başarısız, metin alınamadı.', 'EXTERNAL_API_ERROR', undefined, finalResult, requestId),
        { status: 500 }
      );
    }

    // Gerçek süreyi al (varsa)
    const actualMinutes = finalResult.output?.duration_minutes || estimatedMinutes;
    const finalCredits = Math.ceil(BASE_TRANSCRIBE_COST * actualMinutes * costMultiplier);

    // Database işlemi - transaction ile
    const result = await prisma.$transaction(async (tx: any) => {
      // Krediyi düş
      await tx.user.update({
        where: { id: user.id },
        data: { credits: { decrement: finalCredits } }
      });

      return {
        transcription,
        actualMinutes,
        finalCredits
      };
    });

    const performanceData = timer.end();
    Logger.info('Transcription tamamlandı', {
      requestId,
      model,
      costMultiplier,
      actualMinutes,
      creditsUsed: finalCredits,
      remainingCredits: user.credits - finalCredits,
      transcriptionLength: transcription.length,
      duration: performanceData
    });

    return NextResponse.json(
      createSuccessResponse({
        transcription,
        language: finalResult.output?.detected_language || language,
        model,
        duration_minutes: actualMinutes,
        credits_used: finalCredits,
        remaining_credits: user.credits - finalCredits,
        timestamps: finalResult.output?.timestamps || null,
        speaker_labels: finalResult.output?.speaker_labels || null,
        message: 'Deşifre işlemi tamamlandı!'
      })
    );

  } catch (error) {
    const performanceData = timer.end();
    Logger.error('Transcription API hatası', {
      requestId,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined,
      duration: performanceData
    });
    
    return NextResponse.json(
      createErrorResponse('Deşifre sırasında hata oluştu.', 'SERVER_ERROR', undefined, undefined, requestId),
      { status: 500 }
    );
  }
}

// Kullanıcının geçmiş deşifre işlemlerini getir (şimdilik boş)
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        createErrorResponse('Oturum açmanız gerekiyor.', 'UNAUTHORIZED', undefined, undefined, requestId),
        { status: 401 }
      );
    }

    return NextResponse.json(
      createSuccessResponse({
        transcriptions: [], // Şimdilik boş, ileride geçmiş eklenebilir
        message: 'Deşifre geçmişi alındı'
      })
    );

  } catch (error) {
    Logger.error('Transcription GET API hatası', {
      requestId,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
    
    return NextResponse.json(
      createErrorResponse('Deşifre geçmişi alınamadı.', 'SERVER_ERROR', undefined, undefined, requestId),
      { status: 500 }
    );
  }
}