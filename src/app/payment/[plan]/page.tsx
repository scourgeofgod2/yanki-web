'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Copy, Check, AlertCircle, Phone, Mail, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Paket bilgileri
const planData = {
  'baslangic': {
    id: 'baslangic',
    name: 'Başlangıç Paketi',
    price: 89,
    yearlyPrice: 712,
    characters: 30000,
    voiceClones: 5,
    description: 'Hobiler ve küçük projeler için ideal başlangıç paketi',
    features: [
      '30,000 karakter/ay (~36 dakika ses/ay)',
      '5 ses klonlama hakkı',
      '20+ dil desteği',
      'Temel kalite (22kHz)',
      'MP3, WAV format desteği',
      'Email destek',
      'Ticari kullanım hakkı'
    ]
  },
  'icerik': {
    id: 'icerik',
    name: 'İçerik Üreticisi',
    price: 199,
    yearlyPrice: 1592,
    characters: 100000,
    voiceClones: 10,
    description: 'Düzenli içerik üreticileri için',
    features: [
      '100,000 karakter/ay (~120 dakika ses/ay)',
      '10 ses klonlama hakkı',
      '20+ dil desteği',
      'Yüksek kalite (44kHz)',
      'Tüm formatlar (MP3, WAV, OGG)',
      'SSML desteği ile gelişmiş kontrol',
      'Toplu metin işleme',
      'Öncelik email destek',
      'Ticari kullanım hakkı'
    ]
  },
  'profesyonel': {
    id: 'profesyonel',
    name: 'Profesyonel',
    price: 399,
    yearlyPrice: 3192,
    characters: 250000,
    voiceClones: 20,
    description: 'Profesyonel kullanım için en iyi seçim',
    features: [
      '250,000 karakter/ay (~300 dakika ses/ay)',
      '20 ses klonlama hakkı',
      '20+ dil desteği',
      'Stüdyo kalite (48kHz)',
      'Tüm premium formatlar',
      'Gelişmiş SSML ve duygu kontrolü',
      'Toplu işleme ve API erişimi',
      'Öncelik destek (24 saat içinde yanıt)',
      'Ticari kullanım ve revizyon hakkı',
      'Custom voice training'
    ]
  },
  'kurumsal': {
    id: 'kurumsal',
    name: 'Kurumsal',
    price: 2999,
    yearlyPrice: 23992,
    characters: 2000000,
    voiceClones: 50,
    description: 'Büyük ölçekli işletmeler için tam çözüm',
    features: [
      '2,000,000 karakter/ay (~2400 dakika ses/ay)',
      '50 ses klonlama hakkı',
      'Tüm dünya dillerinde destek',
      'Broadcast kalite (48kHz+)',
      'Özel format desteği',
      'Advanced AI ses klonlama',
      'Unlimited API calls',
      '7/24 premium destek',
      'SLA garantisi (%99.9 uptime)',
      'Özel entegrasyon desteği',
      'Dedicated account manager',
      'Custom AI model training',
      'White-label çözümü'
    ]
  }
};

interface PaymentPageProps {
  params: Promise<{ plan: string }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plan = planData[resolvedParams.plan as keyof typeof planData];
  
  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Paket Bulunamadı</h1>
          <button 
            onClick={() => router.push('/pricing')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Fiyatlandırmaya Dön
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = isYearly ? plan.yearlyPrice : plan.price;
  const akbankNumber = "05413356537";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(akbankNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.amount) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/payment-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          email: formData.email,
          plan: plan.id,
          amount: parseFloat(formData.amount)
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(result.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Payment notification error:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg border border-slate-200 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ödeme Sayfası</h1>
            <p className="text-slate-600">{plan.name} paketi için ödeme işlemleri</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sol Taraf - Paket Bilgileri */}
          <div className="space-y-6">
            
            {/* Paket Detayları */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Seçtiğiniz Paket</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                
                {/* Billing Toggle */}
                <div className="flex items-center gap-4 mb-4">
                  <span className={`text-sm ${!isYearly ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                    Aylık
                  </span>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isYearly ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isYearly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isYearly ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                      Yıllık
                    </span>
                    {isYearly && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        %20 İNDİRİM!
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-3xl font-bold text-slate-900 mb-4">
                  ₺{currentPrice.toLocaleString('tr-TR')} 
                  <span className="text-lg text-slate-500 font-normal">/{isYearly ? 'yıl' : 'ay'}</span>
                </div>
              </div>

              {/* Özellikler */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Paket Özellikleri:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Ödeme Bilgileri */}
          <div className="space-y-6">
            
            {/* Ödeme Talimatları */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">Ödeme Bilgileri</h2>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Ödeme Talimatları</h4>
                      <p className="text-blue-700 text-sm">
                        Aşağıdaki Kolay Adres numarasına ödemenizi yapıp, formu doldurun.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Akbank Kolay Adres:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-lg p-3 font-mono text-lg font-bold text-slate-900">
                        {akbankNumber}
                      </div>
                      <button
                        onClick={handleCopy}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="Kopyala"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-xs mt-1">✓ Kopyalandı!</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ödenecek Tutar:
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-2xl font-bold text-green-700">
                        ₺{currentPrice.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ödeme Bildirimi Formu */}
            {!submitted ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900">Ödeme Bildirimi</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Adınızı ve soyadınızı girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail Adresi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ödediğiniz Tutar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={`₺${currentPrice}`}
                    />
                  </div>

                  <div className="hidden">
                    <input type="hidden" value={plan.name} name="plan" />
                    <input type="hidden" value={currentPrice} name="planPrice" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Ödeme Bildirimi Yap'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Bildirim Gönderildi!</h3>
                  <p className="text-slate-600 mb-4">
                    Ödeme bildiriminiz başarıyla gönderildi. Kısa süre içinde hesabınız aktif edilecek.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Panele Git
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}