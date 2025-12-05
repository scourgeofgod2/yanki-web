import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Zap, Smartphone, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
import { generateSEOMetadata, generateBlogPostSchema } from '@/lib/seo-utils';
import { Metadata } from 'next';

const blogPost = {
  id: '4',
  slug: 'shorts-kisa-videolar-etkili-seslendirme',
  title: 'Shorts ve Kısa Videolar için Etkili Seslendirme',
  description: 'YouTube Shorts, TikTok ve Instagram Reels için optimize edilmiş seslendirme teknikleri. Kısa içeriklerde maksimum etki nasıl sağlanır?',
  content: 'YouTube Shorts, TikTok ve Instagram Reels için optimize edilmiş seslendirme teknikleri rehberi.',
  author: 'Zeynep Aktaş',
  publishDate: '2024-03-05',
  readTime: '4 dakikalık okuma',
  views: '750 görüntüleme',
  category: 'Shorts',
  tags: ['Shorts', 'TikTok', 'Instagram Reels', 'Kısa Video', 'Social Media'],
  featured: false
};

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: blogPost.title,
    description: blogPost.description,
    keywords: blogPost.tags.join(', '),
    canonicalUrl: `/blog/${blogPost.slug}`,
    openGraph: {
      type: 'article',
      title: blogPost.title,
      description: blogPost.description,
      url: `https://yankitr.com/blog/${blogPost.slug}`,
      publishedTime: blogPost.publishDate,
      authors: [blogPost.author],
      tags: blogPost.tags
    }
  });
}

