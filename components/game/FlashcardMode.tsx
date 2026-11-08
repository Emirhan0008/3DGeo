'use client';

import React, { useState, useMemo } from 'react';
import { ALL_GEO_FEATURES, GeoFeature, getFeatureImageUrl } from '@/lib/data/turkeyData';
import { useAppStore } from '@/lib/store/useStore';
import { shuffleArray } from '@/lib/data/quizQuestions';
import { 
  RotateCw, 
  Check, 
  Sparkles, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  X 
} from 'lucide-react';

export default function FlashcardMode() {
  const { flyToCoords, setSelectedFeature, setActiveTab } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);

  // Filter and shuffle items whenever category changes or initially
  const baseList = useMemo(() => {
    const filtered = ALL_GEO_FEATURES.filter((f) => {
      if (selectedCategory === 'Hepsi') return true;
      if (selectedCategory === '81 İl & Şehirler') return f.type === 'province' || f.category?.includes('İl');
      if (selectedCategory === 'Dağlar') return f.type === 'mountain';
      if (selectedCategory === 'Akarsular') return f.type === 'river';
      if (selectedCategory === 'Göller') return f.type === 'lake';
      if (selectedCategory === 'Sınır Kapıları') return f.type === 'border_gate';
      if (selectedCategory === 'Geçitler') return f.type === 'pass';
      if (selectedCategory === 'Ovalar & Platolar') return f.type === 'plain' || f.type === 'plateau';
      if (selectedCategory === 'Madenler') return f.type === 'mine';
      return true;
    });
    return shuffleArray(filtered);
  }, [selectedCategory]);

  const [customList, setCustomList] = useState<GeoFeature[] | null>(null);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCustomList(null);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const filteredList = customList ?? baseList;

  const handleShuffle = () => {
    setCustomList(shuffleArray([...filteredList]));
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  const currentItem = filteredList[currentIndex] || filteredList[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const toggleLearned = (id: string) => {
    if (learnedIds.includes(id)) {
      setLearnedIds(learnedIds.filter((item) => item !== id));
    } else {
      setLearnedIds([...learnedIds, id]);
    }
  };

  if (!currentItem) return null;

  const isCurrentLearned = learnedIds.includes(currentItem.id);

  return (
    <div className="absolute top-11 sm:top-4 left-1/2 -translate-x-1/2 z-20 w-[95vw] sm:w-[92%] max-w-lg max-h-[88vh] overflow-y-auto bg-[#09090b]/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl text-slate-100 p-3 sm:p-4 transition-all">
      {/* Category Filter Pills & Close Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 sm:mb-3 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs py-0.5 scrollbar-none">
          {['Hepsi', '81 İl & Şehirler', 'Dağlar', 'Akarsular', 'Göller', 'Sınır Kapıları', 'Geçitler', 'Ovalar & Platolar', 'Madenler'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={handleShuffle}
            title="Kartları Karıştır"
            className="p-1 sm:p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1 text-[10px] sm:text-[11px] font-bold cursor-pointer"
          >
            <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Karıştır</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            title="Kapat"
            className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Counter Banner */}
      <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-400">
        <span>Kart: <strong>{currentIndex + 1} / {filteredList.length}</strong></span>
        <span>Öğrenilen: <strong className="text-emerald-400">{learnedIds.length} Kart</strong></span>
      </div>

      {/* 3D Flip Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[220px] bg-gradient-to-br from-indigo-950/40 via-[#09090b] to-purple-950/30 border border-white/10 rounded-2xl p-5 cursor-pointer shadow-2xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300"
      >
        {!isFlipped ? (
          /* Card Front */
          <div className="flex flex-col items-center justify-center text-center my-auto space-y-3">
            {/* Flashcard Photo Image */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getFeatureImageUrl(currentItem)}
                alt={currentItem.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white/90">
                <span className="px-2 py-0.5 rounded bg-black/60 font-bold border border-white/10 text-indigo-300">
                  {currentItem.category || currentItem.type}
                </span>
                <span className="font-semibold">{currentItem.region}</span>
              </div>
            </div>

            <h2 className="font-black text-xl text-white tracking-wide">
              {currentItem.name}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              📍 {currentItem.region} Bölgesi {currentItem.elevation ? `• ${currentItem.elevation} m` : ''}
            </p>

            <div className="pt-1 text-[11px] text-indigo-400 font-bold flex items-center gap-1.5 animate-pulse">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Detaylar ve KPSS Notu İçin Karta Tıklayın!</span>
            </div>
          </div>
        ) : (
          /* Card Back */
          <div className="space-y-3 text-xs my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="font-extrabold text-indigo-300 text-sm">{currentItem.name}</span>
              <span className="text-[10px] text-slate-400">KPSS Özet Kartı</span>
            </div>

            <p className="text-slate-200 leading-relaxed font-medium">
              {currentItem.description}
            </p>

            {currentItem.mnemonic && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200">
                <span className="font-black text-[10px] uppercase text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Kodlama:
                </span>
                <p className="italic font-bold text-xs mt-0.5">&quot;{currentItem.mnemonic}&quot;</p>
              </div>
            )}

            {currentItem.kpssTips && (
              <div className="space-y-1">
                <span className="font-bold text-emerald-400 text-[10px] uppercase">KPSS Sınav İpuçları:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                  {currentItem.kpssTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <button
          onClick={handlePrev}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setSelectedFeature(currentItem);
            flyToCoords(currentItem.coordinates, 65, 30, 10);
          }}
          className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Haritada Göster</span>
        </button>

        <button
          onClick={() => toggleLearned(currentItem.id)}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isCurrentLearned
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{isCurrentLearned ? 'Öğrenildi' : 'Öğrendim'}</span>
        </button>

        <button
          onClick={handleNext}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
