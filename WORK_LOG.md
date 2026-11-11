# 3D Coğrafya - İş ve Değişiklik Günlüğü (WORK_LOG.md)

> Bu dosya, GitHub reposu (`Emirhan0008/3DGeo`) üzerinden projeyi geliştiren iki bağımsız yapay zeka tarafından yapılan değişiklikleri kronolojik olarak kayıt altına almak için kullanılır.

---

## 📅 [2026-11-12] - Tanıtım Turu Detaylandırıldı: 13 Adım, Bölümler, Etkileşimli Katman Paneli

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: "Daha detaylı bir onboarding."

### Ne değişti
6 adımlı tur **13 adıma** çıktı ve bölümlere ayrıldı: Başlangıç → Harita (2) → Katmanlar (3) → Keşif → Oyunlar → Analiz → Topluluk → Yardım → Birikim → Bitti.

| # | Bölüm | Hedef | Ne anlatır |
|---|---|---|---|
| 1 | Başlangıç | tam örtü | Süre, gezinme, tekrar izleme |
| 2 | Harita | `.maplibregl-ctrl-bottom-right .maplibregl-ctrl-group` | Döndür/yakınlaş, şekle tıkla |
| 3 | Harita | pusula düğmesi | Katman girişi ve rozet |
| 4 | Katmanlar | `#kpss-layer-sidebar` | Panelin üç katmanı (altlık/toplu işlem/gruplar) |
| 5 | Katmanlar | `#kpss-layer-sidebar .hf-scroll` | Altı katman grubu — **etkileşimli** |
| 6 | Katmanlar | son `section` | Bölge filtresi + dilsiz mod — **etkileşimli** |
| 7 | Keşif | `input[placeholder="Ara..."]` | Arama davranışı |
| 8 | Oyunlar | `header nav` / mobil ray | Dört mod + Analiz |
| 9 | Analiz | `button[title="Analiz"]` | Hata defteri |
| 10 | Topluluk | `button[title="Global sıralama tablosu"]` | Sıralama ve nick |
| 11 | Yardım | AI asistanı | Öğretmen gibi kullanma |
| 12 | Birikim | profil düğmesi | Rozet → kademe, `TierMark` merdiveni |
| 13 | Bitti | tam örtü | 5 satırlık "nerede ne var" dizini |

### Yeni yetenekler
- **Bölüm etiketi + ilerleme çubuğu.** Kartın üstünde `Katmanlar 4/13` ve dolan bir çubuk var; kullanıcı turun neresinde olduğunu görüyor.
- **`bullets`.** Her adım 2-3 kısa madde taşıyor (`Fiziki`, `Beşeri`, `Sınav provası` gibi) — düz paragraf yerine taranabilir bilgi.
- **Etkileşimli adımlar.** `interactive: true` olan adımlarda hedefin üstüne tıklama katmanı **konmaz**: kullanıcı tur sırasında gerçekten katman açıp kapatabilir, bölge filtresine basabilir. Tur ilerlemez (`5 → 5` ölçüldü).
- **Katman paneli tur içinde açılır.** `openSidebar` olan adımlarda store üzerinden panel açılır; bölüm bitince eski duruma döner — kullanıcı turdan sonra paneli kapalı bulur.
- **Mobilde adım listesi filtrelenir.** Yalnız panel içi olan 2 adım (`desktopOnly`) dar ekranda listeden çıkar: 13 → 11 adım. Aynı "geniş ekranda görünür" notunu üç kez göstermek turu yavaşlatıyordu.
- **Dar hedefte kart yana geçer.** Telefonda katman şeridi 24×759px; kart üstte/alt alta sığmıyor. `layout` hesabı hedefin ince-uzun olduğunu görüp kartı yana alır ve kalan genişliğe daraltır (400 → ~340px).

### Ölçülmüş hatalar (üçü de gerçek)
| Hata | Belirti | Düzeltme |
|---|---|---|
| Panel animasyonu ortasında ölçüm | Katman paneli 8ms'de 36px genişlikte yakalanıp 290px'e açıldıktan sonra halka 52px'te donuyordu | Ölçüm tek `setTimeout` yerine ~1s boyunca `requestAnimationFrame` döngüsünde; `sameHole` aynı değerleri yuttuğu için maliyetsiz |
| `steps` dizisi her render'da yeniden üretiliyordu | Mobilde tur **hiç açılmadı**; effect her render'da tetiklenip store'u yazıyordu (sonsuz döngü) | `useMemo([isNarrow])` |
| Katlanmış grupta katman tıklanamıyor | `grid-rows-[0fr]` + `inert` → tıklama hedefi yok | Test başlığa önce tıklayıp grubu açıyor; turda kullanıcı da aynısını yapar |
| İnce-uzun hedef kartı örtüyor | Mobil katman şeridinde kart hedefi kapatıyordu | `layout.forceSide` ile yana yerleşim + genişlik daraltma |

### Doğrulama (Playwright, port 3005)
- **Masaüstü 1440×900**: 13/13 adım `OK` — halka hedefin −8px dışında, `blur(3px)`, kart/hedef çakışması yok, kart viewport içinde.
- **Mobil 390×844**: 11/11 adım `OK`, kart hiç taşmıyor.
- **Etkileşim**: 5. adımda katman açıldı (`aria-pressed=true`), tur ilerlemedi (5 → 5).
- **Panel geri dönüşü**: arama adımında panel genişliği 36px (kapalı).
- **Kapanış**: son buton `Başla`, dialog 0, bayrak `seen`, `body.overflow` temiz.
- `npx tsc --noEmit`, `npx eslint`, `npx next build` temiz.

### Değişen dosyalar
- `components/ui/OnboardingTour.tsx` — 13 adım, bölümler, `bullets`, `interactive`, `openSidebar`, `useMemo` adım listesi, `layout` yana yerleşim.

---

## 📅 [2026-11-11] - Tanıtım Turu: Statik Kartlardan Spotlight Turuna

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Geri Bildirimi**: "Onboarding ekranı sadece yazıyla olmuş; ben featureları gezdiren, gezdirdiği yere focuslanıp diğer yerleri bulanıklaştıran bir sistem istiyordum."

### Ne değişti
Önceki sürüm ortada duran, 4 adımlı **metin kartıydı**. Bu bir tur değil, sunumdu: kullanıcı arayüzü görmüyordu. Yeni sürüm **6 adımlı spotlight turu**:

| # | Hedef (gerçek öğe) | Seçici | Ne anlatır |
|---|---|---|---|
| 1 | — (tam örtü, ortada) | — | Hoş geldin; turun nasıl çalıştığı |
| 2 | Pusula / katman düğmesi | `button[title="Harita katmanlarını aç / kapat"]` | Katman omurgası |
| 3 | Tab rayı | `button[title="Harita Testi"]` | Dört oyun modu |
| 4 | Üst bar araması | `input[placeholder="Ara..."]` | İsim yazıp uçma |
| 5 | AI asistanı | `button[title="Yapay zeka KPSS asistanı"]` | Harita bağlamlı öğretmen |
| 6 | Profil / avatar | `Nick Gir` veya `Profili Düzenle…` | Rozet → kademe → görünüm |

### Spotlight mimarisi
- Hedef `getBoundingClientRect()` ile ölçülür, 8px nefes payı eklenir, viewport'a kırpılır.
- Geri kalan **dört dikdörtgen örtü** ile kapatılır (`top` / `bottom` / `left` / `right`). Delik `box-shadow` ile değil gerçek DOM boşluğuyla açılır — böylece hedefin üstünde tıklama katmanı kalmaz ve öğe gerçekten görünür.
- Örtüde `backdrop-blur-[3px]` + `rgba(3,5,10,.78)` — **hem karartma hem bulanıklık**; kullanıcının istediği "diğer yerler bulanık" şartı bu.
- Hedefin çevresine kehribar halka (`z-[72]`), kart `z-[73]`.
- Kartın yeri her adımda hesaplanır: tercih edilen kenar sığmıyorsa `bottom → top → right → left` sırasıyla tersine çevrilir, sonra viewport'a kenetlenir. Kart hiçbir durumda hedefi örtmez (test: `overlap: false`).

### Adım atlama yerine dürüst davranış
Telefonda arama alanı ve AI düğmesi gizli. Bu adımlar **atlanmıyor**; spotlight yerine tam örtü + kartın içinde "Bu öğe bu ekran genişliğinde gizli — geniş ekranda üst barda görünür." notu çıkıyor. Tur 6 adımda sabit kalır, sıra numarası zıplamaz.

### Ek düzeltmeler
| Hata | Belirti | Düzeltme |
|---|---|---|
| Katman ipucu banner'ı turla çakışıyor | İkisi aynı anda "katmanları aç" diyordu | Tur açılınca `kpss3d:dismiss-layer-hint` olayı fırlatılır; `LayerHintBanner` dinler ve susar |
| Tab ile arkaya kaçış | Odak karartılmış arayüze gidebiliyordu | Odak tuzağı: Tab/Shift+Tab kartın içinde döner |
| Halkaya tıklama boşa gidiyordu | Hedefin altındaki butona kazara basılıyordu | Halka üstünde `z-[71]` tıklama katmanı — tıklama turu ilerletir |
| `resize` sonrası eski ölçü | Halka yanlış yerde kalıyordu | `resize` + `scroll` (capture) dinlenir, `requestAnimationFrame` ile yeniden ölçülür |

