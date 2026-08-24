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
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useAppFullscreen } from '@/lib/utils';

const CATEGORIES = [
  'Genel',
  'Dağlar',
  'Akarsular',
  'Göller',
  'Sınır Kapıları',
  'Geçitler',
  'Platolar & Ovalar',
  'Madenler',
  'Karstik & Kıyı'
];

import AuthUserButton from './AuthUserButton';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    score,
    streak,
    setSelectedFeature,
    flyToCoords,
    toggleSidebar,
    setAiDrawerOpen,
    isAiDrawerOpen,
    gameCategoryFilter,
    setGameCategoryFilter
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
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
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1 sm:p-1.5 bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-400/60 rounded-xl text-indigo-200 transition-all flex items-center gap-1 text-xs font-bold active:scale-95 shrink-0"
            title="Katmanları Aç/Kapat"
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
            <span className="text-xs">Katmanlar</span>
          </button>

          <div 
            className="flex items-center gap-1 cursor-pointer shrink-0" 
            onClick={() => handleTabChange('map')}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md border border-white/20 shrink-0">
              <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-tight text-white hidden xs:inline">
              COĞRAFYA <span className="text-amber-400">3D</span>
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden lg:flex max-h-[550px]:flex items-center gap-1 bg-[#09090b]/80 p-0.5 sm:p-1 rounded-xl border border-white/15 shadow-inner overflow-x-auto scrollbar-none shrink">
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
          {/* Category Selector */}
          <div className="relative hidden xl:block">
            <select
              value={gameCategoryFilter}
              onChange={(e) => setGameCategoryFilter(e.target.value)}
              className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2 py-1 text-[11px] font-bold text-amber-300 pr-5 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#09090b] text-slate-100">
                  {cat === 'Genel' ? '🌐 Genel (Tüm Şekiller)' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-400 pointer-events-none" />
          </div>

          {/* Search Bar */}
          <div className="relative w-16 xs:w-24 sm:w-32 md:w-36">
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
              <div className="absolute top-full right-0 mt-1.5 w-52 sm:w-56 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
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

          {/* Score / Streak */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] font-bold shrink-0">
            <span className="text-emerald-400">{score}p</span>
            <span className="text-slate-600">|</span>
            <span className="text-orange-400">{streak}🔥</span>
          </div>

          {/* Fullscreen Button - Highlighted & Pulsing on Harita Testi if not fullscreen */}
          <button
            onClick={toggleFullscreen}
            className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border transition-all text-[9px] sm:text-xs font-black flex items-center gap-1 active:scale-95 shadow-md shrink-0 ${
              isFullscreen
                ? 'bg-slate-800 text-amber-300 border-amber-400/60 shadow-amber-500/20'
                : activeTab === 'pin_game'
                ? 'animate-bounce ring-4 ring-amber-400 bg-amber-400 text-slate-950 font-black shadow-xl shadow-amber-500/60 border-amber-200'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-amber-200 ring-1 ring-amber-400/40 shadow-amber-500/30 hover:brightness-110'
            }`}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Uygulamayı Tam Ekran Yap (Haritayı Büyüt)'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            ) : (
              <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 font-black" />
            )}
            <span className="font-black uppercase tracking-tight hidden xs:inline">
              {isFullscreen ? 'Çık' : 'Tam Ekran'}
            </span>
          </button>

          {/* Firebase User Auth */}
          <AuthUserButton />

          {/* AI Tutor Button */}
          <button
            onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
            className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl border transition-all text-xs font-bold flex items-center gap-1 shrink-0 ${
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

      {/* Bottom Mobile Scrollable Navigation Tabs (Only shown in Portrait Mobile when height > 550px) */}
      <div className="flex lg:hidden max-h-[550px]:hidden items-center justify-between gap-1 mt-1 pt-1 border-t border-white/10 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1.5 w-full overflow-x-auto py-0.5 scrollbar-none">
          <button
            onClick={() => handleTabChange('map')}
            className={`px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
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
            className={`relative px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 whitespace-nowrap border-2 shrink-0 ${
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
            onClick={() => handleTabChange('quiz_test')}
            className={`px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
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
            className={`px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
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
            className={`px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap border shrink-0 ${
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

  // In Fullscreen Mode: Only a pulsing arrow button that exits fullscreen on click
  if (isFullscreen) {
    return (
      <div className="fixed top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
        <button
          onClick={toggleFullscreen}
          title="Tam Ekrandan Çık"
          className="group relative flex items-center justify-center p-2 rounded-full bg-[#09090b]/90 backdrop-blur-2xl border-2 border-amber-400 text-amber-300 shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-400/30"
        >
          {/* Outer glowing pulsing ring */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50 pointer-events-none" />

          {/* Pulsing & Bouncing Arrow Icon */}
          <div className="relative flex items-center justify-center w-7 h-7 bg-amber-500/20 rounded-full border border-amber-400/60">
            <ChevronUp className="w-5 h-5 text-amber-300 animate-bounce stroke-[3]" />
          </div>
        </button>
      </div>
    );
  }

  // Standard Non-Fullscreen Top Fixed Navbar
  return (
    <header className="relative z-30 w-full bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 text-slate-100 px-2 sm:px-4 py-1 sm:py-1.5 shadow-xl select-none">
      {renderNavbarContent()}
    </header>
  );
}
