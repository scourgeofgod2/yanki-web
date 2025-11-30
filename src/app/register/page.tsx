"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Mail, Lock, ArrowRight, User, Check, Zap, Star, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to login with success message
        router.push('/login?message=Hesabınız başarıyla oluşturuldu. Lütfen giriş yapın.');
      } else {
        setError(data.error || 'Kayıt işlemi başarısız oldu');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // DIŞ KAPLAYICI
    <div className="min-h-screen w-full bg-[#F8F9FC] flex items-center justify-center p-4 lg:p-6 font-sans relative overflow-hidden">
      
      {/* Arka Plan Deseni */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 z-0"></div>

      {/* --- ANA KART --- */}
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative z-10 grid lg:grid-cols-2">
         
         {/* SOL TARA: FORM ALANI */}
         <div className="p-8 lg:p-16 flex flex-col justify-center order-1 lg:order-1">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v20"/><path d="M4.93 10.93a10 10 0 0 1 14.14 0"/></svg>
               </div>
               <span className="font-bold text-xl text-slate-900 tracking-tight">Yankı</span>
            </div>

            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 mb-2">Hemen Başlayın</h1>
               <p className="text-slate-500">
                  30 saniyede ücretsiz hesabınızı oluşturun. Kredi kartı gerekmez.
               </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               
               {/* Ad Soyad (Register'a Özel) */}
               <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Ad Soyad</label>
                  <div className="relative group">
                     <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" />
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                        placeholder="Adınız ve Soyadınız"
                     />
                  </div>
               </div>

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
                  <label className="text-sm font-semibold text-slate-700">Şifre</label>
                  <div className="relative group">
                     <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" />
                     <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-3.5 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                        placeholder="En az 6 karakter"
                     />
                  </div>
               </div>

               {/* Sözleşme Checkbox */}
               <div className="flex items-start gap-3 pt-2">
                  <div className="relative flex items-center">
                     <input type="checkbox" required id="terms" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400" />
                     <Check size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-500 cursor-pointer select-none">
                     <Link href="#" className="text-slate-900 font-semibold hover:underline">Hizmet Şartları</Link>'nı ve <Link href="#" className="text-slate-900 font-semibold hover:underline">Gizlilik Politikası</Link>'nı kabul ediyorum.
                  </label>
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
               >
                  {isLoading ? 'Hesap Oluşturuluyor...' : 'Ücretsiz Kayıt Ol'}
                  {!isLoading && <ArrowRight size={18} />}
               </button>

            </form>
            
            {/* Alt Link */}
            <p className="text-center mt-8 text-sm text-slate-500">
               Zaten hesabınız var mı? <Link href="/login" className="text-blue-600 font-bold hover:underline">Giriş Yap</Link>
            </p>

         </div>

         {/* SAĞ TARAF: MOTİVASYON KARTI (Light Theme) */}
         <div className="bg-slate-50 relative p-8 lg:p-16 flex flex-col justify-center order-2 lg:order-2 overflow-hidden min-h-[500px] lg:min-h-auto">
            
            {/* Dekoratif Gradientler */}
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-200 rounded-full blur-[80px] opacity-40"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-indigo-200 rounded-full blur-[80px] opacity-40"></div>

            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <Star size={12} fill="currentColor" />
                  Starter Plan
               </div>
               
               <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
                  Profesyonel Ses Dünyasına <br/> <span className="text-blue-600">İlk Adımı Atın.</span>
               </h2>
               <p className="text-slate-500 leading-relaxed mb-8">
                  Kayıt olduğunuz anda hesabınıza tanımlanacak ücretsiz avantajlar:
               </p>

               {/* ÖZELLİK KARTI (Benefit Card) */}
               <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-8 space-y-4">
                  
                  <BenefitItem title="5.000 Karakter Hediye" desc="İlk projeniz için anında kredi." />
                  <div className="h-px bg-slate-50 w-full"></div>
                  <BenefitItem title="Tüm Seslere Erişim" desc="20+ Türkçe, 50+ Global ses modeli." />
                  <div className="h-px bg-slate-50 w-full"></div>
                  <BenefitItem title="Ticari Kullanım Hakkı" desc="Youtube ve Sosyal Medya için lisanslı." />

               </div>

               {/* Güvenlik/Referans Notu */}
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                           {/* Placeholder Avatar */}
                           <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full rounded-full" />
                        </div>
                     ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                     <span className="text-slate-900 font-bold">2,000+</span> içerik üreticisi bugün katıldı.
                  </p>
               </div>

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

// Yardımcı Bileşen: Liste Elemanı
function BenefitItem({ title, desc }: { title: string, desc: string }) {
   return (
      <div className="flex items-start gap-4">
         <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Zap size={16} fill="currentColor" className="opacity-80" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
         </div>
      </div>
   )
}