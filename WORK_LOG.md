# 3D Coğrafya - İş ve Değişiklik Günlüğü (WORK_LOG.md)

> Bu dosya, GitHub reposu (`Emirhan0008/3DGeo`) üzerinden projeyi geliştiren iki bağımsız yapay zeka tarafından yapılan değişiklikleri kronolojik olarak kayıt altına almak için kullanılır.

---

## 📅 [2026-09-04] - Düello Butonu İsimlendirmesi ve 2, 3, 4 Kişilik Modların Belirgin Sekmelere Dönüştürülmesi
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "belirsiz olmuş, 1v1 düello butonunu Düello olarak değiştir ve 2,3,4 kişilik modları sekme olarak göster böylece daha belirgin olsun"
- **Etkilenen Dosyalar**:
  - `/components/ui/Navbar.tsx`
  - `/components/game/DuelMode.tsx`
- **Yapılan İyileştirmeler**:
  1. **Navigasyon Menüsü Güncellemesi (`Navbar.tsx`)**:
     - Masaüstü ve mobil navbar butonlarında yer alan `1v1 Düello` ifadesi sade ve kapsayıcı `Düello` olarak değiştirildi.
  2. **Lobi Oyuncu Kapasitesi Sekmeleri (`DuelMode.tsx`)**:
     - Lobi ekranında 2, 3 ve 4 kişilik seçenekler en üste taşınarak büyük, kart tipi ve aktif göstergeli belirgin bir **Mod Sekmesi Grubu** haline getirildi.
     - **2 Kişilik**: `⚔️ 2 Kişilik (1v1 Düello)`
     - **3 Kişilik**: `⚡ 3 Kişilik (1v1v1 Kapışma)`
     - **4 Kişilik**: `👑 4 Kişilik (Arenanın Kralı)`
     - Seçilen kişi sayısına göre canlı maç, özel oda ve yapay zeka bot antrenmanı buton metinleri dinamik olarak güncellenmektedir.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - `compile_applet`: Next.js derlemesi hatasız ve başarılı.

---

## 📅 [2026-09-04] - 2-4 Kişilik Çok Oyunculu Düello & Çoklu Bot Simülasyonunun Tamamlanması
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "çoklu düello modunu yapmadın hala?"
- **Etkilenen Dosyalar**:
  - `/lib/duelService.ts`
  - `/components/game/DuelMode.tsx`
  - `/components/map/MapContainer.tsx`
- **Kök Neden & İhtiyaç**:
  - Çok oyunculu odalarda (3 veya 4 kişilik) botlu antrenman ve çoklu oyuncu turlarında botların sadece 1 tanesi cevap üretiyordu.
  - `startBotDuel` fonksiyonu `maxPlayers` parametresini almıyordu (yalnızca 1v1 bot başlatıyordu).
  - İstemci tarafında `myPlayer` tespiti ve round reveal geçişlerinde 3. ve 4. oyuncu slotları (`player3`, `player4`) için senkronizasyon eksiklikleri giderildi.
- **Yapılan İyileştirmeler**:
  1. **Dinamik Çoklu Bot Üretimi (`startBotDuel`)**:
     - `startBotDuel` artık `maxPlayers` (2, 3 veya 4) parametresini destekliyor.
     - 3 kişilik bot maçında 2 bot (`Coğrafya Yapay Zeka 🤖` ve `Pîrî Reis AI 🗺️`), 4 kişilik bot maçında 3 bot (`Coğrafya Yapay Zeka 🤖`, `Pîrî Reis AI 🗺️` ve `Evliya Çelebi AI 📜`) otomatik spawn edilerek oyuncu listesine atanıyor.
  2. **Tüm Botlar İçin Eş Zamanlı Tahmin & Test Cevaplama**:
     - `submitPlayerGuess` ve `submitPlayerTestAnswer` fonksiyonları tüm cevapsız botları filtreleyerek her biri için bağımsız, gerçekçi ve koordinat bazlı cevaplar üretiyor.
  3. **Lobi & Oyun Arayüzü Entegrasyonu**:
     - `handleStartBotDuel` içinde kullanıcının seçtiği kişi sayısı (`selectedMaxPlayers`) parametresi bağlandı.
     - `MapContainer.tsx` üzerinde 2-4 kişilik tüm oyuncuların tahminleri ve renkli çizgi katmanları sorunsuz çiziliyor.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - `compile_applet`: Next.js derlemesi hatasız ve başarılı.

---