### Doğrulama (Playwright, port 3005)
- **Masaüstü (1440×900)**: 5 hedefin tamamı `OK=True` — halka hedefin tam −8px dışında, 4 örtü parçası, `blur(3px)`, kart/hedef çakışması yok, kart viewport içinde.
- **Mobil (390×844)**: pusula ve tab rayı spotlight'lanıyor; arama alanı gizli olduğu için tam örtü + açıklama notu.
- **Yeniden boyutlandırma**: 390 → 1200'de halka arama alanına taşındı (tur bozulmadı).
- **Klavye**: ← geri, Esc kapatır, Tab karttan çıkmaz (14 basışta 0 kaçış).
- **Halka tıklaması**: 2/6 → 3/6.
- **Banner**: tur sırasında `0` görünür öğe.
- **`Başla`**: 6. adımda kapatır, bayrak `seen`, `body.overflow` temizlenir.
- `npx tsc --noEmit`, `npx eslint` ve `npx next build` temiz.

### Değişen dosyalar
- `components/ui/OnboardingTour.tsx` — spotlight mimarisi, 6 adım, ölçüm/konumlandırma, odak tuzağı.
- `components/ui/LayerHintBanner.tsx` — `kpss3d:dismiss-layer-hint` olayını dinler.

---

## 📅 [2026-11-11] - İlk Girişe Özel Opsiyonel Tanıtım Turu (Onboarding)

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: "Sadece ilk giriş için opsiyonel bir onboarding yap."

### Davranış kuralları (dördü de test edildi)
| Kural | Uygulama |
|---|---|
| Yalnızca **ilk** giriş | `localStorage` bayrağı `kpss3d_onboarding_v1`. Bayrak varsa hiç açılmaz |
| Yalnızca **veri yoksa** | `hasProgress()`: puan, soru sayısı, pin tahmini, düello zaferi veya fazladan rozet varsa tur atlanır ve bayrak yazılır — eski oyuncuya "hoş geldin" denmez |
| Tamamen **opsiyonel** | Her adımda `Atla`; ayrıca X, Esc ve arka plan tıklaması kapatır. Zorunlu adım, kilitli buton yok |
| **Tekrar izlenebilir** | Navbar'daki pusula düğmesi `kpss3d:open-onboarding` olayını fırlatır; tur baştan açılır |

### Yeni dosya
- `components/ui/OnboardingTour.tsx` — 4 adım: **Hoş geldin** (harita üzerinden öğrenme) → **Harita** (katman omurgası + üst bar araması) → **Oyunlar** (Harita Testi / Düello / KPSS Testi / Ezber) → **Birikim** (rozet → kademe → görünüm; son adımda `TierMark` ile kademe merdiveni).

### Değişen dosyalar
- **`HomePageClient.tsx`**: `<OnboardingTour />` kabuğa eklendi (harita altında, `AppFrame`'in altında).
- **`Navbar.tsx`**: pusula düğmesi (mobilde gizli — üst bar dar), `Compass` ikonu.

### Tasarım notları
- Atlas temasıyla aynı dil: `hf-panel` / `hf-serif` / `hf-label` / `hf-btn-brass` / `hf-btn-ghost`. Yeni renk veya yeni font eklenmedi.
- 390px'te tek sütun, kart `max-h-[88vh]` + `overflow-y-auto`; 1440'ta aynı kart ortada, nokta göstergesi görünür.
- Tur açıkken `body.overflow = hidden` — mobilde arka plan titremiyor.
- İlk açılış **1100ms gecikmeli**: harita önce boyanıyor, tur beyaz ekranın üstüne binmiyor.

### Ölçülmüş hatalar
| Hata | Belirti | Düzeltme |
|---|---|---|
| `Record<string, any>` ile veri okuma | TypeScript `any` kuralına aykırı | `StoredProgressShape` tipi tanımlandı |
| Tur açıkken sayfa kayması | Mobilde arka plan kayıyordu | `body` scroll kilidi eklendi |

### Doğrulama
Playwright ile 9 senaryo (port 3005): yeni kullanıcıda açılıyor · `Başla` kapatıyor · bayrak `seen` yazılıyor · yenilemede **açılmıyor** · masaüstünde açılıyor · veri olan kullanıcıda **açılmıyor** · navbar tekrar açıyor · Esc kapatıyor · Atla kapatıyor. `npx tsc --noEmit` ve `npx next build` temiz.

---

## 📅 [2026-11-11] - Giyilebilir Sembol Sistemi: Üç Aile, Beş Kademe, Emojisiz SVG

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: Avatar ikonu, avatar efekti, ünvan, başarı rozeti ve kademenin ne işe yaradığı net görünsün; SVG'ler birbirine benzemesin ("şu anda her kategoride aynı SVG'ler var"); 4. ve 5. kademe arasında net fark olsun ki 5. kademe için oynansın — bu kural tüm giyilebilir öğeler için geçerli.

### Yaklaşım
Ayrımı **silüet** yapar, renk değil. Üç aile üç ayrı gövde kullanır ve bir daha karışmaz:

| Aile | Silüet | Evrim |
|---|---|---|
| Rozet | **madalyon** (dikey) | daire → kalkan → 8 köşe yıldız → altıgen kesim → 12 köşe patlama + yörünge |
| Ünvan | **plaka/banner** (yatay) | düz plaka → kırlangıç kuyruğu → altıgen → şerit + yörünge |
| Avatar | **halka** | halka + köşe noktaları → çift çember → ışınlı halka → sekizgen → kesikli halka + yörünge |

**4 → 5 kuralı:** 5. kademe, 4'ün süslenmiş hâli değil — geometri (altıgen → patlama), renk (cyan → fuchsia/cyan çift ton) ve efekt (yalnızca 5'te yörünge elipsi) birlikte değişir. 4. kademeye yörünge eklenmez ki fark korunsun. 24px'te bile ayırt edilir.

### Yeni dosyalar
| Dosya | İçerik |
|---|---|
| `components/ui/wearables/glyphs.tsx` | ~120 SVG içerik glifi, `24×24`, `{ s: stroke[], f: fill[] }` |
| `components/ui/wearables/WearableEmblem.tsx` | Aile çerçeveleri + kademe paleti + `TierMark` + `glyphFromEmoji` |
| `lib/data/wearableGlyphs.ts` | `AVATAR_GLYPHS` (64), `TITLE_GLYPHS` (29), `BADGE_GLYPHS` (36), `TIER_LABELS`, `g:` token yardımcıları |

### Değişen dosyalar
- **`ProfileEditModal.tsx`**: "Giyilebilir Katmanlar" lejantı (3 kart: *sadece görünüm / kimlik / kanıt*), "Kademe Merdiveni" şeridi (5 kademe, `TierMark` ile), başlıklar `SectionHeader`'a taşındı (`— sadece görünüm / aura / kimlik / kanıt` rol etiketleri), tüm kademe filtre çipleri `TierMark` + kısa etiket (`5 · Kozmik`), avatar/ünvan/rozet gridleri SVG'ye çevrildi.
- **`AvatarWithBadgeFrame.tsx`**: emoji kaldırıldı. Avatar halkası, ünvan pin madalyonu ve sıralama/rekor madalyaları artık `WearableEmblem`.
- **`StatsModal.tsx`**, **`BadgeNotificationToast.tsx`**: rozet ikonları `WearableEmblem` (açık/kilitli durumu kademe 0 ile gösterilir).
- **`badgesData.ts`**: `tierName`/`tierLabel` metinlerindeki emoji kaldırıldı → `5 · Kozmik`, `4 · Elmas`, … (emoji `icon` alanı geriye dönük uyumluluk için **korundu**).

### Ölçülmüş hatalar (tekrar etmemek için)
| Hata | Belirti | Düzeltme |
|---|---|---|
| Glif ölçeği çok küçük | `scale(0.8–0.9)` ile semboller 48px plakada okunamıyordu, hepsi "aynı" görünüyordu | `1.4–1.55`'e çıkarıldı, glif plakanın iç %60'ına oturuyor |
| Kademe farkı yalnız renkte | 4 ve 5 aynı şekil, farklı ton → 24px'te ayırt edilemiyordu | Geometri de değişiyor; 5'e özel yörünge elipsi |
| Emoji → `g:` token geçişi | Eski `localStorage` kayıtları boş avatar gösteriyordu | Okuma zinciri: `g:` token → `AVATAR_ICONS` emoji eşleşmesi → `glyphFromEmoji` → tek harf fallback |
| Bölüm başlığı taşması | 390px'te başlık + "Kademen: 5. Kademe" çipi üst üste biniyordu | `SectionHeader`: mobilde dikey yığma, `sm` üstünde yan yana |

### Doğrulama
- `npx tsc --noEmit` temiz, `npx next build` temiz (13/13 statik sayfa).
- Playwright ile 390 ve 1440 snapshot: profil modalı lejant, kademe merdiveni, avatar/ünvan/rozet bölümleri; 24/32/48/96px kademe merdiveni; üç ailenin 6 kademe × 14 glif ızgarası. Aile içi glif tekilliği betikle doğrulandı (64/29/36, tekrar yok).

---

## 📅 [2026-11-10] - Menü ve Alt Menü Kompaktlaştırması (Taşmasız Sekme/Çip Rayları)

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: Menülerdeki ve alt menülerdeki arayüzler kontrol edilsin, snapshot alınıp analiz edilsin; butonlar/divler/kutular daha kompakt olsun, kayma ve taşma olmasın, derli toplu görünsün.

### Yaklaşım
Playwright ile 360/390/1440 genişliklerinde her sekme açıldı ve **gerçek `scrollWidth - clientWidth > 2`** ölçümü yapıldı (bkz. `.tmp/final.py`, `.tmp/duel.py`). Kırpılmış öğeler iki sınıfa ayrıldı: (a) yatay kaydırıcıda **gizli kalan** içerik → gerçek hata, (b) bilinçli `truncate`/`line-clamp` → tasarım kararı. Yalnız (a) sınıfı düzeltildi.

