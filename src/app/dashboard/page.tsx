'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Play, ChevronDown, Sparkles, Wand2, Mic, Compass, History, FileText, Settings, Zap, MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { voices } from '@/lib/voices';
import { useAudio } from '@/contexts/AudioProvider';
import { AudioTrack } from '@/types/audio';
import { Inter } from 'next/font/google';

// Inter fontunu yapılandır
const inter = Inter({ subsets: ['latin'] });

interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
  plan: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { controls } = useAudio();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(voices[0]?.id || 'Spanish_SophisticatedLady');
  const [emotion, setEmotion] = useState('happy');
  const [language, setLanguage] = useState('Turkish');
  const [selectedModel, setSelectedModel] = useState('speech-2.6-hd');

  const emotions = [
    { value: 'happy', label: 'Mutlu' },
    { value: 'sad', label: 'Üzgün' },
    { value: 'neutral', label: 'Doğal' },
    { value: 'angry', label: 'Kızgın' },
    { value: 'calm', label: 'Sakin' },
    { value: 'fluent', label: 'Akıcı' }
  ];

  useEffect(() => {
    if (session?.user?.id) fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    const baseCharacterCount = text.length;
    const creditMultiplier = selectedModel === 'speech-2.6-turbo' ? 0.6 : 1.0;
    const requiredCredits = Math.ceil(baseCharacterCount * creditMultiplier);
    const availableCredits = userData?.credits || 0;
    
    if (availableCredits < requiredCredits) {
      alert(`Yetersiz kredi! ${requiredCredits} kredi gerekiyor.`);
      return;
    }

    setIsGenerating(true);
    setGeneratingProgress(0);
    
    const selectedVoiceData = voices.find(v => v.id === selectedVoice) || voices[0];
    const loadingTrack: AudioTrack = {
      id: `loading-${Date.now()}`,
      title: `${selectedVoiceData.name}: ${text.substring(0, 30)}...`,
      voiceCharacter: selectedVoiceData.name,
      voiceId: selectedVoice,
      audioUrl: '',
      duration: 0,
      metadata: { text, emotion, language, model: selectedModel, characterCount: text.length }
    };
    controls.addToQueue(loadingTrack);
    
    const progressInterval = setInterval(() => {
      setGeneratingProgress(prev => (prev >= 90 ? prev : prev + Math.random() * 15));
    }, 200);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: selectedVoice, emotion, language, model: selectedModel })
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setGeneratingProgress(100);
      
      if (data.success) {
        const audioUrl = data.output || data.audioUrl;
        controls.removeFromQueue(loadingTrack.id);
        const audioTrack: AudioTrack = {
          ...loadingTrack,
          id: `tts-${Date.now()}`,
          audioUrl: audioUrl.trim(),
        };
        controls.addToQueue(audioTrack);
        await controls.play(audioTrack);
        setUserData(prev => prev ? { ...prev, credits: data.remainingCredits } : null);
      } else {
        controls.removeFromQueue(loadingTrack.id);
        alert(data.error || 'Başarısız!');
      }
    } catch (error) {
      controls.removeFromQueue(loadingTrack.id);
      alert('Hata oluştu!');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratingProgress(0);
      }, 1000);
    }
  };

  const selectedVoiceData = voices.find(v => v.id === selectedVoice) || voices[0];

  return (
    <div className={`max-w-[1200px] mx-auto ${inter.className}`}>
      {/* Header Info */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Hoş geldin, {userData?.name?.split(' ')[0]}</h1>
          <p className="text-gray-500">Bugün ne oluşturmak istersin?</p>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Kalan Kredi</div>
           <div className="text-2xl font-bold text-gray-900">{userData?.credits?.toLocaleString() ?? 0}</div>
        </div>
      </div>

      {/* Grid Cards (Hızlı İşlemler) - YUKARI TAŞINDI */}
      <h3 className="text-lg font-bold text-gray-900 mb-6">Keşfet ve Üret</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        <QuickActionCard 
          title="Ses Klonlama" 
          desc="Kendi sesinizi veya bir başkasının sesini yapay zeka ile kopyalayın."
          icon={<Mic className="w-6 h-6 text-purple-600" />}
          href="/dashboard/cloning"
          color="bg-purple-50"
        />

        <QuickActionCard 
          title="Ses Deşifresi" 
          desc="Ses ve video dosyalarınızı saniyeler içinde metne dökün."
          icon={<FileText className="w-6 h-6 text-orange-600" />}
          href="/dashboard/transcribe"
          color="bg-orange-50"
        />

        <QuickActionCard 
          title="Ses Kütüphanesi" 
          desc="100'den fazla profesyonel sesi keşfedin ve projelerinizde kullanın."
          icon={<Compass className="w-6 h-6 text-indigo-600" />}
          href="/dashboard/voices"
          color="bg-indigo-50"
        />

        <QuickActionCard 
          title="Stüdyo" 
          desc="Detaylı ayarlar ile profesyonel seslendirme projeleri oluşturun."
          icon={<Settings className="w-6 h-6 text-gray-600" />}
          href="/dashboard/studio"
          color="bg-gray-50"
        />

        <QuickActionCard 
          title="Geçmiş" 
          desc="Daha önce ürettiğiniz tüm seslere buradan ulaşın."
          icon={<History className="w-6 h-6 text-green-600" />}
          href="/dashboard/history"
          color="bg-green-50"
        />

        <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
           <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <Zap className="w-6 h-6 text-white" />
           </div>
           <h3 className="font-bold text-lg mb-2">Paket Yükselt</h3>
           <p className="text-blue-100 text-sm mb-4">Daha fazla kredi ve özellik için Pro plana geçin.</p>
           <button className="text-sm font-semibold bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Planları Gör</button>
        </div>

      </div>

      {/* Main Creation Card (TTS) - AŞAĞI TAŞINDI */}
      <h3 className="text-lg font-bold text-gray-900 mb-6">Hızlı Ses Üret</h3>
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white mb-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        
        <div className="max-w-3xl mx-auto text-center">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Sparkles className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Metni Sese Dönüştür</h2>
           <p className="text-gray-500 mb-8">İstediğin metni yaz, yapay zeka saniyeler içinde seslendirsin.</p>

           <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl opacity-20 group-focus-within:opacity-40 transition duration-300 blur"></div>
             <textarea
               value={text}
               onChange={(e) => setText(e.target.value)}
               className="relative w-full h-40 bg-white border border-gray-200 rounded-xl p-6 text-lg text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-0 resize-none shadow-inner"
               placeholder="Buraya metninizi yazın..."
             ></textarea>
           </div>

           {/* Controls Bar */}
           <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              
              {/* Voice Selector */}
              <div className="relative group">
                <select 
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 py-3 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all cursor-pointer min-w-[200px]"
                >
                  {voices.map(voice => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Settings Group */}
              <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
                 <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-700 py-2 px-3 rounded-lg focus:outline-none cursor-pointer hover:bg-white hover:shadow-sm transition-all"
                 >
                    <option value="Turkish">Türkçe</option>
                    <option value="English">English</option>
                 </select>
                 <div className="w-px bg-gray-200 my-1"></div>
                 <select 
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-700 py-2 px-3 rounded-lg focus:outline-none cursor-pointer hover:bg-white hover:shadow-sm transition-all"
                 >
                    {emotions.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                 </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className={`
                  relative overflow-hidden px-8 py-3 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
              >
                {isGenerating ? (
                   <span className="flex items-center gap-2 relative z-10">
                     <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     Oluşturuluyor...
                   </span>
                ) : (
                   <span className="relative z-10 flex items-center gap-2">
                     <Wand2 className="w-4 h-4" /> Ses Üret
                   </span>
                )}
                
                {isGenerating && (
                  <div 
                    className="absolute inset-0 bg-gray-800 transition-all duration-300"
                    style={{ width: `${generatingProgress}%` }}
                  ></div>
                )}
              </button>
           </div>
           
           <p className="text-xs text-gray-400 mt-4">
             Maliyet: {Math.ceil(text.length * (selectedModel === 'speech-2.6-turbo' ? 0.6 : 1.0))} kredi
           </p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, desc, icon, href, color }: any) {
  return (
    <Link href={href} className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </Link>
  );
}
