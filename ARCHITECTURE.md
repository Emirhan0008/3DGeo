# 3D Coğrafya - Sistem Mimarisi ve Teknik Dokümantasyon (ARCHITECTURE.md)

> Bu doküman, iki bağımsız yapay zeka geliştiricisinin ortak çalışabilmesi için 3D Coğrafya projesinin yazılım mimarisini, veri akışını, bileşen hiyerarşisini ve bulut servislerini detaylandırmaktadır.

---

## 🏗️ 1. Genel Teknoloji Mimarisi

| Katman | Teknoloji / Kütüphane | Kullanım Amacı & Açıklama |
|---|---|---|
| **Framework** | Next.js 15.4 (App Router) + React 19 | SSR/Client hibrit mimari, API Routes, Turbopack/Webpack |
| **Harita Motoru** | MapLibre GL v6 (`maplibre-gl`) | 3D topoğrafik Türkiye haritası, raster tiles, GeoJSON katmanları, kamera animasyonları |
| **State Yönetimi** | Zustand 5 (`/lib/store/useStore.ts`) | Tekil global state (harita modları, oyun durumları, kullanıcı istatistikleri, aktif katmanlar) |
| **Kalıcı Depolama (Lokal)** | LocalStorage (`kpss3d_user_stats`) | Çevrimdışı ilerleme, yerel rozetler, çözülen sorular ve oyun istatistikleri |
| **Bulut Veritabanı & Auth** | Firebase Firestore + Anonymous/Google Auth | Global liderlik tablosu, rumuz yönetimi, 1v1 gerçek zamanlı düello odaları |
| **Yapay Zeka (AI)** | `@google/genai` (Gemini 2.5/3.5 Flash) | KPSS Coğrafya Öğretmeni: soru analizi, mazeret/açıklama, akılda kalıcı kodlama üretimi |
| **Tasarım & UI** | Tailwind CSS v4 + Motion (`motion/react`) | Antik atlas teması: koyu mürekkep yeşili zemin, pirinç/altın vurgu, parşömen plakalar, gravür ornamentler |
| **SEO & GEO** | `lib/seo.ts` + App Router metadata | Tek kaynak metadata üreticisi, Schema.org JSON-LD (`@graph`: WebApplication + Organization), `robots.ts`, `sitemap.ts`, AI ajan manifestoları |

---

## 🧩 2. Bileşen Haritası ve Hiyerarşi (Component Tree)

