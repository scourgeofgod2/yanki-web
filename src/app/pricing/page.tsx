'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, Star, Zap, Crown, Users } from 'lucide-react';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Ücretsiz',
      price: 0,
      weeklyPrice: 0,
      yearlyPrice: 0,
      description: 'Keşif için mükemmel',
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: 'green',
      features: [
        'Günlük 500 karakter',
        '4 hazır ses karakteri',
        'Temel kalite (22kHz)',
        'MP3 indirme',
        'Topluluk desteği'
      ],
      limitations: [
        'Tüm ses karakterleri yok',
        'Ses klonlama yok',
        'API erişimi yok',
        'Öncelik desteği yok'
      ],
      cta: 'Ücretsiz Başla'
    },
    {
      id: 'starter',
      name: 'Başlangıç',
      price: isYearly ? 891 : 99,
      weeklyPrice: 25,
      yearlyPrice: 891,
      description: 'Hobiler ve küçük projeler',
      icon: <Star className="w-6 h-6 text-blue-600" />,
      color: 'blue',
      features: [
        '50.000 kredi/ay',
        'Tüm ses karakterleri (31 ses)',
        'Yüksek kalite (44kHz)',
        'Çoklu format (MP3, WAV)',
        'Duygu kontrolü',
        '3 ses klonlama hakkı',
        '20+ dil desteği',
        'Öncelik desteği'
      ],
      limitations: [
        'API erişimi yok'
      ],
      cta: 'Başlangıç\'ı Al'
    },
    {
      id: 'popular',
      name: 'Popüler',
      price: isYearly ? 2691 : 299,
      weeklyPrice: 75,
      yearlyPrice: 2691,
      description: 'Profesyonel kullanım',
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      color: 'purple',
      popular: true,
      features: [
        '200.000 kredi/ay',
        'Tüm ses karakterleri (31 ses)',
        'Stüdyo kalite (48kHz)',
        'Tüm formatlar',
        'Gelişmiş duygu kontrolü',
        '5 ses klonlama hakkı',
        'API erişimi',
        'Öncelik desteği',
        'Ticari kullanım'
      ],
      limitations: [],
      cta: 'Popüler\'i Al'
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: isYearly ? 5391 : 599,
      weeklyPrice: 150,
      yearlyPrice: 5391,
      description: 'Büyük işletmeler için',
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      color: 'orange',
      features: [
        '500.000 kredi/ay',
        'Tüm ses karakterleri (31 ses)',
        'Premium kalite (48kHz)',
        'Tüm formatlar',
        'Gelişmiş duygu kontrolü',
        '10 ses klonlama hakkı',
        'Özel API limitleri',
        'Özel destek',
        'SLA garantisi',
        'Ticari kullanım'
      ],
      limitations: [],
      cta: 'Kurumsal\'ı Al'
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
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="M4.93 10.93a10 10 0 0 1 14.14 0"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Yankı</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
            Ana Sayfa
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
            Giriş Yap
          </Link>
          <Link href="/register" className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition">
            Kayıt Ol
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
            <Star size={14} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
              500 Karakter Hediye ile Başlayın
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Size Uygun <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Paketi Seçin
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
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
              <span className={`text-sm font-medium ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
                Yıllık
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                35% İndirim
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CREDIT PACKAGES */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              💳 Kredi Paketleri
            </h2>
            <p className="text-slate-600">
              İhtiyacınıza göre kredi satın alın, istediğiniz zaman kullanın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
            {[
              { credits: 20000, price: 39, popular: false, color: 'blue' },
              { credits: 50000, price: 79, popular: true, color: 'purple' },
              { credits: 100000, price: 149, popular: false, color: 'green' },
              { credits: 250000, price: 399, popular: false, color: 'orange' },
              { credits: 600000, price: 599, popular: false, color: 'red' }
            ].map((pkg) => (
              <div
                key={pkg.credits}
                className={`relative bg-white rounded-3xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  pkg.popular 
                    ? 'border-purple-200 scale-105 bg-gradient-to-b from-purple-50/50 to-white' 
                    : 'border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      En Popüler
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-2xl mb-4">💎</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {pkg.credits.toLocaleString('tr-TR')} Kredi
                  </h3>
                  <div className="text-3xl font-bold text-slate-900 mb-4">
                    ₺{pkg.price}
                  </div>
                  <div className="text-sm text-slate-500 mb-6">
                    ~₺{(pkg.price / (pkg.credits / 1000)).toFixed(2)} / 1K kredi
                  </div>
                  
                  <button className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-colors hover:opacity-90 ${
                    pkg.popular ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    Satın Al
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-900 mb-4">🎙️ Ses Klonlama Fiyatları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-6 border border-orange-200">
                  <div className="text-lg font-semibold text-slate-900 mb-2">HD Kalite Model</div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">50,000 Kredi</div>
                  <div className="text-sm text-slate-600">En yüksek kalite, profesyonel ses klonlama</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-green-200 relative">
                  <div className="absolute -top-2 right-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">%60 İndirim</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900 mb-2">Turbo Model</div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">20,000 Kredi</div>
                  <div className="text-sm text-slate-600">Hızlı ve ekonomik, iyi kalite</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PLANS */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              📊 Aylık Abonelik Planları
            </h2>
            <p className="text-slate-600">
              Düzenli kullanım için en uygun fiyatlı seçenekler
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-blue-200 scale-105 bg-gradient-to-b from-blue-50/50 to-white' 
                    : getColorClasses(plan.color, 'border')
                } ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full">
                      En Popüler
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
                    {typeof plan.price === 'number' ? (
                      <>
                        <div className="flex items-end justify-center gap-1">
                          <span className="text-4xl font-bold text-slate-900">
                            ₺{plan.price}
                          </span>
                          <span className="text-slate-500 text-sm">
                            /{isYearly ? 'yıl' : 'ay'}
                          </span>
                        </div>
                        {!isYearly && plan.weeklyPrice > 0 && (
                          <div className="text-sm text-slate-500 mt-1">
                            ~₺{plan.weeklyPrice}/hafta
                          </div>
                        )}
                        {isYearly && typeof plan.yearlyPrice === 'number' && plan.yearlyPrice > 0 && (
                          <div className="text-sm text-slate-500 mt-1">
                            Toplam: ₺{plan.yearlyPrice}/yıl
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-3xl font-bold text-slate-900">
                        {plan.price}
                      </div>
                    )}
                  </div>

                  <button className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors ${getColorClasses(plan.color, 'button')}`}>
                    {plan.cta}
                  </button>
                </div>

                {/* FEATURES */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Özellikler</h4>
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
                      <h4 className="font-semibold text-slate-900 mb-3">Kısıtlamalar</h4>
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

      {/* FAQ SECTION */}
      <section className="py-20 bg-slate-50">
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
                q: "500 karakter hediye nasıl çalışır?",
                a: "Kayıt olduktan sonra hesabınıza otomatik olarak 500 karakter yüklenir. Bu karakterleri istediğiniz zaman kullanabilirsiniz."
              },
              {
                q: "Aylık paketimi iptal edebilir miyim?",
                a: "Evet, istediğiniz zaman paketinizi iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar hizmet almaya devam edersiniz."
              },
              {
                q: "Ses klonlama nasıl çalışır?",
                a: "Premium pakette 3 farklı sesinizi klonlayabilirsiniz. Sadece 30 saniyelik temiz bir ses kaydı yeterli."
              },
              {
                q: "API erişimi kimler için?",
                a: "Premium ve Kurumsal paket sahipleri API'yi kullanabilir. Geliştiriciler için detaylı dokümantasyon sunuyoruz."
              },
              {
                q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
                a: "Kredi kartı, banka kartı ve havale ile ödeme kabul ediyoruz. Güvenli ödeme altyapımız ile verileriniz korunur."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
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
            500 karakter hediye ile Yankı'yı deneyin, profesyonel seslendirmenin gücünü keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">
                Ücretsiz Başla
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition">
                Demo İzle
              </button>
            </Link>
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
            <Link href="#" className="hover:text-blue-400 transition">Destek</Link>
            <Link href="#" className="hover:text-blue-400 transition">Gizlilik</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