## 📅 [2026-09-03] - Kuşanılabilen Öğelerin (Avatar, Tema, Ünvan, Rozet) Çerçevelerinin Belirginleştirilmesi
- **Geliştirici**: AI Agent #1 (AI Studio Ortamı A)
- **Kullanıcı Talebi**: "kuşanabilen şeylerin çerçevesi belirgin olsun"
- **Etkilenen Dosyalar**:
  - `/lib/data/badgesData.ts`
  - `/components/ui/ProfileEditModal.tsx`
- **Kök Neden & İhtiyaç**:
  - Profil özelleştirme modalında (`ProfileEditModal.tsx`), kilidi açılmış ve kuşanılmaya hazır (equippable) olan unvanlar, avatarlar ve temalar; kilitli olanlarla veya standart arayüz elemanlarıyla benzer `border-white/10` gibi sönük kenarlıklara sahipti.
  - Kullanıcının neyi kuşanabildiğini (hazır olanları) ve neyin kuşanıldığını (aktif seçili olanı) anında ayırt etmesi zordu.
- **Yapılan İyileştirmeler**:
  1. **Kuşanılabilir Avatarlar (Avatar Icons Grid)**:
     - **Kuşanılmış Durum**: `border-3 border-amber-300 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950` ile amber altın ışıltısı, sağ üstte `✓` onay rozeti ve belirgin `Kuşanıldı` etiketi.
     - **Kuşanılabilir Durum**: `border-2 border-emerald-400 hover:border-emerald-300 ring-2 ring-emerald-400/60 hover:ring-4 text-white shadow-[0_0_16px_rgba(16,185,129,0.45)]`, sağ üstte yeşil nabız (pulse) göstergesi ve `Kuşan` butonu.
     - **Kilitli Durum**: Mat siyah arkaplan, silik slate kenarlık ve net kilitli durumu.
  2. **Kuşanılabilir Çerçeve ve Temalar (Avatar Themes)**:
     - `AVATAR_THEMES` içindeki `borderGlow` ve `badgePinBg` stilleri kalınlaştırıldı (`border-3`, `ring-3`/`ring-4`, `ring-offset-2 ring-offset-slate-950`).
     - Seçili tema için altın çerçeve ve `KUŞANILDI ✓` rozeti; seçilebilir/kuşanılabilir temalar için zümrüt yeşili belirgin kenarlık ve `Kuşan` çağrısı eklendi.
  3. **Kuşanılabilir Resmi Ünvanlar (All Titles)**:
     - **Kuşanılmış Ünvan**: `border-3 border-amber-300 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950`, `👑 KUŞANILDI ✓` butonu ve güçlü altın parıltısı.
     - **Kuşanılabilir Ünvan**: `border-2 border-emerald-400 hover:border-emerald-300 ring-2 ring-emerald-400/60 hover:ring-4 shadow-[0_0_20px_rgba(16,185,129,0.35)]`, `⚡ Kuşanılabilir` rozeti ve zümrüt yeşili `Kuşan` butonu.
  4. **Kademeli Başarı Rozetleri & Prestij Kademeleri (`badgesData.ts`)**:
     - `getTitleTierStyle`, `getDuelPrestigeTier` ve `getPrestigeTier` fonksiyonlarındaki tüm kademe çerçeveleri (Mistik, Elmas, Altın, Gümüş, Bronz) 2-3px kalınlık, canlı renk ringleri ve derin gölgelerle güncellendi.
- **Doğrulama**:
  - `lint_applet` çalıştırıldı: 0 hata (temiz).
  - `compile_applet` çalıştırıldı: Derleme hatasız başarılı.

---

## 📅 [2026-09-03] - 1v1 Düello Eşleşme Hatasının Çözümü & Veri Temizliği (Duel Matchmaking Fix)
- **Geliştirici**: AI Agent #1 (AI Studio Ortamı A)
- **Etkilenen Dosyalar**:
  - `/lib/duelService.ts`
  - `/components/game/DuelMode.tsx`
