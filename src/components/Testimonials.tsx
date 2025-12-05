'use client';

import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Ahmet Kaya",
      role: "Content Creator",
      company: "Digital Agency",
      rating: 5,
      comment: "Yankı ile podcast'lerimi profesyonel kalitede seslendiriyorum. Ses klonlama özelliği gerçekten büyüleyici!",
      avatar: "AK",
      avatarColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "Zeynep Arslan",
      role: "Marketing Director",
      company: "TechStart",
      rating: 5,
      comment: "Reklam filmlerimiz için mükemmel çözüm. Hem hızlı hem de çok kaliteli sonuçlar alıyoruz.",
      avatar: "ZA",
      avatarColor: "bg-purple-500"
    },
    {
      id: 3,
      name: "Murat Demir",
      role: "YouTuber",
      company: "1M Subscriber",
      rating: 5,
      comment: "Video içeriklerim için vazgeçilmez hale geldi. API entegrasyonu sayesinde workflow'um çok hızlandı.",
      avatar: "MD",
      avatarColor: "bg-green-500"
    },
    {
      id: 4,
      name: "Elif Özkan",
      role: "E-learning Specialist",
      company: "EduTech",
      rating: 5,
      comment: "Online kurslarımızı 20+ dilde sunabiliyoruz. Öğrencilerimizden harika geri dönüşler alıyoruz.",
      avatar: "EÖ",
      avatarColor: "bg-pink-500"
    },
    {
      id: 5,
      name: "Can Yılmaz",
      role: "Audio Producer",
      company: "Studio Pro",
      rating: 5,
      comment: "Stüdyo kalitesinde ses üretimi için ideal platform. Türkçe ses karakterleri gerçekten başarılı.",
      avatar: "CY",
      avatarColor: "bg-orange-500"
    },
    {
      id: 6,
      name: "Selin Aktaş",
      role: "Brand Manager",
      company: "Fashion Co.",
      rating: 5,
      comment: "Marka kimliğimize uygun sesler oluşturabiliyoruz. Müşteri deneyimi çok gelişti.",
      avatar: "SA",
      avatarColor: "bg-teal-500"
    }
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star size={16} className="fill-current" />
            Highly Rated and Recommended
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Kullanıcılarımız Ne Diyor?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Binlerce kullanıcı Yankı ile içeriklerini dönüştürüyor ve başarılarını paylaşıyor.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
              
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                "{testimonial.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                  <div className="text-slate-500 text-xs">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-slate-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">10K+</div>
            <div className="text-slate-600 text-sm">Aktif Kullanıcı</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">500K+</div>
            <div className="text-slate-600 text-sm">Oluşturulan Ses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">4.9★</div>
            <div className="text-slate-600 text-sm">Kullanıcı Puanı</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">20+</div>
            <div className="text-slate-600 text-sm">Dil Desteği</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;