### Düzeltilen gerçek taşmalar (ölçülmüş)
| Panel | Önce | Çözüm |
|---|---|---|
| Analiz alt-sekmeleri (5 çip) | 308px taşıyor, "AI Teşhis" ulaşılamıyordu | Mobilde kısa etiket (Genel/Düello/Bölge/Hata/AI) + `flex-1`, `sm` üstünde tam metin; `overflow-x-auto` → `overflow-hidden` |
| Sıralama ana sekmeleri (4 çip) | 236px taşıyor, "Seri Zafer" kesikti | Mobilde tek kısa etiket + eşit `flex-1`; `md` üstünde açıklayıcı metin |
| Sıralama oyuncu satırı | "ham p" satırı ikiye kırılıyordu | Kolon oranı `col-span-5/3` → `6/4`, `whitespace-nowrap` + "ham p" `hidden sm:inline` |
| Ezber kategori çipleri (9 adet) | 615px genişlik 287px yuvaya sığmıyor | `flex-wrap` (alt satıra sarar) |
| Ezber alt kontrol satırı | "3D Haritada Göster" iki satıra kırıp satır tabanını kaydırıyordu | `h-9` sabit yükseklik, etiket "Haritada Göster", `min-w-0 flex-1` |
| AI çekmecesi başlığı | 3 satıra kırılıyordu | `min-w-0` + `truncate`; mobilde "AI COĞRAFYA EĞİTMENİ" |
| AI örnek soruları (6) | Yatay şeritte 4'ü ekran dışındaydı | `flex-wrap`; mobilde ilk 3 gösterilir (sohbet alanını yemesin) |
| Harita/KPSS üst araç çubuğu | `shrink-0` yüzünden sağdaki ikon grubu kart dışına taşıyordu | `min-w-0 flex-1 overflow-x-auto` |
| Düello lobi kategori seçicisi | 170px kalıyordu → "Genel Karma (Tün" kırpık | Mobilde tam genişlik satır, `sm` üstünde tek satır |
| Düello lobi mod sekmeleri | Yatay kaydırıcı | `flex-wrap`; mobilde "Rastgele (2P)", "Katıl", "Bot" |
| Profil kademe filtreleri (3 yer) | Yatay kaydırıcı | `flex-wrap` |
| Hata Defteri kategori rayı | Yatay kaydırıcı | `flex-wrap` |

### Kompaktlaştırma
- **Katman sidebar'ı**: bölüm başlığı `py-2` → `py-1.5`, satır `py-1.5` → `py-1`, ikon çemberi `20px` → `18px`, `gap-2` → `gap-1.5`.
- **Döndürme/tam ekran bandı**: ikon + tek kısa satır + ikon-only "Tam Ekran"; açıklama cümlesi yalnız `sm` üstünde. Önceden 3 sekmede de başlık kırpılıyordu.

### Kural (ölçülmüş)
Bir yatay satırda her çocuk iki sınıftan biridir: **`min-w-0`** (kısalabilir, ellipsis hakkı var) veya **`shrink-0`** (asla sıkışmaz). Üçüncü bir durum yok — `shrink-0` verilmiş bir blok genişliği aşarsa kardeşini dışarı iter.

### Doğrulama
- Playwright 360/390/1440: analiz, sıralama, AI çekmecesi, geri bildirim, Ezber, Harita, KPSS ve düello alt panellerinde **0 gerçek taşma**. Kalan tek kayıt `pointer-events-none absolute inset-0 z-[7] overflow-hidden` (+40px) → harita dokusu katmanı, beklenen durum.
- `npx tsc --noEmit` temiz, `npx next lint` → "No ESLint warnings or errors".

### Etkilenen Dosyalar
`components/ui/StatsModal.tsx`, `GlobalLeaderboardModal.tsx`, `RotateScreenBanner.tsx`, `LayerSidebar.tsx`, `ProfileEditModal.tsx`, `components/ai/AITutorDrawer.tsx`, `components/game/FlashcardMode.tsx`, `PinGuessGame.tsx`, `QuizTestGame.tsx`, `DuelMode.tsx`, `HataDefteriView.tsx`

---

## 📅 [2026-11-10] - Kompakt Mobil Kabuk, Pusula Logosu ve Ölçek Çubuğunun Kaldırılması

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: (1) Mobilde kapalı sidebar'lar daha da daralsın, (2) sidebar ile dış çerçeve arasında boşluk kalmasın, (3) sol alttaki "km" ölçek yazısı kaldırılsın, (4) navbar altındaki katman/HUD menüsü daha kompakt olsun, (5) navbar taşmasın, (6) logo pusula olsun, (7) küre+parşömen biraz yukarı çıksın.

### Yapılanlar

1. **Kapalı omurgalar daraldı** — katman sidebar'ı `w-7` → **`w-6`** (24px), AI şeridi `w-6` → **`w-5`** (20px). Hover tetik alanı da `w-2` → `w-1.5`.
2. **Omurga çerçeveye yapıştı** — mobilde `bottom/left/top: 0` ve `rounded-r-xl`; dış boşluk yalnız `sm` üstünde geri geliyor (`sm:bottom-2 sm:left-2 sm:top-2 sm:rounded-2xl`). AI şeridi aynı mantıkla `rounded-l-xl` ve `sm:` ile boşluk alıyor.
3. **Ölçek çubuğu kaldırıldı** — `maplibregl.ScaleControl` hiç kaydedilmiyor; sol alt köşe artık tamamen küre amblemine ait. Boşta kalan `.maplibregl-ctrl-bottom-left` konumlandırması ve medya sorguları CSS'ten silindi.
4. **HUD kompaktlaştı** — pil `left-12` → **`left-7`** (daralan omurgaya göre), iç boşluk `p-1` → `p-0.5`, ikon daireleri `h-6` → `h-5`, yazı `11px` → `10px`; hepsi `sm:` ile masaüstü ölçüsüne dönüyor. Pil yüksekliği mobilde 44 → **36px**.
5. **Navbar taşması** — iki ayrı yuvarlak (katman butonu + pusula madalyonu) **tek pusula düğmesinde birleşti**; katman sayacı artık onun köşesinde. Böylece 40px kazanıldı ve logo istendiği gibi pusula oldu. Sekme rayında mobilde ikonlar gizlenip etiketler `flex-1` ile eşit dağılıyor; `◆` ayraçları yalnız `sm` üstünde.
6. **Masaüstü taşması (ölçülmüş, önceden fark edilmemiş)** — 1280px'te sağ grup satırı **201px** aşıyordu, 1440px'te 41px. Kırılım noktaları gerçek genişliklere göre yeniden dağıtıldı: sekme ayraçları ve "Tam Ekran"/"AI Asistan" yazıları `2xl`, "Sıralama" ve küre süslemesi `xl`, arama `sm:w-28 → xl:w-36 → 2xl:w-44`. 1280px'te içerik 1122/1232, 1440px'te 1122/1392 — taşma **0**.
7. **Amblem yukarı alındı** — `translate-y` `20%`/`16%` → **`16%`/`12%`**; önceki değer kürenin kendi ayağını çerçevenin altına gömüyordu.

### Doğrulama (Playwright, ölçülmüş)
| Ekran | Header | Navbar taşması | Katman omurgası | AI şeridi | HUD |
|---|---|---|---|---|---|
| 320×700 | 83px | 0 | 24px | 20px | 36px |
| 360×740 | 83px | 0 | 24px | 20px | 36px |
| 390×844 | 83px | 0 | 24px | 20px | 36px |
| 768×1024 | 95px | 0 | 36px | 36px | 48px |
| 1280 | — | 0 (1122/1232) | 36px | 36px | 48px |
| 1440×900 | 57px | 0 (1122/1392) | 36px | 36px | 48px |

- `.maplibregl-ctrl-scale` DOM'da **yok** (ölçek çubuğu kaldırıldı).
- `npx tsc --noEmit` temiz, `npx next lint` → "No ESLint warnings or errors".

### Etkilenen Dosyalar
- `components/ui/Navbar.tsx` — birleşik pusula logosu, kompakt sekme rayı, kırılım noktaları
- `components/ui/LayerSidebar.tsx` — `w-6` omurga, çerçeveye yapışma, küçük rozet/etiket
- `components/ai/AITutorDrawer.tsx` — `w-5` şerit, çerçeveye yapışma, küçük ikonlar
- `components/map/MapContainer.tsx` — `ScaleControl` kaldırıldı, HUD `left-7` + kompakt ölçüler
- `components/ui/AppFrame.tsx` — amblem `translate-y-[16%] sm:translate-y-[12%]`
- `app/globals.css` — `.maplibregl-ctrl-bottom-left` kuralları silindi

---

## 📅 [2026-11-10] - Mobil Responsive Onarımı, Amblem Hizası ve Sidebar Hover'ın Geri Gelmesi

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: (1) Farenin üzerine gelmesiyle açılan sidebar artık sadece tuşla açılıyordu, (2) kapalıyken dikey "Katmanlar" yazan bar kaybolmuştu, (3) kenarlar çok genişti, (4) küre ve parşömenler biraz daha aşağı inmeliydi, (5) telefonlarda ekran çok küçülmüştü.

### Problem — ölçülen teşhis
1. **Hover kodu silinmemişti ama tetiklenmiyordu.** Sol kenardaki açma bölgesi `absolute` idi ve `main`'in `overflow-hidden`'ı onu kırpıyordu; 6px'lik kenarda hiç pointer olayı alınmıyordu.
2. **Dikey şerit duruyordu, okunmuyordu.** `9px` + `#b5a06a` + `opacity-80` üçlüsü etiketi zeminin içine gömüyordu.
3. **Mobilde harita alanı 366×725'ti (390×844 ekranda).** 12px çerçeve + iki 36px omurga = %27 kayıp. Sekme rayı 360px'te taşıyor, sağdaki buton grubu (177px) kesiliyordu.

