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

> **Köşe sahipliği kuralı:** sol alt köşeyi `corner-emblem.png` sahiplenir. Bu yüzden MapLibre ölçek çubuğu (`bottom-left`) masaüstünde `left: 9rem`, mobilde `bottom: 4.25rem` ile kaydırılır — aksi halde "200 km" etiketi kürenin altında kalır.

> **Hover bölgesi kuralı:** sol kenardan sidebar açan tetik alanı `fixed` olmak **zorunda**. `main` `overflow-hidden` olduğu için `absolute` bir tetik alanı kırpılır ve hiç pointer olayı almaz (ölçülmüş hata — hover "çalışmıyor" sanıldı).

---

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
