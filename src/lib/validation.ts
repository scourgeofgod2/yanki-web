// Ses ID'lerini tanımla (voices.ts ile uyumlu)
export const VALID_VOICE_IDS = [
  'Spanish_SophisticatedLady',
  'English_Trustworth_Man',
  'English_CaptivatingStoryteller',
  'English_ManWithDeepVoice',
  'English_Graceful_Lady',
  'English_Insightful_Speaker',
  'English_Whispering_girl_v3',
  'English_patient_man_v1',
  'English_Persuasive_Man',
  'English_MatureBoss',
  'English_MaturePartner',
  'English_Explanatory_Man',
  'moss_audio_737a299c-734a-11f0-918f-4e0486034804',
  'moss_audio_c12a59b9-7115-11f0-a447-9613c873494c',
  'English_CalmWoman',
  'English_magnetic_voiced_man',
  'English_UpsetGirl',
  'English_captivating_female1',
  'English_PlayfulGirl',
  'English_Gentle-voiced_man',
  'English_Upbeat_Woman',
  'English_ReservedYoungMan',
  'moss_audio_6dc281eb-713c-11f0-a447-9613c873494c',
  'English_Diligent_Man',
  'English_expressive_narrator',
  'English_radiant_girl',
  'moss_audio_a0d611da-737c-11f0-ad20-f2bc95e89150',
  'moss_audio_570551b1-735c-11f0-b236-0adeeecad052',
  'English_compelling_lady1',
  'moss_audio_4f4172f4-737b-11f0-9540-7ef9b4b62566'
] as const;

// Duyguları tanımla
export const VALID_EMOTIONS = [
  'happy', 'sad', 'neutral', 'angry',
  'fearful', 'calm', 'disgusted', 'surprised', 'fluent'
] as const;

// Dilleri tanımla
export const VALID_LANGUAGES = [
  'Turkish', 'English', 'Spanish', 'German', 'French'
] as const;

// TTS Modellerini tanımla
export const VALID_TTS_MODELS = [
  'speech-2.6-hd', 'speech-2.6-turbo'
] as const;

// Voice Cloning Modellerini tanımla
export const VALID_VOICE_CLONING_MODELS = [
  'speech-2.6-hd', 'speech-2.6-hd-turbo'
] as const;

// Type definitions
export type VoiceId = typeof VALID_VOICE_IDS[number];
export type Emotion = typeof VALID_EMOTIONS[number];
export type Language = typeof VALID_LANGUAGES[number];
export type TTSModel = typeof VALID_TTS_MODELS[number];
export type VoiceCloningModel = typeof VALID_VOICE_CLONING_MODELS[number];

// TTS Request Interface
export interface TTSRequest {
  text: string;
  voiceId: VoiceId;
  emotion?: Emotion;
  language?: Language;
  pitch?: number;
  speed?: number;
  volume?: number;
  model?: TTSModel;
}

// Demo Request Interface
export interface DemoRequest {
  text: string;
  voiceId: VoiceId;
  emotion?: Emotion;
}

// User Registration Interface
export interface UserRegistrationRequest {
  name: string;
  email: string;
  password: string;
}

// User Login Interface
export interface UserLoginRequest {
  email: string;
  password: string;
}

// Favorite Management Interface
export interface FavoriteRequest {
  voiceId: VoiceId;
  action: 'add' | 'remove';
}

// Voice Cloning Request Interface
export interface VoiceCloningRequest {
  voice_name: string;
  accuracy: number; // 0.1 - 0.9 arası
  model: VoiceCloningModel;
  noise_reduction: boolean;
  volume_normalization: boolean;
}

