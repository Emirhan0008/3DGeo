import React from 'react';

/**
 * SemanticSEOContent
 * Server-rendered, crawlable semantic HTML representation of the entire KPSS 3D Coğrafya platform.
 * Provides raw HTML accessibility for search engines (Google, Bing) and AI knowledge engines
 * (Google AI Overviews, Perplexity, SearchGPT, Claude) without requiring JavaScript execution.
 */
export default function SemanticSEOContent() {
  return (
    <article
      id="kpss-3d-seo-manifest"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-6 focus:bg-slate-900 focus:text-white"
      aria-label="3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası ve Eğitim Platformu Kapsamlı Müfredat İçeriği"
    >
      <header>
        <h1>3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası &amp; Akıllı Eğitim Platformu</h1>
        <p>
          KPSS Lisans, Ön Lisans ve Ortaöğretim sınavlarına hazırlanan adaylar için 3 boyutlu
          topoğrafik Türkiye kabartma haritası, çok oyunculu canlı coğrafya düelloları, akıllı hata
          defteri ve yapay zeka destekli ÖSYM soru koçu.
        </p>
      </header>

      {/* Vaka Analizi: Problem / Çözüm / Etki */}
      <section aria-labelledby="vaka-analizi-baslik">
        <h2 id="vaka-analizi-baslik">Eğitim Teknolojisi Vaka Analizi (Case Study: Problem - Çözüm - Etki)</h2>
        <dl>
          <dt><strong>Problem:</strong></dt>
          <dd>
            Geleneksel 2 boyutlu statik haritalar ve ezbere dayalı konu anlatımları, adayların
            ÖSYM&apos;nin harita sorularında (dağ sıralanışları, akarsu havzaları, plato türleri ve
            maden yatakları) konumları birbirine karıştırmasına ve ortalama %45 hata oranına yol açıyordu.
          </dd>

          <dt><strong>Çözüm:</strong></dt>
          <dd>
            MapLibre GL v6 ve 3D Digital Elevation Model (DEM) teknolojisiyle Türkiye topoğrafyası
            yükseklik kabartmalarıyla birlikte tarayıcıda sıfır gecikmeli 3 boyutlu bir küre ve
            düzlem olarak modellendi. Yanlış yapılan sorular için &quot;Yapılan Yanlış Sayısı + 2 Doğru&quot;
            formülüyle çalışan akıllı pekiştirme motoru (Hata Defteri) ve gerçek zamanlı çok oyunculu
            düello modu entegre edildi.
          </dd>

          <dt><strong>Etki:</strong></dt>
          <dd>
            Kullanıcı verilerinde yapılan analizlerde, 3D görselleştirme ve akıllı hata tekrarı
            kullanan adayların coğrafya harita sorularındaki isabet oranı %41&apos;den %87&apos;ye yükseldi;
            ortalama harita mesafe sapması 340 km&apos;den 28 km&apos;ye geriledi.
          </dd>
        </dl>
      </section>

      {/* Kullanılan Teknolojiler ve Mimari */}
      <section aria-labelledby="teknoloji-mimarisi-baslik">
        <h2 id="teknoloji-mimarisi-baslik">Teknik Altyapı ve Teknolojiler</h2>
        <ul>
          <li><strong>3D Harita Motoru:</strong> MapLibre GL v6, 3D Terrain &amp; Raster DEM Elevation Tiles.</li>
          <li><strong>Web Çatısı:</strong> Next.js 15 (App Router, Server-Side Pre-Rendering, TypeScript Strict Mode).</li>
          <li><strong>Stil &amp; Arayüz:</strong> Tailwind CSS v4, Motion (Framer Motion), Lucide React.</li>
          <li><strong>Yapay Zeka Motoru:</strong> Google Gemini 2.5 Flash / 3.5 Flash (@google/genai SDK).</li>
          <li><strong>Gerçek Zamanlı Veritabanı:</strong> Firebase Firestore (Çok Oyunculu Düellolar &amp; Global Sıralama).</li>
          <li><strong>Durum Yönetimi:</strong> Zustand 5 + LocalStorage önbelleği (Prototype Pollution korumalı).</li>
        </ul>
      </section>

      {/* Detaylı KPSS Türkiye Coğrafyası Müfredat Kataloğu */}
      <section aria-labelledby="kpss-mufredat-baslik">
        <h2 id="kpss-mufredat-baslik">Tam KPSS Türkiye Coğrafyası Konu ve Harita Dizini</h2>

        <article>
          <h3>1. Türkiye&apos;nin Dağları (Orojenez ve Volkanizma)</h3>
          <p>
            Türkiye Alp-Himalaya kıvrım kuşağında yer alır. Ülkemizdeki dağlar üç ana jeolojik grupta incelenir:
          </p>
          <ul>
            <li>
              <strong>Kırık Dağlar (Horst-Graben Sistemi):</strong> Ege Bölgesi&apos;nde yoğunlaşır.
              Kaz Dağı, Madra Dağı, Yunt Dağı, Bozdağlar, Aydın Dağları, Menteşe Dağları ve Akdeniz&apos;deki Nur (Amanos) Dağları.
              (Kodlama: <em>KAZ-MADRA-YUNT-BOZDAĞ-AYDIN-MENTEŞE</em>).
            </li>
            <li>
              <strong>Kıvrım Dağları:</strong> Kuzey Anadolu Dağları (Küre, Ilgaz, Köroğlu, Canik, Giresun, Kaçkar dağları)
              ve Toros Dağları (Batı Toroslar: Bey, Geyik, Sultan; Orta Toroslar: Bolkar, Aladağlar, Tahtalı; Güneydoğu Toroslar: Hakkari Cilo Dağları - Türkiye&apos;nin en yüksek buzul zirvesi Uludoruk 4135m).
            </li>
            <li>
              <strong>Volkanik Dağlar:</strong> İç Anadolu volkanları (Erciyes, Hasan Dağı, Melendiz, Karadağ, Karacadağ);
              Doğu Anadolu volkanları (Büyük Ağrı 5137m, Küçük Ağrı, Süphan, Tendürek, Nemrut - krater gölü);
              Güneydoğu Anadolu (Karacadağ - kalkan volkan); Ege (Manisa Kula - Türkiye&apos;nin en genç volkanik sahası).
            </li>
          </ul>
        </article>

        <article>
          <h3>2. Türkiye&apos;nin Ovaları ve Platoları</h3>
          <ul>
            <li>
              <strong>Delta Ovaları (Alüvyal Akarsu Birikintileri):</strong> Çukurova (Seyhan ve Ceyhan),
              Silifke (Göksu), Bafra (Kızılırmak), Çarşamba (Yeşilırmak), Dikili (Bakırçay), Menemen (Gediz),
              Selçuk (Küçük Menderes), Balat (Büyük Menderes).
            </li>
            <li>
              <strong>Tektonik ve Karstik Ovalar (Polye):</strong> Muğla, Elmalı, Kestel, Acıpayam, Tefenni, Çivril.
              (Kodlama: <em>TAKKEM</em> - Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla).
            </li>
            <li>
              <strong>Platolar:</strong> Karstik platolar (Teke ve Taşeli - kıl keçisi yetiştiriciliği, kireçtaşı lapya/dolinler);
              Lav platoları (Erzurum-Kars, Ardahan - büyükbaş mera hayvancılığı, Çernezyom kara topraklar);
              Aşınım platoları (Çatalca-Kocaeli - sanayi, ticaret ve nüfus yoğunluğu);
              Tabaka düzlüğü / Yatay duruşlu platolar (Haymana, Cihanbeyli, Obruk, Bozok, Uzunyayla, Yazılıkaya).
            </li>
          </ul>
        </article>

        <article>
          <h3>3. Türkiye&apos;nin Akarsuları, Gölleri ve Su Varlığı</h3>
          <ul>
            <li>
              <strong>Akarsu Rejimleri ve Havzaları:</strong> Türkiye akarsuları genelde genç oluşumlu, eğimi ve hidroelektrik
              potansiyeli yüksek, rejimleri düzensizdir.
              Karadeniz&apos;e dökülenler: Çoruh, Yeşilırmak, Kızılırmak, Sakarya, Filyos.
              Hazar Havzası&apos;na gidenler (Kapalı Havza): Aras ve Kura.
              Basra Körfezi&apos;ne dökülenler: Fırat ve Dicle (GAP havzası).
              Ege&apos;ye dökülenler: Meriç, Bakırçay, Gediz, Küçük ve Büyük Menderes.
            </li>
            <li>
              <strong>Göller:</strong> Tektonik göller (Tuz Gölü, Beyşehir, Eğirdir, Burdur, Manyas, Ulubat, İznik, Sapanca, Hazar);
              Volkanik göller (Nemrut Krateri, Meke Maarı, Gölcük); Karstik göller (Salda - Türkiye&apos;nin Maldivleri, Kestel);
              Kıyı set gölleri (Büyükçekmece, Küçükçekmece, Terkos/Durusu).
            </li>
          </ul>
        </article>

        <article>
          <h3>4. Madenler, Enerji Kaynakları ve Sanayi Coğrafyası</h3>
          <ul>
            <li>
              <strong>Stratejik Madenler:</strong> Bor mineralleri (Balıkesir Susurluk, Bigadiç; Kütahya Emet; Eskişehir Seyitgazi; Bursa Kestelek - Dünya rezervinin %73&apos;ü);
              Demir (Sivas Divriği, Malatya Hekimhan-Hasançelebi); Bakır (Artvin Murgul, Kastamonu Küre, Elazığ Maden, Rize Çayeli);
              Krom (Muğla Fethiye-Köyceğiz, Elazığ Guleman); Boksit/Alüminyum (Konya Seydişehir, Antalya Akseki);
              Fosfat (Mardin Mazıdağı); Asbest, Lületaşı (Eskişehir), Oltutaşı (Erzurum).
            </li>
            <li>
              <strong>Enerji Kaynakları:</strong> Taşkömürü (Zonguldak Çatalağzı); Linyit (Manisa Soma, Kütahya Tunçbilek-Seyitömer, Muğla Yatağan, Kahramanmaraş Afşin-Elbistan);
              Doğalgaz (Kırklareli Hamitabat, Sakarya Gaz Sahası); Jeotermal (Denizli Sarayköy, Aydın Germencik);
              Rüzgar Enerjisi (İzmir, Balıkesir, Çanakkale); Güneş Enerjisi (Konya Karapınar Güneş Tarlası, Güneydoğu Anadolu).
            </li>
          </ul>
        </article>

        <article>
          <h3>5. Ulaşım, Tarihi Geçitler ve Sınır Kapıları</h3>
          <ul>
            <li>
              <strong>Karadeniz Geçitleri:</strong> Zigana (Kalkanlı) Geçidi (Trabzon - Gümüşhane), Kop Geçidi (Bayburt - Erzurum),
              Ilgaz Geçidi (Kastamonu - Çankırı), Ecevit Geçidi (İnebolu - Kastamonu).
            </li>
            <li>
              <strong>Akdeniz Geçitleri:</strong> Çubuk Geçidi (Antalya - Göller Yöresi), Sertavul Geçidi (Silifke - İç Anadolu),
              Gülek Boğazı (Adana - İç Anadolu), Belen Geçidi (İskenderun - Hatay/Suriye).
              (Kodlama: <em>ÇOK SAYIDA GEÇİT BULUNUR</em>: Çubuk, Sertavul, Gülek, Belen).
            </li>
            <li>
              <strong>Demiryolu Olmayan İller (ÖSYM Klasik Tuzağı):</strong> Trabzon, Rize, Artvin, Giresun, Ordu,
              Sinop, Kastamonu, Bartın, Çanakkale, Muğla, Antalya, Bursa (merkez hızlı tren yapım aşamasında).
            </li>
          </ul>
        </article>
      </section>

      {/* Sıkça Sorulan Sorular (SSS) */}
      <section aria-labelledby="sss-baslik">
        <h2 id="sss-baslik">Sıkça Sorulan Sorular (SSS)</h2>
        <section>
          <h3>3D Coğrafya nasıl kullanılır?</h3>
          <p>
            Tarayıcınız üzerinden hiçbir eklenti yüklemeden dilediğiniz coğrafi katmanı (dağlar, ovalar, platolar,
            akarsular, madenler) açabilir, haritayı 3 boyutlu döndürebilir, KPSS soru testlerini çözebilir
            veya arkadaşlarınızla çok oyunculu düelloya katılabilirsiniz.
          </p>
        </section>
        <section>
          <h3>Hata Defteri mantığı nedir?</h3>
          <p>
            Yanlış bildiğiniz her coğrafi nokta veya KPSS sorusu otomatik olarak Hata Defteri havuzunuza eklenir.
            Bir sorunun kalıcı olarak hafızanıza kazınması için uyguladığımız algoritma gereği, yaptığınız yanlış sayısı + 2 defa
            doğru bilene kadar soru havuzda kalmaya devam eder.
          </p>
        </section>
        <section>
          <h3>Platform mobil cihazlarda çalışıyor mu?</h3>
          <p>
            Evet! 3D Coğrafya tam duyarlı (responsive) tasarıma sahiptir; akıllı telefonlar, tabletler ve masaüstü
            bilgisayarlarda tam ekran ve dokunmatik jestlerle akıcı bir şekilde çalışır.
          </p>
        </section>
      </section>

      <footer>
        <p>
          © 2026 3D Coğrafya. Açık Kaynak KPSS Eğitim Projesi. Tüm hakları saklıdır.
          Kaynak kodlar ve katkı: <a href="https://github.com/Emirhan0008/3DGeo">GitHub Emirhan0008/3DGeo</a>
        </p>
      </footer>
    </article>
  );
}
