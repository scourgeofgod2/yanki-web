import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  validateDemoRequest,
  Logger,
  createErrorResponse,
  createSuccessResponse,
  generateRequestId,
  getClientIP,
  PerformanceTimer,
  withRetry,
  RateLimiter,
  type APIErrorCode
} from '@/lib/validation';

// Polling için bekleme fonksiyonu
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// Demo tracking için basit cache sistemi
const demoUsageTracking = new Map<string, { count: number, lastUsed: Date, resetTime: Date }>();

// Demo için önceden tanımlanmış sesler ve metinler (100 karakter limiti)
const DEMO_VOICES = {
  "1": {
    name: "Mert - Belgesel",
    text: "Asırlar boyunca, antik medeniyetler büyük sırlar sakladı. Bugün, bu kayıp bilgileri keşfediyoruz.",
    defaultEmotion: "neutral",
    language_boost: "Turkish ",
    pitch: 0,
    speed: 1,
    volume: 1,
    actualVoiceId: "English_expressive_narrator"
  },
  "2": {
    name: "Emel - Masalcı",
    text: "Bir varmış bir yokmuş, uzak diyarlarda güzel bir prenses varmış. Onun büyülü bir kalbi vardı.",
    defaultEmotion: "happy",
    pitch: 0,
    speed: 1,
    volume: 1,
    actualVoiceId: "moss_audio_6dc281eb-713c-11f0-a447-9613c873494c"
  },
  "3": {
    name: "Aslı - Youtube",
    text: "Merhaba arkadaşlar! Bugün sizlerle harika bir deneyimi paylaşacağım. Hazırsanız başlayalım!",
    defaultEmotion: "fluent",
    pitch: 0,
    speed: 1,
    volume: 1,
    actualVoiceId: "English_Upbeat_Woman"
  },
  "4": {
    name: "Merve - Çocuk",
    text: "Selam! Ben Merve. Bugün birlikte oyun oynayacağız ve çok eğleneceğiz, tamam mı?",
    defaultEmotion: "happy",
    pitch: 0,
    speed: 1,
    volume: 1,
    actualVoiceId: "English_PlayfulGirl"
  }
};

// Mevcut duygu seçenekleri
const EMOTION_OPTIONS = [
  'happy', 'sad', 'neutral', 'angry', 'fearful', 'calm', 'disgusted', 'surprised', 'fluent'
];

