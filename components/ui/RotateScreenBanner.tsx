'use client';

import { useState, useEffect } from 'react';
import { RotateCw, X, Smartphone } from 'lucide-react';

export default function RotateScreenBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // Only trigger on mobile screens in portrait mode (height > width and width < 768)
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        const isPortraitMobile = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
        if (isPortraitMobile) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // 10 second countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 text-slate-950 p-0.5 rounded-2xl shadow-2xl animate-bounce">
      <div className="bg-[#09090b]/95 backdrop-blur-xl rounded-[14px] p-2.5 flex items-center justify-between gap-2.5 text-white border border-amber-400/50">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse shrink-0">
            <Smartphone className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>EKRANI YAN DÖNDÜRÜN</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 ml-auto">
                {timeLeft}s
              </span>
            </div>
            <p className="text-[10px] text-slate-200 font-medium leading-tight truncate">
              Daha rahat harita incelemesi için yatay mod önerilir.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20 transition-all shrink-0"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
