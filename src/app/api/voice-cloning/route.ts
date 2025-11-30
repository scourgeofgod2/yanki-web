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
  withRetry,
  validateVoiceCloningRequest,
  VoiceCloningModel
} from '@/lib/validation';

// Voice Cloning için sabitler
const BASE_VOICE_CLONING_COST = 50; // Base kredi miktarı (speech-2.6-hd için)
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/mp4'];

// Model-specific cost multipliers
function getCloningCostMultiplier(model: VoiceCloningModel): number {
  switch(model) {
    case 'speech-2.6-hd-turbo':
      return 0.6; // %40 daha ucuz
    case 'speech-2.6-hd':
    default:
      return 1.0; // Standart fiyat
  }
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const timer = new PerformanceTimer('voice-cloning-api');
  const clientIP = getClientIP(request);
  
  try {
    // Session kontrolü
    const session = await auth();
    if (!session?.user?.id) {
      Logger.warn('Yetkisiz voice cloning denemesi', { requestId, clientIP });
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
      include: {
        clonedVoices: true
      }
    });

    if (!user) {
      Logger.error('Kullanıcı bulunamadı', { requestId, userId: session.user.id });
      return NextResponse.json(
        createErrorResponse('Kullanıcı bulunamadı.', 'SERVER_ERROR', undefined, undefined, requestId),
        { status: 404 }
      );
    }

    // Ses klonlama limiti kontrolü (plan bazında)
    let voiceCloningLimit = 1; // default: free plan
    if (user.plan === 'starter') voiceCloningLimit = 3;
    else if (user.plan === 'popular') voiceCloningLimit = 5;
    else if (user.plan === 'enterprise') voiceCloningLimit = 10;
    
    const currentVoiceCount = user.clonedVoices?.length || 0;

    if (currentVoiceCount >= voiceCloningLimit) {
      Logger.warn('Ses klonlama limiti aşıldı', {
        requestId,
        userId: session.user.id,
        currentCount: currentVoiceCount,
        limit: voiceCloningLimit,
        plan: user.plan
      });
      return NextResponse.json(
        createErrorResponse(
          `Ses klonlama limitiniz aşıldı. ${user.plan} planında ${voiceCloningLimit} ses klonlama hakkınız var. Daha fazla ses klonlamak için planınızı yükseltin.`,
          'VALIDATION_ERROR',
          undefined,
          { currentCount: currentVoiceCount, limit: voiceCloningLimit, plan: user.plan },
          requestId
        ),
        { status: 403 }
      );
    }

    // Form data'yı al
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const voiceName = formData.get('voice_name') as string;
    const accuracyParam = formData.get('accuracy') as string || '0.7';
    const accuracy = parseFloat(accuracyParam);
    const model = formData.get('model') as VoiceCloningModel || 'speech-02-hd';
    const noiseReduction = formData.get('noise_reduction') === 'true';
    const volumeNormalization = formData.get('volume_normalization') === 'true';

    // Validation
    const validationResult = validateVoiceCloningRequest({
      voice_name: voiceName,
      accuracy,
      model,
      noise_reduction: noiseReduction,
      volume_normalization: volumeNormalization
    });

    // Accuracy range validation (0.1-0.9)
    if (accuracy < 0.1 || accuracy > 0.9) {
      return NextResponse.json(
        createErrorResponse('Accuracy değeri 0.1 ile 0.9 arasında olmalı.', 'VALIDATION_ERROR', 'accuracy', { accuracy }, requestId),
        { status: 400 }
      );
    }

    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(validationResult.error, 'VALIDATION_ERROR', validationResult.field, undefined, requestId),
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Kredi hesabı ve kontrolü
    const costMultiplier = getCloningCostMultiplier(validatedData.model);
    const requiredCredits = Math.ceil(BASE_VOICE_CLONING_COST * costMultiplier);
    
    if (user.credits < requiredCredits) {
      Logger.warn('Yetersiz kredi - voice cloning', {
        requestId,
        userId: session.user.id,
        model: validatedData.model,
        costMultiplier,
        requiredCredits,
        availableCredits: user.credits
      });
      return NextResponse.json({
        success: false,
        error: `Yetersiz kredi. Ses klonlama için ${requiredCredits} kredi gerekli, ${user.credits} krediniz var.`,
        needsMoreCredits: true,
        requiredCredits,
        availableCredits: user.credits,
        requestId,
        model: validatedData.model
      }, { status: 402 });
    }

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
        createErrorResponse('Desteklenen formatlar: WAV, MP3, OGG, FLAC', 'VALIDATION_ERROR', 'audio', { fileType: audioFile.type }, requestId),
        { status: 400 }
      );
    }

    Logger.info('Voice cloning başlatılıyor', {
      requestId,
      userId: session.user.id,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      voiceName: validatedData.voice_name,
      accuracy: validatedData.accuracy,
      model: validatedData.model,
      noiseReduction: validatedData.noise_reduction,
      volumeNormalization: validatedData.volume_normalization,
      costMultiplier,
      requiredCredits,
      credits: user.credits
    });

    // Ses dosyasını buffer'a çevir ve data URL formatına çevir
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    // Data URL formatı: data:audio/wav;base64,...
    const mimeType = audioFile.type || 'audio/wav';
    const voiceFileUrl = `data:${mimeType};base64,${audioBase64}`;

    // Model mapping: speech-2.6-hd-turbo -> speech-2.6-hd-turbo, speech-2.6-hd -> speech-2.6-hd
    const modelMapping: Record<VoiceCloningModel, string> = {
      'speech-2.6-hd-turbo': 'speech-2.6-hd-turbo',
      'speech-2.6-hd': 'speech-2.6-hd'
    };
    const apiModel = modelMapping[validatedData.model] || 'speech-2.6-hd';

    // Minimax Voice Cloning API çağrısı - Referans API formatına göre
    const response = await withRetry(
      () => axios.post(
        "https://api.gateai.app/v1/predictions",
        {
          version: "minimax/voice-cloning",
          input: {
            model: apiModel,
            accuracy: validatedData.accuracy, // 0.1-0.9 arası number
            voice_file: voiceFileUrl, // Data URL formatında
            need_noise_reduction: validatedData.noise_reduction,
            need_volume_normalization: validatedData.volume_normalization
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 dakika timeout (voice cloning uzun sürebilir)
        }
      ),
      3, // 3 deneme
      2000 // 2 saniye bekleme
    );

    const responseData = response.data;
    Logger.info("Voice cloning API ilk yanıt alındı", { requestId, status: responseData.status });

    // 1. Backend Polling Gerekli mi? (polling_url var mı?)
    if (responseData.polling_url && (responseData.status === 'starting' || responseData.status === 'processing')) {
      Logger.info('Backend polling başlatılıyor', { requestId, pollingUrl: responseData.polling_url });
      
      try {
        const finalResult = await pollForVoiceCloningCompletion(responseData.polling_url, apiKey, requestId);
        
        const voiceId = finalResult.output?.voice_id || finalResult.output?.id;
        if (!voiceId) {
          Logger.error('Voice ID alınamadı - backend polling', { requestId, output: finalResult.output });
          return NextResponse.json(
            createErrorResponse('Ses klonlama başarısız, voice ID alınamadı.', 'EXTERNAL_API_ERROR', undefined, finalResult, requestId),
            { status: 500 }
          );
        }

        // Backend polling başarılı - kredileri düş ve kaydet
        const result = await prisma.$transaction(async (tx: any) => {
          await tx.user.update({
            where: { id: user.id },
            data: { credits: { decrement: requiredCredits } }
          });

          const clonedVoice = await tx.clonedVoice.create({
            data: {
              userId: user.id,
              voiceId: voiceId,
              name: validatedData.voice_name,
              accuracy: validatedData.accuracy,
              originalFileName: audioFile.name,
              fileSize: audioFile.size,
              status: 'completed',
            },
          });

          return clonedVoice;
        });

        const performanceData = timer.end();
        Logger.info('Voice cloning tamamlandı (backend polling)', {
          requestId,
          voiceId,
          clonedVoiceId: result.id,
          model: validatedData.model,
          creditsUsed: requiredCredits,
          remainingCredits: user.credits - requiredCredits,
          duration: performanceData
        });

        return NextResponse.json(
          createSuccessResponse({
            requestId: result.id,
            voice_id: voiceId,
            cloned_voice_id: result.id,
            name: validatedData.voice_name,
            model: validatedData.model,
            credits_used: requiredCredits,
            remaining_credits: user.credits - requiredCredits,
            message: 'Ses başarıyla klonlandı!'
          })
        );
      } catch (pollingError) {
        Logger.error('Backend polling hatası', { requestId, error: pollingError });
        return NextResponse.json(
          createErrorResponse('Ses klonlama işlemi sırasında hata oluştu.', 'EXTERNAL_API_ERROR', undefined, { pollingError }, requestId),
          { status: 500 }
        );
      }
    }

    // 2. Direkt Tamamlanmış mı? (status 'succeeded')
    if (responseData.status === 'succeeded' || responseData.status === 'completed') {
      const voiceId = responseData.output?.voice_id || responseData.output?.id;
      if (!voiceId) {
        Logger.error('Voice ID alınamadı - direkt success', { requestId, output: responseData.output });
        return NextResponse.json(
          createErrorResponse('Ses klonlama başarısız, voice ID alınamadı.', 'EXTERNAL_API_ERROR', undefined, responseData, requestId),
          { status: 500 }
        );
      }

      // Direkt başarılı - kredileri düş ve kaydet
      const result = await prisma.$transaction(async (tx: any) => {
        await tx.user.update({
          where: { id: user.id },
          data: { credits: { decrement: requiredCredits } }
        });

        const clonedVoice = await tx.clonedVoice.create({
          data: {
            userId: user.id,
            voiceId: voiceId,
            name: validatedData.voice_name,
            accuracy: validatedData.accuracy,
            originalFileName: audioFile.name,
            fileSize: audioFile.size,
            status: 'completed',
          },
        });

        return clonedVoice;
      });

      const performanceData = timer.end();
      Logger.info('Voice cloning tamamlandı (direkt success)', {
        requestId,
        voiceId,
        clonedVoiceId: result.id,
        model: validatedData.model,
        creditsUsed: requiredCredits,
        remainingCredits: user.credits - requiredCredits,
        duration: performanceData
      });

      return NextResponse.json(
        createSuccessResponse({
          requestId: result.id,
          voice_id: voiceId,
          cloned_voice_id: result.id,
          name: validatedData.voice_name,
          model: validatedData.model,
          credits_used: requiredCredits,
          remaining_credits: user.credits - requiredCredits,
          message: 'Ses başarıyla klonlandı!'
        })
      );
    }

    // 3. Frontend Polling İçin (status 'starting' ama polling_url yok)
    if (responseData.status === 'starting' || responseData.status === 'processing') {
      Logger.info('Frontend polling için geçici kayıt oluşturuluyor', { requestId, status: responseData.status });

      // Kredileri düş ve geçici kayıt oluştur
      const result = await prisma.$transaction(async (tx: any) => {
        await tx.user.update({
          where: { id: user.id },
          data: { credits: { decrement: requiredCredits } }
        });

        const clonedVoice = await tx.clonedVoice.create({
          data: {
            userId: user.id,
            voiceId: '', // Henüz voice ID yok
            name: validatedData.voice_name,
            accuracy: validatedData.accuracy,
            originalFileName: audioFile.name,
            fileSize: audioFile.size,
            status: 'processing', // Processing durumu
          },
        });

        return clonedVoice;
      });

      const performanceData = timer.end();
      Logger.info('Frontend polling için hazırlandı', {
        requestId,
        clonedVoiceId: result.id,
        model: validatedData.model,
        creditsUsed: requiredCredits,
        remainingCredits: user.credits - requiredCredits,
        duration: performanceData
      });

      return NextResponse.json(
        createSuccessResponse({
          requestId: result.id, // Frontend polling için requestId
          status: 'processing',
          message: 'Ses klonlama başlatıldı. İşlem durumunu takip edebilirsiniz.',
          cloned_voice_id: result.id,
          name: validatedData.voice_name,
          model: validatedData.model,
          credits_used: requiredCredits,
          remaining_credits: user.credits - requiredCredits
        })
      );
    }

    // 4. Beklenmeyen Durum
    Logger.error('Beklenmeyen API yanıtı', { requestId, status: responseData.status, response: responseData });
    return NextResponse.json(
      createErrorResponse('Beklenmeyen API yanıtı alındı.', 'EXTERNAL_API_ERROR', undefined, responseData, requestId),
      { status: 500 }
    );

  } catch (error) {
    const performanceData = timer.end();
    Logger.error('Voice cloning API hatası', {
      requestId,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined,
      duration: performanceData
    });
    
    return NextResponse.json(
      createErrorResponse('Ses klonlama sırasında hata oluştu.', 'SERVER_ERROR', undefined, undefined, requestId),
      { status: 500 }
    );
  }
}