// Polling Fonksiyonu (Logger entegreli)
async function pollForMinimaxCompletion(pollingUrl: string, apiKey: string, requestId: string, maxAttempts = 60, interval = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      Logger.info(`Demo Minimax polling devam ediyor`, {
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
      Logger.info(`Demo Minimax polling status`, { requestId, status: pollData.status });

      // Başarılı ise URL'i dön
      if (pollData.status === 'succeeded' || pollData.status === 'completed') {
        const audioUrl = pollData.output?.audio_url ||
                         pollData.output?.url ||
                         (typeof pollData.output === 'string' ? pollData.output : null);
        
        if (audioUrl) {
          Logger.info('Demo Minimax polling tamamlandı', { requestId, audioUrl: typeof audioUrl === 'string' ? audioUrl.substring(0, 50) + '...' : 'object' });
          return pollData;
        } else {
          Logger.warn('Demo: Status succeeded ama output yok', { requestId, pollData });
        }
      }

      // Hata varsa fırlat
      if (pollData.status === 'failed' || pollData.status === 'error' || pollData.status === 'canceled') {
        Logger.error('Demo Minimax üretimi başarısız', { requestId, status: pollData.status, error: pollData.error || pollData.message });
        throw new Error(pollData.error || pollData.message || 'Demo üretimi başarısız oldu.');
      }

      // Devam ediyorsa bekle
      await delay(interval);

    } catch (error: any) {
      Logger.error(`Demo Minimax polling hatası`, { requestId, attempt, error: error.message });
      if (attempt === maxAttempts) throw error;
      await delay(interval);
    }
  }
  Logger.error('Demo Minimax polling zaman aşımı', { requestId, maxAttempts });
  throw new Error('Demo Zaman aşımı: Ses üretimi çok uzun sürdü.');
}

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const clientIP = getClientIP(req);
  const timer = new PerformanceTimer('DEMO_REQUEST');
  
  try {
    Logger.info('Demo isteği başlatıldı', { requestId, clientIP });

    // Rate limiting kontrolü (IP bazlı)
    const now = new Date();
    const dailyLimit = 3;
    
    let rateLimitResult = demoUsageTracking.get(clientIP);
    
    if (!rateLimitResult) {
      // İlk kullanım
      const resetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      demoUsageTracking.set(clientIP, { count: 1, lastUsed: now, resetTime });
      rateLimitResult = { count: 1, lastUsed: now, resetTime };
    } else if (now >= rateLimitResult.resetTime) {
      // 24 saat geçtiyse reset et
      const resetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      demoUsageTracking.set(clientIP, { count: 1, lastUsed: now, resetTime });
      rateLimitResult = { count: 1, lastUsed: now, resetTime };
    } else if (rateLimitResult.count >= dailyLimit) {
      // Limit aşıldı
      const resetHours = Math.ceil((rateLimitResult.resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      Logger.warn('Demo rate limit aşıldı', {
        requestId,
        clientIP,
        count: rateLimitResult.count,
        resetTime: rateLimitResult.resetTime.toISOString()
      });
      return NextResponse.json(
        createErrorResponse(
          `Demo limiti aşıldı. Kayıt olmadan günde maksimum 3 demo yapabilirsiniz. ${resetHours} saat sonra tekrar deneyin.`,
          'SERVER_ERROR',
          undefined,
          { resetTime: rateLimitResult.resetTime },
          requestId
        ),
        { status: 429 }
      );
    } else {
      // Kullanım sayısını artır
      rateLimitResult.count++;
      rateLimitResult.lastUsed = now;
      demoUsageTracking.set(clientIP, rateLimitResult);
    }

    const remaining = dailyLimit - rateLimitResult.count;

    // Request body validation
    const body = await req.json();
    const validation = validateDemoRequest(body);
    
    if (!validation.success) {
      Logger.warn('Demo validation hatası', {
        requestId,
        clientIP,
        error: validation.error,
        field: validation.field
      });
      return NextResponse.json(
        createErrorResponse(validation.error, 'VALIDATION_ERROR', validation.field, body, requestId),
        { status: 400 }
      );
    }

    const { voiceId, emotion } = validation.data;
    const customText = body.customText; // Custom text parametresi (opsiyonel)
    const language = body.language || 'Turkish'; // Demo için varsayılan dil

    // API Key kontrolü
    const apiKey = process.env.CORTEX_API_KEY;
    if (!apiKey) {
      Logger.error('API Key eksik', { requestId });
      return NextResponse.json(
        createErrorResponse('Sistem hatası.', 'SERVER_ERROR', undefined, undefined, requestId),
        { status: 500 }
      );
    }

    // Demo sesini kontrol et
    const demoVoice = DEMO_VOICES[voiceId as keyof typeof DEMO_VOICES];
    if (!demoVoice) {
      Logger.warn('Geçersiz demo voice ID', { requestId, voiceId, availableVoices: Object.keys(DEMO_VOICES) });
      return NextResponse.json(
        createErrorResponse('Geçersiz demo voice ID.', 'VALIDATION_ERROR', 'voiceId', { voiceId }, requestId),
        { status: 400 }
      );
    }

    // Emotion kontrolü
    const selectedEmotion = emotion && EMOTION_OPTIONS.includes(emotion) ? emotion : demoVoice.defaultEmotion;

    // Text seçimi - custom text varsa onu kullan, yoksa demo text
    const finalText = customText && customText.trim().length > 0 && customText.length <= 100 
      ? customText 
      : demoVoice.text;

    Logger.info('Demo isteği işleniyor', {
      requestId,
      clientIP,
      voiceName: demoVoice.name,
      textPreview: finalText.slice(0, 30),
      customText: !!customText,
      selectedEmotion,
      language,
      remaining
    });

    // Dil ayarları
    const isEnglish = language.toLowerCase() === 'english';
    const languageBoost = isEnglish ? 'English' : 'Turkish';
    const englishNormalization = isEnglish;

    // Minimax API çağrısı
    const response = await axios.post(
      "https://api.gateai.app/v1/predictions",
      {
        version: "minimax/speech-2.6-hd",
        input: {
          text: finalText,
          pitch: demoVoice.pitch,
          speed: demoVoice.speed,
          volume: demoVoice.volume,
          bitrate: 128000,
          channel: "mono",
          emotion: selectedEmotion,
          voice_id: demoVoice.actualVoiceId,
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
    );

    const responseData = response.data;
    console.log("📩 Demo İlk Yanıt Alındı. Status:", responseData.status);

    // Anında bitmişse
    if (responseData.status === 'succeeded' || responseData.status === 'completed') {
      const audioUrl = responseData.output?.audio_url || responseData.output?.url || responseData.output;
      if (audioUrl) {
        return NextResponse.json({
          success: true,
          data: responseData,
          output: audioUrl,
          voiceName: demoVoice.name,
          text: finalText,
          emotion: selectedEmotion,
          language: languageBoost,
          remaining: remaining
        });
      }
    }

    // Polling gerekli mi?
    if (responseData.urls && responseData.urls.get) {
      const pollingUrl = responseData.urls.get;
      console.log(`⏳ Demo Polling Gerekli. URL: ${pollingUrl}`);

      const finalResult = await pollForMinimaxCompletion(pollingUrl, apiKey, requestId);
      
      const finalUrl = finalResult.output?.audio_url || 
                       finalResult.output?.url || 
                       (typeof finalResult.output === 'string' ? finalResult.output : null);

      return NextResponse.json({
        success: true,
        data: finalResult,
        output: finalUrl,
        voiceName: demoVoice.name,
        text: finalText,
        emotion: selectedEmotion,
        language: languageBoost,
        remaining: remaining
      });
    }

    // Fallback
    if (responseData.output) {
       return NextResponse.json({
         success: true,
         data: responseData,
         output: typeof responseData.output === 'string' ? responseData.output : responseData.output.audio_url,
         voiceName: demoVoice.name,
         text: finalText,
         emotion: selectedEmotion,
         language: languageBoost,
         remaining: remaining
       });
    }

    throw new Error('Beklenmedik Demo API yanıt yapısı');

  } catch (error: any) {
    const duration = timer.end();
    Logger.error('Demo API kritik hata', {
      requestId,
      clientIP,
      error: error.message,
      stack: error.stack,
      duration,
      axiosError: error.response?.data
    });

    return NextResponse.json(
      createErrorResponse(
        'Demo ses üretimi başarısız.',
        'SERVER_ERROR',
        undefined,
        { details: error.response?.data || error.message },
        requestId
      ),
      { status: 500 }
    );
  }
}

// GET endpoint - Demo voice listesi ve emotion options için
export async function GET() {
  return NextResponse.json({
    success: true,
    voices: Object.entries(DEMO_VOICES).map(([id, voice]) => ({
      id,
      name: voice.name,
      text: voice.text,
      defaultEmotion: voice.defaultEmotion,
      textLength: voice.text.length
    })),
    emotions: EMOTION_OPTIONS
  });
}
