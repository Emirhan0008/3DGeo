import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';

export interface DuelSessionData {
  id?: string;
  status?: string;
  winnerId?: string | 'draw' | null;
  questionCount?: number;
  maxPlayers?: 2 | 3 | 4;
  players?: Array<{
    id: string;
    rumuz: string;
    rumuzKey?: string;
    score: number;
    isBot?: boolean;
    isHost?: boolean;
    totalDistanceKm?: number;
    isReady?: boolean;
    pingMs?: number;
  }>;
  player1: {
    id: string;
    rumuz: string;
    rumuzKey?: string;
    score: number;
    isBot?: boolean;
    isHost?: boolean;
    totalDistanceKm?: number;
    isReady?: boolean;
    pingMs?: number;
  };
  player2?: {
    id: string;
    rumuz: string;
    rumuzKey?: string;
    score: number;
    isBot?: boolean;
    isHost?: boolean;
    totalDistanceKm?: number;
    isReady?: boolean;
    pingMs?: number;
  } | null;
  player3?: {
    id: string;
    rumuz: string;
    rumuzKey?: string;
    score: number;
    isBot?: boolean;
    isHost?: boolean;
    totalDistanceKm?: number;
    isReady?: boolean;
    pingMs?: number;
  } | null;
  player4?: {
    id: string;
    rumuz: string;
    rumuzKey?: string;
    score: number;
    isBot?: boolean;
    isHost?: boolean;
    totalDistanceKm?: number;
    isReady?: boolean;
    pingMs?: number;
  } | null;
  roundHistory?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaderboardEntry {
  rank: number; // 1-indexed for active ranked players, 0 for unranked/inactive
  rumuz: string;
  rumuzKey: string;
  avatarIcon: string;
  avatarBg: string;
  equippedTitle: string;
  score: number; // Total overall combined score
  rankingScore: number; // Weighted prestige ranking score (multipliers applied)
  duelPowerScore: number;
  kpssPowerScore: number;
  badgePowerScore: number;
  winRatePct: number;
  kpssScore: number; // KPSS test questions score
  streak: number; // KPSS questions streak
  correctAnswersCount: number;
  totalQuestionsAnswered: number;
  duelWins: number;
  duelLosses: number;
  duelDraws: number;
  totalDuels: number;
  duelStreak: number;
  bestDuelStreak: number;
  duelScore: number;
  unlockedBadgesCount: number;
  accuracyPct: number;
  isAnonymous?: boolean;
  isUnranked?: boolean; // true if 0 points and 0 activity
  statusText?: string;
  updatedAt?: string;
  isCurrentUser?: boolean;
}

export type LeaderboardSortTab = 'total' | 'score' | 'kpss_test' | 'duels' | 'streak';

/**
 * Calculates the multi-factored weighted ranking prestige score.
 * Multipliers heavily prioritize 1v1 and multiplayer live duel victories, win rate %, and win streaks.
 * Guarantees that players with high wins and high win rate (e.g. 7 wins / 9 matches, 7 streak)
 * rank decisively higher than players who simply spam matches with low win rate (e.g. 2 wins / 14 matches, 1 streak).
 */
export function calculateRankingPower(stats: {
  score: number;
  kpssScore: number;
  correctAnswersCount: number;
  duelWins: number;
  duelLosses: number;
  duelDraws: number;
  totalDuels: number;
  duelStreak: number;
  bestDuelStreak: number;
  duelScore: number;
  unlockedBadgesCount: number;
  accuracyPct: number;
}): {
  rankingScore: number;
  winRatePct: number;
  duelPowerScore: number;
  kpssPowerScore: number;
  badgePowerScore: number;
} {
  const totalD = stats.totalDuels > 0 ? stats.totalDuels : (stats.duelWins + stats.duelLosses + stats.duelDraws);
  const winRate = totalD > 0 ? (stats.duelWins / totalD) : 0;
  const winRatePct = Math.round(winRate * 100);

  // 1. DÜELLO ZAFERLERİ & KAZANMA ORANI & SERİ REKORLARI (BİRİNCİL VE EN BÜYÜK GÜÇ)
  // • Düello Galibiyeti: 8000 Puan (Her zafer için devasa güç)
  // • Kazanma Oranı Bonusu: 20000 * winRate (Minimum maç hacmi ile ölçekli)
  // • Kariyer En İyi Serisi Rekoru: 3000 Puan (Her rekor seri adımı için)
  // • Aktif Galibiyet Serisi: 1500 Puan (Mevcut form)
  // • Maç Katılım/Ham Puan: Logaritmik/bastırılmış katsayı (yenilgi biriktirerek puan şişirilmesini engeller)
  const duelWinsScore = stats.duelWins * 8000;
  
  // Win rate bonus is fully awarded as match volume reaches 3+ matches
  const matchVolumeWeight = Math.min(1, totalD / 3);
  const winRateBonus = Math.round(winRate * 20000 * matchVolumeWeight);

  const bestStreak = Math.max(stats.bestDuelStreak || 0, stats.duelStreak || 0);
  const bestStreakScore = bestStreak * 3000;
  const activeStreakScore = (stats.duelStreak || 0) * 1500;

  // Damped duel match score: max 3000 power from pure match score points so losing doesn't inflate power
  const duelMatchScore = Math.round(Math.min((stats.duelScore || 0) * 0.02, 3000));

  const duelPowerScore = duelWinsScore + winRateBonus + bestStreakScore + activeStreakScore + duelMatchScore;

  // 2. ÇEVRİMDIŞI & TEST SORU KAZANIMLARI (MÜTEVAZI KATSAYI)
  // • Doğru Soru Sayısı: Soru başına 10 puan
  // • Test Ham Puanı: Bastırılmış katsayı (maks 2000)
  // • Soru İsabet Oranı Bonusu: accuracyPct * 1 (maks 100)
  const kpssPowerScore = Math.round(
    (stats.correctAnswersCount * 10) +
    Math.min((stats.kpssScore || 0) * 0.02, 2000) +
    (stats.accuracyPct * 1)
  );

  // 3. ROZET VE KOLEKSİYON BAŞARIMLARI
  // • Rozet başına 50 puan
  const badgePowerScore = (stats.unlockedBadgesCount || 0) * 50;

  const rankingScore = duelPowerScore + kpssPowerScore + badgePowerScore;

  return {
    rankingScore,
    winRatePct,
    duelPowerScore,
    kpssPowerScore,
    badgePowerScore
  };
}

export async function fetchGlobalLeaderboard(sortBy: LeaderboardSortTab = 'total'): Promise<LeaderboardEntry[]> {
  try {
    const resultsMap = new Map<string, LeaderboardEntry>();

    // 1. Fetch from rumuzes collection (Primary persistent user profiles)
    try {
      const rumuzesRef = collection(db, 'rumuzes');
      const snap = await getDocs(query(rumuzesRef, limit(100)));
      snap.forEach((docSnap) => {
        const d = docSnap.data() as RumuzProfileData;
        if (!d.rumuz) return;
        const totalAnswers = d.totalQuestionsAnswered || 0;
        const correct = d.correctAnswersCount || 0;
        const accuracyPct = totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0;
        const duelWins = d.duelStats?.duelWins || 0;
        const duelLosses = d.duelStats?.duelLosses || 0;
        const duelDraws = d.duelStats?.duelDraws || 0;
        const totalDuels = d.duelStats?.totalDuelsPlayed || (duelWins + duelLosses + duelDraws);
        const duelStreak = d.duelStats?.duelStreak || 0;
        const bestDuelStreak = Math.max(d.duelStats?.bestDuelStreak || 0, duelStreak);
        const duelScore = d.duelStats?.duelScore || (duelWins * 120);
        const kpssScore = correct * 10;
        const rawScore = d.score || 0;

        // Ensure real players who have activity never show 0 points
        let calculatedScore = rawScore;
        if (calculatedScore === 0) {
          if (duelScore > 0 || kpssScore > 0) {
            calculatedScore = duelScore + kpssScore;
          }
        }

        const hasRealActivity = (
          calculatedScore > 0 ||
          duelWins > 0 ||
          totalDuels > 0 ||
          correct > 0 ||
          totalAnswers > 0 ||
          duelStreak > 0
        );

        const key = d.rumuzKey || normalizeRumuzKey(d.rumuz) || docSnap.id;

        const power = calculateRankingPower({
          score: calculatedScore,
          kpssScore,
          correctAnswersCount: correct,
          duelWins,
          duelLosses,
          duelDraws,
          totalDuels,
          duelStreak,
          bestDuelStreak,
          duelScore,
          unlockedBadgesCount: (d.unlockedBadges || []).length,
          accuracyPct
        });

        resultsMap.set(key, {
          rank: 0,
          rumuz: d.rumuz,
          rumuzKey: key,
          avatarIcon: d.avatarIcon || '🐣',
          avatarBg: d.avatarBg || 'indigo_midnight',
          equippedTitle: d.equippedTitle || '3D Coğrafyacı Çırağı',
          score: calculatedScore,
          rankingScore: power.rankingScore,
          duelPowerScore: power.duelPowerScore,
          kpssPowerScore: power.kpssPowerScore,
          badgePowerScore: power.badgePowerScore,
          winRatePct: power.winRatePct,
          kpssScore,
          streak: d.streak || 0,
          correctAnswersCount: correct,
          totalQuestionsAnswered: totalAnswers,
          duelWins,
          duelLosses,
          duelDraws,
          totalDuels,
          duelStreak,
          bestDuelStreak,
          duelScore,
          unlockedBadgesCount: (d.unlockedBadges || []).length,
          accuracyPct,
          isAnonymous: !!d.isAnonymous,
          isUnranked: !hasRealActivity,
          statusText: hasRealActivity ? 'Aktif Oyuncu' : 'Sıralama Dışı (Henüz Aktif Değil)',
          updatedAt: d.updatedAt
        });
      });
    } catch (e) {
      console.warn('Rumuzes query notice:', e);
    }

    // 2. Scan matches from 'duels' collection ONLY to enrich existing registered users (NEVER resurrect deleted users or create 100-pt ghost entries)
    try {
      const duelsRef = collection(db, 'duels');
      const duelSnap = await getDocs(query(duelsRef, limit(50)));
      duelSnap.forEach((dDoc) => {
        const data = dDoc.data() as DuelSessionData;
        if (!data) return;
        const p1 = data.player1;
        const p2 = data.player2;

        [p1, p2].forEach((p) => {
          if (!p || !p.rumuz || p.isBot) return;
          const pKey = p.rumuzKey || normalizeRumuzKey(p.rumuz);
          const isWinner = data.winnerId === p.id;
          
          // STRICT RULE: ONLY update if the user already exists in 'rumuzes' collection!
          if (resultsMap.has(pKey)) {
            const existing = resultsMap.get(pKey)!;
            if (data.status === 'finished') {
              if (isWinner && existing.duelWins === 0) {
                existing.duelWins += 1;
                existing.duelStreak = Math.max(existing.duelStreak, 1);
              }
              if (existing.totalDuels === 0) {
                existing.totalDuels += 1;
              }
            }
          }
        });
      });
    } catch (e) {
      console.warn('Duels collection scan notice:', e);
    }

    // 3. Ensure active local user is present & accurate with latest local values
    if (typeof window !== 'undefined') {
      try {
        const localRumuz = localStorage.getItem('kpss3d_active_rumuz');
        if (localRumuz && localRumuz.trim()) {
          const localKey = normalizeRumuzKey(localRumuz);
          const rawStats = localStorage.getItem('kpss3d_user_stats');
          const parsed = rawStats ? JSON.parse(rawStats) : {};
          const localWins = parsed.duelStats?.duelWins || 0;
          const localTotal = parsed.duelStats?.totalDuelsPlayed || 0;
          const localStreak = parsed.duelStats?.duelStreak || 0;
          const localBestStreak = parsed.duelStats?.bestDuelStreak || localStreak;
          const localCorrect = parsed.correctAnswersCount || 0;
          const localAnswers = parsed.totalQuestionsAnswered || 0;
          const localKpssScore = localCorrect * 10;
          const localDuelScore = parsed.duelStats?.duelScore || (localWins * 120);
          const localScore = parsed.score || (localDuelScore + localKpssScore) || (localWins > 0 ? localWins * 120 : 0);

          const hasLocalActivity = (
            localScore > 0 ||
            localWins > 0 ||
            localTotal > 0 ||
            localCorrect > 0 ||
            localAnswers > 0 ||
            localStreak > 0
          );

          if (resultsMap.has(localKey)) {
            // Merge freshest local stats into the entry
            const existing = resultsMap.get(localKey)!;
            existing.score = Math.max(existing.score, localScore);
            existing.kpssScore = Math.max(existing.kpssScore, localKpssScore);
            existing.correctAnswersCount = Math.max(existing.correctAnswersCount, localCorrect);
            existing.totalQuestionsAnswered = Math.max(existing.totalQuestionsAnswered, localAnswers);
            existing.duelWins = Math.max(existing.duelWins, localWins);
            existing.totalDuels = Math.max(existing.totalDuels, localTotal);
            existing.duelStreak = Math.max(existing.duelStreak, localStreak);
            existing.bestDuelStreak = Math.max(existing.bestDuelStreak, localBestStreak);
            existing.streak = Math.max(existing.streak, parsed.streak || 0);
            if (hasLocalActivity) {
              existing.isUnranked = false;
              existing.statusText = 'Aktif Oyuncu';
            }
          } else {
            const localAcc = localAnswers > 0 ? Math.round((localCorrect / localAnswers) * 100) : 0;
            const power = calculateRankingPower({
              score: localScore,
              kpssScore: localKpssScore,
              correctAnswersCount: localCorrect,
              duelWins: localWins,
              duelLosses: parsed.duelStats?.duelLosses || 0,
              duelDraws: parsed.duelStats?.duelDraws || 0,
              totalDuels: localTotal,
              duelStreak: localStreak,
              bestDuelStreak: localBestStreak,
              duelScore: localDuelScore,
              unlockedBadgesCount: (parsed.unlockedBadges || []).length,
              accuracyPct: localAcc
            });

            resultsMap.set(localKey, {
              rank: 0,
              rumuz: localRumuz,
              rumuzKey: localKey,
              avatarIcon: parsed.avatarIcon || '🐣',
              avatarBg: parsed.avatarBg || 'indigo_midnight',
              equippedTitle: parsed.equippedTitle || '3D Coğrafyacı Çırağı',
              score: localScore,
              rankingScore: power.rankingScore,
              duelPowerScore: power.duelPowerScore,
              kpssPowerScore: power.kpssPowerScore,
              badgePowerScore: power.badgePowerScore,
              winRatePct: power.winRatePct,
              kpssScore: localKpssScore,
              streak: parsed.streak || 0,
              correctAnswersCount: localCorrect,
              totalQuestionsAnswered: localAnswers,
              duelWins: localWins,
              duelLosses: parsed.duelStats?.duelLosses || 0,
              duelDraws: parsed.duelStats?.duelDraws || 0,
              totalDuels: localTotal,
              duelStreak: localStreak,
              bestDuelStreak: localBestStreak,
              duelScore: localDuelScore,
              unlockedBadgesCount: (parsed.unlockedBadges || []).length,
              accuracyPct: localAcc,
              isAnonymous: localStorage.getItem('kpss3d_is_anonymous') === 'true',
              isUnranked: !hasLocalActivity,
              statusText: hasLocalActivity ? 'Aktif Oyuncu' : 'Sıralama Dışı (Henüz Aktif Değil)',
              updatedAt: new Date().toISOString()
            });
          }
        }
      } catch {
        // ignore local storage read error
      }
    }

    // Ensure all entries have up-to-date ranking power recalculations
    const allEntries = Array.from(resultsMap.values()).map(e => {
      const recalculated = calculateRankingPower({
        score: e.score,
        kpssScore: e.kpssScore,
        correctAnswersCount: e.correctAnswersCount,
        duelWins: e.duelWins,
        duelLosses: e.duelLosses,
        duelDraws: e.duelDraws,
        totalDuels: e.totalDuels,
        duelStreak: e.duelStreak,
        bestDuelStreak: e.bestDuelStreak,
        duelScore: e.duelScore,
        unlockedBadgesCount: e.unlockedBadgesCount,
        accuracyPct: e.accuracyPct
      });
      return {
        ...e,
        rankingScore: recalculated.rankingScore,
        duelPowerScore: recalculated.duelPowerScore,
        kpssPowerScore: recalculated.kpssPowerScore,
        badgePowerScore: recalculated.badgePowerScore,
        winRatePct: recalculated.winRatePct
      };
    });

    // Separate into active ranked players and unranked/inactive players
    const rankedPlayers = allEntries.filter(e => !e.isUnranked);
    const unrankedPlayers = allEntries.filter(e => !!e.isUnranked);

    // Sort active players based on selected tab with strict weighted priorities
    rankedPlayers.sort((a, b) => {
      if (sortBy === 'duels') {
        // Duel Tab: Wins first, then duel streak, then best duel streak, then win rate %, then duel score
        if (b.duelWins !== a.duelWins) return b.duelWins - a.duelWins;
        if (b.duelStreak !== a.duelStreak) return b.duelStreak - a.duelStreak;
        if (b.bestDuelStreak !== a.bestDuelStreak) return b.bestDuelStreak - a.bestDuelStreak;
        if (b.winRatePct !== a.winRatePct) return b.winRatePct - a.winRatePct;
        if (b.duelScore !== a.duelScore) return b.duelScore - a.duelScore;
        return b.rankingScore - a.rankingScore;
      }
      if (sortBy === 'kpss_test') {
        // KPSS Test Tab: Correct questions count, then kpss score, then streak, then accuracy %
        if (b.correctAnswersCount !== a.correctAnswersCount) return b.correctAnswersCount - a.correctAnswersCount;
        if (b.kpssScore !== a.kpssScore) return b.kpssScore - a.kpssScore;
        if (b.streak !== a.streak) return b.streak - a.streak;
        if (b.accuracyPct !== a.accuracyPct) return b.accuracyPct - a.accuracyPct;
        return b.score - a.score;
      }
      if (sortBy === 'streak') {
        // Streak Tab: Highest active or best streak, then duel wins, then ranking score
        const bMaxStreak = Math.max(b.duelStreak, b.streak, b.bestDuelStreak);
        const aMaxStreak = Math.max(a.duelStreak, a.streak, a.bestDuelStreak);
        if (bMaxStreak !== aMaxStreak) return bMaxStreak - aMaxStreak;
        if (b.duelWins !== a.duelWins) return b.duelWins - a.duelWins;
        if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
        return b.score - a.score;
      }
      // Default: 'total' or 'score' - Uses weighted rankingScore (Duel Wins & Streak Carry Massive Weight)
      if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
      if (b.duelWins !== a.duelWins) return b.duelWins - a.duelWins;
      if (b.duelStreak !== a.duelStreak) return b.duelStreak - a.duelStreak;
      return b.score - a.score;
    });

    // Assign 1-indexed ranks to active ranked players
    const rankedWithIndex = rankedPlayers.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      isUnranked: false
    }));

    // Assign rank 0 and unranked flag to inactive players
    const unrankedWithFlag = unrankedPlayers.map((entry) => ({
      ...entry,
      rank: 0,
      isUnranked: true,
      statusText: 'Sıralama Dışı (Henüz Aktif Değil)'
    }));

    return [...rankedWithIndex, ...unrankedWithFlag];
  } catch (err) {
    console.warn('Global leaderboard general error:', err);
    return [];
  }
}

