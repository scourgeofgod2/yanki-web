import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Play, Mic, Volume2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
import { generateSEOMetadata, generateBlogPostSchema } from '@/lib/seo-utils';
import { Metadata } from 'next';

const blogPost = {
  id: '1',
  slug: 'youtube-videolari-profesyonel-seslendirme-rehberi',
  title: 'YouTube Videoları için Profesyonel Seslendirme Rehberi',
  description: 'YouTube videolarınızı bir sonraki seviyeye taşımak için ses seçimi, tonlama ve teknik ipuçları. Bu rehberle izleyici bağlılığını artıracak profesyonel seslendirme tekniklerini öğrenin.',
  content: 'YouTube videolarınızı bir sonraki seviyeye taşımak için ses seçimi, tonlama ve teknik ipuçları rehberi.',
  author: 'Ahmet Yılmaz',
  publishDate: '2024-03-15',
  readTime: '8 dakikalık okuma',
  views: '1.250 görüntüleme',
  category: 'YouTube Seslendirme',
  tags: ['YouTube', 'Seslendirme', 'İçerik Üretimi', 'Video Marketing', 'AI Ses'],
  featured: true
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
            <span className="text-2xl">📹</span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {blogPost.category}
            </span>
            {blogPost.featured && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                Öne Çıkan
              </span>
            )}
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
              <Play className="w-4 h-4" />
              <span>{blogPost.views}</span>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-red-50 to-orange-100 rounded-xl flex items-center justify-center mb-12 border border-red-100">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-600 font-medium">{blogPost.title}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            
            {/* İçindekiler */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                İçindekiler
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li><a href="#giris" className="hover:underline">1. YouTube'da Ses'in Önemi</a></li>
                <li><a href="#ses-secimi" className="hover:underline">2. Doğru Ses Karakterini Seçmek</a></li>
                <li><a href="#tonlama" className="hover:underline">3. Tonlama ve Duygu Aktarımı</a></li>
                <li><a href="#teknik" className="hover:underline">4. Teknik Ayarlar ve Kalite</a></li>
                <li><a href="#optimizasyon" className="hover:underline">5. YouTube Optimizasyonu</a></li>
                <li><a href="#sonuc" className="hover:underline">6. Özet ve Tavsiyeler</a></li>
              </ul>
            </div>

            <h2 id="giris" className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mic className="w-6 h-6 text-red-600" />
              YouTube'da Ses'in Önemi
            </h2>
            
            <p className="text-gray-700 mb-6">
              YouTube'da başarılı olmak için görsel kadar ses kalitesi de kritik önemde. İzleyiciler, düşük kaliteli ses nedeniyle videoyu 
              ilk 10 saniye içinde terk edebilir. Profesyonel seslendirme, izleyici bağlılığını %300'e kadar artırabilir.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 mt-1">⚡</div>
                <div>
                  <p className="font-semibold text-yellow-800">İpucu</p>
                  <p className="text-yellow-700">YouTube algoritması, izleyici tutma oranı yüksek olan videolara öncelik verir. Kaliteli seslendirme bu oranı doğrudan etkiler.</p>
                </div>
              </div>
            </div>

            <h2 id="ses-secimi" className="text-2xl font-bold text-gray-900 mb-4">Doğru Ses Karakterini Seçmek</h2>
            <p className="text-gray-700 mb-6">
              İçeriğinizin türüne uygun ses karakteri seçimi, izleyici bağlılığının temelini oluşturur. Eğitim videoları için net ve açıklayıcı, 
              eğlence içerikleri için enerjik ve dinamik sesler tercih edin.
            </p>

            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">
              <li>Eğitim videoları: Sakin ve açıklayıcı tonlar</li>
              <li>Gaming içerikleri: Enerjik ve heyecanlı sesler</li>
              <li>Review videoları: Objektif ve güvenilir tonlama</li>
              <li>Vlog içerikleri: Samimi ve doğal ses karakterleri</li>
            </ul>

            <h2 id="tonlama" className="text-2xl font-bold text-gray-900 mb-4">Tonlama ve Duygu Aktarımı</h2>
            <p className="text-gray-700 mb-6">
              Monotonik seslerden kaçının. Vurgulamalar ve duraksamalarla mesajınızı güçlendirin. 
              Yankı'nın gelişmiş AI teknolojisi ile doğal tonlama efektleri elde edebilirsiniz.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-green-900 mb-3">Tonlama İpuçları</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Önemli noktaları vurgulayın</li>
                <li>• Soru cümlelerinde ses tonunu yükseltin</li>
                <li>• Duraksamaları etkili kullanın</li>
                <li>• İzleyiciyle göz teması kuruyormuş gibi konuşun</li>
              </ul>
            </div>

            <h2 id="teknik" className="text-2xl font-bold text-gray-900 mb-4">Teknik Ayarlar ve Kalite</h2>
            <p className="text-gray-700 mb-6">
              Ses kalitesi teknik detaylarla da desteklenmelidir. Arka plan müziği ile ses seviyesi dengesini koruyun ve 
              açık telaffuz kullanın.
            </p>

            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">
              <li>Arka plan müziği ile ses seviyesi dengesini koruyun</li>
              <li>Açık ve net telaffuz kullanın</li>
              <li>Uzun cümleler yerine kısa ve anlaşılır ifadeler tercih edin</li>
              <li>Ses seviyesini tutarlı tutun</li>
            </ul>

            <h2 id="optimizasyon" className="text-2xl font-bold text-gray-900 mb-4">YouTube Optimizasyonu</h2>
            <p className="text-gray-700 mb-6">
              YouTube'un ses analiz algoritmaları göz önünde bulundurularak seslendirme yapın. 
              Net konuşma ve tutarlı ses seviyesi algoritma tarafından tercih edilir.
            </p>

            <h2 id="sonuc" className="text-2xl font-bold text-gray-900 mb-4">Özet ve Tavsiyeler</h2>
            <p className="text-gray-700 mb-6">
              Yankı'nın AI destekli seslendirme teknolojisiyle bu teknikleri kolayca uygulayabilir, 
              videolarınızın profesyonel kalitesini artırabilirsiniz. 20+ dil desteği ile global kitlenize de ulaşabilirsiniz.
            </p>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">YouTube Videolarınızı Profesyonel Sese Dönüştürün</h3>
              <p className="text-red-100 mb-6">
                Yankı'nın AI destekli seslendirme teknolojisi ile videolarınızı bir üst seviyeye taşıyın
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/studio">
                  <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition">
                    Hemen Deneyin
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition">
                    Fiyatları Görün
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