'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { MULTIPLE_CHOICE_QUESTIONS, getCurrentQuizQuestion, getFilteredQuizQuestions } from '@/lib/data/quizQuestions';
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

  // If user minimized the card to see the map completely unobstructed
  if (isCollapsed) {
    return (
      <div className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-md sm:max-w-lg bg-[#09090b]/95 backdrop-blur-2xl border-2 border-emerald-400/80 rounded-2xl shadow-2xl px-3 py-1.5 flex items-center justify-between gap-2 text-white animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-2 py-0.5 rounded-lg bg-emerald-400 text-slate-950 font-black text-[10px] sm:text-xs shrink-0 flex items-center gap-1 shadow">
            <HelpCircle className="w-3 h-3" />
            KPSS TESTİ:
          </span>
          <span className="font-extrabold text-xs text-emerald-300 truncate max-w-[160px] sm:max-w-[200px]">
            {currentQ.category}
          </span>
          <span className="text-[10px] text-slate-300 font-bold border-l border-white/20 pl-2">
            {safeIndex + 1}/{filteredQuestions.length} ({quizScore}p)
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] sm:text-[11px] rounded-xl flex items-center gap-1 border border-emerald-400 shadow-lg transition-all active:scale-95"
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
      className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 w-[96vw] max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-[#09090b]/95 backdrop-blur-2xl border-2 border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-2.5 sm:p-3 transition-all"
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 gap-2">
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-300 font-black text-xs border border-emerald-400/50 shadow">
            TEST {safeIndex + 1}/{filteredQuestions.length}
          </span>
          <select
            value={gameCategoryFilter}
            onChange={(e) => {
              setGameCategoryFilter(e.target.value);
              resetQuizTest();
            }}
            className="bg-white/10 hover:bg-white/20 border-2 border-emerald-400/50 rounded-lg px-2 py-0.5 text-[11px] font-black text-emerald-300 focus:outline-none cursor-pointer shadow-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090b] text-slate-100 font-bold">
                {cat === 'Genel' ? '🌐 Genel (Tümü)' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-xs font-black text-emerald-300">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{quizScore} p</span>
          </div>

          <button
            onClick={shuffleQuizQuestions}
            title="Soruları Karıştır"
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-300 hover:text-white transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetQuizTest}
            title="Sıfırla"
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Haritayı Rahat Görmek İçin Kartı Simge Durumuna Küçült"
            className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Küçült</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            title="Kapat"
            className="p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 border border-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        {/* Left Column: Photo Banner & Category Info (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border border-white/15 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFeatureImageUrl({ id: currentQ.focusFeatureId, title: currentQ.category, name: currentQ.category, category: currentQ.category })}
              alt={currentQ.category}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white/90">
              <span className="px-2 py-0.5 rounded bg-black/70 font-black border border-white/15 text-emerald-300">
                📸 Soru Görseli
              </span>
              <span className="font-bold text-slate-200">{currentQ.category}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Question Text & Options (8 cols) */}
        <div className="md:col-span-8 space-y-2">
          <h3 className="font-extrabold text-xs sm:text-sm text-white leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-white/5 border-white/15 hover:bg-white/15 hover:border-emerald-400 text-slate-100 font-bold';

              if (isQuizAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-100 font-black shadow-lg shadow-emerald-500/20';
                } else if (idx === quizSelectedOption) {
                  btnStyle = 'bg-rose-500/30 border-2 border-rose-400 text-rose-100 font-black';
                } else {
                  btnStyle = 'bg-white/5 border-white/5 text-slate-500 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isQuizAnswered}
                  onClick={() => answerQuizQuestion(idx)}
                  className={`w-full p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between active:scale-95 ${btnStyle}`}
                >
                  <span className="truncate pr-1">{option}</span>
                  {isQuizAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isQuizAnswered && idx === quizSelectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Result & Explanation */}
          {isQuizAnswered && (
            <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2 bg-emerald-500/20 border border-emerald-400/60 rounded-xl flex items-center justify-between text-xs">
                <span className="font-black text-emerald-300 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-400" />
                  DOĞRU CEVAP:
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-400 text-slate-950 font-black shadow-sm">
                  {currentQ.options[currentQ.correctIndex]}
                </span>
              </div>

              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[11px] space-y-1">
                <p className="text-slate-200 font-medium">{currentQ.explanation}</p>
                <div className="p-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 font-bold flex items-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>ÖSYM Püf Noktası:</strong> {currentQ.osymTip}</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-emerald-300"
              >
                <span>SONRAKİ TEST SORUSUNA GEÇ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </DraggableCard>
  );
}

