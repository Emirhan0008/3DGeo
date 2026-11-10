import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles
import { buildPageMetadata, webApplicationJsonLd, organizationJsonLd } from '@/lib/seo';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#131f1c',
};

export const metadata: Metadata = buildPageMetadata({
  title: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
  description: 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması. 3D topoğrafik harita, canlı düellolar, AI öğretmen, hata defteri.',
  path: '/',
});

const rootJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webApplicationJsonLd(),
    organizationJsonLd(),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}