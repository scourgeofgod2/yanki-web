'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowRight, Play, Mic, Volume2, Pause, Loader2, 
  CheckCircle2, Mail, Sparkles, Users, Clock, Award, Globe
} from 'lucide-react';
import axios from 'axios';

// DEMO SESLERİ - API'de geçerli olan voice ID'leriyle
const DEMO_VOICES = [
  {
    id: "English_Trustworth_Man",
    name: "Mert",
    type: "Belgesel",
    color: "bg-blue-500",
    text: "Yapay zeka ile ses teknolojisinin geleceği burada.",
    demoFile: "1.mp3",
    avatarLabel: "MB",
    desc: "Erkek Belgesel Sesi"
  },
  {
    id: "English_Graceful_Lady",
    name: "Emel",
    type: "Podcast",
    color: "bg-purple-500",
    text: "Merhaba! Bu teknoloji gerçekten büyüleyici.",
    demoFile: "2.mp3",
    avatarLabel: "EM",
    desc: "Kadın Podcast Sesi"
  },
  {
    id: "English_CaptivatingStoryteller",
    name: "Aslı",
    type: "Reklam",
    color: "bg-pink-500",
    text: "Hayal ettiğiniz her sesi artık oluşturabilirsiniz!",
    demoFile: "3.mp3",
    avatarLabel: "AY",
    desc: "Kadın Reklam Sesi"
  },
  {
    id: "English_Persuasive_Man",
    name: "Mehmet",
    type: "Çizgi Film",
    color: "bg-green-500",
    text: "Çocuklar için eğlenceli hikayeler anlatıyorum!",
    demoFile: "4.mp3",
    avatarLabel: "MÇ",
    desc: "Erkek Çizgi Film Sesi"
  }
];

// TÜRK FİRMALARI
const TURKISH_COMPANIES = [
  { name: "Turkcell", logo: "TC" },
  { name: "İş Bankası", logo: "İB" },
  { name: "TRT", logo: "TRT" },
  { name: "Akbank", logo: "AB" },
  { name: "Migros", logo: "MG" },
  { name: "Hürriyet", logo: "HR" }
];

// Navigation Authentication
function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link href="/dashboard" className="font-medium text-gray-600 hover:text-gray-900 transition">
          Panele Git
        </Link>
        <Link href="/api/auth/signout" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Çıkış Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/login" className="font-medium text-gray-600 hover:text-gray-900 transition">
        Sign In
      </Link>
      <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Try now - for free
      </Link>
    </div>
  );
}

