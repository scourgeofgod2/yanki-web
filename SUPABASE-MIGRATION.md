# Supabase Migration Rehberi - Yeni Paket Yapısı

## Özet
Yanki platformu yeni paket yapısına geçiş için Supabase migration rehberi ve SQL komutları.

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

## Supabase Migration Adımları

### 1. Yeni Sütunlar Ekleme

```sql
-- Users tablosuna yeni sütunlar ekle
ALTER TABLE users 
ADD COLUMN character_limit INTEGER DEFAULT 1000,
ADD COLUMN used_characters INTEGER DEFAULT 0,
ADD COLUMN reset_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN is_yearly BOOLEAN DEFAULT FALSE,
ADD COLUMN voice_cloning_limit INTEGER DEFAULT 0;
```

### 2. Subscriptions Tablosu Oluşturma

```sql
-- Subscriptions tablosu
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'baslangic', 'icerik', 'profesyonel', 'kurumsal')),
  character_limit INTEGER NOT NULL,
  voice_clone_limit INTEGER NOT NULL,
  is_yearly BOOLEAN DEFAULT FALSE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TL',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
```

### 3. Usage Records Tablosu Oluşturma

```sql
-- Usage records tablosu
CREATE TABLE usage_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  service_type TEXT NOT NULL CHECK (service_type IN ('tts', 'voice_cloning', 'transcribe')),
  characters_used INTEGER DEFAULT 0,
  minutes_used DECIMAL(10,2) DEFAULT 0,
  voices_cloned INTEGER DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month, year, service_type)
);

-- Index'ler
CREATE INDEX idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX idx_usage_records_month_year ON usage_records(month, year);
CREATE INDEX idx_usage_records_service_type ON usage_records(service_type);
```

### 4. Payment Records Tablosu Oluşturma

```sql
-- Payment records tablosu
CREATE TABLE payment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('subscription', 'credits', 'transcribe')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TL',
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider TEXT,
  provider_transaction_id TEXT,
  description TEXT,
  metadata JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_payment_records_payment_type ON payment_records(payment_type);
CREATE INDEX idx_payment_records_paid_at ON payment_records(paid_at);
```

### 5. Mevcut Verileri Güncelleme

```sql
-- Free kullanıcıları için default değerleri ayarla
UPDATE users 
SET 
  character_limit = 1000,
  voice_cloning_limit = 0
WHERE plan = 'free' OR plan IS NULL;

-- Premium kullanıcıları başlangıç paketine geçir
UPDATE users 
SET 
  plan = 'baslangic',
  character_limit = 100000,
  voice_cloning_limit = 5
WHERE plan = 'premium' OR plan = 'starter';

-- Plan isimlerini güncelle
UPDATE users 
SET plan = 'baslangic' 
WHERE plan = 'starter';

UPDATE users 
SET plan = 'icerik' 
WHERE plan = 'popular';

UPDATE users 
SET plan = 'profesyonel' 
WHERE plan = 'professional';

UPDATE users 
SET plan = 'kurumsal' 
WHERE plan = 'enterprise';
```

### 6. RLS Policies Oluşturma

```sql
-- Subscriptions için RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Usage records için RLS
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage records" ON usage_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage records" ON usage_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage records" ON usage_records
    FOR UPDATE USING (auth.uid() = user_id);

-- Payment records için RLS
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment records" ON payment_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment records" ON payment_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 7. Database Functions

```sql
-- Monthly usage reset function
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET 
    used_characters = 0,
    reset_date = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
  WHERE reset_date <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Subscription expiry checker
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions 
  SET status = 'expired'
  WHERE end_date <= NOW() AND status = 'active';
  
  -- Update user plan to free for expired subscriptions
  UPDATE users 
  SET 
    plan = 'free',
    character_limit = 1000,
    voice_cloning_limit = 0
  WHERE id IN (
    SELECT user_id 
    FROM subscriptions 
    WHERE status = 'expired' AND cancel_at_period_end = false
  );
END;
$$ LANGUAGE plpgsql;

-- Usage tracking function
CREATE OR REPLACE FUNCTION track_usage(
  p_user_id TEXT,
  p_service_type TEXT,
  p_characters_used INTEGER DEFAULT 0,
  p_minutes_used DECIMAL DEFAULT 0,
  p_voices_cloned INTEGER DEFAULT 0
)
RETURNS void AS $$
DECLARE
  current_month INTEGER := EXTRACT(MONTH FROM NOW());
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  cost_amount DECIMAL := 0;
BEGIN
  -- Calculate cost based on service type
  IF p_service_type = 'tts' THEN
    cost_amount := p_characters_used * 0.0029;
  ELSIF p_service_type = 'transcribe' THEN
    cost_amount := p_minutes_used * 0.65;
  END IF;

  -- Insert or update usage record
  INSERT INTO usage_records (
    user_id, service_type, characters_used, minutes_used, 
    voices_cloned, cost, month, year
  )
  VALUES (
    p_user_id, p_service_type, p_characters_used, p_minutes_used,
    p_voices_cloned, cost_amount, current_month, current_year
  )
  ON CONFLICT (user_id, month, year, service_type)
  DO UPDATE SET
    characters_used = usage_records.characters_used + p_characters_used,
    minutes_used = usage_records.minutes_used + p_minutes_used,
    voices_cloned = usage_records.voices_cloned + p_voices_cloned,
    cost = usage_records.cost + cost_amount,
    updated_at = NOW();
    
  -- Update user's used_characters if TTS
  IF p_service_type = 'tts' THEN
    UPDATE users 
    SET used_characters = used_characters + p_characters_used
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 8. Cron Jobs (Supabase Edge Functions ile)