```text
app/
├── layout.tsx              # Kök düzen (Viewport, meta etiketleri, dark bg)
├── page.tsx                # Ana giriş noktası (force-dynamic SSR)
└── api/
    └── gemini/
        ├── explain/route.ts # AI Coğrafya Öğretmeni Soru Açıklama API'si
        └── analyze/route.ts # AI Performans ve Zayıf Konu Analiz API'si

components/
├── HomePageClient.tsx       # Ana istemci orkestratörü (Responsive container)
│   ├── Navbar.tsx           # Üst menü (Mod sekmeleri, Rumuz/XP/Seviye, Profil ve Sıralama)
│   │   ├── AuthUserButton.tsx       # Google Giriş & Rumuz seçimi
│   │   ├── AvatarWithBadgeFrame.tsx # Rozet çerçeveli kullanıcı avatarı
│   │   ├── ProfileEditModal.tsx     # Rumuz ve profil düzenleme modalı
│   │   ├── GlobalLeaderboardModal.tsx # Firestore tabanlı küresel sıralama
│   │   └── FeedbackModal.tsx        # Kullanıcı geri bildirim modalı
│   │
│   ├── MapContainer.tsx     # 3D MapLibre harita motoru (Katman renderları, tıklama, pinleme)
│   │
│   ├── LayerSidebar.tsx     # Sol/Açılır katman seçim çekmecesi (▲ akordeon bölümler, katman satır ikonları)
│   ├── LayerIcons.tsx       # 18 katman tipi için gravür tarzı inline SVG seti + LAYER_ICONS registry
│   ├── AppFrame.tsx         # Atlas çerçevesi: `var(--hf-band)` doku şeritleri, altın hairline, köşe perçinleri, sol alt amblem
│   ├── MapOrnaments.tsx     # Pusula gülü, armiler küre, arazi silüeti, kuzey işareti (inline SVG)
│   ├── LayerHintBanner.tsx  # Katman ipucu ve aktif katman bilgilendirme şeridi
│   ├── FeatureDetailModal.tsx # Haritada tıklanan coğrafi noktanın KPSS detay kartı
│   ├── AITutorDrawer.tsx    # Sağdan açılan yapay zeka KPSS öğretmen sohbet paneli
│   ├── BadgeNotificationToast.tsx # Yeni rozet kazanıldığında beliren kutlama bildirimi
│   ├── RotateScreenBanner.tsx # Mobil cihazlarda yatay kullanım öneri bannerı
│   │
│   └── [Oyunlaştırma & Eğitim Modları]:
│       ├── PinGuessGame.tsx  # Haritada Konum Bulma Oyunu (Tıkla & Tahmin Et, km mesafe puanı)
│       ├── QuizTestGame.tsx  # Çoktan Seçmeli KPSS Test Çözme Modu (Açıklamalı)
│       ├── DuelMode.tsx      # 1v1 Gerçek Zamanlı Çok Oyunculu KPSS Coğrafya Düellosu
│       ├── FlashcardMode.tsx # Hafıza Kartları & Şifreli Kodlamalar Modu
│       └── StatsModal.tsx    # Detaylı oyuncu başarı istatistikleri ve rozet vitrini
```

---

## 🎨 2b. Atlas Teması ve Görsel Varlıklar (`app/globals.css`, `public/assets/theme/`)

Tema **token seviyesinde** uygulanır (`@theme` bloğu), bileşenler tek tek boyanmaz. Görsel varlıklar üçe ayrılır:

| Dosya | Rol | Teknik kural |
|---|---|---|
| `frame-wood.jpg` | Ekran çerçevesi dokusu | 1024², ortalama parlaklık **165**, vinyet ≈ 0. `AppFrame` bunu **300px doğal ölçekte** döşer — `cover` ile dar banda sığdırmak lekeleri dev boyuta çıkarır |
| `parchment.jpg` | Plaka/başlık zemini | Sıcak krem, ortalama `#E5DBC1`, min 137 (siyah çatlak yok). `multiply`/düşük opaklıkla kullanılır |
| `ai-landscape.jpg` | AI paneli arka planı | Üst %30 düz koyu (metin okunurluğu), alt kısımda gravür dağlar; gradyan perde ile örtülür |
| `corner-emblem.png` | Sol alt küre + parşömen amblemi | **Şeffaf boşluk tasarımın parçasıdır** (altından harita görünür) — kırpılmaz |

`.hf-*` primitifleri (`hf-plaque`, `hf-parchment`, `hf-nav`, `hf-serif`, `hf-label`, `hf-input`, `hf-btn-brass`, `hf-double-rule`, `hf-scroll`) tüm bileşenlerin ortak yüzey/tipografi dili. Yeni bir panel eklerken ham renk yerine bunlar kullanılır.

> **Doku ölçek kuralı (ölçülmüş hata):** bir dokuyu dar bir banda `background-size: cover` ile sığdırmak leke/kontrast ölçeğini bozar. Doku her zaman kendi piksel ölçeğinde döşenir (`300px`, `520px` gibi), bant yalnızca kırpar.

### Menü / sekme rayı düzeni — taşma kuralı

Sekme, çip ve filtre raylarında **iki seçenek** vardır; üçüncüsü yoktur:

