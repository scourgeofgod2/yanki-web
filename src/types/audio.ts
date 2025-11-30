// Audio Player Types
export interface AudioTrack {
  id: string
  title: string
  audioUrl: string
  voiceCharacter: string
  voiceId: string
  duration?: number
  metadata: {
    text: string
    emotion: string
    language: string
    model: string
    characterCount: number
  }
  createdAt?: Date
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null
  isPlaying: boolean
  isLoading: boolean
  volume: number
  currentTime: number
  duration: number
  queue: AudioTrack[]
  playbackRate: number
  isShuffled: boolean
  repeatMode: 'off' | 'one' | 'all'
}

export interface AudioPlayerControls {
  play: (track?: AudioTrack) => Promise<void>
  pause: () => void
  stop: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  addToQueue: (track: AudioTrack) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}

export interface VoiceCharacter {
  id: string
  name: string
  description: string
  gender: 'male' | 'female'
  age: 'young' | 'adult' | 'senior'
  accent: string
  emotion: string
  avatar?: string
  isPremium?: boolean
}

// Audio Format Support
export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg', // MP3
  'audio/wav',  // WAV
  'audio/ogg',  // OGG
  'audio/webm', // WebM
  'audio/mp4',  // MP4/AAC
] as const

export type SupportedAudioFormat = typeof SUPPORTED_AUDIO_FORMATS[number]

// Audio Error Types
export type AudioError = 
  | 'NETWORK_ERROR'
  | 'DECODE_ERROR'
  | 'NOT_SUPPORTED_ERROR'
  | 'PLAYBACK_ERROR'
  | 'PERMISSION_ERROR'

export interface AudioErrorDetails {
  type: AudioError
  message: string
  recoverable: boolean
}

// Playback States
export type PlaybackState = 
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'ended'
  | 'error'

// Player Theme
export interface PlayerTheme {
  primary: string
  secondary: string
  background: string
  text: string
  accent: string
  error: string
  success: string
}