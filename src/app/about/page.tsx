'use client';

import React from 'react';
import { Users, Target, Zap, Shield, Award, TrendingUp, Heart, Globe } from 'lucide-react';
// DÜZELTME 1: Dosya isimleri küçük harfle (sunucudaki dosya adıyla birebir aynı olmalı)
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Ahmet Yılmaz',
      position: 'Kurucu & CEO',
      image: '👨‍💼',
      bio: '15+ yıl teknoloji deneyimi, AI ve ses teknolojileri uzmanı'
    },
    {
      name: 'Elif Kaya',
      position: 'CTO',
      image: '👩‍💻',
      bio: 'Machine Learning PhD, önceden Google ve Microsoft\'ta çalıştı'
    },
    {
      name: 'Mehmet Demir',
      position: 'Ses Teknolojileri Uzmanı',
      image: '🎧',
      bio: 'Audio engineering background, 10+ yıl broadcast deneyimi'
    },
    {
      name: 'Ayşe Şen',
      position: 'Product Manager',
      image: '👩‍🚀',
      bio: 'UX/UI specialist, kullanıcı deneyimi ve ürün geliştirme uzmanı'
    }
  ];

  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'İnovasyon',
      description: 'Sürekli araştırma ve geliştirme ile ses teknologilerinin sınırlarını zorluyoruz',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenilirlik',
      description: 'Verilerinizin güvenliği ve gizliliği bizim için en önemli öncelik',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Kullanıcı Odaklı',
      description: 'Her özelliği kullanıcı ihtiyaçları doğrultusunda tasarlıyor ve geliştiriyoruz',
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Erişilebilirlik',
      description: 'Ses teknolojilerini herkese ulaştırabilir ve kullanılabilir hale getiriyoruz',
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Yankı\'nın Doğuşu',
      description: 'Türkiye\'de AI destekli ses teknolojileri alanında öncü olmak vizyonuyla kurulduk'
    },
    {
      year: '2023',
      title: 'İlk Ürün Lansmanı',
      description: 'Text-to-Speech teknolojimizi piyasaya sunduk ve 1000+ kullanıcıya ulaştık'
    },
    {
      year: '2024',
      title: 'Ses Klonlama',
      description: 'Voice Cloning teknolojisini geliştirdik ve 10,000+ aktif kullanıcıya ulaştık'
    },
    {
      year: '2024',
      title: 'Kurumsal Çözümler',
      description: 'B2B segment için özel çözümler geliştirdik ve büyük şirketlerle iş birliği başlattık'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Aktif Kullanıcı', icon: <Users className="w-6 h-6" /> },
    { number: '2M+', label: 'Üretilen Ses Dosyası', icon: <Zap className="w-6 h-6" /> },
    { number: '150+', label: 'Kurumsal Müşteri', icon: <Award className="w-6 h-6" /> },
    { number: '99.9%', label: 'Uptime Oranı', icon: <TrendingUp className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ses Teknolojilerinin 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600"> Geleceğini </span>
              Şekillendiriyoruz
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Yankı olarak, yapay zeka destekli ses teknolojileri ile içerik üreticilerinin hayallerini 
              gerçekleştirmelerine yardımcı oluyoruz. Türkiye'den dünyaya açılan teknoloji hikayemiz.
            </p>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HİKAYEMİZ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  2022 yılında, ses teknolojilerinin potansiyelini fark eden bir grup girişimci ve teknolog 
                  olarak yola çıktık. Amacımız, yapay zeka destekli ses çözümleri ile içerik üretim süreçlerini 
                  demokratikleştirmekti.
                </p>
                <p>
                  Geleneksel ses prodüksiyon süreçlerinin maliyetli ve zaman alıcı olduğunu gören ekibimiz, 
                  bu sorunu çözmek için gece gündüz çalıştı. Bugün, binlerce içerik üreticisi Yankı ile 
                  hayallerini gerçekleştiriyor.
                </p>
                <p>
                  Türkiye'den başlayan bu yolculuk, artık global bir vizyona dönüşmüş durumda. Ses teknolojilerinde 
                  Türkiye'yi dünya sahnesinde temsil etmenin gururunu yaşıyoruz.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 border border-indigo-200">
              <div className="text-center">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2022'den Bugüne</h3>
                <p className="text-gray-700">
                  50,000+ kullanıcı, 2 milyon+ üretilen ses dosyası ve sürekli büyüyen ekibimizle 
                  ses teknolojilerinin öncüsü olmaya devam ediyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MİSYON & VİZYON */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz & Vizyonumuz</h2>
            <p className="text-gray-600">Neden var olduğumuz ve nereye gittiğimiz</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Misyonumuz</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Yapay zeka destekli ses teknolojileri ile içerik üretim süreçlerini sadeleştirmek, 
                maliyetleri düşürmek ve kaliteyi artırarak herkesin profesyonel sesli içerikler 
                üretebilmesini sağlamak.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Vizyonumuz</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ses teknolojilerinde dünya çapında tanınan, öncü bir Türk teknoloji şirketi olmak 
                ve global ölçekte milyonlarca kullanıcının tercih ettiği platform haline gelmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEĞERLERİMİZ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-gray-600">Bizi yönlendiren temel prensipler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EKİBİMİZ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-gray-600">Yankı'yı bugünlere getiren yetenekli ekibimiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOL HARİTASI */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Yolculuğumuz</h2>
            <p className="text-gray-600">Başlangıçtan bugüne kadar olan önemli kilometre taşlarımız</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-indigo-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="text-indigo-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold relative z-10">
                    {index + 1}
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEKNOLOJÍ & İNOVASYON */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Teknoloji & İnovasyon</h2>
            <p className="text-gray-600">Yankı'nın güçlü teknoloji altyapısı</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI & Machine Learning</h3>
              <p className="text-gray-600">
                En son deep learning algoritmaları ile doğal ve insansı ses üretimi gerçekleştiriyoruz.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Güvenlik & Gizlilik</h3>
              <p className="text-gray-600">
                End-to-end şifreleme ve GDPR uyumlu veri işleme ile verilerinizi koruyoruz.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scalable Infrastructure</h3>
              <p className="text-gray-600">
                Cloud-native mimarisi ile milyonlarca kullanıcıya hizmet verebilecek altyapı.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Yankı Ailesine Katılmaya Hazır mısınız?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Binlerce içerik üreticisinin tercih ettiği platforma siz de katılın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Ücretsiz Başla
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Bizimle İletişime Geç
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