| Durum | Davranış | Ne zaman |
|---|---|---|
| Etiketler sığıyor | `flex-wrap` | Ezber kategorileri, rozet filtreleri, profil kademeleri, Hata Defteri, düello mod sekmeleri |
| Etiketler sığmıyor | mobilde **kısa etiket** + `flex-1` eşit satır, `sm`/`md` üstünde tam metin | Analiz alt-sekmeleri, sıralama ana sekmeleri, düello alt sekmeleri |

**Yatay kaydırıcı (`overflow-x-auto`) sekme rayı olarak kullanılmaz.** Ölçüldü: 5 çipli analiz rayı 390px'te 308px, 4 çipli sıralama rayı 236px taşıyordu ve son çip erişilemiyordu — kaydırıcı olduğunu gösteren hiçbir görsel ipucu yoktu.

Satır içi kural: her çocuk ya `min-w-0` (kısalabilir, `truncate`/`line-clamp` hakkı var) ya da `shrink-0` (asla sıkışmaz). Yüksekliği değişen butonlar komşularının taban çizgisini kaydırır — kontrol satırları `h-9` gibi sabit yükseklik kullanır.

### Çerçeve kalınlığı — `--hf-band`

Çerçeve bandı tek bir CSS değişkeninde yaşar (`app/globals.css` `:root`):

| Ekran | `--hf-band` | Gerekçe |
|---|---|---|
| `< 640px` | **6px** | 390px'lik ekranda 12px bant + iki 36px omurga haritanın %27'sini yiyordu |
| `≥ 640px` | **12px** | Monte edilmiş plaka hissi; daha ince olunca doku okunmuyor |

Üç yer aynı değişkeni okur, bu yüzden bant ile içerik arasında boşluk kayması olmaz:

1. `AppFrame` dört doku şeridinin kalınlığı (`height`/`width`)
2. `AppFrame` iç hairline'ın `inset` değeri
3. `HomePageClient` dış `padding`

Değiştirirken `AppFrame`'deki sabit değil **yalnızca** `--hf-band` güncellenir.

> **Köşe sahipliği kuralı:** sol alt köşe **tamamen** `corner-emblem.png`'e aittir. Bu yüzden `maplibregl.ScaleControl` **hiç kaydedilmez** — "200 km" etiketi küreyle yer kavgasına giriyordu ve kullanıcı istemedi. Amblem `translate-y-[9%]` (mobil) / `[8%]` (lg) ile yalnızca hafifçe alt kenardan taşar; daha fazla itmek kürenin ayağını çerçevenin altına gömüyor (ölçülmüş: %16'da ayak kayboluyordu). Yeni bir sol alt kontrol eklenirse amblemle çakışma test edilmelidir.

> **Kompakt kabuk kuralı:** mobilde sidebar omurgaları çerçeveye **sıfır boşlukla** yapışır (`bottom/left/top: 0`, `rounded-r-xl`), dış boşluk yalnız `sm` üstünde geri gelir. Mobilde katman omurgası 24px, AI şeridi 20px — her piksel haritanın. `main` 390×844'te 378×749.

> **Hover bölgesi kuralı:** sol kenardan sidebar açan tetik alanı `fixed` olmak **zorunda**. `main` `overflow-hidden` olduğu için `absolute` bir tetik alanı kırpılır ve hiç pointer olayı almaz (ölçülmüş hata — hover "çalışmıyor" sanıldı).

> **Navbar genişlik bütçesi:** masaüstünde yedi ayrı unsur (`brandMark` + 6 sekme + ayraçlar + arama + 5 buton) 1024px'e sığmıyordu; 1280px'te **201px**, 1440px'te 41px taşma ölçüldü. Kural: arama kutusu `sm:w-28 / xl:w-36 / 2xl:w-44`, "Sıralama" ve küre süslemesi `xl`, sekme ayraçları + "Tam Ekran" + "AI Asistan" yazıları `2xl`. Yeni bir buton eklemeden önce 1280px'te ölçülür.

---

### İlk giriş tanıtım turu — `OnboardingTour`

`components/ui/OnboardingTour.tsx`, kabuğa `HomePageClient` içinde mount edilir. Dört adım: hoş geldin → harita kullanımı → oyun modları → rozet/kademe ilişkisi.