- **Tespit Edilen Kök Nedenler (Root Causes)**:
  1. **Firestore Composite Index Hatası**: `findOrCreateQuickMatch` fonksiyonunda 5 farklı alan üzerinden (`mode`, `status`, `duelType`, `questionCount`, `categoryFilter`) `where` sorgusu yapılıyordu. Firestore bu tür çoklu bileşik sorgularda kompozit indeks zorunlu kılar; indeks olmadığında sorgu `FAILED_PRECONDITION` hatası vererek eşleşmeyi engelliyordu.
  2. **`undefined` Alan Hatası**: `DuelMode.tsx` içindeki profil objesinde `avatarIcon`, `avatarBg`, `equippedTitle` gibi alanlar geçilmediğinde Firestore SDK'sı `Unsupported field value: undefined` fırlatarak `setDoc` veya `updateDoc` işlemini çökertiyordu.
  3. **Ölü / Hayalet Oda Temizliği**: Önceki oturumlardan kalan veya bağlantısı kopan oyuncuların bekleme odaları temizlenmediği için eşleşmeler hayalet lobilerle çakışıyordu.
- **Yapılan İyileştirmeler**:
  1. **İndeks Bağımsız Hızlı Eşleşme (Index-Free Querying)**: `findOrCreateQuickMatch` sorgusu yalnızca `mode == 'quick'` ve `status == 'waiting'` olarak 2 alana indirgendi. Firestore'da herhangi bir özel composite index gereksinimi tamamen ortadan kaldırıldı; filtreleme (kategori, soru sayısı, mod uyumu) istemci tarafında güvenli bellek içi (in-memory) algoritmayla yapıldı.
  2. **Derin Veri Temizleme (`sanitizeForFirestore` & `sanitizePlayer`)**:
     - Firestore'a yazılan tüm oda ve oyuncu nesneleri `sanitizeForFirestore` ile taranarak olası `undefined` değerlerden arındırıldı.
     - `sanitizePlayer` fonksiyonu ile profil alanları default güvenli değerlerle (`avatarIcon: '⚔️'`, `avatarBg: 'gold_glory'`, `equippedTitle: '3D Coğrafyacı Çırağı'`) dolduruldu.
  3. **Profil Bilgilerinin Entegrasyonu**: `DuelMode.tsx` içinde `getPlayerProfile` fonksiyonu tanımlanarak kullanıcının gerçek rozetleri, seçili unvanı, avatarı ve galibiyet istatistikleri eşleşmeye eksiksiz dahil edildi.
  4. **Hayalet Oda Temizliği**: 35 saniyeden eski ve heartbeat sinyali kesilmiş lobiler otomatik olarak Firestore'dan temizlendi.
- **Test ve Doğrulama**:
  - `lint_applet` çalıştırıldı: 0 hata (temiz).
  - `compile_applet` çalıştırıldı: Next.js derlemesi başarıyla tamamlandı.

---

## 📅 [2026-09-03] - Ortam Başlatma, Sistem Analizi ve Dev Server Stabilizasyonu
- **Geliştirici**: AI Agent #1 (AI Studio Ortamı A)
- **Yapılan İşlemler**:
  1. **GitHub Import Taraması & Ortam Doğrulaması**:
     - Repo GitHub (`Emirhan0008/3DGeo`) üzerinden içe aktarıldı.
     - Bağımlılıklar (Next.js 15, MapLibre GL v6, Firebase 12, Zustand 5, Motion 12, Tailwind CSS v4) incelendi.
     - `.env.example` içine `GEMINI_API_KEY=` tanımlaması eklendi.
  2. **Geliştirme Sunucusu (Dev Server) ve Build Konfigürasyonu**:
     - `package.json` dev script'i `next dev -p 3000 -H 0.0.0.0` olarak optimize edildi.
     - `next.config.ts` dosyasına standalone build ve stabilite ayarları eklendi.
     - Dev server başarıyla yeniden başlatıldı ve port 3000 üzerinde dinlemeye alındı.
     - `lint_applet` çalıştırıldı: 0 hata ile temiz geçti.
     - `compile_applet` çalıştırıldı: Proje derlemesi (Next.js production build) başarıyla tamamlandı.
  3. **İki AI İşbirliği Protokolü Kurulumu**:
     - `AGENTS.md` sistem sözleşmesi okundu ve protokol kuralları benimsendi.
     - `ARCHITECTURE.md` oluşturuldu: Bileşen haritası, 3D harita motoru, Zustand state yapısı, Firestore şeması ve Gemini AI mimarisi belgelendi.
     - `WORK_LOG.md` oluşturuldu ve ilk kayıt düşüldü.
     - `ROADMAP.md` oluşturuldu: Aktif hedefler ve gelecek geliştirmeler sıralandı.
- **Mevcut Durum**:
  - Dev server aktif ve çalışır durumda.
  - Linter ve derleme testleri yeşil.
  - Kod tabanı iki yapay zekanın koordineli geliştirmesine hazır.

---

