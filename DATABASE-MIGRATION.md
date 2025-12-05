# Database Migration Rehberi - Yeni Paket Yapısı

## Özet
Yanki platformu yeni paket yapısına geçiş için database migration rehberi ve önerileri.

## Yeni Paket Yapısı

### Paket Detayları
| Paket | Aylık Fiyat | Yıllık Fiyat (15% indirim) | Karakter Limiti | Ses Klonlama | Transkripsiyon |
|-------|-------------|---------------------------|------------------|---------------|----------------|
| Başlangıç | 89₺ | 909₺ (76₺/ay) | 100,000 | 5 ses | 0.65₺/dakika |
| İçerik Üreticisi | 199₺ | 2,029₺ (169₺/ay) | 300,000 | 10 ses | 0.65₺/dakika |
| Profesyonel | 399₺ | 4,070₺ (339₺/ay) | 750,000 | 20 ses | 0.65₺/dakika |
| Kurumsal | 2,999₺ | 30,590₺ (2,549₺/ay) | 3,000,000 | 50 ses | 0.65₺/dakika |

### TTS Pricing
- Character başına: 0.0029₺

## Migration Adımları

### 1. Schema Güncelleme
```bash
npx prisma db push
```

### 2. Mevcut Kullanıcıları Güncelleme
```sql
-- Mevcut free kullanıcıları için character limit güncelle
UPDATE users 
SET character_limit = 1000 
WHERE plan = 'free';

-- Mevcut premium kullanıcıları başlangıç paketine geçir
UPDATE users 
SET 
  plan = 'baslangic',
  character_limit = 100000,
  voice_cloning_limit = 5
WHERE plan = 'premium';
```

### 3. Subscription Records Oluşturma
```sql
-- Aktif premium kullanıcılar için subscription record oluştur
INSERT INTO subscriptions (
  id, user_id, plan_type, character_limit, voice_clone_limit, 
  is_yearly, amount, status, start_date, end_date, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  id,
  'baslangic',
  100000,
  5,
  false,
  89.0,
  'active',
  created_at,
  subscription_expires,
  NOW(),
  NOW()
FROM users 
WHERE plan != 'free' AND subscription_expires > NOW();
```

### 4. Usage Records Başlatma
Mevcut kullanım verilerini korumak için:

```sql
-- Bu ay için usage record oluştur
INSERT INTO usage_records (
  id, user_id, service_type, characters_used, 
  month, year, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  id,
  'tts',
  used_characters,
  EXTRACT(MONTH FROM NOW()),
  EXTRACT(YEAR FROM NOW()),
  NOW(),
  NOW()
FROM users 
WHERE used_characters > 0;
```

## Önemli Notlar

### 1. Mevcut Kullanıcı Deneyimi
- Free plan kullanıcıları etkilenmez (1000 karakter kalır)
- Premium kullanıcıları otomatik olarak Başlangıç paketine geçer
- Mevcut subscription tarihleri korunur

### 2. Billing System
- Yeni subscription sistemi aktif abonelikleri takip eder
- Payment records ile ödeme geçmişi tutulur
- Usage records ile detaylı kullanım analizi yapılabilir

### 3. API Güncellemeleri
Aşağıdaki API endpoint'lerinin güncellenmesi gerekir:

#### `/api/user/subscription`
- Yeni paket yapısına göre subscription durumu
- Character ve voice cloning limitlerini döndür

#### `/api/billing/upgrade`
- Yeni paket seçenekleri
- Yıllık/aylık fiyatlandırma
- Upgrade/downgrade logic

#### `/api/usage/track`
- Monthly usage tracking
- Service type bazlı kullanım (tts, voice_cloning, transcribe)

### 4. Frontend Güncellemeleri
- Dashboard'da yeni limit gösterimi
- Pricing sayfası güncellendi ✅
- Billing section'da paket yönetimi

### 5. Monitoring
Migration sonrası kontrol edilecekler:
- Subscription expiry date'leri doğru mu?
- Character limit'ler doğru atandı mı?
- Usage tracking çalışıyor mu?
- Payment integration test edildi mi?

## Test Scenarios

### 1. Yeni Kullanıcı
```javascript
// Test: Yeni kayıt olan kullanıcı
const newUser = {
  plan: 'free',
  characterLimit: 1000,
  usedCharacters: 0,
  voiceCloningLimit: 0
};
```

### 2. Paket Upgrade
```javascript
// Test: Başlangıç paketine upgrade
const upgradeToBaslangic = {
  plan: 'baslangic',
  characterLimit: 100000,
  voiceCloningLimit: 5,
  amount: isYearly ? 909 : 89
};
```

### 3. Usage Tracking
```javascript
// Test: TTS kullanımı
const ttsUsage = {
  serviceType: 'tts',
  charactersUsed: 150,
  cost: 150 * 0.0029 // 0.435₺
};
```

## Rollback Plan

Eğer migration'da sorun çıkarsa:

1. Schema'yı eski haline döndür
2. User table'ını backup'tan restore et
3. Yeni tabloları drop et

```sql
-- Emergency rollback
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS usage_records CASCADE;
DROP TABLE IF EXISTS payment_records CASCADE;

-- Restore user table structure
ALTER TABLE users DROP COLUMN IF EXISTS character_limit;
ALTER TABLE users DROP COLUMN IF EXISTS used_characters;
ALTER TABLE users DROP COLUMN IF EXISTS reset_date;
ALTER TABLE users DROP COLUMN IF EXISTS is_yearly;
```

## Deployment Checklist

- [ ] Database backup alındı
- [ ] Prisma schema push edildi
- [ ] Migration script'leri çalıştırıldı
- [ ] API endpoint'leri test edildi
- [ ] Frontend güncellemeleri deploy edildi
- [ ] Payment integration test edildi
- [ ] Monitoring dashboard kuruldu
- [ ] Error tracking aktif

## İletişim
Migration ile ilgili sorular için: technical@yankitr.com