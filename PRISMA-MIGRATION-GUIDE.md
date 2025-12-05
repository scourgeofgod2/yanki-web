# Prisma Migration Rehberi - Supabase

## Schema Hazır! 

Schema.prisma dosyası zaten yeni paket yapısına uygun olarak güncellenmiş durumda. Sadece şu adımları izle:

## Adım 1: Schema'yı Supabase'e Push Et
```bash
npx prisma db push
```

Bu komut:
- Yeni tabloları oluşturacak (subscriptions, usage_records, payment_records)
- Users tablosuna yeni sütunlar ekleyecek (character_limit, used_characters, reset_date, is_yearly, voice_cloning_limit)
- İndexleri ve ilişkileri kuracak

## Adım 2: Prisma Client'ı Yeniden Oluştur
```bash
npx prisma generate
```

## Adım 3: RLS Policies Ekle (Supabase Dashboard'da)
Supabase dashboard'da SQL editor'dan çalıştır:

```sql
-- Subscriptions için RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscriptions" ON subscriptions
FOR ALL USING (auth.uid()::text = user_id);

-- Usage records için RLS  
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own usage records" ON usage_records
FOR ALL USING (auth.uid()::text = user_id);

-- Payment records için RLS
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment records" ON payment_records
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "System can insert payment records" ON payment_records
FOR INSERT WITH CHECK (true);
```

## Adım 4: Mevcut Kullanıcı Verilerini Güncelle (İsteğe Bağlı)
Eğer mevcut kullanıcıların olması gerekiyorsa:

```sql
-- Free plan kullanıcıları için güncellemeler
UPDATE users 
SET 
  character_limit = 1000,
  voice_cloning_limit = 0,
  used_characters = 0,
  reset_date = NOW(),
  is_yearly = false
WHERE plan = 'free' OR plan IS NULL;
```

## Test Et

Artık yeni schema hazır! API endpoint'lerin şu modelleri kullanabilir:

```typescript
// User ile subscription ilişkisi
const userWithSubscription = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    subscriptions: {
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 1
    }
  }
});

// Usage tracking
await prisma.usageRecord.upsert({
  where: {
    userId_month_year_serviceType: {
      userId: user.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      serviceType: 'tts'
    }
  },
  update: {
    charactersUsed: { increment: characters },
    cost: { increment: characters * 0.0029 }
  },
  create: {
    userId: user.id,
    serviceType: 'tts',
    charactersUsed: characters,
    cost: characters * 0.0029,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }
});
```

## Deployment Checklist

- [ ] `npx prisma db push` çalıştırıldı
- [ ] `npx prisma generate` çalıştırıldı  
- [ ] RLS policies eklendi
- [ ] API endpoint'leri test edildi
- [ ] Frontend güncel subscription bilgilerini gösteriyor

Bu kadar! Schema hazır ve push'lanmaya hazır 🚀