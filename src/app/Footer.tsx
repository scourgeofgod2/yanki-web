'use client';

import React, { useState } from 'react';
import { Twitter, Instagram, Linkedin, Github, Mic, Wand2, Globe, Check, Star } from 'lucide-react';

const Footer = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Başlangıç",
      price: isYearly ? 891 : 99,
      originalPrice: isYearly ? 1188 : null,
      description: "Hobiler ve küçük projeler için ideal başlangıç paketi",
      buttonText: "Başlangıç'ı Al",
      buttonStyle: "border border-blue-300 text-blue-700 hover:bg-blue-50",
      features: [
        "50.000 kredi/ay",
        "Tüm ses karakterleri (31 ses)",
        "Yüksek kalite (44kHz)",
        "Çoklu format (MP3, WAV)",
        "Duygu kontrolü",
        "3 ses klonlama hakkı",
        "20+ dil desteği"
      ],
      planType: "Plan İçeriği:"
    },
    {
      name: "Popüler",
      price: isYearly ? 2691 : 299,
      originalPrice: isYearly ? 3588 : null,
      description: "Profesyonel kullanım için en popüler paket",
      buttonText: "Popüler'i Al",
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700",
      popular: true,
      features: [
        "200.000 kredi/ay",
        "Tüm ses karakterleri (31 ses)",
        "Stüdyo kalite (48kHz)",
        "Tüm formatlar",
        "Gelişmiş duygu kontrolü",
        "5 ses klonlama hakkı",
        "API erişimi",
        "Ticari kullanım"
      ],
      planType: "Başlangıç'taki her şey, artı:"
    },
    {
      name: "Kurumsal",
      price: isYearly ? 5391 : 599,
      originalPrice: isYearly ? 7188 : null,
      description: "Büyük işletmeler için kapsamlı çözüm",
      buttonText: "Kurumsal'ı Al",
      buttonStyle: "bg-slate-900 text-white hover:bg-slate-800",
      features: [
        "500.000 kredi/ay",
        "Premium kalite (48kHz)",
        "10 ses klonlama hakkı",
        "Özel API limitleri",
        "Özel destek",
        "SLA garantisi",
        "Ticari kullanım",
        "Kurumsal güvenlik"
      ],
      planType: "Popüler'deki her şey, artı:"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Ahmet Kaya",
      role: "Content Creator",
      company: "Digital Agency",
      rating: 5,
      comment: "Yankı ile podcast'lerimi profesyonel kalitede seslendiriyorum. Ses klonlama özelliği gerçekten büyüleyici!",
      avatar: "AK",
      avatarColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "Zeynep Arslan",
      role: "Marketing Director",
      company: "TechStart",
      rating: 5,
      comment: "Reklam filmlerimiz için mükemmel çözüm. Hem hızlı hem de çok kaliteli sonuçlar alıyoruz.",
      avatar: "ZA",
      avatarColor: "bg-purple-500"
    },
    {
      id: 3,
      name: "Murat Demir",
      role: "YouTuber",
      company: "1M Subscriber",
      rating: 5,
      comment: "Video içeriklerim için vazgeçilmez hale geldi. API entegrasyonu sayesinde workflow'um çok hızlandı.",
      avatar: "MD",
      avatarColor: "bg-green-500"
    },
    {
      id: 4,
      name: "Elif Özkan",
      role: "E-learning Specialist",
      company: "EduTech",
      rating: 5,
      comment: "Online kurslarımızı 20+ dilde sunabiliyoruz. Öğrencilerimizden harika geri dönüşler alıyoruz.",
      avatar: "EÖ",
      avatarColor: "bg-pink-500"
    },
    {
      id: 5,
      name: "Can Yılmaz",
      role: "Audio Producer",
      company: "Studio Pro",
      rating: 5,
      comment: "Stüdyo kalitesinde ses üretimi için ideal platform. Türkçe ses karakterleri gerçekten başarılı.",
      avatar: "CY",
      avatarColor: "bg-orange-500"
    },
    {
      id: 6,
      name: "Selin Aktaş",
      role: "Brand Manager",
      company: "Fashion Co.",
      rating: 5,
      comment: "Marka kimliğimize uygun sesler oluşturabiliyoruz. Müşteri deneyimi çok gelişti.",
      avatar: "SA",
      avatarColor: "bg-teal-500"
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-100 font-sans relative overflow-hidden">
      
      {/* --- TESTIMONIALS SECTION --- */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star size={16} className="fill-current" />
              Highly Rated and Recommended
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Binlerce kullanıcı Yankı ile içeriklerini dönüştürüyor ve başarılarını paylaşıyor.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
                
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-700 text-sm leading-relaxed mb-6">
                  "{testimonial.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                    <div className="text-slate-500 text-xs">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-slate-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">10K+</div>
              <div className="text-slate-600 text-sm">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">500K+</div>
              <div className="text-slate-600 text-sm">Oluşturulan Ses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">4.9★</div>
              <div className="text-slate-600 text-sm">Kullanıcı Puanı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">20+</div>
              <div className="text-slate-600 text-sm">Dil Desteği</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- BÖLÜM 1: CTA (Harekete Geçirici Mesaj) --- */}
      <div className="relative py-24 lg:py-32 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        
        {/* Arka Plan Deseni */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 z-0"></div>

        {/* Uçuşan Dekoratif Kartlar (Background Elements) */}
        {/* Sol Kart */}
        <div className="hidden lg:block absolute left-[10%] top-1/2 -translate-y-1/2 -rotate-12 opacity-40 blur-[1px] hover:opacity-100 hover:blur-0 transition duration-700 z-0">
           <div className="w-64 bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                 <span className="text-[10px] font-bold text-slate-400">Video Caption</span>
                 <span className="text-[10px] bg-orange-50 text-orange-500 px-2 py-0.5 rounded">Subtitle</span>
              </div>
              <div className="h-16 bg-slate-50 rounded-lg flex items-center justify-center mb-3">
                 <Mic className="text-slate-300" size={24} />
              </div>
              <div className="h-2 w-2/3 bg-slate-100 rounded mb-2"></div>
           </div>
        </div>

        {/* Sağ Kart */}
        <div className="hidden lg:block absolute right-[10%] top-1/2 -translate-y-1/2 rotate-12 opacity-40 blur-[1px] hover:opacity-100 hover:blur-0 transition duration-700 z-0">
           <div className="w-64 bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                 <span className="text-[10px] font-bold text-slate-400">Multilingual</span>
                 <span className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded">TTS</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                 {['English', 'Turkish', 'German', 'Spanish'].map(l => (
                    <span key={l} className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-500">{l}</span>
                 ))}
              </div>
           </div>
        </div>


        {/* Ana İçerik */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
           <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
             İçeriğinizi Dönüştürmeye <br/> Hazır Mısınız?
           </h2>
           <p className="text-lg text-slate-500">
             Ses teknolojisinin geleceğini Yankı ile yakalayın. Kredi kartı gerekmeden hemen deneyin.
           </p>
           
           <div className="flex flex-col items-center gap-4">
             <a href="/register">
               <button className="bg-slate-900 text-white text-lg px-10 py-4 rounded-2xl font-semibold shadow-2xl hover:bg-slate-800 hover:scale-105 transition duration-300">
                 Ücretsiz Başlayın
               </button>
             </a>
             <span className="text-xs font-medium text-slate-400">Powered by Minimax API</span>
           </div>
        </div>
      </div>


      {/* --- BÖLÜM 2: MODERN PRICING SECTION --- */}
      <div className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 rounded-full p-1 flex items-center">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  !isYearly
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all relative ${
                  isYearly
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly Billing
                {isYearly && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    save 20%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={plan.name} className={`rounded-2xl p-8 border-2 relative transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-50/50 to-white border-purple-200 scale-105 shadow-xl'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      En Popüler
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">₺{plan.price}</span>
                      <span className="text-slate-600">/ay</span>
                    </div>
                    {isYearly && plan.originalPrice && (
                      <div className="text-sm text-slate-500">
                        <span className="line-through">₺{plan.originalPrice}</span> yıllık ödeme
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all mb-8 ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">{plan.planType}</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-sm text-slate-700">
                        <Check size={16} className="text-slate-900 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- BÖLÜM 3: LİNKLER & COPYRIGHT --- */}
      <div className="border-t border-slate-100 pt-16 pb-12 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            
            {/* Logo ve Sosyal Medya */}
            <div className="col-span-2 lg:col-span-2 pr-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="M4.93 10.93a10 10 0 0 1 14.14 0"/></svg>
                </div>
                <span className="text-2xl font-bold text-slate-900">Yankı</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
                Yapay zeka destekli seslendirme ve klonlama teknolojileri ile içeriğinize hayat verin. İstanbul merkezli teknoloji girişimi.
              </p>
              <div className="flex gap-4">
                 {[<Twitter size={20} />, <Instagram size={20} />, <Linkedin size={20} />, <Github size={20} />].map((icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition">
                       {icon}
                    </a>
                 ))}
              </div>
            </div>

            {/* Link Kolonları */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Ürün</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition">Ses Klonlama</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Metin Seslendirme</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Duygu Analizi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">API Erişimi</a></li>
                <li><a href="/pricing" className="hover:text-blue-600 transition">Fiyatlandırma</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Kaynaklar</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Topluluk</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Geliştirici Docs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Şirket</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Kariyer</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Kullanım Şartları</a></li>
              </ul>
            </div>

          </div>

          {/* Alt Çizgi ve Copyright */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
             <p>© 2025 Yankı AI. Tüm hakları saklıdır.</p>
             <p>İstanbul, Türkiye</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;