// Validation Functions
export function validateTTSRequest(data: any): { success: true; data: TTSRequest } | { success: false; error: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Geçersiz istek formatı.' };
  }

  // Text validation
  if (!data.text || typeof data.text !== 'string') {
    return { success: false, error: 'Metin boş olamaz.', field: 'text' };
  }
  
  const text = data.text.trim();
  if (text.length === 0) {
    return { success: false, error: 'Metin sadece boşluk karakterlerinden oluşamaz.', field: 'text' };
  }
  
  if (text.length > 5000) {
    return { success: false, error: 'Metin 5000 karakterden uzun olamaz.', field: 'text' };
  }

  // Voice ID validation
  if (!data.voiceId || typeof data.voiceId !== 'string') {
    return { success: false, error: 'Ses ID boş olamaz.', field: 'voiceId' };
  }
  
  if (!VALID_VOICE_IDS.includes(data.voiceId as VoiceId)) {
    return { success: false, error: `Geçersiz ses ID. Geçerli sesler: ${VALID_VOICE_IDS.join(', ')}`, field: 'voiceId' };
  }

  // Emotion validation (optional)
  const emotion = data.emotion || 'happy';
  if (typeof emotion !== 'string' || !VALID_EMOTIONS.includes(emotion as Emotion)) {
    return { success: false, error: `Geçersiz duygu. Geçerli duygular: ${VALID_EMOTIONS.join(', ')}`, field: 'emotion' };
  }

  // Language validation (optional)
  const language = data.language || 'Turkish';
  if (typeof language !== 'string' || !VALID_LANGUAGES.includes(language as Language)) {
    return { success: false, error: `Geçersiz dil. Geçerli diller: ${VALID_LANGUAGES.join(', ')}`, field: 'language' };
  }

  // Model validation (optional)
  const model = data.model || 'speech-2.6-hd';
  if (typeof model !== 'string' || !VALID_TTS_MODELS.includes(model as TTSModel)) {
    return { success: false, error: `Geçersiz model. Geçerli modeller: ${VALID_TTS_MODELS.join(', ')}`, field: 'model' };
  }

  // Pitch validation (optional)
  const pitch = data.pitch !== undefined ? Number(data.pitch) : 0;
  if (isNaN(pitch) || pitch < -12 || pitch > 12) {
    return { success: false, error: 'Perde -12 ile 12 arasında olmalıdır.', field: 'pitch' };
  }

  // Speed validation (optional)
  const speed = data.speed !== undefined ? Number(data.speed) : 1;
  if (isNaN(speed) || speed < 0.5 || speed > 2.0) {
    return { success: false, error: 'Hız 0.5 ile 2.0 arasında olmalıdır.', field: 'speed' };
  }

  // Volume validation (optional)
  const volume = data.volume !== undefined ? Number(data.volume) : 1;
  if (isNaN(volume) || volume < 0 || volume > 10) {
    return { success: false, error: 'Ses seviyesi 0 ile 10 arasında olmalıdır.', field: 'volume' };
  }

  return {
    success: true,
    data: {
      text,
      voiceId: data.voiceId as VoiceId,
      emotion: emotion as Emotion,
      language: language as Language,
      model: model as TTSModel,
      pitch,
      speed,
      volume
    }
  };
}

export function validateDemoRequest(data: any): { success: true; data: DemoRequest } | { success: false; error: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Geçersiz istek formatı.' };
  }

  // Text validation
  if (!data.text || typeof data.text !== 'string') {
    return { success: false, error: 'Metin boş olamaz.', field: 'text' };
  }
  
  const text = data.text.trim();
  if (text.length === 0) {
    return { success: false, error: 'Metin sadece boşluk karakterlerinden oluşamaz.', field: 'text' };
  }
  
  if (text.length > 200) {
    return { success: false, error: 'Demo için metin 200 karakterden uzun olamaz.', field: 'text' };
  }

  // Voice ID validation
  if (!data.voiceId || typeof data.voiceId !== 'string') {
    return { success: false, error: 'Ses ID boş olamaz.', field: 'voiceId' };
  }
  
  if (!VALID_VOICE_IDS.includes(data.voiceId as VoiceId)) {
    return { success: false, error: 'Geçersiz ses ID.', field: 'voiceId' };
  }

  // Emotion validation (optional)
  const emotion = data.emotion || 'happy';
  if (typeof emotion !== 'string' || !VALID_EMOTIONS.includes(emotion as Emotion)) {
    return { success: false, error: 'Geçersiz duygu.', field: 'emotion' };
  }

  return {
    success: true,
    data: {
      text,
      voiceId: data.voiceId as VoiceId,
      emotion: emotion as Emotion
    }
  };
}