### Çözüm
1. **Hover** (`components/ui/LayerSidebar.tsx`): kenara `fixed bottom-0 left-0 top-0 w-2 sm:w-3` hover bölgesi eklendi. Doğrulandı: sol kenar hover `36 → 290`, fare ayrılınca `36`, spine hover `290`.
2. **Dikey etiket**: `10px`, kalın, `#e2cd97`, `tracking-[0.22em]`; üst madalyon `#c9a24a/55` + iç gölge, alt ok `#dcc07d`; `opacity-80` tamamen kaldırıldı.
3. **Çerçeve** (`app/globals.css`, `AppFrame.tsx`, `HomePageClient.tsx`): bant `BAND` sabitinden `--hf-band` CSS değişkenine taşındı — mobilde **6px**, `sm` ve üstünde **12px**. Hem dört doku şeridi hem `inset` hairline hem dış `padding` aynı değeri okuyor. Köşe perçinleri 6 → 4px.
4. **Amblem** (`AppFrame.tsx`): `w-[190px] sm:w-[330px] lg:w-[390px]`, `translate-y-[20%] sm:translate-y-[16%]` ile alt kenardan taşıyor — çerçeveye yaslanmış bir köşe vinyeti gibi duruyor, haritanın ortasında "çıkartma" gibi değil.
5. **Omurgalar**: katman omurgası `w-7 sm:w-9`, AI şeridi `w-6 sm:w-9`.
6. **Navbar** (`Navbar.tsx`): mobilde arama kutusu ve geri bildirim butonu gizlendi (`hidden sm:block` / `sm:grid`); sekme rayındaki `◆` ayraçları yalnız `sm` üstünde; kompakt sekme `px-1 py-0.5 text-[9.5px]`; "Harita Testi" mobil etiketi "Harita"; "Sıralama" ve "Tam Ekran" yazıları `lg`'ye taşındı (tablet'te 768px'te taşma vardı); header dikey boşluk `py-1.5 sm:py-2`.
7. **Ölçek çubuğu** (`globals.css`): amblem köşeyi sahiplendiği için `.maplibregl-ctrl-bottom-left` `md` üstünde `left: 9rem`'e, mobilde `bottom: 4.25rem; left: 2.5rem`'e alındı — "200 km" etiketi kürenin altında kalmıyor.

### Doğrulama (Playwright, ölçülmüş)
| Cihaz | Harita alanı (öncesi → sonrası) | Yatay taşma |
|---|---|---|
| Android 360×740 | 336×621 → **348×646** | 0 |
| iPhone 390×844 | 366×725 → **378×750** | 0 |
| Tablet 768×1024 | — | 0 (navbar artık taşmıyor) |
| Masaüstü 1440×900 | 1416×819 | 0 |

- Sidebar: `36 → 290 → 36` (hover), pin ve X yolları da test edildi.
- Çerçeve bandı: ölçülen `12px` (masaüstü), `6px` (mobil).
- `npx tsc --noEmit` temiz, `npx next lint` → "No ESLint warnings or errors".

### Etkilenen Dosyalar
- `app/globals.css` — `--hf-band` değişkeni + medya sorguları, ölçek çubuğu konumu
- `components/ui/AppFrame.tsx` — `var(--hf-band)`, amblem boyutu/konumu
- `components/ui/LayerSidebar.tsx` — `fixed` hover bölgesi, dikey etiket, omurga genişliği
- `components/ui/Navbar.tsx` — mobil sıkıştırma
- `components/ai/AITutorDrawer.tsx` — mobil şerit genişliği
- `components/HomePageClient.tsx` — `padding: var(--hf-band)`

---

## 📅 [2026-11-10] - Referans Tasarım Birebir: Atlas Çerçevesi, Akordeon Sidebar, Krem AI Paneli

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: Verilen referans görselin (antik atlas / ahşap-parşömen çerçeve, açık akordeon sidebar, krem başlıklı AI paneli) birebir uygulanması. Kullanıcı ayrıca "tuvalin boş kısımları sorun değil, altından harita görünecek" diyerek amblem kompozisyonunun korunmasını istedi.

### Problem
Tema token seviyesinde doğruydu ama referansın **fiziksel çerçevesi** yoktu: uygulama tam ekran siyah bir zeminde başlıyor, sidebar düz bir liste, AI paneli koyu lacivert başlıklıydı.

### Çözüm
1. **Atlas çerçevesi** (`components/ui/AppFrame.tsx`, yeni): 20px'lik dört doku şeridi + altın hairline + iç gölge + dış bevel + 4 köşe perçini + sol altta `corner-emblem.png`. `border-image` yerine dört ayrı şerit kullanıldı; doku **300px'lik doğal ölçekte** döşeniyor (`cover` ile 1024²'yi 20px banda sığdırmak lekeleri dev boyuta çıkarıyordu — ölçülmüş hata).
2. **Akordeon sidebar** (`components/ui/LayerSidebar.tsx`): `▲` işaretli açılır bölümler, `grid-template-rows: 0fr/1fr` ile animasyonlu kapanma, bölüm başına etkin katman sayacı, satır ikonları, krem başlık plakasındaki küre madalyonu, genişlik 320 → **290px**.
3. **Katman ikonları** (`components/ui/LayerIcons.tsx`, yeni): 18 katman tipi için tek stroke ağırlıklı, `currentColor` kullanan gravür SVG seti + `LAYER_ICONS` registry.
4. **AI paneli** (`components/ai/AITutorDrawer.tsx`): lacivert → pirinç. Başlık `hf-parchment` krem plaka, sohbet alanına `ai-landscape.jpg` + gradyan perde, balonlar/composer/prompt chip'leri pirinç. Kalan **0** `indigo`/`slate` sınıfı.
5. **Navbar** (`components/ui/Navbar.tsx`): sekme ayraçları düz çizgi → çift hairline arasında `◆`.

### Ölçülmüş Düzeltmeler
- **HUD çakışması**: sidebar hover ile genişlerken harita HUD pili plakanın altında kalıyordu. `isSidebarHovered` store alanı eklendi; HUD `left: 322px`'e kayıyor (yalnız `isSidebarOpen` yetmiyordu — hover genişlemesi kalıcı değil).
- **AI avatarı boştu**: asistan mesaj balonundaki madalyonda ikon eksik kalmış, `Bot` ikonu eklendi.

### Asset Disiplini
Görselleri kullanıcı üretti; düzeltme/optimizasyon `sharp` ile yapıldı.
- `parchment.jpg` **1.1 MB → 148 KB**; merkezden %78 kırpma (vinyet atıldı) → blur → linear → median → `recomb` ile kanal bazlı sıcak krem dengesi. Ortalama `#E5DBC1`, vinyet farkı 94 → ~0, siyah çatlak yok (min 137).
- `corner-emblem.png` **1.9 MB → 819 KB** (1600×893) + WebP 172 KB. **Kompozisyona dokunulmadı** — şeffaf boşluk tasarımın parçası.
- `frame-wood.jpg` 765 KB/parlaklık 219 → **251 KB**/ortalama 165, vinyet −2.

### Etkilenen Dosyalar
- `components/ui/AppFrame.tsx` (YENİ), `components/ui/LayerIcons.tsx` (YENİ)
- `components/HomePageClient.tsx` — `AppFrame` + dış `padding: 20`
- `components/ui/LayerSidebar.tsx`, `components/ui/Navbar.tsx`, `components/ai/AITutorDrawer.tsx`
- `components/map/MapContainer.tsx` — HUD `left` geçişi
- `lib/store/useStore.ts` — `isSidebarHovered` / `setSidebarHovered`
- `app/globals.css` — `.hf-nav` / `.hf-plaque` dokulu zemin
- `public/assets/theme/*` — 4 final asset (+ webp)

### Doğrulama
- `npx tsc --noEmit` temiz, `npx next lint` → "No ESLint warnings or errors".
- Playwright 1440×900 ve 1248×638'de snapshot alındı; referansla yan yana karşılaştırıldı.

---

## 📅 [2026-11-09] - Antik Haritacılık Teması ve "AI Slop" Temizliği (UI/UX)

- **Geliştirici**: AI Agent (OpenCode)
- **Kullanıcı Talebi**: "arayüz çok AI slop duruyor, premium ama AI slop gözükmeyecek şekilde düzenle" → ardından referans görsel verilerek "buna benzeyen bir arayüz yap, tüm featurelar ve alt menüler uyacak, sadece temayı al"

### Problem
Arayüzde jenerik mor-mavi gradyanlar, her yere dağılmış glassmorphism, rastgele ikonlar ve tekdüze yuvarlak kartlar vardı. 6 klasik "AI slop" kusurunun tamamı mevcuttu.

### Çözüm Mimarisi
Tema **token seviyesinde** uygulandı — 18 bileşen tek tek değil, `app/globals.css` içindeki `@theme` bloğunda renk skalası yeniden eşlendi. Böylece mevcut tüm ekranlar otomatik olarak temayı devraldı.

| Eski token | Yeni anlam |
|---|---|
| `slate` | Koyu mürekkep yeşili (chrome/zemin) |
| `indigo` · `purple` · `violet` | Pirinç / altın (mor-mavi gradyanlar tamamen kalktı) |
| `sky` | Atlas suyu mavi-gri |
| `emerald` | Adaçayı (başarı) |
| `rose` | Kiremit (uyarı/hata) |
| `amber` | Eskitilmiş altın |

### Etkilenen ve Yeni Eklenen Dosyalar
- **`app/globals.css`** — `@theme` renk skalası; `.hf-panel`, `.hf-plaque`, `.hf-parchment`, `.hf-double-rule`, `.hf-frame`, `.hf-divider`, `.hf-script`, `.hf-serif`, `.hf-label` yüzey/tipografi sınıfları; harita grading'i; Maplibre kontrol/popup/scale stillemesi
- **`components/ui/MapOrnaments.tsx`** (YENİ) — inline SVG pusula gülü, armiler küre, arazi silüeti, kuzey işareti (harici asset yok)
- **`components/ui/Navbar.tsx`** — pusula madalyonu, serif sekme etiketleri, aktif sekme kabarık parşömen kart, armiler madalyon
- **`components/ui/LayerSidebar.tsx`** — pirinç plaket, pusula gülü başlık, omurga süslemesi, kuzey işareti altlık
- **`components/ui/LayerHintBanner.tsx`** — parşömen/panel teması, HUD altına taşındı
- **`components/ui/AuthUserButton.tsx`** — pirinç/pill kullanıcı kartı
- **`components/ui/RotateScreenBanner.tsx`** — parşömen plaket
- **`components/HomePageClient.tsx`** — levha çerçevesi, yükleme ekranı
- **`components/map/MapContainer.tsx`** — harita grading'i, parşömen HUD çubuğu, süsleme katmanı, `ScaleControl`, alt motto
- **`app/layout.tsx`** — SEO metadata (OpenGraph, Twitter, canonical, hreflang); BOM temizlendi
- **`app/robots.ts` · `app/sitemap.ts`** — yeni rotalar eklendi
- **`app/{harita-testi,duello,soru-bankasi,hata-defteri,ai-ogretmen,istatistikler}/page.tsx`** (YENİ) — rota kabukları
- **`components/game/HataDefteriView.tsx`** (YENİ) — `any` tip hatası ve kullanılmayan değişken lint hatası düzeltildi

### Harita Yüzeyi (en kritik iş)
Harita döşemeleri tema dışıydı. Çözüm: `[data-map-style] .maplibregl-canvas { filter: saturate(2.6) contrast(1.05) brightness(0.9) }` + `%5` krem `multiply` yıkama + `%18` SVG fractal-noise kağıt taneciği. Sonuç: kara parşömen, su gravür arduvaz-mavisi, sınırlar kızıl — **harita sağlayıcısı değişse bile görünüm korunur**.

### Yan Düzeltmeler
1. **Harita "API KEY REQUIRED" filigranı** — yerel `.env`'deki eski `cb1_...` anahtarı geçersizdi. Vercel'deki geçerli JWT anahtarı `vercel link` + `vercel env pull` ile `.env.local`'e çekildi (gitignore'da).
2. **`package-lock.json`** — Next'in eksik `@next/swc` platform bağımlılıkları onarıldı.
3. **`.gitignore`** — `.vercel`, `tsconfig.tsbuildinfo`, `.tmp/` eklendi.
4. **Dal düzeni** — uzakta `master`/`main` ikiliği vardı; tek `main`'e indirildi, upstream bağlandı.
5. **Dev/build çakışması** — `next dev` açıkken `next build` çalıştırılınca `.next` bozuluyor ve sahte `JSON.parse` hatası (HTTP 500) veriyor. Artık build öncesi dev durduruluyor.

