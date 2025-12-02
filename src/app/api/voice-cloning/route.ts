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
const BASE_VOICE_CLONING_COST = 50; 
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/mp4'];

// Polling için bekleme fonksiyonu
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getCloningCostMultiplier(model: VoiceCloningModel): number {
  if (model.includes('turbo')) return 0.6;
  return 1.0;
}

// Voice Cloning Polling Fonksiyonu
async function pollForVoiceCloningCompletion(pollingUrl: string, apiKey: string, requestId: string, maxAttempts = 60, interval = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(pollingUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const pollData = response.data;
      Logger.info(`Voice cloning polling status`, { requestId, status: pollData.status, attempt: `${attempt}/${maxAttempts}` });

      // BAŞARILI
      if (pollData.status === 'succeeded' || pollData.status === 'completed') {
        const voiceId = pollData.output?.voice_id;
        
        if (voiceId) {
            Logger.info('Voice cloning polling tamamlandı', { requestId, voiceId });
            return pollData;
        } else {
            Logger.warn('Status succeeded ama voice_id output içinde yok', { requestId, output: pollData.output });
            return pollData;
        }
      }

      // HATA
      if (pollData.status === 'failed' || pollData.status === 'error' || pollData.status === 'canceled') {
        throw new Error(pollData.error || `Voice cloning failed with status: ${pollData.status}`);
      }

      // DEVAM
      await delay(interval);

    } catch (error: any) {
      Logger.error(`Voice cloning polling hatası`, { requestId, attempt, error: error.message });
      if (attempt === maxAttempts) throw error;
      await delay(interval);
    }
  }
  throw new Error(`Voice cloning polling timeout after ${maxAttempts} attempts`);
}

// ----------------------------------------------------------------------
// ✅ EKLENEN KISIM: GET METODU (Listeleme İçin)
// ----------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(createErrorResponse('Oturum açmanız gerekiyor.', 'UNAUTHORIZED', undefined, undefined, requestId), { status: 401 });
    }

    // Kullanıcıyı ve klonlanmış seslerini çek
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clonedVoices: {
          orderBy: { createdAt: 'desc' } // En yeniden eskiye sırala
        }
      }
    });

    if (!user) {
      return NextResponse.json(createErrorResponse('Kullanıcı bulunamadı.', 'SERVER_ERROR', undefined, undefined, requestId), { status: 404 });
    }

    // Başarılı yanıt dön
    return NextResponse.json(
      createSuccessResponse({
        cloned_voices: user.clonedVoices || [],
        total_count: user.clonedVoices?.length || 0,
      })
    );

  } catch (error: any) {
    Logger.error('Klonlanmış sesler getirme hatası', { requestId, error: error.message });
    return NextResponse.json(createErrorResponse('Sesler alınamadı.', 'SERVER_ERROR', undefined, error.message, requestId), { status: 500 });
  }
}

