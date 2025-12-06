import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript ve ESLint hatalarını yoksay
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // RAM tasarrufu
  productionBrowserSourceMaps: false,
  
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  webpack: (config) => {
    // 1. Symlink sorununu çözer
    config.resolve.symlinks = false;

    // 2. "@" işaretini src klasörüne bağlar (Import hatasını çözer)
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // 3. ÖNBELLEĞİ KAPAT (İşte "id undefined" hatasını çözen satır bu!)
    config.cache = false;

    return config;
  },
};

export default nextConfig;
