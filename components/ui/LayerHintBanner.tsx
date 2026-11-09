'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { Sliders, X } from 'lucide-react';

export default function LayerHintBanner() {
  const { isSidebarOpen, setSidebarOpen, selectAllLayers, setBlindMapMode, activeTab } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in exploration 'map' tab
    if (activeTab !== 'map') {
      setIsVisible(false);
      return;
    }

    try {
      const dismissed = localStorage.getItem('kpss3d_layer_hint_seen_v2');
      if (!dismissed) {
        // Show after a brief delay so the map renders first smoothly
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, [activeTab]);

  // If user opens sidebar, auto-mark hint as acknowledged
  useEffect(() => {
    if (isSidebarOpen && isVisible) {
      handleDismiss();
    }
  }, [isSidebarOpen, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('kpss3d_layer_hint_seen_v2', 'true');
    } catch {
      // Ignore storage error
    }
  };

  const handleOpenLayers = () => {
    setSidebarOpen(true);
    handleDismiss();
  };

  const handleEnableAllLayers = () => {
    selectAllLayers();
    setBlindMapMode(false);
    handleDismiss();
  };

  if (!isVisible || activeTab !== 'map') return null;

  return (
    <div
      id="layer-initial-hint-banner"
      className="hf-panel fixed left-3 top-[92px] z-40 max-w-[290px] rounded-xl p-2.5 text-[#eee5cd] pointer-events-auto sm:left-4 sm:top-24 sm:max-w-xs sm:p-3"
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/12 text-[#dcc07d]">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="hf-serif text-xs font-semibold text-[#f0e6cd]">
              Harita Hızlandırıldı
            </span>
            <span className="hf-label rounded border border-[#c9a24a]/35 px-1 py-0.5 text-[8px] text-[#dcc07d]">
              Hızlı Mod
            </span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="-mr-0.5 -mt-0.5 shrink-0 cursor-pointer rounded-full p-1 text-[#8d8768] transition-colors hover:text-[#f0e6cd]"
          title="Kapat"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mt-1.5 text-[10.5px] font-normal leading-snug text-[#b7ae8e]">
        Açılışın hızlı olması için harita temiz başlatıldı. Yer şekillerini
        dilediğiniz zaman{' '}
        <span className="font-semibold text-[#dcc07d]">Katmanlar</span>{' '}
        menüsünden açabilirsiniz.
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-[#c9a24a]/15 pt-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleDismiss}
            className="cursor-pointer rounded-full border border-[#c9a24a]/70 bg-[linear-gradient(180deg,#f2e7ca,#d8c193)] px-3 py-1 text-[11px] font-bold text-[#2a2314] transition-all active:scale-95"
          >
            Anladım
          </button>

          <button
            onClick={handleOpenLayers}
            className="cursor-pointer rounded-full border border-[#c9a24a]/20 px-2 py-1 text-[11px] font-medium text-[#b7ae8e] transition-colors hover:border-[#c9a24a]/50 hover:text-[#f0e6cd]"
          >
            Katmanlar
          </button>
        </div>

        <button
          onClick={handleEnableAllLayers}
          className="cursor-pointer px-1 py-0.5 text-[9.5px] text-[#7d7a63] underline decoration-[#5f5c47] transition-colors hover:text-[#c3b993]"
          title="Tüm katmanları açar (düşük sistemlerde yavaşlama yapabilir)"
        >
          Tümünü Aç
        </button>
      </div>
    </div>
  );
}
