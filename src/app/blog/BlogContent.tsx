import React from 'react';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { blogPosts } from '@/data/blog-posts';
import { CATEGORIES } from './page';

export default function BlogContent() {
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR - Categories */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-6">Kategoriler</h3>
              
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">İstatistikler</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Toplam yazı</span>
                    <span className="text-sm font-medium text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bu ay</span>
                    <span className="text-sm font-medium text-gray-900">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Toplam okuyucu</span>
                    <span className="text-sm font-medium text-gray-900">12.5K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOG POSTS */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Tüm Blog Yazıları</h2>
              <div className="text-sm text-gray-500">
                {blogPosts.length} yazı bulundu
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <div className="text-4xl opacity-30">{getCategoryIcon(post.category)}</div>
                      {post.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            Öne Çıkan
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {post.readTime}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">{getCategoryIcon(post.category)}</span>
                        <span className="text-sm font-medium text-blue-600 capitalize">
                          {CATEGORIES.find(cat => cat.id === post.category)?.name}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.publishDate)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>{post.views || 'N/A'} görüntüleme</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}