export function validateUserRegistration(data: any): { success: true; data: UserRegistrationRequest } | { success: false; error: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Geçersiz istek formatı.' };
  }

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    return { success: false, error: 'İsim boş olamaz.', field: 'name' };
  }
  
  const name = data.name.trim();
  if (name.length < 2) {
    return { success: false, error: 'İsim en az 2 karakter olmalıdır.', field: 'name' };
  }
  
  if (name.length > 50) {
    return { success: false, error: 'İsim 50 karakterden uzun olamaz.', field: 'name' };
  }
  
  if (!/^[a-zA-ZüğıöşçÜĞIÖŞÇ\s]+$/.test(name)) {
    return { success: false, error: 'İsim sadece harflerden oluşmalıdır.', field: 'name' };
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    return { success: false, error: 'Email boş olamaz.', field: 'email' };
  }
  
  const email = data.email.toLowerCase().trim();
  if (email.length > 100) {
    return { success: false, error: 'Email 100 karakterden uzun olamaz.', field: 'email' };
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Geçerli bir email adresi girin.', field: 'email' };
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    return { success: false, error: 'Şifre boş olamaz.', field: 'password' };
  }
  
  if (data.password.length < 6) {
    return { success: false, error: 'Şifre en az 6 karakter olmalıdır.', field: 'password' };
  }
  
  if (data.password.length > 100) {
    return { success: false, error: 'Şifre 100 karakterden uzun olamaz.', field: 'password' };
  }
  
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    return { success: false, error: 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir.', field: 'password' };
  }

  return {
    success: true,
    data: {
      name,
      email,
      password: data.password
    }
  };
}

export function validateUserLogin(data: any): { success: true; data: UserLoginRequest } | { success: false; error: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Geçersiz istek formatı.' };
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    return { success: false, error: 'Email boş olamaz.', field: 'email' };
  }
  
  const email = data.email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Geçerli bir email adresi girin.', field: 'email' };
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    return { success: false, error: 'Şifre boş olamaz.', field: 'password' };
  }

  return {
    success: true,
    data: {
      email,
      password: data.password
    }
  };
}

export function validateFavoriteRequest(data: any): { success: true; data: FavoriteRequest } | { success: false; error: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Geçersiz istek formatı.' };
  }

  // Voice ID validation
  if (!data.voiceId || typeof data.voiceId !== 'string') {
    return { success: false, error: 'Ses ID boş olamaz.', field: 'voiceId' };
  }
  
  if (!VALID_VOICE_IDS.includes(data.voiceId as VoiceId)) {
    return { success: false, error: 'Geçersiz ses ID.', field: 'voiceId' };
  }

  // Action validation
  if (!data.action || typeof data.action !== 'string') {
    return { success: false, error: 'İşlem türü boş olamaz.', field: 'action' };
  }
  
  if (data.action !== 'add' && data.action !== 'remove') {
    return { success: false, error: 'İşlem türü "add" veya "remove" olmalıdır.', field: 'action' };
  }

  return {
    success: true,
    data: {
      voiceId: data.voiceId as VoiceId,
      action: data.action as 'add' | 'remove'
    }
  };
}

// Error Response Type
export interface ValidationError {
  success: false;
  error: string;
  field?: string;
  code: 'VALIDATION_ERROR' | 'RATE_LIMIT' | 'INSUFFICIENT_CREDITS' | 'UNAUTHORIZED' | 'SERVER_ERROR';
}

// Success Response Type
export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
}

// Rate Limiting Helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Eski istekleri temizle
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}


// Text Sanitization
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/[^\w\s\.,!?;:'"()-]/g, '') // Remove special characters except basic punctuation
    .substring(0, 5000); // Hard limit
}

// IP Address Extraction
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cloudflare = request.headers.get('cf-connecting-ip');
  
  if (cloudflare) return cloudflare;
  if (real) return real;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Error Response Types
