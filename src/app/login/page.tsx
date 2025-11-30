"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Mail, Lock, ArrowRight, Play, CheckCircle2, Mic, Pause } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Session kontrolü - giriş yapmış kullanıcıları dashboard'a yönlendir
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('Kullanıcı zaten giriş yapmış, dashboard\'a yönlendiriliyor...');
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Check for success message from register
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  // Session yüklenirken loading göster
  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full bg-[#F8F9FC] flex items-center justify-center p-4 lg:p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Session authenticated ise dashboard'a redirect edilecek, bu sayfa render edilmeyecek
  if (status === 'authenticated') {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email veya şifre hatalı');
      } else if (result?.ok) {
        // Login başarılı - dashboard'a yönlendir
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoPlay = () => {
    setIsPlayingDemo(true);
    setTimeout(() => setIsPlayingDemo(false), 3000); // 3 saniye sonra durur
  };

  return (
    // DIŞ KAPLAYICI: Tam ekran, ortalı, yumuşak gri arka plan
    <div className="min-h-screen w-full bg-[#F8F9FC] flex items-center justify-center p-4 lg:p-6 font-sans relative overflow-hidden">
      
      {/* Arka Plan Deseni (Noktalı) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 z-0"></div>

      {/* --- ANA KART (CENTERED CARD) --- */}
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative z-10 grid lg:grid-cols-2">
         
         {/* SOL TARAF: FORM ALANI (Mobilde Üstte Görünsün Diye Order-1) */}
         <div className="p-8 lg:p-16 flex flex-col justify-center order-1 lg:order-1">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="M4.93 10.93a10 10 0 0 1 14.14 0"/></svg>
               </div>
               <span className="font-bold text-xl text-slate-900 tracking-tight">Yankı</span>
            </div>

            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 mb-2">Tekrar Hoş Geldiniz</h1>
               <p className="text-slate-500">
                  Lütfen hesabınıza giriş yapın veya <Link href="/register" className="text-blue-600 font-semibold hover:underline">ücretsiz kayıt olun.</Link>
               </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
               
               <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">E-posta</label>
                  <div className="relative group">
                     <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" />
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                        placeholder="ornek@sirket.com"
                     />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                     <label className="text-sm font-semibold text-slate-700">Şifre</label>
                     <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Şifremi Unuttum?</a>
                  </div>
                  <div className="relative group">
                     <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" />
                     <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
               >
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  {!isLoading && <ArrowRight size={18} />}
               </button>

            </form>

            <div className="relative my-8">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
               <div className="relative flex justify-center text-xs uppercase tracking-wide font-medium"><span className="px-2 bg-white text-slate-400">veya şununla devam et</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold text-slate-700">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  Google
               </button>
               <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold text-slate-700">
                  <img src="https://www.svgrepo.com/show/448234/github.svg" className="w-5 h-5" alt="Github" />
                  GitHub
               </button>
            </div>

         </div>

         {/* SAĞ TARAF: GÖRSEL & DEMO (Mobilde Altta Görünsün Diye Order-2) */}
         <div className="bg-slate-50 relative p-8 lg:p-16 flex flex-col justify-between order-2 lg:order-2 overflow-hidden min-h-[500px] lg:min-h-auto">
            
            {/* Dekoratif Gradientler (Blurry Blobs) */}
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-200 rounded-full blur-[80px] opacity-40"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-purple-200 rounded-full blur-[80px] opacity-40"></div>

            <div className="relative z-10">
               <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
                  İçeriğinizi <br/> <span className="text-blue-600">Sesin Gücüyle</span> Büyütün.
               </h2>
               <p className="text-slate-500 leading-relaxed mb-8">
                  Yankı Studio ile metinlerinizi saniyeler içinde doğal konuşmaya çevirin veya kendi sesinizi klonlayın.
               </p>

               {/* QUICK DEMO KARTI (Beyaz Kart) */}
               <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-8">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                           <Mic size={18} />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900">Hızlı Demo</div>
                           <div className="text-xs text-slate-400">Mert - Belgesel Tonu</div>
                        </div>
                     </div>
                     {/* Play Butonu - DÜZELTİLDİ: ml-1 className içine alındı */}
                     <button 
                        onClick={handleDemoPlay}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${isPlayingDemo ? 'bg-slate-900 scale-95' : 'bg-blue-600 hover:scale-110 hover:bg-blue-700'}`}
                     >
                        {isPlayingDemo ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
                     </button>
                  </div>
                  
                  {/* Fake Waveform */}
                  <div className="flex items-center justify-between gap-1 h-8 opacity-40">
                     {[...Array(30)].map((_, i) => (
                        <div 
                           key={i} 
                           className={`w-1 rounded-full bg-slate-900 transition-all duration-300 ${isPlayingDemo ? 'animate-pulse' : ''}`}
                           style={{
                              height: isPlayingDemo ? `${Math.random() * 100}%` : '20%',
                              animationDelay: `${i * 0.05}s`
                           }}
                        ></div>
                     ))}
                  </div>
               </div>

               {/* İstatistikler */}
               <div className="grid grid-cols-3 gap-4">
                  <div>
                     <div className="text-2xl font-bold text-slate-900">50K+</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kullanıcı</div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-slate-900">1M+</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ses</div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-slate-900">4.9/5</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Puan</div>
                  </div>
               </div>

            </div>

            {/* Güvenlik Notu */}
            <div className="relative z-10 mt-8 flex items-center gap-2 text-xs text-slate-500 bg-white/50 w-max px-3 py-1.5 rounded-full border border-slate-100">
               <CheckCircle2 size={12} className="text-green-500" />
               <span>256-bit SSL ile güvenli bağlantı</span>
            </div>

         </div>

      </div>

      {/* Footer Copyright */}
      <div className="absolute bottom-4 text-xs text-slate-400">
         © 2024 Yankı AI. Tüm hakları saklıdır.
      </div>

    </div>
  );
}