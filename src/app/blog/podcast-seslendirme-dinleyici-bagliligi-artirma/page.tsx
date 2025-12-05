import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Headphones, Mic } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
import { generateSEOMetadata, generateBlogPostSchema } from '@/lib/seo-utils';
import { Metadata } from 'next';

const blogPost = {
  id: '2',
  slug: 'podcast-seslendirme-dinleyici-bagliligi-artirma',
  title: 'Podcast Seslendirme: Dinleyici Bağlılığını Artırma Yöntemleri',
  description: 'Podcast yayıncılığında ses kalitesi ve seslendirme teknikleri ile dinleyici bağlılığını nasıl artırabilirsiniz? Uzmanlardan öneriler ve pratik ipuçları.',
  content: 'Podcast yayıncılığında ses kalitesi ve seslendirme teknikleri ile dinleyici bağlılığını artırma rehberi.',
  author: 'Elif Kara',
  publishDate: '2024-03-10',
  readTime: '6 dakikalık okuma',
  views: '980 görüntüleme',
  category: 'Podcast',
  tags: ['Podcast', 'Seslendirme', 'Ses Kalitesi', 'Dinleyici Deneyimi'],
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
            <span className="text-2xl">🎙️</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
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
              <Headphones className="w-4 h-4" />
              <span>{blogPost.views}</span>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-100 rounded-xl flex items-center justify-center mb-12 border border-purple-100">
            <div className="text-center">
              <div className="text-6xl mb-4">🎙️</div>
              <p className="text-gray-600 font-medium">{blogPost.title}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mic className="w-6 h-6 text-purple-600" />
              Podcast Dünyasında Ses Kalitesinin Önemi
            </h2>
            
            <p className="text-gray-700 mb-6">
              Podcast yayıncılığında ses kalitesi, dinleyici deneyiminin temel taşlarından biridir. 
              Dinleyiciler ilk 30 saniyede podcast'inizi bırakıp bırakmama kararı verir. Profesyonel ses kalitesi bu kritik süreçte size avantaj sağlar.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-1">📊</div>
                <div>
                  <p className="font-semibold text-blue-800">İstatistik</p>
                  <p className="text-blue-700">Araştırmalara göre, podcast dinleyicilerinin %78'i düşük ses kalitesi nedeniyle yayını terk ediyor.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Etkili Seslendirme Teknikleri</h2>
            <p className="text-gray-700 mb-6">
              Podcast seslendirmede doğal konuşma tonu kullanmak kritik önemde. Dinleyiciyle sanki karşılıklı sohbet ediyormuş gibi bir atmosfer oluşturun.
            </p>

            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">
              <li>Doğal konuşma tonu kullanın - yapay veya robotik seslerden kaçının</li>
              <li>Düzenli soluk alışları planlayın - nefes problemi dinleyiciyi rahatsız eder</li>
              <li>Dinleyiciyle göz teması kuruyormuş gibi konuşun</li>
              <li>Duraklamaları etkili kullanarak önemli noktaları vurgulayın</li>
            </ul>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-green-900 mb-3">Ses Kalitesi İpuçları</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Sessiz bir ortamda kayıt yapın</li>
                <li>• Kaliteli mikrofon kullanın</li>
                <li>• Ses seviyesini tutarlı tutun</li>
                <li>• Arka plan gürültüsünü minimize edin</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dinleyici Bağlılığını Artırma Stratejileri</h2>
            <p className="text-gray-700 mb-6">
              Tutarlı ve kaliteli seslendirme, dinleyicilerinizin size geri dönmesini sağlar. Her bölümde aynı kalitede ses sunmak, marka güvenilirliğinizi artırır.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Tutarlı Ses Karakteri</h3>
            <p className="text-gray-700 mb-6">
              Podcast'inizin kimliğini oluşturan ses karakterini belirleyin ve her bölümde bu karakteri koruyun. 
              Yankı'nın AI teknolojisi ile bu tutarlılığı kolayca sağlayabilirsiniz.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Duygu Aktarımı</h3>
            <p className="text-gray-700 mb-6">
              Konuya uygun duygusal tonlamalar kullanın. Heyecanlı konularda enerjik, düşündürücü konularda sakin bir ton benimseyin.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">3. İnteraktif Yaklaşım</h3>
            <p className="text-gray-700 mb-6">
              Dinleyicilerinize sorular sorun, onları düşünmeye teşvik edin. Bu yaklaşım bağlılığı artırır ve aktif dinleme sağlar.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">💡 Pro İpucu</h3>
              <p className="text-yellow-800">
                Podcast'inizin giriş ve çıkış müzikleriyle ses kalitesi arasında uyum sağlayın. 
                Yankı ile profesyonel intro/outro seslendirmeleri oluşturabilirsiniz.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Teknik Optimizasyon</h2>
            <p className="text-gray-700 mb-6">
              Modern podcast platformları ses kalitesini analiz eder ve kaliteli içeriklere öncelik verir. 
              Bu nedenle teknik detaylara özen göstermek önemlidir.
            </p>

            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">
              <li>Ses seviyesi: -18 dB ile -23 dB arasında tutun</li>
              <li>Frekans: 44.1 kHz örnekleme hızı kullanın</li>
              <li>Format: WAV veya yüksek kalite MP3 (320 kbps) tercih edin</li>
              <li>Normalización: Ses seviyelerini normalize edin</li>
            </ul>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Podcast'inizı Profesyonel Sese Dönüştürün</h3>
              <p className="text-purple-100 mb-6">
                Yankı'nın gelişmiş AI teknolojisi ile podcast'leriniz için tutarlı ve kaliteli seslendirme elde edin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/studio">
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
                    Hemen Deneyin
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
                    Paketleri İnceleyin
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