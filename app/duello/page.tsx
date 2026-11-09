import HomePageClient from '@/components/HomePageClient';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Canlı KPSS Coğrafya Düellosu',
  description:
    'Gerçek zamanlı 1v1 ve 4 kişilik coğrafya düelloları. Mesafe bazlı skor, ELO puanı, rozetler ve küresel sıralama.',
  openGraph: {
    title: 'KPSS Düello Arenası',
    description: 'Arkadaşlarınla veya rastgele rakiple canlı coğrafya mücadelesi',
    images: ['/opengraph-image?mode=duello'],
  },
};

/**
 * Deep link target for the Düello tab.
 * Renders the full app shell (navbar + map) and lets HomePageClient
 * restore the active tab from the URL, so a refresh here looks exactly
 * like clicking the tab did.
 */
export default function DuelloPage() {
  return (
    <>
      <StructuredData />
      <HomePageClient />
    </>
  );
}
