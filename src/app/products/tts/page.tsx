'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Play, Pause, Volume2, Download, Star, Check, ArrowRight, 
  Mic, FileText, Zap, Globe, Clock, Users, BarChart3
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';

// Demo ses dosyaları
const DEMO_VOICES = [
  {
    id: 'erkek-1',
    name: 'Ahmet - Güvenilir Erkek Ses',
    gender: 'erkek',
    style: 'Professional',
    file: '/audio/1.mp3',
    description: 'Kurumsal sunumlar ve açıklamalar için ideal'
  },
  {
    id: 'kadin-1', 
    name: 'Ayşe - Sıcak Kadın Ses',
    gender: 'kadın',
    style: 'Friendly',
    file: '/audio/2.mp3',
    description: 'Eğitim içerikleri ve hikayeler için mükemmel'
  },
  {
    id: 'erkek-2',
    name: 'Mehmet - Enerjik Erkek Ses',
    gender: 'erkek', 
    style: 'Energetic',
    file: '/audio/3.mp3',
    description: 'Reklamlar ve tanıtım videoları için'
  },
  {
    id: 'kadin-2',
    name: 'Elif - Profesyonel Kadın Ses',
    gender: 'kadın',
    style: 'Corporate',
    file: '/audio/4.mp3',
    description: 'Haber ve bilgilendirme metinleri için'
  }
];

const DEMO_TEXT = "Merhaba! Bu, Yankı'nın yapay zeka destekli seslendirme teknolojisiyle oluşturulmuş bir demo metnidir. Metninizi yazın, sesinizi seçin ve saniyeler içinde profesyonel kalitede ses dosyanıza sahip olun.";

// Audio Player Component
function AudioPlayer({ src, name }: { src: string; name: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <button
        onClick={togglePlay}
        className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-xs text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-100"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      <button className="p-2 text-gray-500 hover:text-gray-700">
        <Download className="w-4 h-4" />
      </button>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}

export default function TTSPage() {
  const { data: session } = useSession();
  const [selectedVoice, setSelectedVoice] = useState(DEMO_VOICES[0]);
  const [inputText, setInputText] = useState(DEMO_TEXT);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: 'Hızlı Üretim',
      description: 'Metninizi saniyeler içinde profesyonel sese dönüştürün'
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: '20+ Dil Desteği',
      description: 'Türkçe, İngilizce ve daha birçok dilde seslendirme'
    },
    {
      icon: <Volume2 className="w-6 h-6 text-purple-600" />,
      title: 'Yüksek Kalite',
      description: 'Studio kalitesinde 48kHz ses dosyaları'
    },
    {
      icon: <FileText className="w-6 h-6 text-green-600" />,
      title: 'Çoklu Format',
      description: 'MP3, WAV, OGG formatlarında indirme'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-red-600" />,
      title: 'Duygu Kontrolü',
      description: 'Sesin tonunu ve duygusunu ayarlayın'
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: '7/24 Erişim',
      description: 'İstediğiniz zaman, istediğiniz yerden kullanın'
    }
  ];

  const useCases = [
    {
      title: 'YouTube Videoları',
      description: 'Video içerikleriniz için profesyonel seslendirme',
      icon: '🎬'
    },
    {
      title: 'Podcast\'ler',
      description: 'Podcast bölümlerinizi sesli içeriğe çevirin',
      icon: '🎙️'
    },
    {
      title: 'E-öğrenim',
      description: 'Eğitim materyallerinizi sesli hale getirin',
      icon: '📚'
    },
    {
      title: 'Audiobook',
      description: 'Kitaplarınızı sesli kitaba dönüştürün',
      icon: '🔊'
    },
    {
      title: 'Reklamlar',
      description: 'Reklam metinleriniz için etkileyici sesler',
      icon: '📢'
    },
    {
      title: 'Sunumlar',
      description: 'Kurumsal sunumlarınızı seslendir',
      icon: '📊'
    }
  ];

  const pricingPlans = [
    {
      name: 'Ücretsiz Deneme',
      price: 0,
      credits: 1000,
      minutes: '~1.2 dk',
      features: ['1000 karakter hediye', '31 ses karakteri', 'Temel kalite', 'MP3 format', '20+ dil desteği'],
      cta: 'Ücretsiz Başla',
      popular: false
    },
    {
      name: 'Başlangıç Paketi',
      price: 89,
      credits: 100000,
      minutes: '~120 dk',
      features: ['100.000 karakter/ay', '5 ses klonlama', '20+ dil desteği', 'Yüksek kalite', 'Ticari kullanım'],
      cta: 'Başlangıç Paketi',
      popular: false
    },
    {
      name: 'İçerik Üreticisi',
      price: 199,
      credits: 300000,
      minutes: '~360 dk',
      features: ['300.000 karakter/ay', '10 ses klonlama', 'Toplu işleme', 'Öncelik destek', 'API erişimi'],
      cta: 'İçerik Üreticisi',
      popular: true
    },
    {
      name: 'Profesyonel',
      price: 399,
      credits: 750000,
      minutes: '~900 dk',
      features: ['750.000 karakter/ay', '20 ses klonlama', 'Stüdyo kalite', 'Gelişmiş API', 'Custom voice training'],
      cta: 'Profesyonel Paket',
      popular: false
    },
    {
      name: 'Kurumsal',
      price: 2999,
      credits: 3000000,
      minutes: '~3600 dk',
      features: ['3.000.000 karakter/ay', '50 ses klonlama', 'Premium kalite', 'Özel API', '7/24 destek', 'SLA garantisi'],
      cta: 'Kurumsal Paket',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mic className="w-4 h-4" />
              <span>Yapay Zeka Destekli Seslendirme</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Metinlerinizi
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Profesyonel Sese
              </span>
              <br />
              Dönüştürün
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Yapay zeka teknolojisiyle saniyeler içinde studio kalitesinde seslendirme. 
              31 farklı ses karakteri, 20+ dil desteği ve gelişmiş duygu kontrolü.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {session ? (
                <Link href="/dashboard/studio">
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Hemen Dene
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Ücretsiz Başla
                  </button>
                </Link>
              )}
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition">
                Demo İzle
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">31</div>
                <div className="text-sm text-gray-600">Ses Karakteri</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-600">Dil Desteği</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1M+</div>
                <div className="text-sm text-gray-600">Üretilen Ses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ses Örneklerini Dinleyin
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Farklı ses karakterlerini ve stillerini keşfedin. Her ses, farklı kullanım alanları için optimize edilmiştir.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Voice Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ses Karakteri Seçin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedVoice.id === voice.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{voice.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{voice.description}</div>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        voice.gender === 'erkek' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {voice.gender}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {voice.style}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Metni</h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg resize-none h-32 text-sm"
                placeholder="Seslendirmek istediğiniz metni buraya yazın..."
              />
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Seçilen Ses: {selectedVoice.name}
                </h4>
                <AudioPlayer 
                  src={selectedVoice.file} 
                  name={selectedVoice.name}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden Yankı Seslendirme?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern yapay zeka teknolojisi ile geleneksel seslendirmenin sınırlarını aşıyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kullanım Alanları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Yankı seslendirme teknolojisini hangi alanlarda kullanabilirsiniz?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

     
      <Footer />
    </div>
  );
}