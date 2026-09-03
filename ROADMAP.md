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
