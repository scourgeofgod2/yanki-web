'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  AudioTrack, 
  AudioPlayerState, 
  AudioPlayerControls,
  PlaybackState,
  AudioErrorDetails
} from '@/types/audio'
import { 
  analyzeAudioError,
  formatDuration,
  normalizeVolume,
  normalizePlaybackRate,
  getPlayerSettings,
  savePlayerSettings,
  shuffleArray,
  isValidAudioUrl
} from '@/lib/audio-utils'

const useAudioPlayer = () => {
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentTrackRef = useRef<AudioTrack | null>(null)
  const eventCleanupRef = useRef<(() => void) | null>(null)
  
  // State
  const [state, setState] = useState<AudioPlayerState>(() => {
    const savedSettings = getPlayerSettings()
    return {
      currentTrack: null,
      isPlaying: false,
      isLoading: false,
      volume: savedSettings.volume || 0.8,
      currentTime: 0,
      duration: 0,
      queue: [],
      playbackRate: savedSettings.playbackRate || 1.0,
      isShuffled: savedSettings.isShuffled || false,
      repeatMode: savedSettings.repeatMode || 'off'
    }
  })
  
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle')
  const [error, setError] = useState<AudioErrorDetails | null>(null)
  
  // Initialize audio element with event listeners only once
  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      audioRef.current.volume = state.volume
      audioRef.current.playbackRate = state.playbackRate
    }
    return audioRef.current
  }, [state.volume, state.playbackRate])
  
  // Update current time
  const updateTime = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    
    setState(prev => ({
      ...prev,
      currentTime: audio.currentTime,
      duration: audio.duration || 0
    }))
  }, [])
  
  // Handle audio events
  const setupAudioEvents = useCallback((audio: HTMLAudioElement) => {
    const handleLoadStart = () => {
      setPlaybackState('loading')
      setState(prev => ({ ...prev, isLoading: true }))
      setError(null)
    }
    
    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration || 0,
        isLoading: false
      }))
      setPlaybackState('idle')
    }
    
    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }))
      setPlaybackState('idle')
    }
    
    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }))
      setPlaybackState('playing')
    }
    
    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
      setPlaybackState('paused')
    }
    
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
      setPlaybackState('ended')
      // Auto next track - this will be handled by useEffect
    }
    
    const handleTimeUpdate = updateTime
    
    const handleError = () => {
      const audioError = audio.error
      let errorDetails: any
      
      if (audioError) {
        errorDetails = analyzeAudioError(audioError)
      } else {
        // If no error object, check the src
        if (!audio.src || audio.src.trim() === '') {
          errorDetails = {
            type: 'NOT_SUPPORTED_ERROR',
            message: 'Ses URL\'si bulunamadı veya geçersiz.',
            recoverable: false
          }
        } else {
          errorDetails = {
            type: 'NOT_SUPPORTED_ERROR',
            message: 'Ses dosyası yüklenemedi. URL formatını veya dosya erişimini kontrol edin.',
            recoverable: true
          }
        }
      }
      
      setError(errorDetails)
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false 
      }))
      setPlaybackState('error')
      
      console.error('Audio player error:', {
        error: audioError,
        errorCode: audioError?.code,
        errorMessage: audioError?.message,
        audioSrc: audio.src?.substring(0, 100),
        errorDetails
      })
    }
    
    const handleWaiting = () => {
      setPlaybackState('buffering')
    }
    
    const handleCanPlayThrough = () => {
      if (state.isPlaying) {
        setPlaybackState('playing')
      }
    }
    
    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('error', handleError)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    
    // Cleanup function
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [state.isPlaying, updateTime])
  
  // Play function
  const play = useCallback(async (track?: AudioTrack) => {
    const audio = initializeAudio()
    
    // Setup event listeners if not already setup
    if (!eventCleanupRef.current) {
      const cleanup = setupAudioEvents(audio)
      eventCleanupRef.current = cleanup
    }
    
    try {
      // If new track provided, load it
      if (track) {
        // Validate audio URL
        if (!track.audioUrl || track.audioUrl.trim() === '') {
          throw new Error('Ses URL\'si bulunamadı')
        }
        
        const trimmedUrl = track.audioUrl.trim()
        
        // Check if URL is valid format
        if (!isValidAudioUrl(trimmedUrl)) {
          console.error('Geçersiz audio URL formatı:', trimmedUrl)
          throw new Error('Geçersiz ses URL formatı')
        }
        
        // Stop current track
        audio.pause()
        audio.currentTime = 0
        
        // Update state with new track
        setState(prev => ({
          ...prev,
          currentTrack: track,
          isLoading: true
        }))
        currentTrackRef.current = track
        
        // Load new audio source
        try {
          // Clear previous source first
          audio.src = ''
          audio.load()
          
          // Set new source
          audio.src = trimmedUrl
          
          // Explicitly call load() to start loading
          audio.load()
          
          // Wait a bit for the audio to start loading
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (srcError) {
          console.error('Audio source error:', srcError)
          throw new Error('Ses dosyası yüklenemedi')
        }
      }
      
      // Play audio - only if we have a valid source
      if (audio.src && audio.src.trim() !== '') {
        try {
          await audio.play()
        } catch (playError: any) {
          // Handle autoplay restrictions
          if (playError.name === 'NotAllowedError' || playError.name === 'NotSupportedError') {
            console.warn('Autoplay blocked, user interaction required')
            // Don't throw, just log - user can click play button
            setPlaybackState('idle')
            setState(prev => ({ ...prev, isLoading: false }))
          } else {
            throw playError
          }
        }
      } else if (track) {
        // If we have a track but no valid src, it means loading failed
        throw new Error('Ses dosyası yüklenemedi')
      }
    } catch (error) {
      const errorDetails = analyzeAudioError(error)
      setError(errorDetails)
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false 
      }))
      setPlaybackState('error')
      console.error('Playback error:', error, errorDetails)
    }
  }, [initializeAudio, setupAudioEvents])
  
  // Pause function
  const pause = useCallback(() => {
    const audio = audioRef.current
    if (audio && !audio.paused) {
      audio.pause()
    }
  }, [])
  
  // Stop function
  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])
  
  // Seek function
  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio && audio.duration && time >= 0 && time <= audio.duration) {
      audio.currentTime = time
    }
  }, [])
  
  // Set volume
  const setVolume = useCallback((volume: number) => {
    const normalizedVolume = normalizeVolume(volume)
    const audio = audioRef.current
    
    if (audio) {
      audio.volume = normalizedVolume
    }
    
    setState(prev => ({ ...prev, volume: normalizedVolume }))
    
    // Save to localStorage
    savePlayerSettings({ 
      ...getPlayerSettings(), 
      volume: normalizedVolume 
    })
  }, [])
  
  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    const normalizedRate = normalizePlaybackRate(rate)
    const audio = audioRef.current
    
    if (audio) {
      audio.playbackRate = normalizedRate
    }
    
    setState(prev => ({ ...prev, playbackRate: normalizedRate }))
    
    // Save to localStorage
    savePlayerSettings({ 
      ...getPlayerSettings(), 
      playbackRate: normalizedRate 
    })
  }, [])
  
  // Next track
  const handleNext = useCallback(() => {
    const { queue, currentTrack, isShuffled, repeatMode } = state
    
    if (!currentTrack || queue.length === 0) return
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id)
    
    if (currentIndex === -1) return
    
    let nextIndex = currentIndex + 1
    
    // Handle repeat modes
    if (repeatMode === 'one') {
      // Repeat current track
      play(currentTrack)
      return
    }
    
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0 // Loop to beginning
      } else {
        return // No more tracks
      }
    }
    
    const nextTrack = queue[nextIndex]
    if (nextTrack) {
      play(nextTrack)
    }
  }, [state, play])
  
  // Previous track
  const previous = useCallback(() => {
    const { queue, currentTrack } = state
    
    if (!currentTrack || queue.length === 0) return
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id)
    
    if (currentIndex === -1) return
    
    // If more than 3 seconds have passed, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      seek(0)
      return
    }
    
    let prevIndex = currentIndex - 1
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1 // Loop to end
    }
    
    const prevTrack = queue[prevIndex]
    if (prevTrack) {
      play(prevTrack)
    }
  }, [state, play, seek])
  
  // Add to queue
  const addToQueue = useCallback((track: AudioTrack) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, track]
    }))
  }, [])
  
  // Remove from queue
  const removeFromQueue = useCallback((trackId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(track => track.id !== trackId)
    }))
  }, [])
  
  // Clear queue
  const clearQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      queue: []
    }))
  }, [])
  
  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setState(prev => {
      const newIsShuffled = !prev.isShuffled
      let newQueue = [...prev.queue]
      
      if (newIsShuffled) {
        // Shuffle queue but keep current track at front
        const currentTrack = prev.currentTrack
        if (currentTrack) {
          const otherTracks = newQueue.filter(t => t.id !== currentTrack.id)
          const shuffledOthers = shuffleArray(otherTracks)
          newQueue = [currentTrack, ...shuffledOthers]
        } else {
          newQueue = shuffleArray(newQueue)
        }
      }
      
      // Save to localStorage
      savePlayerSettings({ 
        ...getPlayerSettings(), 
        isShuffled: newIsShuffled 
      })
      
      return {
        ...prev,
        isShuffled: newIsShuffled,
        queue: newQueue
      }
    })
  }, [])
  
  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all']
      const currentIndex = modes.indexOf(prev.repeatMode)
      const nextMode = modes[(currentIndex + 1) % modes.length]
      
      // Save to localStorage
      savePlayerSettings({ 
        ...getPlayerSettings(), 
        repeatMode: nextMode 
      })
      
      return {
        ...prev,
        repeatMode: nextMode
      }
    })
  }, [])
  
  // Player controls object
  const controls: AudioPlayerControls = {
    play,
    pause,
    stop,
    next: handleNext,
    previous,
    seek,
    setVolume,
    setPlaybackRate,
    addToQueue,
    removeFromQueue,
    clearQueue,
    toggleShuffle,
    toggleRepeat
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup event listeners
      if (eventCleanupRef.current) {
        eventCleanupRef.current()
        eventCleanupRef.current = null
      }
      
      // Cleanup audio
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.src = ''
        audio.load()
      }
    }
  }, [])
  
  return {
    state,
    controls,
    playbackState,
    error,
    clearError: () => setError(null)
  }
}

export default useAudioPlayer
