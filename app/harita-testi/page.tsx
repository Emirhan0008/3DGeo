import HomePageClient from '@/components/HomePageClient';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Harita Testi - KPSS Coğrafya Pin Oyunu',
  description:
    'Türkiye haritasında yer şekillerini, gölleri ve geçitleri işaretleyerek öğren. Mesafe bazlı puanlama ile KPSS harita bilgini test et.',
  openGraph: {
    title: 'KPSS Harita Testi',
    description: 'Haritada işaretle, mesafeyi gör, öğren',
    images: ['/opengraph-image?mode=harita-testi'],
  },
};

export default function HaritaTestiPage() {
  return (
    <>
      <StructuredData />
      <HomePageClient />
    </>
  );
}