| Kural | Uygulama |
|---|---|
| Yalnız ilk giriş | `kpss3d_onboarding_v1` bayrağı; varsa tur açılmaz |
| Eski oyuncuya gösterilmez | `hasProgress()` puan / soru / pin / düello zaferi / fazladan rozet arar; bulursa bayrağı yazıp susar |
| Zorunlu değil | `Atla`, X, Esc, arka plan tıklaması — hepsi kapatır |
| Tekrar izlenebilir | `window.dispatchEvent(new CustomEvent('kpss3d:open-onboarding'))`; Navbar pusula düğmesi bunu yapar |

> **Bayrak kuralı:** `hasProgress()` yalnızca `kpss3d_user_stats` içindeki **oyun** alanlarına bakar. `avatarIcon`/`equippedTitle` varsayılan olduğu için ilk açılışta da yazılır — bunları "eski kullanıcı" saymak turu tüm yeni kullanıcılardan gizler (bu tuzak ölçüldü).

### Giyilebilir katmanlar — üç aile, beş kademe, tek sembol dili

Profilde dört ayrı şey giyilir ve **karıştırılmamaları** gerekir. Ayrımı renk değil **silüet** yapar; renk yalnızca kademeyi söyler. Kaynak: `components/ui/wearables/`.

| Katman | Ne işe yarar | Aile silüeti (`WearableEmblem family=`) | Veri |
|---|---|---|---|
| **Avatar ikonu** | Yalnız görünüm. Puan/rozet vermez | **Halka** — avatarın kendisi çember içinde | `AVATAR_ICONS` + `AVATAR_GLYPHS` |
| **Avatar efekti** | Aura; avatarın dış hattını boyar | (ayrı çizim, `AVATAR_THEMES`) | `AVATAR_THEMES` |
| **Resmi ünvan** | Kimlik/saygınlık. Aynı anda tek ünvan | **Plaka/banner** — yatay şerit | `ALL_TITLES` + `TITLE_GLYPHS` |
| **Başarı rozeti** | Kanıt/koleksiyon. Kademeyi bunlar açar | **Madalyon** — dikey, madalya gövdesi | `ALL_BADGES` + `BADGE_GLYPHS` |

Kademe geometrisi (`48×48` plaka, `<WearableEmblem tier={1..5}>`):

| Kademe | Rozet (madalyon) | Ünvan (plaka) | Avatar (halka) |
|---|---|---|---|
| 1 Bronz | yuvarlak + 4 köşe noktası | düz plaka + 4 perçin | halka + 4 köşe noktası |
| 2 Gümüş | kalkan | kırlangıç kuyruğu | çift halka |
| 3 Altın | 8 köşe yıldız | kırlangıç kuyruğu + kalın üst şerit | ışınlı halka (8 ışın) |
| 4 Elmas | **altıgen kesim** (soğuk, yörünge yok) | altıgen kesim | **sekizgen** (köşe kırıklı) |
| 5 Kozmik | **12 köşe patlama + 2 yörünge elipsi** | şerit + yörünge elipsi | kesikli halka + 2 yörünge elipsi |

> **4 → 5 kuralı (ürün kararı):** beşinci kademe, dördüncünün süslenmiş hâli **değildir**. Geometri değişir (altıgen → patlama), renk değişir (cyan → fuchsia/cyan çift ton), ve yalnızca 5. kademede **yörünge elipsi** eklenir. 24px'te bile ayırt edilebilir olması şarttır; bu yüzden 4. kademeye yörünge/dash eklenmez.

**Glif katmanı ayrı tutulur.** `lib/data/wearableGlyphs.ts` yalnızca `id → glyph` eşlemesidir; `badgesData.ts` oyun dengesi (eşikler, tracker anahtarları, isimler) olarak kalır. Sanat yönü değişince oyun dengesi dosyasına dokunulmaz. Emoji `icon` alanı **geriye dönük uyumluluk** için durur.

