import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (10 requests per minute per IP for heavier analyze endpoint)
    const rateCheck = checkRateLimit(req, { limit: 10, windowSeconds: 60 });
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        { error: `Çok fazla analiz isteği gönderildi. Lütfen ${rateCheck.retryAfterSeconds} saniye bekleyin.` },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawStats = body?.stats && typeof body.stats === 'object' ? body.stats : {};

    // Sanitize and clamp numeric statistics to realistic boundaries
    const stats = {
      totalQuestionsAnswered: Math.min(Math.max(0, Number(rawStats.totalQuestionsAnswered) || 0), 100000),
      correctAnswersCount: Math.min(Math.max(0, Number(rawStats.correctAnswersCount) || 0), 100000),
      accuracyPct: Math.min(Math.max(0, Number(rawStats.accuracyPct) || 0), 100),
      avgDistanceKm: Math.min(Math.max(0, Number(rawStats.avgDistanceKm) || 0), 5000),
      maxWrongReg: String(rawStats.maxWrongReg || 'Yok').slice(0, 50).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, ''),
      maxWrongCat: String(rawStats.maxWrongCat || 'Yok').slice(0, 50).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, ''),
      missedItemsList: String(rawStats.missedItemsList || 'Henüz tespit edilen spesifik nokta yok').slice(0, 300).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '')
    };

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
      model: 'gemini-3.7-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + '\n' + userPrompt }] }
      ]
    });

    const text = response.text || 'Rapor oluşturulamadı.';
    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Gemini Analyze API Error:', error);
    const err = error as Error;
    return NextResponse.json(
      { error: err?.message || 'Bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
