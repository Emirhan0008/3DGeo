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
      className="fixed top-14 sm:top-16 left-3 sm:left-4 z-40 max-w-[290px] sm:max-w-xs bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-xl shadow-xl p-2.5 sm:p-3 text-slate-100 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto ring-1 ring-white/10"
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-300 shadow-inner">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">
              Harita Hızlandırıldı
            </span>
            <span className="px-1 py-0.2 text-[8.5px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
              Hızlı Mod
            </span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors shrink-0 -mr-0.5 -mt-0.5 cursor-pointer"
          title="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[10.5px] leading-snug text-slate-300 mt-1.5 font-normal">
        Açılışın hızlı olması için harita temiz başlatıldı. Yer şekillerini dilediğiniz zaman <span className="text-indigo-300 font-semibold">Katmanlar</span> menüsünden açabilirsiniz.
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-2 border-t border-white/10">
        <div className="flex items-center gap-1">
          <button
            onClick={handleDismiss}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm shadow-indigo-600/30 border border-indigo-400/60 cursor-pointer"
          >
            Anladım
          </button>

          <button
            onClick={handleOpenLayers}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 hover:text-white rounded-lg text-[11px] font-medium transition-colors border border-white/10 cursor-pointer"
          >
            Katmanlar
          </button>
        </div>

        <button
          onClick={handleEnableAllLayers}
          className="text-[9.5px] text-slate-500 hover:text-slate-300 transition-colors underline decoration-slate-600 hover:decoration-slate-400 cursor-pointer px-1 py-0.5"
          title="Tüm katmanları açar (düşük sistemlerde yavaşlama yapabilir)"
        >
          Tümünü Aç
        </button>
      </div>
    </div>
  );
}