/**
 * Directly writes finished duel match results into rumuzes in Firestore for both players.
 */
export async function recordFinishedDuelToRumuzes(duel: DuelSessionData): Promise<void> {
  try {
    const rawList = Array.isArray(duel.players) && duel.players.length > 0
      ? duel.players
      : [duel.player1, duel.player2, duel.player3, duel.player4];
    const playersToUpdate = rawList.filter(p => p && !p.isBot && p.rumuz);

    for (const player of playersToUpdate) {
      if (!player) continue;
      const key = player.rumuzKey || normalizeRumuzKey(player.rumuz);
      const isWinner = duel.winnerId === player.id;
      const isDraw = duel.winnerId === 'draw';

      try {
        const ref = doc(db, 'rumuzes', key);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const currentData = snap.data() as RumuzProfileData;
          const currentWins = currentData.duelStats?.duelWins || 0;
          const currentLosses = currentData.duelStats?.duelLosses || 0;
          const currentDraws = currentData.duelStats?.duelDraws || 0;
          const currentTotal = currentData.duelStats?.totalDuelsPlayed || 0;
          const currentScore = currentData.score || 0;

          await setDoc(ref, {
            score: Math.max(currentScore, currentScore + (player.score || 0)),
            duelStats: {
              duelWins: currentWins + (isWinner ? 1 : 0),
              duelLosses: currentLosses + (!isWinner && !isDraw ? 1 : 0),
              duelDraws: currentDraws + (isDraw ? 1 : 0),
              totalDuelsPlayed: currentTotal + 1,
              duelScore: (currentData.duelStats?.duelScore || 0) + (player.score || 0),
              duelStreak: isWinner ? (currentData.duelStats?.duelStreak || 0) + 1 : 0,
              bestDuelStreak: Math.max(currentData.duelStats?.bestDuelStreak || 0, isWinner ? (currentData.duelStats?.duelStreak || 0) + 1 : 0)
            },
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        // If snap does NOT exist, profile has been deleted or not registered yet. Do NOT create phantom 100-pt ghost records.
      } catch (err) {
        console.warn(`Error updating rumuz ${key} for duel finish:`, err);
      }
    }
  } catch (err) {
    console.warn('recordFinishedDuelToRumuzes error:', err);
  }
}

export interface RumuzProfileData {
  rumuz: string;
  rumuzKey: string;
  pin: string;
  avatarIcon?: string;
  avatarBg?: string;
  equippedTitle?: string;
  unlockedTitles?: string[];
  score: number;
  streak: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  totalDistanceErrorKm: number;
  pinGuessCount: number;
  unlockedBadges: string[];
  categoryMasteryProgress?: Record<string, number>;
  duelStats?: {
    duelWins: number;
    duelLosses: number;
    duelDraws: number;
    totalDuelsPlayed: number;
    duelScore: number;
    duelStreak: number;
    bestDuelStreak: number;
  };
  botStats?: {
    botWins: number;
    botLosses: number;
    botDraws: number;
    totalBotDuelsPlayed: number;
    botScore: number;
    botStreak: number;
    bestBotStreak: number;
  };
  isBlindMapMode: boolean;
  isAnonymous?: boolean;
  regionalStats: Record<string, { correct: number; wrong: number }>;
  categoryStats: Record<string, { correct: number; wrong: number }>;
  missedItems: Record<string, { id: string; name: string; category: string; region: string; coords: [number, number]; wrongCount: number }>;
  updatedAt: string;
}

/**
 * Normalizes user nickname into a valid Firestore Document ID.
 * Replaces Turkish characters, replaces invalid chars with underscores.
 */
export function normalizeRumuzKey(rumuz: string): string {
  if (!rumuz) return '';
  const turkishMap: Record<string, string> = {
    'Ç': 'c', 'ç': 'c',
    'Ğ': 'g', 'ğ': 'g',
    'I': 'i', 'ı': 'i',
    'İ': 'i', 'i': 'i',
    'Ö': 'o', 'ö': 'o',
    'Ş': 's', 'ş': 's',
    'Ü': 'u', 'ü': 'u'
  };

  let cleaned = rumuz.trim();
  cleaned = cleaned.split('').map(char => turkishMap[char] || char).join('');
  cleaned = cleaned.toLowerCase();
  cleaned = cleaned.replace(/[^a-z0-9_\-]/g, '_');
  cleaned = cleaned.replace(/_+/g, '_');
  cleaned = cleaned.replace(/^_+|_+$/g, '');
  
  return cleaned || 'kpss_ogrencisi';
}

/**
 * Checks if a rumuz exists in Firestore.
 */
export async function checkRumuzExists(rumuz: string): Promise<{ exists: boolean; profile?: RumuzProfileData }> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  try {
    const snap = await getDoc(doc(db, 'rumuzes', key));
    if (snap.exists()) {
      return { exists: true, profile: snap.data() as RumuzProfileData };
    }
    return { exists: false };
  } catch (error) {
    console.warn('Rumuz check error:', error);
    handleFirestoreError(error, OperationType.GET, path);
    return { exists: false };
  }
}

/**
 * Registers or updates a unique rumuz profile in Firestore with PIN protection and rich gamification stats.
 */
export async function saveRumuzProfile(
  rumuz: string,
  pin: string,
  stats: Partial<RumuzProfileData>
): Promise<RumuzProfileData> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  
  const payload: RumuzProfileData = {
    rumuz: rumuz.trim(),
    rumuzKey: key,
    pin: pin.trim(),
    avatarIcon: stats.avatarIcon || '🐣',
    avatarBg: stats.avatarBg || 'indigo_midnight',
    equippedTitle: stats.equippedTitle || '3D Coğrafyacı Çırağı',
    unlockedTitles: stats.unlockedTitles || ['3D Coğrafyacı Çırağı'],
    score: stats.score || 0,
    streak: stats.streak || 0,
    totalQuestionsAnswered: stats.totalQuestionsAnswered || 0,
    correctAnswersCount: stats.correctAnswersCount || 0,
    totalDistanceErrorKm: stats.totalDistanceErrorKm || 0,
    pinGuessCount: stats.pinGuessCount || 0,
    unlockedBadges: stats.unlockedBadges || ['3D Coğrafyacı Çırağı'],
    categoryMasteryProgress: stats.categoryMasteryProgress || {},
    duelStats: stats.duelStats || {
      duelWins: 0,
      duelLosses: 0,
      duelDraws: 0,
      totalDuelsPlayed: 0,
      duelScore: 0,
      duelStreak: 0,
      bestDuelStreak: 0
    },
    botStats: stats.botStats || {
      botWins: 0,
      botLosses: 0,
      botDraws: 0,
      totalBotDuelsPlayed: 0,
      botScore: 0,
      botStreak: 0,
      bestBotStreak: 0
    },
    isBlindMapMode: !!stats.isBlindMapMode,
    regionalStats: stats.regionalStats || {},
    categoryStats: stats.categoryStats || {},
    missedItems: stats.missedItems || {},
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'rumuzes', key), payload, { merge: true });
    return payload;
  } catch (error) {
    console.error('Rumuz save error:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Loads cloud profile for rumuz if PIN matches.
 */
export async function verifyAndLoadRumuzProfile(
  rumuz: string,
  pin: string
): Promise<{ success: boolean; profile?: RumuzProfileData; errorMsg?: string }> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  try {
    const snap = await getDoc(doc(db, 'rumuzes', key));
    if (!snap.exists()) {
      return { success: false, errorMsg: `'${rumuz}' adında bir rumuz bulunamadı. Yeni rumuz oluşturabilirsiniz.` };
    }

    const data = snap.data() as RumuzProfileData;
    if (data.pin && data.pin !== pin.trim()) {
      return { success: false, errorMsg: 'Hatalı PIN / Şifre! Lütfen doğru rumuz şifresini girin.' };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Rumuz verification error:', error);
    handleFirestoreError(error, OperationType.GET, path);
    return { success: false, errorMsg: 'Veritabanı bağlantı hatası.' };
  }
}

/**
 * Updates profile avatar, title, or PIN in Firestore.
 */
export async function updateRumuzCustomization(
  rumuz: string,
  pin: string,
  updates: Partial<RumuzProfileData>
): Promise<{ success: boolean; profile?: RumuzProfileData; errorMsg?: string }> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  try {
    const snap = await getDoc(doc(db, 'rumuzes', key));
    if (!snap.exists()) {
      return { success: false, errorMsg: 'Profil bulunamadı.' };
    }
    const current = snap.data() as RumuzProfileData;
    if (current.pin && current.pin !== pin.trim()) {
      return { success: false, errorMsg: 'Güvenlik doğrulaması başarısız: Şifre uyuşmuyor.' };
    }

    const newProfile: RumuzProfileData = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'rumuzes', key), newProfile, { merge: true });

    if (typeof window !== 'undefined') {
      if (updates.pin) {
        localStorage.setItem('kpss3d_active_pin', updates.pin.trim());
      }
      if (updates.rumuz) {
        localStorage.setItem('kpss3d_active_rumuz', updates.rumuz.trim());
      }
    }

    return { success: true, profile: newProfile };
  } catch (error) {
    console.error('Customization update error:', error);
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, errorMsg: 'Profil güncellenirken hata oluştu.' };
  }
}

