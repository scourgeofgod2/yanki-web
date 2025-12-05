import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://yankitr.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/products/tts',
          '/products/voice-cloning', 
          '/products/transcribe',
          '/pricing',
          '/blog',
          '/blog/*',
          '/about',
          '/contact',
          '/login',
          '/register'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api',
          '/api/*',
          '/admin',
          '/admin/*',
          '/_next',
          '/_next/*',
          '/private',
          '/private/*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/pricing',
          '/blog',
          '/blog/*',
          '/about',
          '/contact'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api',
          '/api/*'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/pricing',
          '/blog',
          '/blog/*',
          '/about',
          '/contact'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api',
          '/api/*'
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}