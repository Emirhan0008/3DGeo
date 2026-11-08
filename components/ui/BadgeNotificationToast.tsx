'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { Sparkles, X } from 'lucide-react';

export default function BadgeNotificationToast() {
  const { latestUnlockedBadge, clearLatestUnlockedBadge } = useAppStore();

  useEffect(() => {
    if (latestUnlockedBadge) {
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        clearLatestUnlockedBadge();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [latestUnlockedBadge, clearLatestUnlockedBadge]);

  if (!latestUnlockedBadge) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm w-full">
      <div className="relative overflow-hidden p-4 rounded-2xl bg-[#09090b]/95 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 backdrop-blur-2xl text-white">
        {/* Glowing background gradient effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 shrink-0 animate-bounce">
              {latestUnlockedBadge.icon || '🏆'}
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
                <span>YENİ ROZET KAZANILDINI!</span>
              </div>
              <h3 className="font-extrabold text-sm text-white leading-snug mt-0.5">
                {latestUnlockedBadge.name}
              </h3>
              <p className="text-[11px] text-slate-300 leading-tight mt-1">
                {latestUnlockedBadge.desc}
              </p>
            </div>
          </div>

          <button
            onClick={clearLatestUnlockedBadge}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
