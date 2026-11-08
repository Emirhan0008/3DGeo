'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { MULTIPLE_CHOICE_QUESTIONS, getCurrentQuizQuestion, getFilteredQuizQuestions, sanitizeQuestionText, MultipleChoiceQuestion } from '@/lib/data/quizQuestions';
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
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

const CATEGORIES = [
  'Genel',
  '📕 Hata Defterim',
  'Şehir Bulmaca (81 İl)',
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
    setGameCategoryFilter,
    missedQuestions
  } = useAppStore();

  const missedCount = Object.keys(missedQuestions || {}).length;
  const isMissedMode = gameCategoryFilter === 'Hata Defterim' || gameCategoryFilter === '📕 Hata Defterim';

  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.innerHeight < 550 || ('ontouchstart' in window && window.innerWidth < 1024);
  };

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || window.innerHeight < 550 || ('ontouchstart' in window && window.innerWidth < 1024);
    }
    return false;
  });

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
  }, [quizTestIndex, gameCategoryFilter]);

  useEffect(() => {
    if (shuffledQuizQuestions.length === 0) {
      if (isMissedMode) {
        const missedList = Object.values(missedQuestions || {}).map((m): MultipleChoiceQuestion => ({
          id: m.id,
          category: m.category,
          region: m.region as MultipleChoiceQuestion['region'],
          questionText: m.questionText,
          options: m.options,
          correctIndex: m.correctIndex,
          focusFeatureId: m.focusFeatureId,
          targetCoords: m.targetCoords,
          explanation: m.explanation,
          osymTip: m.osymTip
        }));
        if (missedList.length > 0) {
          useAppStore.setState({ shuffledQuizQuestions: missedList });
        } else {
          shuffleQuizQuestions();
        }
      } else {
        shuffleQuizQuestions();
      }
    }
  }, [shuffledQuizQuestions.length, shuffleQuizQuestions, isMissedMode, missedQuestions]);

  const filteredQuestions = isMissedMode
    ? (shuffledQuizQuestions.length > 0
        ? shuffledQuizQuestions
        : Object.values(missedQuestions || {}).map((m): MultipleChoiceQuestion => ({
            id: m.id,
            category: m.category,
            region: m.region as MultipleChoiceQuestion['region'],
            questionText: m.questionText,
            options: m.options,
            correctIndex: m.correctIndex,
            focusFeatureId: m.focusFeatureId,
            targetCoords: m.targetCoords,
            explanation: m.explanation,
            osymTip: m.osymTip
          })))
    : (shuffledQuizQuestions.length > 0
        ? shuffledQuizQuestions
        : getFilteredQuizQuestions(gameCategoryFilter));

  const safeIndex = quizTestIndex % (filteredQuestions.length || 1);
  const currentQ = (filteredQuestions.length > 0 && filteredQuestions[safeIndex]) || getCurrentQuizQuestion(quizTestIndex, gameCategoryFilter, filteredQuestions) || MULTIPLE_CHOICE_QUESTIONS[0];

  if (isMissedMode && filteredQuestions.length === 0) {
    return (
      <DraggableCard className="absolute top-11 sm:top-2 left-1/2 -translate-x-1/2 z-30 w-[95vw] sm:w-[480px] bg-[#09090b]/95 backdrop-blur-2xl border-2 border-emerald-400/80 rounded-2xl shadow-2xl p-5 text-center text-white animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3 shadow-lg">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="font-black text-base text-emerald-300 mb-1">Tebrikler! Hata Defteriniz Tertemiz</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Şu anda yanlış yaptığınız kayıtlı KPSS sorusu bulunmuyor. Genel denemeleri veya konu testlerini çözdükçe karıştırılan sorular otomatik olarak burada toplanacaktır.
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setGameCategoryFilter('Genel');
              resetQuizTest();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Genel KPSS Testini Başlat
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Haritaya Dön
          </button>
        </div>
      </DraggableCard>
    );
  }

  if (!currentQ) return null;

  const handleNext = () => {
    if (isMobile()) {
      setIsCollapsed(true);
    }
    nextQuizQuestion();
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button, select, input, a, option')) {
      setIsCollapsed((prev) => !prev);
    }
  };

  // Collapsed State (Default on Mobile)
  if (isCollapsed) {
    return (
      <div 
        onDoubleClick={() => setIsCollapsed(false)}
        title="Çift Tıklayarak Detayları Açabilirsiniz"
        className={`absolute top-11 sm:top-2 left-1/2 -translate-x-1/2 z-30 w-[95vw] sm:w-auto max-w-lg sm:max-w-[96vw] bg-[#09090b]/95 backdrop-blur-2xl border-2 ${
          isMissedMode ? 'border-amber-400/90 shadow-amber-500/20' : 'border-emerald-400/80'
        } rounded-xl shadow-2xl px-2.5 py-1.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 text-white animate-in fade-in duration-200 cursor-pointer`}
      >
        {/* Row 1 on mobile portrait / Left section on landscape */}
        <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className={`px-1.5 py-0.5 rounded ${isMissedMode ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-400 text-slate-950 font-black'} text-[9px] sm:text-[10px] shrink-0 flex items-center gap-0.5 shadow-sm`}>
              {isMissedMode ? 'HATA TEKRARI:' : 'TEST:'}
            </span>
            <span className={`font-black text-xs sm:text-sm ${isMissedMode ? 'text-amber-300' : 'text-emerald-300'} leading-snug break-words line-clamp-2 sm:line-clamp-1`}>
              {currentQ.category}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-300 font-extrabold bg-white/10 px-1.5 py-0.5 rounded border border-white/10 shrink-0">
            {safeIndex + 1}/{filteredQuestions.length}
          </span>
        </div>

        {/* Row 2 on mobile portrait / Right section on landscape */}
        <div className="flex items-center justify-between sm:justify-end gap-1 shrink-0 border-t sm:border-t-0 border-white/10 pt-1 sm:pt-0">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded text-[9px] font-black text-emerald-300 sm:hidden">
            <Trophy className="w-2.5 h-2.5 text-emerald-400" />
            <span>{quizScore} P</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Sonraki Soruya Geç"
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] sm:text-xs rounded-lg flex items-center gap-0.5 shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
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
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] sm:text-xs rounded-lg flex items-center gap-0.5 border border-emerald-400 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Detay</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('map');
              }}
              className="p-1 rounded bg-white/10 hover:bg-rose-500/30 text-slate-300 border border-white/20 transition-all shrink-0 cursor-pointer"
              title="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Card classes (compact floating card over map)
  const containerClasses = `absolute top-11 sm:top-2 left-1/2 -translate-x-1/2 z-30 w-[95vw] sm:w-[85vw] md:w-[520px] lg:w-[560px] max-w-2xl max-h-[88vh] overflow-y-auto bg-[#09090b]/95 backdrop-blur-2xl border ${
    isMissedMode ? 'border-amber-400/80 shadow-amber-500/20' : 'border-emerald-500/40'
  } rounded-xl shadow-2xl overflow-hidden text-slate-100 p-1.5 transition-all`;

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
          <span className={`px-1.5 py-0.5 rounded ${
            isMissedMode ? 'bg-amber-500/30 text-amber-300 border-amber-400/50' : 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40'
          } font-black text-[9px] sm:text-xs border flex items-center gap-1`}>
            {isMissedMode && <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />}
            {isMissedMode ? 'HATA' : 'TEST'} {safeIndex + 1}/{filteredQuestions.length}
          </span>
          <select
            value={gameCategoryFilter}
            onChange={(e) => {
              const val = e.target.value;
              setGameCategoryFilter(val);
              if (val === '📕 Hata Defterim' || val === 'Hata Defterim') {
                useAppStore.getState().startMissedQuestionsPractice();
              } else {
                resetQuizTest();
              }
            }}
            className={`bg-white/10 border ${
              isMissedMode ? 'border-amber-400 text-amber-300 font-black' : 'border-emerald-400/50 text-emerald-300 font-bold'
            } rounded px-1 py-0.5 text-[9px] sm:text-xs focus:outline-none cursor-pointer max-w-[110px] sm:max-w-[150px] truncate`}
          >
            {CATEGORIES.map((cat) => {
              const label = cat === '📕 Hata Defterim'
                ? `📕 Hata Defterim (${missedCount})`
                : cat === 'Genel'
                ? '🌐 Genel (Tümü)'
                : cat;
              return (
                <option key={cat} value={cat} className="bg-[#09090b] text-slate-100 font-bold">
                  {label}
                </option>
              );
            })}
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

          <button
            onClick={() => setIsCollapsed(true)}
            title="Kartı Küçült (Sadece İsim Modu)"
            className="p-0.5 sm:p-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-emerald-200 rounded text-[9px] font-black"
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
        </div>
      </div>

      {/* Mode Banner if Hata Defterim */}
      {isMissedMode && (
        <div className="mb-1.5 px-2 py-1 bg-amber-500/15 border border-amber-400/40 rounded-lg flex items-center justify-between text-[9px] sm:text-[10px] text-amber-200 font-bold">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Hata Tekrarı Modu: Doğru bildiğiniz soru otomatik pekiştirilip defterden çıkarılır!</span>
          </div>
          <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded font-black shrink-0">
            {filteredQuestions.length} Eksik Soru
          </span>
        </div>
      )}

      {/* Main Content Layout - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 sm:gap-3 items-start my-auto">
        {/* Left Column (Image & Category Banner) */}
        <div className="md:col-span-4 space-y-1 sm:space-y-2">
          <div className="relative w-full h-16 sm:h-20 rounded-lg overflow-hidden border border-white/15 shadow-inner transition-all">
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
          <div className="p-1.5 sm:p-2 bg-white/5 border border-white/10 rounded-lg min-h-[34px] flex items-center">
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

              {/* Special feedback if student resolved a missed question */}
              {isMissedMode && quizSelectedOption === currentQ.correctIndex && (
                <div className="p-1.5 bg-emerald-500/25 border border-emerald-400/70 rounded-lg text-[10px] font-black text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>Harika! Bu konuyu pekiştirdiniz ve Hata Defterinizden başarıyla silindi!</span>
                </div>
              )}

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

