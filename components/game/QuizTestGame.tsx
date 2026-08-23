'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { MULTIPLE_CHOICE_QUESTIONS, getCurrentQuizQuestion, getFilteredQuizQuestions, sanitizeQuestionText } from '@/lib/data/quizQuestions';
import { getFeatureImageUrl } from '@/lib/data/turkeyData';
import DraggableCard from '@/components/ui/DraggableCard';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Shuffle,
  Trophy, 
  Sparkles,
  Check,
  X,
  Maximize2,
  Minimize2,
  HelpCircle
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

export default function QuizTestGame() {
  const {
    quizTestIndex,
    shuffledQuizQuestions,
    quizScore,
    quizSelectedOption,
    isQuizAnswered,
    answerQuizQuestion,
    nextQuizQuestion,
    resetQuizTest,
    shuffleQuizQuestions,
    setActiveTab,
    gameCategoryFilter,
    setGameCategoryFilter
  } = useAppStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Default to collapsed mode on mobile screens for unobstructed map view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (shuffledQuizQuestions.length === 0) {
      shuffleQuizQuestions();
    }
  }, [shuffledQuizQuestions.length, shuffleQuizQuestions]);

  const filteredQuestions = shuffledQuizQuestions.length > 0
    ? shuffledQuizQuestions
    : getFilteredQuizQuestions(gameCategoryFilter);
  const safeIndex = quizTestIndex % (filteredQuestions.length || 1);
  const currentQ = getCurrentQuizQuestion(quizTestIndex, gameCategoryFilter, filteredQuestions) || MULTIPLE_CHOICE_QUESTIONS[0];

  if (!currentQ) return null;

  const handleNext = () => {
    nextQuizQuestion();
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button, select, input, a, option')) {
      setIsCollapsed((prev) => !prev);
    }
  };

  // Collapsed State
  if (isCollapsed) {
    return (
      <div 
        onDoubleClick={() => setIsCollapsed(false)}
        title="Çift Tıklayarak Kartı Açabilirsiniz"
        className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[96vw] bg-[#09090b]/95 backdrop-blur-2xl border-2 border-emerald-400/80 rounded-xl shadow-2xl px-2 py-1.5 flex items-center justify-between gap-1.5 text-white animate-in fade-in duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[9px] shrink-0">
            TEST:
          </span>
          <span className="font-extrabold text-xs text-emerald-300 truncate max-w-[120px] sm:max-w-[200px]">
            {currentQ.category}
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
            className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] rounded-lg flex items-center gap-0.5 shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>Sonraki</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(false);
            }}
            className="px-1.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] rounded-lg flex items-center gap-0.5 border border-emerald-400 transition-all active:scale-95 shrink-0"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Aç</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('map');
            }}
            className="p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20 transition-all shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Card classes depending on FullScreen or Floating Card Mode
  const containerClasses = isFullScreen
    ? "fixed inset-0 sm:inset-3 z-50 w-full sm:w-[95vw] md:w-[780px] lg:w-[860px] max-w-5xl mx-auto h-full sm:h-[92vh] max-h-[95vh] bg-[#09090b]/98 backdrop-blur-3xl border-0 sm:border-2 border-emerald-500/60 rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto text-slate-100 p-3 sm:p-5 transition-all flex flex-col justify-between"
    : "absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[95vw] sm:w-[85vw] md:w-[520px] lg:w-[560px] max-w-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-emerald-500/40 rounded-xl shadow-2xl overflow-hidden text-slate-100 p-1.5 transition-all";

  return (
    <DraggableCard
      onDoubleClick={handleCardDoubleClick}
      className={containerClasses}
    >
      {/* Top Header Controls */}
      <div 
        className="flex items-center justify-between border-b border-white/10 pb-1 mb-1 gap-1"
        title="Çift Tıklayarak Küçültebilirsiniz"
      >
        <div className="flex items-center gap-1 overflow-x-auto shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-black text-[9px] sm:text-xs border border-emerald-400/40">
            TEST {safeIndex + 1}/{filteredQuestions.length}
          </span>
          <select
            value={gameCategoryFilter}
            onChange={(e) => {
              setGameCategoryFilter(e.target.value);
              resetQuizTest();
            }}
            className="bg-white/10 border border-emerald-400/50 rounded px-1 py-0.5 text-[9px] sm:text-xs font-black text-emerald-300 focus:outline-none cursor-pointer max-w-[100px] sm:max-w-[140px] truncate"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090b] text-slate-100 font-bold">
                {cat === 'Genel' ? '🌐 Genel (Tümü)' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded text-[9px] sm:text-xs font-black text-emerald-300">
            <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
            <span>{quizScore} P</span>
          </div>

          <button
            onClick={shuffleQuizQuestions}
            title="Karıştır"
            className="p-0.5 sm:p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-300 hover:text-white"
          >
            <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <button
            onClick={resetQuizTest}
            title="Sıfırla"
            className="p-0.5 sm:p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? "Tam Ekrandan Çık" : "Tam Ekran Yap"}
            className={`px-1.5 py-0.5 rounded text-[9px] sm:text-xs font-black flex items-center gap-0.5 border transition-all ${
              isFullScreen 
                ? 'bg-emerald-500 text-slate-950 border-emerald-300' 
                : 'bg-emerald-600/40 hover:bg-emerald-600/60 border-emerald-400/60 text-emerald-200'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">{isFullScreen ? 'Küçült' : 'Tam Ekran'}</span>
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            title="Sadece Başlığı Göster (Çift Tık)"
            className="p-0.5 sm:p-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-emerald-200 rounded text-[9px] font-black"
          >
            <Minimize2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="p-0.5 sm:p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Content Layout - 2 Columns */}
      <div className={`grid grid-cols-1 ${isFullScreen ? 'md:grid-cols-12' : 'md:grid-cols-12'} gap-1.5 sm:gap-3 items-start my-auto`}>
        {/* Left Column (Image & Category Banner) */}
        <div className="md:col-span-4 space-y-1 sm:space-y-2">
          <div className={`relative w-full ${isFullScreen ? 'h-32 sm:h-48' : 'h-16 sm:h-20'} rounded-lg overflow-hidden border border-white/15 shadow-inner transition-all`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFeatureImageUrl({ id: currentQ.focusFeatureId, title: currentQ.category, name: currentQ.category, category: currentQ.category })}
              alt={currentQ.category}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] sm:text-[10px] text-white/90">
              <span className="px-1 py-0.2 rounded bg-black/70 font-bold text-emerald-300">
                Görsel
              </span>
              <span className="font-bold text-slate-200 truncate max-w-[100px]">{currentQ.category}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Question & Options) */}
        <div className="md:col-span-8 space-y-1 sm:space-y-2">
          <div className={`p-1.5 sm:p-2 bg-white/5 border border-white/10 rounded-lg ${isFullScreen ? 'min-h-[60px]' : 'min-h-[34px]'} flex items-center`}>
            <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-white leading-snug">
              {sanitizeQuestionText(currentQ.questionText)}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-white/5 border-white/15 hover:bg-white/15 hover:border-emerald-400 text-slate-100 font-bold';

              if (isQuizAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-500/30 border border-emerald-400 text-emerald-100 font-black';
                } else if (idx === quizSelectedOption) {
                  btnStyle = 'bg-rose-500/30 border border-rose-400 text-rose-100 font-black';
                } else {
                  btnStyle = 'bg-white/5 border-white/5 text-slate-500 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isQuizAnswered}
                  onClick={() => answerQuizQuestion(idx)}
                  className={`w-full px-2 py-1.5 sm:py-2 rounded-lg border text-left text-[9px] sm:text-xs transition-all flex items-center justify-between active:scale-95 ${btnStyle}`}
                >
                  <span className="truncate pr-1">{option}</span>
                  {isQuizAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  {isQuizAnswered && idx === quizSelectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Result & Explanation */}
          {isQuizAnswered && (
            <div className="space-y-1 sm:space-y-1.5 animate-in fade-in duration-200">
              <div className="p-1 sm:p-1.5 bg-emerald-500/20 border border-emerald-400/60 rounded-lg flex items-center justify-between text-[9px] sm:text-xs">
                <span className="font-black text-emerald-300 flex items-center gap-0.5">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  DOĞRU:
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-black">
                  {currentQ.options[currentQ.correctIndex]}
                </span>
              </div>

              <div className="p-1.5 sm:p-2 bg-white/5 border border-white/10 rounded-lg text-[9px] sm:text-xs space-y-1">
                <p className="text-slate-200 font-medium">{sanitizeQuestionText(currentQ.explanation)}</p>
                <div className="p-1 sm:p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-200 font-bold flex items-start gap-1">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>ÖSYM Notu:</strong> {sanitizeQuestionText(currentQ.osymTip)}</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-[10px] sm:text-xs flex items-center justify-center gap-1 border border-emerald-300 shadow-md transition-all active:scale-95"
              >
                <span>SONRAKİ SORU</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DraggableCard>
  );
}

