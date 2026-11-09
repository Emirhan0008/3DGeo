import DuelMode from '@/components/game/DuelMode';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Canlı KPSS Coğrafya Düellosu',
  description: 'Gerçek zamanlı 1v1 ve 4 kişilik coğrafya düelloları. Mesafe bazlı skor, ELO puanı, rozetler ve küresel sıralama.',
  openGraph: {
    title: 'KPSS Düello Arenası',
    description: 'Arkadaşlarınla veya rastgele rakiple canlı coğrafya mücadelesi',
    images: ['/opengraph-image?mode=duello'],
  },
};

export default function DuelloPage() {
  return (
    <>
      <StructuredData />
      <DuelMode />
    </>
  );
}