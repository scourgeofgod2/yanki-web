export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export const siteConfig = {
  name: "Yankı",
  description: "Yapay zeka destekli ses teknolojileri ile profesyonel seslendirme, ses klonlama ve deşifre hizmetleri",
  url: "https://yankitr.com",
  logo: "https://yankitr.com/logo.png",
  author: "Yankı Teknoloji A.Ş.",
  social: {
    twitter: "@YankiAI",
    linkedin: "yanki-teknoloji"
  },
  contact: {
    email: "info@yanki.com.tr",
    phone: "+905413356537",
    address: {
      street: "Yıldız Posta Caddesi No 2",
      city: "Gayrettepe",
      region: "İstanbul",
      country: "TR",
      postalCode: "34349"
    }
  }
};

// Türkçe Anahtar Kelime Stratejisi
export const keywordStrategy = {
  primary: [
    "yapay zeka seslendirme",
    "ai seslendirme",
    "ses klonlama", 
    "otomatik seslendirme",
    "metinden sese",
    "speech to text türkçe",
    "deşifre hizmeti",
    "ses tanıma teknolojileri"
  ],
  secondary: [
    "text to speech türkçe",
    "voice cloning",
    "konuşma tanıma",
    "ses sentezi",
    "yapay zeka ses",
    "ai voice generator",
    "türkçe seslendirme",
    "online seslendirme"
  ],
  longTail: [
    "youtube videoları için seslendirme nasıl yapılır",
    "podcast seslendirme teknikleri",
    "ai ile ses klonlama güvenli mi",
    "ücretsiz online seslendirme araçları",
    "türkçe konuşma tanıma sistemi",
    "audiobook yapımı için ses teknolojileri",
    "profesyonel seslendirme fiyatları",
    "yapay zeka ses klonlama yasal mı"
  ],
  lsi: [
    "neural networks",
    "deep learning",
    "natural language processing",
    "machine learning",
    "konuşma işleme",
    "ses dönüştürme",
    "dijital ses teknolojileri",
    "yapay sinir ağları"
  ]
};

// Sayfa Bazlı SEO Konfigürasyonları
export const pageSEOConfigs: Record<string, SEOConfig> = {
  home: {
    title: "Yapay Zeka Seslendirme - AI Ses Teknolojileri | Yankı",
    description: "Türkiye'nin en gelişmiş AI seslendirme platformu. 20+ dil desteği ile metinlerinizi profesyonel seslendirmeye çevirin. Ücretsiz deneyin!",
    keywords: keywordStrategy.primary.join(", ") + ", " + keywordStrategy.secondary.slice(0, 4).join(", "),
    ogTitle: "Yankı - AI Destekli Ses Teknolojileri",
    ogDescription: "Yapay zeka ile saniyeler içinde profesyonel seslendirme yapın. 20+ dil desteği, broadcast kalitesi.",
    ogImage: "https://yankitr.com/og-home.jpg",
    canonicalUrl: "https://yankitr.com"
  },
  
  products: {
    title: "AI Ses Teknolojileri - Seslendirme, Ses Klonlama, Deşifre | Yankı",
    description: "Yapay zeka destekli ses teknolojileri ile seslendirme, ses klonlama ve deşifre hizmetleri. 20+ dil desteği, profesyonel kalite, uygun fiyat.",
    keywords: "yapay zeka seslendirme, ai seslendirme, ses klonlama, deşifre, metinden sese, speech to text, türkçe seslendirme",
    canonicalUrl: "https://yankitr.com/products"
  },

  tts: {
    title: "AI Seslendirme - Metni Ses Dosyasına Çevir | Text to Speech Türkçe",
    description: "20+ dil desteği ile metinlerinizi saniyeler içinde profesyonel seslendirmeye çevirin. YouTube, podcast, audiobook için ideal. Ücretsiz deneyin!",
    keywords: "ai seslendirme, metinden sese, text to speech türkçe, yapay zeka seslendirme, otomatik seslendirme, ses sentezi",
    canonicalUrl: "https://yankitr.com/products/tts"
  },

  voiceCloning: {
    title: "AI Ses Klonlama - Kendi Sesinizi Klonlayın | Voice Cloning Türkçe",
    description: "Sadece 10 dakikalık ses örneği ile kendi sesinizi klonlayın. %98 benzerlik oranı, güvenli teknoloji. Sınırsız içerik üretin!",
    keywords: "ses klonlama, voice cloning, ai ses klonlama, yapay ses, ses taklidi, kişisel ses asistanı",
    canonicalUrl: "https://yankitr.com/products/voice-cloning"
  },

  transcribe: {
    title: "AI Deşifre - Konuşmayı Metne Çevir | Speech to Text Türkçe",
    description: "Ses dosyalarınızı ve canlı konuşmaları %95 doğrulukla metne çevirin. Türkçe ve İngilizce desteği, hızlı işleme. Toplantı, röportaj deşifresi.",
    keywords: "deşifre, speech to text türkçe, konuşma tanıma, ses tanıma, transkripsiyon, otomatik deşifre",
    canonicalUrl: "https://yankitr.com/products/transcribe"
  },

  pricing: {
    title: "Fiyatlar - AI Seslendirme ve Ses Klonlama Paketleri | Yankı",
    description: "Uygun fiyatlı AI ses teknolojileri paketleri. Aylık 89₺'den başlayan planlar, ücretsiz deneme. Kredi ve abonelik seçenekleri.",
    keywords: "ai seslendirme fiyat, ses klonlama fiyat, seslendirme paketleri, yapay zeka ses fiyatları",
    canonicalUrl: "https://yankitr.com/pricing"
  },

  blog: {
    title: "Blog - Seslendirme ve AI Ses Teknolojileri Rehberi | Yankı",
    description: "AI seslendirme, ses klonlama ve ses teknolojileri hakkında güncel rehberler, ipuçları ve uzman tavsiyeleri. YouTube, podcast, audiobook rehberleri.",
    keywords: "seslendirme rehberi, ai ses teknolojileri, youtube seslendirme, podcast üretimi, audiobook yapımı",
    canonicalUrl: "https://yankitr.com/blog"
  },

  contact: {
    title: "İletişim - Yankı AI Ses Teknolojileri Destek ve Satış",
    description: "Yankı AI ses teknolojileri için destek, satış danışmanlığı ve teknik yardım. İstanbul merkezli 7/24 müşteri hizmetleri.",
    keywords: "yankı iletişim, ai seslendirme destek, ses teknolojileri satış, müşteri hizmetleri",
    canonicalUrl: "https://yankitr.com/contact"
  },

  about: {
    title: "Hakkımızda - Yankı AI Ses Teknolojileri Şirketi",
    description: "Türkiye'nin önde gelen AI ses teknolojileri şirketi Yankı hakkında bilgi. Ekibimiz, vizyonumuz, misyonumuz ve başarı hikayemiz.",
    keywords: "yankı hakkında, ai ses teknolojileri şirketi, yapay zeka şirketi türkiye, ses teknolojileri geliştirici",
    canonicalUrl: "https://yankitr.com/about"
  }
};

