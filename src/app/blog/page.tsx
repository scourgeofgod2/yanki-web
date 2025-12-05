import React from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, Filter, Clock, Play, BookOpen, Mic, Video } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/app/Footer';
import { blogPosts, getFeaturedPosts } from '@/data/blog-posts';
import { generateSEOMetadata } from '@/lib/seo-utils';
import { Metadata } from 'next';
import BlogContent from './BlogContent';

// Blog kategorileri
export const CATEGORIES = [
  { id: 'all', name: 'Tüm Yazılar', count: blogPosts.length },
  { id: 'YouTube Seslendirme', name: 'YouTube Seslendirme', count: blogPosts.filter(p => p.category === 'YouTube Seslendirme').length, icon: '📹' },
  { id: 'Podcast', name: 'Podcast', count: blogPosts.filter(p => p.category === 'Podcast').length, icon: '🎙️' },
  { id: 'Teknoloji', name: 'Teknoloji', count: blogPosts.filter(p => p.category === 'Teknoloji').length, icon: '🤖' },
  { id: 'Shorts', name: 'Shorts', count: blogPosts.filter(p => p.category === 'Shorts').length, icon: '⚡' }
];

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Blog - Ses Teknolojileri ve Seslendirme Rehberleri',
    description: 'YouTube, Podcast, Audiobook ve daha fazlası için profesyonel seslendirme teknikleri, ipuçları ve en son trendler. Uzmanlardan ses teknolojileri rehberleri.',
    keywords: 'seslendirme blog, youtube seslendirme, podcast rehberi, ses teknolojileri, AI ses, sesli kitap',
    canonicalUrl: '/blog'
  });
}

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();

  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '📝';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Ses Teknolojileri Blog</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Ses Dünyasında
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Uzman Rehberliği
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              YouTube, Podcast, Audiobook ve daha fazlası için profesyonel seslendirme
              teknikleri, ipuçları ve en son trendler.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED POSTS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan Yazılar</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Play className="w-4 h-4" />
              <span>En popüler içerikler</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl opacity-20">{getCategoryIcon(post.category)}</div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        Öne Çıkan
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {post.readTime}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getCategoryIcon(post.category)}</span>
                      <span className="text-sm font-medium text-indigo-600 capitalize">
                        {CATEGORIES.find(cat => cat.id === post.category)?.name}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.publishDate)}</span>
                        </div>
                      </div>
                      <span className="text-xs">{post.views || 'N/A'} görüntüleme</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE CONTENT */}
      <BlogContent />

     
      <Footer />
    </div>
  );
}