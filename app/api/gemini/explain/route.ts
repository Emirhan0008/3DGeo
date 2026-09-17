import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (15 requests per minute per IP)
    const rateCheck = checkRateLimit(req, { limit: 15, windowSeconds: 60 });
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        { error: `Çok fazla istek gönderildi. Lütfen ${rateCheck.retryAfterSeconds} saniye bekleyin.` },
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
    const rawPrompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    const rawFeatureName = typeof body?.featureName === 'string' ? body.featureName.trim() : '';
    const rawCategory = typeof body?.category === 'string' ? body.category.trim() : '';

    if (!rawPrompt && !rawFeatureName) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir soru veya coğrafi konu girin.' },
        { status: 400 }
      );
    }

    // Sanitize and limit payload length to prevent DoS/overflow and prompt injection
    const prompt = rawPrompt.slice(0, 500).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
    const featureName = rawFeatureName.slice(0, 100).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
    const category = rawCategory.slice(0, 100).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API anahtarı yapılandırılmamış.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Sen KPSS Coğrafya Sınavına hazırlanan adaylar için uzman bir Coğrafya Eğitmeni ve Hafıza Teknikleri Rehberisin.
Görevin: Kullanıcının sorduğu Türkiye Coğrafyası (dağlar, akarsular, ovalar, platolar, gümrük kapıları, madenler, iklim, jeopolitik vb.) sorularına KPSS/ÖSYM mantığına %100 uygun, akılda kalıcı, kısa ve nokta atışı yanıtlar vermektir.

Kurallar:
1. Yanıtlarını net, maddeler halinde ve KPSS'de en çok çıkan püf noktaları öne çıkararak yaz.
2. Mümkünse akılda kalıcı KODLAMA / ŞİFRELEME (Hafıza tekniği) üret (Örn: Ege Kırık Dağları -> KAZ-MADRA-YUNT-BOZDAĞLAR-AYDIN-MENTEŞE).
3. ÖSYM'nin tuzaklı ve çeldirici soru tiplerini vurgula (Örn: "Hangisi volkanik değildir?", "Hangisinde demiryolu yoktur?").
4. Türkçe, samimi ve motive edici bir EdTech dili kullan.
`;

    const userPrompt = `
Kullanıcı sorusu: "${prompt}"
${featureName ? `İlgili Coğrafi Öğe: ${featureName} (${category || ''})` : ''}

Lütfen bu konuda KPSS adayı için özet bilgi, ÖSYM soru ihtimali ve akılda kalıcı kısa bir kodlama sun.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + '\n' + userPrompt }] }
      ]
    });

    const text = response.text || 'Üzgünüm, yanıt oluşturulamadı.';
    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const err = error as Error;
    return NextResponse.json(
      { error: err?.message || 'Bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
