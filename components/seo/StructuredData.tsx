import React from 'react';

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://3d-cografya.vercel.app';

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${baseUrl}/#webapp`,
    name: '3D Coğrafya',
    alternateName: ['KPSS 3D Harita', '3D Türkiye Coğrafyası', 'KPSS 3D Geo'],
    url: baseUrl,
    description:
      'KPSS Lisans, Ön Lisans ve Ortaöğretim adayları için 3D topoğrafik Türkiye haritası, çok oyunculu canlı coğrafya düelloları, akıllı hata defteri ve AI destekli ÖSYM sınav koçu.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All modern web browsers, iOS, Android, macOS, Windows, Linux',
    inLanguage: 'tr-TR',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      name: '3D Coğrafya Açık Kaynak Topluluğu',
      url: 'https://github.com/Emirhan0008/3DGeo',
    },
    featureList: [
      '3D Topoğrafik Türkiye Kabartma Haritası (MapLibre GL v6 & DEM Yükseklik Verisi)',
      '500+ ÖSYM Tipi Soru ve Mesafe Bazlı Pin Bulmaca Oyunu',
      'Gerçek Zamanlı Çok Oyunculu Canlı Coğrafya Düellosu (1v1 ve 4 Kişilik)',
      'Akıllı Hata Defteri & Pekiştirme Algoritması (Yanlış + 2 Doğru Formülü)',
      'Gemini AI Destekli Kişiselleştirilmiş KPSS Coğrafya Öğretmeni & Teşhis Raporu',
      'Fiziki, Beşeri ve Ekonomik Coğrafya Katmanları (Dağlar, Ovalar, Platolar, Akarsular, Madenler, Geçitler)',
    ],
  };

  const educationalCourseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${baseUrl}/#course`,
    name: 'KPSS Türkiye Coğrafyası 3D Görsel ve İnteraktif Eğitimi',
    description:
      'ÖSYM KPSS müfredatına tam uyumlu, 3D dilsiz harita üzerinde dağlar, ovalar, platolar, akarsular, göller, madenler, nüfus ve tarım konularının görsel pekiştirmesi.',
    provider: {
      '@type': 'Organization',
      name: '3D Coğrafya',
      url: baseUrl,
    },
    inLanguage: 'tr-TR',
    isAccessibleForFree: true,
    educationalLevel: ['KPSS Lisans', 'KPSS Ön Lisans', 'KPSS Ortaöğretim', 'YKS', 'Genel Kültür'],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT15H',
    },
    teaches: [
      "Türkiye'nin Jeopolitik ve Coğrafi Konumu",
      "Türkiye'nin Yerşekilleri (Kırık, Kıvrım ve Volkanik Dağlar)",
      'Platolar ve Ovalar (Delta ve Tektonik Ovalar)',
      'Akarsular, Göller ve Karstik Şekiller',
      'Türkiye İklim Tipleri ve Bitki Örtüsü',
      'Maden Yatakları, Enerji Santralleri ve Sanayi',
      'Ulaşım Ağları, Sınır Kapıları ve Tarihi Geçitler',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '3D Coğrafya nedir ve KPSS sınavına nasıl hazırlar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "3D Coğrafya, KPSS adaylarının Türkiye Coğrafyası sorularını ezberlemek yerine 3 boyutlu topoğrafik kabartma harita üzerinde interaktif olarak deneyimlemelerini sağlayan yeni nesil bir EdTech platformudur. Dağlar, ovalar, platolar, akarsular ve madenler gerçek koordinatlarıyla modellenmiştir.",
        },
      },
      {
        '@type': 'Question',
        name: 'Akıllı Hata Defteri ve "Yanlış + 2 Doğru" pekiştirme kuralı nasıl çalışır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Kullanıcı test çözerken veya harita pin bulmacasında bir yeri yanlış bildiğinde soru otomatik olarak 'Hata Defteri'ne eklenir. Bir konunun hafızada kalıcı hale gelmesi için formülümüz: Yapılan Yanlış Sayısı + 2 kez art arda doğru cevaplanana kadar o soru Hata Defteri havuzunda kalır ve tekrar karşınıza çıkar.",
        },
      },
      {
        '@type': 'Question',
        name: 'Çok Oyunculu Canlı Coğrafya Düellosu nasıl oynanır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rumuzunuz ve PIN şifrenizle giriş yaparak anlık oda kurabilir veya arkadaşınızın 4 haneli oda koduna katılabilirsiniz. 1v1 veya 4 kişiye kadar gerçek zamanlı pin tahmin ve KPSS test yarışması yapılır. Mesafe sapması (km) ve yanıt hızına göre ELO puanı kazanılır.',
        },
      },
      {
        '@type': 'Question',
        name: 'Yapay Zeka KPSS Coğrafya Öğretmeni nasıl çalışır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Google Gemini 2.5/3.5 Flash yapay zeka modelleriyle çalışan AI Asistanı; kullanıcıların haritada zorlandığı bölgeleri analiz eder, ÖSYM tarzı soru tuzaklarını açıklar ve hafıza tekniklerine dayalı akılda kalıcı pratik kodlamalar (hafıza şifreleri) üretir.',
        },
      },
      {
        '@type': 'Question',
        name: '3D Coğrafya uygulamasını kullanmak ücretli midir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hayır, 3D Coğrafya platformu tüm KPSS ve YKS öğrencileri için tamamen ücretsiz ve açık kaynaklıdır. Herhangi bir abonelik veya gizli ücret bulunmamaktadır.',
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '3D Türkiye Coğrafyası',
        item: `${baseUrl}/#harita`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'KPSS Test & Düello',
        item: `${baseUrl}/#duello`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Hata Defteri',
        item: `${baseUrl}/#hata-defteri`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalCourseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
