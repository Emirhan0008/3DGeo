'use client';

import React, { Fragment, useState } from 'react';
import { useAppStore, type ActiveTabType } from '@/lib/store/useStore';
import { ALL_GEO_FEATURES } from '@/lib/data/turkeyData';
import {
  Map,
  MapPin,
  HelpCircle,
  BookOpen,
  BarChart3,
  Bot,
  Search,
  Layers,
  Maximize2,
  Minimize2,
  Swords,
  Trophy,
  MessageSquarePlus,
} from 'lucide-react';
import { useAppFullscreen } from '@/lib/utils';
import AuthUserButton from './AuthUserButton';
import GlobalLeaderboardModal from './GlobalLeaderboardModal';
import FeedbackModal from './FeedbackModal';
import { CompassRose, ArmillarySphere } from '@/components/ui/MapOrnaments';
import { TAB_ROUTES } from '@/lib/tabRoutes';

type TabDef = {
  tab: ActiveTabType;
  label: string;
  short: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const TABS: TabDef[] = [
  { tab: 'map', label: 'Keşif', short: 'Keşif', Icon: Map },
  { tab: 'pin_game', label: 'Harita Testi', short: 'Harita Testi', Icon: MapPin },
  { tab: 'duel', label: 'Düello', short: 'Düello', Icon: Swords },
  { tab: 'quiz_test', label: 'KPSS Testi', short: 'KPSS', Icon: HelpCircle },
  { tab: 'flashcards', label: 'Ezber', short: 'Ezber', Icon: BookOpen },
  { tab: 'stats', label: 'Analiz', short: 'Analiz', Icon: BarChart3 },
];

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    setSelectedFeature,
    flyToCoords,
    toggleSidebar,
    layers,
    setAiDrawerOpen,
    isAiDrawerOpen,
  } = useAppStore();

  const activeLayersCount = Object.values(layers).filter(Boolean).length;

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { isFullscreen, toggleFullscreen } = useAppFullscreen();

  // Search autocomplete items
  const filteredSearchItems = searchTerm.trim()
    ? ALL_GEO_FEATURES.filter(
        (f) =>
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.region.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectSearchResult = (feature: (typeof ALL_GEO_FEATURES)[0]) => {
    setSelectedFeature(feature);
    flyToCoords(feature.coordinates, 65, 25, 10);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleTabChange = (tab: ActiveTabType) => {
    setActiveTab(tab);

    // Keep the address bar honest without remounting the map.
    const nextPath = TAB_ROUTES[tab] ?? '/';
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({ tab }, '', nextPath);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Shared chrome pieces                                            */
  /* ---------------------------------------------------------------- */

  const brandMark = (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={toggleSidebar}
        title="Harita katmanlarını aç / kapat"
        className="relative grid h-8 w-8 place-items-center rounded-full border border-[#c9a24a]/35 bg-[#141709] text-[#c9a24a] transition-colors hover:border-[#c9a24a]/70 hover:text-[#e6c784] active:scale-95"
      >
        <Layers className="h-3.5 w-3.5" />
        {activeLayersCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full border border-[#0f1209] bg-[#c9a24a] px-1 text-[9px] font-bold text-[#221b0c]">
            {activeLayersCount}
          </span>
        )}
      </button>

      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => handleTabChange('map')}
      >
        <div className="relative grid h-10 w-10 place-items-center rounded-full border border-[#c9a24a]/45 bg-[radial-gradient(circle_at_32%_26%,#2b3118,#0f1209_78%)] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_4px_12px_-6px_rgba(0,0,0,.9)]">
          <CompassRose className="h-8 w-8" />
          <span className="pointer-events-none absolute inset-[3px] rounded-full border border-[#c9a24a]/20" />
        </div>
        <div className="hidden leading-none sm:block">
          <div className="hf-serif text-[14px] font-semibold tracking-[0.18em] text-[#f4ebd4]">
            COĞRAFYA <span className="text-[#d9b45f]">3D</span>
          </div>
          <div className="mt-1.5 text-[8.5px] uppercase tracking-[0.24em] text-[#b5a06a]">
            Keşfet · Anla · Pekiştir
          </div>
        </div>
      </div>
    </div>
  );

  const renderTab = (t: TabDef, compact = false) => {
    const isActive = activeTab === t.tab;
    return (
      <button
        key={t.tab}
        onClick={() => handleTabChange(t.tab)}
        title={t.label}
        className={`group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border transition-all duration-150 ${
          compact
            ? 'px-2 py-1 text-[10px]'
            : 'px-2.5 py-1.5 text-[12px]'
        } ${
          isActive
            ? 'hf-serif border-[#8a6a1d]/70 bg-[linear-gradient(180deg,#f8f0da,#e5d3a8)] font-semibold text-[#241d0c] shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_4px_10px_-4px_rgba(0,0,0,.75)]'
            : 'hf-serif border-transparent font-medium text-[#cdb878] hover:border-[#c9a24a]/25 hover:bg-[#c9a24a]/10 hover:text-[#f2e8cf]'
        }`}
      >
        <t.Icon
          className={`shrink-0 ${
            compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
          } ${
            isActive ? 'text-[#7a5c17]' : 'text-[#c9a24a] group-hover:text-[#dcc07d]'
          }`}
        />
        <span className={compact ? '' : 'hidden xl:inline'}>
          {compact ? t.short : t.label}
        </span>
      </button>
    );
  };

  const renderNavbarContent = () => (
    <>
      {/* ---------- primary row ---------- */}
      <div className="flex w-full items-center justify-between gap-2">
        {brandMark}

        <nav className="hidden items-center gap-0.5 lg:flex">
          {TABS.map((t, i) => (
            <Fragment key={t.tab}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-0.5 h-4 w-px shrink-0 bg-[#c9a24a]/20"
                />
              )}
              {renderTab(t)}
            </Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Ornament: armillary sphere medallion */}
          <ArmillarySphere className="hidden h-8 w-8 shrink-0 opacity-50 xl:block" />

          {/* Leaderboard */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            title="Global sıralama tablosu"
            className="flex items-center gap-1.5 rounded-full border border-[#c9a24a]/35 px-2 py-1 text-[11px] font-semibold text-[#dcc07d] transition-colors hover:border-[#c9a24a]/75 hover:bg-[#c9a24a]/10 hover:text-[#f3e4bd]"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sıralama</span>
          </button>

          {/* Search */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#b5a06a]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => window.setTimeout(() => setShowSearchResults(false), 140)}
                placeholder="Ara..."
                className="hf-serif w-24 rounded-full border border-[#c9a24a]/25 bg-[#0c0f08]/80 py-1 pl-8 pr-3 text-[11px] tracking-wide text-[#f5ecd4] placeholder:text-[#7c7660] focus:border-[#c9a24a]/70 focus:outline-none sm:w-36 md:w-44"
              />
            </div>

            {showSearchResults && filteredSearchItems.length > 0 && (
              <div className="hf-panel absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl">
                {filteredSearchItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    className="flex w-full items-center justify-between gap-2 border-b border-[#c9a24a]/10 px-3 py-2 text-left text-[11px] transition-colors last:border-0 hover:bg-[#c9a24a]/12"
                  >
                    <span className="truncate font-semibold text-[#e5dcc2]">
                      {item.name}
                    </span>
                    <span className="shrink-0 rounded border border-[#c9a24a]/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#9a9070]">
                      {item.region}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all active:scale-95 ${
              isFullscreen
                ? 'border-[#c9a24a]/40 bg-[#c9a24a]/12 text-[#e2c485]'
                : 'border-[#c9a24a]/70 bg-[linear-gradient(180deg,#f2e7ca,#d8c193)] text-[#2a2314] shadow-[inset_0_1px_0_rgba(255,255,255,.6)] hover:brightness-105'
            }`}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">
              {isFullscreen ? 'Çık' : 'Tam Ekran'}
            </span>
          </button>

          <AuthUserButton />

          {/* Feedback */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            title="Geri bildirim gönder"
            className="grid h-8 w-8 place-items-center rounded-full border border-[#c9a24a]/25 text-[#a89f7e] transition-colors hover:border-[#c9a24a]/60 hover:text-[#e6d3a4]"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
          </button>

          {/* AI tutor */}
          <button
            onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
            title="Yapay zeka KPSS asistanı"
            className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold transition-colors ${
              isAiDrawerOpen
                ? 'border-[#c9a24a]/70 bg-[#c9a24a]/15 text-[#f0dba8]'
                : 'border-[#c9a24a]/25 text-[#d3bb85] hover:border-[#c9a24a]/60 hover:text-[#eadfbf]'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">AI Asistan</span>
          </button>
        </div>
      </div>

      {/* ---------- mobile tab rail ---------- */}
      <div className="hf-rule mt-1.5 flex lg:hidden" />
      <div className="hf-scroll mt-1 flex w-full items-center gap-1 overflow-x-auto pb-0.5 lg:hidden">
        {TABS.map((t, i) => (
          <Fragment key={t.tab}>
            {i > 0 && (
              <span className="select-none text-[7px] text-[#c9a24a]/25">◆</span>
            )}
            {renderTab(t, true)}
          </Fragment>
        ))}
      </div>
    </>
  );

  // In Fullscreen Mode: dedicated floating "Küçült" brass button
  if (isFullscreen) {
    return (
      <>
        <div className="pointer-events-auto fixed right-3 top-3 z-50 select-none">
          <button
            onClick={toggleFullscreen}
            title="Ekranı küçült"
            className="flex items-center gap-1.5 rounded-full border border-[#c9a24a]/70 bg-[#101208]/95 px-3 py-1.5 text-[11px] font-bold text-[#e2c485] shadow-2xl backdrop-blur-xl transition-all hover:bg-[#c9a24a] hover:text-[#221b0c] active:scale-95"
          >
            <Minimize2 className="h-4 w-4" />
            <span>Küçült</span>
          </button>
        </div>
        <GlobalLeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
        />
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      </>
    );
  }

  // Standard top bar
  return (
    <>
      <header className="hf-nav relative z-30 w-full select-none px-2 py-2 text-[#f5ecd4] sm:px-3">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a24a]/45 to-transparent" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a24a]/25 to-transparent" />
        {renderNavbarContent()}
      </header>
      <GlobalLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
