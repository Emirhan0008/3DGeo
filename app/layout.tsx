import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles

const metadataBase = new URL('https://3d-cografya.vercel.app');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
    template: '%s | 3D Coğrafya',
  },
  description: 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması. 3D topoğrafik harita, canlı düellolar, AI öğretmen, hata defteri.',
  keywords: ['KPSS', 'coğrafya', '3D harita', 'Türkiye', 'eğitim', 'düello', 'soru bankası', 'hata defteri', 'yapay zeka'],
  authors: [{ name: '3D Coğrafya Topluluğu', url: 'https://github.com/Emirhan0008/3DGeo' }],
  creator: '3D Coğrafya',
  publisher: '3D Coğrafya',
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
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: '3D Coğrafya',
    title: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
    description: 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
    description: 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması',
    images: ['/opengraph-image'],
    creator: '@emirhan0008'
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KPSS 3D Harita'
  },
  formatDetection: {
    telephone: false
  },
  alternates: {
    canonical: '/',
    languages: {
      tr: '/',
      'x-default': '/'
    }
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}