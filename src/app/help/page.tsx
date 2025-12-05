'use client';

import { generateMetaTags } from '@/lib/seo';
import Link from 'next/link';
import { useState } from 'react';
import { 
  HelpCircle, Book, Settings, CreditCard, Mic, MessageCircle, 
  Search, ChevronDown, ChevronRight, Phone, Mail, Clock,
  PlayCircle, FileText, Headphones, Zap 
} from 'lucide-react';

const metadata = generateMetaTags({
  title: 'Yardım Merkezi - Yanki AI',
  description: 'Yanki AI yardım merkezi, sık sorulan sorular, kullanım rehberleri ve teknik destek bilgileri. 7/24 müşteri destek hizmeti.',
  keywords: 'yardım merkezi, SSS, teknik destek, kullanım rehberi, müşteri destek, Yanki AI',
  canonicalUrl: 'https://yankitr.com/help'
});

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'Tümü', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'getting-started', name: 'Başlangıç', icon: <Book className="w-5 h-5" /> },
    { id: 'technical', name: 'Teknik', icon: <Settings className="w-5 h-5" /> },
    { id: 'billing', name: 'Ödeme', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'usage', name: 'Kullanım', icon: <Mic className="w-5 h-5" /> },
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'Yanki AI nasıl kullanılır?',
      answer: `Yanki AI kullanmaya başlamak çok kolay:<br/><br/>
        1. <strong>Hesap Oluşturun:</strong> Ana sayfadan "Ücretsiz Başla" butonuna tıklayın<br/>
        2. <strong>E-posta Doğrulama:</strong> Gelen e-postadaki linke tıklayarak hesabınızı aktifleştirin<br/>
        3. <strong>İlk Projenizi Oluşturun:</strong> Dashboard'a girin ve istediğiniz hizmeti seçin<br/>
        4. <strong>500 Ücretsiz Kredi:</strong> Yeni hesaplar 500 karakter ücretsiz kredi ile gelir<br/><br/>
        Herhangi bir sorun yaşarsanız, 7/24 destek ekibimiz size yardımcı olmaya hazır!`
    },
    {
      id: 2,
      category: 'usage',
      question: 'Hangi ses formatlarını destekliyorsunuz?',
      answer: `Yanki AI çok çeşitli ses formatlarını destekler:<br/><br/>
        <strong>Giriş Formatları (Ses Klonlama ve Deşifre):</strong><br/>
        • MP3, WAV, FLAC, AAC<br/>
        • OGG, M4A, WEBM<br/>
        • Maksimum dosya boyutu: 500MB<br/><br/>
        <strong>Çıkış Formatları (Seslendirme):</strong><br/>
        • MP3 (varsayılan - en iyi uyumluluk)<br/>
        • WAV (en iyi kalite)<br/>
        • OGG (küçük dosya boyutu)<br/><br/>
        <strong>Kalite Ayarları:</strong><br/>
        • Standard: 22kHz, 128kbps<br/>
        • HD: 44kHz, 256kbps<br/>
        • Broadcast: 48kHz, 320kbps`
    },
    {
      id: 3,
      category: 'billing',
      question: 'Fiyatlandırma nasıl çalışıyor?',
      answer: `Yanki AI esnek fiyatlandırma seçenekleri sunar:<br/><br/>
        <strong>Paket Sistemi:</strong><br/>
        • <strong>Ücretsiz:</strong> 500 karakter/ay<br/>
        • <strong>Başlangıç:</strong> 89₺/ay - 50,000 karakter<br/>
        • <strong>Popüler:</strong> 199₺/ay - 200,000 karakter<br/>
        • <strong>Kurumsal:</strong> 399₺/ay - 500,000 karakter<br/><br/>
        <strong>Kredi Sistemi:</strong><br/>
        • 1 karakter = 1 kredi<br/>
        • Noktalama işaretleri sayılmaz<br/>
        • Kullanılmayan krediler bir sonraki aya aktarılır<br/>
        • Yıllık ödemede %20 indirim`
    },
    {
      id: 4,
      category: 'technical',
      question: 'Ses kalitesi nasıl artırılır?',
      answer: `Ses kalitesini maksimuma çıkarmak için şu önerileri uygulayın:<br/><br/>
        <strong>Metin Hazırlığı:</strong><br/>
        • Noktalama işaretlerini doğru kullanın<br/>
        • Kısaltmaları açık yazın (Dr. → Doktor)<br/>
        • Sayıları yazıyla belirtin (2024 → iki bin yirmi dört)<br/>
        • Özel isimleri parantez içinde telaffuz ekleyin<br/><br/>
        <strong>Platform Ayarları:</strong><br/>
        • HD veya Broadcast kalite seçin<br/>
        • Konuşma hızını projenize uygun ayarlayın<br/>
        • Duraklamaları uygun şekilde ayarlayın`
    },
    {
      id: 5,
      category: 'usage',
      question: 'Hangi dilleri destekliyorsunuz?',
      answer: `Yanki AI 20+ dilde hizmet sunar:<br/><br/>
        <strong>Ana Diller:</strong><br/>
        • Türkçe (Türkiye) - En gelişmiş destek<br/>
        • İngilizce (ABD, İngiltere, Avustralya)<br/>
        • Almanca, Fransızca, İspanyolca<br/><br/>
        <strong>Desteklenen Diller:</strong><br/>
        • İtalyanca, Portekizce, Hollandaca<br/>
        • Rusça, Lehçe, Çekçe<br/>
        • Japonca, Korece, Çince<br/>
        • Arapça, Hindi, Flemenkçe`
    },
    {
      id: 6,
      category: 'billing',
      question: 'İptal ve iade koşulları nelerdir?',
      answer: `Yanki AI müşteri memnuniyetini ön planda tutar:<br/><br/>
        <strong>Abonelik İptali:</strong><br/>
        • İstediğiniz zaman iptal edebilirsiniz<br/>
        • İptal sonrası mevcut dönem sonuna kadar kullanabilirsiniz<br/>
        • Otomatik yenileme durdurulur<br/><br/>
        <strong>İade Koşulları:</strong><br/>
        • İlk 14 gün içinde tam iade<br/>
        • Kullanılmamış kredi bakiyesi iade edilir<br/>
        • İade işlemi 5-10 iş günü sürer`
    }
  ];

  const quickLinks = [
    {
      title: 'Başlangıç Rehberi',
      description: 'İlk projenizi 5 dakikada oluşturun',
      icon: <PlayCircle className="w-6 h-6" />,
      link: '/blog/youtube-videolari-profesyonel-seslendirme-rehberi',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Fiyatlandırma',
      description: 'Paketleri karşılaştırın ve seçin',
      icon: <CreditCard className="w-6 h-6" />,
      link: '/pricing',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'İletişim',
      description: 'Destek ekibi ile konuşun',
      icon: <Mail className="w-6 h-6" />,
      link: '/contact',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Blog',
      description: 'Rehberler ve ipuçları',
      icon: <FileText className="w-6 h-6" />,
      link: '/blog',
      color: 'bg-red-50 text-red-600'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-16 px-6 font-['Inter']">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Yardım Merkezi
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Size nasıl yardımcı olabiliriz? Sık sorulan sorular, rehberler ve destek seçenekleri.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sorularınızı arayın..."
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Help Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-indigo-200 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${link.color}`}>
                {link.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {link.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {link.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Canlı Destek</h3>
              <p className="text-indigo-100 mb-4">7/24 canlı destek hattımız</p>
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Sohbet Başlat
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">E-posta Destek</h3>
              <p className="text-indigo-100 mb-4">24 saat içinde yanıt</p>
              <Link
                href="/contact"
                className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors inline-block"
              >
                E-posta Gönder
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Telefon Desteği</h3>
              <p className="text-indigo-100 mb-4">Kurumsal müşteriler için</p>
              <a
                href="tel:+905413356537"
                className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors inline-block"
              >
                Ara: 541 335 65 37
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Filter */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kategoriler</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                      activeCategory === category.id
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Sık Sorulan Sorular
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredFAQs.length} soru)
                </span>
              </h2>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Sonuç bulunamadı</h3>
                  <p className="text-gray-500">Farklı anahtar kelimeler deneyin veya kategori değiştirin.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-6 pb-6 border-t border-gray-100">
                          <div
                            className="text-gray-700 leading-relaxed prose prose-sm max-w-none pt-4"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 mt-16 text-center">
          <Headphones className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Aradığınızı bulamadınız mı?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Destek ekibimiz size yardımcı olmaya hazır. 24 saat içinde geri dönüş yapıyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Bize Yazın
            </Link>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors inline-flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Canlı Destek
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}