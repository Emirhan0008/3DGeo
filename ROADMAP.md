# 3D Coğrafya - Yol Haritası ve Görev Planı (ROADMAP.md)

> Bu doküman, 3D Coğrafya projesinde tamamlanan aşamaları, aktif üzerinde çalışılan özellikleri ve iki yapay zekanın geliştirebileceği gelecek hedefleri içerir.

---

## 🟢 1. Tamamlanan Temel Aşamalar (Completed Milestones)

- [x] **3D Harita Motoru**: MapLibre GL v6 ile 3D topoğrafik Türkiye haritası, kabartma gölgeleme, dinamik kamera açıları (pitch: 42°).
- [x] **Zengin Coğrafi Veri Tabanı**: 4800+ satırlık KPSS odaklı veri seti (`turkeyData.ts`): dağlar, göller, akarsular, madenler, platolar, ovalar, sınır kapıları, kıyı tipleri, geçitler.
- [x] **Çoktan Seçmeli Soru Modu (`QuizTestGame`)**: KPSS soru bankası, kategori filtreleme, açıklamalı çözümler ve süre sayacı.
- [x] **Haritada Konum Bulma Oyunu (`PinGuessGame`)**: Coğrafi hedefin harita üzerinde tıklanarak bulunması, km mesafesine göre skor hesaplama.
- [x] **1v1 Gerçek Zamanlı Çok Oyunculu Düello (`DuelMode`)**: Firebase Firestore ile matchmaking ve oda kurma, eşzamanlı yarışma. (İndeks bağımsız ve undefined veri korumalı eşleşme motoru aktif).
- [x] **Şifreli Hafıza Kartları (`FlashcardMode`)**: KPSS akılda kalıcı kodlamalar (mnemonics) ve pratik kart tekrarı.
- [x] **Yapay Zeka KPSS Öğretmeni (`AITutorDrawer`)**: Gemini 2.5 Flash entegrasyonu ile soru çözüm açıklaması ve zayıf konu analizi.
- [x] **Oyunlaştırma & Profil**: XP, Seviye, Rozetler (`badgesData.ts`), Firestore tabanlı Küresel Liderlik Tablosu (`GlobalLeaderboardModal`).
- [x] **Kapsamlı SEO & GEO (Generative Engine Optimization)**: Sunucu seviyesinde ham HTML ön-oluşturma (SSG), Schema.org JSON-LD (WebApplication, Course, FAQPage, BreadcrumbList), AI Ajan manifestoları (`ai-catalog.json`, `llms.txt`, `llms-full.txt`), dinamik 1200x630 OpenGraph görseli, `robots.ts` ve güncel `sitemap.ts`.
- [x] **Antik Atlas Teması (Referans Birebir)**: `AppFrame` ile ahşap-parşömen ekran çerçevesi (4 doku şeridi + altın hairline + köşe perçinleri + sol alt küre amblemi), ▲ akordeon katman sidebar'ı (`inert` ile erişilebilir), 18 gravür katman ikonu (`LayerIcons`), krem plakalı AI öğretmen paneli, `◆` ayraçlı navbar. Assetler `sharp` ile optimize edildi (toplam ~1.1 MB tasarruf).
- [x] **SEO Tek Kaynak Refaktörü**: `lib/seo.ts` (`buildPageMetadata` + WebApplication/Organization/FAQ/Breadcrumb JSON-LD üreticileri), `layout.tsx` metadata artık buradan beslenir, `@graph` JSON-LD, `robots.ts`'e `host` alanı ve 4 AI crawler kuralı, `sitemap.ts` 8 route.
- [x] **Mobil Responsive Onarımı**: Çerçeve bandı `--hf-band` değişkenine taşındı (mobil 6px / `sm`+ 12px), sidebar omurgası `w-7 sm:w-9`, AI şeridi `w-6 sm:w-9`, navbar'da arama + geri bildirim mobilde gizlendi, sekme etiketleri kısaltıldı. Harita alanı 360px'te 336×621 → **348×646**, 390px'te 366×725 → **378×750**; yatay taşma 0.
- [x] **Sidebar Hover & Dikey Şerit**: Sol kenara `fixed` 12px hover bölgesi (`absolute` iken `overflow-hidden` kırpıyordu), kapalı omurgada dikey "KATMANLAR" etiketi 10px/kalın/parlak, küre+parşömen amblemi aşağı alındı.
- [x] **Kompakt Mobil Kabuk**: Mobilde omurgalar 24px/20px ve çerçeveye sıfır boşlukla yapışık (`rounded-r-xl` / `rounded-l-xl`), HUD pili `left-7` + 36px yüksekliğe indi, `ScaleControl` tamamen kaldırıldı (sol alt köşe küre amblemine ait), navbar'da katman butonu + pusula madalyonu tek **pusula logosunda** birleşti, sekme ikonları mobilde gizlenip etiketler eşit dağıldı. Masaüstü taşması da düzeltildi (1280px'te 201px → 0).
- [x] **Menü ve Alt Menü Kompaktlaştırması**: Sekme/çip raylarındaki 12 gerçek taşma ölçümle bulunup giderildi (analiz alt-sekmeleri 308px, sıralama 236px, Ezber kategorileri 328px, düello kategori seçicisi…). Kural `ARCHITECTURE.md` §2b'ye yazıldı: ya `flex-wrap`, ya mobil kısa etiket + `flex-1` — yatay kaydırıcı sekme rayı yasak. 360/390/1440'ta 0 taşma.
- [x] **İlk Giriş Tanıtım Turu (Spotlight Onboarding)**: 6 adımlı spotlight turu — pusula/katmanlar, tab rayı, üst bar araması, AI asistanı, profil (rozet → kademe). Her adımda hedef aydınlatılır, geri kalan karartılıp bulanıklaştırılır; kart hedefin yanına konumlanır, sığmayan kenarı ters çevirir. Hedef ekran genişliğinde gizliyse adım atlanmaz, açıklama gösterilir. Odak tuzağı + `resize`/`scroll` yeniden ölçümü. Yalnızca veri yoksa açılır, `Atla`/X/Esc/örtü kapatır; Navbar pusula düğmesiyle yeniden izlenir.
- [x] **Giyilebilir Sembol Sistemi (Üç Aile / Beş Kademe)**: Avatar ikonu, avatar efekti, ünvan ve rozet artık silüetle ayrılıyor — sırasıyla **halka**, aura, **plaka** ve **madalyon**. Kademeler geometri + renk + efekt üçlüsüyle değişiyor; 4 (altıgen kesim) ile 5 (12 köşe patlama + yörünge elipsi) 24px'te bile karışmıyor. 129 sembolün tamamı ~120 SVG glife çevrildi (emoji kalmadı, eski kayıtlar `g:` token zinciriyle taşındı). Profil modalına "Giyilebilir Katmanlar" lejantı ve "Kademe Merdiveni" şeridi eklendi. Kural `ARCHITECTURE.md` §2b'de.

