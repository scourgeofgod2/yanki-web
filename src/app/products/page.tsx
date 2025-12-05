'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowRight, Mic, Users, FileText, Play, Star, Check, Zap, Shield, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';

export default function ProductsPage() {
  const products = [
    {
      id: 'tts',
      name: 'Seslendirme',
      slug: 'AI Destekli Text-to-Speech',
      description: 'Metinlerinizi doğal insan sesi ile profesyonel seslendirmeye dönüştürün. 20+ dil desteği ile kaliteli içerik üretin.',
      longDescription: 'Yapay zeka teknolojisi kullanarak metinlerinizi saniyeler içinde profesyonel kalitede ses dosyalarına çevirin. YouTube videoları, podcast\'ler, e-learning içerikleri ve daha fazlası için mükemmel.',
      icon: <Mic className="w-8 h-8" />,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      href: '/products/tts',
      features: [
        '20+ dil desteği ile geniş ses seçeneği',
        'Saniye içinde ses dosyası üretimi',
        'Professional broadcast kalitesi',
        'SSML desteği ile gelişmiş kontrol',
        'Toplu metin işleme özelliği',
        'MP3, WAV format desteği'
      ],
      useCases: [
        'YouTube video seslendirme',
        'Podcast prodüksiyonu', 
        'E-learning içerik üretimi',
        'Audiobook yapımı',
        'Kurumsal anons sistemi',
        'IVR ses menüleri'
      ],
      price: '0.0029₺/karakter',
      popular: true,
      demo: 'Ücretsiz deneyin - 1000 karakter hediye!'
    },
    {
      id: 'voice-cloning',
      name: 'Ses Klonlama',
      slug: 'AI Ses Klonlama Teknolojisi',
      description: 'Kendi sesinizi klonlayın ve sınırsız içerik üretin. Sadece 10 dakikalık ses örneği ile başlayın.',
      longDescription: 'Gelişmiş deep learning algoritmaları ile sesinizin dijital kopyasını oluşturun. Kendi sesinizle sınırsız içerik üretebilir, zamandan tasarruf edebilirsiniz.',
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      href: '/products/voice-cloning',
      features: [
        '10 dakikalık örnek ses ile klonlama',
        '%98 benzerlik oranı',
        'Çoklu dil desteği',
        'Güvenli veri işleme',
        'Hızlı klonlama süreci',
        'Ticari kulanım izni'
      ],
      useCases: [
        'Kişisel marka seslendirmesi',
        'Podcast serisi üretimi',
        'Çoklu dil içerik üretimi',
        'Kurumsal eğitim videoları',
        'Dijital asistan sesleri',
        'Oyun karakter sesleri'
      ],
      price: 'Paket bazlı fiyatlandırma',
      popular: false,
      demo: '14 günlük ücretsiz deneme!'
    },
    {
      id: 'transcribe',
      name: 'Deşifre',
      slug: 'Otomatik Konuşma Tanıma',
      description: 'Ses dosyalarınızı ve canlı konuşmaları yüksek doğrulukla metne çevirin. Çoklu dil desteği.',
      longDescription: 'Gelişmiş speech-to-text teknolojisi ile ses kayıtlarınızı, toplantılarınızı ve röportajlarınızı otomatik olarak metne dönüştürün.',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      href: '/products/transcribe',
      features: [
        '%95 doğruluk oranı',
        'Türkçe ve İngilizce desteği',
        'Canlı transkripsiyon',
        'Konuşmacı ayrımı',
        'Zaman damgası ekleme',
        'SRT altyazı formatı'
      ],
      useCases: [
        'Toplantı notları çıkarma',
        'Röportaj deşifresi',
        'Akademik araştırma',
        'Podcast altyazı üretimi',
        'Mahkeme tutanak işleme',
        'Gazeteci not tutma'
      ],
      price: '0.65₺/dakika',
      popular: false,
      demo: '30 dakika ücretsiz!'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Aktif Kullanıcı', icon: <Users className="w-6 h-6" /> },
    { number: '2M+', label: 'Üretilen Ses Dosyası', icon: <Play className="w-6 h-6" /> },
    { number: '%99.9', label: 'Uptime Oranı', icon: <TrendingUp className="w-6 h-6" /> },
    { number: '24/7', label: 'Destek Hizmeti', icon: <Shield className="w-6 h-6" /> }
  ];

  const benefits = [
    {
      title: 'Zaman Tasarrufu',
      description: 'Geleneksel seslendirme süreçlerine göre %90 daha hızlı üretim yapın',
      icon: <Zap className="w-8 h-8 text-yellow-600" />
    },
    {
      title: 'Maliyet Avantajı', 
      description: 'Professional stüdyo maliyetlerini %80 oranında düşürün',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />
    },
    {
      title: 'Kalite Garantisi',
      description: 'Broadcast kalitesinde ses çıktıları ve sürekli iyileştirme',
      icon: <Star className="w-8 h-8 text-purple-600" />
    },
    {
      title: 'Güvenlik',
      description: 'End-to-end şifreleme ve KVKK uyumlu veri işleme',
      icon: <Shield className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <>
      <Head>
        <title>AI Ses Teknolojileri - Seslendirme, Ses Klonlama, Deşifre | Yankı</title>
        <meta name="description" content="Yapay zeka destekli ses teknolojileri ile seslendirme, ses klonlama ve deşifre hizmetleri. 20+ dil desteği, profesyonel kalite, uygun fiyat." />
        <meta name="keywords" content="yapay zeka seslendirme, ai seslendirme, ses klonlama, deşifre, metinden sese, speech to text, türkçe seslendirme" />
        <meta property="og:title" content="AI Ses Teknolojileri - Yankı" />
        <meta property="og:description" content="Yapay zeka ile profesyonel ses çözümleri. Seslendirme, ses klonlama ve deşifre hizmetleri." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yankitr.com/products" />
        <link rel="canonical" href="https://yankitr.com/products" />
      </Head>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Yankı",
            "url": "https://yankitr.com",
            "logo": "https://yankitr.com/logo.png",
            "description": "Yapay zeka destekli ses teknolojileri şirketi",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Yıldız Posta Caddesi No 2",
              "addressLocality": "Gayrettepe",
              "addressRegion": "İstanbul",
              "addressCountry": "TR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+905413356537",
              "contactType": "customer support"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Ses Teknolojileri",
              "itemListElement": products.map(product => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": product.name,
                  "description": product.description
                }
              }))
            }
          })
        }}
      />

      <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
        <Navbar />

        {/* HERO SECTION */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">AI Destekli Ses Teknolojileri</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Ses Teknolojilerinin
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600"> Geleceği </span>
                Burada
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Yapay zeka destekli ses çözümlerimizle içerik üretim süreçlerinizi hızlandırın. 
                Seslendirme, ses klonlama ve deşifre teknolojileriyle profesyonel sonuçlar alın.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-indigo-300 hover:shadow-xl hover:scale-105"
                >
                  Ücretsiz Başla
                </Link>
                <Link
                  href="/demo"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Demo İzle
                </Link>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Ses Teknolojilerinde Her İhtiyacınız İçin Çözüm
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Üç ana ürünümüzle içerik üretiminden ses analizine kadar tüm ihtiyaçlarınızı karşılayın
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {products.map((product, index) => (
                <div key={product.id} className={`relative ${product.bgColor} border ${product.borderColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  {product.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        🔥 En Popüler
                      </span>
                    </div>
                  )}

                  <div className={`w-16 h-16 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {product.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-4">{product.slug}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Özellikler:</h4>
                    <ul className="space-y-2">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <div className={`text-2xl font-bold ${product.textColor} mb-2`}>{product.price}</div>
                    <div className="text-sm text-gray-500">{product.demo}</div>
                  </div>

                  <Link
                    href={product.href}
                    className={`block w-full text-center py-3 bg-gradient-to-r ${product.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105`}
                  >
                    Detayları İncele
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Neden Yankı'yı Seçmelisiniz?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Geleneksel ses prodüksiyon yöntemlerinden farklı olarak modern çözümler sunuyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Kullanım Alanları</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Çeşitli sektörlerden binlerce kullanıcı Yankı'yı tercih ediyor
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-lg flex items-center justify-center text-white mb-6`}>
                    {product.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{product.name} Kullanım Alanları</h3>
                  
                  <ul className="space-y-2">
                    {product.useCases.map((useCase, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${product.color}`}></div>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ses Teknolojilerinin Gücünü Keşfedin
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Bugün başlayın ve içerik üretim sürecinizi devrimsel bir şekilde değiştirin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:scale-105"
              >
                Ücretsiz Hesap Oluştur
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Satış Ekibiyle Görüş
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
              <p className="text-xl text-gray-600">AI ses teknolojileri hakkında merak ettikleriniz</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Ses kalitesi gerçek insanlarla aynı mı?</h3>
                <p className="text-gray-600">
                  Evet! Gelişmiş AI algoritmalarımız %95'in üzerinde doğrulukla insan sesini taklit eder. 
                  Professional broadcast kalitesinde ses çıktıları üretiyoruz.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Ürettiğim içerikleri ticari amaçlı kullanabilir miyim?</h3>
                <p className="text-gray-600">
                  Kesinlikle! Tüm ürettiğiniz ses dosyaları size aittir ve ticari projelerinizde 
                  kullanabilirsiniz. Herhangi bir telif hakkı sorunu yaşamazsınız.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Verilerim güvenli mi?</h3>
                <p className="text-gray-600">
                  Verileriniz end-to-end şifreleme ile korunur ve KVKK standartlarına uygun olarak işlenir. 
                  Hiçbir içeriğiniz üçüncü taraflarla paylaşılmaz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}