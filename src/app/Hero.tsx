'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Mic, Play, Globe, Wand2, Layers, ArrowRight, User, Type, Pause, ChevronDown, CheckCircle2, Loader2, Volume2 } from 'lucide-react';
import axios from 'axios';

// DEMO SESLERİ (Hazır mp3 dosyaları ile)
const VOICES = [
  {
    id: "1",
    name: "Mert - Belgesel",
    desc: "Sakin, Derin, Otoriter Ton",
    avatarLabel: "MB",
    color: "bg-slate-900",
    demoFile: "1.mp3",
    demoText: "Asırlar boyunca, antik medeniyetler büyük sırlar sakladı."
  },
  {
    id: "2",
    name: "Emel - Masalcı",
    desc: "Yumuşak, Akıcı, Heyecanlı",
    avatarLabel: "EM",
    color: "bg-purple-600",
    demoFile: "2.mp3",
    demoText: "Bir varmış bir yokmuş, uzak diyarlarda güzel bir prenses varmış."
  },
  {
    id: "3",
    name: "Aslı - Youtube",
    desc: "Enerjik, Hızlı, Viral Ton",
    avatarLabel: "AY",
    color: "bg-red-600",
    demoFile: "3.mp3",
    demoText: "Merhaba arkadaşlar! Bugün harika bir deneyim paylaşacağım."
  },
  {
    id: "4",
    name: "Merve - Çocuk",
    desc: "İnce, Naif, Çocuksu",
    avatarLabel: "MÇ",
    color: "bg-pink-500",
    demoFile: "4.mp3",
    demoText: "Selam! Ben Merve. Bugün birlikte oyun oynayalım!"
  }
];

// DUYGU SEÇENEKLERİ
const EMOTION_OPTIONS = [
  { value: 'happy', label: 'Mutlu', color: 'bg-yellow-100 text-yellow-700', icon: '😊' },
  { value: 'sad', label: 'Üzgün', color: 'bg-blue-100 text-blue-700', icon: '😢' },
  { value: 'neutral', label: 'Nötr', color: 'bg-gray-100 text-gray-700', icon: '😐' },
  { value: 'angry', label: 'Kızgın', color: 'bg-red-100 text-red-700', icon: '😠' },
  { value: 'fearful', label: 'Korkmuş', color: 'bg-purple-100 text-purple-700', icon: '😨' },
  { value: 'calm', label: 'Sakin', color: 'bg-green-100 text-green-700', icon: '😌' },
  { value: 'disgusted', label: 'İğrenmiş', color: 'bg-orange-100 text-orange-700', icon: '🤢' },
  { value: 'surprised', label: 'Şaşırmış', color: 'bg-pink-100 text-pink-700', icon: '😲' },
  { value: 'fluent', label: 'Akıcı', color: 'bg-indigo-100 text-indigo-700', icon: '🗣️' }
];

// DİL SEÇENEKLERİ
const LANGUAGE_OPTIONS = [
  { value: 'Turkish', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'English', label: 'English', flag: '🇺🇸' }
];

// Kullanıcı authentication durumuna göre buton gösterimi
function MainCTAButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="pt-4">
        <div className="bg-slate-200 animate-pulse text-lg px-8 py-4 rounded-xl">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (session) {
    // Giriş yapmış kullanıcı - Panele Git butonu
    return (
      <div className="pt-4">
        <Link href="/dashboard">
          <button className="bg-slate-900 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:-translate-y-1 transform duration-200">
            Panele Git
          </button>
        </Link>
        <p className="text-xs text-slate-400 mt-4">Hoş geldin, {session.user?.email || 'Kullanıcı'}!</p>
      </div>
    );
  }

  // Giriş yapmamış kullanıcı - Ücretsiz Başlayın butonu
  return (
    <div className="pt-4">
      <Link href="/register">
        <button className="bg-slate-900 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:-translate-y-1 transform duration-200">
          Ücretsiz Başlayın
        </button>
      </Link>
      <p className="text-xs text-slate-400 mt-4">Kredi kartı gerekmez • 500 karakter hediye</p>
    </div>
  );
}

// Navigation için authentication butonları
function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-8 bg-slate-200 animate-pulse rounded"></div>
        <div className="w-16 h-8 bg-slate-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
          Panel
        </Link>
        <Link href="/api/auth/signout" className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Çıkış
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
        Giriş Yap
      </Link>
      <Link href="/register" className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition">
        Kayıt Ol
      </Link>
    </div>
  );
}

