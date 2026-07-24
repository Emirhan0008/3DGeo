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
  ChevronDown
} from 'lucide-react';

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

  return (
    <header className="relative z-30 w-full bg-[#09090b]/85 backdrop-blur-xl border-b border-white/10 text-slate-100 px-3 sm:px-5 py-2 shadow-xl flex items-center justify-between gap-2 overflow-x-auto">
      {/* Left: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all flex items-center gap-1 text-xs font-semibold"
          title="Katmanları Aç/Kapat"
        >
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline text-[11px]">Katmanlar</span>
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('map')}>
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-black tracking-tight text-white hidden sm:inline">
            COĞRAFYA <span className="text-indigo-400">3D</span>
          </span>
        </div>
      </div>

      {/* Center: Minimal Segmented Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Keşif</span>
        </button>

        <button
          onClick={() => setActiveTab('pin_game')}
          className={`relative px-3 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            activeTab === 'pin_game'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl shadow-amber-500/40 ring-2 ring-amber-400'
              : 'bg-gradient-to-r from-amber-500/20 via-amber-500/35 to-amber-500/20 text-amber-200 border-amber-400/50 hover:bg-amber-500/30 animate-pulse shadow-md shadow-amber-500/20'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>Harita Testi</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz_test')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'quiz_test'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>KPSS Testi</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'flashcards'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ezber</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analiz</span>
        </button>
      </nav>

      {/* Right: Category Selector, Search, Score, AI Tutor */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Category Selector */}
        <div className="relative hidden lg:block">
          <select
            value={gameCategoryFilter}
            onChange={(e) => setGameCategoryFilter(e.target.value)}
            className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-[11px] font-bold text-amber-300 pr-6 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090b] text-slate-100">
                {cat === 'Genel' ? '🌐 Genel (Tüm Şekiller)' : cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-400 pointer-events-none" />
        </div>

        {/* Search Bar */}
        <div className="relative w-28 sm:w-36 md:w-44">
          <div className="relative flex items-center">
            <Search className="absolute left-2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Ara..."
              className="w-full pl-6 pr-2 py-1 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && filteredSearchItems.length > 0 && (
            <div className="absolute top-full right-0 mt-1.5 w-56 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
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

        {/* Compact Score / Streak Pill */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-[11px] font-bold">
          <span className="text-emerald-400">{score}p</span>
          <span className="text-slate-600">|</span>
          <span className="text-orange-400">{streak}🔥</span>
        </div>

        {/* AI Tutor Button */}
        <button
          onClick={() => setAiDrawerOpen(!isAiDrawerOpen)}
          className={`p-1.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
            isAiDrawerOpen
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
              : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
          }`}
          title="Yapay Zeka KPSS Asistanı (Yakında Eklenecek)"
        >
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="hidden xl:inline text-[11px]">AI Asistan</span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] border border-amber-500/40 font-black">
            YAKINDA
          </span>
        </button>
      </div>
    </header>
  );
}
