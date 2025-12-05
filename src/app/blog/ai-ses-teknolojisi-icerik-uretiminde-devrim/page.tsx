import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Brain, Cpu, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
import { generateSEOMetadata, generateBlogPostSchema } from '@/lib/seo-utils';
import { Metadata } from 'next';

const blogPost = {
  id: '3',
  slug: 'ai-ses-teknolojisi-icerik-uretiminde-devrim',
  title: 'AI Ses Teknolojisi ile İçerik Üretiminde Devrim',
  description: 'Yapay zeka destekli ses teknolojileri, içerik üretim süreçlerini nasıl dönüştürüyor? AI seslendirmenin avantajları ve geleceği hakkında kapsamlı analiz.',
  content: 'Yapay zeka destekli ses teknolojileri ile içerik üretiminde devrim rehberi.',
  author: 'Can Özdemir',
  publishDate: '2024-03-08',
  readTime: '10 dakikalık okuma',
  views: '1.890 görüntüleme',
  category: 'Teknoloji',
  tags: ['AI', 'Teknoloji', 'Ses Teknolojisi', 'İçerik Üretimi', 'Yapay Zeka'],
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
            <span className="text-2xl">🤖</span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
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
              <Brain className="w-4 h-4" />
              <span>{blogPost.views}</span>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl flex items-center justify-center mb-12 border border-indigo-100">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-gray-600 font-medium">{blogPost.title}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              Geleneksel Yöntemlerden AI'ya Geçiş
            </h2>
            
            <p className="text-gray-700 mb-6">
              Yapay zeka destekli ses teknolojileri, içerik üretim süreçlerini köklü bir şekilde değiştiriyor. 
              Geleneksel seslendirme yöntemleri zaman alıcı ve maliyetli iken, AI ses teknolojisi bu sorunların çoğunu çözüyor.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-indigo-600 mt-1">🚀</div>
                <div>
                  <p className="font-semibold text-indigo-800">Devrim Niteliğinde</p>
                  <p className="text-indigo-700">AI ses teknolojisi, içerik üretim sürecini saatlerden dakikalara indirgiyor.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Geleneksel Yöntem
                </h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Ses sanatçısı bulma süreci</li>
                  <li>• Stüdyo rezervasyonu</li>
                  <li>• Çekim ve düzenleme</li>
                  <li>• Yüksek maliyet</li>
                  <li>• Uzun süreç (günler/haftalar)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Teknolojisi
                </h3>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• Anında erişim</li>
                  <li>• Bulut tabanlı sistem</li>
                  <li>• Otomatik üretim</li>
                  <li>• Düşük maliyet</li>
                  <li>• Hızlı süreç (dakikalar)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-600" />
              AI Seslendirmenin Avantajları
            </h2>
            
            <p className="text-gray-700 mb-6">
              AI ses teknolojisi, geleneksel yöntemlere kıyasla birçok avantaj sunuyor. 
              Bu avantajlar içerik üreticilere büyük fırsatlar yaratıyor.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. 7/24 Erişilebilirlik</h3>
                <p className="text-gray-700">
                  Gece yarısı bile içerik üretebilirsiniz. AI asla yorulmaz, hastalık izni almaz 
                  veya tatile çıkmaz. Her zaman hizmetinizde.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Tutarlı Ses Kalitesi</h3>
                <p className="text-gray-700">
                  İnsan seslendirmende günlük form farklılıkları olabilir. AI her zaman aynı kalitede, 
                  tutarlı ses üretir.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Çoklu Dil Desteği</h3>
                <p className="text-gray-700">
                  Yankı'nın 20+ dil desteği ile global içerikler oluşturabilirsiniz. 
                  Her dil için ayrı ses sanatçısı bulmaya gerek yok.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Hızlı Üretim Süreci</h3>
                <p className="text-gray-700">
                  Dakikalar içinde profesyonel kalitede seslendirme elde edin. 
                  Son dakika değişiklikleri bile sorun değil.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Maliyet Etkinliği</h3>
                <p className="text-gray-700">
                  Geleneksel seslendirme maliyetlerinin sadece küçük bir kısmını ödeyin. 
                  Yüzlerce içerik üretseniz bile bütçe dostu.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-center">AI Ses Teknolojisi Karşılaştırması</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">%95</div>
                  <div className="text-blue-100">Maliyet Tasarrufu</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">20+</div>
                  <div className="text-blue-100">Dil Desteği</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">5 dk</div>
                  <div className="text-blue-100">Ortalama Üretim Süresi</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geleceğe Bakış</h2>
            <p className="text-gray-700 mb-6">
              AI ses teknolojisi sürekli gelişiyor ve iyileşiyor. Gelecekte daha da doğal sesler, 
              daha fazla duygu aktarımı ve daha geniş kullanım alanları göreceğiz.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">🔮 Gelecek Trendleri</h3>
              <ul className="space-y-2 text-yellow-800">
                <li>• Daha doğal ve insan benzeri sesler</li>
                <li>• Gerçek zamanlı ses klonlama</li>
                <li>• Duygu analizi ve otomatik tonlama</li>
                <li>• Çoklu karakter seslendirme</li>
                <li>• Sesli asistan entegrasyonları</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Yankı ile AI Ses Deneyimi</h2>
            <p className="text-gray-700 mb-6">
              Yankı olarak, AI ses teknolojisinin öncülüğünü yapıyoruz. 
              Sürekli geliştirdiğimiz algoritmalarımız ile en doğal ve kaliteli sesleri üretiyoruz.
            </p>

            <ul className="list-disc ml-6 mb-8 space-y-2 text-gray-700">
              <li>Gelişmiş neural network mimarisi</li>
              <li>Sürekli öğrenen AI modelleri</li>
              <li>Türkçe'ye özel optimizasyon</li>
              <li>Kullanıcı geri bildirimli iyileştirmeler</li>
            </ul>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">AI Ses Teknolojisini Şimdi Keşfedin</h3>
              <p className="text-indigo-100 mb-6">
                Geleceğin ses teknolojisini bugünden deneyimleyin ve içeriklerinizi bir üst seviyeye taşıyın
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/studio">
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                    Ücretsiz Deneyin
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                    Fiyatları İnceleyin
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