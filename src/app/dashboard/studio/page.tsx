'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAudio } from '@/contexts/AudioProvider';
import { AudioTrack } from '@/types/audio';
import { voices } from '@/lib/voices';
import {
  Settings, Check, ChevronRight, Search, Play, 
  ArrowLeft, Zap, Globe, Info, X, Loader2
} from 'lucide-react';

// --- Türkçe Veri Tipleri ---
interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
}

interface StudioParams {
  text: string;
  voice_id: string;
  emotion: string;
  speed: number;
  pitch: number;
  volume: number; // Kararlılık
  language: string;
  model: string;
  language_boost: boolean;
  english_normalization: boolean;
}

// Sidebar/Sheet içinde hangi ekranın görüneceğini yönetir
type ViewState = 'main' | 'settings' | 'voice_select' | 'model_select';

export default function StudioPage() {
  const { data: session } = useSession();
  const { controls } = useAudio();
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<ViewState | null>(null);
  const [desktopView, setDesktopView] = useState<ViewState>('settings');
  const [voiceSearch, setVoiceSearch] = useState('');

  // Studio Parameters - API uyumlu Türkçe default değerler
  const [studioParams, setStudioParams] = useState<StudioParams>({
    text: 'Merhaba, ben Yankı AI ses asistanınızım. Bu gelişmiş stüdyo ile profesyonel kalitede sesler üretebilirsiniz.',
    voice_id: 'English_Trustworth_Man',
    emotion: 'neutral',
    speed: 1.0,
    pitch: 0.5,
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

  // --- Veri Çekme ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUserData(data.user);
          }
        }
      } catch (error) {
        console.error('Kullanıcı verisi alınamadı:', error);
      }
    };
    if (session) fetchUserData();
  }, [session]);

  // --- Yardımcı Fonksiyonlar ---
  const updateParam = (key: keyof StudioParams, value: any) => {
    setStudioParams(prev => ({ ...prev, [key]: value }));
  };

  const selectedVoice = voices.find(v => v.id === studioParams.voice_id) || voices[0];
  const textLength = studioParams.text.length;
  
  // Turbo modeli seçilirse kredi tüketimi %40 azalır
  const creditMultiplier = studioParams.model === 'speech-2.6-turbo' ? 0.6 : 1.0;
  const estimatedCredits = Math.ceil(textLength * creditMultiplier);

  const filteredVoices = voices.filter(voice => 
    voice.name.toLowerCase().includes(voiceSearch.toLowerCase()) ||
    voice.description.toLowerCase().includes(voiceSearch.toLowerCase())
  );

  // --- Ses Üretme İşlemi ---
  const handleGenerate = async () => {
    // Kredi Kontrolü
    const userCredits = typeof userData?.credits === 'number' ? userData.credits : 0;
    if (!userData || userCredits < estimatedCredits) {
      alert(`Yetersiz kredi! ${estimatedCredits} kredi gerekiyor, ${userCredits} krediniz var.`);
      return;
    }

    setIsGenerating(true);

    // Kuyruğa "Üretiliyor..." ekle
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
      // API İsteği - Slider değerlerini validation range'ine dönüştürerek gönderiyoruz
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: studioParams.text,
          voiceId: studioParams.voice_id,
          emotion: studioParams.emotion,
          speed: studioParams.speed,                    // 0.5-2.0 (zaten doğru)
          pitch: studioParams.pitch * 24 - 12,          // 0-1 → -12 ile +12 arası
          volume: studioParams.volume * 10,             // 0-1 → 0 ile 10 arası
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
        
        // Kredileri güncelle
        if (userData && result.remainingCredits !== undefined) {
            setUserData({ ...userData, credits: result.remainingCredits });
        } else if (userData) {
            setUserData({ ...userData, credits: userCredits - estimatedCredits });
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

  // --- İÇERİK BİLEŞENLERİ (Hem Mobil Hem Desktop kullanır) ---

  // 1. Ayarlar ve Sliderlar
  const SettingsContent = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => (
    <div className="space-y-8">
        {/* Model Seçimi */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Model</label>
            <div 
                onClick={() => onNavigate('model_select')}
                className="group bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                   {studioParams.model.includes('turbo') ? <Zap className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">
                        {studioParams.model === 'speech-2.6-turbo' ? 'Turbo' : 'HD Kalite'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {studioParams.model === 'speech-2.6-turbo' ? 'Düşük gecikme, %40 ucuz' : 'Yüksek kalite, gerçekçi'}
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
        </div>

        {/* Sliderlar */}
        <div className="space-y-6 px-1">
            {/* Duygu */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Duygu</label>
                <div className="grid grid-cols-2 gap-2">
                    {emotions.map(e => (
                        <button
                            key={e.value}
                            onClick={() => updateParam('emotion', e.value)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm border transition-all ${
                                studioParams.emotion === e.value 
                                ? 'bg-gray-900 text-white border-gray-900' 
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <span>{e.icon}</span>
                            <span>{e.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Hız */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-700">Hız</span>
                    <span className="text-gray-400">{studioParams.speed}x</span>
                </div>
                <input
                    type="range" min="0.5" max="2" step="0.1"
                    value={studioParams.speed}
                    onChange={(e) => updateParam('speed', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
            </div>

            {/* Perde (Pitch) */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-700">Perde</span>
                    <span className="text-gray-400">{Math.round(studioParams.pitch * 100)}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.1"
                    value={studioParams.pitch}
                    onChange={(e) => updateParam('pitch', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>İnce</span>
                    <span>Kalın</span>
                </div>
            </div>

            {/* Volume */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-700">Volume</span>
                    <span className="text-gray-400">{Math.round(studioParams.volume * 100)}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.1"
                    value={studioParams.volume}
                    onChange={(e) => updateParam('volume', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
            </div>
            
            {/* Ayarlar */}
            <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer py-2">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                        Konuşmacı Güçlendirme <Info className="w-3 h-3 text-gray-400" />
                    </span>
                    <input 
                        type="checkbox" 
                        checked={studioParams.language_boost}
                        onChange={(e) => updateParam('language_boost', e.target.checked)}
                        className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
                    />
                </label>
            </div>
        </div>
    </div>
  );

  // 2. Ses Listesi
  const VoiceListContent = ({ onSelect }: { onSelect: (id: string) => void }) => (
    <div className="flex flex-col h-full">
        <div className="relative mb-4 px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Sesleri ara..." 
                value={voiceSearch}
                onChange={(e) => setVoiceSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            />
        </div>
        <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1">
            {filteredVoices.map((voice) => (
                <div 
                    key={voice.id}
                    onClick={() => onSelect(voice.id)}
                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                        studioParams.voice_id === voice.id 
                        ? 'bg-gray-50 border-gray-300 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                    }`}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 group-hover:scale-105 transition-transform">
                        {voice.avatar || voice.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{voice.name}</span>
                            {voice.isPremium && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">PRO</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{voice.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-300 hover:text-gray-900 hover:bg-white rounded-full transition-all" onClick={(e) => e.stopPropagation()}>
                            <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        {studioParams.voice_id === voice.id && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  // 3. Model Seçimi
  const ModelListContent = ({ onSelect }: { onSelect: (id: string) => void }) => (
      <div className="space-y-3 px-1">
          <div 
            onClick={() => onSelect('speech-2.6-turbo')}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
                studioParams.model === 'speech-2.6-turbo' ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current" /> Turbo
                </h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">%40 ucuz</span>
            </div>
            <p className="text-sm text-gray-600">Ultra düşük gecikme. Konuşma uygulamaları için ideal.</p>
        </div>

        <div 
            onClick={() => onSelect('speech-2.6-hd')}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
                studioParams.model === 'speech-2.6-hd' ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> HD Kalite
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Yüksek Kalite</span>
            </div>
            <p className="text-sm text-gray-600">En gerçekçi, duygusal açıdan zengin model.</p>
        </div>
      </div>
  );

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] lg:h-screen bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* ================= SOL / ANA ALAN (Metin Editörü) ================= */}
      <div className="flex-1 flex flex-col relative z-0">
        
        {/* Masaüstü Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-transparent lg:border-gray-100">
            <h1 className="font-bold text-gray-900 text-xl tracking-tight">Metin'den Ses'e</h1>
            {/* Masaüstü Kredi Bilgisi */}
            <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                 <div className={`w-2 h-2 rounded-full ${userData?.credits && userData.credits > 1000 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                 <span className="text-sm font-medium text-gray-600">{userData?.credits?.toLocaleString() ?? 0} kredi</span>
            </div>
        </header>

        {/* Metin Alanı */}
        <main className="flex-1 relative">
            <textarea
                value={studioParams.text}
                onChange={(e) => updateParam('text', e.target.value)}
                className="w-full h-full resize-none border-none focus:ring-0 text-lg lg:text-xl leading-relaxed text-gray-900 placeholder-gray-300 bg-transparent p-6 lg:p-8 pb-40 custom-scrollbar"
                placeholder="Metninizi buraya yazmaya başlayın..."
                spellCheck={false}
            />
        </main>

        {/* ================= MOBİL ALT ÇUBUK ================= */}
        <div className="lg:hidden bg-white border-t border-gray-100 p-4 pb-6 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-4px_30px_rgba(0,0,0,0.04)]">
            {/* Üst Sıra: Ses Seçimi ve Ayar Butonu */}
            <div className="flex items-center gap-3 mb-4">
                <button 
                    onClick={() => setActiveMobileView('voice_select')}
                    className="flex-1 flex items-center gap-3 border border-gray-200 rounded-full p-1.5 pr-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-xs font-bold">
                        {selectedVoice.avatar || selectedVoice.name[0]}
                    </div>
                    <span className="font-semibold text-sm text-gray-900 truncate">{selectedVoice.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>

                <button 
                    onClick={() => setActiveMobileView('settings')}
                    className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Ses Üret Butonu */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !studioParams.text.trim()}
                className="w-full bg-gray-950 text-white font-medium text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Üretiliyor...
                    </>
                ) : (
                    'Ses üret'
                )}
            </button>

            {/* Mobil Kredi ve Karakter Sayacı */}
            <div className="flex justify-between items-center mt-3 px-1 text-xs font-medium text-gray-400">
                <div className="flex items-center gap-1.5 text-orange-600">
                    <div className="w-2 h-2 rounded-full border border-current"></div>
                    {userData?.credits?.toLocaleString()} kredi kaldı
                </div>
                <span>{textLength} / 5.000</span>
            </div>
        </div>
      </div>

      {/* ================= MASAÜSTÜ SIDEBAR ================= */}
      <div className="hidden lg:flex w-[360px] border-l border-gray-200 bg-gray-50/50 flex-col">
        
        {/* Sidebar Nav Header */}
         <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            {desktopView !== 'settings' ? (
                <button 
                    onClick={() => setDesktopView('settings')} 
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Geri
                </button>
            ) : (
                <span className="text-sm font-semibold text-gray-900">Ayarlar</span>
            )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
             {desktopView === 'voice_select' && (
                 <VoiceListContent onSelect={(id) => { updateParam('voice_id', id); setDesktopView('settings'); }} />
             )}
             
             {desktopView === 'model_select' && (
                 <ModelListContent onSelect={(id) => { updateParam('model', id); setDesktopView('settings'); }} />
             )}

             {desktopView === 'settings' && (
                <div className="space-y-8">
                    {/* Ses Kartı */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Ses</label>
                        <div 
                            onClick={() => setDesktopView('voice_select')}
                            className="group relative bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                                {selectedVoice.avatar || selectedVoice.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-sm">{selectedVoice.name}</div>
                                <div className="text-xs text-gray-500">Sizin için önerilen</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    
                    <SettingsContent onNavigate={(view) => setDesktopView(view)} />
                    
                    {/* Ses Üret Butonu - Moved Higher */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-3 px-1">
                            <span>Maliyet: ~{estimatedCredits} kredi</span>
                            <span>{textLength} karakter</span>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !studioParams.text.trim()}
                            className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-black transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                             {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isGenerating ? 'Üretiliyor...' : 'Ses Üret'}
                        </button>
                    </div>
                </div>
             )}
        </div>
      </div>

      {/* ================= MOBİL OVERLAYS ================= */}
      {activeMobileView && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setActiveMobileView(null)}
            />
            
            <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {activeMobileView === 'voice_select' ? 'Ses Seç' : 
                         activeMobileView === 'model_select' ? 'Model Seç' : 'Ayarlar'}
                    </h2>
                    <button 
                        onClick={() => setActiveMobileView(null)}
                        className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {activeMobileView === 'voice_select' && (
                        <VoiceListContent onSelect={(id) => { updateParam('voice_id', id); setActiveMobileView(null); }} />
                    )}
                    {activeMobileView === 'model_select' && (
                         <ModelListContent onSelect={(id) => { updateParam('model', id); setActiveMobileView('settings'); }} />
                    )}
                    {activeMobileView === 'settings' && (
                        <SettingsContent onNavigate={(view) => setActiveMobileView(view)} />
                    )}
                </div>
            </div>
        </div>
      )}
      
      {/* Global CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
        }
        textarea:focus {
            outline: none;
        }
      `}</style>
    </div>
  );
}
