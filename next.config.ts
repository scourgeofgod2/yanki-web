import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@prisma/client'],
  },
  turbopack: {
    root: '../',
  },
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
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
       pathname: '/**',
      },
    ],    formats: ['image/webp', 'image/avif'],
  },
  compress: true,  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',},
         {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://flagcdn.com https://grainy-gradients.vercel.app; font-src 'self'; connect-src 'self' https://api.gateai.app; media-src 'self' data: blob: https://replicate.delivery https://*.replicate.delivery;",
          },
      ],
      },
    ];
  },
  async rewrites() {
    return [];
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: false,
        stream: false,
        fs: false,      };
    }
    return config;
  },
  output: 'standalone',
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
      },
    ];
  },
};

export default nextConfig;
