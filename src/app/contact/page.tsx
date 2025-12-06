'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, Phone, CheckCircle, Users, Zap, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar'; 
import Footer from '../Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showContact, setShowContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Size Nasıl 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600"> Yardımcı </span>
              Olabiliriz?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sorularınız, önerileriniz veya teknik destek talepleriniz için bizimle iletişime geçin. 
              Uzman ekibimiz size en kısa sürede dönüş yapacaktır.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* İletişim Kartları */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">E-posta</h3>
                    <p className="text-gray-600 text-sm">24 saat içinde yanıt</p>
                  </div>
                </div>
                <a 
                  href="mailto:info@yanki.com.tr" 
                  className="text-indigo-600 font-medium hover:text-indigo-700 transition"
                >
                  info@yanki.com.tr
                </a>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Telefon Desteği</h3>
                    <p className="text-gray-600 text-sm">Hafta içi 09:00-18:00</p>
                  </div>
                </div>
                {!showContact ? (
                  <button
                    onClick={() => setShowContact(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition font-medium"
                  >
                    İletişim Bilgilerini Göster
                  </button>
                ) : (
                  <a 
                    href="tel:+905413356537" 
                    className="text-green-600 font-medium hover:text-green-700 transition text-lg"
                  >
                    +90 541 335 65 37
                  </a>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Adres</h3>
                    <p className="text-gray-600 text-sm">İstanbul Merkez Ofis</p>
                  </div>
                </div>
                <address className="text-gray-700 not-italic">
                  Yıldız Posta Caddesi No 2<br />
                  Gayrettepe/İstanbul<br />
                  Türkiye
                </address>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Çalışma Saatleri</h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pazartesi - Cuma</span>
                    <span className="text-gray-900 font-medium">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cumartesi</span>
                    <span className="text-gray-900 font-medium">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pazar</span>
                    <span className="text-gray-500">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Mesaj Gönderin</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">Mesajınız Gönderildi!</h3>
                    <p className="text-green-700">Size en kısa sürede dönüş yapacağız.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Ad Soyad *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta Adresi *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Konu *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      >
                        <option value="">Konu seçiniz</option>
                        <option value="general">Genel Bilgi</option>
                        <option value="technical">Teknik Destek</option>
                        <option value="sales">Satış Danışmanlığı</option>
                        <option value="billing">Fatura ve Ödeme</option>
                        <option value="partnership">İş Birliği</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                        placeholder="Mesajınızı detaylı olarak açıklayın..."
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Kişisel verileriniz KVKK kapsamında korunmaktadır. Mesajınızı göndererek 
                        <a href="/privacy" className="text-indigo-600 hover:underline ml-1">gizlilik politikamızı</a> 
                        kabul etmiş olursunuz.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Mesaj Gönder
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SSS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-600">En çok merak edilen sorular ve cevapları</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Yankı nasıl çalışıyor?</h3>
                <p className="text-gray-600 text-sm">
                  Yankı, yapay zeka teknolojisi kullanarak metinlerinizi doğal insan sesi ile seslendiriyor. 
                  Sadece metninizi yazmanız yeterli!
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Ses kalitesi nasıl?</h3>
                <p className="text-gray-600 text-sm">
                  Professional grade ses kalitesi sunuyoruz. Tüm seslerimiz 48kHz/24-bit kalitesinde 
                  ve broadcast standartlarında üretiliyor.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Ticari kullanım yapabilir miyim?</h3>
                <p className="text-gray-600 text-sm">
                  Evet! Ürettiğiniz tüm sesli içerikleri ticari amaçlı kullanabilirsiniz. 
                  Telif hakkı endişeniz olmasın.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Hangi dilleri destekliyorsunuz?</h3>
                <p className="text-gray-600 text-sm">
                  Şu anda Türkçe ve İngilizce desteği sunuyoruz. Yakında Arapça, Almanca ve 
                  Fransızca desteği de eklenecek.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Ücretsiz deneme var mı?</h3>
                <p className="text-gray-600 text-sm">
                  Evet! Kayıt olduğunuzda 1000 karakter ücretsiz kredi kazanıyorsunuz. 
                  Hiçbir ödeme bilgisi gerekmez.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Teknik destek nasıl alırım?</h3>
                <p className="text-gray-600 text-sm">
                  7/24 canlı destek sunuyoruz. Dashboard'dan destek talebi oluşturabilir 
                  veya info@yanki.com.tr adresine mail atabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTEK TİPLERİ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Size Nasıl Yardımcı Olabiliriz?</h2>
            <p className="text-gray-600">İhtiyacınıza uygun destek türünü seçin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Satış Danışmanlığı</h3>
              <p className="text-gray-600 mb-4">
                Size en uygun planı seçmeniz için uzman danışmanlarımız rehberlik ediyor
              </p>
              <a href="mailto:sales@yanki.com.tr" className="text-indigo-600 font-medium hover:underline">
                Danışman Talep Et →
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Teknik Destek</h3>
              <p className="text-gray-600 mb-4">
                Teknik sorunlarınız için 7/24 uzman destek ekibimiz hizmetinizde
              </p>
              <a href="mailto:support@yanki.com.tr" className="text-green-600 font-medium hover:underline">
                Destek Talebi Oluştur →
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">İş Birliği</h3>
              <p className="text-gray-600 mb-4">
                Kurumsal çözümler ve özel projeler için iş birliği fırsatları
              </p>
              <a href="mailto:partnership@yanki.com.tr" className="text-purple-600 font-medium hover:underline">
                İş Birliği Teklifi →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hemen Başlamaya Hazır mısınız?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Ücretsiz denemeyle Yankı'nın gücünü keşfedin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Ücretsiz Başla
            </a>
            <a
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Fiyatları İncele
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