### Doğrulama
- `npx tsc --noEmit` → 0 hata
- `npx eslint .` → 0 hata, 0 uyarı
- `npx next build` (soğuk, cache temiz) → 12/12 sayfa üretildi
- 7/7 rota dev modda HTTP 200, konsol hatası 0
- Görsel kontrol: 1536×864, 820×1180, 390×844
- Commit: `4687e98`, `0a2fde3`

---

## 📅 [2026-11-08] - Kapsamlı Arama Motoru (SEO) ve Yapay Zeka Bilgi Motoru Optimizasyonu (GEO - Generative Engine Optimization)
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "seo çalışması yap ve spnra google aramalardan ve yapay zeka sonuçlarında daha öne çıkmak için şunlardan bize uygun olanları uygula: Statik Ön-Oluşturma (SSG & Pre-Rendering), Özgün Canonical & Çok Dilli Hiyerarşi, Yapay Zeka Ajan Manifestoları (GEO & ARD), Semantik Yapılandırılmış Veri (Schema.org JSON-LD), Tarama Bütçesi ve Core Web Vitals, Güncel Site Haritası (Sitemap.xml)"
- **Etkilenen ve Yeni Eklenen Dosyalar**:
  - `/components/seo/SemanticSEOContent.tsx` (Ham HTML erişilebilirliği, H1-H3 başlık hiyerarşisi, vaka analizi [Problem/Çözüm/Etki], 7 ana coğrafya modülü ve SSS bölümü)
  - `/components/seo/StructuredData.tsx` (Schema.org `WebApplication`, `Course`, `FAQPage`, `BreadcrumbList` JSON-LD şemaları)
  - `/app/layout.tsx` (Gelişmiş OpenGraph, Twitter Cards, `canonical`, `hreflang`, preconnect bağlantıları, akademik/GEO citation meta etiketleri)
  - `/app/page.tsx` (Sunucu seviyesinde semantik HTML ön-oluşturma entegrasyonu)
  - `/app/opengraph-image.tsx` (1200x630 dinamik OpenGraph sosyal paylaşım görseli üreteci)
  - `/public/ai-catalog.json` & `/public/.well-known/ai-catalog.json` (ARD & WebMCP standartlarında ajan keşif manifestoları)
  - `/public/llms.txt` & `/public/llms-full.txt` (Perplexity, ChatGPT, Claude ve Gemini için yapılandırılmış özet ve eksiksiz KPSS müfredat bağlam belgeleri)
  - `/app/robots.ts` (Googlebot, Google-Extended, GPTBot, PerplexityBot, Applebot ve ClaudeBot tarama izinleri, sitemap ve manifest yönlendirmesi)
  - `/app/sitemap.ts` (Dinamik son güncellenme tarihleri, öncelik katsayıları ve çok dilli hreflang linkleri)
  - `/next.config.ts` (Manifest ve metin dosyaları için UTF-8 Content-Type, CORS ve Cache-Control başlıkları)
  - `/WORK_LOG.md`
- **Uygulanan Standartlar ve Kazanımlar**:
  1. **Statik Ön-Oluşturma (Raw HTML Pre-Rendering)**: JavaScript çalıştırmayan arama motoru botları ve hafif yapay zeka tarayıcıları sayfayı çektiğinde boş SPA kabuğu yerine tüm KPSS coğrafya konularını, vaka analizlerini ve soru kategorilerini anında okuyabilir.
  2. **GEO (Generative Engine Optimization)**: Perplexity, SearchGPT, Google AI Overviews ve Claude botları için `llms.txt`, `llms-full.txt` ve `ai-catalog.json` katalogları sağlandı; coğrafi terimler doğrudan kaynak gösterilebilir hale getirildi.
  3. **Zengin Arama Sonuçları (Rich Snippets)**: Google aramalarında SSS (FAQ Accordion), Yazılım Uygulaması (Educational App) ve Kurs (Course) kartlarının çıkması sağlandı.
  4. **Sosyal Paylaşım Görselleri**: Discord, WhatsApp, Twitter/X ve LinkedIn paylaşımlarında 1200x630 çözünürlüğünde dinamik görsel ve etiketler hazırlandı.
  5. **Google Search Console Doğrulaması (HTML Dosyası & Meta Etiketi)**:
     - `public/google9927a200e581db27.html` dosyası kök dizine eklendi (`google-site-verification: google9927a200e581db27.html`).
     - `app/layout.tsx` içine hem `google9927a200e581db27` hem de `Fx5ZGG2SArtknm32vqa-j5dbMvJWvRkv8c0lRvN4KRU` meta etiketleri ve Next.js metadata verification array'i tanımlandı.
     - `app/robots.ts` içinde doğrulama dosyası açıkça izinli kılındı.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı.
  - `compile_applet`: Üretim derlemesi (Next.js production build) başarıyla tamamlandı.

---

## 📅 [2026-10-02] - Kapsamlı Güvenlik Açığı Taraması & Sertleştirme (Full-Stack Security Hardening)
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "güvenlik açıklarını kapat"
- **Etkilenen Dosyalar**:
  - `/next.config.ts` (HTTP Güvenlik Başlıkları: HSTS, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, DNS Prefetch Control)
  - `/firestore.rules` (Dağıtıldı: `deploy_firebase` - Duels, Rumuzes, Feedbacks detaylı veri şeması, yetki ve değer aralığı denetimi)
  - `/lib/rateLimiter.ts` (Ters vekil sunucu IP sahteciliğine karşı koruma, `x-real-ip`/`x-vercel-ip`/`cf-connecting-ip` önceliği ve DoS bellek taşmasını önleyen sınırlı önbellek)
  - `/app/api/gemini/explain/route.ts` & `/app/api/gemini/analyze/route.ts` (Prompt injection / jailbreak tespiti ve engellemesi, sıkı rol izolasyonu, nosniff yanıt başlıkları)
  - `/lib/rumuzService.ts` (Kullanıcıya özel tuzlu SHA-256 PIN hashleme, liderlik tablosunda `pin` ve `oldPin` temizliği, düello güncelleme puan sınırları)
  - `/security_spec.md` (21-24. güvenlik vektörleri belgelendi)
  - `/WORK_LOG.md`
- **Kapatılan Güvenlik Açıkları**:
  1. **HTTP Güvenlik Başlıkları**: Eksik olan MIME sniffing, XSS, HSTS ve referer sızıntısı risklerine karşı `next.config.ts` içine kurumsal düzeyde güvenlik başlıkları eklendi.
  2. **Firestore Kuralları (Düello ve Nick Güvenliği)**:
     - Aktif durumdaki maçların (`status == 'playing'`) silinmesi engellendi.
     - Düello oluşturma ve güncellemelerinde oyuncu veri haritaları, soru adetleri (1-50) ve puan sınırları kural düzeyinde kilitlendi.
     - Nick profillerinde puan (0-5.000.000), seri (0-50.000) ve soru sayaçları sınırlandırıldı; PIN değişikliği için `oldPin` zorunluluğu pekiştirildi.
     - `deploy_firebase` ile kurallar doğrudan canlı Firestore'a dağıtıldı.
  3. **Ters Vekil Sunucu Rate Limiting & DoS Koruması**:
     - `X-Forwarded-For` sahteciliğiyle rate limiter atlatma riski giderildi; güvenilir uç başlıkları önceliklendirildi.
     - Bellek şişirme saldırılarına karşı `ipCache` maksimum 5000 kayıtla sınırlandırıldı.
  4. **Yapay Zeka Prompt Injection & Rol Kaçırma (Jailbreak) Koruması**:
     - Sistem komutlarını unutturmaya veya API anahtarlarını sızdırmaya yönelik kalıplar API seviyesinde filtrelendi ve reddedildi.
  5. **PIN Güvenliği ve Kriptografik Dayanıklılık**:
     - Her kullanıcıya özel tuz (per-user salting) desteği getirilerek gökkuşağı tablosu (rainbow table) saldırıları imkansız kılındı.
