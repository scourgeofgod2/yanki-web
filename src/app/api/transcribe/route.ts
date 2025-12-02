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

// Sabitler
const TRANSCRIBE_COST_PER_MINUTE = 500; // 1 dakika = 500 kredi
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (Base64 limiti için biraz düşük tutmakta fayda var)
const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/m4a'];

// Polling fonksiyonu
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

      if (data.status === 'failed' || data.status === 'error' || data.status === 'canceled') {
        throw new Error(`Transcription failed: ${data.error || 'Unknown error'}`);
      }

      // Bekleme süresi (Exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(1.5, attempts), 5000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      attempts++;

    } catch (error) {
      Logger.warn(`Transcription polling error`, { requestId, error: error instanceof Error ? error.message : 'Unknown' });
      
      if (attempts >= maxAttempts - 1) throw error;
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
    // 1. Session Kontrol
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(createErrorResponse('Oturum açmanız gerekiyor.', 'UNAUTHORIZED', undefined, undefined, requestId), { status: 401 });
    }

    const apiKey = process.env.CORTEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(createErrorResponse('Sistem hatası (API Key).', 'SERVER_ERROR', undefined, undefined, requestId), { status: 500 });
    }

    // 2. Kullanıcı Verileri
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, credits: true }
    });

    if (!user) {
      return NextResponse.json(createErrorResponse('Kullanıcı bulunamadı.', 'UNAUTHORIZED', undefined, undefined, requestId), { status: 401 });
    }

    // 3. Form Data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'auto'; // "None" or specific language code
    
    // Dosya Kontrolleri
    if (!audioFile) return NextResponse.json(createErrorResponse('Ses dosyası gerekli.', 'VALIDATION_ERROR', 'audio', undefined, requestId), { status: 400 });
    if (audioFile.size > MAX_FILE_SIZE) return NextResponse.json(createErrorResponse(`Dosya çok büyük. Maksimum: ${MAX_FILE_SIZE / 1024 / 1024}MB`, 'VALIDATION_ERROR', 'audio', undefined, requestId), { status: 400 });
    if (!ALLOWED_AUDIO_TYPES.includes(audioFile.type)) return NextResponse.json(createErrorResponse('Desteklenmeyen format.', 'VALIDATION_ERROR', 'audio', undefined, requestId), { status: 400 });

    // Tahmini Kredi Kontrolü (Dosya boyutundan kaba bir tahmin - 1MB ~ 1 dakika gibi varsayalım garanti olsun diye)
    // Bu sadece işlemi başlatmak için bir ön kontrol.
    const estimatedMinutes = Math.max(1, Math.ceil(audioFile.size / (1024 * 1024))); 
    const minRequiredCredits = TRANSCRIBE_COST_PER_MINUTE; // En az 1 dakika parası olsun

    if (user.credits < minRequiredCredits) {
      return NextResponse.json({ success: false, error: `Yetersiz kredi. En az ${minRequiredCredits} krediniz olmalı.`, availableCredits: user.credits }, { status: 402 });
    }

    // 4. Dosyayı Base64'e Çevir
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const mimeType = audioFile.type || 'audio/wav';
    const dataUri = `data:${mimeType};base64,${audioBase64}`;

    Logger.info('Transcription API isteği başlatılıyor', { requestId, fileSize: audioFile.size });

    // 5. API İsteği (Incredibly Fast Whisper)
    const response = await withRetry(
      () => axios.post(
        "https://api.gateai.app/v1/predictions",
        {
          version: "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
          input: {
            task: "transcribe",
            audio: dataUri,
            language: language === 'auto' ? "None" : language,
            timestamp: "chunk", // chunk bazlı timestamp istiyoruz
            batch_size: 64,
            diarise_audio: false
          }
        },
        {
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          timeout: 60000 
        }
      ),
      3, 1000
    );

    const responseData = response.data;
    Logger.info("Transcription API ilk yanıt", { requestId, status: responseData.status });

    let finalResult = responseData;
    const pollingUrl = responseData.urls?.get || responseData.polling_url;

    // Polling Başlat
    if (pollingUrl && (responseData.status === 'starting' || responseData.status === 'processing')) {
      finalResult = await pollForTranscriptionCompletion(pollingUrl, apiKey, requestId);
    }

    // 6. Sonuç İşleme
    if (finalResult.status !== 'succeeded' && finalResult.status !== 'completed') {
       throw new Error(`API Hatası: ${finalResult.error}`);
    }

    const output = finalResult.output;
    const transcriptionText = output?.text;
    const chunks = output?.chunks || [];

    if (!transcriptionText) {
       throw new Error('Deşifre metni boş döndü.');
    }

    // Gerçek Süreyi Hesapla (Chunks içindeki son timestamp'in bitiş süresi)
    let actualDurationSeconds = 0;
    if (chunks && chunks.length > 0) {
        // timestamp: [start, end]
        const lastChunk = chunks[chunks.length - 1];
        if (lastChunk.timestamp && lastChunk.timestamp.length === 2) {
            actualDurationSeconds = lastChunk.timestamp[1];
        }
    }

    // Eğer chunklardan süre alamazsak dosya boyutundan tahmini bir süre uydur (Fallback)
    if (actualDurationSeconds === 0) {
        // 1MB mp3 approx 1 min varsayımı
        actualDurationSeconds = (audioFile.size / (1024 * 1024)) * 60;
    }

    const actualDurationMinutes = Math.max(0.1, actualDurationSeconds / 60); // Minimum 6 saniye ücreti alalım
    const finalCredits = Math.ceil(actualDurationMinutes * TRANSCRIBE_COST_PER_MINUTE);

    // Kredi Düşümü
    await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: finalCredits } }
    });

    const performanceData = timer.end();
    Logger.info('Transcription tamamlandı', {
      requestId,
      actualDurationSeconds,
      finalCredits,
      duration: performanceData
    });

    return NextResponse.json(createSuccessResponse({
        transcription: transcriptionText,
        chunks: chunks,
        duration_minutes: parseFloat(actualDurationMinutes.toFixed(2)),
        credits_used: finalCredits,
        remaining_credits: user.credits - finalCredits,
        language: language
    }));

  } catch (error: any) {
    Logger.error('Transcription API hatası', { requestId, error: error.message });
    return NextResponse.json(createErrorResponse('Deşifre işlemi başarısız.', 'SERVER_ERROR', undefined, error.message, requestId), { status: 500 });
  }
}