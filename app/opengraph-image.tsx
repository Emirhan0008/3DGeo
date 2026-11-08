import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '3D Coğrafya - KPSS 3D Türkiye İnteraktif Haritası & Eğitim Platformu';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Subtle grid accent background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '9999px',
            padding: '10px 24px',
            color: '#fbbf24',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.05em',
            zIndex: 1,
          }}
        >
          <span>🇹🇷</span>
          <span>KPSS 3D TÜRKİYE COĞRAFYASI PLATFORMU</span>
        </div>

        {/* Center Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(to right, #ffffff, #fef08a, #f59e0b)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 16,
            }}
          >
            3D Coğrafya Haritası
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#94a3b8',
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            ÖSYM sınavlarına ezberle değil, 3 boyutlu kabartma haritada dokunarak ve canlı düellolarda yarışarak hazırlanın!
          </div>
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: 20,
              fontWeight: 600,
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⛰️</span>
            <span>3D Topoğrafik Kabartma</span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: 20,
              fontWeight: 600,
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚔️</span>
            <span>Canlı Çok Oyunculu Düello</span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: 20,
              fontWeight: 600,
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📕</span>
            <span>Akıllı Hata Defteri</span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: 20,
              fontWeight: 600,
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🤖</span>
            <span>Gemini AI Sınav Koçu</span>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            color: '#64748b',
            fontSize: 18,
            zIndex: 1,
            borderTop: '1px solid rgba(148, 163, 184, 0.15)',
            paddingTop: 16,
          }}
        >
          <span>kpss-3d-geo.vercel.app</span>
          <span>Açık Kaynak • Ücretsiz • ÖSYM Tam Uyumlu</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