// Schema Markup Templates
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "url": siteConfig.url,
  "logo": siteConfig.logo,
  "description": siteConfig.description,
  "foundingDate": "2022",
  "founders": [
    {
      "@type": "Person",
      "name": "Ahmet Yılmaz"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contact.address.street,
    "addressLocality": siteConfig.contact.address.city,
    "addressRegion": siteConfig.contact.address.region,
    "addressCountry": siteConfig.contact.address.country,
    "postalCode": siteConfig.contact.address.postalCode
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": siteConfig.contact.phone,
      "contactType": "customer service",
      "availableLanguage": ["Turkish", "English"]
    },
    {
      "@type": "ContactPoint", 
      "email": siteConfig.contact.email,
      "contactType": "customer service"
    }
  ],
  "sameAs": [
    `https://twitter.com/${siteConfig.social.twitter}`,
    `https://linkedin.com/company/${siteConfig.social.linkedin}`
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Turkey"
  },
  "serviceType": [
    "AI Voice Synthesis",
    "Voice Cloning", 
    "Speech Recognition",
    "Text-to-Speech"
  ]
});

export const createServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
  price?: string;
  category: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "url": service.url,
  "provider": {
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url
  },
  "serviceType": service.category,
  "areaServed": {
    "@type": "Country", 
    "name": "Turkey"
  },
  "hasOfferCatalog": service.price ? {
    "@type": "OfferCatalog",
    "name": service.name + " Pricing",
    "itemListElement": [{
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name
      },
      "price": service.price,
      "priceCurrency": "TRY"
    }]
  } : undefined
});

export const createBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const createFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  url: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": siteConfig.name,
    "logo": {
      "@type": "ImageObject",
      "url": siteConfig.logo
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified,
  "url": article.url,
  "image": article.image || siteConfig.logo,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

// SEO Meta Tags Generator
export const generateMetaTags = (config: SEOConfig) => {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.ogTitle || config.title,
      description: config.ogDescription || config.description,
      url: config.canonicalUrl,
      siteName: siteConfig.name,
      images: config.ogImage ? [{ url: config.ogImage }] : [],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.ogTitle || config.title,
      description: config.ogDescription || config.description,
      images: config.ogImage ? [config.ogImage] : [],
      creator: siteConfig.social.twitter,
    },
    canonical: config.canonicalUrl,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

// Internal Linking Strategies
export const internalLinkingStrategy = {
  // Hub pages (high authority pages that link to many others)
  hubs: [
    '/products',
    '/blog', 
    '/',
    '/pricing'
  ],
  
  // Related page clusters for internal linking
  clusters: {
    products: [
      '/products',
      '/products/tts',
      '/products/voice-cloning', 
      '/products/transcribe',
      '/pricing'
    ],
    content: [
      '/blog',
      '/blog/1', // YouTube rehberi
      '/blog/2', // Podcast rehberi
      '/blog/3', // Audiobook rehberi
      '/blog/4'  // Shorts rehberi
    ],
    company: [
      '/about',
      '/contact',
      '/'
    ]
  }
};

// Title Tag Best Practices (50-60 karakter)
export const optimizeTitle = (title: string): string => {
  if (title.length > 60) {
    console.warn(`Title too long: ${title.length} characters. Should be 50-60.`);
  }
  return title;
};

// Meta Description Best Practices (150-160 karakter) 
export const optimizeDescription = (description: string): string => {
  if (description.length > 160) {
    console.warn(`Description too long: ${description.length} characters. Should be 150-160.`);
  }
  return description;
};