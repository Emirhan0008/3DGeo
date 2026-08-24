'use client';

import { useState, useEffect } from 'react';
import { RotateCw, X, Smartphone, Maximize2 } from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import { useAppFullscreen } from '@/lib/utils';

export default function RotateScreenBanner() {
  const { activeTab } = useAppStore();
  const { isFullscreen, toggleFullscreen } = useAppFullscreen();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPinGameAlert, setIsPinGameAlert] = useState(false);

  useEffect(() => {
    // Trigger on mobile portrait mode OR when entering pin_game and not in fullscreen
    const checkStatus = () => {
      if (typeof window !== 'undefined') {
        const isPortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
        if (activeTab === 'pin_game' && !isFullscreen) {
          setIsPinGameAlert(true);
          setIsVisible(true);
          setTimeLeft(10);
        } else if (isPortrait && !isFullscreen) {
          setIsPinGameAlert(false);
          setIsVisible(true);
        } else if (isFullscreen) {
          setIsVisible(false);
        }
      }
    };

    checkStatus();
    window.addEventListener('resize', checkStatus);
    window.addEventListener('orientationchange', checkStatus);

    return () => {
      window.removeEventListener('resize', checkStatus);
      window.removeEventListener('orientationchange', checkStatus);
    };
  }, [activeTab, isFullscreen]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible || isFullscreen) return null;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 text-slate-950 p-0.5 rounded-2xl shadow-2xl animate-bounce">
      <div className="bg-[#09090b]/95 backdrop-blur-2xl rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between gap-2 text-white border border-amber-400/60 shadow-inner">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-1.5 sm:p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse shrink-0">
            {isPinGameAlert ? <Maximize2 className="w-5 h-5" /> : <Smartphone className="w-5 h-5 animate-spin-slow" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>{isPinGameAlert ? 'HARİTA TESTİ İÇİN TAM EKRAN' : 'EKRANI YAN ÇEVİRİN'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 ml-auto">
                {timeLeft}s
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-tight truncate">
              {isPinGameAlert 
                ? 'Haritayı geniş görmek için Tam Ekrana geçin ve telefonu yan çevirin.'
                : 'En iyi harita deneyimi için yatay mod & tam ekran önerilir.'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              toggleFullscreen();
              setIsVisible(false);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Tam Ekran</span>
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20 transition-all shrink-0"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