/**
 * Renames a rumuz by migrating data to a new unique key and deleting the old document cleanly.
 * Also updates local storage and past duel records so the user is never duplicated.
 */
export async function changeRumuzNickname(
  oldRumuz: string,
  newRumuz: string,
  pin: string,
  newPin?: string
): Promise<{ success: boolean; profile?: RumuzProfileData; errorMsg?: string }> {
  const oldKey = normalizeRumuzKey(oldRumuz);
  const newKey = normalizeRumuzKey(newRumuz);

  // 1. Verify old rumuz exists and PIN matches
  const checkOld = await verifyAndLoadRumuzProfile(oldRumuz, pin);
  if (!checkOld.success || !checkOld.profile) {
    return { success: false, errorMsg: checkOld.errorMsg || 'Mevcut profil doğrulanamadı.' };
  }

  const effectivePin = newPin && newPin.trim() ? newPin.trim() : checkOld.profile.pin;

  if (oldKey === newKey) {
    // Same normalized key (e.g. casing change or only password change)
    const updated = await updateRumuzCustomization(oldRumuz, pin, {
      rumuz: newRumuz.trim(),
      pin: effectivePin
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpss3d_active_rumuz', newRumuz.trim());
      localStorage.setItem('kpss3d_active_pin', effectivePin);
    }
    return updated;
  }

  // 2. Verify new rumuz does not already exist
  const checkNew = await checkRumuzExists(newRumuz);
  if (checkNew.exists) {
    return { success: false, errorMsg: `'${newRumuz}' rumuzu zaten başka bir kullanıcı tarafından alınmış.` };
  }

  // 3. Create new document with full migrated state
  const migratedData: RumuzProfileData = {
    ...checkOld.profile,
    rumuz: newRumuz.trim(),
    rumuzKey: newKey,
    pin: effectivePin,
    updatedAt: new Date().toISOString()
  };

  try {
    // Write new document
    await setDoc(doc(db, 'rumuzes', newKey), migratedData);
    
    // Delete old document in Firestore
    await deleteDoc(doc(db, 'rumuzes', oldKey));

    // Update localStorage immediately so subsequent cloud sync never revives the old rumuz
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpss3d_active_rumuz', newRumuz.trim());
      localStorage.setItem('kpss3d_active_pin', effectivePin);
      
      const oldStats = localStorage.getItem('kpss3d_stats_' + oldRumuz);
      if (oldStats) {
        localStorage.setItem('kpss3d_stats_' + newRumuz.trim(), oldStats);
        localStorage.removeItem('kpss3d_stats_' + oldRumuz);
      }
    }

    // Clean up duels in background where old rumuz was recorded
    try {
      const duelsRef = collection(db, 'duels');
      const duelSnap = await getDocs(query(duelsRef, limit(50)));
      duelSnap.forEach(async (dDoc) => {
        const dData = dDoc.data() as DuelSessionData;
        let needsUpdate = false;
        let p1 = dData.player1;
        let p2 = dData.player2;

        if (p1 && (p1.rumuz === oldRumuz || p1.rumuzKey === oldKey)) {
          p1 = { ...p1, rumuz: newRumuz.trim(), rumuzKey: newKey };
          needsUpdate = true;
        }
        if (p2 && (p2.rumuz === oldRumuz || p2.rumuzKey === oldKey)) {
          p2 = { ...p2, rumuz: newRumuz.trim(), rumuzKey: newKey };
          needsUpdate = true;
        }
        if (needsUpdate) {
          await setDoc(doc(db, 'duels', dDoc.id), { player1: p1, player2: p2 }, { merge: true });
        }
      });
    } catch {
      // background duel clean up notice ignored
    }

    return { success: true, profile: migratedData };
  } catch (error) {
    console.error('Rumuz rename error:', error);
    handleFirestoreError(error, OperationType.WRITE, `rumuzes/${newKey}`);
    return { success: false, errorMsg: 'Rumuz değiştirme işlemi sırasında hata oluştu.' };
  }
}

