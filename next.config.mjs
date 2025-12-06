import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript ve ESLint hatalarını yoksay
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // 1. Worker çökmesini engelleyen ayar (Rust derleyicisini kapatır)
  swcMinify: false,

  // 2. "id undefined" hatasını çözen ayar (ID'yi elle veriyoruz)
  generateBuildId: async () => {
    // Her build için benzersiz bir ID üretir
    return 'build-' + Date.now();
  },
  
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  webpack: (config) => {
    // Symlink sorununu çözer
    config.resolve.symlinks = false;

    // "@" işaretini src klasörüne bağlar (Import hatasını çözer)
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // ÖNBELLEĞİ KAPAT (Cache bozulmasını engeller)
    config.cache = false;

    return config;
  },
};

export default nextConfig;
