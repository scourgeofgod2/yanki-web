'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import useAudioPlayer from '@/hooks/useAudioPlayer'
import { 
  AudioPlayerState, 
  AudioPlayerControls, 
  PlaybackState,
  AudioErrorDetails
} from '@/types/audio'

interface AudioContextType {
  state: AudioPlayerState
  controls: AudioPlayerControls
  playbackState: PlaybackState
  error: AudioErrorDetails | null
  clearError: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

interface AudioProviderProps {
  children: ReactNode
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioPlayer = useAudioPlayer()

  return (
    <AudioContext.Provider value={audioPlayer}>
      {children}
    </AudioContext.Provider>
  )
}

// Custom hook to use audio context
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext)
  
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  
  return context
}

export default AudioProvider