// Kullanıcının klonlanmış seslerini getir
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clonedVoices: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse('Kullanıcı bulunamadı.', 'SERVER_ERROR', undefined, undefined, requestId),
        { status: 404 }
      );
    }

    Logger.info('Klonlanmış sesler listelendi', {
      requestId,
      userId: session.user.id,
      count: user.clonedVoices?.length || 0
    });

    return NextResponse.json(
      createSuccessResponse({
        cloned_voices: user.clonedVoices || [],
        total_count: user.clonedVoices?.length || 0,
      })
    );

  } catch (error) {
    Logger.error('Klonlanmış sesler getirme hatası', {
      requestId,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
    
    return NextResponse.json(
      createErrorResponse('Sesler alınamadı.', 'SERVER_ERROR', undefined, undefined, requestId),
      { status: 500 }
    );
  }
}

// Voice Cloning Polling Fonksiyonu
async function pollForVoiceCloningCompletion(pollingUrl: string, apiKey: string, requestId: string, maxAttempts = 40, interval = 5000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      Logger.info(`Voice cloning polling devam ediyor`, {
        requestId,
        attempt: `${attempt}/${maxAttempts}`,
        pollingUrl
      });
      
      const response = await axios.get(pollingUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const pollData = response.data;
      Logger.info(`Voice cloning polling status`, { requestId, status: pollData.status });

      // Başarılı ise result'u dön
      if (pollData.status === 'succeeded' || pollData.status === 'completed') {
        Logger.info('Voice cloning polling tamamlandı', { requestId, voiceId: pollData.output?.voice_id });
        return pollData;
      }

      // Başarısız ise error dön
      if (pollData.status === 'failed' || pollData.status === 'error') {
        Logger.error('Voice cloning polling başarısız', { requestId, status: pollData.status, error: pollData.error });
        throw new Error(`Voice cloning failed: ${pollData.error || pollData.status}`);
      }

      // Devam ediyorsa bekle
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }

    } catch (error) {
      Logger.error(`Voice cloning polling hatası`, {
        requestId,
        attempt,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  throw new Error(`Voice cloning polling timeout after ${maxAttempts} attempts`);
}
