import HomePageClient from '@/components/HomePageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ezber Kartları - KPSS Coğrafya Hafıza Teknikleri',
  description:
    'KPSS coğrafya için hafıza kartları: yer şekilleri, göller, akarsular, 81 il ve şehirler. Aralıklı tekrar ile kalıcı öğrenme.',
  openGraph: {
    title: 'KPSS Coğrafya Ezber Kartları',
    description: 'Hafıza kartlarıyla hızlı tekrar',
    images: ['/opengraph-image?mode=ezber'],
  },
};

export default function EzberPage() {
  return <HomePageClient />;
}