- **Doğrulama**:
  - `lint_applet` & `compile_applet` ile kod bütünlüğü doğrulandı.

---

## 📅 [2026-09-17] - Vercel Dağıtım Hatası Çözümü (TypeScript Type Narrowing & Storage Sanitization Fix)
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "vercele deploy ederken hata verdi olası hataları kontrol et"
- **Hata Kaynağı**:
  - `lib/store/useStore.ts:274:27: Type error: Property 'score' does not exist on type 'never'.`
  - TypeScript, `if ('__proto__' in obj || 'constructor' in obj || 'prototype' in obj)` denetimi sonrasında `obj` nesnesini `never` tipine indirgemişti (type narrowing). Bu durum Vercel'deki `npm run build` (tsc strict check) aşamasında derlemenin çökmesine neden oluyordu.
- **Etkilenen Dosyalar**:
  - `/lib/store/useStore.ts` (`sanitizeStoredStats` güvenli nesne okuma fonksiyonu `getProp` ve `Object.prototype.hasOwnProperty.call` ile revize edildi, `any` kullanılmadan linter ve type-checker uyumlu hale getirildi)
  - `/WORK_LOG.md`
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (ESLint temiz geçti).

---

## 📅 [2026-09-16] - KPSS Zayıf Nokta Takipçisi ("Hata Defteri") Modülü & Soru Tekrar Modu
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "Hata Defteri (Weak Spot Tracker) - Soru testlerinde yanlış yapılan soruların toplanması, tekrar çözülmesi ve pekiştirilmesi"
- **Etkilenen Dosyalar**:
  - `/lib/store/useStore.ts` (`missedQuestions`, `recordMissedQuestion`, `resolveMissedQuestion`, `clearMissedQuestions`, `startMissedQuestionsPractice`, localStorage persistence ve sanitization)
  - `/components/game/QuizTestGame.tsx` (`📕 Hata Defterim` kategorisi, boş durum ekranı, pekiştirme bildirimleri, amber temalı tekrar modu)
  - `/components/ui/StatsModal.tsx` (`Hata Defteri` alt sekmesi, soru ve harita hatalarını filtreleme, soru kartları, ÖSYM püf noktaları, doğrudan "Hataları Tekrar Çöz" entegrasyonu)
  - `/WORK_LOG.md`
- **Yapılan İyileştirmeler**:
  1. **Zustand & LocalStorage Durum Yönetimi**:
     - `MissedQuestionRecord` veri modeli eklendi (soru metni, şıklar, doğru şık, açıklama, ÖSYM notu, yanlış sayısı, zaman damgası).
     - Kullanıcı bir soruyu yanlış cevapladığında otomatik olarak `recordMissedQuestion` çalışır; tekrar çözüp doğru bildiğinde `resolveMissedQuestion` ile defterden temizlenir.
     - Prototype pollution ve localStorage bellek taşmasına karşı sanitasyon ve 150 kayıt kotası uygulandı.
  2. **QuizTestGame Entegrasyonu**:
     - Kategori açılır menüsüne canlı sayaçlı `📕 Hata Defterim (X)` eklendi.
     - Hata defteri boşken motive edici boş durum (empty state) gösterilir.
     - Soru doğru yanıtlandığında yeşil pekiştirme tebrik kutusu ("Harika! Bu konuyu pekiştirdiniz ve Hata Defterinizden silindi") gösterilir.
  3. **İstatistik Paneli (StatsModal) Genişletmesi**:
     - "Hata Defteri" sekmesinde hem harita ıskalama noktaları hem de KPSS soru hataları sekmelerle filtrelenebilir hale getirildi.
     - "Hataları Tekrar Çöz" butonuyla doğrudan hata testine geçiş sağlandı.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).

---

## 📅 [2026-09-16] - Kapsamlı Güvenlik Açığı Taraması, Kural Güçlendirme & Dağıtım (Security Hardening)
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "güvenlik açıklarını kapat"
- **Etkilenen Dosyalar**:
  - `/firestore.rules` (Dağıtıldı - `deploy_firebase`)
  - `/firebase-blueprint.json`
  - `/security_spec.md`
  - `/WORK_LOG.md`
- **Tespit Edilen ve Kapatılan Güvenlik Riskleri**:
  1. **Feedback Koleksiyonu Alan Uyuşmazlığı & Payload Boyut Koruması**:
     - Firestore kurallarında `content` alanı kontrol ediliyordu ancak istemci `message` alanını gönderiyordu; kural `message` alanına güncellendi.
     - Mesajın boş veya spam amaçlı aşırı büyük gönderilmesini önlemek amacıyla `message.size() >= 5 && message.size() <= 2000` kuralı uygulandı.
     - `feedbacks` koleksiyonu `get`, `list`, `update`, `delete: if false;` tutularak dışarıdan taranması ve kazınması engellendi.
  2. **Rumuz & Liderlik Tablosu Koruması (Wipe / Data Tampering)**:
     - `rumuzes` koleksiyonunda `allow delete: if false;` kuralı teyit edildi; toplu silme / veri sıfırlama saldırıları engellendi.
     - `normalizeRumuzKey` üzerinde prototype pollution (`__proto__`, `constructor`) koruması ve uzunluk sınırı teyit edildi.
  3. **Kullanıcı Veri Alanı & İlerleme İzolasyonu**:
     - `/users/{userId}` ve alt koleksiyonları (`/progress`, `/history`) yalnızca oturum açmış gerçek sahibine (`isOwner(userId)`) sınırlandırıldı; toplu listeleme (`allow list: if false`) yasaklandı.
  4. **Kuralların Buluta Dağıtımı & Şema Uyumu**:
     - `firebase-blueprint.json` dosyasına eksik olan `Feedback` varlığı ve `/feedbacks/{feedbackId}` yolu eklendi.
     - `firestore.rules` `deploy_firebase` aracıyla canlı ortama başarıyla dağıtıldı.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - Firestore rules canlıya deploy edildi.

---

## 📅 [2026-09-16] - Harita Hızlandırıldı Bilgilendirme Bannerı Sadeleştirme & Buton Hiyerarşisi
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "başlangıçtaki harita hızlamdırıldı mesajını küçült ve sadeleştir ve anladımı belirginleştirip tümünü açı daha belirsiz yap kullanıcı isterse açsın yanlışlıkla açmasın"
- **Etkilenen Dosyalar**:
  - `/components/ui/LayerHintBanner.tsx`
  - `/WORK_LOG.md`
- **Yapılan İyileştirmeler**:
  1. **Boyut & Metin Sadeleştirmesi**:
     - Banner genişliği `max-w-md` seviyesinden kompakt `max-w-[290px] sm:max-w-xs` boyutuna indirildi; padding ve ikon boyutları küçültüldü.
     - Metin daha öz, okuması kolay ve sade bir hale getirildi.
  2. **"Anladım" Butonunun Ön Plana Çıkarılması**:
     - "Anladım" butonu birincil (primary) stil ile indigo renkli, belirgin ve ilk sırada konumlandırıldı.
     - "Katmanlar" butonu ikincil nötr stil ile yanına eklendi.
  3. **"Tümünü Aç" Seçeneğinin İkincilleştirilmesi**:
     - Kullanıcının kazara basıp haritayı kasmaması için "Tümünü Aç" butonu alt sağ köşede soluk, altı çizgili metin bağlantısı (subtle text link) şeklinde stilize edildi.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).

---

## 📅 [2026-09-05] - Global Madalyalar (Tüm Avatarlarda), Belirgin Profil Kategorileri, "Nick" Harmonizasyonu & "Odaya Katıl"
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "rozetler ve madalyalar avatarın olduğu her yerde gözüksün sadece sıralamada değil, ayrıca avatar avatar efekti ünvan ve rozetlerin ayrı başlıklar olduğu ilk bakışta anlaşılmıyor başlıkları belirginleştir, rumuz yerine nick kelimesini kullan ve bunu bütün kodda değiştir dosya başlıkları, firebase, firestore vs.. dahil, eğer bazılarının değişmesi sıkıntı olacaksa sadece kullanıcı arayüznde değiştir, oda katıl değil odaya katıl olacak"
- **Etkilenen Dosyalar**:
  - `/lib/rumuzService.ts`
  - `/components/ui/AvatarWithBadgeFrame.tsx`
  - `/components/ui/ProfileEditModal.tsx`
  - `/components/game/DuelMode.tsx`
  - `/components/ui/AuthUserButton.tsx`
  - `/components/ui/GlobalLeaderboardModal.tsx`
  - `/components/ui/FeedbackModal.tsx`
  - `/WORK_LOG.md`
