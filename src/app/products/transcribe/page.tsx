'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Upload, FileAudio, FileText, Download, Check, ArrowRight, 
  Mic, Clock, Globe, Zap, Shield, BarChart3, Volume2, Play, Pause
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';

// Demo ses dosyaları ve transkriptleri
const DEMO_TRANSCRIPTIONS = [
  {
    id: 'meeting-1',
    title: 'Toplantı Kaydı',
    description: '15 dakikalık iş toplantısı',
    audioFile: '/audio/meeting-demo.mp3',
    transcript: `Toplantı Katılımcıları: Ahmet Yılmaz (Proje Yöneticisi), Ayşe Kaya (Pazarlama), Mehmet Demir (Geliştirici)

[00:00:12] Ahmet Yılmaz: Günaydın herkese. Bugünkü toplantımızda yeni ürün lansmanı hakkında konuşacağız.

[00:00:18] Ayşe Kaya: Merhaba Ahmet. Pazarlama tarafından hazırladığımız stratejik plan üzerinde durabilir miyiz?

[00:00:24] Mehmet Demir: Ben de teknik altyapı hazırlıklarımızı paylaşmak istiyorum.

[00:00:29] Ahmet Yılmaz: Tabii ki. Ayşe, sen başlayabilir misin?

[00:00:33] Ayşe Kaya: Elbette. İlk olarak hedef kitlemizi belirledik. 25-40 yaş arası profesyoneller...`,
    duration: '15:23',
    language: 'Türkçe',
    speakers: 3
  },
  {
    id: 'interview-1',
    title: 'Röportaj Kaydı', 
    description: '8 dakikalık müşteri röportajı',
    audioFile: '/audio/interview-demo.mp3',
    transcript: `Röportajcı: Elif Şahin
Katılımcı: Dr. Can Özkan (Uzman Doktor)

[00:00:05] Elif Şahin: Bugün programımızda değerli konuğumuz Dr. Can Özkan var. Hoş geldiniz doktor.

[00:00:10] Dr. Can Özkan: Teşekkür ederim Elif Hanım. Ben de burada olmaktan mutluyum.

[00:00:15] Elif Şahin: Doktor, pandemi sürecinde sağlık sistemi nasıl etkilendi?

[00:00:20] Dr. Can Özkan: Bu gerçekten çok önemli bir soru. Pandemi sürecinde sağlık sistemimiz büyük bir test yaşadı...`,
    duration: '08:47',
    language: 'Türkçe',
    speakers: 2
  },
  {
    id: 'lecture-1',
    title: 'Ders Kaydı',
    description: '12 dakikalık online ders',
    audioFile: '/audio/lecture-demo.mp3',
    transcript: `Eğitmen: Prof. Dr. Zeynep Aktaş
Ders: Dijital Pazarlama Temelleri

[00:00:08] Prof. Dr. Zeynep Aktaş: Merhaba öğrenciler. Bugün dijital pazarlamanın temel kavramlarını öğreneceğiz.

[00:00:15] Prof. Dr. Zeynep Aktaş: İlk olarak dijital pazarlama nedir sorusunu yanıtlayalım. Dijital pazarlama, internet ve dijital teknolojileri kullanarak...

[00:00:28] Prof. Dr. Zeynep Aktaş: Geleneksel pazarlama yöntemlerinden farklı olarak, dijital pazarlama gerçek zamanlı ölçüm imkanı sunar...`,
    duration: '12:34',
    language: 'Türkçe',
    speakers: 1
  }
];

