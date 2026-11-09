import AITutorDrawer from '@/components/ai/AITutorDrawer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI KPSS Coğrafya Öğretmeni',
  description: 'Gemini AI destekli kişiselleştirilmiş KPSS coğrafya koçluğu. Soru çözüm açıklaması, zayıf konu analizi, hafıza kodlamaları.',
  openGraph: {
    title: 'AI KPSS Coğrafya Öğretmeni',
    description: 'Yapay zeka ile soru çöz, zayıf konularını keşfet',
    images: ['/opengraph-image?mode=ai-ogretmen'],
  },
};

export default function AIOgretmenPage() {
  return <AITutorDrawer />;
}