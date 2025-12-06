import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Performans Ayarları
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  swcMinify: false, // Worker çökmesini engeller
  productionBrowserSourceMaps: false, // RAM tasarrufu

  // 2. KRİTİK: "id undefined" hatasını çözen asıl ayar bu!
  outputFileTracing: false, 

  // 3. Manuel Build ID (Garanti olsun)
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  webpack: (config) => {
    // Symlink sorununu çözer (cPanel Fix)
    config.resolve.symlinks = false;

    // "@" işaretini src klasörüne bağlar (Import Fix)
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // Cache kapat (Bozuk dosya okumasını engeller)
    config.cache = false;

    return config;
  },
};

export default nextConfig;
