import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { siteConfig, createOrganizationSchema, pageSEOConfigs } from '@/lib/seo';

// INTER fontu yapılandırıyoruz (modern typography için)
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Performance optimization
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: pageSEOConfigs.home.title,
    template: `%s | ${siteConfig.name}`
  },
  description: pageSEOConfigs.home.description,
  keywords: pageSEOConfigs.home.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  applicationName: siteConfig.name,
  
  // OpenGraph
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: pageSEOConfigs.home.ogTitle,
    description: pageSEOConfigs.home.ogDescription,
    url: siteConfig.url,
    images: [
      {
        url: pageSEOConfigs.home.ogImage || `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI Ses Teknolojileri`,
      }
    ],
    locale: 'tr_TR',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: pageSEOConfigs.home.ogTitle,
    description: pageSEOConfigs.home.ogDescription,
    images: [pageSEOConfigs.home.ogImage || `${siteConfig.url}/og-image.jpg`],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Technical SEO
  alternates: {
    canonical: siteConfig.url,
  },
  
  // Additional meta tags
  category: 'Technology',
  classification: 'AI Voice Technology',
  
  // Verification (add when you have these)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = createOrganizationSchema();

  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/* Schema.org Organization Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#4F46E5" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </head>
      
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        
        {/* Google Analytics placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}