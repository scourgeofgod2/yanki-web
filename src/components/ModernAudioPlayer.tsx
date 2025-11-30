'use client'

import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Download,
  Share2,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react'
import { useAudio } from '@/contexts/AudioProvider'
import { formatDuration, calculateProgress } from '@/lib/audio-utils'
import { voices } from '@/lib/voices'

const ModernAudioPlayer: React.FC = () => {
  const { state, controls, playbackState, error, clearError } = useAudio()
  const [isVisible, setIsVisible] = useState(false)
  
  const { currentTrack, isPlaying, currentTime, duration } = state
  
  // Show player when track is available or loading
  useEffect(() => {
    if (state.currentTrack || playbackState === 'loading') {
      setIsVisible(true)
    }
  }, [state.currentTrack, playbackState])
  
  // Use loading track placeholder if no current track
  const displayTrack = currentTrack || {
    id: 'loading',
    title: 'Ses üretiliyor...',
    voiceCharacter: 'Yükleniyor',
    voiceId: '',
    audioUrl: '',
    duration: 0,
    metadata: {
      text: '',
      emotion: '',
      language: '',
      model: '',
      characterCount: 0
    }
  }
  
  // Don't render if no current track and not loading
  const shouldShow = state.currentTrack || playbackState === 'loading'
  
  // Get voice character info
  const voiceInfo = displayTrack.voiceId 
    ? voices.find(v => v.id === displayTrack.voiceId) || voices[0]
    : voices[0]
  
  // Progress calculation
  const progress = calculateProgress(currentTime, duration)
  
  // Waveform bars for animation
  const waveformBars = Array.from({ length: 5 }, (_, i) => i)
  
  // Handle 10 second skip
  const handleSkipBack = () => {
    controls.seek(Math.max(0, currentTime - 10))
  }
  
  const handleSkipForward = () => {
    controls.seek(Math.min(duration, currentTime + 10))
  }
  
  // Handle download
  const handleDownload = () => {
    if (currentTrack?.audioUrl) {
      const link = document.createElement('a')
      link.href = currentTrack.audioUrl
      link.download = `${voiceInfo.name}-${Date.now()}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  
  // Handle share
  const handleShare = async () => {
    if (!currentTrack?.audioUrl) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${voiceInfo.name}: ${currentTrack.metadata?.text?.substring(0, 50) || ''}`,
          text: currentTrack.metadata?.text || '',
          url: currentTrack.audioUrl
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentTrack.audioUrl)
      alert('URL kopyalandı!')
    }
  }
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
    controls.seek(newTime)
  }
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    controls.setVolume(newVolume)
  }
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Don't trigger shortcuts when typing
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          isPlaying ? controls.pause() : controls.play()
          break
        case 'ArrowRight':
          if (e.shiftKey) {
            controls.next()
          } else {
            controls.seek(Math.min(duration, currentTime + 10))
          }
          break
        case 'ArrowLeft':
          if (e.shiftKey) {
            controls.previous()
          } else {
            controls.seek(Math.max(0, currentTime - 10))
          }
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, controls, currentTime, duration])

  // Early return if nothing to show
  if (!shouldShow) {
    return null
  }

  return (
    <>
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Ses Hatası</p>
            <p className="text-sm opacity-90">{error.message}</p>
          </div>
          <button
            onClick={clearError}
            className="ml-2 hover:bg-red-600 rounded p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Compact Audio Player - Bottom Center Position */}
      <div 
        className={`fixed bottom-4 left-4 right-4 lg:left-1/2 lg:right-auto lg:transform lg:-translate-x-1/2 bg-white border border-gray-200 rounded-2xl px-4 lg:px-6 py-3 z-50 shadow-2xl transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ maxWidth: '800px', minWidth: '320px' }}
      >
        {/* Single Row Layout */}
        <div className="flex items-center gap-6">
          {/* Left: Basic Controls */}
          <div className="flex items-center gap-3">
            {/* 10s Back */}
            <button
              onClick={handleSkipBack}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              title="10 saniye geri"
              disabled={!state.currentTrack}
            >
              <SkipBack className="h-5 w-5" />
            </button>
            
            {/* Play/Pause */}
            <button
              onClick={() => {
                if (playbackState === 'loading' || !state.currentTrack) return
                isPlaying ? controls.pause() : controls.play()
              }}
              className="bg-gray-900 text-white rounded-full p-3 hover:bg-black hover:scale-105 transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={playbackState === 'loading' || !state.currentTrack}
              title={playbackState === 'loading' ? 'Yükleniyor...' : isPlaying ? 'Duraklat' : 'Oynat'}
            >
              {playbackState === 'loading' || !state.currentTrack ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </button>
            
            {/* 10s Forward */}
            <button
              onClick={handleSkipForward}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              title="10 saniye ileri"
              disabled={!state.currentTrack}
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          
          {/* Center: Progress Bar & Time */}
          <div className="flex-1 px-4">
            {/* Progress Bar */}
            <div 
              className="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer hover:h-2 transition-all duration-200 group mb-2"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-gray-900 h-full rounded-full transition-all duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Progress thumb */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Time Display */}
            <div className="flex justify-center text-sm text-gray-600 font-medium">
              <span>{formatDuration(currentTime)} / {formatDuration(duration)}</span>
            </div>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={handleShare}
              disabled={!state.currentTrack || !state.currentTrack.audioUrl}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Paylaş"
            >
              <Share2 className="h-4 w-4" />
            </button>
            
            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={!state.currentTrack || !state.currentTrack.audioUrl}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="İndir"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Track Title - Below controls */}
        {state.currentTrack && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600 truncate">
              <span className="font-medium">{voiceInfo.name}</span> • {displayTrack.metadata?.text?.substring(0, 60) || displayTrack.title}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default ModernAudioPlayer
