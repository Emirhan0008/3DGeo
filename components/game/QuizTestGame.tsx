'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { MULTIPLE_CHOICE_QUESTIONS } from '@/lib/data/quizQuestions';
import DraggableCard from '@/components/ui/DraggableCard';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Sparkles,
  Check,
  X
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
    quizScore,
    quizSelectedOption,
    isQuizAnswered,
    answerQuizQuestion,
    nextQuizQuestion,
    resetQuizTest,
    flyToCoords,
    setActiveTab,
    gameCategoryFilter,
    setGameCategoryFilter
  } = useAppStore();

  const filteredQuestions = gameCategoryFilter === 'Genel'
    ? MULTIPLE_CHOICE_QUESTIONS
    : MULTIPLE_CHOICE_QUESTIONS.filter((q) => q.category === gameCategoryFilter || q.category.includes(gameCategoryFilter));

  const safeIndex = quizTestIndex % (filteredQuestions.length || 1);
  const currentQ = filteredQuestions[safeIndex] || MULTIPLE_CHOICE_QUESTIONS[0];

  if (!currentQ) return null;

  const handleNext = () => {
    nextQuizQuestion();
    flyToCoords([35.243, 38.963], 50, -5, 6.2);
  };

  return (
    <DraggableCard
      className="absolute top-16 right-4 sm:right-16 z-30 w-80 sm:w-96 bg-[#09090b]/90 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-3.5 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-extrabold text-[11px] border border-indigo-500/30">
            TEST {safeIndex + 1}/{filteredQuestions.length}
          </span>
          <select
            value={gameCategoryFilter}
            onChange={(e) => {
              setGameCategoryFilter(e.target.value);
              resetQuizTest();
            }}
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] font-bold text-amber-300 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090b] text-slate-100">
                {cat === 'Genel' ? '🌐 Genel (Tümü)' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{quizScore} p</span>
          </div>

          <button
            onClick={() => {
              resetQuizTest();
              flyToCoords([35.243, 38.963], 50, -5, 6.2);
            }}
            title="Sıfırla"
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Close X Button */}
          <button
            onClick={() => setActiveTab('map')}
            title="Kapat"
            className="p-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <h3 className="font-extrabold text-xs sm:text-sm text-white leading-relaxed mb-2.5">
        {currentQ.questionText}
      </h3>

      {/* Options */}
      <div className="space-y-1.5 mb-2.5">
        {currentQ.options.map((option, idx) => {
          let btnStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200';

          if (isQuizAnswered) {
            if (idx === currentQ.correctIndex) {
              btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10';
            } else if (idx === quizSelectedOption) {
              btnStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-200 font-bold';
            } else {
              btnStyle = 'bg-white/5 border-white/5 text-slate-500 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              disabled={isQuizAnswered}
              onClick={() => answerQuizQuestion(idx)}
              className={`w-full p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
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

      {/* Post-Answer Result & Explanation Box */}
      {isQuizAnswered && (
        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
          {/* Highlighted Answer Pill */}
          <div className="p-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs">
            <span className="font-extrabold text-emerald-300 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" />
              DOĞRU CEVAP:
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-400 text-slate-950 font-black shadow-sm">
              {currentQ.options[currentQ.correctIndex]}
            </span>
          </div>

          <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[11px] space-y-1">
            <p className="text-slate-300 leading-relaxed font-medium">{currentQ.explanation}</p>
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 font-semibold flex items-start gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>ÖSYM Püf Noktası:</strong> {currentQ.osymTip}</span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <span>SONRAKİ TEST SORUSUNA GEÇ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </DraggableCard>
  );
}
