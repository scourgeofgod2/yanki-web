export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  views: string;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'youtube-videolari-profesyonel-seslendirme-rehberi',
    title: 'YouTube Videoları için Profesyonel Seslendirme Rehberi',
    description: 'YouTube videolarınızı bir sonraki seviyeye taşımak için ses seçimi, tonlama ve teknik ipuçları. Bu rehberle izleyici bağlılığını artıracak profesyonel seslendirme tekniklerini öğrenin.',
    content: 'full-content', // Bu dinamik olarak yüklenecek
    author: 'Ahmet Yılmaz',
    publishDate: '2024-03-15',
    readTime: '8 dakikalık okuma',
    views: '1.250 görüntüleme',
    category: 'YouTube Seslendirme',
    tags: ['YouTube', 'Seslendirme', 'İçerik Üretimi', 'Video Marketing', 'AI Ses'],
    featured: true
  },
  {
    id: '2',
    slug: 'podcast-seslendirme-dinleyici-bagliligi-artirma',
    title: 'Podcast Seslendirme: Dinleyici Bağlılığını Artırma Yöntemleri',
    description: 'Podcast yayıncılığında ses kalitesi ve seslendirme teknikleri ile dinleyici bağlılığını nasıl artırabilirsiniz? Uzmanlardan öneriler ve pratik ipuçları.',
    content: 'full-content',
    author: 'Elif Kara',
    publishDate: '2024-03-10',
    readTime: '6 dakikalık okuma',
    views: '980 görüntüleme',
    category: 'Podcast',
    tags: ['Podcast', 'Seslendirme', 'Ses Kalitesi', 'Dinleyici Deneyimi'],
    featured: false
  },
  {
    id: '3',
    slug: 'ai-ses-teknolojisi-icerik-uretiminde-devrim',
    title: 'AI Ses Teknolojisi ile İçerik Üretiminde Devrim',
    description: 'Yapay zeka destekli ses teknolojileri, içerik üretim süreçlerini nasıl dönüştürüyor? AI seslendirmenin avantajları ve geleceği hakkında kapsamlı analiz.',
    content: 'full-content',
    author: 'Can Özdemir',
    publishDate: '2024-03-08',
    readTime: '10 dakikalık okuma',
    views: '1.890 görüntüleme',
    category: 'Teknoloji',
    tags: ['AI', 'Teknoloji', 'Ses Teknolojisi', 'İçerik Üretimi', 'Yapay Zeka'],
    featured: true
  },
  {
    id: '4',
    slug: 'shorts-kisa-videolar-etkili-seslendirme',
    title: 'Shorts ve Kısa Videolar için Etkili Seslendirme',
    description: 'YouTube Shorts, TikTok ve Instagram Reels için optimize edilmiş seslendirme teknikleri. Kısa içeriklerde maksimum etki nasıl sağlanır?',
    content: 'full-content',
    author: 'Zeynep Aktaş',
    publishDate: '2024-03-05',
    readTime: '4 dakikalık okuma',
    views: '750 görüntüleme',
    category: 'Shorts',
    tags: ['Shorts', 'TikTok', 'Instagram Reels', 'Kısa Video', 'Social Media'],
    featured: false
  }
];

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getRelatedPosts = (currentSlug: string, category: string, limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
};