// Audio Player Component
function AudioPlayer({ src, title }: { src: string; title: string }) {
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
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <button
        onClick={togglePlay}
        className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition"
      >
        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
      </button>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-xs text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-100"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>
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

export default function TranscribePage() {
  const { data: session } = useSession();
  const [selectedDemo, setSelectedDemo] = useState(DEMO_TRANSCRIPTIONS[0]);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: 'Hızlı İşleme',
      description: '1 saatlik ses kaydını 5 dakikada metne çevirin'
    },
    {
      icon: <Volume2 className="w-6 h-6 text-blue-600" />,
      title: 'Konuşmacı Tanıma',
      description: 'Farklı konuşmacıları otomatik olarak ayırt eder'
    },
    {
      icon: <Globe className="w-6 h-6 text-green-600" />,
      title: '20+ Dil Desteği',
      description: 'Türkçe, İngilizce ve birçok dilde transkripsiyon'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Zaman Damgası',
      description: 'Her cümle için dakika:saniye zaman bilgisi'
    },
    {
      icon: <FileText className="w-6 h-6 text-red-600" />,
      title: 'Çoklu Format',
      description: 'TXT, DOCX, PDF ve SRT formatlarında indirme'
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      title: 'Gizlilik Koruması',
      description: 'Ses dosyalarınız güvenli şekilde işlenir ve silinir'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Ses Dosyası Yükleyin',
      description: 'MP3, WAV, M4A formatlarında ses dosyanızı yükleyin',
      icon: <Upload className="w-8 h-8 text-green-600" />
    },
    {
      number: 2,
      title: 'Dil Seçimi',
      description: 'Ses dosyasındaki konuşma dilini seçin',
      icon: <Globe className="w-8 h-8 text-blue-600" />
    },
    {
      number: 3,
      title: 'AI Analizi',
      description: 'Yapay zeka ses dosyanızı analiz eder ve metne çevirir',
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />
    },
    {
      number: 4,
      title: 'Metin İndirme',
      description: 'Transkripsiyon tamamlandığında metni indirin',
      icon: <Download className="w-8 h-8 text-yellow-600" />
    }
  ];

  const useCases = [
    {
      title: 'Toplantı Kayıtları',
      description: 'İş toplantılarınızı metne çevirin, karar noktalarını kaydedin',
      icon: '👥',
      examples: ['Şirket toplantıları', 'Müşteri görüşmeleri', 'Brainstorming oturumları']
    },
    {
      title: 'Röportajlar & Podcast',
      description: 'Ses içeriklerinizi yazılı içeriğe dönüştürün',
      icon: '🎙️',
      examples: ['Müşteri röportajları', 'Podcast bölümleri', 'Sesli notlar']
    },
    {
      title: 'Eğitim & Konferans',
      description: 'Ders kayıtları ve konferansları metne çevirin',
      icon: '📚',
      examples: ['Online dersler', 'Webinar kayıtları', 'Konferans sunumları']
    },
    {
      title: 'Hukuk & Sağlık',
      description: 'Profesyonel alanlarda ses kayıtlarını dokümante edin',
      icon: '⚖️',
      examples: ['Mahkeme kayıtları', 'Hasta görüşmeleri', 'Uzman konsültasyonları']
    },
    {
      title: 'Medya & Gazetecilik',
      description: 'Haber ve medya içerikleri için transkripsiyon',
      icon: '📰',
      examples: ['Haber röportajları', 'Video altyazıları', 'Basın toplantıları']
    },
    {
      title: 'Araştırma & Akademi',
      description: 'Akademik çalışmalar için ses kayıtları analizi',
      icon: '🔬',
      examples: ['Mülakat kayıtları', 'Saha araştırması', 'Odak grup çalışmaları']
    }
  ];

  const pricingPlans = [
    {
      name: 'Ücretsiz Deneme',
      price: 0,
      minutes: 30,
      features: ['30 dakika hediye', 'Türkçe ve İngilizce', 'Temel kalite', 'TXT format'],
      cta: 'Ücretsiz Başla',
      popular: false
    },
    {
      name: 'Dakika Bazlı',
      price: '0.65₺/dk',
      minutes: 'Sınırsız',
      features: ['İhtiyacınız kadar ödeyin', '20+ dil desteği', 'Yüksek kalite', 'Konuşmacı tanıma', 'Tüm formatlar', 'Zaman damgası'],
      cta: 'Hemen Başla',
      popular: true
    },
    {
      name: 'Toplu İşlem',
      price: 'İndirimli',
      minutes: '100+ saat',
      features: ['Büyük projeler için indirim', 'Tüm özellikler', 'API erişimi', 'Öncelik desteği', 'Özel entegrasyon', 'Özel fiyatlandırma'],
      cta: 'Teklif Al',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileAudio className="w-4 h-4" />
              <span>Yapay Zeka Ses Deşifre</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Ses Kayıtlarınızı
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Yazıya Dökün
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Yapay zeka teknolojisiyle ses dosyalarınızı hızlıca metne çevirin. 
              20+ dil desteği, konuşmacı tanıma ve zaman damgası ile profesyonel transkripsiyon.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {session ? (
                <Link href="/dashboard/transcribe">
                  <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2">
                    <FileAudio className="w-5 h-5" />
                    Hemen Deneyin
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2">
                    <FileAudio className="w-5 h-5" />
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
                <div className="text-2xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-600">Dil Desteği</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">%95</div>
                <div className="text-sm text-gray-600">Doğruluk Oranı</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">5dk</div>
                <div className="text-sm text-gray-600">İşleme Süresi/Saat</div>
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
              Transkripsiyon Örnekleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Farklı türdeki ses kayıtlarının nasıl metne çevrildiğini görün. 
              Konuşmacı tanıma ve zaman damgası özelliklerini keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {DEMO_TRANSCRIPTIONS.map((demo) => (
              <div 
                key={demo.id} 
                className={`p-6 rounded-xl border-2 transition-colors cursor-pointer ${
                  selectedDemo.id === demo.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDemo(demo)}
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">{demo.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{demo.description}</p>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {demo.duration}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {demo.speakers} konuşmacı
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {demo.language}
                  </span>
                </div>
                
                <AudioPlayer 
                  src={selectedDemo.audioFile}
                  title="Demo Ses"
                />
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ses Dosyası</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <AudioPlayer 
                    src={selectedDemo.audioFile}
                    title={selectedDemo.title}
                  />
                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>Süre: {selectedDemo.duration}</span>
                    <span>{selectedDemo.speakers} konuşmacı</span>
                    <span>{selectedDemo.language}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Transkripsiyon</h3>
                  <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                    <Download className="w-4 h-4" />
                    İndir
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-['Inter']">
                    {selectedDemo.transcript}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Deşifre Nasıl Çalışır?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              4 basit adımda ses dosyalarınızı metne çevirin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
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
              Neden Yankı Deşifre?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En gelişmiş yapay zeka teknolojisi ile yüksek kaliteli ses-metin dönüşümü
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
              Ses deşifre teknolojisini hangi alanlarda kullanabilirsiniz?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="mb-4">
                  <div className="text-3xl mb-2">{useCase.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {useCase.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{example}</span>
                    </div>
                  ))}
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
              Deşifre Fiyatları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun paketi seçin, ses kayıtlarınızı metne çevirin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl p-6 border-2 ${
                plan.popular ? 'border-green-500 relative' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      En Popüler
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {plan.price === 0 ? 'Ücretsiz' : `₺${plan.price}`}
                    {plan.price > 0 && <span className="text-base font-normal text-gray-500">/ay</span>}
                  </div>
                  <div className="text-sm text-gray-500">{plan.minutes} dakika transkripsiyon</div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {session ? (
                  <Link href="/dashboard/transcribe">
                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      plan.popular 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                      Panele Git
                    </button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      plan.popular 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ses Kayıtlarınızı Metne Çevirmeye Başlayın
          </h2>
          <p className="text-xl text-green-100 mb-8">
            60 dakika ücretsiz transkripsiyon hakkı ile Yankı'yı deneyin
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href="/dashboard/transcribe">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                  <FileAudio className="w-5 h-5" />
                  Deşifre Paneli
                </button>
              </Link>
            ) : (
              <Link href="/register">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Ücretsiz Kayıt
                </button>
              </Link>
            )}
            <Link href="/pricing">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-600 transition">
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