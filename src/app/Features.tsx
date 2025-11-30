'use client';

import React from 'react';
import { Play, Mic, ChevronDown, Trash2, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Features = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Akıllı yönlendirme fonksiyonu
  const handleSmartRedirect = () => {
    console.log('handleSmartRedirect çağrıldı:', { session, status });
    
    // Session yüklenene kadar bekle
    if (status === 'loading') {
      console.log('Session yükleniyor, bekle...');
      return;
    }
    
    if (status === 'authenticated' && session) {
      console.log('Kullanıcı giriş yapmış, dashboard\'a yönlendir');
      router.push('/dashboard');
    } else {
      console.log('Kullanıcı giriş yapmamış, register\'a yönlendir');
      router.push('/register');
    }
  };
  return (
    <section className="bg-slate-50 py-24 relative overflow-hidden font-sans">
      {/* Arka plan hafif desen */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* BÖLÜM BAŞLIĞI */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">Üretimlerinizi Kesintisiz Güçlendirin</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Çok Gerçekçi Sesler. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">500 Karakter Hediye ile Başlayın!</span>
          </h2>
        </div>

        {/* ÖZELLİK BLOKLARI */}
        <div className="space-y-24">

          {/* --- BLOK 1: KİŞİSEL DUBLAJ (Famous Actor yerine Kendi Sesin) --- */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row items-center gap-12">
            
            {/* SOL TARAF: UI DEMO (Metin ve Player) */}
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Metni aşağıya girin</h4>
              <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6 shadow-sm">
                <p className="text-slate-600 leading-relaxed text-sm">
                  <span className="bg-blue-100 text-blue-900 px-1 rounded">Dokunulmamış manzaraların kalbinde</span> ve antik gölgelerin kucağında, doğa harikalarla dolu bir doku örüyor. Güneş, nazik bir sanatçı gibi...
                </p>
              </div>
              
              {/* Player Bar */}
              <div className="bg-slate-900 rounded-full p-2 pr-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600">
                        <span className="text-xs text-white font-bold">YS</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm font-medium cursor-pointer hover:text-blue-200 transition">
                        <span>Benim Sesim (Klon)</span>
                        <ChevronDown size={16} />
                    </div>
                </div>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition active:scale-95">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* SAĞ TARAF: METİN İÇERİĞİ */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-100">
                Gerçekçi Sesler
              </span>
              <h3 className="text-3xl font-bold text-slate-900">
                Çok Gerçekçi Seslerle <br/>Metinleri Seslendirin!
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                500 karakter hediye ile başlayın! Ultra gerçekçi sesler ve gelişmiş yapay zeka ile metinlerinizi profesyonel seslere dönüştürün.
              </p>
              <button
                onClick={handleSmartRedirect}
                className="inline-block bg-white text-slate-900 border-2 border-slate-200 px-6 py-3 rounded-xl font-semibold hover:border-slate-900 transition shadow-sm hover:shadow-md cursor-pointer"
              >
                Hemen Dene
              </button>
            </div>
          </div>


          {/* --- BLOK 2: SES KLONLAMA (Aynen kalıyor, Türkçe) --- */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col-reverse lg:flex-row items-center gap-12">
            
            {/* SOL TARAF: METİN İÇERİĞİ */}
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="inline-block bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100">
                Ses Klonlama
              </span>
              <h3 className="text-3xl font-bold text-slate-900">
                Saniyeler İçinde <br/>Sesini Klonla
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Kendi ses klonunla üretkenliğini artır! Tek bir kısa kayıtla dijital ikizini oluştur ve metinleri ona okut. Başarı sadece bir adım uzakta.
              </p>
              <button
                onClick={handleSmartRedirect}
                className="inline-block bg-white text-slate-900 border-2 border-slate-200 px-6 py-3 rounded-xl font-semibold hover:border-slate-900 transition shadow-sm hover:shadow-md cursor-pointer"
              >
                Sesini Klonla
              </button>
            </div>

            {/* SAĞ TARAF: UI DEMO (Kayıt ve Liste) */}
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner flex flex-col justify-between min-h-[300px]">
              
              {/* Kayıt Alanı */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-full flex items-center justify-center relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full relative z-10"></div>
                 </div>
                 {/* Sabit Waveform Görseli */}
                 <div className="flex-1 h-8 flex items-center gap-0.5 overflow-hidden opacity-50">
                    {[83.7, 31.8, 13.8, 9.5, 60.0, 73.4, 0.1, 78.5, 19.1, 70.5, 6.3, 46.0, 32.8, 22.5, 81.2, 69.0, 44.6, 24.5, 88.9, 65.5, 54.9, 64.0, 55.0, 5.9, 84.6, 66.0, 55.5, 76.9, 84.7, 21.7, 11.7, 99.9, 20.9, 52.2, 73.3, 60.6, 36.9, 9.9, 22.3, 27.1].map((height, i) => (
                        <div key={i} className="w-1 bg-blue-500 rounded-full" style={{height: `${height}%`}}></div>
                    ))}
                 </div>
                 <span className="text-xs font-mono text-slate-400">01:23</span>
              </div>

              {/* Klon Listesi */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {['Klon 1 (Podcast Tonu)', 'Klon 2 (Hızlı)', 'Klon 3 (Reklam)'].map((item, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Mic size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-slate-300 hover:text-red-500 transition p-1">
                        <Trash2 size={16} />
                      </button>
                      <button className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-105 transition">
                        <Play size={14} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;