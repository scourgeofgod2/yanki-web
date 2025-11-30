import { NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import {
  validateTTSRequest,
  Logger,
  createErrorResponse,
  createSuccessResponse,
  generateRequestId,
  getClientIP,
  PerformanceTimer,
  withRetry,
  type APIErrorCode
} from '@/lib/validation';

// Polling için bekleme fonksiyonu
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Polling Fonksiyonu (Durum Kontrolü)
async function pollForMinimaxCompletion(pollingUrl: string, apiKey: string, requestId: string, maxAttempts = 60, interval = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      Logger.info(`Minimax polling devam ediyor`, {
        requestId,
        attempt: `${attempt}/${maxAttempts}`,
        pollingUrl
      });
      
      const response = await axios.get(pollingUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const pollData = response.data;
      Logger.info(`Minimax polling status`, { requestId, status: pollData.status });

      // Başarılı ise URL'i dön
      if (pollData.status === 'succeeded' || pollData.status === 'completed') {
        const audioUrl = pollData.output?.audio_url ||
                         pollData.output?.url ||
                         (typeof pollData.output === 'string' ? pollData.output : null);
        
        if (audioUrl) {
          Logger.info('Minimax polling tamamlandı', { requestId, audioUrl: typeof audioUrl === 'string' ? audioUrl.substring(0, 50) + '...' : 'object' });
          return pollData; // Tüm datayı dönüyoruz, içinde output var
        } else {
          Logger.warn('Status succeeded ama output yok', { requestId, pollData });
        }
      }

      // Hata varsa fırlat
      if (pollData.status === 'failed' || pollData.status === 'error' || pollData.status === 'canceled') {
        Logger.error('Minimax üretimi başarısız', { requestId, status: pollData.status, error: pollData.error || pollData.message });
        throw new Error(pollData.error || pollData.message || 'Minimax üretimi başarısız oldu.');
      }

      // Devam ediyorsa bekle
      await delay(interval);

    } catch (error: any) {
      Logger.error(`Minimax polling hatası`, { requestId, attempt, error: error.message });
      // Son denemeyse hatayı fırlat, yoksa devam et
      if (attempt === maxAttempts) throw error;
      await delay(interval);
    }
  }
  Logger.error('Minimax polling zaman aşımı', { requestId, maxAttempts });
  throw new Error('Zaman aşımı: Ses üretimi çok uzun sürdü.');
}

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const clientIP = getClientIP(req);
  const timer = new PerformanceTimer('TTS_REQUEST');
  
  try {
    Logger.info('TTS isteği başlatıldı', { requestId, clientIP });

    // Session kontrolü
    const session = await auth();
    if (!session || !session.user?.id) {
      Logger.warn('Yetkisiz TTS isteği', { requestId, clientIP });
      return NextResponse.json(
        createErrorResponse('Oturum gerekli.', 'UNAUTHORIZED', undefined, undefined, requestId),
        { status: 401 }
      );
    }

    // Request body validation
    const body = await req.json();
    const validation = validateTTSRequest(body);
    
    if (!validation.success) {
      Logger.warn('TTS validation hatası', {
        requestId,
        userId: session.user.id,
        error: validation.error,
        field: validation.field
      });
      return NextResponse.json(
        createErrorResponse(validation.error, 'VALIDATION_ERROR', validation.field, body, requestId),
        { status: 400 }
      );
    }

    const { text, voiceId, emotion, language, pitch, speed, volume, model } = validation.data;

    // API Key kontrolü
    const apiKey = process.env.CORTEX_API_KEY;
    if (!apiKey) {
      Logger.error('API Key eksik', { requestId });
      return NextResponse.json(
        createErrorResponse('Sistem hatası.', 'SERVER_ERROR', undefined, undefined, requestId),
        { status: 500 }
      );
    }

    // Model seçimi ve kredi hesaplama
    const selectedModel = model || 'speech-2.6-hd'; // Default HD model
    const baseCharacterCount = text.length;
    
    // Turbo model %40 daha ucuz (0.6x çarpan)
    const creditMultiplier = selectedModel === 'speech-2.6-turbo' ? 0.6 : 1.0;
    const requiredCredits = Math.ceil(baseCharacterCount * creditMultiplier);
    
    Logger.info('Model ve kredi hesaplaması', {
      requestId,
      selectedModel,
      baseCharacterCount,
      creditMultiplier,
      requiredCredits
    });
    
    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      Logger.error('Kullanıcı bulunamadı', { requestId, userId: session.user.id });
      return NextResponse.json(
        createErrorResponse('Kullanıcı bulunamadı.', 'SERVER_ERROR', undefined, undefined, requestId),
        { status: 404 }
      );
    }

    // Kredi kontrolü
    if (user.credits < requiredCredits) {
      Logger.warn('Yetersiz kredi', {
        requestId,
        userId: session.user.id,
        requiredCredits,
        availableCredits: user.credits,
        model: selectedModel
      });
      return NextResponse.json({
        success: false,
        error: `Yetersiz kredi. ${requiredCredits} kredi gerekiyor, ${user.credits} krediniz var.`,
        needsMoreCredits: true,
        requiredCredits,
        availableCredits: user.credits,
        requestId
      }, { status: 402 });
    }

    // Dil ayarları
    const languageLower = (language || 'Turkish').toLowerCase();
    const isEnglish = languageLower === 'english';
    const languageBoost = isEnglish ? 'English' : 'Turkish';
    const englishNormalization = isEnglish;

    Logger.info('TTS API isteği başlatılıyor', {
      requestId,
      userId: session.user.id,
      textPreview: text.slice(0, 50),
      characterCount: baseCharacterCount,
      requiredCredits,
      selectedModel,
      voiceId,
      emotion,
      language: languageBoost,
      credits: user.credits
    });
    
    const response = await withRetry(
      () => axios.post(
        "https://api.gateai.app/v1/predictions",
        {
          version: `minimax/${selectedModel}`,
          input: {
            text: text,
            pitch: pitch,
            speed: speed,
            volume: volume,
            bitrate: 128000,
            channel: "mono",
            emotion: emotion,
            voice_id: voiceId,
            sample_rate: 32000,
            language_boost: languageBoost,
            english_normalization: englishNormalization
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      ),
      3, // 3 deneme
      1000 // 1 saniye bekleme
    );

    const responseData = response.data;
    Logger.info("Minimax API ilk yanıt alındı", { requestId, status: responseData.status });

    // 2. Anında bitmişse (Nadir ama olabilir)
    if (responseData.status === 'succeeded' || responseData.status === 'completed') {
      const audioUrl = responseData.output?.audio_url || responseData.output?.url || responseData.output;
      if (audioUrl) {
        // Kredileri düş ve history'ye kaydet
        await Promise.all([
          // Kullanıcı kredilerini düşür
          prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { decrement: requiredCredits } }
          }),
          // History'ye kaydet
          prisma.history.create({
            data: {
              userId: session.user.id,
              text: text,
              voiceId: voiceId,
              emotion: emotion,
              language: languageBoost,
              characterCount: baseCharacterCount,
              audioUrl: typeof audioUrl === 'string' ? audioUrl : audioUrl.toString(),
              status: 'completed'
            }
          })
        ]);

        return NextResponse.json({
          success: true,
          data: responseData,
          output: audioUrl,
          audioUrl: audioUrl, // Compatibility için eklendi
          emotion: emotion,
          language: languageBoost,
          model: selectedModel,
          remainingCredits: user.credits - requiredCredits
        });
      }
    }

    // 3. Polling Gerekli mi? (urls.get var mı?)
    if (responseData.urls && responseData.urls.get) {
      const pollingUrl = responseData.urls.get;
      console.log(`⏳ Polling Gerekli. URL: ${pollingUrl}`);

      // Polling fonksiyonunu başlat
      const finalResult = await pollForMinimaxCompletion(pollingUrl, apiKey, requestId);
      
      // Sonucu formatla
      const finalUrl = finalResult.output?.audio_url ||
                       finalResult.output?.url ||
                       (typeof finalResult.output === 'string' ? finalResult.output : null);

      // Kredileri düş ve history'ye kaydet
      await Promise.all([
        // Kullanıcı kredilerini düşür
        prisma.user.update({
          where: { id: session.user.id },
          data: { credits: { decrement: requiredCredits } }
        }),
        // History'ye kaydet
        prisma.history.create({
          data: {
            userId: session.user.id,
            text: text,
            voiceId: voiceId,
            emotion: emotion,
            language: languageBoost,
            characterCount: baseCharacterCount,
            audioUrl: typeof finalUrl === 'string' ? finalUrl : finalUrl?.toString() || '',
            status: 'completed'
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        data: finalResult,
        output: finalUrl,
        audioUrl: finalUrl, // Compatibility için eklendi
        emotion: emotion,
        language: languageBoost,
        model: selectedModel,
        remainingCredits: user.credits - requiredCredits
      });
    }

    // 4. Fallback (Eğer output direkt geldiyse ama status farklıysa)
    if (responseData.output) {
       const fallbackUrl = typeof responseData.output === 'string' ? responseData.output : responseData.output.audio_url;
       
       // Kredileri düş ve history'ye kaydet
       await Promise.all([
         // Kullanıcı kredilerini düşür
         prisma.user.update({
           where: { id: session.user.id },
           data: { credits: { decrement: requiredCredits } }
         }),
         // History'ye kaydet
         prisma.history.create({
           data: {
             userId: session.user.id,
             text: text,
             voiceId: voiceId,
             emotion: emotion,
             language: languageBoost,
             characterCount: baseCharacterCount,
             audioUrl: fallbackUrl || '',
             status: 'completed'
           }
         })
       ]);

       return NextResponse.json({
         success: true,
         data: responseData,
         output: fallbackUrl,
         audioUrl: fallbackUrl, // Compatibility için eklendi
         emotion: emotion,
         language: languageBoost,
         model: selectedModel,
         remainingCredits: user.credits - requiredCredits
       });
    }

    throw new Error('Beklenmedik API yanıt yapısı');

  } catch (error: any) {
    const duration = timer.end();
    Logger.error('TTS API kritik hata', {
      requestId,
      error: error.message,
      stack: error.stack,
      duration,
      axiosError: error.response?.data
    });

    return NextResponse.json(
      createErrorResponse(
        'Ses üretimi başarısız.',
        'SERVER_ERROR',
        undefined,
        { details: error.response?.data || error.message },
        requestId
      ),
      { status: 500 }
    );
  }
}