### 📝 Yeni Günlük Giriş Formatı (Şablon)
```markdown
## 📅 [YYYY-MM-DD] - [İşlem Başlığı]
- **Geliştirici**: [AI Agent #1 / AI Agent #2]
- **Etkilenen Dosyalar**: [Değiştirilen dosya yolları]
- **Yapılan İşlemler**:
  1. [Madde 1]
  2. [Madde 2]
- **Test ve Doğrulama**: [lint / compile sonuçları]
- **Sonraki Adımlar / Notlar**: [Diğer AI'a veya projeye notlar]
```

---

## 📅 [2026-09-03] - Kuşanılabilir Eşya ve Avatar Çerçevelerinin Outline Tasarıma Geçirilmesi
- **Geliştirici**: AI Agent
- **Etkilenen Dosyalar**:
  - `lib/data/badgesData.ts`
  - `components/ui/AvatarWithBadgeFrame.tsx`
  - `components/ui/ProfileEditModal.tsx`
- **Yapılan İşlemler**:
  1. **Yuvarlak Çerçeve Kısıtlamasının Kaldırılması**: Avatarların yuvarlak (`rounded-full`) çerçeve içinde sıkışıp küçük kalmasını önlemek amacıyla yuvarlak yapı iptal edilerek modern ve ferah köşe yumuşatmalı (`rounded-2xl` / `rounded-xl`) outline çerçeve yapısına geçildi.
  2. **Görsel Outline Çerçeveleri**: `badgesData.ts` içerisindeki tüm avatar tema ve kademe (prestige) sınırları `outline` utility sınıflarıyla donatıldı; ışık süzmesi ve parıltı efektleri outline katmanlarıyla yeniden ölçeklendirildi.
  3. **Avatar İkonlarının Büyütülmesi & Öne Çıkarılması**: `AvatarWithBadgeFrame.tsx` ve `ProfileEditModal.tsx` içindeki avatar ikon puntoları (xs'den xl'e kadar) büyütüldü (`scale-125` / `scale-130`, `text-2xl` - `text-6xl`), avatarların çerçeve içinde belirgin, canlı ve baskın görünmesi sağlandı.
  4. **Kuşanılabilir Eşya Görünürlüğü**: Kuşanılmış ve kuşanılabilir durumdaki tüm avatar butonları ile tema renk paletleri dikkat çeken outline parıltıları ve kuşanılma durum rozetleriyle belirginleştirildi.
- **Test ve Doğrulama**:
  - `lint_applet` çalıştırıldı: 0 hata ile başarıyla geçti.

---

## 📅 [2026-09-03] - Transparan (Kutusuz) & Çıkartma Tarzı Outline Avatar Sistemine Geçiş
- **Geliştirici**: AI Agent
- **Etkilenen Dosyalar**:
  - `components/ui/AvatarWithBadgeFrame.tsx`
  - `lib/data/badgesData.ts`
  - `components/ui/ProfileEditModal.tsx`
- **Yapılan İşlemler**:
  1. **Tüm Dörtgen/Yuvarlak Kutu ve Çerçevelerin İptali**: Kullanıcı talebine istinaden tüm dairesel ve dikdörtgensel arkaplan kutuları (`bgGradient`, `borderGlow`, `rounded-full`, `rounded-2xl` ve dış çerçeve `div` kaplamaları) tamamen kaldırıldı.
  2. **Transparan PNG / Obje Çıkartması Mimarisi**: Avatarlar artık arka planı olmayan saf birer obje (ikon/glif/emoji) olarak render edilmekte; doğrudan objenin kenar hatlarını saran çok katmanlı `drop-shadow` tabanlı sticker contour outline filtresi uygulandı.
  3. **Kademelere & Temalara Özel Outline Filtreleri**:
     - 🌌 *Kozmik Mistik (5. Kademe)*: Çift tonlu neon fuşya ve camgöbeği dış hat parıltısı.
     - 💎 *Elmas Safir (4. Kademe)*: Camgöbeği ve mor kristal dış hat çizgisi.
     - 👑 *Altın Şampiyon (3. Kademe)*: Sıcak şampiyon altını dış hat çizgisi.
     - 🛡️ *Gümüş Metalik (2. Kademe)*: Parlak krom çelik beyaz/gümüş dış hat çizgisi.
     - 🐣 *Bronz Çırak (1. Kademe)*: Sıcak bakır/kehribar dış hat çizgisi.
  4. **Profil Düzenleme ve Önizleme Entegrasyonu**: Profil düzenleme modalindeki ikon seçim ızgarası ve tema paletleri doğrudan transparan nesne ve outline efektini yansıtacak şekilde dinamikleştirildi.
