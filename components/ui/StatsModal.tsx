'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { 
  Trophy, 
  Flame, 
  Target, 
  Award, 
  X, 
  Sparkles,
  BarChart3,
  MapPin,
  TrendingDown,
  AlertTriangle,
  Compass,
  Bot,
  Loader2,
  BrainCircuit,
  EyeOff,
  RotateCcw,
  Navigation,
  CheckCircle2,
  Layers
} from 'lucide-react';

const ALL_BADGES = [
  { name: '3D Coğrafyacı Çırağı', icon: '🐣', desc: 'Uygulamaya ilk adım attın.' },
  { name: 'Tam İsabet Kaptan', icon: '🎯', desc: 'Pim bulma oyununda %100 tam isabet yaptın.' },
  { name: '5\'li Seri Canavarı', icon: '🔥', desc: 'Üst üste 5 doğru cevap verdin.' },
  { name: 'KPSS Coğrafya Üstadı', icon: '🎓', desc: '300 puan barajını aştın.' },
  { name: 'Gümrük Muhafızı', icon: '🚪', desc: 'Tüm sınır kapılarını ezberledin.' },
  { name: 'Mavi Vatan Uzmanı', icon: '🌊', desc: 'Akarsu ve gölleri eksiksiz bildin.' }
];

export default function StatsModal() {
  const {
    score,
    streak,
    unlockedBadges,
    totalQuestionsAnswered,
    correctAnswersCount,
    regionalStats,
    categoryStats,
    totalDistanceErrorKm,
    pinGuessCount,
    missedItems,
    flyToCoords,
    setActiveTab,
    isBlindMapMode,
    toggleBlindMapMode,
    resetStats
  } = useAppStore();

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'regions' | 'weakspots' | 'ai_report'>('overview');

  const accuracyPct = totalQuestionsAnswered > 0
    ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100)
    : 0;

  const avgDistanceKm = pinGuessCount > 0
    ? Math.round(totalDistanceErrorKm / pinGuessCount)
    : 0;

  // Determine user competence rank
  let competenceGrade = 'Henüz Test Edilmedi';
  let competenceColor = 'text-slate-400 bg-white/5 border-white/10';
  if (totalQuestionsAnswered >= 3) {
    if (accuracyPct >= 85) {
      competenceGrade = '🏆 KPSS Coğrafya Derece Adayı';
      competenceColor = 'text-amber-300 bg-amber-500/20 border-amber-500/40';
    } else if (accuracyPct >= 65) {
      competenceGrade = '🥇 İyi Seviye ÖSYM Adayı';
      competenceColor = 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
    } else if (accuracyPct >= 45) {
      competenceGrade = '📈 Gelişmekte Olan Seviye';
      competenceColor = 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40';
    } else {
      competenceGrade = '⚠️ Sıfırdan Tekrar Yapılmalı';
      competenceColor = 'text-rose-300 bg-rose-500/20 border-rose-500/40';
    }
  }

  // Find most error prone region
  let maxWrongReg = 'Doğu Anadolu';
  let maxWrongRegCount = -1;
  Object.entries(regionalStats || {}).forEach(([reg, data]) => {
    if (data.wrong > maxWrongRegCount) {
      maxWrongRegCount = data.wrong;
      maxWrongReg = reg;
    }
  });

  // Find most error prone category
  let maxWrongCat = 'Geçitler & Sınır Kapıları';
  let maxWrongCatCount = -1;
  Object.entries(categoryStats || {}).forEach(([cat, data]) => {
    if (data.wrong > maxWrongCatCount) {
      maxWrongCatCount = data.wrong;
      maxWrongCat = cat;
    }
  });

  // Array of missed items
  const missedList = Object.values(missedItems || {});

  const handleGenerateAiReport = async () => {
    setLoadingAi(true);
    setActiveSubTab('ai_report');
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            totalQuestionsAnswered,
            correctAnswersCount,
            accuracyPct,
            avgDistanceKm,
            maxWrongReg,
            maxWrongCat,
            missedItemsList: missedList.map((m) => `${m.name} (${m.region})`).join(', ')
          }
        })
      });

      const data = await res.json();
      if (data.text) {
        setAiReport(data.text);
      } else {
        setAiReport('Akıllı rapor üretilemedi. Lütfen tekrar deneyiniz.');
      }
    } catch {
      setAiReport('Sunucu bağlantısı kurulamadı. Lütfen tekrar deneyiniz.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-4 transition-all max-h-[88vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm sm:text-base text-white tracking-wide">
              AKILLI KPSS COĞRAFYA TEŞHİS &amp; ANALİZ PANOSU
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Soru ve harita testlerinizden elde edilen kişisel gelişim verileri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetStats}
            title="İstatistikleri Sıfırla"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Sıfırla</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs inside Analytics */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 mb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-extrabold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Genel Görünüm</span>
        </button>

        <button
          onClick={() => setActiveSubTab('regions')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-extrabold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'regions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bölge &amp; Konu Karnesi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weakspots')}
          className={`flex-1 py-1.5 px-3 rounded-lg font-extrabold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'weakspots'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
          <span>Sık Karıştırılanlar ({missedList.length})</span>
        </button>

        <button
          onClick={() => {
            if (!aiReport && !loadingAi) {
              handleGenerateAiReport();
            } else {
              setActiveSubTab('ai_report');
            }
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg font-black transition-all whitespace-nowrap flex items-center justify-center gap-1.5 border ${
            activeSubTab === 'ai_report'
              ? 'bg-amber-500 text-slate-950 border-amber-300 font-extrabold shadow-md'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>AI Teşhis Raporu</span>
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* User Competence Rank Badge */}
          <div className="p-3 bg-gradient-to-r from-indigo-950 via-[#09090b] to-purple-950 border border-indigo-500/30 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ÖSYM Yetkinlik Seviyesi:</span>
              <div className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                {competenceGrade}
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase ${competenceColor}`}>
              %{accuracyPct} Başarı
            </div>
          </div>

          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Toplam Puan</span>
              <div className="font-black text-base text-amber-300">{score}</div>
            </div>

            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 mx-auto mb-1" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Üst Üste Seri</span>
              <div className="font-black text-base text-orange-400">{streak}</div>
            </div>

            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Target className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Doğru Cevap</span>
              <div className="font-black text-base text-emerald-300">{correctAnswersCount}/{totalQuestionsAnswered}</div>
            </div>

            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Compass className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Harita Ort. Sapma</span>
              <div className="font-black text-base text-cyan-300">{avgDistanceKm} km</div>
            </div>
          </div>

          {/* Quick Critical Weaknesses Highlights */}
          <div className="p-3 bg-gradient-to-r from-rose-950/40 via-[#09090b] to-amber-950/30 border border-rose-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>SPESİFİK KPSS ZAYIF HAKAM VE HATA TESPİTİ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase">En Çok Hata Yapılan Bölge:</div>
                <div className="font-extrabold text-rose-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{maxWrongReg}</span>
                </div>
              </div>

              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase">En Çok Zorlanılan Şekil / Konu:</div>
                <div className="font-extrabold text-amber-300 flex items-center gap-1 mt-0.5">
                  <TrendingDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{maxWrongCat}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dilsiz Harita Challenge Mode Switch Banner */}
          <div className="p-3 bg-gradient-to-r from-amber-950/60 via-[#09090b] to-indigo-950/60 border border-amber-500/40 rounded-xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>DİLSİZ HARİTA (SADECE DIŞ SINIR) MODU</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-snug">
                Kendini daha çok zorlamak istiyor musun? İl sınırları ve şehir isimleri olmadan tamamen boş Türkiye haritasında test çöz!
              </p>
            </div>

            <button
              onClick={toggleBlindMapMode}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-lg ${
                isBlindMapMode
                  ? 'bg-amber-500 text-slate-950 font-black border border-amber-300 ring-2 ring-amber-400 animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
              }`}
            >
              <span>{isBlindMapMode ? '🙈 Dilsiz Mod Aktif' : '🙈 Dilsiz Moda Geç'}</span>
            </button>
          </div>

          {/* AI Report Trigger CTA */}
          <button
            onClick={handleGenerateAiReport}
            disabled={loadingAi}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>YAPAY ZEKA KPSS AKILLI TEŞHİS RAPORU ÜRET</span>
          </button>
        </div>
      )}

      {/* SUB-TAB 2: REGIONS & CATEGORIES */}
      {activeSubTab === 'regions' && (
        <div className="space-y-4 animate-in fade-in duration-200 text-xs">
          {/* Regional Detailed Progress */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Coğrafi Bölgelere Göre İsabet Oranları
            </h3>

            <div className="space-y-2">
              {Object.entries(regionalStats || {}).map(([regName, stats]) => {
                const total = stats.correct + stats.wrong;
                const regAccuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
                let statusLabel = 'Henüz Test Edilmedi';
                let statusBg = 'text-slate-500';
                if (total > 0) {
                  if (regAccuracy >= 80) { statusLabel = 'Kuvvetli ✅'; statusBg = 'text-emerald-400 font-bold'; }
                  else if (regAccuracy >= 50) { statusLabel = 'Orta Seviye ⚠️'; statusBg = 'text-amber-400 font-bold'; }
                  else { statusLabel = 'Kritik Eksik ❌'; statusBg = 'text-rose-400 font-bold'; }
                }

                return (
                  <div key={regName} className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{regName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] ${statusBg}`}>{statusLabel}</span>
                        <span className="text-[10px] font-extrabold text-indigo-300">
                          {total > 0 ? `%${regAccuracy} (${stats.correct}D / ${stats.wrong}Y)` : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${total > 0 ? regAccuracy : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Yer Şekli &amp; Konu Türüne Göre Başarı
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(categoryStats || {}).map(([catName, stats]) => {
                const total = stats.correct + stats.wrong;
                const catAccuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
                return (
                  <div key={catName} className="p-2 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-200 text-[11px]">{catName}</span>
                      <span className="text-[10px] font-black text-amber-300">
                        {total > 0 ? `%${catAccuracy}` : '-'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${total > 0 ? catAccuracy : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WEAK SPOTS / MISSED ITEMS LIST */}
      {activeSubTab === 'weakspots' && (
        <div className="space-y-3 animate-in fade-in duration-200 text-xs">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Sık karıştırılan veya yanlış tahmin edilen spesifik KPSS noktalarınız:</span>
            </div>
            <span className="font-black px-2 py-0.5 rounded bg-rose-500 text-white text-[10px]">
              {missedList.length} Öğe
            </span>
          </div>

          {missedList.length === 0 ? (
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-2 text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-slate-200 text-xs">Henüz Kaydedilmiş Hatanız Bulunmuyor!</p>
              <p className="text-[11px]">Harita veya soru testlerini çözdükçe karıştırılan noktalar otomatik olarak burada listelenecektir.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {missedList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="font-black text-amber-300 text-xs">{item.name}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{item.region}</span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{item.category}</span>
                      <span className="text-rose-400 font-bold">{item.wrongCount}x Hata</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('map');
                      flyToCoords(item.coords, 60, 10, 8.2);
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>3D Haritada İncele</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: AI DIAGNOSTIC REPORT */}
      {activeSubTab === 'ai_report' && (
        <div className="space-y-3 animate-in fade-in duration-200 text-xs">
          {loadingAi ? (
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="font-extrabold text-amber-300 text-sm">Yapay Zeka KPSS Eğitmeni İstatistiklerinizi Analiz Ediyor...</p>
              <p className="text-[11px] text-slate-400">Gelişim karneniz, hafıza şifreleriniz ve ÖSYM soru tuzakları hazırlanıyor.</p>
            </div>
          ) : aiReport ? (
            <div className="p-3.5 bg-white/5 border border-indigo-500/30 rounded-xl space-y-2 text-slate-200 leading-relaxed max-h-80 overflow-y-auto font-sans">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 font-black text-amber-300 text-xs">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                <span>YAPAY ZEKA KPSS ÖSYM AKILLI TEŞHİS RAPORU</span>
              </div>
              <div className="text-[11px] whitespace-pre-wrap space-y-1">
                {aiReport}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-3">
              <Bot className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
              <p className="font-bold text-slate-200">Kişiselleştirilmiş Yapay Zeka KPSS Raporu</p>
              <button
                onClick={handleGenerateAiReport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Raporu Şimdi Üret
              </button>
            </div>
          )}
        </div>
      )}

      {/* Badges Section */}
      <div className="mt-3.5 pt-3 border-t border-white/10">
        <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-400" />
          Kazanılan Rozetler
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.name);
            return (
              <div
                key={badge.name}
                className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                  isUnlocked
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-slate-100 shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-600 opacity-40'
                }`}
              >
                <span className="text-lg shrink-0">{badge.icon}</span>
                <div>
                  <div className="font-bold text-xs leading-tight text-white">{badge.name}</div>
                  <div className="text-[9px] text-slate-400 leading-tight mt-0.5">{badge.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
