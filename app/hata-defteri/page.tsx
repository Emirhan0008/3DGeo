import HataDefteriView from '@/components/game/HataDefteriView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hata Defteri - KPSS Coğrafya Yanlış Soru Analizi',
  description: 'Yanlış yaptığın tüm KPSS coğrafya soruları. Akıllı pekiştirme algoritması (Yanlış + 2 Doğru) ile kalıcı öğrenme.',
  openGraph: {
    title: 'KPSS Hata Defteri',
    description: 'Yanlış sorularını analiz et, pekiştirme pratiği yap',
    images: ['/opengraph-image?mode=hata-defteri'],
  },
};

export default function HataDefteriPage() {
  return <HataDefteriView />;
}