// ----------------------------------------------------------------------
// POST METODU (Senin Gönderdiğin Çalışan Kod)
// ----------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const timer = new PerformanceTimer('voice-cloning-api');
  const clientIP = getClientIP(request);
  
  try {
    // 1. Session Kontrol
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(createErrorResponse('Oturum açmanız gerekiyor.', 'UNAUTHORIZED', undefined, undefined, requestId), { status: 401 });
    }

    const apiKey = process.env.CORTEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(createErrorResponse('Sistem hatası.', 'SERVER_ERROR', undefined, undefined, requestId), { status: 500 });
    }

    // 2. Kullanıcı Verileri
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { clonedVoices: true }
    });

    if (!user) {
      return NextResponse.json(createErrorResponse('Kullanıcı bulunamadı.', 'SERVER_ERROR', undefined, undefined, requestId), { status: 404 });
    }

    // 3. Limit Kontrolü
    let voiceCloningLimit = 1;
    if (user.plan === 'starter') voiceCloningLimit = 3;
    else if (user.plan === 'popular') voiceCloningLimit = 5;
    else if (user.plan === 'enterprise') voiceCloningLimit = 10;
    
    if ((user.clonedVoices?.length || 0) >= voiceCloningLimit) {
      return NextResponse.json(createErrorResponse(`Ses klonlama limitiniz aşıldı.`, 'VALIDATION_ERROR', undefined, undefined, requestId), { status: 403 });
    }

    // 4. Form Data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const voiceName = formData.get('voice_name') as string;
    const accuracy = parseFloat(formData.get('accuracy') as string || '0.7');
    const model = formData.get('model') as VoiceCloningModel || 'speech-2.6-hd'; // Default 2.6
    const noiseReduction = formData.get('noise_reduction') === 'true';
    const volumeNormalization = formData.get('volume_normalization') === 'true';

    // 5. Validasyon
    const validationResult = validateVoiceCloningRequest({
      voice_name: voiceName, accuracy, model, noise_reduction: noiseReduction, volume_normalization: volumeNormalization
    });

    if (!validationResult.success) {
      return NextResponse.json(createErrorResponse(validationResult.error, 'VALIDATION_ERROR', validationResult.field, undefined, requestId), { status: 400 });
    }

    const validatedData = validationResult.data;

    // Kredi Kontrolü
    const costMultiplier = getCloningCostMultiplier(validatedData.model);
    const requiredCredits = Math.ceil(BASE_VOICE_CLONING_COST * costMultiplier);
    
    if (user.credits < requiredCredits) {
      return NextResponse.json({ success: false, error: `Yetersiz kredi.`, requiredCredits, availableCredits: user.credits }, { status: 402 });
    }

    // Dosya İşleme
    if (!audioFile) return NextResponse.json(createErrorResponse('Ses dosyası gerekli.', 'VALIDATION_ERROR', 'audio', undefined, requestId), { status: 400 });
    if (audioFile.size > MAX_FILE_SIZE) return NextResponse.json(createErrorResponse('Dosya boyutu çok büyük.', 'VALIDATION_ERROR', 'audio', undefined, requestId), { status: 400 });

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const mimeType = audioFile.type || 'audio/wav';
    const voiceFileUrl = `data:${mimeType};base64,${audioBase64}`;

    // 6. API İsteği
    const apiModel = validatedData.model; 

    Logger.info('Voice cloning API isteği', { requestId, apiModel });
    
    const response = await withRetry(
      () => axios.post(
        "https://api.gateai.app/v1/predictions",
        {
          version: "minimax/voice-cloning",
          input: {
            model: apiModel,
            accuracy: validatedData.accuracy,
            voice_file: voiceFileUrl,
            need_noise_reduction: validatedData.noise_reduction,
            need_volume_normalization: validatedData.volume_normalization
          }
        },
        {
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          timeout: 120000
        }
      ),
      3, 2000
    );

    const responseData = response.data;
    Logger.info("Voice cloning API yanıtı", { requestId, status: responseData.status });

    // --- SENARYO 1: Backend Polling ---
    const pollingUrl = responseData.urls?.get || responseData.polling_url;

    if (pollingUrl && (responseData.status === 'starting' || responseData.status === 'processing')) {
      Logger.info('Backend polling başlatılıyor', { requestId, pollingUrl });
      
      try {
        const finalResult = await pollForVoiceCloningCompletion(pollingUrl, apiKey, requestId);
        
        // Voice ID kontrolü
        const voiceId = finalResult.output?.voice_id;

        if (!voiceId) {
            Logger.error('Voice ID bulunamadı', { output: finalResult.output });
            throw new Error('Ses klonlandı ancak Voice ID alınamadı.');
        }

        // DB Transaction (Kredi düş ve kaydet)
        const result = await prisma.$transaction(async (tx: any) => {
          await tx.user.update({
            where: { id: user.id },
            data: { credits: { decrement: requiredCredits } }
          });

          return await tx.clonedVoice.create({
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
        });

        return NextResponse.json(createSuccessResponse({
          requestId: result.id,
          voice_id: voiceId,
          cloned_voice_id: result.id,
          message: 'Ses başarıyla klonlandı!',
          remaining_credits: user.credits - requiredCredits
        }));

      } catch (pollingError: any) {
        Logger.error('Backend polling hatası', { requestId, error: pollingError.message });
        return NextResponse.json(createErrorResponse('Ses işlenirken hata oluştu.', 'EXTERNAL_API_ERROR', undefined, { detail: pollingError.message }, requestId), { status: 500 });
      }
    }

    // --- SENARYO 2: Direkt Başarılı ---
    if (responseData.status === 'succeeded' || responseData.status === 'completed') {
       const voiceId = responseData.output?.voice_id;
       if (voiceId) {
         const result = await prisma.$transaction(async (tx: any) => {
            await tx.user.update({ where: { id: user.id }, data: { credits: { decrement: requiredCredits } } });
            return await tx.clonedVoice.create({
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
         });
         return NextResponse.json(createSuccessResponse({ voice_id: voiceId, cloned_voice_id: result.id, message: 'Ses başarıyla klonlandı!' }));
       }
    }

    // --- SENARYO 3: Frontend Polling (Fallback) ---
    if (responseData.status === 'starting' || responseData.status === 'processing') {
       Logger.warn('Polling URL yok ama status processing, frontend pollinge geçiliyor', { requestId });
       
       const result = await prisma.$transaction(async (tx: any) => {
        await tx.user.update({ where: { id: user.id }, data: { credits: { decrement: requiredCredits } } });
        return await tx.clonedVoice.create({
          data: {
            userId: user.id,
            voiceId: '',
            name: validatedData.voice_name,
            accuracy: validatedData.accuracy,
            originalFileName: audioFile.name,
            fileSize: audioFile.size,
            status: 'processing',
          },
        });
      });

      return NextResponse.json(createSuccessResponse({
        requestId: result.id,
        status: 'processing',
        message: 'İşlem başlatıldı.',
        cloned_voice_id: result.id
      }));
    }

    throw new Error('Beklenmeyen API yanıt yapısı: ' + JSON.stringify(responseData));

  } catch (error: any) {
    Logger.error('Voice cloning genel hata', { requestId, error: error.message });
    return NextResponse.json(createErrorResponse('İşlem sırasında sunucu hatası.', 'SERVER_ERROR', undefined, error.message, requestId), { status: 500 });
  }
}