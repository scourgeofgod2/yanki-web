import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

// INTER fontu yapılandırıyoruz (modern typography için)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yankı | Yapay Zeka Ses Stüdyosu",
  description: "Metinleri sese çevirin, sesinizi klonlayın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}