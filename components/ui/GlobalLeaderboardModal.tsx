'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { fetchGlobalLeaderboard, setRumuzAnonymity, LeaderboardEntry } from '@/lib/rumuzService';
import AvatarWithBadgeFrame from '@/components/ui/AvatarWithBadgeFrame';
import {
  Trophy,
  Swords,
  Flame,
  RefreshCw,
  X,
  Sparkles,
  Loader2,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

interface GlobalLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalLeaderboardModal({ isOpen, onClose }: GlobalLeaderboardModalProps) {
  const {
    score,
    streak,
    duelStats,
    unlockedBadges,
    equippedTitle,
    avatarIcon,
    avatarBg
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'score' | 'duels' | 'streak'>('score');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kpss3d_is_anonymous') === 'true';
    }
    return false;
  });
  const [isTogglingAnon, setIsTogglingAnon] = useState(false);

  const activeRumuz = typeof window !== 'undefined' ? localStorage.getItem('kpss3d_active_rumuz') || 'Misafir Gezgin' : 'Misafir Gezgin';

  const loadLeaderboard = useCallback(async (tab = activeTab) => {
    setIsLoading(true);
    try {
      const data = await fetchGlobalLeaderboard(tab);
      setLeaderboard(data);
    } catch (err) {
      console.warn('Leaderboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard(activeTab);
    }
  }, [isOpen, activeTab, loadLeaderboard]);

  const handleToggleAnonymity = async () => {
    const nextVal = !isAnonymous;
    setIsTogglingAnon(true);
    setIsAnonymous(nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpss3d_is_anonymous', nextVal ? 'true' : 'false');
    }
    await setRumuzAnonymity(activeRumuz, nextVal);
    setIsTogglingAnon(false);
    await loadLeaderboard(activeTab);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e111a] via-[#090b10] to-[#06080c] border-2 border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-slate-900/80 border-b border-amber-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 truncate">
                <span>🌍 Türkiye Geneli Sıralama</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider hidden sm:inline-block">
                  Canlı Liderlik Tablosu
                </span>
              </h2>
              <p className="text-xs text-slate-300 truncate">
                KPSS Coğrafya şampiyonları, 1v1 düello ustaları ve rekor seriler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => loadLeaderboard(activeTab)}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection & Privacy Toggle */}
        <div className="px-3.5 sm:px-4 pt-3 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('score')}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                activeTab === 'score'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>🏆 Toplam Puan</span>
            </button>

            <button
              onClick={() => setActiveTab('duels')}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                activeTab === 'duels'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-300 shadow-md shadow-indigo-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>⚔️ 1v1 Düello</span>
            </button>

            <button
              onClick={() => setActiveTab('streak')}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                activeTab === 'streak'
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-rose-300 shadow-md shadow-rose-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>🔥 Seri Rekoru</span>
            </button>
          </div>

          {/* User Rumuz Privacy Toggle */}
          <button
            onClick={handleToggleAnonymity}
            disabled={isTogglingAnon}
            className={`w-full sm:w-auto px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAnonymous
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-300 hover:text-white'
            }`}
            title={isAnonymous ? 'Rumuzun şu an gizli (*** olarak görünüyor)' : 'Rumuzunu gizle'}
          >
            {isAnonymous ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-purple-300" />
                <span>🔒 Rumuz Gizli (***)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Rumuzumu Gizle (***)</span>
              </>
            )}
          </button>
        </div>

        {/* Current User Snapshot Banner */}
        <div className="mx-3.5 sm:mx-4 my-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-inner">
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
            <AvatarWithBadgeFrame
              rumuz={activeRumuz}
              avatarIcon={avatarIcon}
              avatarBg={avatarBg}
              unlockedBadges={unlockedBadges}
              duelWins={duelStats.duelWins}
              equippedTitle={equippedTitle}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Senin Profilin</span>
                <span className="text-xs font-black text-white truncate">
                  {isAnonymous ? `*** (${activeRumuz} - Gizli)` : activeRumuz}
                </span>
                {isAnonymous && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 text-[9px] font-bold border border-purple-400/30">
                    Gizli Mod
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-slate-300 truncate">
                {equippedTitle || '3D Coğrafyacı Çırağı'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
            <div className="bg-black/30 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
              <div className="text-[9px] uppercase font-black text-amber-400">Puan</div>
              <div className="text-xs font-black text-emerald-400">{score} p</div>
            </div>
            <div className="bg-black/30 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
              <div className="text-[9px] uppercase font-black text-indigo-300">Düello Zafer</div>
              <div className="text-xs font-black text-indigo-200">⚔️ {duelStats.duelWins}</div>
            </div>
            <div className="bg-black/30 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
              <div className="text-[9px] uppercase font-black text-orange-400">Seri Zafer</div>
              <div className="text-xs font-black text-orange-300">🔥 {duelStats.duelStreak}</div>
            </div>
            <div className="bg-black/30 sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
              <div className="text-[9px] uppercase font-black text-yellow-400">En İyi Seri</div>
              <div className="text-xs font-black text-yellow-200">⚡ {Math.max(duelStats.bestDuelStreak || 0, streak || 0)}</div>
            </div>
          </div>
        </div>

        {/* Rankings List */}
        <div className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-2 space-y-2">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <span className="text-xs font-bold">Global sıralamalar yükleniyor...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Henüz kayıtlı lider bulunamadı veya ilk sen olacaksın!</p>
              <p className="text-[11px] text-slate-400">Test çözerek veya 1v1 düello kazanarak hemen puanını yükselt.</p>
            </div>
          ) : (
            leaderboard.map((entry) => {
              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;
              const isThird = entry.rank === 3;
              const isCurrentUser = entry.rumuz.toLowerCase() === activeRumuz.toLowerCase();

              const displayedName = entry.isAnonymous
                ? isCurrentUser
                  ? `*** (${entry.rumuz} - Sen)`
                  : '*** (Gizli Gezgin)'
                : entry.rumuz;

              const rankBadge = isFirst ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-lg shadow-amber-500/50 ring-2 ring-amber-300">
                  👑
                </div>
              ) : isSecond ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md ring-2 ring-slate-300">
                  🥈
                </div>
              ) : isThird ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-700 to-yellow-800 text-white flex items-center justify-center font-black text-xs shadow-md ring-2 ring-amber-600">
                  🥉
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-slate-300 flex items-center justify-center font-black text-xs">
                  #{entry.rank}
                </div>
              );

              return (
                <div
                  key={entry.rumuzKey || entry.rumuz}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isCurrentUser
                      ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                      : isFirst
                      ? 'bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900 border-amber-500/50 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0">{rankBadge}</div>

                    <AvatarWithBadgeFrame
                      rumuz={entry.rumuz}
                      avatarIcon={entry.avatarIcon}
                      avatarBg={entry.avatarBg}
                      unlockedBadges={Array(entry.unlockedBadgesCount).fill('')}
                      duelWins={entry.duelWins}
                      equippedTitle={entry.equippedTitle}
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-xs sm:text-sm text-white truncate">{displayedName}</span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                            Sen
                          </span>
                        )}
                        {entry.isAnonymous && (
                          <span className="text-[10px] text-purple-300 font-bold">🔒</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 truncate">
                        {entry.equippedTitle || '3D Coğrafyacı Çırağı'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 shrink-0 text-right border-t sm:border-t-0 pt-1.5 sm:pt-0 border-white/5">
                    {/* Score column */}
                    <div>
                      <div className="text-[9px] uppercase font-black text-amber-400">Puan</div>
                      <div className="text-xs sm:text-sm font-black text-emerald-400">{entry.score} p</div>
                    </div>

                    {/* Duel Wins column */}
                    <div>
                      <div className="text-[9px] uppercase font-black text-indigo-300">Zaferler</div>
                      <div className="text-xs sm:text-sm font-black text-indigo-200">
                        ⚔️ {entry.duelWins}
                        {entry.totalDuels > 0 && (
                          <span className="text-[10px] text-indigo-400/80 font-normal ml-1">
                            ({entry.totalDuels} maç)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Streak & Streak record column */}
                    <div>
                      <div className="text-[9px] uppercase font-black text-orange-400">Seri Zafer</div>
                      <div className="text-xs sm:text-sm font-black text-orange-300">
                        {entry.duelStreak > 0 ? (
                          <span>🔥 {entry.duelStreak} Seri</span>
                        ) : entry.bestDuelStreak > 0 ? (
                          <span>⚡ {entry.bestDuelStreak} Rekor</span>
                        ) : entry.streak > 0 ? (
                          <span>⚡ {entry.streak} Soru</span>
                        ) : (
                          <span className="text-slate-500">0 Seri</span>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className="text-[9px] uppercase font-black text-slate-400">Rozet</div>
                      <div className="text-xs font-bold text-slate-200">{entry.unlockedBadgesCount} adet</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Sıralamalar her test ve düello sonrası otomatik güncellenir.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-black text-xs transition-all cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
