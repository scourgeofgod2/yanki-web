'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Check, X, Star, Zap, Crown, Users, Clock, TrendingUp, AlertCircle, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock size={16} className="text-red-500" />
      <span className="font-mono bg-red-50 text-red-700 px-2 py-1 rounded">
        {timeLeft.days}g {timeLeft.hours}s {timeLeft.minutes}d {timeLeft.seconds}s
      </span>
    </div>
  );
}

const PricingPage = () => {
  const { data: session, status } = useSession();
  const [isYearly, setIsYearly] = useState(false);
  
  // Ayın sonuna kadar countdown
  const monthEndDate = new Date();
  monthEndDate.setMonth(monthEndDate.getMonth() + 1);
  monthEndDate.setDate(0);
  monthEndDate.setHours(23, 59, 59, 999);

  // Karakter to dakika hesaplama fonksiyonu
  const calculateMinutes = (characters: number) => {
    // Ortalama 1000 karakter = 1.2 dakika ses (0.0029 TL/char * 1000 = 2.9 TL)
    return Math.round((characters / 1000) * 1.2);
  };

  const plans = [
    {
      id: 'baslangic',
      name: 'Başlangıç Paketi',
      price: isYearly ? 712 : 89,
      originalPrice: isYearly ? 1068 : 133.5,
      yearlyDiscount: 20,
      characters: 30000,
      voiceClones: 5,
      description: 'Yeni başlayanlar için ideal',
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: 'green',
      features: [
        `30,000 karakter/ay (~${calculateMinutes(30000)} dakika ses/ay)`,
        '5 ses klonlama hakkı',
        '20+ dil desteği',
        'Temel kalite (22kHz)',
        'MP3, WAV format desteği',
        'Email destek',
        'Ticari kullanım hakkı'
      ],
      limitations: [
        'API erişimi yok',
        'Öncelik desteği yok'
      ],
      cta: 'Başlangıç Paketi'
    },
    {
      id: 'icerik',
      name: 'İçerik Üreticisi',
      price: isYearly ? 1592 : 199,
      originalPrice: isYearly ? 2388 : 298.5,
      yearlyDiscount: 20,
      characters: 100000,
      voiceClones: 10,
      description: 'Düzenli içerik üreticileri için',
      icon: <Star className="w-6 h-6 text-blue-600" />,
      color: 'blue',
      features: [
        `100,000 karakter/ay (~${calculateMinutes(100000)} dakika ses/ay)`,
        '10 ses klonlama hakkı',
        '20+ dil desteği',
        'Yüksek kalite (44kHz)',
        'Tüm formatlar (MP3, WAV, OGG)',
        'SSML desteği ile gelişmiş kontrol',
        'Toplu metin işleme',
        'Öncelik email destek',
        'Ticari kullanım hakkı'
      ],
      limitations: [
        'API erişimi sınırlı'
      ],
      cta: 'İçerik Üreticisi'
    },
    {
      id: 'profesyonel',
      name: 'Profesyonel',
      price: isYearly ? 3192 : 399,
      originalPrice: isYearly ? 4788 : 598.5,
      yearlyDiscount: 20,
      characters: 250000,
      voiceClones: 20,
      description: 'Profesyonel kullanım için en iyi seçim',
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      color: 'purple',
      popular: true,
      features: [
        `250,000 karakter/ay (~${calculateMinutes(250000)} dakika ses/ay)`,
        '20 ses klonlama hakkı',
        '20+ dil desteği',
        'Stüdyo kalite (48kHz)',
        'Tüm premium formatlar',
        'Gelişmiş SSML ve duygu kontrolü',
        'Toplu işleme ve API erişimi',
        'Öncelik destek (24 saat içinde yanıt)',
        'Ticari kullanım ve revizyon hakkı',
        'Custom voice training'
      ],
      limitations: [],
      cta: 'En Popüler - Profesyonel'
    },
    {
      id: 'kurumsal',
      name: 'Kurumsal',
      price: isYearly ? 23992 : 2999,
      originalPrice: isYearly ? 35988 : 4498.5,
      yearlyDiscount: 20,
      characters: 2000000,
      voiceClones: 50,
      description: 'Büyük ölçekli işletmeler için tam çözüm',
      icon: <Building2 className="w-6 h-6 text-orange-600" />,
      color: 'orange',
      enterprise: true,
      features: [
        `2,000,000 karakter/ay (~${calculateMinutes(2000000)} dakika ses/ay)`,
        '50 ses klonlama hakkı',
        'Tüm dünya dillerinde destek',
        'Broadcast kalite (48kHz+)',
        'Özel format desteği',
        'Advanced AI ses klonlama',
        'Unlimited API calls',
        '7/24 premium destek',
        'SLA garantisi (%99.9 uptime)',
        'Özel entegrasyon desteği',
        'Dedicated account manager',
        'Custom AI model training',
        'White-label çözümü'
      ],
      limitations: [],
      cta: 'Kurumsal Çözüm',
      reverse: true
    }
  ];

  const getColorClasses = (color: string, type: 'border' | 'bg' | 'text' | 'button') => {
    const colorMap = {
      green: {
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      blue: {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        border: 'border-purple-200',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        border: 'border-orange-200',
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || '';
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4 animate-pulse">
            <AlertCircle size={14} className="text-red-600" />
            <span className="text-xs font-bold text-red-700 tracking-wide uppercase font-['Inter']">
              🔥 Yıllık Paketlerde %20 İNDİRİM
            </span>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex justify-center mb-6">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
              <div className="text-xs text-slate-600 mb-1 font-['Inter']">İndirim bitiyor:</div>
              <CountdownTimer targetDate={monthEndDate} />
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-6">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-700 font-['Inter']">
              Son 24 saatte 89 kişi paket satın aldı • Bu ayın en popüler fiyatları!
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 font-['Inter']">
            Size Uygun <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Paketi Seçin
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto font-['Inter']">
            20+ dilde profesyonel seslendirme, ses klonlama ve gelişmiş özelliklerle içeriklerinizi bir üst seviyeye taşıyın.
          </p>

          {/* YEARLY/MONTHLY TOGGLE */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Aylık
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium font-['Inter'] ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
                Yıllık
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded font-['Inter'] animate-bounce">
                %20 İNDİRİM!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN PRICING PLANS */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-['Inter']">
              🎯 Aylık Abonelik Paketleri
            </h2>
            <p className="text-slate-600 font-['Inter']">
              Düzenli kullanım için en uygun fiyatlı seçenekler - İhtiyacınıza göre seçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular
                    ? 'border-purple-200 scale-105 bg-gradient-to-b from-purple-50/50 to-white lg:-mt-4 lg:mb-4'
                    : plan.enterprise
                    ? 'border-orange-200 bg-gradient-to-b from-orange-50/30 to-white'
                    : getColorClasses(plan.color, 'border')
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full animate-pulse">
                      🔥 EN POPÜLER
                    </div>
                  </div>
                )}

                {plan.enterprise && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                      👑 PREMIUM
                    </div>
                  </div>
                )}

                {/* PLAN HEADER */}
                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-full ${getColorClasses(plan.color, 'bg')} mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-end justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-slate-900">
                        ₺{plan.price.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-slate-500 text-sm">
                        /{isYearly ? 'yıl' : 'ay'}
                      </span>
                    </div>
                    
                    {isYearly && (
                      <div className="text-sm text-green-600 mb-2">
                        <span className="line-through text-slate-400">₺{plan.originalPrice.toLocaleString('tr-TR')}</span>
                        <span className="ml-2 font-bold">%{plan.yearlyDiscount} tasarruf!</span>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 space-y-1">
                      <div>
                        {isYearly
                          ? `${calculateMinutes(plan.characters) * 12} dakika/yıl`
                          : `~${calculateMinutes(plan.characters)} dakika ses/ay`
                        }
                      </div>
                      <div>
                        ₺{(plan.price / (isYearly ? calculateMinutes(plan.characters) * 12 : calculateMinutes(plan.characters))).toFixed(2)}/dakika
                      </div>
                    </div>
                  </div>

                  {status === 'loading' ? (
                    <div className="w-full py-3 px-6 rounded-xl bg-slate-200 animate-pulse">
                      <span className="text-transparent">Yükleniyor...</span>
                    </div>
                  ) : (
                    <Link href={`/payment/${plan.id}`}>
                      <button className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors ${getColorClasses(plan.color, 'button')} ${plan.popular ? 'animate-pulse' : ''}`}>
                        {plan.cta}
                      </button>
                    </Link>
                  )}
                </div>

                {/* FEATURES */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">✨ Özellikler</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">⚠️ Kısıtlamalar</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADDITIONAL SERVICES */}
      <section className="pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-['Inter']">
              🎙️ Ek Hizmetler
            </h2>
            <p className="text-slate-600 font-['Inter']">
              Paketinizi tamamlayan özel hizmetler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Seslendirme Per-Character */}
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Karakter Bazlı Seslendirme</h3>
                <p className="text-slate-600">İhtiyacınız kadar ödeyin</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">₺0.0029</div>
                <div className="text-sm text-slate-500">per karakter</div>
                <div className="text-xs text-slate-400 mt-1">
                  10,000 karakter = ₺29 (~12 dakika ses)
                </div>
              </div>

              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">Minimum sipariş yok</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">Kredi kartı ile anında ödeme</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">20+ dil desteği</span>
                </li>
              </ul>

              {session ? (
                <Link href="/dashboard">
                  <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                    Hemen Kullan
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                    Başla
                  </button>
                </Link>
              )}
            </div>

            {/* Deşifre Per-Minute */}
            <div className="bg-white rounded-3xl p-8 border-2 border-green-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Dakika Bazlı Deşifre</h3>
                <p className="text-slate-600">Konuşmayı metne çevirin</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">₺0.65</div>
                <div className="text-sm text-slate-500">per dakika</div>
                <div className="text-xs text-slate-400 mt-1">
                  60 dakika = ₺39 (1 saat ses)
                </div>
              </div>

              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">%95 doğruluk oranı</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">Türkçe ve İngilizce</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-600">Zaman damgası ekleme</span>
                </li>
              </ul>

              {session ? (
                <Link href="/dashboard">
                  <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
                    Hemen Kullan
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
                    Başla
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-slate-600">
              Fiyatlandırma hakkında merak ettikleriniz
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Yıllık paketlerde %20 indirim nasıl çalışır?",
                a: "Yıllık ödeme seçeneğinde tüm paketlerimizde %20 indirim uyguluyoruz. Örneğin, Profesyonel paket aylık 399₺ iken, yıllık ödemede 3,192₺ (ayda 266₺) olur."
              },
              {
                q: "Karakter sınırımı aştığımda ne oluyor?",
                a: "Karakter sınırınızı aştığınızda otomatik olarak karakter bazlı fiyatlandırmaya (₺0.0029/karakter) geçer. Hiçbir hizmet kesintisi yaşanmaz."
              },
              {
                q: "Ses klonlama nasıl çalışır?",
                a: "Paketinizde bulunan ses klonlama hakkınızla 10 dakikalık temiz ses örneği yükleyerek kendi sesinizi klonlayabilirsiniz. İşlem 15-30 dakika içinde tamamlanır."
              },
              {
                q: "İptal etme politikanız nedir?",
                a: "İstediğiniz zaman paketinizi iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar tüm özelliklerinizi kullanmaya devam edersiniz."
              },
              {
                q: "Kurumsal paket için özel anlaşma yapabilir miyiz?",
                a: "Elbette! Kurumsal paketimiz tamamen özelleştirilebilir. Özel ses modelleri, API limitleri ve SLA garantileri için satış ekibimizle görüşün."
              },
              {
                q: "Ödeme yöntemleri nelerdir?",
                a: "Kredi kartı, banka kartı, havale ve kurumsal faturalama seçeneklerimiz mevcut. Tüm ödemeler 256-bit SSL şifreleme ile korunur."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Hemen Başlamaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ücretsiz deneme ile Yankı'yı keşfedin, profesyonel seslendirmenin gücünü hissedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {status === 'loading' ? (
              <>
                <div className="bg-white/20 animate-pulse px-8 py-4 rounded-xl">
                  <span className="text-transparent">Yükleniyor...</span>
                </div>
                <div className="border-2 border-white/20 animate-pulse px-8 py-4 rounded-xl">
                  <span className="text-transparent">Yükleniyor...</span>
                </div>
              </>
            ) : session ? (
              <>
                <Link href="/dashboard">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">
                    Panele Git
                  </button>
                </Link>
                <Link href="/dashboard/studio">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition">
                    Stüdyo
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">
                    Ücretsiz Başla
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition">
                    Satış Ekibiyle Görüş
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="M4.93 10.93a10 10 0 0 1 14.14 0"/></svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Yankı</span>
          </div>
          <p className="text-slate-400 mb-6">
            Ses teknolojilerinde yenilikçi çözümler
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <Link href="/" className="hover:text-blue-400 transition">Ana Sayfa</Link>
            <Link href="/pricing" className="hover:text-blue-400 transition">Fiyatlandırma</Link>
            <Link href="/contact" className="hover:text-blue-400 transition">İletişim</Link>
            <Link href="/about" className="hover:text-blue-400 transition">Hakkımızda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
