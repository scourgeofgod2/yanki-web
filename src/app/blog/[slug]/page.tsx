import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Play, Mic, Volume2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/data/blog-posts';
import { generateSEOMetadata, generateBlogPostSchema } from '@/lib/seo-utils';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return generateSEOMetadata({
      title: 'Blog Yazısı Bulunamadı',
      description: 'Aradığınız blog yazısı bulunamadı.'
    });
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    keywords: post.tags.join(', '),
    canonicalUrl: `/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://yankitr.com/blog/${post.slug}`,
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags
    }
  });
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category);
  const schema = generateBlogPostSchema(post);

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
              <li className="text-gray-900 font-medium truncate">{post.title}</li>
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
            <span className="text-2xl">
              {post.category === 'YouTube Seslendirme' ? '📹' : 
               post.category === 'Podcast' ? '🎙️' : 
               post.category === 'Teknoloji' ? '🤖' : 
               post.category === 'Shorts' ? '⚡' : '📝'}
            </span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            {post.featured && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                Öne Çıkan
              </span>
            )}
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {post.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-red-50 to-orange-100 rounded-xl flex items-center justify-center mb-12 border border-red-100">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {post.category === 'YouTube Seslendirme' ? '🎬' : 
                 post.category === 'Podcast' ? '🎙️' : 
                 post.category === 'Teknoloji' ? '🤖' : 
                 post.category === 'Shorts' ? '⚡' : '📝'}
              </div>
              <p className="text-gray-600 font-medium">{post.title}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            {/* İçerik burada dinamik olarak render edilecek */}
            {post.slug === 'youtube-videolari-profesyonel-seslendirme-rehberi' && (
              <div className="space-y-6">
                <h2>YouTube Videoları için Profesyonel Seslendirme Rehberi</h2>
                <p>YouTube dünyasında öne çıkmak için profesyonel ses kalitesi kaçınılmazdır. Bu rehberle videolarınızı bir üst seviyeye taşıyacak seslendirme tekniklerini öğreneceksiniz.</p>
                
                <h3>1. Doğru Ses Seçimi</h3>
                <p>İçeriğinize uygun ses karakteri seçimi, izleyici bağlılığının temelini oluşturur. Yankı'nın 20+ dil desteği ile global kitlenize ulaşabilirsiniz.</p>
                
                <h3>2. Tonlama ve Ritim</h3>
                <p>Monotonik seslerden kaçının. Vurgulamalar ve duraksamalarla mesajınızı güçlendirin.</p>
                
                <h3>3. Teknik İpuçları</h3>
                <ul>
                  <li>Arka plan müziği ile ses seviyesi dengesini koruyun</li>
                  <li>Açık ve net telaffuz kullanın</li>
                  <li>Uzun cümleler yerine kısa ve anlaşılır ifadeler tercih edin</li>
                </ul>
                
                <p>Yankı'nın AI destekli seslendirme teknolojisiyle bu teknikleri kolayca uygulayabilir, videolarınızın profesyonel kalitesini artırabilirsiniz.</p>
              </div>
            )}
            
            {post.slug === 'podcast-seslendirme-dinleyici-bagliligi-artirma' && (
              <div className="space-y-6">
                <h2>Podcast Seslendirme: Dinleyici Bağlılığını Artırma Yöntemleri</h2>
                <p>Podcast dünyasında ses kalitesi ve seslendirme teknikleri, dinleyici deneyiminin kalitesini doğrudan etkiler.</p>
                
                <h3>Ses Kalitesinin Önemi</h3>
                <p>Dinleyiciler ilk 30 saniyede podcast'inizi bırakıp bırakmama kararı verir. Profesyonel ses kalitesi bu kritik süreçte size avantaj sağlar.</p>
                
                <h3>Etkili Seslendirme Teknikleri</h3>
                <ul>
                  <li>Doğal konuşma tonu kullanın</li>
                  <li>Düzenli soluk alışları planlayın</li>
                  <li>Dinleyiciyle göz teması kuruyormuş gibi konuşun</li>
                </ul>
                
                <p>Yankı'nın gelişmiş AI teknolojisi ile podcast'leriniz için tutarlı ve kaliteli seslendirme elde edebilirsiniz.</p>
              </div>
            )}
            
            {post.slug === 'ai-ses-teknolojisi-icerik-uretiminde-devrim' && (
              <div className="space-y-6">
                <h2>AI Ses Teknolojisi ile İçerik Üretiminde Devrim</h2>
                <p>Yapay zeka destekli ses teknolojileri, içerik üretim süreçlerini köklü bir şekilde değiştiriyor.</p>
                
                <h3>Geleneksel Yöntemlerden AI'ya</h3>
                <p>Geleneksel seslendirme yöntemleri zaman alıcı ve maliyetli. AI ses teknolojisi bu sorunları çözüyor.</p>
                
                <h3>AI Seslendirmenin Avantajları</h3>
                <ul>
                  <li>7/24 erişilebilirlik</li>
                  <li>Tutarlı ses kalitesi</li>
                  <li>Çoklu dil desteği</li>
                  <li>Hızlı üretim süreci</li>
                  <li>Maliyet etkinliği</li>
                </ul>
                
                <h3>Geleceğe Bakış</h3>
                <p>AI ses teknolojisi sürekli gelişiyor. Yankı olarak bu teknolojinin öncüsü olmaktan gurur duyuyoruz.</p>
              </div>
            )}
            
            {post.slug === 'shorts-kisa-videolar-etkili-seslendirme' && (
              <div className="space-y-6">
                <h2>Shorts ve Kısa Videolar için Etkili Seslendirme</h2>
                <p>Kısa video formatları, hızlı ve etkili seslendirme teknikleri gerektirir.</p>
                
                <h3>Dikkat Çekici Başlangıç</h3>
                <p>İlk 3 saniye kritik! Güçlü ve enerjik bir girişle izleyiciyi yakalayın.</p>
                
                <h3>Kısa ve Öz Mesajlar</h3>
                <p>15-60 saniyelik videolarda her kelime değerli. Gereksiz dolgu kelimelerden kaçının.</p>
                
                <h3>Platform Optimizasyonu</h3>
                <ul>
                  <li>TikTok için genç ve dinamik tonlar</li>
                  <li>Instagram Reels için şık ve modern ifadeler</li>
                  <li>YouTube Shorts için açıklayıcı yaklaşımlar</li>
                </ul>
                
                <p>Yankı'nın hızlı üretim kabiliyeti ile kısa videolarınız için anında kaliteli seslendirme elde edin.</p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 mt-12">
              {post.tags.map((tag) => (
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
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yankitr.com/blog/${post.slug}`)}`}
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

        {/* RELATED POSTS */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">İlgili Yazılar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="text-2xl mb-3">
                        {relatedPost.category === 'Podcast' ? '🎙️' : 
                         relatedPost.category === 'Shorts' ? '⚡' : 
                         relatedPost.category === 'Teknoloji' ? '🤖' : '📝'}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{relatedPost.category}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}

// Content Components for different blog posts
function YouTubeContent() {
  return (
    <>
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-8 text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">YouTube Videolarınızı Profesyonel Sese Dönüştürün</h3>
        <p className="text-red-100 mb-6">
          Yankı'nın AI destekli seslendirme teknolojisi ile videolarınızı bir üst seviyeye taşıyın
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products/tts">
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
    </>
  );
}

function PodcastContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Podcast Dünyasında Ses Kalitesinin Önemi</h2>
      <p className="text-gray-700">
        Podcast yayıncılığında ses kalitesi, dinleyici deneyiminin temel taşlarından biridir. 
        Kaliteli seslendirme teknikleri ile dinleyici bağlılığınızı artırabilir ve daha geniş 
        kitlelere ulaşabilirsiniz.
      </p>
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Podcast'inizı Profesyonel Sese Dönüştürün</h3>
        <Link href="/products/tts">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Şimdi Deneyin
          </button>
        </Link>
      </div>
    </div>
  );
}

function AITechContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">AI Ses Teknolojisinin Geleceği</h2>
      <p className="text-gray-700">
        Yapay zeka destekli ses teknolojileri, içerik üretim süreçlerini kökten değiştiriyor. 
        Bu devrimsel teknoloji ile zamandan tasarruf edin ve profesyonel kalitede sesler üretin.
      </p>
      
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">AI Ses Teknolojisini Keşfedin</h3>
        <Link href="/products/tts">
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
            Teknolojimizi Deneyin
          </button>
        </Link>
      </div>
    </div>
  );
}

function ShortsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Kısa Videolar için Etkili Seslendirme</h2>
      <p className="text-gray-700">
        YouTube Shorts, TikTok ve Instagram Reels için optimize edilmiş seslendirme teknikleri. 
        Kısa sürede maksimum etki yaratmak için ses kalitesi kritik öneme sahiptir.
      </p>
      
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Shorts İçin Profesyonel Ses</h3>
        <Link href="/products/tts">
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
            Hızlı Başla
          </button>
        </Link>
      </div>
    </div>
  );
}