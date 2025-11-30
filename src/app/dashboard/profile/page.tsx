"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  BarChart,
  Settings,
  CheckCircle,
  Crown,
  Zap,
  Clock
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
  plan: string;
  totalGenerations: number;
  createdAt?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  // Plan bazında kredi limitleri
  const getPlanLimits = (plan?: string) => {
    switch(plan) {
      case 'starter':
        return { credits: 50000, name: 'Başlangıç' };
      case 'popular':
        return { credits: 200000, name: 'Popüler' };
      case 'enterprise':
        return { credits: 500000, name: 'Kurumsal' };
      default:
        return { credits: 500, name: 'Ücretsiz' };
    }
  };

  const planLimits = getPlanLimits(userData?.plan);
  const maxCredits = planLimits.credits;
  const usedCredits = maxCredits - (userData?.credits || planLimits.credits);
  const usagePercentage = (usedCredits / maxCredits) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Bilgileri</h1>
        <p className="text-gray-600">Hesap bilgilerinizi ve kullanım istatistiklerinizi görüntüleyin</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userData?.name || session?.user?.name || 'Kullanıcı'}
            </h2>
            <p className="text-gray-600 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {userData?.email || session?.user?.email}
            </p>
            <div className="flex items-center mt-2">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-500">
                Üye olma tarihi: {new Date().toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Status */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                userData?.plan === 'free' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {userData?.plan === 'free' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Crown className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{planLimits.name} Plan</h3>
                <p className="text-sm text-gray-600">
                  {maxCredits >= 50000 
                    ? `${(maxCredits/1000).toLocaleString('tr-TR')}K kredi/ay` 
                    : `Günlük ${maxCredits} karakter limiti`
                  }
                </p>
              </div>
            </div>
            {userData?.plan === 'free' && (
              <Link href="/pricing" className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all">
                Yükselt
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Credit Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Kredi Kullanımı</h3>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold text-gray-900">
                {userData?.credits || 500}
              </span>
              <span className="text-sm text-gray-500">/ {maxCredits}</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((userData?.credits || 500) / maxCredits) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {usedCredits} karakter kullandınız ({usagePercentage.toFixed(1)}%)
          </p>
        </div>

        {/* Generation Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Ses Üretimi</h3>
            <BarChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {userData?.totalGenerations || 0}
            </span>
            <p className="text-sm text-gray-600">Toplam ses üretimi</p>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Bu ay: {userData?.totalGenerations || 0} ses
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Plan Özellikleri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">
              {maxCredits >= 50000 
                ? `${(maxCredits/1000).toLocaleString('tr-TR')}K kredi/ay` 
                : `Günlük ${maxCredits} karakter`
              }
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">
              {userData?.plan === 'free' ? '4 farklı ses karakteri' : 'Tüm ses karakterleri (31 ses)'}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">
              {userData?.plan === 'free' ? '9 duygu seçeneği' : 'Gelişmiş duygu kontrolü'}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">20+ dil desteği</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">
              {userData?.plan === 'free' ? 'MP3 indirme' : 'Tüm formatlar (MP3, WAV)'}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Sınırsız geçmiş erişimi</span>
          </div>
          {userData?.plan !== 'free' && (
            <>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Ses klonlama hakkı</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">
                  {userData?.plan === 'starter' && 'API erişimi yok'}
                  {userData?.plan === 'popular' && 'API erişimi'}
                  {userData?.plan === 'enterprise' && 'Özel API limitleri'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 p-6">
        <div className="text-center">
          <Crown className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium'a Yükseltin</h3>
          <p className="text-gray-600 mb-4">
            Daha fazla karakter, özel sesler ve gelişmiş özellikler için premium plana geçin
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <Zap className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className="font-semibold text-gray-900">Başlangıç</h4>
              <p className="text-2xl font-bold text-gray-900 my-2">₺99<span className="text-sm text-gray-500">/ay</span></p>
              <p className="text-sm text-gray-600">50.000 kredi/ay</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-cyan-300 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium">Popüler</span>
              </div>
              <Crown className="w-8 h-8 text-purple-500 mb-2" />
              <h4 className="font-semibold text-gray-900">Popüler</h4>
              <p className="text-2xl font-bold text-gray-900 my-2">₺299<span className="text-sm text-gray-500">/ay</span></p>
              <p className="text-sm text-gray-600">200.000 kredi/ay</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <Settings className="w-8 h-8 text-orange-500 mb-2" />
              <h4 className="font-semibold text-gray-900">Kurumsal</h4>
              <p className="text-2xl font-bold text-gray-900 my-2">₺599<span className="text-sm text-gray-500">/ay</span></p>
              <p className="text-sm text-gray-600">500.000 kredi/ay</p>
            </div>
          </div>
          
          <Link href="/pricing" className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all">
            Premium'a Geç
          </Link>
        </div>
      </div>
    </div>
  );
}
