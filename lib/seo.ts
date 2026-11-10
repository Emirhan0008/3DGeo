import type { Metadata } from 'next';

export const SITE_URL = 'https://3d-cografya.vercel.app';
export const SITE_NAME = '3D Coğrafya';

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  noFollow = false,
}: PageMetadataInput): Metadata {
  const defaultKeywords = [
    'KPSS',
    'coğrafya',
    '3D harita',
    'Türkiye',
    'eğitim',
    'düello',
    'soru bankası',
    'hata defteri',
    'yapay zeka',
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s | 3D Coğrafya',
    },
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: '3D Coğrafya Topluluğu', url: 'https://github.com/Emirhan0008/3DGeo' }],
    creator: '3D Coğrafya',
    publisher: '3D Coğrafya',
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
      creator: '@emirhan0008',
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'KPSS 3D Harita',
    },
    formatDetection: {
      telephone: false,
    },
    alternates: {
      canonical: path,
      languages: {
        tr: path,
        'x-default': path,
      },
    },
  };
}

export interface WebApplicationJsonLdInput {
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  }[];
  featureList?: string[];
}

export function webApplicationJsonLd({
  name = SITE_NAME,
  description = 'KPSS 3D Türkiye Coğrafyası Eğitim ve Oyunlaştırılmış İnteraktif Harita Uygulaması',
  url = SITE_URL,
  applicationCategory = 'EducationalApplication',
  operatingSystem = 'Web',
  offers = [{ price: '0', priceCurrency: 'TRY', availability: 'https://schema.org/InStock' }],
  featureList = [
    '3D Topoğrafik Kabartma Harita',
    'Canlı Çok Oyunculu Düello',
    'Akıllı Hata Defteri',
    'Gemini AI Sınav Koçu',
    'Soru Bankası ve Harita Testi',
    'Ezberleme Modülü',
    'İstatistikler ve Sıralama',
  ],
}: WebApplicationJsonLdInput = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: offers.map((offer) => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: offer.availability,
    })),
    featureList,
    author: {
      '@type': 'Organization',
      name: '3D Coğrafya Topluluğu',
      url: 'https://github.com/Emirhan0008/3DGeo',
    },
    publisher: {
      '@type': 'Organization',
      name: '3D Coğrafya',
      url: SITE_URL,
    },
    inLanguage: 'tr-TR',
    datePublished: '2025-03-01',
    dateModified: new Date().toISOString().split('T')[0],
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '3D Coğrafya',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    sameAs: [
      'https://github.com/Emirhan0008/3DGeo',
      'https://twitter.com/emirhan0008',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Turkish'],
    },
    knowsAbout: [
      'KPSS',
      'Coğrafya',
      '3D Harita',
      'Eğitim Teknolojileri',
      'Yapay Zeka Eğitimi',
    ],
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}