// Email CTA Component - Copychat Style
function EmailCTA() {
  const [email, setEmail] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex w-full max-w-md">
        <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded-l-xl"></div>
        <div className="w-32 h-12 bg-gray-300 animate-pulse rounded-r-xl"></div>
      </div>
    );
  }

  // Giriş yapmış kullanıcı için özel görünüm
  if (session) {
    const userName = session.user?.name || session.user?.email?.split('@')[0] || 'Kullanıcı';
    return (
      <div className="w-full max-w-md">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Hoşgeldin, <span className="text-blue-600">{userName}</span>! 👋
          </h3>
          <p className="text-gray-600 mt-1">Ses üretmeye hazır mısın?</p>
        </div>
        <Link href="/dashboard">
          <button className="w-full px-6 py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Panele Git
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  // Giriş yapmamış kullanıcı için email form
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email adresinizi girin"
        className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        required
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-r-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        Başlayın
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

// Demo Audio Player - Original System with Demo Voices + Custom Text
function DemoPlayer() {
  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo');
  const [selectedVoice, setSelectedVoice] = useState(DEMO_VOICES[0]);
  const [customText, setCustomText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('Turkish');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_CHARS = 100;
  const remainingChars = MAX_CHARS - customText.length;

  const emotions = [
    { value: 'happy', label: '😊 Mutlu' },
    { value: 'sad', label: '😢 Üzgün' },
    { value: 'neutral', label: '😐 Nötr' },
    { value: 'angry', label: '😠 Kızgın' }
  ];

  const languages = [
    { value: 'Turkish', label: '🇹🇷 Türkçe' },
    { value: 'English', label: '🇺🇸 English' }
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setCustomText(text);
    }
  };

  const handleVoiceSelect = (voice: typeof DEMO_VOICES[0]) => {
    setSelectedVoice(voice);
    if (activeTab === 'demo') {
      // Demo tabında hazır ses çal
      setAudioUrl(`/audio/${voice.demoFile}`);
      setIsPlaying(false);
    }
  };

  const handleGenerate = async () => {
    if (activeTab === 'demo') {
      // Demo sesi çal
      if (audioUrl && audioRef.current) {
        togglePlay();
      }
      return;
    }

    // Custom text için TTS API çağrısı
    const textToUse = customText.trim();
    if (!textToUse) return;

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/tts', {
        text: textToUse,
        voiceId: selectedVoice.id,
        emotion: selectedEmotion,
        language: selectedLanguage,
        model: 'speech-2.6-turbo' // Turbo model for demo
      });

      if (response.data.success) {
        const newAudioUrl = response.data.audioUrl || response.data.output;
        setAudioUrl(newAudioUrl);
        
        // Cevap gelir gelmez otomatik ses çalma
        setTimeout(() => {
          if (audioRef.current && newAudioUrl) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(e => console.error("Otomatik oynatma hatası:", e));
          }
        }, 100);
      } else {
        console.error('TTS Error:', response.data.error);
        alert(response.data.error || 'Ses üretimi başarısız oldu');
      }
    } catch (error: any) {
      console.error('TTS API Error:', error);
      if (error.response?.status === 401) {
        alert('Ses üretmek için giriş yapmanız gerekiyor');
      } else if (error.response?.status === 402) {
        alert('Yetersiz kredi. Lütfen kredi satın alın.');
      } else {
        alert('Ses üretimi başarısız oldu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Oynatma hatası:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('demo')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'demo'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎵 Demo Sesler
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'custom'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✏️ Özel Metin
        </button>
      </div>

      {/* Demo Voices Tab */}
      {activeTab === 'demo' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Ready Voices Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">HAZIR SESLER</h4>
            <div className="space-y-3">
              {DEMO_VOICES.map((voice) => (
                <div
                  key={voice.id}
                  onClick={() => handleVoiceSelect(voice)}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${
                    selectedVoice.id === voice.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 ${voice.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {voice.avatarLabel}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{voice.name}</div>
                    <div className="text-sm text-gray-500">{voice.desc}</div>
                  </div>
                  {selectedVoice.id === voice.id && (
                    <CheckCircle2 size={20} className="text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Play Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <strong>Seçili:</strong> {selectedVoice.name}
            </div>
            <div className="flex items-center gap-3">
              {audioUrl && (
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span className="text-sm font-medium">
                    {isPlaying ? 'Duraklat' : 'Dinle'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Text Tab */}
      {activeTab === 'custom' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Text Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">ÖZEL METNİNİZ</h4>
              <span className={`text-sm font-mono ${
                remainingChars < 10 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {customText.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              value={customText}
              onChange={handleTextChange}
              placeholder="Buraya seslendirmek istediğiniz metni yazın..."
              className="w-full h-24 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent overflow-auto"
              style={{ minHeight: '96px', maxHeight: '96px', whiteSpace: 'pre-wrap' }}
            />
          </div>

          {/* Voice Selection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">HAZIR SESLER</h4>
            <div className="flex gap-2 flex-wrap">
              {DEMO_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedVoice.id === voice.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 ${voice.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {voice.avatarLabel}
                  </div>
                  {voice.name}
                </button>
              ))}
            </div>
          </div>

          {/* Emotion & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">DUYGU TONU</h5>
              <select
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {emotions.map((emotion) => (
                  <option key={emotion.value} value={emotion.value}>
                    {emotion.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">DİL</h5>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {languages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!customText.trim())}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Mic size={16} />
              )}
              <span className="font-medium">
                {isGenerating ? 'Oluşturuluyor...' : 'Oluştur'}
              </span>
            </button>

            {/* Audio Player */}
            {audioUrl && (
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span className="text-sm font-medium">
                  {isPlaying ? 'Duraklat' : 'Dinle'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}

const Hero = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              Y
            </div>
            <span className="text-xl font-bold text-gray-900">Yankı</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#demo" className="hover:text-gray-900 transition">Demo</a>
            <Link href="/pricing" className="hover:text-gray-900 transition">Fiyatlandırma</Link>
            <a href="#features" className="hover:text-gray-900 transition">Özellikler</a>
          </div>

          <AuthButtons />
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Sol Taraf - Content */}
          <div className="space-y-8">
            
            {/* Announcement Badge with Urgency */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-sm text-red-700">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-medium">🔥 Bu ayın son 48 üyeliği • %50 indirim bitiyor!</span>
            </div>

            {/* Main Headline - Copychat Style */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Kolayca saniyeler içinde 
                <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  ses içeriği oluşturun,
                </span>
                sihir gibi ✨
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Metinlerinizi doğal ses dosyalarına dönüştürün, sesinizi klonlayın ve çoklu dilde içerik üretin. 
                Profesyonel ses stüdyosu artık cebinizde.
              </p>
            </div>

            {/* Email CTA */}
            <div className="space-y-3">
              <EmailCTA />
              <p className="text-sm text-gray-500">
                Kredi kartı gerektirmez • 14 gün ücretsiz deneme
              </p>
            </div>

            {/* Enhanced Social Proof */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                    +12K
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">12,847</span> kullanıcı bu ay katıldı
                </div>
              </div>
              
              {/* Live Activity Indicator */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">ŞU AN CANLI</span>
                </div>
                <span className="text-sm text-green-600">
                  <span className="font-semibold">1,247</span> kullanıcı ses üretiyor
                </span>
              </div>
            </div>

          </div>

          {/* Sağ Taraf - Demo Area */}
          <div id="demo" className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Canlı Demo
              </h2>
              <p className="text-gray-600">
                Ses teknolojimizi hemen deneyin
              </p>
            </div>
            
            <DemoPlayer />
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>31 Farklı Ses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>20+ Dil Desteği</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Ses Klonlama</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>API Erişimi</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Companies Section */}
      <section className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-500 mb-4">
              Türkiye'nin önde gelen şirketleri Yankı'yı tercih ediyor
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-12 opacity-60">
            {TURKISH_COMPANIES.map((company) => (
              <div key={company.name} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700 text-sm">
                  {company.logo}
                </div>
                <span className="font-semibold text-gray-700">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Güçlü İstatistiklerle Desteklenen Teknoloji
            </h2>
            <p className="text-lg text-gray-600">
              Binlerce kullanıcının tercih ettiği ses teknolojisi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "50K+", label: "Ses Ürettik" },
              { icon: Globe, number: "20+", label: "Dil ve Aksan" },
              { icon: Clock, number: "15", label: "Saniyede Üretim" },
              { icon: Award, number: "99.2%", label: "Kalite Skoru" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon size={32} className="text-gray-700" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Hero;
