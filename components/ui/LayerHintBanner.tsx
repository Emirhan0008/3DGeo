'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { Sliders, X, Eye } from 'lucide-react';

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
      className="fixed top-14 sm:top-16 left-3 sm:left-4 z-40 max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-md border border-indigo-500/50 rounded-2xl shadow-2xl p-3.5 sm:p-4 text-slate-100 animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto ring-1 ring-white/10"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shrink-0 text-indigo-300 mt-0.5 shadow-inner">
            <Sliders className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-white">
                Harita Hızlandırıldı (Dilsiz Mod)
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                Ultra Hızlı
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300 mt-1 font-medium">
              İlk açılışta kasma olmaması için harita dilsiz ve temiz başlatıldı. İncelemek istediğiniz <span className="text-amber-300 font-bold">Dağlar, Akarsular, Göller, Madenler</span> vb. yer şekillerini <span className="text-indigo-300 font-bold">Katmanlar</span> sekmesinden açabilirsiniz.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-white/10">
        <button
          onClick={handleOpenLayers}
          className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 border border-indigo-400/60"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-200" />
          <span>Katmanları Aç</span>
        </button>

        <button
          onClick={handleEnableAllLayers}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all border border-white/15 flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tümünü Aç</span>
        </button>

        <button
          onClick={handleDismiss}
          className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          Anladım
        </button>
      </div>
    </div>
  );
}