/**
 * Permanently deletes user rumuz profile from Firestore and removes from existence.
 */
export async function deleteRumuzProfile(
  rumuz: string,
  pin: string
): Promise<{ success: boolean; errorMsg?: string }> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;

  // 1. Verify PIN before deletion
  const verifyRes = await verifyAndLoadRumuzProfile(rumuz, pin);
  if (!verifyRes.success) {
    return { success: false, errorMsg: verifyRes.errorMsg || 'Silme onayı için doğru şifre girilmelidir.' };
  }

  // 2. Cancel any pending auto sync
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }

  try {
    // Delete profile doc
    await deleteDoc(doc(db, 'rumuzes', key));

    // Delete any active, waiting or finished duel rooms associated with this user
    try {
      const duelsRef = collection(db, 'duels');
      const s1 = await getDocs(query(duelsRef, where('player1.id', '==', key), limit(50)));
      s1.forEach(d => deleteDoc(doc(db, 'duels', d.id)).catch(() => {}));

      const s2 = await getDocs(query(duelsRef, where('player2.id', '==', key), limit(50)));
      s2.forEach(d => deleteDoc(doc(db, 'duels', d.id)).catch(() => {}));

      const s3 = await getDocs(query(duelsRef, where('player1.rumuz', '==', rumuz), limit(50)));
      s3.forEach(d => deleteDoc(doc(db, 'duels', d.id)).catch(() => {}));

      const s4 = await getDocs(query(duelsRef, where('player2.rumuz', '==', rumuz), limit(50)));
      s4.forEach(d => deleteDoc(doc(db, 'duels', d.id)).catch(() => {}));
    } catch {
      // duel purge notice ignored
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('kpss3d_active_rumuz');
      localStorage.removeItem('kpss3d_active_pin');
      localStorage.removeItem('kpss3d_user_stats');
      localStorage.removeItem('kpss3d_stats_' + rumuz);
      localStorage.removeItem('kpss3d_stats_' + key);
      localStorage.removeItem('kpss3d_is_anonymous');
    }

    return { success: true };
  } catch (error) {
    console.error('Rumuz delete error:', error);
    handleFirestoreError(error, OperationType.DELETE, path);
    return { success: false, errorMsg: 'Profil silinirken veritabanı hatası oluştu.' };
  }
}

