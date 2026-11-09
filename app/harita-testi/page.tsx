import PinGuessGame from '@/components/game/PinGuessGame';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Harita Testi - KPSS Coğrafya Pin Bulmaca',
  description: 'Haritada konum bulma oyunu. KPSS coğrafya sorularını harita üzerinde çöz, km cinsinden mesafe puanı kazan.',
  openGraph: {
    title: 'KPSS Harita Testi',
    description: 'Pin tahmin oyunu ile coğrafya becerini ölç',
    images: ['/opengraph-image?mode=harita-testi'],
  },
};

export default function HaritaTestiPage() {
  return (
    <>
      <StructuredData />
      <PinGuessGame />
    </>
  );
}