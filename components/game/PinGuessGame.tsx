'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { PIN_GAME_QUESTIONS, getCurrentPinQuestion, getFilteredPinQuestions } from '@/lib/data/quizQuestions';
import { getFeatureImageUrl } from '@/lib/data/turkeyData';
import DraggableCard from '@/components/ui/DraggableCard';
import { 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  MapPin,
  Shuffle,
  X,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2
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

export default function PinGuessGame() {
  const {
    pinGameIndex,
    shuffledPinQuestions,
    isPinGuessed,
    lastGuessDistanceKm,
    lastGuessPoints,
    nextPinQuestion,
    resetPinGame,
    shufflePinQuestions,
    setActiveTab,
    gameCategoryFilter,
    setGameCategoryFilter,
    isBlindMapMode,
    toggleBlindMapMode
  } = useAppStore();

  const [showHint, setShowHint] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (shuffledPinQuestions.length === 0) {
      shufflePinQuestions();
    }
  }, [shuffledPinQuestions.length, shufflePinQuestions]);

  // Reset hint on every question change
  useEffect(() => {
    setShowHint(false);
  }, [pinGameIndex, gameCategoryFilter]);

  const filteredQuestions = shuffledPinQuestions.length > 0
    ? shuffledPinQuestions
    : getFilteredPinQuestions(gameCategoryFilter);
  const safeIndex = pinGameIndex % (filteredQuestions.length || 1);
  const currentQ = getCurrentPinQuestion(pinGameIndex, gameCategoryFilter, filteredQuestions) || PIN_GAME_QUESTIONS[0];

  if (!currentQ) return null;

  const handleNext = () => {
    setShowHint(false);
    nextPinQuestion();
  };

  // If user minimized the card to keep map 100% clear
  if (isCollapsed) {
    return (
      <div className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-md sm:max-w-lg bg-[#09090b]/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-2xl shadow-2xl px-3 py-1.5 flex items-center justify-between gap-2 text-white animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs shrink-0 flex items-center gap-1 shadow">
            <MapPin className="w-3 h-3" />
            ARANAN:
          </span>
          <span className="font-black text-xs sm:text-sm text-amber-300 truncate">
            {currentQ.title}
          </span>
          <span className="text-[10px] text-slate-300 font-bold hidden sm:inline border-l border-white/20 pl-2">
            {safeIndex + 1}/{filteredQuestions.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] sm:text-[11px] rounded-xl flex items-center gap-1 border border-indigo-400 shadow-lg transition-all active:scale-95"
            title="Soru Kartını Genişlet"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Kartı Aç</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 border border-white/20 transition-all"
            title="Testi Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <DraggableCard
      className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 w-[96vw] max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-[#09090b]/95 backdrop-blur-2xl border-2 border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-2.5 sm:p-3 transition-all"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 gap-2">
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-300 font-black text-xs border border-indigo-400/50 shadow">
            SORU {safeIndex + 1}/{filteredQuestions.length}
          </span>

          {/* Category Selector */}
          <div className="relative flex items-center">
            <select
              value={gameCategoryFilter}
              onChange={(e) => {
                setGameCategoryFilter(e.target.value);
                resetPinGame();
              }}
              className="bg-white/10 hover:bg-white/20 border-2 border-amber-400/50 rounded-lg px-2 py-0.5 text-[11px] font-black text-amber-300 focus:outline-none cursor-pointer shadow-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#09090b] text-slate-100 font-bold">
                  {cat === 'Genel' ? '🌐 Genel (Tüm Konular)' : cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleBlindMapMode}
            title="Dilsiz Harita Modunu Değiştir"
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 transition-all flex items-center gap-1 border-2 ${
              isBlindMapMode
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                : 'bg-white/10 text-slate-300 border-white/20 hover:border-amber-400 hover:text-amber-300'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isBlindMapMode ? 'Dilsiz Harita: AÇIK' : 'Dilsiz Harita'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border-2 border-amber-400/50 rounded-xl text-amber-300 text-[11px] font-black flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Gizle' : 'İpucu'}</span>
          </button>

          <button
            onClick={shufflePinQuestions}
            title="Soruları Karıştır"
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-300 hover:text-white transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetPinGame}
            title="Testi Sıfırla"
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Haritayı Rahat Görmek İçin Kartı Simge Durumuna Küçült"
            className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/50 text-indigo-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Küçült</span>
          </button>

          {/* Close X */}
          <button
            onClick={() => setActiveTab('map')}
            title="Testi Kapat"
            className="p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 border border-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Layout - 2 Columns on Horizontal Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Column 1: Prominent Target Landform Badge & Photo (5 cols) */}
        <div className="md:col-span-5 space-y-2">
          {/* Target Location Name Badge */}
          <div className="p-2.5 bg-gradient-to-r from-amber-500/30 via-indigo-600/30 to-purple-600/30 border-2 border-amber-400 rounded-xl shadow-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 bg-amber-400 text-slate-950 rounded-lg font-black text-xs shrink-0 flex items-center gap-1 shadow-md">
                <MapPin className="w-4 h-4" />
                <span>ARANAN YER:</span>
              </div>
              <span className="font-black text-base sm:text-lg text-amber-300 tracking-wide drop-shadow truncate">
                {currentQ.title}
              </span>
            </div>
            {currentQ.region && (
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                {currentQ.region}
              </span>
            )}
          </div>

          {/* Photograph Banner */}
          <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden border border-white/15 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFeatureImageUrl({ id: currentQ.targetFeatureId, title: currentQ.title, name: currentQ.title, category: currentQ.category })}
              alt={currentQ.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white/90">
              <span className="px-2 py-0.5 rounded bg-black/70 font-black border border-white/15 text-amber-300">
                📸 Coğrafi Görsel
              </span>
              <span className="font-bold text-slate-200">{currentQ.category}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Question Text & Result Actions (7 cols) */}
        <div className="md:col-span-7 space-y-2 flex flex-col justify-center">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="font-black text-xs sm:text-sm text-slate-100 leading-snug">
              {currentQ.questionText}
            </h3>

            {/* Hint Box */}
            {showHint && (
              <div className="mt-2 p-2 bg-amber-500/15 border border-amber-500/40 rounded-xl text-[11px] text-amber-200 font-bold flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>İpucu:</strong> {currentQ.hint}</span>
              </div>
            )}
          </div>

          {/* Post-Guess Result Feedback */}
          {isPinGuessed ? (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2 bg-amber-500/20 border-2 border-amber-400 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>DOĞRU LOKASYON:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black shadow-sm">
                    {currentQ.title}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-300">+{lastGuessPoints} Puan</span>
              </div>

              <div
                className={`p-2 rounded-xl border-2 flex items-center justify-between ${
                  (lastGuessPoints ?? 0) >= 70
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                    : 'bg-orange-500/20 border-orange-400 text-orange-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {(lastGuessPoints ?? 0) >= 70 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                  )}
                  <div className="text-[11px] font-bold">
                    <span>Mesafe Sapması: </span>
                    <strong className="underline text-amber-300">{lastGuessDistanceKm} km</strong>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-[11px] text-slate-200 font-medium line-clamp-2">
                {currentQ.explanation}
              </p>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-indigo-400"
              >
                <span>SONRAKİ SORUYA GEÇ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-amber-300 font-extrabold animate-pulse">
              📍 Haritada tahmin ettiğiniz noktaya tıklayın!
            </div>
          )}
        </div>
      </div>
    </DraggableCard>
  );
}
