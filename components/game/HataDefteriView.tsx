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
 <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c07]/95 p-4'>
 <motion.div className='hf-modal hf-modal-rule w-full max-w-md rounded-2xl p-8 text-center animate-in zoom-in-95'>
 <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center'>
 <BookOpen className='w-8 h-8 text-emerald-400' />
 </div>
 <h3 className='text-lg font-bold text-emerald-300 mb-2'>Hata Defteri Boş! </h3>
 <p className='text-slate-400 text-sm mb-6'>Henüz yanlış yaptığın bir soru yok. Bu harika bir haber!
 Test çözmeye veya harita testi yapmaya başla, yanlışların otomatik olarak buraya eklenecek.
 </p>
 <div className='flex gap-3 justify-center'>
 <button
 onClick={() => setActiveTab('quiz_test')}
 className='hf-btn-brass px-4 py-2 text-sm'
>Soru Bankasına Git
 </button>
 <button
 onClick={() => setActiveTab('pin_game')}
 className='hf-btn-brass px-4 py-2 text-sm'
>Harita Testi Yap
 </button>
 </div>
 </motion.div>
 </div>
 );
 }

 const categoryButtonClass = (cat: string) =>filterCategory === cat
 ? 'rounded-full border border-[#c9a24a]/70 bg-[#c9a24a]/20 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#e8d7ab] transition-all'
 : 'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10';

 const optionClass = (q: MissedQuestionRecord, i: number) =>i === q.correctIndex
 ? 'px-2 py-1 text-[11px] rounded-lg border transition-all bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
 : 'px-2 py-1 text-[11px] rounded-lg border transition-all bg-white/5 border-white/10 text-slate-400';

 return (
 <div className='hf-plaque fixed inset-0 z-50 flex flex-col overflow-hidden'>
 <div className='border-b border-[#c9a24a]/20 flex items-center justify-between p-4'>
 <div className='flex items-center gap-3'>
 <button
 onClick={() => setActiveTab('map')}
 className='rounded-full border border-[#c9a24a]/20 p-2 text-[#a9a894] transition-colors hover:text-[#f7f2e3]'
>
 <ArrowLeft className='w-5 h-5' />
 </button>
 <div>
 <h2 className='font-black text-white flex items-center gap-2'>
 <Brain className='w-6 h-6 text-amber-400' />Hata Defteri
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

 <div className='border-b border-[#c9a24a]/20 space-y-3 p-4'>
 <div className='relative'>
 <input
 type='text'
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder='Soru, kategori veya bölge ara...'
 className='hf-input w-full pl-10 pr-4 py-2.5'
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
 className='rounded-xl border border-[#c9a24a]/18 bg-white/[0.03] p-4 transition-all hover:border-[#c9a24a]/50'
>
 <div className='flex items-start justify-between gap-3 mb-2'>
 <span className='rounded border border-[#c9a24a]/35 bg-[#c9a24a]/12 px-2 py-0.5 text-[10px] font-semibold text-[#dcc07d]'>
 {q.category}
 </span>
 {q.region && (
 <span className='rounded border border-[#c9a24a]/20 px-2 py-0.5 text-[10px] font-medium text-[#a9a894]'>
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
 <BookOpen className='w-3 h-3' />Açıklama var
 </span>
 )}
 <button
 onClick={() => resolveMissedQuestion(q.id)}
 className='hf-btn-brass px-3 py-1.5 text-xs'
>Çözdüm, Kaldır
 </button>
 </div>
 </motion.div>
 ))}
 </div>

 {filteredQuestions.length> 0 && (
 <div className='border-t border-[#c9a24a]/20 p-4'>
 <button
 onClick={startMissedQuestionsPractice}
 className='hf-btn-brass flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm'
>
 <Brain className='w-5 h-5' />
 <span>{filteredQuestions.length} Soru ile Hata Defteri Pratiği Başlat</span>
 </button>
 </div>
 )}
 </div>
 );
}