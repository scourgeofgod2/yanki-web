'use client';

import React from 'react';
import { ArrowRight, Youtube, BookOpen, Share2, Mic } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UseCases = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSmartRedirect = (targetPage = 'register') => {
    console.log('UseCases handleSmartRedirect çağrıldı:', { session, status });
    
    if (status === 'loading') return;
    
    if (session) {
      // Kullanıcı giriş yapmışsa dashboard'a yönlendir
      router.push('/dashboard');
    } else {
      // Kullanıcı giriş yapmamışsa register veya demo'ya yönlendir
      if (targetPage === 'demo') {
        router.push('/#demo');
      } else {
        router.push('/register');
      }
    }
  };
  return (
    <section className="py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          
          {/* --- SOL KOLON (Başlık + Kartlar) --- */}
          <div className="flex flex-col gap-24">
            
            {/* BAŞLIK ALANI (Sol Üst) */}
            <div className="pt-10">
              <h2 className="text-6xl lg:text-8xl font-bold text-slate-900 leading-[0.9] tracking-tighter mb-6">
                Fikirleriniz <br />
                <span className="text-blue-600">Ses</span> Bulsun.
              </h2>
              <div className="h-2 w-32 bg-slate-900 rounded-full"></div>
            </div>

            {/* KART 1: YOUTUBE (Sol Tarafta) */}
            <div className="group">
              {/* Modern Kutu (Gradyan + Blur) */}
              <div className="h-[380px] w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2.5rem] mb-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500 rounded-3xl blur-[60px] opacity-40 group-hover:opacity-60 transition duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Youtube strokeWidth={1} size={80} className="text-slate-900 drop-shadow-lg transform group-hover:scale-110 transition duration-500" />
                </div>
              </div>
              
              {/* İçerik */}
              <div className="pr-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-3">YouTube Dublaj</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  Videolarınız için profesyonel seslendirme. Yüzünüzü göstermeden, sadece metin girerek içerik üretin.
                </p>
                <button
                  onClick={() => handleSmartRedirect('demo')}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn cursor-pointer"
                >
                  Hemen Dene <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </div>

            {/* KART 3: PODCAST (Sol Tarafta - Aşağıda) */}
            <div className="group pt-12">
               <div className="h-[320px] w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2.5rem] mb-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition duration-500"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Mic strokeWidth={1} size={80} className="text-slate-900 drop-shadow-lg transform group-hover:scale-110 transition duration-500" />
                </div>
               </div>
               <div className="pr-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Podcast</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  Podcast intro'ları veya tam bölümler. Stüdyo mikrofonu kalitesinde net sesler.
                </p>
                <button
                  onClick={() => handleSmartRedirect()}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn cursor-pointer"
                >
                  Kayıt Oluştur <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </div>

          </div>


          {/* --- SAĞ KOLON (Kaydırılmış Başlangıç) --- */}
          {/* lg:pt-48 ile sağ kolonu aşağı iterek o Zig-Zag görüntüsünü veriyoruz */}
          <div className="flex flex-col gap-24 lg:pt-48">
            
            {/* KART 2: AUDIOBOOK (Sağ Üst - Vurgulu Renk) */}
            <div className="group">
              {/* Bu kart referanstaki "Yeşil Kutu" yerine bizim accent rengimiz */}
              <div className="h-[450px] w-full bg-slate-900 rounded-[2.5rem] mb-8 relative overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(15,23,42,0.5)] transition-all duration-500">
                {/* Dekoratif Çizgiler */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-50"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                   <BookOpen strokeWidth={1} size={90} className="mb-6 transform group-hover:scale-110 transition duration-500" />
                   <div className="px-4 py-1 border border-white/20 rounded-full bg-white/10 backdrop-blur-md text-sm">
                      +20 Dil Desteği
                   </div>
                </div>
              </div>
              
              <div className="pr-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Sesli Kitap</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  Kitaplarınızı dinleyicilerle buluşturun. Uzun metinler için optimize edilmiş "Masalcı" tonlaması.
                </p>
                <button
                  onClick={() => handleSmartRedirect()}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn cursor-pointer"
                >
                  Dilleri Keşfet <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </div>

            {/* KART 4: SOSYAL MEDYA (Sağ Alt) */}
            <div className="group pt-12">
               <div className="h-[320px] w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2.5rem] mb-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500 rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition duration-500"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Share2 strokeWidth={1} size={80} className="text-slate-900 drop-shadow-lg transform group-hover:scale-110 transition duration-500" />
                </div>
               </div>
               <div className="pr-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Sosyal Medya</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  Instagram Reels ve TikTok için viral olmaya aday, yüksek enerjili ve hızlı seslendirmeler.
                </p>
                <button
                  onClick={() => handleSmartRedirect()}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn cursor-pointer"
                >
                  Viral Ses Üret <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Alt Bilgi */}
        <div className="mt-32 text-center">
            <button
              onClick={() => handleSmartRedirect()}
              className="bg-slate-900 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition duration-300 cursor-pointer"
            >
                Tüm Özellikleri Gör
            </button>
        </div>

      </div>
    </section>
  );
};

export default UseCases;