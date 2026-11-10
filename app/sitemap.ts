import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://3d-cografya.vercel.app';

  const lastModifiedHome = new Date('2026-11-10');
  const lastModifiedDuello = new Date('2026-11-08');
  const lastModifiedHaritaTesti = new Date('2026-11-07');
  const lastModifiedSoruBankasi = new Date('2026-11-05');
  const lastModifiedHataDefteri = new Date('2026-11-09');
  const lastModifiedAiOgretmen = new Date('2026-11-10');
  const lastModifiedIstatistikler = new Date('2026-11-04');
  const lastModifiedEzber = new Date('2026-11-03');

  return [
    {
      url: baseUrl,
      lastModified: lastModifiedHome,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          tr: baseUrl,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/duello`,
      lastModified: lastModifiedDuello,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/harita-testi`,
      lastModified: lastModifiedHaritaTesti,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/soru-bankasi`,
      lastModified: lastModifiedSoruBankasi,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/hata-defteri`,
      lastModified: lastModifiedHataDefteri,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ai-ogretmen`,
      lastModified: lastModifiedAiOgretmen,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/istatistikler`,
      lastModified: lastModifiedIstatistikler,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ezber`,
      lastModified: lastModifiedEzber,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}