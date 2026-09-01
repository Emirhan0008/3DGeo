import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, limit, query } from 'firebase/firestore';

export interface LeaderboardEntry {
  rank: number;
  rumuz: string;
  rumuzKey: string;
  avatarIcon: string;
  avatarBg: string;
  equippedTitle: string;
  score: number;
  streak: number;
  duelWins: number;
  totalDuels: number;
  unlockedBadgesCount: number;
  accuracyPct: number;
  isAnonymous?: boolean;
  updatedAt?: string;
  isCurrentUser?: boolean;
}

export async function fetchGlobalLeaderboard(sortBy: 'score' | 'duels' | 'streak' = 'score'): Promise<LeaderboardEntry[]> {
  try {
    const resultsMap = new Map<string, LeaderboardEntry>();

    // 1. Fetch from rumuzes collection
    try {
      const rumuzesRef = collection(db, 'rumuzes');
      const snap = await getDocs(query(rumuzesRef, limit(60)));
      snap.forEach((docSnap) => {
        const d = docSnap.data() as RumuzProfileData;
        if (!d.rumuz) return;
        const totalAnswers = d.totalQuestionsAnswered || 0;
        const correct = d.correctAnswersCount || 0;
        const accuracyPct = totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0;
        const duelWins = d.duelStats?.duelWins || 0;
        const totalDuels = d.duelStats?.totalDuelsPlayed || 0;
        const key = d.rumuzKey || docSnap.id;

        resultsMap.set(key, {
          rank: 0,
          rumuz: d.rumuz,
          rumuzKey: key,
          avatarIcon: d.avatarIcon || '🐣',
          avatarBg: d.avatarBg || 'indigo_midnight',
          equippedTitle: d.equippedTitle || '3D Coğrafyacı Çırağı',
          score: d.score || 0,
          streak: d.streak || 0,
          duelWins,
          totalDuels,
          unlockedBadgesCount: (d.unlockedBadges || []).length,
          accuracyPct,
          isAnonymous: !!d.isAnonymous,
          updatedAt: d.updatedAt
        });
      });
    } catch (e) {
      console.warn('Rumuzes query error:', e);
    }

    // 2. Retroactive scan: Fetch duel_rooms to detect all players who ever played duels
    try {
      const duelRoomsRef = collection(db, 'duel_rooms');
      const duelSnap = await getDocs(query(duelRoomsRef, limit(50)));
      duelSnap.forEach((dDoc) => {
        const data = dDoc.data();
        const p1 = data.player1;
        const p2 = data.player2;

        [p1, p2].forEach((p) => {
          if (!p || !p.rumuz) return;
          const pKey = p.rumuzKey || normalizeRumuzKey(p.rumuz);
          const isWinner = data.winnerId === p.id;
          
          if (!resultsMap.has(pKey)) {
            // New player discovered from past duel history!
            resultsMap.set(pKey, {
              rank: 0,
              rumuz: p.rumuz,
              rumuzKey: pKey,
              avatarIcon: p.isBot ? '🤖' : '⚔️',
              avatarBg: p.isBot ? 'emerald_forest' : 'gold_glory',
              equippedTitle: p.isBot ? 'Yapay Zeka Rakip' : '1v1 Gladyatör',
              score: p.score || 100,
              streak: isWinner ? 1 : 0,
              duelWins: isWinner ? 1 : 0,
              totalDuels: 1,
              unlockedBadgesCount: 1,
              accuracyPct: 75,
              isAnonymous: false,
              updatedAt: data.updatedAt || data.createdAt
            });
          } else {
            // Update existing entry if duel room has additional wins/games
            const existing = resultsMap.get(pKey)!;
            if (isWinner && existing.duelWins === 0) {
              existing.duelWins += 1;
            }
            if (existing.totalDuels === 0) {
              existing.totalDuels += 1;
            }
          }
        });
      });
    } catch (e) {
      console.warn('Duel rooms retro scan warning:', e);
    }

    // 3. Scan users collection in case of Firebase Auth registered users
    try {
      const usersRef = collection(db, 'users');
      const userSnap = await getDocs(query(usersRef, limit(30)));
      userSnap.forEach((uDoc) => {
        const uData = uDoc.data();
        const dName = uData.displayName || uData.email?.split('@')[0];
        if (!dName) return;
        const uKey = normalizeRumuzKey(dName);
        if (!resultsMap.has(uKey)) {
          const totalAnswers = uData.totalQuestionsAnswered || 0;
          const correct = uData.correctAnswersCount || 0;
          resultsMap.set(uKey, {
            rank: 0,
            rumuz: dName,
            rumuzKey: uKey,
            avatarIcon: '🎓',
            avatarBg: 'cyan_mythic',
            equippedTitle: 'KPSS Coğrafya Üstadı',
            score: uData.score || 0,
            streak: uData.streak || 0,
            duelWins: 0,
            totalDuels: 0,
            unlockedBadgesCount: (uData.unlockedBadges || []).length,
            accuracyPct: totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0,
            isAnonymous: !!uData.isAnonymous,
            updatedAt: uData.updatedAt
          });
        }
      });
    } catch (e) {
      console.warn('Users collection scan warning:', e);
    }

    const results = Array.from(resultsMap.values());

    // Sort results based on selected tab
    results.sort((a, b) => {
      if (sortBy === 'duels') {
        if (b.duelWins !== a.duelWins) return b.duelWins - a.duelWins;
        return b.score - a.score;
      }
      if (sortBy === 'streak') {
        if (b.streak !== a.streak) return b.streak - a.streak;
        return b.score - a.score;
      }
      if (b.score !== a.score) return b.score - a.score;
      return b.duelWins - a.duelWins;
    });

    // Assign 1-indexed ranks
    return results.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  } catch (err) {
    console.warn('Global leaderboard general error:', err);
    return [];
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
    return { success: true, profile: newProfile };
  } catch (error) {
    console.error('Customization update error:', error);
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { success: false, errorMsg: 'Profil güncellenirken hata oluştu.' };
  }
}

/**
 * Renames a rumuz by migrating data to a new unique key and deleting the old document.
 */
export async function changeRumuzNickname(
  oldRumuz: string,
  newRumuz: string,
  pin: string
): Promise<{ success: boolean; profile?: RumuzProfileData; errorMsg?: string }> {
  const oldKey = normalizeRumuzKey(oldRumuz);
  const newKey = normalizeRumuzKey(newRumuz);

  if (oldKey === newKey) {
    return { success: false, errorMsg: 'Yeni rumuz eskisinden farklı olmalıdır.' };
  }

  // 1. Verify old rumuz exists and PIN matches
  const checkOld = await verifyAndLoadRumuzProfile(oldRumuz, pin);
  if (!checkOld.success || !checkOld.profile) {
    return { success: false, errorMsg: checkOld.errorMsg || 'Mevcut profil doğrulanamadı.' };
  }

  // 2. Verify new rumuz does not already exist
  const checkNew = await checkRumuzExists(newRumuz);
  if (checkNew.exists) {
    return { success: false, errorMsg: `'${newRumuz}' rumuzu zaten başka bir kullanıcı tarafından alınmış.` };
  }

  // 3. Create new document
  const migratedData: RumuzProfileData = {
    ...checkOld.profile,
    rumuz: newRumuz.trim(),
    rumuzKey: newKey,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'rumuzes', newKey), migratedData);
    // 4. Delete old document
    await deleteDoc(doc(db, 'rumuzes', oldKey));
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

  try {
    await deleteDoc(doc(db, 'rumuzes', key));
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

  const activeRumuz = localStorage.getItem('kpss3d_active_rumuz') || 'KPSS Gezgini';
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
