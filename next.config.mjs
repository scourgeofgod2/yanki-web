/** @type {import('next').NextConfig} */
const nextConfig = {
  // RAM ve Performans Ayarları
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  productionBrowserSourceMaps: false,
  
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // cPanel Symlink Çözümü (Webpack Modunda Çalışır)
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
