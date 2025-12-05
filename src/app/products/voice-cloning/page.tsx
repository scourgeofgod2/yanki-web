'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Play, Pause, Upload, Download, Star, Check, ArrowRight, 
  Mic, Users, Zap, Shield, Clock, BarChart3, Volume2, FileAudio
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';

// Demo klonlanmış sesler
const DEMO_CLONED_VOICES = [
  {
    id: 'clone-1',
    name: 'CEO Sesi - Kurumsal',
    description: '3 dakikalık röportajdan klonlandı',
    originalFile: '/audio/original-1.mp3',
    clonedFile: '/audio/cloned-1.mp3',
    quality: 'HD Model',
    useCase: 'Kurumsal videolar'
  },
  {
    id: 'clone-2', 
    name: 'Podcast Sesi - Samimi',
    description: '2 dakikalık ses kaydından klonlandı',
    originalFile: '/audio/original-2.mp3',
    clonedFile: '/audio/cloned-2.mp3',
    quality: 'Turbo Model',
    useCase: 'Podcast içerikleri'
  },
  {
    id: 'clone-3',
    name: 'Eğitmen Sesi - Açık',
    description: '5 dakikalık ders kaydından klonlandı',
    originalFile: '/audio/original-3.mp3',
    clonedFile: '/audio/cloned-3.mp3',
    quality: 'HD Model',
    useCase: 'Eğitim videoları'
  }
];

const DEMO_TEXT = "Merhaba! Bu, klonlanmış sesimle oluşturulmuş bir demo metindir. Yankı'nın ses klonlama teknolojisi sayesinde kendi sesimle istediğim metinleri seslendirebiliyorum.";

