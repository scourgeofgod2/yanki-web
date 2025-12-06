import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dosyasında __dirname kullanmak için bu ayar şart
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performans ayarları
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // İŞTE BÜTÜN OLAY BURADA:
  webpack: (config) => {
    // 1. Symlink hatasını çözen ayar (cPanel için)
    config.resolve.symlinks = false;

    // 2. "@" işaretini "src" klasörüne zorla bağlayan ayar
    // Bu sayede "../../" yapmak zorunda kalmazsın!
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    return config;
  },
};

export default nextConfig;
