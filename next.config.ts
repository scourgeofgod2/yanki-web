import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Build configuration
  poweredByHeader: false, // X-Powered-By header'ını kaldır
  
  // Performance optimizations
  experimental: {
    optimizeCss: true, // CSS optimizasyonu
    optimizePackageImports: ['lucide-react', '@prisma/client'], // Paket import optimizasyonu
  },
  
  // Turbopack configuration
  turbopack: {
    root: '../', // Workspace root directory
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'], // Modern image formatları
  },
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.gateai.app; media-src 'self' data: blob: https://replicate.delivery https://*.replicate.delivery;"
          }
        ]
      }
    ];
  },
  
  // API Routes optimization
  async rewrites() {
    return [
      // API route optimizasyonları buraya eklenebilir
    ];
  },
  
  // Environment variables (NODE_ENV otomatik yönetilir)
  // env: {} // Bu kısım kaldırıldı çünkü NODE_ENV burada tanımlanamaz
  
  // Build optimizations
  webpack: (config, { dev, isServer }) => {
    // Production build optimizasyonları
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Bundle size optimizasyonu için gereksiz polyfill'leri kaldır
        'crypto': false,
        'stream': false,
        'fs': false,
      };
    }
    
    return config;
  },
  
  // Output configuration for deployment
  output: 'standalone', // Docker deployment için optimal
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard/index',
        destination: '/dashboard',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
