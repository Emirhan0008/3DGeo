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
| **Tasarım & UI** | Tailwind CSS v4 + Motion (`motion/react`) | Responsive karanlık tema (slate-950), animasyonlar, Lucide React ikonları |

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
│   ├── LayerSidebar.tsx     # Sol/Açılır katman seçim çekmecesi (Dağlar, Göller, Akarsular, Ovalar vb.)
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
