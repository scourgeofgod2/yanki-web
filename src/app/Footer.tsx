'use client';

import React, { useState } from 'react';
import { Twitter, Instagram, Linkedin, Github, Check } from 'lucide-react';

const Footer = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Başlangıç",
      price: isYearly ? 712 : 89,
      originalPrice: isYearly ? 1068 : null,
      description: "Hobiler ve küçük projeler için ideal başlangıç paketi",
      buttonText: "Başlangıç'ı Al",
      buttonStyle: "border border-blue-300 text-blue-700 hover:bg-blue-50",
      features: [
        "30,000 karakter/ay",
        "5 ses klonlama hakkı",
        "20+ dil desteği",
        "Temel kalite (22kHz)",
        "MP3, WAV format desteği",
        "Email destek",
        "Ticari kullanım hakkı"
      ],
      planType: "Plan İçeriği:"
    },
    {
      name: "İçerik Üreticisi",
      price: isYearly ? 1592 : 199,
      originalPrice: isYearly ? 2388 : null,
      description: "İçerik üreticileri için en popüler paket",
      buttonText: "İçerik Üreticisi'ni Al",
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700",
      popular: true,
      features: [
        "100,000 karakter/ay",
        "10 ses klonlama hakkı",
        "20+ dil desteği",
        "Yüksek kalite (44kHz)",
        "Tüm formatlar (MP3, WAV, OGG)",
        "SSML desteği",
        "Öncelik email destek",
        "Ticari kullanım hakkı"
      ],
      planType: "Başlangıç'taki her şey, artı:"
    },
    {
      name: "Profesyonel",
      price: isYearly ? 3192 : 399,
      originalPrice: isYearly ? 4788 : null,
      description: "Profesyonel kullanıcılar için güçlü çözüm",
      buttonText: "Profesyonel'i Al",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      features: [
        "250,000 karakter/ay",
        "20 ses klonlama hakkı",
        "20+ dil desteği",
        "Stüdyo kalite (48kHz)",
        "API erişimi",
        "Öncelik destek (24 saat içinde)",
        "Custom voice training",
        "Ticari kullanım"
      ],
      planType: "İçerik Üreticisi'ndeki her şey, artı:"
    },
    {
      name: "Kurumsal",
      price: isYearly ? 23992 : 2999,
      originalPrice: isYearly ? 35988 : null,
      description: "Büyük işletmeler için kapsamlı çözüm",
      buttonText: "Kurumsal'ı Al",
      buttonStyle: "bg-slate-900 text-white hover:bg-slate-800",
      features: [
        "2,000,000 karakter/ay",
        "50 ses klonlama hakkı",
        "Tüm dünya dillerinde destek",
        "Broadcast kalite (48kHz+)",
        "Unlimited API calls",
        "7/24 premium destek",
        "SLA garantisi (%99.9 uptime)",
        "Dedicated account manager"
      ],
      planType: "Profesyonel'deki her şey, artı:"
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-100 font-sans relative overflow-hidden">
      
      {/* CTA (Harekete Geçirici Mesaj) */}
      <div className="relative py-24 lg:py-32 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        
        {/* Arka Plan Deseni */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 z-0"></div>

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
           </div>
        </div>
      </div>

      {/* MODERN PRICING SECTION */}
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
                Aylık Ödeme
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all relative ${
                  isYearly
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yıllık Ödeme
                {isYearly && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    20% Tasarruf
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                <a href="/pricing">
                  <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all mb-8 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>
                </a>

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

      {/* Linkler & Copyright */}
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
                 {[<Twitter size={20} key="twitter" />, <Instagram size={20} key="instagram" />, <Linkedin size={20} key="linkedin" />, <Github size={20} key="github" />].map((icon, i) => (
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
                <li><a href="/products/tts" className="hover:text-blue-600 transition">Metin Seslendirme</a></li>
                <li><a href="/products/voice-cloning" className="hover:text-blue-600 transition">Ses Klonlama</a></li>
                <li><a href="/products/transcribe" className="hover:text-blue-600 transition">Deşifre</a></li>
                <li><a href="/pricing" className="hover:text-blue-600 transition">Fiyatlandırma</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Kaynaklar</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="/blog" className="hover:text-blue-600 transition">Blog</a></li>
                <li><a href="/help" className="hover:text-blue-600 transition">Yardım Merkezi</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition">İletişim</a></li>
                <li><a href="/about" className="hover:text-blue-600 transition">Hakkımızda</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Şirket</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="/about" className="hover:text-blue-600 transition">Hakkımızda</a></li>
                <li><a href="/privacy-policy" className="hover:text-blue-600 transition">Gizlilik Politikası</a></li>
                <li><a href="/terms-of-service" className="hover:text-blue-600 transition">Kullanım Şartları</a></li>
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