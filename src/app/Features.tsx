'use client';

import React from 'react';
import { ArrowRight, Mic, Volume2, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Features = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSmartRedirect = () => {
    if (status === 'loading') return;
    
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Ses Klonlama",
      description: "Ses klonlama, ses sentezi veya ses çoğaltma olarak da bilinen, belirli bir kişinin sesine çok yakın bir bilgisayar veya yapay zeka tarafından üretilen ses yaratma sürecidir. Bu süreç, bir ses modelinin o kişinin benzersiz ses özelliklerini, tonlamalarını ve konuşma kalıplarını yakalamak için eğitilmesini içerir.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Metin Seslendirme",
      description: "Metin seslendirme (TTS) teknolojisi, yazılı metni konuşulan kelimelere dönüştüren bir ses AI biçimidir. Bilgisayarların veya AI sistemlerinin sağlanan metni işleyerek ve sentezleyerek insansı konuşma üretmesine olanak tanır.",
      color: "text-green-600", 
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Seste Duygu Analizi",
      description: "Seste duygu tespiti, konuşma duygu tanıma olarak da bilinen, ses AI'da konuşmacının ses özelliklerine dayalı duygusal durumunu analiz etmek ve belirlemek için kullanılan bir tekniktir.",
      color: "text-orange-600",
      bgColor: "bg-orange-50", 
      borderColor: "border-orange-200"
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header - UseCases Typography Style */}
        <div className="text-center mb-20">
          <h2 className="text-6xl lg:text-8xl font-bold text-gray-900 leading-[0.9] tracking-tighter mb-6">
            Basit ama <br />
            <span className="text-blue-600">Gerçek</span> Özellikler.
          </h2>
          <div className="h-2 w-32 bg-gray-900 rounded-full mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI teknolojimiz ses üretim sürecini optimize eder,
            hızlı ve doğru sonuçlar sağlar
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Main Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Yüksek doğruluk, 
                kullanımı kolay ürün.
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Yüksek doğruluk ve kullanım kolaylığına odaklanmış gelişmiş AI algoritmaları, 
                doğru sonuçlar sunarken sorunsuz bir kullanıcı deneyimi sağlamanın önemini 
                anlayarak tasarlandı.
              </p>
              
              <button
                onClick={handleSmartRedirect}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Daha Fazla Öğren
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Voice Cloning Demo Interface */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-500">🧬 Ses Klonlama Demo</span>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  Yankı'nın ses klonlama teknolojisini keşfedin. Orijinal ses ile klonlanmış sonucu karşılaştırın.
                </p>
              </div>

              {/* 3-Step Process */}
              <div className="space-y-6">
                
                {/* Step 1: Source Voice */}
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">Kaynak Ses</h5>
                    <div className="bg-gray-50 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Orijinal Kayıt</span>
                        <span className="text-xs text-gray-500">30 saniye</span>
                      </div>
                      <div className="mt-3">
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition flex items-center gap-2">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                          Dinle
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Gerçek kullanıcı kaydı örneği</div>
                  </div>
                </div>

                {/* Step 2: Target Text */}
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">Hedef Metin</h5>
                    <div className="bg-white rounded-lg border p-3">
                      <p className="text-sm text-gray-600 italic leading-relaxed">
                        Yankı ile sesini klonla ve içerik üretiminde devrim yap! Sadece 30
                        saniye kayıt yeterli.
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">AI bu metni klonlanmış sesle okuyacak</div>
                  </div>
                </div>

                {/* Step 3: Cloned Result */}
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">Klonlanmış Ses</h5>
                    <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">AI Sonuç</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          YENİ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                          Dinle
                        </button>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium text-green-600">Sonuç:</span> Doğruluk %98
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Aynı ses, farklı metin!</div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSmartRedirect}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                  >
                    Ses Klonlamayı Deneyin
                  </button>
                  <div className="text-xs text-gray-500 mt-2">
                    Ücretsiz hesap oluşturun • 500 karakter hediye
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`${feature.bgColor} ${feature.borderColor} border p-3 rounded-lg`}>
                    <div className={feature.color}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1 transition">
                      Devamını Oku
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;