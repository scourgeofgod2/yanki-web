'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowRight, Play, Mic, Volume2, Pause, Loader2,
  FileText, Users, Video, Languages, Download, ChevronDown,
  Crown, Zap, TrendingUp, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// DEMO VOICES
const DEMO_VOICES = [
  {
    id: "English_Trustworth_Man",
    name: "Erkek Ses",
    demoFile: "1.mp3"
  },
  {
    id: "English_Graceful_Lady", 
    name: "Kadın Ses",
    demoFile: "2.mp3"
  }
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
        Giriş Yap
      </Link>
      <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Ücretsiz Dene
      </Link>
    </div>
  );
}

// Demo Content for Different Tabs
const DEMO_CONTENT = {
  'SESLENDIRME': {
    title: 'Metni Sese Dönüştürün',
    description: 'Aşağıdaki metni seçtiğiniz sesle dinleyin',
    text: 'Merhaba! Yankı ile metinlerinizi saniyeler içinde doğal seslere dönüştürebilirsiniz. Bu örnek demo ses dosyasıdır.',
    audioFile: '/audio/demo-tts.mp3',
    showTextarea: true,
    categories: [
      { name: 'Bir hikaye anlat', audio: '/audio/demo_tts_1.mp3', text: 'Bir varmış, bir yokmuş. Eski zamanlarda, büyülü bir ormanda yaşayan küçük bir kız varmış...' },
      { name: 'Haberler', audio: '/audio/demo_tts_2.mp3', text: 'Bugün açıklanan son gelişmelere göre, yapay zeka teknolojileri günlük yaşamımızda giderek daha fazla yer almaya devam ediyor...' },
      { name: 'Podcast', audio: '/audio/demo_tts_3.mp3', text: 'Merhaba dinleyiciler! Bugünkü bölümümüzde ses teknolojilerinin geleceğini konuşacağız...' },
      { name: 'Eğitici', audio: '/audio/demo_tts_4.mp3', text: 'Bu derste, yapay zeka destekli ses üretiminin temel prensiplerini öğreneceğiz...' },
      { name: 'Reklam', audio: '/audio/demo_tts_5.mp3', text: 'Yeni ürünümüzle tanışın! Hayatınızı kolaylaştıracak bu muhteşem çözüm...' },
      { name: 'Belgesel', audio: '/audio/demo_tts_6.mp3', text: 'Doğanın derinliklerinde, binlerce yıllık sırları barındıran eski ormanlar...' },
      { name: 'Çizgi Film', audio: '/audio/demo_tts_7.mp3', text: 'Selam çocuklar! Bugün çok eğlenceli bir maceraya çıkıyoruz!' }
    ]
  },
  'DEŞIFRE': {
    title: 'Sesi Metne Dönüştürün',
    description: 'Ses dosyasını oynatın ve otomatik çıkarılan metni görün',
    text: 'Bu örnekte, ses dosyası otomatik olarak metne dönüştürülmüştür:\n\n"Yapay zeka teknolojisi sayesinde ses kayıtlarınızı hızlı ve doğru şekilde metne çevirebiliriz. Bu işlem sadece birkaç saniye sürmektedir."',
    audioFile: '/audio/demo-stt.mp3',
    showTextarea: false,
    readonly: true,
    categories: ['Toplantı Kayıtları', 'Röportajlar', 'Podcast Transkriptleri', 'Sesli Notlar']
  },
  'SES KLONLAMA': {
    title: 'Ses Klonlama Demonstrasyonu',
    description: 'Kaynak sesi dinleyin, ardından klonlanmış versiyonu karşılaştırın',
    text: 'KAYNAK SES: Orijinal konuşmacının sesi\n\nMETİN: "Bu benim orijinal sesim. Şimdi bu ses klonlanacak."\n\n↓ KLONLANMIŞ SES ↓\n\nAynı metin, klonlanmış sesle: "Bu benim orijinal sesim. Şimdi bu ses klonlanacak."',
    audioFile: '/audio/demo-clone.mp3',
    sourceAudio: '/audio/demo-source.mp3',
    showTextarea: false,
    readonly: true,
    categories: ['Kaynak Ses', 'Klonlanmış Ses']
  }
};

