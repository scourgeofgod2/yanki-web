# 🚀 Yanki Web - Google Cloud Ubuntu VM Deployment Rehberi

## 📋 İçindekiler
1. [Ön Hazırlık (Local)](#1-ön-hazırlık-local)
2. [Google Cloud VM Kurulum](#2-google-cloud-vm-kurulum)
3. [Server Kurulum](#3-server-kurulum)
4. [Proje Deployment](#4-proje-deployment)
5. [Production Ayarları](#5-production-ayarları)
6. [Domain & SSL](#6-domain--ssl)
7. [Monitoring & Maintenance](#7-monitoring--maintenance)

---

## 1. Ön Hazırlık (Local)

### 1.1 Git Repository Hazırlama
```bash
# Proje klasöründe (.gitignore kontrolü)
echo "node_modules/
.next/
.env*
!.env.example
*.log
.DS_Store
.vscode/
dist/
build/" > .gitignore

# Git init ve push
git init
git add .
git commit -m "Initial commit - Voice cloning features ready"

# GitHub repo oluştur ve push et
git remote add origin https://github.com/KULLANICI_ADINIZ/yanki-web.git
git branch -M main
git push -u origin main
```

### 1.2 Environment Variables Hazırlama
Supabase Dashboard'dan şu bilgileri al:
- Database URL (PostgreSQL connection string)
- Project URL
- Anon Key

`.env.example` dosyası oluştur:
```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://yourdomain.com"

# External APIs
CORTEX_API_KEY="your-api-key"

# Supabase (opsiyonel)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

---

## 2. Google Cloud VM Kurulum

### 2.1 VM Oluşturma
```bash
# Google Cloud Console'da:
# Compute Engine > VM instances > Create Instance

# Recommended specs:
# - Name: yanki-web-vm
# - Region: europe-west3 (Frankfurt) veya us-central1
# - Machine type: e2-medium (2 vCPU, 4GB memory)
# - Boot disk: Ubuntu 22.04 LTS, 20GB Standard persistent disk
# - Firewall: Allow HTTP traffic ✓, Allow HTTPS traffic ✓
```

### 2.2 SSH Key Setup (Opsiyonel ama Güvenli)
```bash
# Local'de SSH key oluştur
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/yanki-web-key

# Public key'i kopyala
cat ~/.ssh/yanki-web-key.pub

# Google Cloud Console > Compute Engine > Metadata > SSH Keys
# Public key'i ekle

# SSH bağlantısı
ssh -i ~/.ssh/yanki-web-key username@EXTERNAL_IP
```

---

## 3. Server Kurulum

### 3.1 System Update
```bash
# VM'ye bağlandıktan sonra
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common
```

### 3.2 Node.js 18+ Kurulum
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js kur
sudo apt-get install -y nodejs

# Versiyon kontrolü
node --version  # v18.x.x olmalı
npm --version   # 9.x.x olmalı
```

### 3.3 PM2 Process Manager
```bash
# PM2'yi global olarak kur
sudo npm install pm2@latest -g

# PM2 versiyon kontrolü
pm2 --version
```

### 3.4 Nginx Web Server
```bash
# Nginx kurulumu
sudo apt install -y nginx

# Nginx başlat ve enable et
sudo systemctl start nginx
sudo systemctl enable nginx

# Status kontrolü
sudo systemctl status nginx

# Test et - browser'da VM'nin IP adresine git
# "Welcome to nginx!" sayfasını görmelisin
```

### 3.5 UFW Firewall (Güvenlik)
```bash
# UFW aktif et
sudo ufw enable

# Gerekli portları aç
sudo ufw allow ssh
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Status kontrolü
sudo ufw status
```

---

## 4. Proje Deployment

### 4.1 Proje Clone
```bash
# Home directory'de
cd ~

# Repository clone et
git clone https://github.com/KULLANICI_ADINIZ/yanki-web.git
cd yanki-web

# Branch kontrolü
git branch
git status
```

### 4.2 Environment Variables
```bash
# .env dosyası oluştur
nano .env

# Aşağıdaki içeriği ekle ve değerleri güncelle:
```
```bash
# Database (Supabase'den al)
DATABASE_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_SECRET="super-secret-jwt-key-minimum-32-characters"
NEXTAUTH_URL="https://yourdomain.com"

# External APIs  
CORTEX_API_KEY="your-minimax-api-key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 4.3 Dependencies ve Build
```bash
# Dependencies kur
npm install

# Prisma generate (Supabase schema için)
npx prisma generate

# Prisma veritabanı sync (gerekirse)
npx prisma db push

# Production build
npm run build

# Build kontrolü
ls -la .next/
```

---

## 5. Production Ayarları

### 5.1 PM2 ile Uygulama Başlatma
```bash
# PM2 ecosystem dosyası oluştur
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'yanki-web',
    script: 'npm',
    args: 'start',
    cwd: '/home/username/yanki-web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# Log klasörü oluştur
mkdir logs

# Uygulamayı başlat
pm2 start ecosystem.config.js

# Status kontrolü
pm2 status
pm2 logs yanki-web

# Auto-start on reboot
pm2 startup
# Çıkan komutu çalıştır (sudo ile başlayan komut)

pm2 save
```

### 5.2 Nginx Reverse Proxy
```bash
# Nginx config dosyası oluştur
sudo nano /etc/nginx/sites-available/yanki-web
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files optimization
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
# Config'i etkinleştir
sudo ln -s /etc/nginx/sites-available/yanki-web /etc/nginx/sites-enabled/

# Default site'ı kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx config test
sudo nginx -t

# Nginx restart
sudo systemctl reload nginx
```

---

## 6. Domain & SSL

### 6.1 Domain DNS Ayarları
```bash
# Domain provider'da (GoDaddy, Namecheap vs.)
# A record ekle:
# Name: @ (root domain)
# Value: VM_EXTERNAL_IP
# TTL: 600

# www subdomain için:
# Name: www
# Value: VM_EXTERNAL_IP
# TTL: 600
```

### 6.2 Let's Encrypt SSL
```bash
# Certbot kurulumu
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Certbot link
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# SSL sertifikası al (domain'i değiştir)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### 6.3 Final Test
```bash
# Uygulama durumu
pm2 status
pm2 logs yanki-web --lines 50

# Nginx status
sudo systemctl status nginx

# Port kontrolü
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000

# Test URLs:
curl -I http://yourdomain.com
curl -I https://yourdomain.com
```

---

## 7. Monitoring & Maintenance

### 7.1 PM2 Monitoring
```bash
# PM2 web dashboard (opsiyonel)
pm2 install pm2-server-monit

# Real-time monitoring
pm2 monit

# Memory/CPU usage
pm2 show yanki-web
```

### 7.2 Log Management
```bash
# PM2 logs
pm2 logs yanki-web
pm2 logs yanki-web --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### 7.3 Backup Script
```bash
# Backup scripti oluştur
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/username/backups"

# Backup directory oluştur
mkdir -p $BACKUP_DIR

# Code backup
cd /home/username
tar -czf $BACKUP_DIR/yanki-web-$BACKUP_DATE.tar.gz yanki-web/

# Environment backup
cp yanki-web/.env $BACKUP_DIR/.env-$BACKUP_DATE

# Eski backup'ları temizle (30 günden eski)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DATE"
```

```bash
# Script'i executable yap
chmod +x ~/backup.sh

# Crontab ekle (günlük 3:00'da)
crontab -e
# Aşağıdaki satırı ekle:
# 0 3 * * * /home/username/backup.sh >> /home/username/backup.log 2>&1
```

### 7.4 Update Procedure
```bash
# Update script oluştur
nano ~/update.sh
```

```bash
#!/bin/bash
cd /home/username/yanki-web

# Backup before update
~/backup.sh

# Git pull
git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart yanki-web

# Check status
pm2 status
```

---

## 🔧 Troubleshooting

### Sık Karşılaşılan Sorunlar:

#### 1. PM2 App Çalışmıyor
```bash
pm2 logs yanki-web
# Error logları kontrol et

# Restart
pm2 restart yanki-web

# Environment variables kontrol
pm2 show yanki-web
```

#### 2. Nginx 502 Bad Gateway
```bash
# PM2 çalışıyor mu?
pm2 status

# Port 3000 açık mı?
sudo netstat -tlnp | grep :3000

# Nginx config test
sudo nginx -t
```

#### 3. Database Connection Error
```bash
# DATABASE_URL doğru mu?
cat .env | grep DATABASE_URL

# Supabase bağlantısı test
npx prisma db pull
```

#### 4. SSL Sertifikası Sorunu
```bash
# Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Manual renewal
sudo certbot renew --force-renewal -d yourdomain.com
```

---

## ✅ Son Kontrol Listesi

- [ ] VM oluşturuldu ve çalışıyor
- [ ] Node.js, PM2, Nginx kurulu
- [ ] Proje clone edildi ve build alındı  
- [ ] Environment variables ayarlandı
- [ ] PM2 ile uygulama çalışıyor
- [ ] Nginx reverse proxy çalışıyor
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası kuruldu
- [ ] Firewall ayarları tamamlandı
- [ ] Backup sistemi kuruldu
- [ ] Monitoring aktif

## 🎉 Tamamlandı!

Artık uygulamanız `https://yourdomain.com` adresinden erişilebilir durumda!

### Yararlı Komutlar:
```bash
# Uygulama yeniden başlat
pm2 restart yanki-web

# Logları izle
pm2 logs yanki-web -f

# Sistem durumu
pm2 monit

# Update deploy
~/update.sh
```

---
**Not:** Bu rehberdeki `username` ve `yourdomain.com` kısımlarını kendi değerleriniz ile değiştirin!
