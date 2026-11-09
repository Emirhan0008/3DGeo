import HomePageClient from '@/components/HomePageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İstatistikler - KPSS Coğrafya Performans Analizi',
  description:
    'Detaylı başarı istatistikleri, rozet vitrini, kategori ustalık takibi, bölgesel performans haritası.',
  openGraph: {
    title: 'KPSS Coğrafya İstatistikler',
    description: 'Performans analizi, rozetler, kategori ustalığı',
    images: ['/opengraph-image?mode=istatistikler'],
  },
};

export default function IstatistiklerPage() {
  return <HomePageClient />;
}