// User Dashboard Card Component
function UserDashboardCard() {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Session refresh fonksiyonu
  const refreshUserData = async () => {
    setIsRefreshing(true);
    try {
      await update(); // NextAuth session'ı güncelle
      // Alternatif: Manuel API çağrısı yapabilirsiniz
      // const response = await fetch('/api/auth/refresh-session', { method: 'POST' });
      // const data = await response.json();
    } catch (error) {
      console.error('Session refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userPlan = session.user?.plan || 'free';
  const userCredits = session.user?.credits || 0;
  const userName = session.user?.name || 'Değerli üyemiz';

  // Plan bilgileri ve limitler
  const planLimits = {
    kurumsal: { limit: 500000, name: 'Kurumsal', color: 'from-purple-500 to-pink-500', icon: Crown },
    profesyonel: { limit: 200000, name: 'Profesyonel', color: 'from-blue-500 to-cyan-500', icon: Zap },
    icerik: { limit: 100000, name: 'İçerik Üreticisi', color: 'from-green-500 to-teal-500', icon: TrendingUp },
    baslangic: { limit: 50000, name: 'Başlangıç', color: 'from-orange-500 to-red-500', icon: CheckCircle },
    free: { limit: 500, name: 'Ücretsiz', color: 'from-gray-500 to-slate-500', icon: AlertCircle }
  };

  const currentPlan = planLimits[userPlan as keyof typeof planLimits] || planLimits.free;
  const usagePercentage = Math.min((userCredits / currentPlan.limit) * 100, 100);
  const Icon = currentPlan.icon;

  const getUpgradeRecommendation = () => {
    if (userPlan === 'kurumsal') return null;
    if (userPlan === 'profesyonel') return { plan: 'kurumsal', price: '249₺/ay' };
    if (userPlan === 'icerik') return { plan: 'profesyonel', price: '149₺/ay' };
    if (userPlan === 'baslangic') return { plan: 'icerik', price: '119₺/ay' };
    return { plan: 'baslangic', price: '89₺/ay' };
  };

  const upgradeRec = getUpgradeRecommendation();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentPlan.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Merhaba {userName}! 👋
            </h3>
            <p className="text-sm text-gray-600">{currentPlan.name} Paketi</p>
          </div>
        </div>
        <button
          onClick={refreshUserData}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          title="Bilgileri Yenile"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Credits and Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Kredi Durumu</span>
          <span className="text-sm text-gray-600">
            {userCredits.toLocaleString('tr-TR')} / {currentPlan.limit.toLocaleString('tr-TR')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${currentPlan.color} transition-all duration-300`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          %{usagePercentage.toFixed(1)} kullanıldı
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Mic className="w-4 h-4" />
          Ses Üret
        </button>
        <button
          onClick={() => router.push('/dashboard/studio')}
          className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
        >
          <Volume2 className="w-4 h-4" />
          Stüdyo
        </button>
      </div>

      {/* Upgrade Suggestion */}
      {upgradeRec && (userCredits < currentPlan.limit * 0.2) && (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 text-sm mb-1">
                Paket Yükseltme Önerisi
              </h4>
              <p className="text-orange-700 text-xs mb-3">
                Kredileriniz azalıyor. Daha büyük projeler için {planLimits[upgradeRec.plan as keyof typeof planLimits]?.name} paketini deneyin.
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition"
              >
                <Crown className="w-3 h-3" />
                {upgradeRec.price} - Yükselt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Voiser Style Demo Component
function VoiserStyleDemo() {
  const [activeTab, setActiveTab] = useState('SESLENDIRME');
  const [selectedVoice, setSelectedVoice] = useState(DEMO_VOICES[0]);
  const [customText, setCustomText] = useState(DEMO_CONTENT['SESLENDIRME'].text);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<'main' | 'source' | null>(null);
  const [showMembershipPrompt, setShowMembershipPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceAudioRef = useRef<HTMLAudioElement | null>(null);

  const tabs = [
    { id: 'SESLENDIRME', name: 'SESLENDIRME', icon: Volume2, active: true },
    { id: 'DEŞIFRE', name: 'DEŞIFRE', icon: FileText, active: true },
    { id: 'SES KLONLAMA', name: 'SES KLONLAMA', icon: Users, active: true },
    { id: 'AI VIDEO', name: 'AI VIDEO', icon: Video, active: false },
    { id: 'AI DUBLAJ', name: 'AI DUBLAJ', icon: Languages, active: false },
    { id: 'UYGULAMALAR', name: 'UYGULAMALAR', icon: Mic, active: false }
  ];

  // Tab değiştiğinde içeriği güncelle
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const content = DEMO_CONTENT[tabId as keyof typeof DEMO_CONTENT];
    if (content) {
      setCustomText(content.text);
      setShowMembershipPrompt(false);
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const handleDemoPlay = () => {
    const content = DEMO_CONTENT[activeTab as keyof typeof DEMO_CONTENT];
    if (!content) return;

    // Demo oynatıldıktan sonra üyelik teşviki göster
    setShowMembershipPrompt(true);
    
    if (audioRef.current) {
      audioRef.current.src = content.audioFile;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentAudio('main');
      }).catch(e => console.error("Oynatma hatası:", e));
    }
  };

  const handleSourcePlay = () => {
    if (sourceAudioRef.current && DEMO_CONTENT['SES KLONLAMA'].sourceAudio) {
      sourceAudioRef.current.src = DEMO_CONTENT['SES KLONLAMA'].sourceAudio;
      sourceAudioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentAudio('source');
      }).catch(e => console.error("Kaynak ses oynatma hatası:", e));
    }
  };

  const togglePlay = () => {
    if (currentAudio === 'main' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Oynatma hatası:", e));
      }
    } else if (currentAudio === 'source' && sourceAudioRef.current) {
      if (isPlaying) {
        sourceAudioRef.current.pause();
      } else {
        sourceAudioRef.current.play().catch(e => console.error("Oynatma hatası:", e));
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-gray-50 rounded-3xl border border-gray-200">
      {/* Content */}
      <div className="p-8">
        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={!tab.active}
                className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : tab.active
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon size={16} />
                {tab.name}
                {!tab.active && <span className="text-xs opacity-75">Yakında</span>}
              </button>
            );
          })}
        </div>

        {/* Main Demo Area */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Metninizi buraya yazın..."
            className="w-full h-48 p-4 border border-gray-200 rounded-xl text-gray-700 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          />
          
          {/* Dynamic Content based on active tab */}
          {activeTab === 'SESLENDIRME' && (
            <>
              {/* Voice Selection */}
              <div className="mt-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">🎵 7 Farklı Ses Seçeneği</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DEMO_CONTENT.SESLENDIRME.categories.map((category, index) => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setCustomText(category.text);
                        // Audio ref'i güncelle
                        if (audioRef.current) {
                          audioRef.current.src = category.audio;
                        }
                      }}
                      className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition"
                    >
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">Ses {index + 1}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'SES KLONLAMA' && (
            <div className="mt-6 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">🎯 Demo: Ses Klonlama Süreci</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSourcePlay}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    <Play size={16} />
                    1. Kaynak Sesi Dinle
                  </button>
                  <span className="text-sm text-gray-600">Orijinal konuşmacının sesi</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDemoPlay}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    <Play size={16} />
                    2. Klonlanmış Sesi Dinle
                  </button>
                  <span className="text-sm text-gray-600">AI ile klonlanmış versiyon</span>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Language Dropdown */}
              <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs">🇹🇷</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Türkçe</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>

            {/* Play Button + Download */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDemoPlay}
                className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-base hover:bg-blue-700 transition shadow-lg"
              >
                {isPlaying && currentAudio === 'main' ? <Pause size={20} /> : <Play size={20} />}
                <span>
                  {isPlaying && currentAudio === 'main' ? 'Duraklat' : 'OYNAT'}
                </span>
              </button>
            </div>
          </div>

          {/* Membership Prompt */}
          {showMembershipPrompt && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✨</span>
                <h4 className="font-semibold text-gray-900">
                  Daha Fazlası İçin Üye Olun!
                </h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Sınırsız ses üretimi, ses klonlama ve tüm premium özellikler için hemen kayıt olun.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/register" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition">
                  Ücretsiz Dene
                </Link>
                <Link href="/pricing" className="px-4 py-2 text-purple-600 text-sm font-medium hover:text-purple-800 transition">
                  Paketleri Gör
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Elements */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentAudio(null);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
      />
      
      <audio
        ref={sourceAudioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentAudio(null);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
      />
    </div>
  );
}

const Hero = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="text-center py-16">
          {/* Main Title */}
          <div className="max-w-6xl mx-auto mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Kolayca saniyeler içinde{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                ses içeriği oluşturun,
              </span>{' '}
              sihir gibi ✨
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Metinlerinizi doğal ses dosyalarına dönüştürün, sesinizi klonlayın ve 20+ dilde içerik üretin.
            Profesyonel ses stüdyosu artık cebinizde.
          </p>

          {/* User Dashboard Card or CTA */}
          {session ? (
            <div className="max-w-lg mx-auto mb-8">
              <UserDashboardCard />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
              >
                Ücretsiz Denemeye Başla
                <ArrowRight size={18} />
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-medium border-2 border-gray-300 rounded-lg hover:border-gray-400 transition"
              >
                Paketleri İncele
              </Link>
            </div>
          )}

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Doğal Sesler</h3>
              <p className="text-gray-600 text-sm">20+ dilde profesyonel kalitede ses üretimi</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ses Klonlama</h3>
              <p className="text-gray-600 text-sm">Kendi sesinizi klonlayın ve özelleştirin</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hızlı & Kolay</h3>
              <p className="text-gray-600 text-sm">Saniyeler içinde profesyonel sonuçlar</p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="pb-16">
          <VoiserStyleDemo />
        </div>

        {/* Bottom CTA Section */}
        {!session && (
          <div className="text-center pb-16">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              Ücretsiz Denemeye Başla!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