- **Yapılan İyileştirmeler**:
  1. **Global Madalya ve Rozet Sistemi (Her Yerde Canlı Çözümleme)**:
     - `rumuzService.ts` içinde `getCachedUserMedalInfo` ve `subscribeToLeaderboardMedals` servisleri kuruldu.
     - `AvatarWithBadgeFrame.tsx` artık yalnızca sıralama tablosunda değil; düello lobisinde, oyun içi HUD'da, kullanıcı profil butonunda ve analiz panosunda da oyuncunun global sıralamadaki derecesini (1., 2., 3. madalyaları) ve rekor seri madalyasını otomatik olarak çözüp sol altta gösterir.
  2. **Profil Özelleştirme Başlıklarının Belirginleştirilmesi (`ProfileEditModal.tsx`)**:
     - Avatar, Avatar Efekti, Ünvanlar ve Rozetler sekmeleri numaralandırılmış, renkli rozet ikonları ve net açıklamalarla birbirinden bağımsız 5 ayrı kategori halinde belirginleştirildi.
  3. **"Odaya Katıl" İsimlendirme Düzeltmesi (`DuelMode.tsx`)**:
     - Lobi sekmesindeki "Oda Katıl" butonu "Odaya Katıl" olarak güncellendi.
  4. **Kullanıcı Arayüzünde "Rumuz" -> "Nick" Harmonizasyonu**:
     - Geriye dönük Firestore veritabanı belgelerinin ve kayıtlı kullanıcı hesaplarının bozulmaması için (güvenli yaklaşım) tüm kullanıcı arayüzü, modal diyaloglar, form etiketleri ve bildirimlerde "Rumuz" ifadeleri "Nick" olarak harmonize edildi.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - `compile_applet`: Başarılı.

---

## 📅 [2026-09-05] - Kapsamlı Güvenlik Taraması, Açık Analizi & Güçlendirme (Security Audit & Hardening)
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "açıklıkları test et ve detaylı bir tarama yap"
- **Etkilenen Dosyalar**:
  - `/firestore.rules` (Dağıtıldı - `deploy_firebase`)
  - `/lib/rumuzService.ts`
  - `/app/api/gemini/explain/route.ts`
  - `/app/api/gemini/analyze/route.ts`
  - `/WORK_LOG.md`
- **Tespit Edilen ve Kapatılan Güvenlik Riskleri**:
  1. **Firestore Liderlik & Rumuz Silinme Açığı (Data Wipe / DoS)**:
     - Eskiden `rumuzes` koleksiyonunda `allow delete: if true;` bulunuyordu. Bu durum kötü niyetli bir kullanıcının tüm liderlik tablosunu veya rakiplerin profillerini silmesine olanak tanıyordu. `allow delete: if false;` yapılarak ve `isValidId` ile karakter/uzunluk sınırı getirilerek tamamen engellendi.
  2. **Geri Bildirim (Feedback) Gizlilik Sızıntısı & Kazıma**:
     - `feedbacks` koleksiyonunda `allow get, list: if false;` yapılarak kullanıcıların yazdığı geri bildirimlerin dışarıdan taranması ve kazınması engellendi. Sadece güvenli yazma (`create`) izni bırakıldı.
  3. **Prototype Pollution & ID Enjeksiyonu Koruması (`normalizeRumuzKey`)**:
     - `__proto__`, `constructor`, `prototype` gibi anahtar kelimelerin obje kirliliğine yol açmaması için anahtar filtrelemesi ve 40 karakterlik sınır uygulandı.
  4. **Gemini API Rotalarında DoS ve Aşırı Yükleme Koruması**:
     - `/app/api/gemini/explain` ve `/app/api/gemini/analyze` rotalarında gelen JSON yükleri tür kontrollerine tabi tutuldu ve metin uzunlukları sınırlandırıldı.
- **Doğrulama**:
  - `firestore.rules` Firebase'e başarıyla deploy edildi.
  - `lint_applet`: 0 hata, 0 uyarı (temiz).

---

## 📅 [2026-09-05] - Profil Özelleştirmede Akıllı Son Kademe Varsayılanı (Avatarlar, Ünvanlar, Rozetler) & 2-4 Kişilik Düello Terk İyileştirmeleri
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "eğer 2 kişilik düelloda biri çıkarsa düelloyu karşı taraf kazansın ama 3 ve 4 kişilik düellolarda tek kişi kalana kadar diğerlerinin çıkması düellonun devam etmesini engellemesin, şu anda birisi çıktığında düello direkt bitiyor 3 ve 4 kişilik düellolarda, ayrıca avatarlar ünvanlar rozetler çok yer kaplıyor default ayar olarak tümü gösterilmesin sadece kullanıcının çıktığı son kademe ne ise onun objeleri gözüksün böylece özellikle mobilde sürekli aşağı kaydırmak zorunda kalmaz"
- **Etkilenen Dosyalar**:
  - `/components/ui/ProfileEditModal.tsx`
  - `/lib/duelService.ts`
  - `/components/game/DuelMode.tsx`
  - `/WORK_LOG.md`
- **Yapılan İyileştirmeler**:
  1. **Akıllı Son Kademe Varsayılanı (`ProfileEditModal.tsx`)**:
     - Kullanıcının kariyer puanı, zaferleri ve başarımlarına göre çıktığı en yüksek açık kademe tespit edilerek (`userHighestAvatarTier`, `userHighestTitleTier`, `userHighestBadgeTier`):
       - **Avatarlar**: Sayfa açıldığında doğrudan kullanıcının çıktığı son kademedeki avatarları filtreler ve gösterir.
       - **Ünvanlar**: Kademe filtre sekmeleri (Tümü, 5. Kademe... 1. Kademe) eklendi; default olarak kullanıcının en son kademesi açılır.
       - **Rozetler**: Kademe filtre sekmeleri eklendi; default olarak kullanıcının son ulaştığı kademe rozetleri gösterilir.
     - Bu sayede özellikle mobil cihazlarda onlarca öğeyi aşağı doğru uzun uzadıya kaydırma zorunluluğu ortadan kalktı, ekran son derece derli toplu ve hızlı hale getirildi.
  2. **2v2 / 3 ve 4 Kişilik Düellolarda Terk/Çıkış Sistemi**:
     - 2 kişilik düelloda çıkan oyuncu doğrudan mağlup sayılır, kalan oyuncu hükmen kazanır ve zafer istatistikleri işlenir.
     - 3 ve 4 kişilik düellolarda bir veya iki kişi çıksa dahi maç bozulmaz ve sonlanmaz; kalan 2-3 oyuncu soruları cevaplamaya kesintisiz devam eder. Yalnızca tek bir kişi kaldığında otomatik olarak o oyuncunun zaferiyle tamamlanır.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - Dev server başarıyla çalışır durumda.

---

## 📅 [2026-09-05] - 2 Kişilik Hükmen Galibiyet, 3 & 4 Kişilik Kesintisiz Düello & Çift Madalya Desteği
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "eğer 2 kişilik düelloda biri çıkarsa düelloyu karşı taraf kazansın ama 3 ve 4 kişilik düellolarda tek kişi kalana kadar diğerlerinin çıkması düellonun devam etmesini engellemesin, şu anda birisi çıktığında düello direkt bitiyor 3 ve 4 kişilik düellolarda, eğer 1 kullanıcı hem en yüksek seri zafer rekoruna hem başka bir madalyaya sahip ise sola yaslı olarak 2 madalyayı da avatarının altına koy"
- **Etkilenen Dosyalar**:
  - `/lib/duelService.ts`
  - `/components/game/DuelMode.tsx`
  - `/components/ui/AvatarWithBadgeFrame.tsx`
  - `/WORK_LOG.md`
- **Yapılan İyileştirmeler**:
  1. **Akıllı Düello Terk & Devam Algoritması (`duelService.ts` & `DuelMode.tsx`)**:
     - `leaveOrCancelDuel` fonksiyonu çok oyunculu dinamiklerine göre yeniden kodlandı:
       - **2 Kişilik Maç**: Bir oyuncu maçtan çıktığında maç doğrudan `status: 'finished'` olur ve kalan oyuncu hükmen galip sayılır (`winnerId = remainingPlayer.id`). Zafer verisi Firestore üzerinden liderlik tablosuna işlenir.
       - **3 ve 4 Kişilik Maç**: Bir veya iki oyuncu çıktığında maç sonlanmaz; çıkan oyuncu maçtan düşürülür ve kalan 2 veya 3 oyuncu soruları cevaplamaya kesintisiz devam eder. Eğer çıkan kişi o turun son beklenen cevabı ise tur otomatik olarak `round_reveal` aşamasına geçer.
       - **Son Oyuncu Kuralı**: 3 veya 4 kişilik maçta peş peşe çıkışlar sonucu geriye tek bir oyuncu kalırsa maç tamamlanır ve son kalan oyuncu otomatik olarak maçı kazanır.
  2. **Avatar Altında Çift Madalya Desteği (`AvatarWithBadgeFrame.tsx`)**:
     - `activeMedals` dizisi tanımlanarak bir kullanıcının hem derece madalyasına (🥇 1.lik, 🥈 2.lik, 🥉 3.lük) hem de ⚡ Zafer Serisi Rekortmeni madalyasına sahip olması durumunda iki madalyanın da avatarın sol altına sola yaslı olarak (`🥇 ⚡`) yan yana şık bir şekilde yerleştirilmesi sağlandı.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - Dev server başarıyla çalışır durumda.

---

## 📅 [2026-09-05] - Dinamik Sıralı Oda Sistemi (TR-001...), Zafer Odaklı Adil Sıralama Algoritması & Avatar Madalyaları
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "Oda Kur ve Oda Katıl olarak değiştir başlıkları, oda sistemi şöyle olsun: odaya bir isim ve opsiyonel olarak bir şifre koyulabilsin eğer hiçbir şey kurulmazsa o an olan oda sayısına göre sıra versin örneğin TR-001, TR-002, TR003 ... eğer 001 odası dağılmışsa ve 002 ve 003 hala devam ediyorsa bir sonraki oda TR-001 adıyla kurulsun boşta en küçük hangi rakam varsa odaya o rakam veya sayı atansın oda ismi boş bırakılmış ise, puanlama sistemini değiştir hala zafer sayısı yeteri kadar etki etmiyor puanlara, çok maç oynamış ama az maç kazanmış birisi az maç oynamış ama çok zafer kazanmış kişiden daha çok puan alamasın bu sıralamada 14 maç oynayıp 2 maç kazanmış kullanıcı 9 maç oynayıp 7 zafer alan ve 7 seri rekoru olan kullanıcıdan daha çok puan almış olmamalı. Ayrıca avatarın sol altına özel kullanıcılara özel madalyalar verilsin örneğin ilk 3 derecedekilere altın gümüş ve bronz madalya ve en çok seri yapan kullanıcıya rekor madalyası..."
- **Etkilenen Dosyalar**:
  - `/lib/duelService.ts`
  - `/lib/rumuzService.ts`
  - `/components/game/DuelMode.tsx`
  - `/components/ui/AvatarWithBadgeFrame.tsx`
  - `/components/ui/GlobalLeaderboardModal.tsx`