const Hero = () => {
  // DEMO STATES
  const [text, setText] = useState(VOICES[0].demoText);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('Turkish');
  
  // Audio State
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ses seçimi değiştiğinde
  const handleVoiceSelect = (voice: typeof VOICES[0]) => {
    setSelectedVoice(voice);
    if (isDemoMode) {
      // Demo modunda hazır ses dosyasını kullan
      setText(voice.demoText);
      setAudioUrl(`/audio/${voice.demoFile}`);
      setIsPlaying(false);
    }
  };

  // Demo modunu değiştir
  const toggleDemoMode = (demoMode: boolean) => {
    setIsDemoMode(demoMode);
    if (demoMode) {
      setText(selectedVoice.demoText);
      setAudioUrl(`/audio/${selectedVoice.demoFile}`);
    } else {
      setText("");
      setAudioUrl(null);
    }
    setIsPlaying(false);
  };

  // Ses oluşturma fonksiyonu - Sadece custom metin için
  const handleGenerate = async () => {
    if (!text) return;
    
    // Demo modunda generate butonuna gerek yok, direk play edilebilir
    if (isDemoMode) {
      if (audioUrl && audioRef.current) {
        togglePlay();
      }
      return;
    }

    // Custom metin için TTS API çağrısı
    setLoading(true);
    setIsPlaying(false);
    setAudioUrl(null);

    try {
      // Custom metin için demo API kullan (voice mapping ve IP rate limiting için)
      console.log("🔊 Demo API çağrısı:", text.slice(0, 50) + "...", selectedEmotion, selectedLanguage);
      const response = await axios.post('/api/demo', {
        voiceId: selectedVoice.id,
        emotion: selectedEmotion,
        language: selectedLanguage,
        customText: text // Custom text için özel parametre
      });

      console.log("Demo API Response:", response.data);

      if (response.data.success && response.data.output) {
        setAudioUrl(response.data.output);
        console.log("✅ Ses başarıyla oluşturuldu:", response.data.output);
      } else {
        throw new Error(response.data.error || 'Ses oluşturulamadı');
      }

    } catch (error: any) {
      console.error("❌ Demo API Hata:", error);
      const errorMsg = error.response?.data?.error || error.message || 'Demo ses üretimi başarısız';
      
      // Rate limit hatası özel mesajı
      if (error.response?.status === 429) {
        alert(`Demo Limiti: ${errorMsg}`);
      } else {
        alert(`Hata: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Oynat/Duraklat
  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Oynatma hatası:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Ses bitince butonu sıfırla
  const onAudioEnded = () => {
    setIsPlaying(false);
  };

  // API'den ses gelince otomatik çal (sadece custom metin için)
  useEffect(() => {
    if (audioUrl && audioRef.current && !isDemoMode) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Otomatik oynatma hatası:", e);
      });
    }
  }, [audioUrl, isDemoMode]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Arka Plan Deseni */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0"></div>

      {/* NAVBAR */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo - Ana Sayfaya Dönmek İçin Link */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="M4.93 10.93a10 10 0 0 1 14.14 0"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Yankı</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition">Ürünler</a>
          <a href="#" className="hover:text-blue-600 transition">Kullanım Alanları</a>
          <Link href="/pricing" className="hover:text-blue-600 transition">Fiyatlandırma</Link>
        </div>

        <AuthButtons />
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-2 pb-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* SOL TARAFTAKİ KARTLAR */}
          <div className="hidden lg:flex col-span-3 flex-col gap-6 animate-fade-in-up delay-100">
            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition duration-300 rotate-[-2deg]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-900">Ses Stilleri</span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">TTS</span>
              </div>
              <div className="space-y-2">
                {['Doğal', 'Enerjik', 'Sakin', 'Profesyonel'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-medium text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-900">Sesini Klonla</span>
                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full border border-orange-100">🔥 HOT</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 border border-slate-100">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-600">
                    <User size={20} />
                 </div>
                 <p className="text-xs text-center text-slate-500">30 saniye kayıt yeterli, yapay zeka senin sesinle konuşur.</p>
              </div>
              <button className="w-full mt-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                Hemen Klonla
              </button>
            </div>
          </div>

          {/* ORTA ALAN: ANA METİN */}
          <div className="col-span-1 lg:col-span-6 text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-1 py-1 pr-4 shadow-sm hover:shadow-md transition cursor-pointer group">
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">YAKINDA</span>
              <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition">Deşifre özelliği yakında geliyor!</span>
              <ArrowRight size={12} className="text-slate-400 group-hover:translate-x-1 transition" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Sesini <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Yankıla!</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Yapay zeka ile kendi sesini klonla ve gerçekçi dublajlar üret. 500 karakter hediyeyle hemen başla, içerik üretiminde devrim yap!
            </p>


            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Ses Klonlama', 'Gerçekçi Dublaj', '500 Karakter Hediye'].map((tag, i) => (
                <span key={i} className={`px-4 py-1.5 rounded-lg text-sm font-medium border ${i === 0 ? 'bg-orange-50 text-orange-600 border-orange-200' : i === 2 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                  {tag}
                </span>
              ))}
            </div>

            <MainCTAButton />

          </div>

          {/* SAĞ TARAFTAKİ KARTLAR */}
          <div className="hidden lg:flex col-span-3 flex-col gap-6 animate-fade-in-up delay-200">
             {/* ... (Bu kısımdaki kart kodları da aynı kalacak) ... */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition duration-300 rotate-[2deg]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-900">Kayıt</span>
                <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-100">Aktif</span>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <Mic size={14} className="text-white" />
                 </div>
                 <div className="flex gap-0.5 items-end h-6">
                    {[4,8,3,7,9,2,6,4,8,5,3,6].map((h, i) => (
                        <div key={i} className="w-1 bg-slate-800 rounded-full" style={{height: `${h * 10}%`}}></div>
                    ))}
                 </div>
                 <span className="text-xs font-mono text-slate-500 ml-auto">01:23</span>
              </div>

              <button className="w-full mt-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <Wand2 size={12} />
                Sesi Üret
              </button>
            </div>

             <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-900">Çoklu Dil</span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-100">TTS</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3 leading-snug">
                İçeriğinizi zahmetsizce 20+ dile çevirin ve yerel aksanla seslendirin.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Türkçe', 'İngilizce', 'Almanca', 'İspanyolca'].map((lang, i) => (
                  <span key={i} className={`text-[10px] font-medium px-2 py-1 rounded border ${i === 0 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                    {lang}
                  </span>
                ))}
              </div>
              <button className="w-full mt-4 py-1.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 hover:text-slate-900 transition">
                Tüm Dilleri Gör
              </button>
            </div>
          </div>
         </div>
      </main>

      {/* DEMO SECTION - Hero İçinde Entegre */}
      <section id="demo" className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20">
        
        {/* Demo Section Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Hemen <span className="text-blue-600">Deneyin!</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Yapay zeka destekli ses teknolojimizi test edin. Demo seslerle deneyimleyin veya kendi metninizi seslendirin.
          </p>
        </div>

        {/* Demo Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => toggleDemoMode(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-sm border font-semibold transition ${
              isDemoMode
                ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-500'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Play size={18} />
            Demo Sesler
          </button>
          <button
            onClick={() => toggleDemoMode(false)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-sm border font-semibold transition ${
              !isDemoMode
                ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-500'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Type size={18} />
            Özel Metin
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-transparent rounded-full border border-transparent text-slate-500 font-medium hover:bg-white hover:shadow-sm transition opacity-50 cursor-not-allowed">
            <Mic size={18} />
            Ses Klonlama
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full ml-1">Yakında</span>
          </button>
        </div>

        {/* Demo Kartı */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* Sol Panel: Input & Ayarlar */}
          <div className="lg:col-span-7 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
            
            {/* Metin Girişi */}
            <div className="mb-8 relative">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  {isDemoMode ? 'Demo Metni' : 'Özel Metniniz'}
                </label>
                <div className="flex items-center gap-2">
                  {/* Karakter Sayacı */}
                  <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    text.length > 100
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {text.length}/100
                  </div>
                  {/* Emotion Badge */}
                  {(() => {
                    const emotion = EMOTION_OPTIONS.find(e => e.value === selectedEmotion);
                    return emotion ? (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${emotion.color} flex items-center gap-1`}>
                        <span>{emotion.icon}</span>
                        {emotion.label}
                      </div>
                    ) : null;
                  })()}
                  {/* Language Badge */}
                  {(() => {
                    const lang = LANGUAGE_OPTIONS.find(l => l.value === selectedLanguage);
                    return lang ? (
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
                        <span>{lang.flag}</span>
                        {lang.label}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
              
              <div className="relative group">
                <textarea
                  className={`w-full h-40 p-4 text-lg text-slate-700 font-medium bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition placeholder:text-slate-300 leading-relaxed ${
                    isDemoMode ? 'cursor-not-allowed bg-slate-100/50' : ''
                  }`}
                  placeholder={isDemoMode ? "Demo metni otomatik seçilir..." : "Buraya seslendirmek istediğiniz metni yazın..."}
                  value={text}
                  onChange={(e) => !isDemoMode && setText(e.target.value)}
                  readOnly={isDemoMode}
                ></textarea>
                
                {/* Generate Butonu */}
                <div className="absolute bottom-4 right-4">
                   {isDemoMode ? (
                     <button
                      onClick={handleGenerate}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transform active:scale-95"
                     >
                        <Play size={14} />
                        Demo Dinle
                     </button>
                   ) : (
                     <>
                       <button
                        onClick={handleGenerate}
                        disabled={loading || !text || text.length > 100}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                       >
                          {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                          {loading ? 'Üretiliyor...' : 'Oluştur'}
                       </button>
                       {text.length > 100 && (
                         <div className="absolute -top-12 right-0 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 whitespace-nowrap">
                           <div className="font-medium">Daha uzun metinler için</div>
                           <div className="text-blue-600 underline cursor-pointer">Ücretsiz üye olun</div>
                         </div>
                       )}
                     </>
                   )}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 mb-6"></div>

            {/* Emotion ve Language Seçiciler - Sadece Custom modda */}
            {!isDemoMode && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                
                {/* Emotion Seçici */}
                <div>
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block">Duygu Tonu</label>
                  <div className="relative">
                    <select
                      value={selectedEmotion}
                      onChange={(e) => setSelectedEmotion(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      {EMOTION_OPTIONS.map(emotion => (
                        <option key={emotion.value} value={emotion.value}>
                          {emotion.icon} {emotion.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Language Seçici */}
                <div>
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block">Dil</label>
                  <div className="relative">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.flag} {lang.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            )}

            {/* Ses Listesi */}
            <div className="flex-1">
               <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 block">
                 {isDemoMode ? 'Demo Sesler' : 'Hazır Sesler'}
               </label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {VOICES.map((voice) => (
                    <div
                        key={voice.id}
                        onClick={() => handleVoiceSelect(voice)}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${selectedVoice.id === voice.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' : 'border-transparent hover:bg-slate-50 hover:border-slate-100'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${voice.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                {voice.avatarLabel}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`text-sm font-bold ${selectedVoice.id === voice.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                      {voice.name}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-500">{voice.desc}</p>
                                {isDemoMode && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                    "{voice.demoText}"
                                  </p>
                                )}
                            </div>
                        </div>
                        {selectedVoice.id === voice.id && (
                            <div className="bg-white rounded-full p-1 shadow-sm">
                                <CheckCircle2 size={20} className="text-blue-600" fill="currentColor" color="white" />
                            </div>
                        )}
                    </div>
                  ))}

               </div>
            </div>

          </div>

          {/* Sağ Panel: Preview & Player */}
          <div className="lg:col-span-5 bg-slate-50/50 p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden">
             
             {/* Arka plan efekti */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

             {/* Player Kartı */}
             <div className="w-full max-w-[300px] bg-white rounded-[2.5rem] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 relative z-10 transition-all duration-500 group">
                
                {/* Albüm Kapağı / Avatar */}
                <div className="w-full aspect-square bg-slate-900 rounded-[2rem] mb-6 relative overflow-hidden shadow-inner">
                   
                   {/* Dinamik Arka Plan Rengi */}
                   <div className={`absolute inset-0 ${selectedVoice.color} opacity-90 transition-colors duration-500`}></div>
                   
                   {/* Görsel */}
                   <img
                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=388&auto=format&fit=crop"
                    alt="Voice Avatar"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition duration-700"
                   />
                   
                   {/* Play Butonu Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center">
                      {loading ? (
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                      ) : audioUrl ? (
                          <button
                            onClick={togglePlay}
                            className="w-16 h-16 bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition active:scale-95 group/play"
                          >
                             {isPlaying ? (
                               <Pause fill="currentColor" className="text-slate-900 w-6 h-6" />
                             ) : (
                               <Play fill="currentColor" className="text-slate-900 w-6 h-6 ml-1 group-hover/play:text-blue-600 transition" />
                             )}
                          </button>
                      ) : (
                          <div className="flex flex-col items-center gap-2 animate-fade-in">
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Volume2 className="text-white w-6 h-6 opacity-70" />
                             </div>
                             <span className="text-white/80 text-xs font-medium px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">
                                Ses Bekleniyor
                             </span>
                          </div>
                      )}
                   </div>

                   {/* Waveform Animasyonu (Sadece çalarken) */}
                   {isPlaying && (
                       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 h-8 items-end px-8">
                          {[40, 70, 30, 80, 50, 90, 60, 40, 70, 30, 50, 80].map((h, i) => (
                             <div key={i} className="w-1.5 bg-white/90 rounded-full animate-pulse shadow-sm" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}></div>
                          ))}
                       </div>
                   )}
                </div>

                {/* İsim ve Kontrol */}
                <div className="text-center px-2 pb-2">
                   <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedVoice.name}</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Yapay Zeka Tutor</p>
                </div>
                
                {/* Hidden Audio Element */}
                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={onAudioEnded}
                        className="hidden"
                    />
                )}

             </div>

             {/* Dil Seçimi (Alt Kısım - Süs) */}
             <div className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition group">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                   <img src="https://flagcdn.com/tr.svg" alt="Turkish" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition">Turkish (TR)</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500 transition" />
             </div>

          </div>

        </div>

      </section>
   </div>
  );
};

export default Hero;
