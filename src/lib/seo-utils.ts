import { Metadata } from 'next';
import { BlogPost } from '@/data/blog-posts';

interface SEOMetadataOptions {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  openGraph?: {
    type?: 'website' | 'article';
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    publishedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
  };
}

export function generateSEOMetadata(options: SEOMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph,
    twitter
  } = options;

  const fullTitle = `${title} | Yankı - AI Seslendirme Platformu`;
  const baseUrl = 'https://yankitr.com';

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: 'Yankı Team' }],
    creator: 'Yankı',
    publisher: 'Yankı',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl ? `${baseUrl}${canonicalUrl}` : undefined,
    },
    openGraph: {
      type: openGraph?.type || 'website',
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      url: openGraph?.url || `${baseUrl}${canonicalUrl || ''}`,
      siteName: 'Yankı - AI Seslendirme Platformu',
      locale: 'tr_TR',
      ...(openGraph?.publishedTime && { publishedTime: openGraph.publishedTime }),
      ...(openGraph?.authors && { authors: openGraph.authors }),
      ...(openGraph?.tags && { tags: openGraph.tags }),
    },
    twitter: {
      card: twitter?.card || 'summary_large_image',
      title: twitter?.title || fullTitle,
      description: twitter?.description || description,
      creator: '@yankitr',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Yankı',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yankitr.com/logo.png',
      },
    },
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yankitr.com/blog/${post.slug}`,
    },
    url: `https://yankitr.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'tr-TR',
    isPartOf: {
      '@type': 'Blog',
      name: 'Yankı Blog',
      url: 'https://yankitr.com/blog',
    },
    about: {
      '@type': 'Thing',
      name: 'Seslendirme ve AI Teknolojileri',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Yankı',
    alternateName: 'Yankı AI',
    url: 'https://yankitr.com',
    logo: 'https://yankitr.com/logo.png',
    description: 'Türkiye\'nin en gelişmiş AI destekli seslendirme platformu. 20+ dilde profesyonel kalitede ses üretimi.',
    sameAs: [
      'https://twitter.com/yankitr',
      'https://linkedin.com/company/yankitr',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-xxx-xxx-xxxx',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'İstanbul',
    },
    foundingDate: '2024',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '10-50',
    },
    knowsAbout: [
      'Artificial Intelligence',
      'Voice Synthesis',
      'Text-to-Speech',
      'Machine Learning',
      'Natural Language Processing'
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Yankı - AI Seslendirme Platformu',
    url: 'https://yankitr.com',
    description: 'Türkiye\'nin en gelişmiş AI destekli seslendirme platformu. 20+ dilde profesyonel kalitede ses üretimi.',
    inLanguage: 'tr-TR',
    publisher: {
      '@type': 'Organization',
      name: 'Yankı',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://yankitr.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://yankitr.com${item.item}`,
    })),
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: string;
  currency: string;
  availability: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Yankı',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Yankı',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
  };
}