/**
 * Toggles anonymous display mode (***) for user on global leaderboard.
 */
export async function setRumuzAnonymity(
  rumuz: string,
  isAnonymous: boolean
): Promise<{ success: boolean; errorMsg?: string }> {
  const key = normalizeRumuzKey(rumuz);

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpss3d_is_anonymous', isAnonymous ? 'true' : 'false');
    }
    await setDoc(doc(db, 'rumuzes', key), {
      isAnonymous,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Set anonymity error:', error);
    return { success: false, errorMsg: 'Gizlilik ayarı kaydedilemedi.' };
  }
}

let syncTimeout: NodeJS.Timeout | null = null;

/**
 * Automatically persists full user score, stats, titles, and unlocked badges to Cloud Firestore.
 * Ensures user state is never lost even across devices or browser reloads.
 */
export function autoSyncStoreToCloud(stateData: {
  score: number;
  streak: number;
  avatarIcon?: string;
  avatarBg?: string;
  equippedTitle?: string;
  unlockedTitles?: string[];
  totalQuestionsAnswered?: number;
  correctAnswersCount?: number;
  totalDistanceErrorKm?: number;
  pinGuessCount?: number;
  unlockedBadges?: string[];
  categoryMasteryProgress?: Record<string, number>;
  duelStats?: {
    duelWins: number;
    duelLosses: number;
    duelDraws: number;
    totalDuelsPlayed: number;
    duelScore: number;
    duelStreak: number;
    bestDuelStreak: number;
  };
  botStats?: {
    botWins: number;
    botLosses: number;
    botDraws: number;
    totalBotDuelsPlayed: number;
    botScore: number;
    botStreak: number;
    bestBotStreak: number;
  };
  isBlindMapMode?: boolean;
  regionalStats?: Record<string, { correct: number; wrong: number }>;
  categoryStats?: Record<string, { correct: number; wrong: number }>;
  missedItems?: Record<string, { id: string; name: string; category: string; region: string; coords: [number, number]; wrongCount: number }>;
}) {
  if (typeof window === 'undefined') return;

  const activeRumuz = localStorage.getItem('kpss3d_active_rumuz');
  // If account was deleted or not configured, DO NOT auto sync or resurrect!
  if (!activeRumuz || !activeRumuz.trim()) {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      syncTimeout = null;
    }
    return;
  }

  const activePin = localStorage.getItem('kpss3d_active_pin') || '1234';
  const isAnon = localStorage.getItem('kpss3d_is_anonymous') === 'true';
  const key = normalizeRumuzKey(activeRumuz);

  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {
    try {
      const payload: Partial<RumuzProfileData> = {
        rumuz: activeRumuz,
        rumuzKey: key,
        pin: activePin,
        isAnonymous: isAnon,
        score: stateData.score,
        streak: stateData.streak,
        avatarIcon: stateData.avatarIcon || '🐣',
        avatarBg: stateData.avatarBg || 'indigo_midnight',
        equippedTitle: stateData.equippedTitle || '3D Coğrafyacı Çırağı',
        unlockedTitles: stateData.unlockedTitles || ['3D Coğrafyacı Çırağı'],
        totalQuestionsAnswered: stateData.totalQuestionsAnswered || 0,
        correctAnswersCount: stateData.correctAnswersCount || 0,
        totalDistanceErrorKm: stateData.totalDistanceErrorKm || 0,
        pinGuessCount: stateData.pinGuessCount || 0,
        unlockedBadges: stateData.unlockedBadges || ['3D Coğrafyacı Çırağı'],
        categoryMasteryProgress: stateData.categoryMasteryProgress || {},
        duelStats: stateData.duelStats,
        botStats: stateData.botStats,
        isBlindMapMode: !!stateData.isBlindMapMode,
        regionalStats: stateData.regionalStats || {},
        categoryStats: stateData.categoryStats || {},
        missedItems: stateData.missedItems || {},
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'rumuzes', key), payload, { merge: true });
    } catch (e) {
      console.warn('Auto cloud sync background notice:', e);
    }
  }, 1000);
}