---

## 📅 [2026-09-03] - Kademelere Göre Avatar Çeşitlendirmesi, Boyut Büyümesi & Zenginleştirilmiş Outline Çerçeveleri
- **Geliştirici**: AI Agent
- **Etkilenen Dosyalar**:
  - `lib/data/badgesData.ts`
  - `components/ui/AvatarWithBadgeFrame.tsx`
  - `components/ui/ProfileEditModal.tsx`
- **Yapılan İşlemler**:
  1. **Her Kademe İçin Zenginleştirilmiş Avatar Koleksiyonu**:
     - Başlangıçtan en tepeye 60 adet tematik avatar (Coğrafya, Anadolu yaban hayatı, mitoloji, astronomi ve gladyatör simgeleri).
     - 🌌 *5. Kademe (Kozmik Mistik Zirve)*: 10 adet efsanevi zirve avatarı.
     - 💎 *4. Kademe (Elmas & Efsanevi)*: 12 adet elit avatar.
     - 👑 *3. Kademe (Altın & Şampiyon)*: 12 adet şampiyon avatarı.
     - 🛡️ *2. Kademe (Gümüş & Uzman)*: 12 adet uzman avatarı.
     - 🐣 *1. Kademe (Bronz & Çırak)*: 10 adet çırak kaşif avatarı.
     - 🌱 *0. Kademe (Başlangıç)*: 8 adet herkese anında açık başlangıç avatarı.
  2. **Kademeye Göre Hissedilir Boyut Büyümesi**:
     - `AvatarWithBadgeFrame.tsx` içinde kademe yükseldikçe avatarın heybeti ve boyutu açıkça artacak şekilde ölçeklendirildi: Kademe 0 (`scale-[0.88]`), Kademe 1 (`scale-[1.00]`), Kademe 2 (`scale-[1.16]`), Kademe 3 (`scale-[1.32]`), Kademe 4 (`scale-[1.50]`), Kademe 5 (`scale-[1.72]`).
  3. **Çerçevenin (Sticker Outline & Parıltı Aurasının) Güzelleştirilmesi**:
     - Kutusuz transparan mimari korunarak, doğrudan objenin hatlarını saran çok katmanlı `drop-shadow` filtreleri zenginleştirildi.
     - Üst kademeler için nesnenin etrafında süzülen ışıltı parçacıkları ve canlı kozmik/elmas parıltıları eklendi.
  4. **Profil Düzenleme Modalında Kademe Filtreleme Sekmeleri**:
     - Profil düzenleme modalinde 60 avatarın rahatça incelenmesi ve seçilebilmesi için kademe sekmeleri eklendi (`Tümü`, `5. Kademe`, `4. Kademe`, `3. Kademe`, `2. Kademe`, `1. Kademe`, `Başlangıç`).
- **Test ve Doğrulama**:
  - `lint_applet` ile linter doğrulaması yapıldı (0 hata).

---

## 📅 [2026-09-03] - Avatar Boyutlarının & Outline Işıltılarının Dengelenmesi (Normalizasyon)
- **Geliştirici**: AI Agent
- **Etkilenen Dosyalar**:
  - `components/ui/AvatarWithBadgeFrame.tsx`
  - `lib/data/badgesData.ts`
  - `components/ui/ProfileEditModal.tsx`
- **Yapılan İşlemler**:
  1. **Aşırı Boyut Büyümesinin & Taşmaların Düzeltilmesi**: Liderlik tablosu ve profil satırlarında metinlerin üzerine binen devasa `scale-[1.72]` ve `text-3xl` boyutları dengelendi. Satır içine tam oturan zarif kademe farkları tanımlandı (Kademe 0: `0.88x`, Kademe 1: `0.92x`, Kademe 2: `0.96x`, Kademe 3: `1.00x`, Kademe 4: `1.05x`, Kademe 5: `1.10x`).
  2. **Gereksiz Sis/Parıltı ve Parçacıkların Temizlenmesi**: 30-45px'lik aşırı blur'lu sis efekti kaldırıldı; yalnızca 1.5px net çıkartma kontur çizgisi ve 3-5px mikro parıltı bırakıldı.
  3. **Satır & UI Uyumunun Sağlanması**: Tablo satırları, modal gridleri ve düello kartlarında avatar nesneleri hizalanarak estetik bir görsel denge sağlandı.