// Audio Player Component
function AudioPlayer({ src, title, description }: { src: string; title: string; description: string }) {
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
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-100"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <button className="p-1 text-gray-500 hover:text-gray-700">
          <Download className="w-4 h-4" />
        </button>
      </div>

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

export default function VoiceCloningPage() {
  const { data: session } = useSession();
  const [selectedDemo, setSelectedDemo] = useState(DEMO_CLONED_VOICES[0]);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: 'Hızlı Klonlama',
      description: '30 saniyelik temiz ses kaydı ile klonlama yapın'
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: 'Güvenli ve Etik',
      description: 'Sadece kendi sesinizi klonlayabilirsiniz, onay mekanizması'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      title: 'Yüksek Kalite',
      description: 'HD Model ile %99 benzerlikte ses klonlama'
    },
    {
      icon: <FileAudio className="w-6 h-6 text-blue-600" />,
      title: 'Çoklu Format',
      description: 'WAV, MP3, OGG formatlarında ses kaydı kabul'
    },
    {
      icon: <Volume2 className="w-6 h-6 text-red-600" />,
      title: 'Duygu Kontrolü',
      description: 'Klonlanmış sesinizin tonunu ve duygusunu ayarlayın'
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: 'Ömür Boyu',
      description: 'Bir kez klonlayın, ömür boyu kullanın'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Ses Kaydı Yükleyin',
      description: 'Temiz ve net 30-60 saniyelik ses kaydınızı yükleyin',
      icon: <Upload className="w-8 h-8 text-blue-600" />
    },
    {
      number: 2,
      title: 'AI Analizi',
      description: 'Yapay zeka sesinizi analiz eder ve özelliklerini öğrenir',
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />
    },
    {
      number: 3,
      title: 'Model Oluşturma',
      description: 'Sesinizin dijital kopyası 5-10 dakikada hazır',
      icon: <Zap className="w-8 h-8 text-yellow-600" />
    },
    {
      number: 4,
      title: 'Seslendirme',
      description: 'Artık istediğiniz metni kendi sesinizle seslendirebilirsiniz',
      icon: <Mic className="w-8 h-8 text-green-600" />
    }
  ];

  const useCases = [
    {
      title: 'Kişisel İçerik',
      description: 'Blog yazılarınızı kendi sesinizle podcast\'e dönüştürün',
      icon: '🎙️',
      examples: ['Blog podcast\'i', 'Kişisel mesajlar', 'Sosyal medya içeriği']
    },
    {
      title: 'Kurumsal Kullanım',
      description: 'Şirket videolarında tutarlı ses kullanın',
      icon: '🏢',
      examples: ['Kurumsal videolar', 'Eğitim materyalleri', 'Müşteri hizmetleri']
    },
    {
      title: 'İçerik Üreticileri',
      description: 'YouTube, TikTok ve diğer platformlar için',
      icon: '📹',
      examples: ['YouTube videoları', 'TikTok içerikleri', 'Online kurslar']
    },
    {
      title: 'Dublaj & Çeviri',
      description: 'Çok dilli içerik için kendi sesinizi kullanın',
      icon: '🌍',
      examples: ['Film dublajı', 'Çok dilli videolar', 'Uluslararası pazarlama']
    }
  ];

  const pricingModels = [
    {
      name: 'Paket Bazlı Ses Klonlama',
      description: 'Aylık abonelik paketleriyle ses klonlama hakkı',
      credits: 'Paket içinde',
      minutes: 'Sınırsız kullanım',
      quality: '%98 Benzerlik',
      features: ['Başlangıç: 5 klonlama', 'İçerik Üreticisi: 10 klonlama', 'Profesyonel: 20 klonlama', 'Kurumsal: 50 klonlama'],
      popular: true
    },
    {
      name: 'Tek Seferlik Klonlama',
      description: 'İhtiyacınız kadar ödeyin, paket gerekmez',
      credits: 'Kredi bazlı',
      minutes: 'Esnek kullanım',
      quality: '%95 Benzerlik',
      features: ['Minimum 10 dakika ses gerekli', 'Kredi kartı ile anında ödeme', 'Paket bağlantısı yok', 'Tek seferlik işlem'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              <span>Yapay Zeka Ses Klonlama</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Kendi Sesinizi
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Dijital Olarak
              </span>
              <br />
              Klonlayın
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              30 saniyelik temiz ses kaydı ile kendi sesinizin dijital kopyasını oluşturun. 
              HD kalite ile %99 benzerlikte ses klonlama teknolojisi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {session ? (
                <Link href="/dashboard/cloning">
                  <button className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Ses Klonla
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Ücretsiz Başla
                  </button>
                </Link>
              )}
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition">
                Demo Dinle
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">%99</div>
                <div className="text-sm text-gray-600">Ses Benzerliği</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">30sn</div>
                <div className="text-sm text-gray-600">Minimum Kayıt</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">5dk</div>
                <div className="text-sm text-gray-600">İşleme Süresi</div>
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
              Klonlanmış Ses Örnekleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gerçek kullanıcılarımızın ses klonlama örneklerini dinleyin. Orijinal ses ile klonlanmış ses arasındaki benzerliği keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {DEMO_CLONED_VOICES.map((demo) => (
              <div 
                key={demo.id} 
                className={`p-6 rounded-xl border-2 transition-colors cursor-pointer ${
                  selectedDemo.id === demo.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDemo(demo)}
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">{demo.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{demo.description}</p>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    demo.quality === 'HD Model' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {demo.quality}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {demo.useCase}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AudioPlayer 
                src={selectedDemo.originalFile}
                title="Orijinal Ses"
                description="Klonlama için kullanılan orijinal ses kaydı"
              />
              <AudioPlayer 
                src={selectedDemo.clonedFile}
                title="Klonlanmış Ses"
                description="AI ile üretilmiş klonlanmış ses"
              />
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Demo Metni:</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{DEMO_TEXT}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ses Klonlama Nasıl Çalışır?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              4 basit adımda kendi sesinizin dijital kopyasını oluşturun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden Yankı Ses Klonlama?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En gelişmiş yapay zeka teknolojisi ile güvenli ve etik ses klonlama
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kullanım Alanları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ses klonlama teknolojisini hangi alanlarda kullanabilirsiniz?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{useCase.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {useCase.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.examples.map((example, exampleIndex) => (
                        <span key={exampleIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ses Klonlama Fiyatları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun modeli seçin, kendi sesinizin dijital kopyasını oluşturun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingModels.map((model, index) => (
              <div key={index} className={`bg-white rounded-xl p-8 border-2 ${
                model.popular ? 'border-purple-500 relative' : 'border-gray-200'
              }`}>
                {model.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      En Popüler
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{model.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                  
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {model.credits.toLocaleString('tr-TR')} Kredi
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {model.minutes} ses üretimi • {model.quality}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {model.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {session ? (
                  <Link href="/dashboard/cloning">
                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      model.popular 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                      Klonlamaya Başla
                    </button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      model.popular 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                      Ücretsiz Kayıt
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-orange-200 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Güvenlik ve Etik Kullanım</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Yankı ses klonlama teknolojisi, sadece kendi sesinizi klonlamanıza izin verir. 
                  Her ses kaydı kimlik doğrulamasından geçer ve kötüye kullanımı önlemek için 
                  gelişmiş güvenlik önlemleri alınır. Başka birinin sesini izinsiz klonlamak kesinlikle yasaktır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Kendi Sesinizi Klonlamaya Başlayın
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            30 saniyelik ses kaydı ile 5 dakikada kendi sesinizin dijital kopyasını oluşturun
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href="/dashboard/cloning">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ses Klonlama Paneli
                </button>
              </Link>
            ) : (
              <Link href="/register">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Ücretsiz Kayıt
                </button>
              </Link>
            )}
            <Link href="/pricing">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition">
                Fiyatları Görüntüle
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}