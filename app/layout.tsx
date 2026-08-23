import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
  description: 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
