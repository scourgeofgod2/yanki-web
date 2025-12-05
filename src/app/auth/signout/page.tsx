'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut, CheckCircle } from 'lucide-react';

export default function SignOutPage() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSignedOut, setIsSignedOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      setIsSignedOut(true);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    } finally {
      setIsSigningOut(false);
      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  if (isSignedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-6 font-['Inter']">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Başarıyla Çıkış Yaptınız
            </h1>
            
            <p className="text-gray-600 mb-8">
              Yankı hesabınızdan güvenli bir şekilde çıkış yaptınız. Ana sayfaya yönlendiriliyorsunuz...
            </p>
            
            <div className="space-y-4">
              <Link href="/" className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-block">
                Ana Sayfaya Git
              </Link>
              
              <Link href="/login" className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors inline-block">
                Tekrar Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6 font-['Inter']">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-10 h-10 text-gray-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Çıkış Yapmak İstiyor Musunuz?
          </h1>
          
          <p className="text-gray-600 mb-8">
            Yankı hesabınızdan çıkış yapmak üzeresiniz. Bu işlem tamamlandığında oturumunuz sonlandırılacaktır.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSigningOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              {isSigningOut ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
            </button>
            
            <Link href="/dashboard" className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors inline-block">
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              İptal Et
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Teknik destek için{' '}
            <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">
              iletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}