# Multi-Agent Collaboration Protocol & Project Constitution

> **ÖNEMLİ (IMPORTANT)**: Bu proje GitHub (`Emirhan0008/3DGeo`) üzerinden **iki farklı AI Studio ortamında iki farklı yapay zeka** tarafından ortaklaşa yürütülmektedir. Bu dosya (`AGENTS.md`), her iki AI Studio oturumuna sistem tarafından otomatik olarak yüklenir.
> Kod tabanında değişiklik yapmadan veya yeni bir özellik geliştirmeden önce buradaki yönergeleri ve `WORK_LOG.md`, `ARCHITECTURE.md`, `ROADMAP.md` dosyalarını mutlaka kontrol edin.

---

## 📌 1. Proje Kimliği ve Amacı (Project Overview)
- **Proje Adı**: 3D Coğrafya (KPSS 3D Türkiye Coğrafyası Eğitim & Oyunlaştırma Haritası)
- **Teknoloji Yığını**:
  - **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (Strict Mode)
  - **Harita & 3D Motoru**: MapLibre GL v6 (3D Terrain & Kabartma, Raster Basemap Tiles, GeoJSON katmanları)
  - **Stil & Tasarım**: Tailwind CSS v4, Motion (Framer Motion), Lucide React ikonları
  - **State Yönetimi**: Zustand (`/lib/store/useStore.ts`) + LocalStorage önbelleği
  - **Bulut Veritabanı & Gerçek Zamanlı Çok Oyunculu**: Firebase Firestore + Anonymous/Google Auth (`/lib/firebase.ts`, `/lib/rumuzService.ts`, `/lib/duelService.ts`)
  - **Yapay Zeka Asistanı**: `@google/genai` SDK ile Gemini 2.5 Flash / 3.5 Flash tabanlı KPSS Coğrafya Öğretmeni (`/app/api/gemini/explain`, `/app/api/gemini/analyze`)

---

## 🤝 2. İki Yapay Zeka Arasındaki İşbirliği İlkeleri (Rules of Engagement)

1. **İşleri ve Değişiklikleri Markdown'a Kaydetme Zorunluluğu**:
   - Yaptığınız her işlemi `WORK_LOG.md` içine ekleyin.
   - Planladığınız veya üzerinde çalıştığınız özellikleri `ROADMAP.md` içinde güncelleyin.
   - Mimari ve veri yapısı kararlarını `ARCHITECTURE.md` içine işleyin.

2. **Çakışmaları (Merge Conflict) Önleme Kuralı**:
   - Kod tabanındaki modüller bağımsız bileşenlere ayrılmıştır:
     - Harita motoru: `components/map/MapContainer.tsx`
     - Çok oyunculu düello: `components/game/DuelMode.tsx` ve `lib/duelService.ts`
     - Soru bankası ve testler: `components/game/QuizTestGame.tsx` ve `components/game/PinGuessGame.tsx`
     - Profil & Sıralama: `components/ui/GlobalLeaderboardModal.tsx` ve `lib/rumuzService.ts`
     - AI Öğretmen: `components/ai/AITutorDrawer.tsx` ve `app/api/gemini/`
   - Büyük tek parça değişiklikler yerine modüler ve izole geliştirmeler yapın.

3. **Geriye Dönük Uyumluluk ve State Korunumu**:
   - `lib/store/useStore.ts` içindeki `AppState` arayüzünden var olan alanları silmeyin veya tiplerini bozmayın. Yeni özellikler için opsiyonel veya default değerlerle genişletin.
   - `localStorage` anahtarı: `kpss3d_user_stats`. Kullanıcı verisini sıfırlayacak kırıcı şema değişiklikleri yapmayın.

4. **Doğrulama Standartları**:
   - Her geliştirme sonrası `lint_applet` ile kodun linter'dan temiz geçtiğini doğrulayın.
   - TypeScript tiplerini eksiksiz tanımlayın (`any` kullanımından kaçının).

---

## 🧭 3. Referans Doküman Haritası
- `ARCHITECTURE.md`: Detaylı mimari, bileşen haritası, veri modelleri ve Firestore şeması.
- `WORK_LOG.md`: Yapılan işlerin kronolojik kaydı (Hangi AI ne yaptı, neyi düzeltti).
- `ROADMAP.md`: Planlanan özellikler, bekleyen görevler ve geliştirme önerileri.
- `security_spec.md`: Firebase güvenlik kuralları ve test vektörleri.
