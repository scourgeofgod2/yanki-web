/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // İŞTE O HATAYI ÇÖZEN SİHİRLİ AYAR BURASI:
  webpack: (config) => {
    // Sembolik linkleri (symlinks) gerçek yollarına çevirme, olduğu gibi kullan
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;