---

## 🟡 2. Aktif ve Öncelikli Geliştirme Alanları (Current Priorities)

- [ ] **Mobil Dokunmatik Kontroller & UX İyileştirmesi**:
  - Küçük ekranlarda harita gezinirken yanlışlıkla pin atılmasını önleyici iki parmakla kaydırma veya kilit anahtarı.
  - Alt gezinme barı (Bottom Navigation) mobilde daha ergonomik hale getirilebilir.
- [ ] **Gelişmiş KPSS Soru Filtreleme & Bölgesel Odak**:
  - Konu bazlı (Fiziki Coğrafya, Beşeri Coğrafya, Ekonomik Coğrafya) soru havuzunun genişletilmesi.
  - Haritada seçili bölgeye (Örn: Sadece Karadeniz veya İç Anadolu) özel soru sorma modu.
- [ ] **Sesli / Ses Efektli Etkileşimler (Audio FX)**:
  - Doğru/yanlış yanıtlar, rozet kazanımı ve düello başlangıç/bitiş anları için hafif Web Audio API ses efektleri (kullanıcı isteğine göre sessize alınabilir).
- [ ] **Offline PWA Desteği**:
  - İnternet bağlantısı kesildiğinde soru bankası ve flashcard modunun Service Worker ile çalışmaya devam edebilmesi.

---

## 🔵 3. Gelecek Vizyon ve Fikirler (Future Enhancements)

1. **3D Coğrafi Kesit Görselleştirmesi**:
   - Türkiye'nin batı-doğu veya kuzey-güney yükselti profil eğrisinin (topoğrafik profil grafiği) harita üzerinde dinamik çizilmesi.
2. **Akıllı Sınav Denemesi (Simülatör)**:
   - 18 soruluk gerçek KPSS Coğrafya formatında tam deneme sınavı modu ve süre yönetimi.
3. **Günün Sorusu / Günlük Seri (Daily Challenge & Streaks)**:
   - Her gün yenilenen özel harita görevi, seri koruma bonusu ve ekstra XP ödülü.
4. **Çoklu Oyunculu Grup Odaları**:
   - 2 kişiden fazla (örneğin 4 kişilik) grup yarışma odaları.

---

> **Not**: Yeni bir göreve başlarken bu listedeki ilgili maddenin durumunu güncelleyin ve tamamlandığında `WORK_LOG.md` içine detayını kaydedin.
