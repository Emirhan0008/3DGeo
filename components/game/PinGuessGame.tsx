'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { PIN_GAME_QUESTIONS, getCurrentPinQuestion, getFilteredPinQuestions, sanitizeQuestionText, cleanFeatureTitle } from '@/lib/data/quizQuestions';
import { getFeatureImageUrl } from '@/lib/data/turkeyData';
import { useAppFullscreen } from '@/lib/utils';
import DraggableCard from '@/components/ui/DraggableCard';
import { 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  MapPin,
  Shuffle,
  X,
  EyeOff,
  ChevronDown,
  ChevronUp
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
  const { isFullscreen, toggleFullscreen } = useAppFullscreen();

  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.innerHeight < 550 || ('ontouchstart' in window && window.innerWidth < 1024);
  };

  const [showHint, setShowHint] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || window.innerHeight < 550 || ('ontouchstart' in window && window.innerWidth < 1024);
    }
    return false;
  });
  const [questionMode, setQuestionMode] = useState<'detailed' | 'name_only'>('detailed');

  // Default to collapsed mode on mobile/landscape screens for unobstructed map view
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Force collapsed mode on mobile/landscape whenever question or category changes
  useEffect(() => {
    if (isMobile()) {
      setIsCollapsed(true);
    }
  }, [pinGameIndex, gameCategoryFilter]);

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
    if (isMobile()) {
      setIsCollapsed(true);
    }
    nextPinQuestion();
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button, select, input, a, option')) {
      setIsCollapsed((prev) => !prev);
    }
  };

  const displayTitle = cleanFeatureTitle(currentQ.title);

  // If user minimized the card to keep map 100% clear (Default on Mobile)
  if (isCollapsed) {
    return (
      <div 
        onDoubleClick={() => setIsCollapsed(false)}
        title="Çift Tıklayarak Detayları Açabilirsiniz"
        className="absolute top-2 left-20 sm:left-1/2 sm:-translate-x-1/2 right-2 sm:right-auto z-30 w-auto max-w-[calc(100vw-88px)] sm:max-w-[96vw] bg-[#09090b]/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-xl shadow-2xl px-2 py-1 flex items-center justify-between gap-1.5 text-white animate-in fade-in duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] shrink-0 flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" />
            ARANAN:
          </span>
          <span className="font-black text-xs sm:text-sm text-amber-300 leading-tight truncate">
            {displayTitle}
          </span>
          <span className="text-[9px] text-slate-300 font-bold border-l border-white/20 pl-1 shrink-0">
            {safeIndex + 1}/{filteredQuestions.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Sonraki Soruya Geç"
            className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg flex items-center gap-0.5 shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>Sonraki</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(false);
            }}
            title="Detaylı Soru Kartını Aç"
            className="px-1.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded-lg flex items-center gap-0.5 border border-indigo-400 transition-all active:scale-95 shrink-0"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Detay</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('map');
            }}
            className="p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20 transition-all shrink-0"
            title="Kapat"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Fullscreen Exit Pulsing Arrow: Positioned on the right side of the card without circle */}
          {isFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title="Tam Ekrandan Çık"
              className="p-1 rounded hover:bg-white/10 text-amber-300 hover:text-amber-200 transition-all shrink-0 active:scale-95 flex items-center justify-center cursor-pointer ml-0.5"
            >
              <ChevronUp className="w-4 h-4 text-amber-300 animate-bounce stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Card classes (compact floating card over map)
  const containerClasses = "absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[95vw] sm:w-[85vw] md:w-[520px] lg:w-[560px] max-w-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-indigo-500/40 rounded-xl shadow-2xl overflow-hidden text-slate-100 p-1.5 transition-all";

  return (
    <DraggableCard
      onDoubleClick={handleCardDoubleClick}
      className={containerClasses}
    >
      {/* Top Controls Bar */}
      <div 
        className="flex items-center justify-between border-b border-white/10 pb-1 mb-1 gap-1"
        title="Çift Tıklayarak Küçültebilirsiniz"
      >
        <div className="flex items-center gap-1 overflow-x-auto shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-black text-[9px] sm:text-xs border border-indigo-400/40">
            KONUM {safeIndex + 1}/{filteredQuestions.length}
          </span>

          {/* Category Selector */}
          <select
            value={gameCategoryFilter}
            onChange={(e) => {
              setGameCategoryFilter(e.target.value);
              resetPinGame();
            }}
            className="bg-white/10 border border-amber-400/50 rounded px-1 py-0.5 text-[9px] sm:text-xs font-black text-amber-300 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-[140px] truncate"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090b] text-slate-100 font-bold">
                {cat === 'Genel' ? '🌐 Genel (Tümü)' : cat}
              </option>
            ))}
          </select>

          <button
            onClick={toggleBlindMapMode}
            className={`px-1.5 py-0.5 rounded text-[9px] sm:text-xs font-black shrink-0 transition-all flex items-center gap-0.5 border ${
              isBlindMapMode
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-white/10 text-slate-300 border-white/20 hover:border-amber-400'
            }`}
          >
            <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
            <span>{isBlindMapMode ? 'Dilsiz' : 'Harita'}</span>
          </button>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-1.5 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 rounded text-amber-300 text-[9px] sm:text-xs font-black flex items-center gap-0.5"
          >
            <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
            <span>İpucu</span>
          </button>

          <button
            onClick={shufflePinQuestions}
            title="Karıştır"
            className="p-0.5 sm:p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-300 hover:text-white"
          >
            <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <button
            onClick={resetPinGame}
            title="Sıfırla"
            className="p-0.5 sm:p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            title="Kartı Küçült (Sadece İsim Modu)"
            className="p-0.5 sm:p-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/50 text-indigo-200 rounded text-[9px] font-black"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="p-0.5 sm:p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20"
            title="Kapat"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Fullscreen Exit Pulsing Arrow */}
          {isFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title="Tam Ekrandan Çık"
              className="p-0.5 sm:p-1 rounded hover:bg-white/10 text-amber-300 hover:text-amber-200 transition-all cursor-pointer ml-0.5"
            >
              <ChevronUp className="w-3.5 h-3.5 text-amber-300 animate-bounce stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 sm:gap-3 items-start my-auto">
        {/* Left Column (Image & Method Selector) */}
        <div className="md:col-span-4 space-y-1 sm:space-y-2">
          <div className="relative w-full h-16 sm:h-20 rounded-lg overflow-hidden border border-white/15 shadow-inner transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFeatureImageUrl({ id: currentQ.targetFeatureId, title: currentQ.title, name: currentQ.title, category: currentQ.category })}
              alt={displayTitle}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] sm:text-[10px] text-white/90">
              <span className="px-1 py-0.2 rounded bg-black/70 font-bold border border-white/15 text-amber-300">
                Görsel
              </span>
              <span className="font-bold text-slate-200 truncate max-w-[100px]">{currentQ.category}</span>
            </div>
          </div>

          {/* Question Method Selector */}
          <div className="p-0.5 sm:p-1 bg-[#12131a] border border-indigo-500/30 rounded flex items-center justify-between gap-0.5">
            <span className="text-[9px] sm:text-xs text-slate-300 font-extrabold flex items-center gap-0.5 shrink-0 px-0.5">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              Yöntem:
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuestionMode('detailed')}
                className={`px-1.5 py-0.5 rounded text-[8px] sm:text-xs font-extrabold transition-all border ${
                  questionMode === 'detailed'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
                }`}
              >
                💡 Açıklama
              </button>
              <button
                type="button"
                onClick={() => setQuestionMode('name_only')}
                className={`px-1.5 py-0.5 rounded text-[8px] sm:text-xs font-extrabold transition-all border ${
                  questionMode === 'name_only'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                    : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
                }`}
              >
                🎯 İsim
              </button>
            </div>
          </div>

          {showHint && (
            <div className="p-1.5 bg-amber-500/15 border border-amber-500/40 rounded text-[9px] sm:text-xs text-amber-200 font-medium flex items-start gap-1 animate-in fade-in duration-150">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>İpucu:</strong> {sanitizeQuestionText(currentQ.hint)}</span>
            </div>
          )}
        </div>

        {/* Right Column (Target Name & Question & Result) */}
        <div className="md:col-span-8 space-y-1 sm:space-y-2">
          {/* Target Name Banner */}
          <div className="p-1 sm:p-1.5 bg-gradient-to-r from-amber-500/20 via-indigo-600/30 to-purple-600/20 border border-amber-400/80 rounded-lg flex items-center justify-between gap-1 shadow-sm">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
              <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded font-black text-[9px] sm:text-xs shrink-0 flex items-center gap-0.5 shadow-sm">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                ARANAN:
              </span>
              <span className="font-black text-[10px] sm:text-sm text-amber-300 leading-tight truncate">
                {displayTitle}
              </span>
            </div>
            {currentQ.region && (
              <span className="text-[8px] sm:text-[10px] uppercase font-black px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                {currentQ.region}
              </span>
            )}
          </div>

          <div className="p-1.5 sm:p-2 bg-white/5 border border-white/10 rounded-lg min-h-[34px] flex items-center">
            <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-100 leading-snug">
              {questionMode === 'name_only'
                ? `${displayTitle} haritada nerededir? İğneyi yerleştirin.`
                : sanitizeQuestionText(currentQ.questionText)}
            </h3>
          </div>

          {/* Post-Guess Result Feedback */}
          {isPinGuessed && (
            <div className="space-y-1 sm:space-y-1.5 animate-in fade-in duration-200">
              <div className="p-1 sm:p-1.5 bg-amber-500/20 border border-amber-400 rounded-lg flex items-center justify-between text-[9px] sm:text-xs font-bold text-amber-300">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                  <span>Sapma: </span>
                  <strong className="underline">{lastGuessDistanceKm} km</strong>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] sm:text-xs">
                  +{lastGuessPoints} P
                </span>
              </div>

              <p className="text-[9px] sm:text-xs text-slate-200 font-medium line-clamp-3">
                {sanitizeQuestionText(currentQ.explanation)}
              </p>

              <button
                onClick={handleNext}
                className="w-full py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg text-[10px] sm:text-xs flex items-center justify-center gap-1 border border-indigo-400 shadow-md transition-all active:scale-95"
              >
                <span>SONRAKİ KONUM</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DraggableCard>
  );
}
