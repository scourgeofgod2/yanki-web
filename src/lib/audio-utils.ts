import { 
  SUPPORTED_AUDIO_FORMATS, 
  AudioError, 
  AudioErrorDetails, 
  SupportedAudioFormat 
} from '@/types/audio'

/**
 * Audio format ve compatibility utilities
 */

// Tarayıcı audio format desteğini kontrol et
export const checkAudioSupport = (): Record<SupportedAudioFormat, boolean> => {
  const audio = new Audio()
  
  return SUPPORTED_AUDIO_FORMATS.reduce((support, format) => {
    const canPlay = audio.canPlayType(format)
    support[format] = canPlay === 'probably' || canPlay === 'maybe'
    return support
  }, {} as Record<SupportedAudioFormat, boolean>)
}

// URL'den audio format'ını tahmin et
export const detectAudioFormat = (url: string): SupportedAudioFormat | null => {
  const extension = url.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'mp3':
      return 'audio/mpeg'
    case 'wav':
      return 'audio/wav'
    case 'ogg':
      return 'audio/ogg'
    case 'webm':
      return 'audio/webm'
    case 'mp4':
    case 'aac':
      return 'audio/mp4'
    default:
      // Blob URL veya data URL için content-type header'ından çıkar
      if (url.startsWith('blob:') || url.startsWith('data:')) {
        return 'audio/mpeg' // Default olarak MP3 varsay
      }
      return null
  }
}

// Audio URL'inin geçerliliğini kontrol et
export const isValidAudioUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false
  
  // Blob URL, Data URL, HTTP URL kontrolü
  return url.startsWith('blob:') || 
         url.startsWith('data:audio/') || 
         url.startsWith('http://') || 
         url.startsWith('https://') ||
         url.startsWith('/')
}

// Audio duration'ı formatla (MM:SS formatında)
export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Progress yüzdesini hesapla
export const calculateProgress = (currentTime: number, duration: number): number => {
  if (!duration || isNaN(duration) || duration === 0) return 0
  if (isNaN(currentTime)) return 0
  
  return Math.max(0, Math.min(100, (currentTime / duration) * 100))
}

// Audio error'unu analiz et ve user-friendly mesaj oluştur
export const analyzeAudioError = (error: any): AudioErrorDetails => {
  if (!error) {
    return {
      type: 'PLAYBACK_ERROR',
      message: 'Bilinmeyen bir ses hatası oluştu.',
      recoverable: true
    }
  }

  // Network hataları
  if (error.code === MediaError.MEDIA_ERR_NETWORK || 
      error.message?.includes('network') ||
      error.message?.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Ses dosyası yüklenirken ağ hatası oluştu. İnternet bağlantınızı kontrol edin.',
      recoverable: true
    }
  }

  // Decode hataları
  if (error.code === MediaError.MEDIA_ERR_DECODE ||
      error.message?.includes('decode')) {
    return {
      type: 'DECODE_ERROR',
      message: 'Ses dosyası bozuk veya desteklenmeyen formatta.',
      recoverable: false
    }
  }

  // Format desteği hataları
  if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED ||
      error.message?.includes('supported') ||
      error.message?.includes('format')) {
    return {
      type: 'NOT_SUPPORTED_ERROR',
      message: 'Bu ses formatı tarayıcınızda desteklenmiyor.',
      recoverable: false
    }
  }

  // Playback hataları
  if (error.code === MediaError.MEDIA_ERR_ABORTED ||
      error.message?.includes('aborted')) {
    return {
      type: 'PLAYBACK_ERROR',
      message: 'Ses çalma işlemi iptal edildi.',
      recoverable: true
    }
  }

  // Permission hataları
  if (error.message?.includes('permission') ||
      error.message?.includes('autoplay')) {
    return {
      type: 'PERMISSION_ERROR',
      message: 'Otomatik ses çalma izni gerekiyor. Lütfen tarayıcı ayarlarını kontrol edin.',
      recoverable: true
    }
  }

  // Genel hata
  return {
    type: 'PLAYBACK_ERROR',
    message: error.message || 'Ses çalınamadı. Lütfen tekrar deneyin.',
    recoverable: true
  }
}

// Audio preload stratejisi
export const preloadAudio = (url: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    if (!isValidAudioUrl(url)) {
      reject(new Error('Geçersiz ses URL\'i'))
      return
    }

    const audio = new Audio()
    audio.preload = 'metadata'
    
    // Success event
    const onLoadedMetadata = () => {
      cleanup()
      resolve(audio)
    }
    
    // Error events
    const onError = () => {
      cleanup()
      reject(analyzeAudioError(audio.error))
    }
    
    // Cleanup function
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('abort', onError)
    }
    
    // Event listeners
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('error', onError)
    audio.addEventListener('abort', onError)
    
    // Start loading
    audio.src = url
  })
}

// Volume seviyesini güvenli aralığa normalize et
export const normalizeVolume = (volume: number): number => {
  return Math.max(0, Math.min(1, volume))
}

// Playback rate'i güvenli aralığa normalize et
export const normalizePlaybackRate = (rate: number): number => {
  return Math.max(0.25, Math.min(4, rate))
}

// Audio buffer durumunu kontrol et
export const getBufferedRanges = (audio: HTMLAudioElement): Array<{start: number, end: number}> => {
  const ranges: Array<{start: number, end: number}> = []
  
  if (audio.buffered) {
    for (let i = 0; i < audio.buffered.length; i++) {
      ranges.push({
        start: audio.buffered.start(i),
        end: audio.buffered.end(i)
      })
    }
  }
  
  return ranges
}

// Local Storage'dan audio player ayarlarını al
export const getPlayerSettings = () => {
  try {
    const settings = localStorage.getItem('yanki-audio-settings')
    return settings ? JSON.parse(settings) : {
      volume: 0.8,
      playbackRate: 1.0,
      repeatMode: 'off',
      isShuffled: false
    }
  } catch {
    return {
      volume: 0.8,
      playbackRate: 1.0,
      repeatMode: 'off',
      isShuffled: false
    }
  }
}

// Local Storage'a audio player ayarlarını kaydet
export const savePlayerSettings = (settings: any) => {
  try {
    localStorage.setItem('yanki-audio-settings', JSON.stringify(settings))
  } catch (error) {
    console.warn('Player ayarları kaydedilemedi:', error)
  }
}

// Shuffle array utility
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}