| Dosya | Sorumluluk |
|---|---|
| `components/ui/wearables/glyphs.tsx` | ~120 içerik glifi, `24×24` ızgara, `{ s: stroke[], f: fill[] }` |
| `components/ui/wearables/WearableEmblem.tsx` | Aile çerçeveleri, kademe paleti, `TierMark`, `glyphFromEmoji` |
| `lib/data/wearableGlyphs.ts` | `AVATAR/TITLE/BADGE_GLYPHS`, `TIER_LABELS`, `g:` token yardımcıları |
| `components/ui/ProfileEditModal.tsx` | Seçim arayüzü: lejant + kademe merdiveni + `SectionHeader` |
| `components/ui/AvatarWithBadgeFrame.tsx` | Avatar halkası, ünvan pin madalyonu, sıralama/rekor madalyaları |

**Ölçek kuralı (ölçülmüş hata):** glif 24×24, plaka 48×48. Glifi `scale(0.8–0.9)` ile küçültmek onu okunamaz yapıyordu; güncel dönüşüm `1.4–1.55`. Yeni glif eklerken plakanın **iç %60'ına** sığdır — çerçeve çizgisine değen glif 24px'te lekeye dönüşür.

**Avatar token migration:** `avatarIcon` alanı iki biçim taşır. Yeni kayıtlar `g:<glyph>` yazar; eski `localStorage` kayıtları ham emojidir. Okuma sırası: `g:` token → `AVATAR_ICONS` emoji eşleşmesi → `glyphFromEmoji` → tek harf fallback. Bu zincir kırılırsa eski kullanıcıların avatarları boş kalır — `AvatarWithBadgeFrame` içindeki sıra korunmalıdır.

**Aile içi tekillik:** bir ailede aynı glif iki kez kullanılmaz (`AVATAR_GLYPHS` 64/64, `TITLE_GLYPHS` 29/29, `BADGE_GLYPHS` 36/36 tekil). Aileler arası tekrar serbesttir (ör. `crown` hem ünvanda hem rozette), çünkü silüet farklıdır.

## 🌐 3. 3D Harita Motoru Mimarisi (`MapContainer.tsx`)

1. **Projeksiyon & Koordinatlar**:
   - Türkiye merkezli: `center: [35.2433, 38.9637]`, `zoom: 5.8`, `pitch: 42°` (3D kabartma derinliği), `bearing: 0`.
2. **Altlık Harita (Basemap Tiles)**:
   - CARTO Dark Matter / Positron raster tile servisleri veya OpenStreetMap raster tiles.
3. **GeoJSON Katman Kaynakları**:
   - `turkey-provinces.json`: 81 ilin sınır poligonları.
   - `turkeyData.ts`: 4800+ satırlık nokta/veri seti (Dağlar, Akarsular, Göller, Platolar, Ovalar, Sınır Kapıları, Geçitler, Madenler, Karstik Şekiller, Kıyı Tipleri, Antik Kentler, Mağaralar).
4. **Harita İçi Etkileşimler**:
   - Tıklama olayları aktif moda göre yönlenir:
     - `explore` modunda: Tıklanan özelliğin `FeatureDetailModal`'ı açılır.
     - `pin_game` modunda: Tıklanan koordinat tahmin noktası olarak işaretlenir, gerçek nokta ile mesafe (Haversine formülü) hesaplanır.
     - `duel` modunda: Düello pinleme turu oynanıyorsa Firestore üzerinden eşleşmeye yanıt gönderilir.

---

## ⚡ 4. Global State Mimarisi (`useStore.ts`)

Zustand üzerinde yönetilen ana durum dilimleri (State Slices):

1. **Harita Durumu (`MapState`)**:
   - `activeLayers`: Aktif olan coğrafi katman filtreleri (`mountain`, `lake`, `river`, `mine`, vb.).
   - `selectedFeature`: Tıklanan coğrafi varlığın tam KPSS veri objesi (`GeoFeature`).
   - `mapViewport`: `center`, `zoom`, `pitch`, `bearing`.
