/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Performans ve RAM ayarları
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  productionBrowserSourceMaps: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 2. cPanel Symlink Hatasını Çözen Kritik Ayar
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },

  // 3. "Turbopack Conflict" Hatasını Susturan Boş Ayar
  // Bunu ekleyince Next.js, "Tamam Webpack kullanmaya devam et" der.
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;