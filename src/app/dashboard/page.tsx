'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Play, SkipBack, SkipForward, Download, ChevronDown, Sparkles,
  Wand2, Volume2, HelpCircle, Mic, Music, Film, Headphones, Zap, MoreHorizontal,
  Compass, History, FileText, Settings, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { voices } from '@/lib/voices';
import { useAudio } from '@/contexts/AudioProvider';
import { AudioTrack } from '@/types/audio';

interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
  plan: string;
  totalGenerations: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { controls } = useAudio();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [text, setText] = useState('Dağlarla çevrili küçük bir kasabada, insanlar her gün doğumunun gökyüzünden gizli bir mesaj taşıdığına inanırdı. Çocuklar sabah erken kalkıp, şafağın ilk ışığını görmek için beklerlerdi.');
  const [selectedVoice, setSelectedVoice] = useState(voices[0]?.id || 'Spanish_SophisticatedLady');
  const [emotion, setEmotion] = useState('happy');
  const [language, setLanguage] = useState('Turkish');
  const [selectedModel, setSelectedModel] = useState('speech-2.6-hd');


  const emotions = [
    { value: 'happy', label: 'Mutlu' },
    { value: 'sad', label: 'Üzgün' },
    { value: 'neutral', label: 'Doğal' },
    { value: 'angry', label: 'Kızgın' },
    { value: 'fearful', label: 'Korkulu' },
    { value: 'calm', label: 'Sakin' },
    { value: 'disgusted', label: 'Tiksinmiş' },
    { value: 'surprised', label: 'Şaşkın' },
    { value: 'fluent', label: 'Akıcı' }
  ];

  // Kullanıcı verilerini al
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      console.log('User API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User API Data:', data);
        setUserData(data.user);
      } else {
        const errorData = await response.text();
        console.error('User API Error Response:', errorData);
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    // Model seçimine göre kredi hesaplama
    const baseCharacterCount = text.length;
    const creditMultiplier = selectedModel === 'speech-2.6-turbo' ? 0.6 : 1.0;
    const requiredCredits = Math.ceil(baseCharacterCount * creditMultiplier);
    const availableCredits = userData?.credits || session?.user?.credits || 0;
    
    console.log('Generate attempt:', { baseCharacterCount, creditMultiplier, requiredCredits, availableCredits, model: selectedModel });
    
    if (availableCredits < requiredCredits) {
      alert(`Yetersiz kredi! ${requiredCredits} kredi gerekiyor (${selectedModel === 'speech-2.6-turbo' ? 'Turbo model %40 indirimli' : 'HD model'}), ${availableCredits} krediniz var.`);
      return;
    }

    // Start generating with progress animation
    setIsGenerating(true);
    setGeneratingProgress(0);
    
    // Create a loading track to show player immediately
    const selectedVoiceData = voices.find(v => v.id === selectedVoice) || voices[0];
    const loadingTrack: AudioTrack = {
      id: `loading-${Date.now()}`,
      title: `${selectedVoiceData.name}: ${text.substring(0, 30)}...`,
      voiceCharacter: selectedVoiceData.name,
      voiceId: selectedVoice,
      audioUrl: '', // Empty URL for loading state
      duration: 0,
      metadata: {
        text: text,
        emotion: emotion,
        language: language,
        model: selectedModel,
        characterCount: text.length
      }
    };
    controls.addToQueue(loadingTrack);
    
    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setGeneratingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice,
          emotion,
          language,
          model: selectedModel
        })
      });

      const data = await response.json();
      
      // Complete progress
      clearInterval(progressInterval);
      setGeneratingProgress(100);
      
      if (data.success) {
        const audioUrl = data.output || data.audioUrl;
        
        // Validate audio URL
        if (!audioUrl || typeof audioUrl !== 'string' || audioUrl.trim() === '') {
          console.error('Geçersiz audio URL:', audioUrl);
          controls.removeFromQueue(loadingTrack.id);
          throw new Error('Ses URL\'si alınamadı');
        }
        
        console.log('Audio URL alındı:', {
          url: audioUrl,
          urlLength: audioUrl.length,
          urlType: audioUrl.startsWith('http') ? 'HTTP' : audioUrl.startsWith('blob') ? 'BLOB' : 'OTHER',
          preview: audioUrl.substring(0, 100)
        });
        
        const selectedVoiceData = voices.find(v => v.id === selectedVoice) || voices[0];
        
        // Remove loading track and add real track
        controls.removeFromQueue(loadingTrack.id);
        
        // Create audio track for ModernAudioPlayer
        const audioTrack: AudioTrack = {
          id: `tts-${Date.now()}`,
          title: `${selectedVoiceData.name}: ${text.substring(0, 30)}`,
          voiceCharacter: selectedVoiceData.name,
          voiceId: selectedVoice,
          audioUrl: audioUrl.trim(),
          duration: 0,
          metadata: {
            text: text,
            emotion: emotion,
            language: language,
            model: selectedModel,
            characterCount: text.length
          }
        };

        // Add to queue and play automatically
        controls.addToQueue(audioTrack);
        await controls.play(audioTrack);
        
        // Update user data
        setUserData(prev => prev ? { ...prev, credits: data.remainingCredits } : null);
        fetchUserData();
      } else {
        // Remove loading track on error
        controls.removeFromQueue(loadingTrack.id);
        alert(data.error || 'Ses üretimi başarısız!');
      }
    } catch (error) {
      console.error('TTS Hatası:', error);
      // Remove loading track on error
      controls.removeFromQueue(loadingTrack.id);
      alert('Ses üretimi sırasında bir hata oluştu!');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratingProgress(0);
      }, 1000);
    }
  };

  const selectedVoiceData = voices.find(v => v.id === selectedVoice) || voices[0];
  
  // Color gradient için helper fonksiyon
  const getVoiceColor = (voiceId: string) => {
    const colors = [
      'from-slate-500 to-slate-700',
      'from-purple-500 to-purple-700',
      'from-red-500 to-red-700',
      'from-pink-500 to-pink-700',
      'from-indigo-500 to-indigo-700',
      'from-blue-600 to-blue-800',
      'from-gray-600 to-gray-800',
      'from-stone-600 to-stone-800',
      'from-rose-500 to-rose-700',
      'from-pink-300 to-pink-500',
      'from-green-600 to-green-800',
      'from-red-600 to-red-800',
      'from-emerald-600 to-emerald-800',
      'from-cyan-500 to-cyan-700',
      'from-orange-500 to-orange-700',
      'from-blue-400 to-blue-600',
      'from-violet-600 to-violet-800',
      'from-gray-400 to-gray-600',
      'from-teal-500 to-teal-700',
      'from-yellow-500 to-yellow-700',
      'from-green-500 to-green-700',
      'from-amber-500 to-amber-700',
      'from-slate-400 to-slate-600',
      'from-amber-600 to-amber-800',
      'from-orange-600 to-orange-800',
      'from-purple-600 to-purple-800',
      'from-pink-400 to-pink-600',
      'from-blue-500 to-blue-700',
      'from-red-500 to-red-700',
      'from-indigo-600 to-indigo-800',
      'from-gray-500 to-gray-700'
    ];
    const index = voices.findIndex(v => v.id === voiceId);
    return colors[index % colors.length] || 'from-purple-500 to-purple-700';
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse text-lg text-slate-600">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-500 text-sm mb-1">Tekrar hoş geldin</p>
          <h1 className="text-3xl font-bold text-gray-900">
            {userData?.name || session?.user?.name || 'Kullanıcı'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <HelpCircle className="w-4 h-4" /> Yardım lazım
          </button>
          <button className="px-4 py-2 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-teal-100">
            <Sparkles className="w-4 h-4" /> AI Asistan
          </button>
        </div>
      </header>


      {/* Main TTS Input Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-10 relative overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-purple-50 to-transparent pointer-events-none opacity-50"></div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 resize-none border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-700 placeholder-gray-400 bg-white mb-4 leading-relaxed p-4"
            placeholder="Dağlarla çevrili küçük bir kasabada, insanlar her gün doğumunun gökyüzünden gizli bir mesaj taşıdığına inanırdı..."
          ></textarea>

          <div className="flex justify-between items-center text-xs text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center text-[8px]">i</div>
                  Maliyet {text.length} kredi
              </div>
              <span>{text.length} / 10.000 Karakter</span>
          </div>

        {/* Voice & Emotion Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ses Karakteri</label>
            <select 
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duygu</label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {emotions.map(emo => (
                <option key={emo.value} value={emo.value}>{emo.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dil Seçimi</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                <option value="Turkish">🇹🇷 Türkçe (Ana Dil)</option>
                <option value="English">🇺🇸 English (Global)</option>
                <option value="Spanish">🇪🇸 Español (İspanyolca)</option>
                <option value="German">🇩🇪 Deutsch (Almanca)</option>
                <option value="French">🇫🇷 Français (Fransızca)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Model Seçimi */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Model Kalitesi
            <span className="ml-2 text-xs text-gray-500">
              ({selectedModel === 'speech-2.6-turbo' ? '%40 daha ucuz' : 'En yüksek kalite'})
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedModel('speech-2.6-hd')}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedModel === 'speech-2.6-hd'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Sparkles className={`w-4 h-4 mr-1 ${selectedModel === 'speech-2.6-hd' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">HD Kalite</span>
              </div>
              <div className="text-xs text-gray-600">En yüksek ses kalitesi</div>
              <div className="text-xs font-medium text-gray-800 mt-1">1x kredi</div>
            </button>
            
            <button
              onClick={() => setSelectedModel('speech-2.6-turbo')}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedModel === 'speech-2.6-turbo'
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Zap className={`w-4 h-4 mr-1 ${selectedModel === 'speech-2.6-turbo' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Turbo</span>
              </div>
              <div className="text-xs text-gray-600">Hızlı ve ekonomik</div>
              <div className="text-xs font-medium text-green-600 mt-1">0.6x kredi (%40 indirim)</div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getVoiceColor(selectedVoice)} flex items-center justify-center text-white text-xs`}>
                  {selectedVoiceData?.avatar || selectedVoiceData?.name?.charAt(0) || 'V'}
                </div>
                <span className="text-sm font-medium">{selectedVoiceData?.name || 'Ses Seçin'}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim() || ((userData?.credits || session?.user?.credits || 0) < text.length)}
              className={`
                relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg overflow-hidden
                ${isGenerating
                  ? 'from-purple-500 to-blue-500 scale-105 shadow-2xl'
                  : 'hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-xl active:scale-95'
                }
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              `}
            >
              {/* Progress Background */}
              {isGenerating && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 transition-all duration-300"
                  style={{ width: `${generatingProgress}%` }}
                />
              )}
              
              {/* Button Content */}
              <div className="relative flex items-center gap-2 justify-center">
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Ses üretiliyor... {Math.round(generatingProgress)}%</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span>Ses üret</span>
                  </>
                )}
              </div>
              
              {/* Generating Pulse Effect */}
              {isGenerating && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/30 to-blue-400/30 animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-5">Hızlı işlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <Link href="/dashboard/studio" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-cyan-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-200 transition-colors">
                  <Mic className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Stüdyo</h3>
                <p className="text-xs text-gray-500">Ses üret</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/voices" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-purple-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <Compass className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Ses Kütüphanesi</h3>
                <p className="text-xs text-gray-500">Ses kütüphanesi</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/history" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-green-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                  <History className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Geçmiş</h3>
                <p className="text-xs text-gray-500">Ses geçmişi</p>
              </div>
            </div>
          </Link>

          <Link href="#" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <Wand2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Klonlama</h3>
                <p className="text-xs text-gray-500">Ses klonla</p>
              </div>
            </div>
          </Link>

          <Link href="#" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-orange-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Deşifre</h3>
                <p className="text-xs text-gray-500">Ses çevirisi</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/profile" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Profil</h3>
                <p className="text-xs text-gray-500">Hesap bilgileri</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Section: New Voices & Activity */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div>
            <h3 className="text-sm font-bold mb-4">Yeni sesler</h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      S
                    </div>
                    <div>
                        <p className="text-sm font-bold">Sophie • Anlatım</p>
                        <p className="text-xs text-gray-400">Rahat, neşeli, bir kafede sohbet edermişcesine.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50"><Play className="w-3 h-3" /></button>
                    <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50"><MoreHorizontal className="w-3 h-3" /></button>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-sm font-bold mb-4">Son aktiviteleriniz</h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                 <div>
                    <p className="text-sm font-bold">Güneşin Doğuşu - Sıcak şarkı</p>
                    <p className="text-xs text-gray-400">Sakin, minimalist, sıcak • 5 dakika önce</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-xs font-semibold rounded text-gray-500">SFX ve Müzik</span>
            </div>
        </div>
        </div>
      </div>

    </div>
  );
}

// ---------------- HELPER COMPONENTS ----------------

function ActionCard({ title, desc, icon, color }: { title: string, desc: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                {/* Visual placeholder for waveform graphic in card */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-0.5 items-end h-6">
                        <div className="w-0.5 h-3 bg-gray-300"></div>
                        <div className="w-0.5 h-5 bg-gray-300"></div>
                        <div className="w-0.5 h-2 bg-gray-300"></div>
                    </div>
                </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{desc}</p>
            <button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                Şimdi dene
            </button>
        </div>
    )
}