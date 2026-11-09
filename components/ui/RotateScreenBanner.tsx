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
    <div className="fixed bottom-16 left-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 sm:bottom-3">
      <div className="hf-panel flex items-center justify-between gap-2 rounded-2xl p-2.5 text-[#eee5cd] sm:p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/12 text-[#dcc07d]">
            {isPinGameAlert ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Smartphone className="h-4 w-4 animate-spin-slow" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#e2c485]">
              <RotateCw className="h-3 w-3 animate-spin" />
              <span className="hf-label truncate">
                {isPinGameAlert ? 'Harita Testi için Tam Ekran' : 'Ekranı yan çevirin'}
              </span>
              <span className="ml-auto shrink-0 rounded-full border border-[#c9a24a]/30 px-1.5 py-0.5 text-[10px] text-[#b7ae8e]">
                {timeLeft}s
              </span>
            </div>
            <p className="truncate text-[10px] font-normal leading-tight text-[#9a9276] sm:text-[11px]">
              {isPinGameAlert
                ? 'Haritayı geniş görmek için tam ekrana geçin ve telefonu yan çevirin.'
                : 'En iyi harita deneyimi için yatay mod ve tam ekran önerilir.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => {
              toggleFullscreen();
              setIsVisible(false);
            }}
            className="flex items-center gap-1 rounded-full border border-[#c9a24a]/70 bg-[linear-gradient(180deg,#f2e7ca,#d8c193)] px-2.5 py-1.5 text-[11px] font-bold text-[#2a2314] transition-all active:scale-95"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Tam Ekran</span>
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 rounded-full p-1 text-[#8d8768] transition-colors hover:text-[#d98a6a]"
            title="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
