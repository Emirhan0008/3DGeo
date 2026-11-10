'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import LayerSidebar from '@/components/ui/LayerSidebar';
import FeatureDetailModal from '@/components/ui/FeatureDetailModal';
import PinGuessGame from '@/components/game/PinGuessGame';
import QuizTestGame from '@/components/game/QuizTestGame';
import DuelMode from '@/components/game/DuelMode';
import FlashcardMode from '@/components/game/FlashcardMode';
import StatsModal from '@/components/ui/StatsModal';
import AITutorDrawer from '@/components/ai/AITutorDrawer';
import BadgeNotificationToast from '@/components/ui/BadgeNotificationToast';
import AppFrame from '@/components/ui/AppFrame';
import RotateScreenBanner from '@/components/ui/RotateScreenBanner';
import LayerHintBanner from '@/components/ui/LayerHintBanner';
import { useAppStore } from '@/lib/store/useStore';
import { tabFromPathname } from '@/lib/tabRoutes';

// Dynamic import MapContainer with SSR disabled to prevent WebGL window context crashes
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
      <div className="w-10 h-10 rounded-full border border-[#c9a24a]/25 border-t-[#c9a24a] animate-spin" />
      <span className="hf-label text-[10px] text-[#a98f4e]">
        3D Türkiye Topoğrafya Motoru Yükleniyor
      </span>
    </div>
  ),
});

export default function HomePageClient() {
  const { activeTab, setActiveTab, setAiDrawerOpen, isSidebarOpen, isAiDrawerOpen, closeAllSidebars } = useAppStore();

  const isAnySidebarOpen = isSidebarOpen || isAiDrawerOpen;

  /* Deep links + browser back/forward: keep the store in step with the URL.
     The Navbar pushes history itself, so this only has to react to it. */
  useEffect(() => {
    // Daily-return bonus: pays once per calendar day, on first mount.
    useAppStore.getState().touchDailyStreak();

    const syncFromUrl = () => {
      const tab = tabFromPathname(window.location.pathname);
      if (!tab) return;
      setActiveTab(tab);
      // /ai-ogretmen is a drawer, not a tab screen
      if (tab === 'ai_tutor') setAiDrawerOpen(true);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [setActiveTab, setAiDrawerOpen]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 font-sans select-none"
      style={{ padding: 'var(--hf-band)' }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* 3D Map canvas */}
        <MapContainer />

        {/* Brass plate frame — the engraved-atlas border of the reference */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 ring-1 ring-inset ring-[#c9a24a]/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px bg-gradient-to-r from-transparent via-[#c9a24a]/35 to-transparent"
        />

        {/* Global Sidebar Dismiss Backdrop: Closes sidebars when tapping on map area without clicking map features or making accidental guesses */}
        {isAnySidebarOpen && (
          <div
            id="sidebar-backdrop-dismiss"
            className="absolute inset-0 z-35 bg-black/20 backdrop-blur-[0.5px] transition-all duration-200 cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              closeAllSidebars();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              closeAllSidebars();
            }}
          />
        )}

        {/* Floating Controls & Modals */}
        <LayerSidebar />
        <LayerHintBanner />
        <FeatureDetailModal />
        <AITutorDrawer />
        <BadgeNotificationToast />
        <RotateScreenBanner />

        {/* Tab Specific Gamification Overlays */}
        {activeTab === 'pin_game' && <PinGuessGame />}
        {activeTab === 'duel' && <DuelMode />}
        {activeTab === 'quiz_test' && <QuizTestGame />}
        {activeTab === 'flashcards' && <FlashcardMode />}
        {activeTab === 'stats' && <StatsModal />}
      </main>

      {/* Mounted-plate atlas frame around the whole app */}
      <AppFrame />
    </div>
  );
}