2. **Kullanıcı & Profil Durumu (`UserState`)**:
   - `userId`, `rumuz`, `avatarUrl`, `isAuth`, `xp`, `level`, `stats` (doğru/yanlış, oynanan oyunlar, kazanılan düellolar).
   - `badges`: Açılan KPSS başarı rozetleri listesi (`badgesData.ts`).
3. **Oyun Modları Durumu (`GamePlayState`)**:
   - `activeTab`: `'explore' | 'pin_game' | 'quiz_test' | 'duel' | 'flashcards' | 'stats'`.
   - `pinGame`: Aktif soru, hedef konum, oyuncunun pini, skor, süre, canlar.
   - `quizState`: Mevcut soru indeksi, seçilen şık, süre, test sonucu, filtreli soru listesi.
4. **UI & Menü Durumu (`UIState`)**:
   - `isSidebarOpen`, `isAiDrawerOpen`, `isProfileModalOpen`, `isLeaderboardOpen`, `isStatsOpen`.

---

## ☁️ 5. Firebase & Firestore Veri Şeması

### Koleksiyonlar:

1. **`rumuzlar/{docId}`**:
   - Benzersiz kullanıcı adları (case-insensitive doğrulama ile çakışma engellenir).
   - Alanlar: `rumuz`, `userId`, `normalizedRumuz`, `createdAt`, `updatedAt`, `xp`, `level`, `avatarUrl`.
2. **`user_stats/{userId}`**:
   - Kullanıcı başarı karnesi: `xp`, `level`, `duelsWon`, `duelsLost`, `pinScoreBest`, `quizCorrect`, `quizTotal`, `badgesUnlocked`.
3. **`duel_matchmaking/{userId}`**:
   - Bekleme kuyruğundaki oyuncular. Eşleşme sağlandığında ortak `duelId` atanır ve oda oluşturulur.
4. **`duels/{duelId}`**:
   - 1v1 gerçek zamanlı düello oturumu:
     - `player1`, `player2`: id, rumuz, skor, anlık soru yanıtı.
     - `questions`: 5 soruluk rastgele KPSS coğrafya soru paketi.
     - `status`: `'waiting' | 'ready' | 'active' | 'finished' | 'abandoned'`.
     - `currentQuestionIndex`, `turnStartTime`, `winnerId`.

---

## 🤖 6. Yapay Zeka (Gemini) Mimarisi

- **Model**: `gemini-2.5-flash` (veya `gemini-3.5-flash`).
- **Endpoint'ler**:
  - `/app/api/gemini/explain`: Kullanıcının takıldığı soru veya coğrafi konuyu ÖSYM/KPSS soru tarzında pedagojik olarak açıklar, şifreli hafıza teknikleri (akrostiş, tekerleme) üretir.
  - `/app/api/gemini/analyze`: Kullanıcının çözdüğü test ve pinleme sonuçlarını inceleyerek zayıf olduğu coğrafi bölgeleri/konuları tespit eder ve kişiselleştirilmiş ders çalışma planı çıkarır.
- **Güvenlik**: `GEMINI_API_KEY` kesinlikle sunucu tarafında tutulur, istemciye sızdırılmaz.

---

## 🔒 7. Kodlama Standartları ve İki AI İşbirliği Kuralları

1. Yeni bir bileşen veya modül eklendiğinde `useStore.ts`'deki mevcut tipler bozulmamalıdır.
2. Harita performansını korumak için MapLibre nesnesi gereksiz yere baştan oluşturulmamalı (memoize & ref kullanımı).
3. Firebase ve veri değişiklikleri öncesinde `firestore.rules` güvenlik kuralları güncellenmelidir.
4. Her geliştirme adımı `WORK_LOG.md` ve `ROADMAP.md` dosyalarına işlenmelidir.