```sql
-- Monthly cron job için
SELECT cron.schedule(
  'reset-monthly-usage',
  '0 0 1 * *', -- Her ayın 1'inde gece yarısı
  'SELECT reset_monthly_usage();'
);

-- Daily subscription check
SELECT cron.schedule(
  'check-expired-subscriptions',
  '0 6 * * *', -- Her gün sabah 6'da
  'SELECT check_expired_subscriptions();'
);
```

## API Güncellemeleri

### 1. User API Güncelleme

```javascript
// /api/user endpoint'i
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select(`
      *,
      subscriptions!inner (
        plan_type,
        character_limit,
        voice_clone_limit,
        end_date,
        status
      )
    `)
    .eq('id', user.id)
    .single();

  return Response.json({ user: userData });
}
```

### 2. Usage Tracking API

```javascript
// /api/usage/track endpoint'i
export async function POST(request: Request) {
  const { service_type, characters_used, minutes_used, voices_cloned } = await request.json();
  
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Call the database function
  const { error } = await supabase.rpc('track_usage', {
    p_user_id: user.id,
    p_service_type: service_type,
    p_characters_used: characters_used || 0,
    p_minutes_used: minutes_used || 0,
    p_voices_cloned: voices_cloned || 0
  });

  if (error) {
    return Response.json({ error: 'Failed to track usage' }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

## Deployment Checklist

- [ ] Supabase SQL Editor'de migration script'leri çalıştırıldı
- [ ] RLS policies aktif edildi
- [ ] Database functions test edildi
- [ ] Cron jobs kuruldu
- [ ] API endpoint'leri güncellendi
- [ ] Frontend güncellemeleri deploy edildi
- [ ] Usage tracking test edildi
- [ ] Payment integration test edildi

## Test Scenarios

### 1. Yeni Kullanıcı Kaydı
```sql
-- Test query
SELECT plan, character_limit, voice_cloning_limit 
FROM users 
WHERE email = 'test@example.com';
-- Beklenen: plan='free', character_limit=1000, voice_cloning_limit=0
```

### 2. Package Upgrade
```sql
-- Subscription oluşturma
INSERT INTO subscriptions (user_id, plan_type, character_limit, voice_clone_limit, amount, start_date, end_date)
VALUES ('user-uuid', 'baslangic', 100000, 5, 89.0, NOW(), NOW() + INTERVAL '1 month');
```

### 3. Usage Tracking
```sql
-- Usage fonksiyonu test
SELECT track_usage('user-uuid', 'tts', 150, 0, 0);
-- Kullanıcının used_characters'ını kontrol et
```

## Rollback Plan

Eğer migration'da sorun çıkarsa:

```sql
-- Yeni tabloları sil
DROP TABLE IF EXISTS payment_records CASCADE;
DROP TABLE IF EXISTS usage_records CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Users tablosundan yeni sütunları kaldır
ALTER TABLE users 
DROP COLUMN IF EXISTS character_limit,
DROP COLUMN IF EXISTS used_characters,
DROP COLUMN IF EXISTS reset_date,
DROP COLUMN IF EXISTS is_yearly,
DROP COLUMN IF EXISTS voice_cloning_limit;

-- Functions'ları sil
DROP FUNCTION IF EXISTS reset_monthly_usage();
DROP FUNCTION IF EXISTS check_expired_subscriptions();
DROP FUNCTION IF EXISTS track_usage(UUID, TEXT, INTEGER, DECIMAL, INTEGER);

-- Cron jobs'ları sil
SELECT cron.unschedule('reset-monthly-usage');
SELECT cron.unschedule('check-expired-subscriptions');
```

## Monitoring

### Kullanım Metrikleri
```sql
-- Günlük kullanım raporu
SELECT 
  service_type,
  SUM(characters_used) as total_characters,
  SUM(minutes_used) as total_minutes,
  SUM(cost) as total_cost,
  COUNT(DISTINCT user_id) as unique_users
FROM usage_records 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY service_type;
```

### Subscription Metrikleri
```sql
-- Aktif abonelikler
SELECT 
  plan_type,
  COUNT(*) as subscriber_count,
  SUM(amount) as monthly_revenue
FROM subscriptions 
WHERE status = 'active'
GROUP BY plan_type;
```

## İletişim
Migration ile ilgili sorular için: technical@yankitr.com