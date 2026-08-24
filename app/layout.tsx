import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
  description: 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KPSS 3D Harita',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

