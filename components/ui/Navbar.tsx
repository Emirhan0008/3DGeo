'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { ALL_GEO_FEATURES } from '@/lib/data/turkeyData';
import { 
  Map, 
  MapPin, 
  HelpCircle, 
  BookOpen, 
  BarChart3, 
  Bot, 
  Search, 
  Mountain,
  Sliders,
  Maximize2,
  Minimize2,
  Swords,
  Trophy,
  MessageSquarePlus
} from 'lucide-react';
import { useAppFullscreen } from '@/lib/utils';
import AuthUserButton from './AuthUserButton';
import GlobalLeaderboardModal from './GlobalLeaderboardModal';
import FeedbackModal from './FeedbackModal';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    setSelectedFeature,
    flyToCoords,
    toggleSidebar,
    layers,
    setAiDrawerOpen,
    isAiDrawerOpen
  } = useAppStore();

  const activeLayersCount = Object.values(layers).filter(Boolean).length;

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { isFullscreen, toggleFullscreen } = useAppFullscreen();

  // Search autocomplete items
  const filteredSearchItems = searchTerm.trim()
    ? ALL_GEO_FEATURES.filter((f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.region.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectSearchResult = (feature: typeof ALL_GEO_FEATURES[0]) => {
    setSelectedFeature(feature);
    flyToCoords(feature.coordinates, 65, 25, 10);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  // Render Inner Content of Navbar (Used in both standard and fullscreen drawer modes)
  const renderNavbarContent = () => (
    <>
      <div className="flex items-center justify-between gap-1 sm:gap-2 w-full">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={toggleSidebar}
            className={`p-1 sm:p-1.5 border rounded-lg sm:rounded-xl text-indigo-200 transition-all flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold active:scale-95 shrink-0 shadow-sm cursor-pointer ${
              activeLayersCount > 0
                ? 'bg-indigo-600/30 hover:bg-indigo-600/45 border-indigo-400/80 text-white shadow-indigo-500/20'
                : 'bg-indigo-500/20 hover:bg-indigo-500/35 border-indigo-400/60'
            }`}
            title="Katmanları Aç/Kapat (Yer Şekilleri, Madenler, Sınırlar)"
          >
            {activeLayersCount === 0 ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
            ) : (
              <span className="px-1 py-0.2 text-[9px] sm:text-[10px] font-black bg-indigo-500 text-white rounded-md">
                {activeLayersCount}
              </span>
            )}
            <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-300" />
            <span className="hidden xs:inline text-[11px] sm:text-xs">Katmanlar</span>
          </button>

          <div 
            className="flex items-center gap-1 cursor-pointer shrink-0" 
            onClick={() => handleTabChange('map')}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md border border-white/20 shrink-0">
              <Mountain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-tight text-white hidden md:inline">
              COĞRAFYA <span className="text-amber-400">3D</span>
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs (Desktop & Wide Landscape View) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#09090b]/80 p-0.5 sm:p-1 rounded-xl border border-white/15 shadow-inner overflow-x-auto scrollbar-none shrink">
          <button
            onClick={() => handleTabChange('map')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border shrink-0 ${
              activeTab === 'map'
                ? 'bg-indigo-600 text-white border-indigo-300 shadow-md shadow-indigo-500/30 ring-1 ring-indigo-300'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-indigo-400/60 hover:text-white'
            }`}
          >
            <Map className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
            <span>Keşif</span>
          </button>

          <button
            onClick={() => handleTabChange('pin_game')}
            className={`relative px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border-2 shrink-0 ${
              activeTab === 'pin_game'
                ? 'bg-amber-500 text-slate-950 border-amber-200 shadow-md shadow-amber-500/40 ring-2 ring-amber-300'
                : 'bg-amber-500/15 text-amber-300 border-amber-400/60 hover:bg-amber-500/25 hover:border-amber-300 shadow-sm shadow-amber-500/20'
            }`}
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-amber-400"></span>
            </span>
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            <span>Harita Testi</span>
          </button>

          <button
            onClick={() => handleTabChange('duel')}
            className={`relative px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border-2 shrink-0 ${
              activeTab === 'duel'
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-slate-950 border-amber-300 shadow-md shadow-red-500/40 ring-2 ring-amber-300'
                : 'bg-red-500/20 text-amber-300 border-red-400/60 hover:bg-red-500/30 hover:border-amber-300 shadow-sm shadow-red-500/20'
            }`}
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-amber-400"></span>
            </span>
            <Swords className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 stroke-[2.5]" />
            <span>1v1 Düello</span>
          </button>

          <button
            onClick={() => handleTabChange('quiz_test')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border shrink-0 ${
              activeTab === 'quiz_test'
                ? 'bg-emerald-600 text-white border-emerald-300 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-300'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-emerald-400/60 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span>KPSS Testi</span>
          </button>

          <button
            onClick={() => handleTabChange('flashcards')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border shrink-0 ${
              activeTab === 'flashcards'
                ? 'bg-purple-600 text-white border-purple-300 shadow-md shadow-purple-500/30 ring-1 ring-purple-300'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-purple-400/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400" />
            <span>Ezber</span>
          </button>

          <button
            onClick={() => handleTabChange('stats')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border shrink-0 ${
              activeTab === 'stats'
                ? 'bg-cyan-600 text-white border-cyan-300 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-cyan-400/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            <span>Analiz</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Global Leaderboard Button */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/10 hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 text-amber-300 border border-amber-400/50 hover:border-amber-300 text-[10px] sm:text-xs font-black flex items-center gap-1 sm:gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Global Sıralama ve Canlı Liderlik Tablosunu Aç"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
            <span className="font-extrabold tracking-tight hidden xs:inline">Sıralama</span>
          </button>

          {/* Search Bar */}
          <div className="relative w-14 xs:w-20 sm:w-28 md:w-36">
            <div className="relative flex items-center">
              <Search className="absolute left-1.5 sm:left-2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Ara..."
                className="w-full pl-5 sm:pl-6 pr-1 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchResults && filteredSearchItems.length > 0 && (
              <div className="absolute top-full right-0 mt-1.5 w-48 sm:w-56 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {filteredSearchItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-white/10 flex items-center justify-between border-b border-white/5 last:border-0"
                  >
                    <span className="font-bold text-slate-200 truncate">{item.name}</span>
                    <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400 shrink-0 ml-1">
                      {item.region}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border transition-all text-[9px] sm:text-xs font-black flex items-center gap-1 active:scale-95 shadow-md shrink-0 cursor-pointer ${
              isFullscreen
                ? 'bg-slate-800 text-amber-300 border-amber-400/60 shadow-amber-500/20'
                : activeTab === 'pin_game'
                ? 'ring-2 ring-amber-400 bg-amber-400 text-slate-950 font-black shadow-lg border-amber-200'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-amber-200 ring-1 ring-amber-400/40 shadow-amber-500/30 hover:brightness-110'
            }`}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Uygulamayı Tam Ekran Yap (Haritayı Büyüt)'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            ) : (
              <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 font-black" />
            )}
            <span className="font-black uppercase tracking-tight hidden md:inline">
              {isFullscreen ? 'Çık' : 'Tam Ekran'}
            </span>
          </button>

          {/* Firebase User Auth */}
          <AuthUserButton />

          {/* Feedback Button */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl border transition-all text-xs font-bold flex items-center gap-1 shrink-0 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 cursor-pointer"
            title="Geri Bildirim & Öneri Gönder"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="hidden xl:inline text-[11px]">Geri Bildirim</span>
          </button>

          {/* AI Tutor Button */}
          <button
            onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
            className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl border transition-all text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer ${
              isAiDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}
            title="Yapay Zeka KPSS Asistanı"
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            <span className="hidden xl:inline text-[11px]">AI Asistan</span>
          </button>
        </div>
      </div>

      {/* Bottom Mobile Scrollable Navigation Tabs (Only shown on small screens) */}
      <div className="flex lg:hidden items-center justify-between gap-1 mt-1 pt-1 border-t border-white/10 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 w-full overflow-x-auto py-0.5 scrollbar-none">
          <button
            onClick={() => handleTabChange('map')}
            className={`px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
              activeTab === 'map'
                ? 'bg-indigo-600 text-white border-indigo-300 shadow-md'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Map className="w-3 h-3 text-indigo-400" />
            <span>Keşif</span>
          </button>

          <button
            onClick={() => handleTabChange('pin_game')}
            className={`relative px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 whitespace-nowrap border-2 shrink-0 ${
              activeTab === 'pin_game'
                ? 'bg-amber-500 text-slate-950 border-amber-200 shadow-md'
                : 'bg-amber-500/15 text-amber-300 border-amber-400/60 hover:bg-amber-500/25'
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
            </span>
            <MapPin className="w-3 h-3 text-amber-300" />
            <span>Harita Testi</span>
          </button>

          <button
            onClick={() => handleTabChange('duel')}
            className={`relative px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 whitespace-nowrap border-2 shrink-0 ${
              activeTab === 'duel'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-slate-950 border-amber-300 shadow-md'
                : 'bg-red-500/20 text-amber-300 border-red-400/60 hover:bg-red-500/30'
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
            </span>
            <Swords className="w-3 h-3 text-amber-300 stroke-[2.5]" />
            <span>1v1 Düello</span>
          </button>

          <button
            onClick={() => handleTabChange('quiz_test')}
            className={`px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
              activeTab === 'quiz_test'
                ? 'bg-emerald-600 text-white border-emerald-300 shadow-md'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-emerald-400" />
            <span>KPSS Testi</span>
          </button>

          <button
            onClick={() => handleTabChange('flashcards')}
            className={`px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
              activeTab === 'flashcards'
                ? 'bg-purple-600 text-white border-purple-300 shadow-md'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3 h-3 text-purple-400" />
            <span>Ezber</span>
          </button>

          <button
            onClick={() => handleTabChange('stats')}
            className={`px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
              activeTab === 'stats'
                ? 'bg-cyan-600 text-white border-cyan-300 shadow-md'
                : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-3 h-3 text-cyan-400" />
            <span>Analiz</span>
          </button>
        </nav>
      </div>
    </>
  );

  // In Fullscreen Mode: Dedicated floating minimize button on top-right outside of cards
  if (isFullscreen) {
    return (
      <>
        <div className="fixed top-2 right-2 sm:top-3 sm:right-3.5 z-50 pointer-events-auto select-none">
          <button
            onClick={toggleFullscreen}
            title="Ekranı Küçült (Tam Ekrandan Çık)"
            className="group relative flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 bg-[#09090b]/90 backdrop-blur-xl border border-amber-400/80 text-amber-300 hover:text-slate-950 hover:bg-amber-400 rounded-xl shadow-2xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer font-black text-xs"
          >
            <Minimize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span className="text-[10px] sm:text-xs font-black">Küçült</span>
          </button>
        </div>
        <GlobalLeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      </>
    );
  }

  // Standard Non-Fullscreen Top Fixed Navbar
  return (
    <>
      <header className="relative z-30 w-full bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 text-slate-100 px-2 sm:px-4 py-1 sm:py-1.5 shadow-xl select-none">
        {renderNavbarContent()}
      </header>
      <GlobalLeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
