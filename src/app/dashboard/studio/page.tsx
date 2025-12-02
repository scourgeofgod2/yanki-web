'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAudio } from '@/contexts/AudioProvider';
import { AudioTrack } from '@/types/audio';
import { voices as staticVoices } from '@/lib/voices';
import {
  Settings, Check, ChevronRight, Search, Play, 
  ArrowLeft, Zap, Globe, Info, X, Loader2, Mic, Sliders
} from 'lucide-react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// --- Types ---
interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
}

interface ClonedVoice {
  id: string;
  voiceId: string;
  name: string;
  status: string;
}

interface VoiceUI {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  isPremium?: boolean;
  isCloned?: boolean;
}

interface StudioParams {
  text: string;
  voice_id: string;
  emotion: string;
  speed: number;
  pitch: number;
  volume: number;
  language: string;
  model: string;
  language_boost: boolean;
  english_normalization: boolean;
}

type ViewState = 'main' | 'settings' | 'voice_select' | 'model_select';

export default function StudioPage() {
  const { data: session } = useSession();
  const { controls } = useAudio();
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // State
  const [clonedVoices, setClonedVoices] = useState<ClonedVoice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<ViewState | null>(null);
  const [desktopView, setDesktopView] = useState<ViewState>('settings');
  const [voiceSearch, setVoiceSearch] = useState('');
  const [isEmotionDropdownOpen, setIsEmotionDropdownOpen] = useState(false);

  const [studioParams, setStudioParams] = useState<StudioParams>({
    text: 'Merhaba, ben Yankı AI ses asistanınızım. Bu gelişmiş stüdyo ile profesyonel kalitede sesler üretebilirsiniz.',
    voice_id: 'English_Trustworth_Man',
    emotion: 'neutral',
    speed: 1.0,
    pitch: 0,
    volume: 0.5,
    language: 'Turkish',
    model: 'speech-2.6-hd',
    language_boost: true,
    english_normalization: false
  });

  const emotions = [
    { value: 'neutral', label: 'Doğal', icon: '😐' },
    { value: 'happy', label: 'Mutlu', icon: '😊' },
    { value: 'sad', label: 'Üzgün', icon: '😢' },
    { value: 'angry', label: 'Kızgın', icon: '😠' },
    { value: 'fearful', label: 'Korkulu', icon: '😨' },
    { value: 'disgusted', label: 'Tiksinmiş', icon: '🤢' },
    { value: 'surprised', label: 'Şaşkın', icon: '😮' },
  ];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success && userData.user) setUserData(userData.user);
        }

        const voicesRes = await fetch('/api/voice-cloning');
        if (voicesRes.ok) {
            const voiceData = await voicesRes.json();
            const list = voiceData.cloned_voices || voiceData.data?.cloned_voices || [];
            setClonedVoices(list.filter((v: ClonedVoice) => v.status === 'completed' && v.voiceId));
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setIsLoadingVoices(false);
      }
    };

    if (session) fetchData();
  }, [session]);

  const allVoices: VoiceUI[] = [
    ...clonedVoices.map(cv => ({
        id: cv.voiceId,
        name: cv.name,
        description: 'Klonlanmış Sesiniz',
        avatar: '🎙️',
        isCloned: true,
        isPremium: false
    })),
    ...staticVoices
  ];

  // Helpers
  const updateParam = (key: keyof StudioParams, value: any) => {
    setStudioParams(prev => ({ ...prev, [key]: value }));
  };

  const selectedVoice = allVoices.find(v => v.id === studioParams.voice_id) || allVoices[0];
  const textLength = studioParams.text.length;
  const estimatedCredits = Math.ceil(textLength * (studioParams.model === 'speech-2.6-turbo' ? 0.6 : 1.0));

  const filteredVoices = allVoices.filter(voice => 
    voice.name.toLowerCase().includes(voiceSearch.toLowerCase()) ||
    voice.description.toLowerCase().includes(voiceSearch.toLowerCase())
  );

  const handleGenerate = async () => {
    const userCredits = typeof userData?.credits === 'number' ? userData.credits : 0;
    if (!userData || userCredits < estimatedCredits) {
      alert(`Yetersiz kredi! ${estimatedCredits} kredi gerekiyor, ${userCredits} krediniz var.`);
      return;
    }

    setIsGenerating(true);

    const loadingTrack: AudioTrack = {
        id: `loading-${Date.now()}`,
        title: `Üretiliyor...`,
        voiceCharacter: selectedVoice?.name || 'AI',
        voiceId: studioParams.voice_id,
        audioUrl: '',
        duration: 0,
        metadata: {
          text: studioParams.text,
          emotion: studioParams.emotion,
          language: studioParams.language,
          model: studioParams.model,
          characterCount: studioParams.text.length
        }
    };
    controls.addToQueue(loadingTrack);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: studioParams.text,
          voiceId: studioParams.voice_id,
          emotion: studioParams.emotion,
          speed: studioParams.speed,
          pitch: studioParams.pitch,
          volume: studioParams.volume * 10,
          language: studioParams.language,
          model: studioParams.model
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const audioUrl = result.output || result.audioUrl || result.data?.output;
        
        controls.removeFromQueue(loadingTrack.id);
        
        if (!audioUrl) throw new Error("Ses URL'si bulunamadı");

        const audioTrack: AudioTrack = {
          id: `tts-${Date.now()}`,
          title: studioParams.text.substring(0, 30) + '...',
          voiceCharacter: selectedVoice?.name || 'AI',
          voiceId: studioParams.voice_id,
          audioUrl: audioUrl,
          duration: 0,
          metadata: {
            text: studioParams.text,
            emotion: studioParams.emotion,
            language: studioParams.language,
            model: studioParams.model,
            characterCount: studioParams.text.length
          }
        };

        controls.addToQueue(audioTrack);
        controls.play(audioTrack);
        
        if (userData && result.remainingCredits !== undefined) {
            setUserData({ ...userData, credits: result.remainingCredits });
        }
      } else {
        throw new Error('Ses üretimi başarısız');
      }
    } catch (error) {
      console.error(error);
      controls.removeFromQueue(loadingTrack.id);
      alert('Hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Components ---

  const VoiceListContent = ({ onSelect }: { onSelect: (id: string) => void }) => (
    <div className="flex flex-col h-full">
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Sesleri ara..." 
                value={voiceSearch}
                onChange={(e) => setVoiceSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
            />
        </div>
        <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1">
            {isLoadingVoices ? (
                <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Sesler yükleniyor...
                </div>
            ) : filteredVoices.map((voice) => (
                <div 
                    key={voice.id}
                    onClick={() => onSelect(voice.id)}
                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                        studioParams.voice_id === voice.id 
                        ? 'bg-gray-50 border-gray-300 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105 shadow-sm ${
                        voice.isCloned 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                    }`}>
                        {voice.isCloned ? <Mic className="w-4 h-4" /> : (voice.avatar || voice.name[0])}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm truncate">{voice.name}</span>
                            {voice.isPremium && <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">PRO</span>}
                            {voice.isCloned && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">KLON</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{voice.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!voice.isCloned && (
                            <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all" onClick={(e) => e.stopPropagation()}>
                                <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                        )}
                        {studioParams.voice_id === voice.id && <Check className="w-4 h-4 text-black" />}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const SettingsContent = () => (
    <div className="space-y-8">
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Model</label>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => updateParam('model', 'speech-2.6-hd')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                        studioParams.model === 'speech-2.6-hd'
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                >
                    <div className="text-xs font-medium mb-1">HD Kalite</div>
                    <div className={`text-[10px] ${studioParams.model === 'speech-2.6-hd' ? 'text-gray-300' : 'text-gray-400'}`}>En iyi sonuç</div>
                </button>
                <button
                    onClick={() => updateParam('model', 'speech-2.6-turbo')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                        studioParams.model === 'speech-2.6-turbo'
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center gap-1 text-xs font-medium mb-1">
                        Turbo <Zap className="w-3 h-3 fill-current" />
                    </div>
                    <div className={`text-[10px] ${studioParams.model === 'speech-2.6-turbo' ? 'text-gray-300' : 'text-gray-400'}`}>%40 Ucuz</div>
                </button>
            </div>
        </div>

        <div className="space-y-6 px-1">
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Duygu</label>
                <div className="relative">
                    <button
                        onClick={() => setIsEmotionDropdownOpen(!isEmotionDropdownOpen)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between hover:border-gray-300 transition-all text-left"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{emotions.find(e => e.value === studioParams.emotion)?.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{emotions.find(e => e.value === studioParams.emotion)?.label}</span>
                        </span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isEmotionDropdownOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isEmotionDropdownOpen && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                            {emotions.map(e => (
                                <button
                                    key={e.value}
                                    onClick={() => { updateParam('emotion', e.value); setIsEmotionDropdownOpen(false); }}
                                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors ${studioParams.emotion === e.value ? 'bg-gray-50 font-medium' : ''}`}
                                >
                                    <span className="text-lg">{e.icon}</span>
                                    <span className="text-sm text-gray-700">{e.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modern Range Sliders */}
            {['speed', 'pitch', 'volume'].map((param) => (
                <div key={param} className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-700 capitalize">{param === 'speed' ? 'Hız' : param === 'pitch' ? 'Perde' : 'Ses'}</span>
                        <span className="text-gray-400 font-mono">
                            {param === 'speed' ? `${studioParams.speed}x` : param === 'pitch' ? studioParams.pitch : `${Math.round(studioParams.volume * 100)}%`}
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min={param === 'speed' ? 0.5 : param === 'pitch' ? -12 : 0} 
                        max={param === 'speed' ? 2 : param === 'pitch' ? 12 : 1} 
                        step={param === 'speed' || param === 'volume' ? 0.1 : 1}
                        value={studioParams[param as keyof StudioParams] as number} 
                        onChange={(e) => updateParam(param as keyof StudioParams, parseFloat(e.target.value))} 
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                    />
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className={`flex h-[calc(100vh-theme(spacing.24))] lg:h-[calc(100vh-theme(spacing.12))] bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 ${inter.className}`}>
      
      {/* ================= EDITOR AREA ================= */}
      <div className="flex-1 flex flex-col relative z-0 bg-white">
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-100">
            <h1 className="font-bold text-gray-900 text-lg tracking-tight">Metin Stüdyosu</h1>
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                 <div className={`w-1.5 h-1.5 rounded-full ${userData?.credits && userData.credits > 1000 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                 <span className="text-xs font-semibold text-gray-600">{userData?.credits?.toLocaleString() ?? 0} kredi</span>
            </div>
        </header>

        <main className="flex-1 relative group">
            <textarea
                value={studioParams.text}
                onChange={(e) => updateParam('text', e.target.value)}
                className="w-full h-full resize-none border-none focus:ring-0 text-xl leading-relaxed text-gray-800 placeholder-gray-300 bg-transparent p-8 pb-40 lg:pb-32 custom-scrollbar"
                placeholder="Buraya metninizi yazın..."
                spellCheck={false}
            />
            <div className="hidden lg:block absolute bottom-6 left-8 text-xs font-medium text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-100">
                {studioParams.text.length} Karakter
            </div>
        </main>

        {/* MOBİL BUTTON BAR */}
        <div className="lg:hidden p-4 border-t border-gray-100 bg-white z-20 relative shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex gap-3 mb-3">
                <button 
                    onClick={() => setActiveMobileView('voice_select')}
                    className="flex-1 flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${selectedVoice.isCloned ? 'bg-blue-600' : 'bg-gradient-to-br from-gray-700 to-black'}`}>
                        {selectedVoice.isCloned ? <Mic className="w-4 h-4" /> : (selectedVoice.avatar || selectedVoice.name[0])}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate flex-1 text-left">{selectedVoice.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                    onClick={() => setActiveMobileView('settings')}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isGenerating || !studioParams.text.trim()}
                className="w-full bg-black text-white font-medium text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-gray-200 active:scale-[0.98] transition-transform"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ses Üret'}
            </button>
        </div>
      </div>

      {/* ================= RIGHT SIDEBAR ================= */}
      <div className="hidden lg:flex w-[380px] border-l border-gray-100 bg-gray-50/30 flex-col">
         <div className="flex items-center h-16 px-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            {desktopView !== 'settings' ? (
                <button onClick={() => setDesktopView('settings')} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Geri
                </button>
            ) : (
                <div className="flex items-center gap-2 text-gray-900">
                    <Sliders className="w-4 h-4" />
                    <span className="text-sm font-bold">Ayarlar</span>
                </div>
            )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
             {desktopView === 'voice_select' && <VoiceListContent onSelect={(id) => { updateParam('voice_id', id); setDesktopView('settings'); }} />}
             
             {desktopView === 'settings' && (
                <div className="space-y-8">
                    {/* Voice Card */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Ses</label>
                        <div 
                            onClick={() => setDesktopView('voice_select')}
                            className="group relative bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-black hover:shadow-md transition-all flex items-center gap-3"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${selectedVoice.isCloned ? 'bg-blue-600' : 'bg-gradient-to-br from-gray-800 to-black'}`}>
                                {selectedVoice.isCloned ? <Mic className="w-5 h-5" /> : (selectedVoice.avatar || selectedVoice.name[0])}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm">{selectedVoice.name}</div>
                                <div className="text-xs text-gray-500">{selectedVoice.isCloned ? 'Klonlanmış Ses' : 'Sizin için önerilen'}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                        </div>
                    </div>
                    
                    <SettingsContent />
                </div>
             )}
        </div>

        {/* Desktop Generate Button */}
        <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-3 px-1">
                <span>Tahmini Maliyet</span>
                <span className="text-gray-900 font-bold">{estimatedCredits} kredi</span>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !studioParams.text.trim()}
                className="w-full bg-black text-white font-medium py-3.5 rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
            >
                    {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isGenerating ? 'Üretiliyor...' : 'Ses Üret'}
            </button>
        </div>
      </div>

      {/* ================= MOBİL OVERLAYS (EKLENDİ) ================= */}
      {activeMobileView && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setActiveMobileView(null)} />
            <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        {activeMobileView === 'voice_select' ? 'Ses Seç' : 'Ayarlar'}
                    </h2>
                    <button onClick={() => setActiveMobileView(null)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Burada "pb-40" vererek, mobile player'ın alt kısmında kalan 
                   içeriğin scroll edilince görünmesini sağlıyoruz. 
                */}
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1 pb-40">
                    {activeMobileView === 'voice_select' && <VoiceListContent onSelect={(id) => { updateParam('voice_id', id); setActiveMobileView(null); }} />}
                    {activeMobileView === 'settings' && <SettingsContent />}
                </div>
            </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
        textarea:focus { outline: none; }
      `}</style>
    </div>
  );
}