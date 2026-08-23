'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/ui/Navbar';
import LayerSidebar from '@/components/ui/LayerSidebar';
import FeatureDetailModal from '@/components/ui/FeatureDetailModal';
import PinGuessGame from '@/components/game/PinGuessGame';
import QuizTestGame from '@/components/game/QuizTestGame';
import FlashcardMode from '@/components/game/FlashcardMode';
import StatsModal from '@/components/ui/StatsModal';
import AITutorDrawer from '@/components/ai/AITutorDrawer';
import BadgeNotificationToast from '@/components/ui/BadgeNotificationToast';
import RotateScreenBanner from '@/components/ui/RotateScreenBanner';
import { useAppStore } from '@/lib/store/useStore';

// Dynamic import MapContainer with SSR disabled to prevent WebGL window context crashes
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span className="font-bold text-xs tracking-wider uppercase text-amber-400">
        3D Türkiye Topoğrafya Motoru Yükleniyor...
      </span>
    </div>
  ),
});

export default function HomePageClient() {
  const { activeTab } = useAppStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 font-sans select-none">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* 3D Map canvas */}
        <MapContainer />

        {/* Floating Controls & Modals */}
        <LayerSidebar />
        <FeatureDetailModal />
        <AITutorDrawer />
        <BadgeNotificationToast />
        <RotateScreenBanner />

        {/* Tab Specific Gamification Overlays */}
        {activeTab === 'pin_game' && <PinGuessGame />}
        {activeTab === 'quiz_test' && <QuizTestGame />}
        {activeTab === 'flashcards' && <FlashcardMode />}
        {activeTab === 'stats' && <StatsModal />}
      </main>
    </div>
  );
}
