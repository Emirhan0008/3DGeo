'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { PIN_GAME_QUESTIONS, getCurrentPinQuestion, getFilteredPinQuestions, sanitizeQuestionText } from '@/lib/data/quizQuestions';
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
  const [questionMode, setQuestionMode] = useState<'detailed' | 'name_only'>('detailed');

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
      <div className="absolute top-3 left-3 z-30 w-auto max-w-[90vw] bg-[#09090b]/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-xl shadow-2xl px-2.5 py-1.5 flex items-center justify-between gap-2 text-white animate-in fade-in duration-200">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            ARANAN:
          </span>
          <span className="font-black text-xs text-amber-300 leading-tight break-words">
            {currentQ.title}
          </span>
          <span className="text-[10px] text-slate-300 font-bold border-l border-white/20 pl-1.5 shrink-0">
            {safeIndex + 1}/{filteredQuestions.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-lg flex items-center gap-1 border border-indigo-400 transition-all active:scale-95"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Aç</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <DraggableCard
      className="absolute top-3 left-3 z-30 w-[94vw] sm:w-[360px] md:w-[380px] bg-[#09090b]/95 backdrop-blur-2xl border-2 border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-2.5 transition-all"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5 gap-1">
        <div className="flex items-center gap-1 overflow-x-auto shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-black text-[10px] border border-indigo-400/40">
            {safeIndex + 1}/{filteredQuestions.length}
          </span>

          {/* Category Selector */}
          <select
            value={gameCategoryFilter}
            onChange={(e) => {
              setGameCategoryFilter(e.target.value);
              resetPinGame();
            }}
            className="bg-white/10 border border-amber-400/50 rounded px-1.5 py-0.5 text-[10px] font-black text-amber-300 focus:outline-none cursor-pointer max-w-[110px] truncate"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090b] text-slate-100 font-bold">
                {cat === 'Genel' ? '🌐 Genel' : cat}
              </option>
            ))}
          </select>

          <button
            onClick={toggleBlindMapMode}
            className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 transition-all flex items-center gap-1 border ${
              isBlindMapMode
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-white/10 text-slate-300 border-white/20 hover:border-amber-400'
            }`}
          >
            <EyeOff className="w-3 h-3 text-amber-400" />
            <span>{isBlindMapMode ? 'Dilsiz' : 'Harita'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-1.5 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 rounded-lg text-amber-300 text-[10px] font-black flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>İpucu</span>
          </button>

          <button
            onClick={shufflePinQuestions}
            title="Karıştır"
            className="p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-300 hover:text-white"
          >
            <Shuffle className="w-3 h-3" />
          </button>

          <button
            onClick={resetPinGame}
            title="Sıfırla"
            className="p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            title="Küçült"
            className="p-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/50 text-indigo-200 rounded text-[10px] font-black"
          >
            <Minimize2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Mode Selector (Integrated directly) */}
      <div className="mb-1.5 p-1 bg-[#12131a] border border-indigo-500/30 rounded-lg flex items-center justify-between gap-1">
        <span className="text-[10px] text-slate-300 font-extrabold flex items-center gap-1 shrink-0 px-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Yöntem:
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setQuestionMode('detailed')}
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all border ${
              questionMode === 'detailed'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
            }`}
          >
            💡 Açıklamalı
          </button>
          <button
            type="button"
            onClick={() => setQuestionMode('name_only')}
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all border ${
              questionMode === 'name_only'
                ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
            }`}
          >
            🎯 Sadece İsim
          </button>
        </div>
      </div>

      {/* Full-width Target Name Banner */}
      <div className="mb-1.5 p-1.5 bg-gradient-to-r from-amber-500/20 via-indigo-600/30 to-purple-600/20 border border-amber-400/80 rounded-lg flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded font-black text-[10px] shrink-0 flex items-center gap-0.5 shadow-sm">
            <MapPin className="w-3 h-3" />
            ARANAN:
          </span>
          <span className="font-black text-xs sm:text-sm text-amber-300 leading-tight break-words">
            {currentQ.title}
          </span>
        </div>
        {currentQ.region && (
          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
            {currentQ.region}
          </span>
        )}
      </div>

      {/* Main Content Layout - Compact Sidebar Stack */}
      <div className="space-y-1.5">
        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getFeatureImageUrl({ id: currentQ.targetFeatureId, title: currentQ.title, name: currentQ.title, category: currentQ.category })}
            alt={currentQ.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[9px] text-white/90">
            <span className="px-1.5 py-0.5 rounded bg-black/70 font-bold border border-white/15 text-amber-300">
              Coğrafi Görsel
            </span>
            <span className="font-bold text-slate-200">{currentQ.category}</span>
          </div>
        </div>

        <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg">
          <h3 className="font-bold text-xs text-slate-100 leading-tight">
            {questionMode === 'name_only'
              ? `${currentQ.title} haritada nerededir?`
              : sanitizeQuestionText(currentQ.questionText)}
          </h3>

          {showHint && (
            <div className="mt-1.5 p-1.5 bg-amber-500/15 border border-amber-500/40 rounded-lg text-[10px] text-amber-200 font-medium flex items-start gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>İpucu:</strong> {sanitizeQuestionText(currentQ.hint)}</span>
            </div>
          )}
        </div>

        {/* Post-Guess Result Feedback */}
        {isPinGuessed && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <div className="p-1.5 bg-amber-500/20 border border-amber-400 rounded-lg flex items-center justify-between text-[11px] font-bold text-amber-300">
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Mesafe Sapması: </span>
                <strong className="underline">{lastGuessDistanceKm} km</strong>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                +{lastGuessPoints} P
              </span>
            </div>

            <p className="text-[10px] text-slate-200 font-medium line-clamp-2">
              {currentQ.explanation}
            </p>

            <button
              onClick={handleNext}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg text-xs flex items-center justify-center gap-1 border border-indigo-400 shadow-md"
            >
              <span>SONRAKİ SORU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </DraggableCard>
  );
}
