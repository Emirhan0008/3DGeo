import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { stats } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API anahtarı yapılandırılmamış.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Sen KPSS Coğrafya Sınavına hazırlanan adaylar için kıdemli ve neşeli bir Uzman ÖSYM Coğrafya Sınav Koçusun.
Sana kullanıcının harita testi ve KPSS soru istatistikleri, yanlış yaptığı bölgeler, zorlandığı konu başlıkları ve ortalama harita sapma mesafesi verilecek.

Görevin:
1. Kullanıcının mevcut KPSS Coğrafya seviyesini değerlendiren motive edici ve yapıcı bir "KPSS Coğrafya Teşhis ve Aşı Raporu" yazmak.
2. Zayıf olduğu bölge ve konular için KPSS'de en çok çıkan püf noktalarını ve akılda kalıcı KODLAMALARI (Şifrelemeleri) sunmak.
3. ÖSYM'nin bu konulardaki en popüler çeldirici soru tuzaklarını açıklamak.
4. Önümüzdeki günlerde uygulamada yapması gereken 3 somut eylem adımını sıralamak.

Yanıt formatı:
- Şık ve modern Markdown formatında yaz.
- Başlıklar net olsun (Örn: "🎯 Mevcut Seviye Değerlendirmesi", "⚠️ Kritik Eksiklikler & Hafıza Şifreleri", "💡 ÖSYM Soru Tuzakları", "🚀 3 Adımlı Eylem Planı").
- İki veya üç paragrafı geçmeyen, akıcı ve samimi bir üslup kullan.
`;

    const userPrompt = `
Kullanıcı Performans Verileri:
- Toplam Soru: ${stats.totalQuestionsAnswered || 0}
- Doğru Cevap: ${stats.correctAnswersCount || 0}
- Başarı Oranı: %${stats.accuracyPct || 0}
- Harita Sapma Mesafesi Ortalama: ${stats.avgDistanceKm || 0} km
- En Çok Hata Yapılan Bölge: ${stats.maxWrongReg || 'Yok'}
- En Çok Zorlanılan Konu: ${stats.maxWrongCat || 'Yok'}
- Sık Karıştırılan Coğrafi Noktalar: ${stats.missedItemsList || 'Henüz tespit edilen spesifik nokta yok'}

Lütfen bu verilere göre kullanıcıya özel detaylı KPSS Akıllı Teşhis Raporu üret.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + '\n' + userPrompt }] }
      ]
    });

    const text = response.text || 'Rapor oluşturulamadı.';
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Gemini Analyze API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
