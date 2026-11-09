'use client';

import React, { useState } from 'react';
import { useAppStore, type MissedQuestionRecord } from '@/lib/store/useStore';
import { X, RefreshCw, Brain, BookOpen, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function HataDefteriView() {
  const { 
    missedQuestions, 
    clearMissedQuestions, 
    startMissedQuestionsPractice,
    resolveMissedQuestion,
    setActiveTab
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tümü');

  const questions = Object.values(missedQuestions);
  
  const categories = ['Tümü', ...new Set(questions.map(q => q.category).filter(Boolean))];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = !searchQuery || 
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.region && q.region.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'Tümü' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => b.wrongCount - a.wrongCount);

  if (questions.length === 0) {
    return (
      <div className='fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4'>
        <motion.div className='w-full max-w-md bg-[#09090b]/95 border border-emerald-500/40 rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center'>
            <BookOpen className='w-8 h-8 text-emerald-400' />
          </div>
          <h3 className='text-lg font-bold text-emerald-300 mb-2'>Hata Defteri Boş! 🎉</h3>
          <p className='text-slate-400 text-sm mb-6'>
            Henüz yanlış yaptığın bir soru yok. Bu harika bir haber!
            Test çözmeye veya harita testi yapmaya başla, yanlışların otomatik olarak buraya eklenecek.
          </p>
          <div className='flex gap-3 justify-center'>
            <button
              onClick={() => setActiveTab('quiz_test')}
              className='px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all'
            >
              Soru Bankasına Git
            </button>
            <button
              onClick={() => setActiveTab('pin_game')}
              className='px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all'
            >
              Harita Testi Yap
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const categoryButtonClass = (cat: string) => 
    filterCategory === cat
      ? 'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-amber-500 text-slate-950 shadow-md'
      : 'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10';

  const optionClass = (q: MissedQuestionRecord, i: number) =>
    i === q.correctIndex
      ? 'px-2 py-1 text-[11px] rounded-lg border transition-all bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
      : 'px-2 py-1 text-[11px] rounded-lg border transition-all bg-white/5 border-white/10 text-slate-400';

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col overflow-hidden'>
      <div className='p-4 border-b border-white/10 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setActiveTab('map')}
            className='p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div>
            <h2 className='font-black text-white flex items-center gap-2'>
              <Brain className='w-6 h-6 text-amber-400' />
              Hata Defteri
            </h2>
            <p className='text-xs text-slate-400'>
              {questions.length} soru • {filteredQuestions.length} filtrelenmiş
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm('Tüm hata defterini temizlemek istediğinize emin misiniz?')) {
              clearMissedQuestions();
            }
          }}
          className='p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 transition-all'
          title='Tüm Hata Defterini Temizle'
        >
          <RefreshCw className='w-5 h-5' />
        </button>
      </div>

      <div className='p-4 border-b border-white/10 space-y-3'>
        <div className='relative'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Soru, kategori veya bölge ara...'
            className='w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400'
          />
          <X className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
        </div>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={categoryButtonClass(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {sortedQuestions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/40 transition-all'
          >
            <div className='flex items-start justify-between gap-3 mb-2'>
              <span className='px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded'>
                {q.category}
              </span>
              {q.region && (
                <span className='px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-medium rounded'>
                  {q.region}
                </span>
              )}
              <span className='px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold rounded'>
                {q.wrongCount}x yanlış
              </span>
            </div>
            <p className='text-sm text-slate-200 mb-3 leading-relaxed'>{q.questionText}</p>
            <div className='flex flex-wrap gap-1.5 mb-3'>
              {q.options.map((opt, i) => (
                <span
                  key={i}
                  className={optionClass(q, i)}
                >
                  {String.fromCharCode(65 + i)}) {opt}
                </span>
              ))}
            </div>
            <div className='flex items-center justify-between pt-2 border-t border-white/10'>
              {q.explanation && (
                <span className='text-xs text-slate-400 flex items-center gap-1'>
                  <BookOpen className='w-3 h-3' />
                  Açıklama var
                </span>
              )}
              <button
                onClick={() => resolveMissedQuestion(q.id)}
                className='px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all'
              >
                Çözdüm, Kaldır
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQuestions.length > 0 && (
        <div className='p-4 border-t border-white/10'>
          <button
            onClick={startMissedQuestionsPractice}
            className='w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2'
          >
            <Brain className='w-5 h-5' />
            <span>{filteredQuestions.length} Soru ile Hata Defteri Pratiği Başlat</span>
          </button>
        </div>
      )}
    </div>
  );
}