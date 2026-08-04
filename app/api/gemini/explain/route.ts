import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, featureName, category } = await req.json();

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
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + '\n' + userPrompt }] }
      ]
    });

    const text = response.text || 'Üzgünüm, yanıt oluşturulamadı.';
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
