import QuizTestGame from '@/components/game/QuizTestGame';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Soru Bankası - KPSS Coğrafya Test Çöz',
  description: 'KPSS coğrafya çoktan seçmeli soru bankası. Kategori filtreleme, açıklamalı çözümler, süre sayacı ve hata defteri entegrasyonu.',
  openGraph: {
    title: 'KPSS Soru Bankası',
    description: 'Kategori bazlı test çöz, hata defteri ile pekiştir',
    images: ['/opengraph-image?mode=soru-bankasi'],
  },
};

export default function SoruBankasiPage() {
  return (
    <>
      <StructuredData />
      <QuizTestGame />
    </>
  );
}