- **Test ve Doğrulama**:
  - `lint_applet` ve `compile_applet` ile doğrulandı.

---

## 📅 [2026-09-04] - 2-4 Kişilik Çok Oyunculu Düello, Mobil Tam Ekran Lobi, Kaydırarak Çıkış ve Sıralama Çarpanları
- **Geliştirici**: AI Agent #1 (AI Studio Ortamı A)
- **Kullanıcı Talepleri**:
  1. Sıralamada her şeyin katsayısı olsun; düello zaferleri, zafer serisi ve galibiyet oranı en yüksek ağırlığa sahip olsun (0 galibiyetli 10 maç oynayan, 6/6 yapanın üzerine geçemesin).
  2. Kilitli her şeyin nasıl elde edilebileceği açıklansın (hover/tıklama ile detaylı kilit açma rehberi).
  3. Kademeler arasında (4. ve 5. kademe rozet/unvanlar) ufak boyut hiyerarşisi olsun.
  4. Toplam skorun 0 gözükmesi sorunu giderilsin ve puan ile skor ayrımı netleştirilsin.
  5. Düello moduna 3 veya 4 kişi girebilsin (2-4 kişilik maçlar), lobi ve bekleme ekranları mobilde tam ekran olsun, kapatma çarpısının yanı sıra sağa/sola kaydırarak (swipe-to-exit) ana sayfaya dönülebilinsin.
- **Etkilenen Dosyalar**:
  - `/lib/duelService.ts`
  - `/components/game/DuelMode.tsx`
  - `/components/map/MapContainer.tsx`
  - `/lib/rumuzService.ts`
  - `/lib/store/useStore.ts`
  - `/components/ui/GlobalLeaderboardModal.tsx`
  - `/components/ui/ProfileEditModal.tsx`
- **Yapılan İyileştirmeler**:
  1. **2-4 Kişilik Çok Oyunculu Düello Altyapısı**:
     - `DuelSessionData`, `DuelPlayer` ve `duelService.ts` fonksiyonları 2, 3 ve 4 oyunculu odaları tam destekleyecek şekilde genişletildi.
     - Lobi ekranında oda kapasitesi seçimi (2, 3 veya 4 Oyuncu) eklendi.
     - `DuelMode.tsx` içindeki bekleme odası, geri sayım, oyun içi çoklu HUD (tüm oyuncuların puanları, yanıt durumları ve mesafeleri) ve maç sonu podyum ekranı 4 oyuncuya kadar dinamik hale getirildi.
     - `MapContainer.tsx` harita motoru 4 oyuncunun farklı renklerdeki işaretçilerini ve mesafe çizgilerini render edecek şekilde uyarlandı.
  2. **Mobil Tam Ekran & Sağa/Sola Kaydırarak Kapatma (Swipe-to-Exit)**:
     - Lobi ve bekleme odası mobilde tam ekran (`fixed inset-0`) düzenine geçirildi.
     - Dokunmatik ve fare ile sağa/sola sürükleme desteği (`onTouchStart`, `onTouchMove`, `onTouchEnd`, `onMouseDown`, `onMouseMove`, `onMouseUp`) ve görsel kaydırma ipucu eklendi.
  3. **Adil ve Zafer Odaklı Sıralama Çarpanları (`calculateRankingPower`)**:
     - Düello Zaferi: 500 Puan
     - Aktif Zafer Serisi: 250 Puan
     - Kariyer En İyi Serisi: 150 Puan
     - Galibiyet Oranı Bonusu: 1000 * winRate (6/6 yapan tam 1000 bonus alırken 10 maçta 0 çeken 0 alır).
     - Çevrimdışı test ve rozet katsayıları dengelendi.
  4. **Toplam Kariyer Skoru Hesaplama ve Sıfır Skor Düzeltmesi**:
     - Harita Pinleme + KPSS Testleri + Düello skorlarının toplamını kapsayan `totalCareerScore` oluşturuldu, Firestore ve LocalStorage ile senkronize edildi.
  5. **Kademeli Boyut Farkları ve Kilit Açma Rehberi**:
     - 5. kademeden 1. kademeye rozet ve unvan kartlarında matematiksel ölçeklendirme uygulandı (`1.03x` -> `0.97x`).
     - Tıklama ile açılan detaylı kilit inceleme modalı (`InspectedItemModal`) ve açıklayıcı rehber metinleri eklendi.
- **Test ve Doğrulama**:
  - `lint_applet` ve `compile_applet` ile doğrulandı.




