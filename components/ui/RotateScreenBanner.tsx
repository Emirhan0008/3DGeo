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
      {/* One rule: every child is either `min-w-0` (can ellipsis) or
          `shrink-0` (never squeezes). Phones get icon + one short line +
          icon-only action, which is the whole payload; the explanatory
          sentence only appears once there is width for it. */}
      <div className="hf-panel flex items-center gap-2 rounded-2xl p-2 text-[#f7f2e3] sm:p-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/12 text-[#dcc07d] sm:h-9 sm:w-9">
          {isPinGameAlert ? (
            <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Smartphone className="h-3.5 w-3.5 animate-spin-slow sm:h-4 sm:w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#e2c485]">
            <RotateCw className="hidden h-3 w-3 shrink-0 animate-spin sm:block" />
            <span className="hf-label min-w-0 truncate">
              {isPinGameAlert ? 'Tam ekran önerilir' : 'Ekranı yan çevirin'}
            </span>
            <span className="shrink-0 rounded-full border border-[#c9a24a]/30 px-1.5 py-0.5 text-[9px] tabular-nums text-[#c9c2a6]">
              {timeLeft}s
            </span>
          </div>
          <p className="mt-0.5 hidden truncate text-[11px] leading-tight text-[#a9a894] sm:block">
            {isPinGameAlert
              ? 'Haritayı geniş görmek için tam ekrana geçin ve telefonu yan çevirin.'
              : 'En iyi harita deneyimi için yatay mod ve tam ekran önerilir.'}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => {
              toggleFullscreen();
              setIsVisible(false);
            }}
            title="Tam Ekran"
            className="flex items-center gap-1 rounded-full border border-[#c9a24a]/70 bg-[linear-gradient(180deg,#f2e7ca,#d8c193)] p-1.5 text-[11px] font-bold text-[#2a2314] transition-all active:scale-95 sm:px-2.5 sm:py-1.5"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tam Ekran</span>
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 rounded-full p-1 text-[#9a9a88] transition-colors hover:text-[#d98a6a]"
            title="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