export default function BlogPostPage() {
  const schema = generateBlogPostSchema(blogPost);

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <Navbar />

      <article className="pt-20">
        {/* BREADCRUMB */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-blue-600 hover:text-blue-700">
                  Ana Sayfa
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link href="/blog" className="text-blue-600 hover:text-blue-700">
                  Blog
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium truncate">{blogPost.title}</li>
            </ol>
          </nav>
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-4">
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>
        </div>

        {/* HERO */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⚡</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {blogPost.category}
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {blogPost.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {blogPost.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blogPost.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={blogPost.publishDate}>
                {new Date(blogPost.publishDate).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blogPost.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>{blogPost.views}</span>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-green-50 to-yellow-100 rounded-xl flex items-center justify-center mb-12 border border-green-100">
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <p className="text-gray-600 font-medium">{blogPost.title}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-600" />
              Kısa Videoların Gücü
            </h2>
            
            <p className="text-gray-700 mb-6">
              Kısa video formatları, sosyal medya dünyasının yeni kralı. YouTube Shorts, TikTok ve Instagram Reels 
              gibi platformlarda milyarlarca kişi kısa içerikleri tüketiyor. Bu formatlarda başarılı olmak için 
              hızlı ve etkili seslendirme teknikleri şart.
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-green-600 mt-1">📱</div>
                <div>
                  <p className="font-semibold text-green-800">Mobil Öncelikli</p>
                  <p className="text-green-700">Kısa videolar %95 oranında mobil cihazlarda izleniyor. Ses kalitesi mobil deneyimi doğrudan etkiliyor.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">📺</div>
                <h3 className="font-bold text-gray-900 mb-2">YouTube Shorts</h3>
                <p className="text-sm text-gray-600">60 saniyeye kadar dikey videolar</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">🎵</div>
                <h3 className="font-bold text-gray-900 mb-2">TikTok</h3>
                <p className="text-sm text-gray-600">15-60 saniye arası yaratıcı içerikler</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="font-bold text-gray-900 mb-2">Instagram Reels</h3>
                <p className="text-sm text-gray-600">30-90 saniye arası hikaye anlatımı</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              Dikkat Çekici Başlangıç
            </h2>
            
            <p className="text-gray-700 mb-6">
              Kısa videolarda ilk 3 saniye altın değerinde. Bu süre içinde izleyiciyi yakalayamazsanız, 
              video geçilir. Güçlü ve enerjik bir girişle izleyicinin dikkatini çekmeniz gerekiyor.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-orange-900 mb-3">🚀 İlk 3 Saniye Stratejileri</h3>
              <ul className="space-y-2 text-orange-800">
                <li>• Soruyla başlayın: "Bunu biliyor muydunuz?"</li>
                <li>• İddialı ifadeler: "Bu değişecek hayatınızı!"</li>
                <li>• Sayısal veriler: "5 dakikada öğrenebilirsiniz"</li>
                <li>• Merak uyandırın: "Sonunu tahmin edemezsiniz"</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kısa ve Öz Mesajlar</h2>
            <p className="text-gray-700 mb-6">
              15-60 saniyelik videolarda her kelime değerli. Gereksiz dolgu kelimelerden kaçının, 
              doğrudan mesajınızı verin. Her cümle bir amaca hizmet etmeli.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600 mt-1">❌</div>
                <div>
                  <p className="font-semibold text-red-900">Kötü Örnek:</p>
                  <p className="text-red-800">"Merhaba arkadaşlar, bugün sizlere çok güzel bir konu anlatacağım..."</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-600 mt-1">✅</div>
                <div>
                  <p className="font-semibold text-green-900">İyi Örnek:</p>
                  <p className="text-green-800">"30 saniyede öğreneceğiniz 3 pratik ipucu!"</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-600" />
              Platform Optimizasyonu
            </h2>
            
            <p className="text-gray-700 mb-6">
              Her platform farklı bir kitleye hitap ediyor. Ses tonunuzu ve seslendirme stilinizi 
              platforma göre ayarlamanız gerekiyor.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-black rounded text-white text-center text-sm font-bold">T</div>
                  TikTok için Seslendirme
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Genç ve dinamik tonlar kullanın</li>
                  <li>• Hızlı ritim ve yüksek enerji</li>
                  <li>• Trend olan ifadeleri ekleyin</li>
                  <li>• Eğlenceli ve samimi yaklaşım</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white text-center text-sm font-bold">I</div>
                  Instagram Reels için Seslendirme
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Şık ve modern ifadeler</li>
                  <li>• Estetik değerlere vurgu</li>
                  <li>• Hikaye anlatımı tarzı</li>
                  <li>• Lifestyle odaklı tonlama</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded text-white text-center text-sm font-bold">Y</div>
                  YouTube Shorts için Seslendirme
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Açıklayıcı ve bilgilendirici yaklaşım</li>
                  <li>• Net ve anlaşılır konuşma</li>
                  <li>• Eğitici içerik tonlaması</li>
                  <li>• Call-to-action ifadeleri</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-center">Kısa Video İstatistikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">3 sn</div>
                  <div className="text-blue-100">Kritik Dikkat Süresi</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">%92</div>
                  <div className="text-blue-100">Mobil İzlenme Oranı</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">5x</div>
                  <div className="text-blue-100">Daha Fazla Etkileşim</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Yankı ile Hızlı Üretim</h2>
            <p className="text-gray-700 mb-6">
              Kısa video içerikleri için sürekli yeni seslendirmelere ihtiyaç duyuyorsunuz. 
              Yankı'nın hızlı üretim kabiliyeti ile dakikalar içinde profesyonel sesler elde edebilirsiniz.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">⚡ Hızlı İpuçları</h3>
              <ul className="space-y-2 text-yellow-800">
                <li>• Kısa cümleler kullanın (5-7 kelime)</li>
                <li>• Aktif çatıyı tercih edin</li>
                <li>• Sayıları rakamla ifade edin (3 yerine üç değil)</li>
                <li>• Vurgulanacak kelimeleri belirtin</li>
                <li>• Duraklamaları stratejik kullanın</li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Shorts İçin Profesyonel Ses</h3>
              <p className="text-green-100 mb-6">
                Yankı'nın hızlı üretim kabiliyeti ile kısa videolarınız için anında kaliteli seslendirme elde edin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/studio">
                  <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                    Hızlı Başla
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
                    Paketleri Gör
                  </button>
                </Link>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 mt-12">
              {blogPost.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 mb-12">
              <span className="text-gray-600 font-medium">Bu yazıyı paylaşın:</span>
              <div className="flex items-center gap-3">
                <Link
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title)}&url=${encodeURIComponent(`https://yankitr.com/blog/${blogPost.slug}`)}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  <Share2 className="w-4 h-4" />
                  Twitter'da Paylaş
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}