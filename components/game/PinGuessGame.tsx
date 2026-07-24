'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { PIN_GAME_QUESTIONS } from '@/lib/data/quizQuestions';
import DraggableCard from '@/components/ui/DraggableCard';
import { 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  MapPin,
  X,
  Filter,
  EyeOff
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
    isPinGuessed,
    lastGuessDistanceKm,
    lastGuessPoints,
    nextPinQuestion,
    resetPinGame,
    flyToCoords,
    setActiveTab,
    gameCategoryFilter,
    setGameCategoryFilter,
    isBlindMapMode,
    toggleBlindMapMode
  } = useAppStore();

  const [showHint, setShowHint] = useState(false);

  // Filter question set based on user's category selection (Default: Genel)
  const filteredQuestions = gameCategoryFilter === 'Genel'
    ? PIN_GAME_QUESTIONS
    : PIN_GAME_QUESTIONS.filter((q) => q.category === gameCategoryFilter || q.category.includes(gameCategoryFilter));

  const safeIndex = pinGameIndex % (filteredQuestions.length || 1);
  const currentQ = filteredQuestions[safeIndex] || PIN_GAME_QUESTIONS[0];

  if (!currentQ) return null;

  const handleNext = () => {
    setShowHint(false);
    nextPinQuestion();
    flyToCoords([35.243, 38.963], 50, -5, 6.2);
  };

  return (
    <DraggableCard
      className="absolute top-16 left-4 sm:left-16 z-30 w-80 sm:w-96 bg-[#09090b]/90 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-3.5 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-extrabold text-[11px] border border-indigo-500/30">
            SORU {safeIndex + 1}/{filteredQuestions.length}
          </span>
          {/* Category Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={gameCategoryFilter}
              onChange={(e) => {
                setGameCategoryFilter(e.target.value);
                resetPinGame();
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
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-amber-300 text-[10px] font-semibold flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>{showHint ? 'Gizle' : 'İpucu'}</span>
          </button>

          <button
            onClick={() => {
              resetPinGame();
              flyToCoords([35.243, 38.963], 50, -5, 6.2);
            }}
            title="Yeniden Başlat"
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
      <div className="mb-2.5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-xs sm:text-sm text-white leading-snug">
            {currentQ.questionText}
          </h3>

          <button
            onClick={toggleBlindMapMode}
            title="Dilsiz Harita Modunu Değiştir"
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 transition-all flex items-center gap-1 border ${
              isBlindMapMode
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-1 ring-amber-400'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-amber-300'
            }`}
          >
            <EyeOff className="w-3 h-3 text-amber-400" />
            <span>{isBlindMapMode ? '🙈 Dilsiz Mod' : 'Dilsiz Moda Geç'}</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 font-medium flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>İpucu:</strong> {currentQ.hint}</span>
          </div>
        )}
      </div>

      {/* Post-Guess Result Feedback */}
      {isPinGuessed ? (
        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
          {/* Prominent Highlighted Answer Badge */}
          <div className="p-2 bg-amber-500/15 border border-amber-500/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>DOĞRU CEVAP:</span>
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold shadow-sm">
                {currentQ.title}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-amber-300">+{lastGuessPoints}p</span>
            </div>
          </div>

          <div
            className={`p-2 rounded-xl border flex items-center justify-between ${
              (lastGuessPoints ?? 0) >= 70
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                : 'bg-orange-500/10 border-orange-500/30 text-orange-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {(lastGuessPoints ?? 0) >= 70 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
              )}
              <div className="text-[11px]">
                <span>Mesafe Sapması: </span>
                <strong className="underline text-amber-300">{lastGuessDistanceKm} km</strong>
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[11px] space-y-1">
            <p className="text-slate-200 font-medium">{currentQ.explanation}</p>
            <p className="text-amber-300 font-semibold">{currentQ.kpssTip}</p>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <span>SONRAKİ SORU</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-center text-[11px] text-slate-300 font-medium">
          👉 Haritada tahmin ettiğiniz noktaya tıklayın!
        </div>
      )}
    </DraggableCard>
  );
}