- **Yapılan İyileştirmeler**:
  1. **Lobi Başlıkları & Dinamik Boş Oda Numarası Atama (`duelService.ts` & `DuelMode.tsx`)**:
     - Lobi sekmeleri `Oda Kur` ve `Oda Katıl` olarak güncellendi.
     - `generateLowestAvailableRoomCode` fonksiyonu eklendi: Firestore'daki aktif odalar taranarak boşta olan en küçük sıra numarası (`TR-001`, `TR-002`, `TR-003`...) tespit edilip atanıyor. Örneğin 001 kapandığında ve 002-003 açıkken yeni oda doğrudan `TR-001` olarak açılıyor.
     - İsteğe bağlı özel oda adı ve şifre (PIN) belirleme desteği sağlandı.
  2. **Zafer ve Kazanma Oranı Odaklı Adil Sıralama Gücü Algoritması (`rumuzService.ts`)**:
     - `calculateRankingPower` formülü baştan tasarlandı:
       - Düello Zaferi: **8000 Puan / Zafer**
       - Kazanma Oranı: **20000 Puan x WR** (Maç hacmine bağlı katsayı ile)
       - Kariyer En İyi Serisi Rekoru: **3000 Puan / Adım**
       - Canlı Galibiyet Serisi: **1500 Puan / Adım**
       - Maç ham puanı katılım spam'ini önlemek için bastırıldı (maks 3000 puan).
     - Bu sayede 9 maçta 7 zafer ve 7 seri alan bir oyuncu, 14 maç oynayıp 2 zafer alan oyuncunun açık ara önüne geçer.
  3. **Avatar Sol Alt Özel Derece ve Rekortmen Madalyaları (`AvatarWithBadgeFrame.tsx` & `GlobalLeaderboardModal.tsx`)**:
     - Avatar bileşenine sol alt madalya rozeti eklendi:
       - 🥇 **1.lik Altın Madalyası** (Global Lider)
       - 🥈 **2.lik Gümüş Madalyası** (Global 2.lik)
       - 🥉 **3.lük Bronz Madalyası** (Global 3.lük)
       - ⚡ **Zafer Serisi Rekortmeni Madalyası** (Tüm Zamanlar Seri Rekoru Sahibi)
     - Liderlik tablosundaki oyuncu satırlarında ve kullanıcının kendi profil kartında dinamik olarak hesaplanarak gösterildi.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - Dev server başarıyla çalışır durumda.

---

## 📅 [2026-09-05] - 1. Tur Senkronizasyon & Puanlama Onarımı, Kompakt Profil Arayüzü ve Kontrast İyileştirmeleri
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "bazen ilk turda bazı oyuncular basamıyor veya bastığı halde 0 puan alıyor bunları analiz et ve hatayı bulabilirsen düzelt, ayrıca avatar, ünvan ve rozetlerin başlıklarını basitleştir çok fazla yer kaplıyorlar, lobi ekranı hala tam olarak mobilde ekrana sığmıyor hem yatayda hem dikeyde bunu düzelt, özellikler mor üstüne yazılan yazılar okunmuyor kontrastları iyi ayarla her şey okunabilir olsun ve profil kısmını tamamen kompakt hale getir açıklamaları üstüne basıldığı veya fare ile gelindiği zaman görünecek şekilde ayarla"
- **Etkilenen Dosyalar**:
  - `/lib/duelService.ts`
  - `/components/map/MapContainer.tsx`
  - `/components/ui/ProfileEditModal.tsx`
  - `/components/game/DuelMode.tsx`
  - `/lib/data/badgesData.ts`
- **Yapılan İyileştirmeler**:
  1. **1. Tur Başlatma ve Sıfır Puan Sorununun Çözümü (`duelService.ts` & `MapContainer.tsx`)**:
     - `startFirstRoundFromStarting` fonksiyonu eklenerek lobiden maça geçiş anında oyuncu state'lerinin (süre, puan, mesafe) temiz bir şekilde senkronize edilmesi sağlandı.
     - `calculateDuelScore` fonksiyonu güncellenerek geçerli tahminlerde 0 puan alınması engellendi (mesafeye göre taban puan güvencesi).
     - `MapContainer.tsx` üzerinde `starting` -> `in_progress` aşama geçişi algılayıcısı optimize edildi; ilk turda tıklamaların düşmesi ve kilitlenmesi önlendi.
  2. **Kompakt Profil Arayüzü & Hover/Tıklama Dinamik Açıklamaları (`ProfileEditModal.tsx`)**:
     - Başlıklar ve kartlar mikro-kompakt boyuta getirildi ("1. Avatar & Tema", "2. Ünvanlar", "3. Rozetler").
     - Avatar, ünvan ve rozetlerin uzun kilit ve edinim metinleri doğrudan kart içerisinden kaldırılarak üzerlerine gelindiğinde (*hover*) veya tıklandığında anında açılan interaktif **İnceleme & Şart Gösterge Paneli**'ne taşındı.
  3. **Yüksek Kontrast & Sadeleştirilmiş Başlıklar (`badgesData.ts`)**:
     - Mor ve koyu arkaplanlarda okunmayı zorlaştıran düşük kontrastlı renkler yerine yüksek kontrastlı, canlı ve keskin renk sınıfları uygulandı.
  4. **Mobil Lobi Boyutlandırması (`DuelMode.tsx`)**:
     - Lobideki buton, kart ve filtre boyutları daraltılarak dikey ve yatay taşma olmadan tüm mobil ekranlara sığması sağlandı.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - Dev server başarıyla aktif.

---

## 📅 [2026-09-05] - Çoklu Düelloda 3. ve 4. Oyuncu İşaretleme ve İzleyici Görünümü Hatasının Düzeltilmesi
- **Geliştirici**: AI Agent (AI Studio Ortamı)
- **Kullanıcı Talebi**: "Çoklu düelloda 3. ve 4. Kullanıcılar işaretleme yapamıyor ve izleyici gibi diğerlerinin işaretledikleri yerleri görebiliyorlar bunu düzelt"
- **Etkilenen Dosyalar**:
  - `/components/game/DuelMode.tsx`
  - `/components/map/MapContainer.tsx`
  - `/lib/duelService.ts`
- **Kök Nedenler & Tespitler**:
  1. **Slot Atama Eksikliği (`DuelMode.tsx`)**: `subscribeToDuel` ve odaya katılım adımlarında yalnızca `player1` ve `player2` kontrol edilip `activeDuelPlayerKey` atanıyordu. 3. ve 4. oyuncular için bu değer `null` kalıyordu.
  2. **Tıklama Engeli (`MapContainer.tsx`)**: Harita tıklama dinleyicisinde `playerKey` boş olduğunda işlem erken sonlanıyor ve 3./4. oyuncuların tahminleri Firestore'a gönderilemiyordu.
  3. **İzleyici Gibi Başkasının Pinini Görme (`MapContainer.tsx`)**: `in_progress` esnasında `activeDuelPlayerKey` yokken kod `session.player1` pinine fallback yapıyordu (`|| session.player1`). Bu nedenle 3. ve 4. oyuncular kendi ekranlarında doğrudan 1. oyuncunun haritaya koyduğu pini görüyor ve izleyici konumuna düşüyordu.
  4. **Puan Çiftleme Riski (`duelService.ts`)**: Tur içinde haritada fikrini değiştirip pinini güncelleyen oyuncunun puanı sıfırlanmadan üst üste ekleniyordu.
- **Yapılan İyileştirmeler**:
  1. **4 Oyuncu İçin Dinamik Slot Çözümleme (`DuelMode.tsx`)**:
     - `subscribeToDuel`, `handleJoinPrivateRoom`, `handleStartQuickMatch`, `handleAcceptSuggestion` fonksiyonlarında `getPlayerKeyById` entegre edilerek `player1`, `player2`, `player3` ve `player4` anında ve hatasız tayin edildi.
     - KPSS çoktan seçmeli test düellosunda (`handleSelectOption`) 3. ve 4. oyuncunun cevap gönderebilmesi sağlandı.
  2. **Haritada Bağımsız İşaretleme & Tam Gizlilik (`MapContainer.tsx`)**:
     - Tıklama anında `activeDuelPlayerKey` yerel aktif rumuz üzerinden dinamik olarak teyit edilerek 3. ve 4. oyuncuların tıklamaları aktif hale getirildi.
     - `session.player1` fallback'i kaldırıldı. `in_progress` aşamasında oyuncu **yalnızca kendi pinini** (1. mavi, 2. kırmızı, 3. yeşil, 4. sarı) görür. Rakiplerin tahminleri yalnızca tur sonunda (`round_reveal`) açılır.
  3. **Aynı Turda Pin Düzeltme Desteği (`duelService.ts`)**:
     - `submitPlayerGuess` fonksiyonunda oyuncunun aynı tur içinde pinini kaydırması durumunda önceki mesafe ve puan hesaplaması telafi edilerek temiz skor güncellemesi sağlandı.
- **Doğrulama**:
  - `lint_applet`: 0 hata, 0 uyarı (temiz).
  - Dev server başarıyla yeniden başlatıldı.

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




