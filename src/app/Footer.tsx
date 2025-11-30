import React from 'react';
import { Twitter, Instagram, Linkedin, Github, Mic, Wand2, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 font-sans relative overflow-hidden">
      
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


      {/* --- BÖLÜM 2: PRICING TABLE --- */}
      <div className="bg-slate-50/50 py-20 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Ses Teknolojinizi Seçin
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              İhtiyacınıza uygun paketi seçin ve Yankı ile içeriklerinizi daha güçlü hale getirin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Ücretsiz Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ücretsiz</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">₺0</span>
                  <div className="text-xs text-slate-400 mt-1">~₺0/hafta</div>
                </div>
                <p className="text-sm text-slate-500">Demo ve test için mükemmel</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Günlük 500 karakter
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  4 hazır ses karakteri
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Temel duygu seçenekleri
                </li>
              </ul>
              
              <button className="w-full bg-slate-100 text-slate-900 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 transition">
                Hemen Deneyin
              </button>
            </div>

            {/* Başlangıç Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Başlangıç</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">₺99</span>
                  <span className="text-slate-500">/ay</span>
                  <div className="text-xs text-slate-400 mt-1">~₺25/hafta</div>
                </div>
                <p className="text-sm text-slate-500">Küçük projeler için ideal</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  50.000 kredi/ay
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Tüm ses karakterleri
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Tüm duygular
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  İndirme geçmişi
                </li>
              </ul>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition">
                Satın Al
              </button>
            </div>

            {/* Popüler Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-xs font-bold">
                EN POPÜLER
              </div>
              <div className="text-center mb-8 mt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Popüler</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">₺299</span>
                  <span className="text-slate-500">/ay</span>
                  <div className="text-xs text-slate-400 mt-1">~₺75/hafta</div>
                </div>
                <p className="text-sm text-slate-500">Orta ölçekli işletmeler için</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  200.000 kredi/ay
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Tüm ses karakterleri
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Tüm duygular
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  İndirme geçmişi
                </li>
              </ul>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition">
                Satın Al
              </button>
            </div>

            {/* Kurumsal Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Kurumsal</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">₺599</span>
                  <span className="text-slate-500">/ay</span>
                  <div className="text-xs text-slate-400 mt-1">~₺150/hafta</div>
                </div>
                <p className="text-sm text-slate-500">Büyük şirketler için</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  500.000 kredi/ay
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Tüm ses karakterleri
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Tüm duygular
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  İndirme geçmişi
                </li>
              </ul>
              
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition">
                İletişime Geçin
              </button>
            </div>
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