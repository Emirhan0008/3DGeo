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
  { tab: 'pin_game', label: 'Harita Testi', short: 'Harita', Icon: MapPin },
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
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      {/* The compass medallion IS the logo and the layer toggle. A separate
          layers button sat next to it and cost 40px of bar width on phones
          without adding a capability — the sidebar spine opens the same
          plate, so the two are merged here. */}
      <button
        onClick={toggleSidebar}
        title="Harita katmanlarını aç / kapat"
        aria-label="Harita katmanlarını aç / kapat"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c9a24a]/45 bg-[radial-gradient(circle_at_32%_26%,#2b3118,#0f1209_78%)] text-[#c9a24a] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_4px_12px_-6px_rgba(0,0,0,.9)] transition-colors hover:border-[#c9a24a]/75 active:scale-95 sm:h-10 sm:w-10"
      >
        <CompassRose className="h-7 w-7 sm:h-8 sm:w-8" />
        <span className="pointer-events-none absolute inset-[3px] rounded-full border border-[#c9a24a]/20" />
        {activeLayersCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full border border-[#0f1209] bg-[#c9a24a] px-0.5 text-[8px] font-bold text-[#221b0c]">
            {activeLayersCount}
          </span>
        )}
      </button>

      <div
        className="hidden cursor-pointer leading-none sm:block"
        onClick={() => handleTabChange('map')}
      >
        <div className="hf-serif text-[14px] font-semibold tracking-[0.18em] text-[#f4ebd4]">
          COĞRAFYA <span className="text-[#d9b45f]">3D</span>
        </div>
        <div className="mt-1.5 text-[8.5px] uppercase tracking-[0.24em] text-[#b5a06a]">
          Keşfet · Anla · Pekiştir
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
            ? 'flex-1 justify-center px-1 py-1 text-[10px] sm:flex-none sm:px-2 sm:py-1'
            : 'px-2.5 py-1.5 text-[12px]'
        } ${
          isActive
            ? 'hf-serif border-[#8a6a1d]/70 bg-[linear-gradient(180deg,#f8f0da,#e5d3a8)] font-semibold text-[#241d0c] shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_4px_10px_-4px_rgba(0,0,0,.75)]'
            : 'hf-serif border-transparent font-medium text-[#cdb878] hover:border-[#c9a24a]/25 hover:bg-[#c9a24a]/10 hover:text-[#f2e8cf]'
        }`}
      >
        <t.Icon
          className={`shrink-0 ${
            compact ? 'hidden h-3 w-3 sm:block' : 'h-3.5 w-3.5'
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
                  className="mx-1 hidden h-4 shrink-0 items-center gap-1 2xl:flex"
                >
                  <span className="h-3 w-px bg-gradient-to-b from-transparent via-[#c9a24a]/25 to-transparent" />
                  <span className="text-[6px] leading-none text-[#c9a24a]/45">◆</span>
                  <span className="h-3 w-px bg-gradient-to-b from-transparent via-[#c9a24a]/25 to-transparent" />
                </span>
              )}
              {renderTab(t)}
            </Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0 sm:gap-1.5">
          {/* Ornament: armillary sphere medallion */}
          <ArmillarySphere className="hidden h-8 w-8 shrink-0 opacity-50 2xl:block" />

          {/* Leaderboard */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            title="Global sıralama tablosu"
            className="flex items-center gap-1.5 rounded-full border border-[#c9a24a]/35 px-2 py-1 text-[11px] font-semibold text-[#dcc07d] transition-colors hover:border-[#c9a24a]/75 hover:bg-[#c9a24a]/10 hover:text-[#f3e4bd]"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Sıralama</span>
          </button>

          {/* Search — hidden on phones: the tab rail below already gives the
              only navigation a 360px screen can hold. */}
          <div className="relative hidden sm:block">
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
                className="hf-serif w-20 rounded-full border border-[#c9a24a]/25 bg-[#0c0f08]/80 py-1 pl-7 pr-2 text-[11px] tracking-wide text-[#f5ecd4] placeholder:text-[#7c7660] focus:border-[#c9a24a]/70 focus:outline-none sm:w-28 sm:pl-8 sm:pr-3 xl:w-36 2xl:w-44"
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
            <span className="hidden 2xl:inline">
              {isFullscreen ? 'Çık' : 'Tam Ekran'}
            </span>
          </button>

          <AuthUserButton />

          {/* Feedback */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            title="Geri bildirim gönder"
            className="hidden h-8 w-8 place-items-center rounded-full border border-[#c9a24a]/25 text-[#a89f7e] transition-colors hover:border-[#c9a24a]/60 hover:text-[#e6d3a4] sm:grid"
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
            <span className="hidden 2xl:inline">AI Asistan</span>
          </button>
        </div>
      </div>

      {/* ---------- mobile tab rail ---------- */}
      <div className="hf-rule mt-1 flex lg:hidden sm:mt-1.5" />
      <div className="hf-scroll mt-0.5 flex w-full items-center gap-0 overflow-x-auto pb-0.5 sm:mt-1 sm:gap-1 lg:hidden">
        {TABS.map((t, i) => (
          <Fragment key={t.tab}>
            {i > 0 && (
              <span className="hidden select-none text-[7px] text-[#c9a24a]/25 sm:inline">◆</span>
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
      <header className="hf-nav relative z-30 w-full select-none px-1.5 py-1.5 text-[#f5ecd4] sm:px-3 sm:py-2">
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
