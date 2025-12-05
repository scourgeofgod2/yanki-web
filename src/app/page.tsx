import type { Metadata } from "next";
import Hero from './Hero';
import UseCases from './UseCases';
import Features from './Features';
import Footer from './Footer';
import Testimonials from '@/components/Testimonials';
import { pageSEOConfigs, createServiceSchema, createFAQSchema } from '@/lib/seo';

// Ana sayfa için özel metadata
export const metadata: Metadata = {
  title: pageSEOConfigs.home.title,
  description: pageSEOConfigs.home.description,
  keywords: pageSEOConfigs.home.keywords,
  openGraph: {
    title: pageSEOConfigs.home.ogTitle,
    description: pageSEOConfigs.home.ogDescription,
    url: pageSEOConfigs.home.canonicalUrl,
    images: [
      {
        url: pageSEOConfigs.home.ogImage || 'https://yankitr.com/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Yankı - AI Ses Teknolojileri Ana Sayfa'
      }
    ]
  },
  alternates: {
    canonical: pageSEOConfigs.home.canonicalUrl,
  },
};

export default function Home() {
  // FAQ Schema for home page
  const homePageFAQs = [
    {
      question: "Yankı nedir?",
      answer: "Yankı, yapay zeka teknolojisi kullanarak metinleri doğal insan sesi ile seslendiren, ses klonlama ve konuşma tanıma hizmetleri sunan Türkiye'nin önde gelen AI ses teknolojileri platformudur."
    },
    {
      question: "Ücretsiz deneme var mı?",
      answer: "Evet! Kayıt olduğunuzda 1000 karakter ücretsiz kredi kazanıyorsunuz. Hiçbir ödeme bilgisi gerekmeden tüm özelliklerimizi test edebilirsiniz."
    },
    {
      question: "Hangi dilleri destekliyorsunuz?",
      answer: "20+ dil desteği ile profesyonel seslendirme yapabilirsiniz. Türkçe, İngilizce ve daha birçok dilde kaliteli ses seçenekleri sunuyoruz."
    }
  ];

  const servicesSchema = [
    createServiceSchema({
      name: "AI Seslendirme",
      description: "Metinleri yapay zeka ile doğal insan sesine çevirme hizmeti",
      url: "https://yankitr.com/products/tts",
      price: "0.0029₺",
      category: "Text-to-Speech Technology"
    }),
    createServiceSchema({
      name: "Ses Klonlama",
      description: "Kişinin kendi sesini klonlayarak sınırsız içerik üretme hizmeti",
      url: "https://yankitr.com/products/voice-cloning",
      price: "Paket bazlı",
      category: "Voice Cloning Technology"
    }),
    createServiceSchema({
      name: "Deşifre Hizmeti",
      description: "Ses dosyalarını ve canlı konuşmaları metne çevirme hizmeti",
      url: "https://yankitr.com/products/transcribe",
      price: "0.65₺",
      category: "Speech Recognition Technology"
    })
  ];

  const faqSchema = createFAQSchema(homePageFAQs);

  return (
    <>
      {/* Schema Markup for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema)
        }}
      />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      <main className="bg-white">
        <Hero />
        <Testimonials />
        <UseCases />
        <Features />
        <Footer />
      </main>
    </>
  );
}