export interface APIError {
  success: false;
  error: string;
  code: APIErrorCode;
  field?: string;
  details?: any;
  timestamp?: string;
  requestId?: string;
}

export type APIErrorCode = 
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT'
  | 'INSUFFICIENT_CREDITS' 
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'DATABASE_ERROR'
  | 'FILE_UPLOAD_ERROR';

// Enhanced Logger
export class Logger {
  static info(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`ℹ️ [INFO] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    console.error(`❌ [ERROR] ${timestamp} - ${message}`, error || '');
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production' && error) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  static warn(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.warn(`⚠️ [WARN] ${timestamp} - ${message}`, data || '');
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.debug(`🐛 [DEBUG] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  static api(method: string, endpoint: string, status: number, duration?: number, error?: string) {
    const timestamp = new Date().toISOString();
    const durationText = duration ? ` (${duration}ms)` : '';
    const statusEmoji = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
    
    console.log(`${statusEmoji} [API] ${timestamp} - ${method} ${endpoint} ${status}${durationText}${error ? ` - ${error}` : ''}`);
  }
}

// Generate Request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// API Response Helpers
export function createSuccessResponse<T>(data?: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

export function createErrorResponse(
  error: string,
  code: APIErrorCode = 'SERVER_ERROR',
  field?: string,
  details?: any,
  requestId?: string
): APIError {
  return {
    success: false,
    error,
    code,
    field,
    details,
    timestamp: new Date().toISOString(),
    requestId
  };
}

// Retry Mechanism
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      Logger.warn(`Attempt ${attempt} failed`, { error: lastError.message });
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

// Environment variable validation
export function validateEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  
  return value;
}

// Security Headers Helper
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  };
}

// Performance Timer
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
    Logger.debug(`⏱️ Timer started: ${label}`);
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    Logger.debug(`⏱️ Timer ended: ${this.label} (${duration.toFixed(2)}ms)`);
    return duration;
  }
}

// Voice cloning doğrulama fonksiyonu
export function validateVoiceCloningRequest(data: any): { success: true; data: VoiceCloningRequest } | { success: false; error: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Geçersiz istek formatı.' };
  }

  // Ses adı validasyonu
  const { voice_name, accuracy, model, noise_reduction, volume_normalization } = data;

  if (!voice_name || typeof voice_name !== 'string') {
    return { success: false, error: 'Ses adı gerekli ve string olmalıdır.', field: 'voice_name' };
  }

  const trimmedVoiceName = voice_name.trim();
  if (trimmedVoiceName.length < 2 || trimmedVoiceName.length > 50) {
    return { success: false, error: 'Ses adı 2-50 karakter arasında olmalıdır.', field: 'voice_name' };
  }

  // Accuracy validasyonu (0.1-0.9 number)
  if (accuracy !== undefined && (typeof accuracy !== 'number' || accuracy < 0.1 || accuracy > 0.9)) {
    return { success: false, error: 'Accuracy değeri 0.1 ile 0.9 arasında bir sayı olmalıdır.', field: 'accuracy' };
  }

  // Model validasyonu
  if (model && !VALID_VOICE_CLONING_MODELS.includes(model as VoiceCloningModel)) {
    return { success: false, error: `Geçersiz model. Geçerli modeller: ${VALID_VOICE_CLONING_MODELS.join(', ')}`, field: 'model' };
  }

  // Boolean parametreler validasyonu
  if (noise_reduction !== undefined && typeof noise_reduction !== 'boolean') {
    return { success: false, error: 'Noise reduction boolean değer olmalıdır.', field: 'noise_reduction' };
  }

  if (volume_normalization !== undefined && typeof volume_normalization !== 'boolean') {
    return { success: false, error: 'Volume normalization boolean değer olmalıdır.', field: 'volume_normalization' };
  }

  return {
    success: true,
    data: {
      voice_name: trimmedVoiceName,
      accuracy: accuracy || 0.7, // Default to 0.7 (high quality)
      model: (model as VoiceCloningModel) || 'speech-2.6-hd',
      noise_reduction: noise_reduction || false,
      volume_normalization: volume_normalization || false
    }
  };
}
