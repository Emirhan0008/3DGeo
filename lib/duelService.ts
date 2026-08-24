import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  deleteDoc
} from 'firebase/firestore';
import { PIN_GAME_QUESTIONS, PinGameQuestion, getFilteredPinQuestions } from '@/lib/data/quizQuestions';

export interface DuelGuess {
  lat: number;
  lng: number;
  distanceKm: number;
  timeTakenSec: number;
  pointsEarned: number;
  submittedAt: number;
}

export interface DuelPlayer {
  id: string;
  rumuz: string;
  rumuzKey: string;
  isHost: boolean;
  score: number;
  totalDistanceKm: number;
  currentGuess?: DuelGuess | null;
  isReady: boolean;
  pingMs?: number;
  isBot?: boolean;
}

export interface DuelSession {
  id: string;
  roomCode: string;
  roomPin?: string;
  mode: 'quick' | 'private';
  status: 'waiting' | 'starting' | 'in_progress' | 'round_reveal' | 'finished' | 'abandoned';
  questionCount: 10 | 20 | 30;
  categoryFilter: string;
  questionIds: string[];
  player1: DuelPlayer;
  player2?: DuelPlayer | null;
  currentRound: number;
  roundStartTime: number;
  roundTimeLimit: number; // usually 15
  bothAnsweredAt?: number | null;
  winnerId?: string | 'draw' | null;
  createdAt: string;
  updatedAt: string;
}

export interface DistanceScoreBreakdown {
  distanceKm: number;
  distancePoints: number;
  timeBonusPoints: number;
  totalPoints: number;
  tierName: string;
  tierColor: string;
}

/**
 * Calculates continuous, multi-tier distance-based score and speed bonus.
 */
export function calculateDuelScore(distanceKm: number, timeTakenSec: number): DistanceScoreBreakdown {
  const roundedDist = Math.max(0, Math.round(distanceKm * 10) / 10);
  let distancePoints = 0;
  let tierName = '';
  let tierColor = '';

  if (roundedDist <= 5) {
    distancePoints = 1000;
    tierName = '🎯 KUSURSUZ İSABET (0-5 km)';
    tierColor = 'text-emerald-400';
  } else if (roundedDist <= 15) {
    distancePoints = Math.round(1000 - (roundedDist - 5) * 5);
    tierName = '⚡ MÜKEMMEL (5-15 km)';
    tierColor = 'text-teal-300';
  } else if (roundedDist <= 35) {
    distancePoints = Math.round(950 - (roundedDist - 15) * 5);
    tierName = '🔥 ÇOK İYİ (15-35 km)';
    tierColor = 'text-lime-300';
  } else if (roundedDist <= 75) {
    distancePoints = Math.round(850 - (roundedDist - 35) * 3.75);
    tierName = '✨ İYİ TAHMİN (35-75 km)';
    tierColor = 'text-amber-300';
  } else if (roundedDist <= 150) {
    distancePoints = Math.round(700 - (roundedDist - 75) * 2.66);
    tierName = '📍 ORTA YAKINLIK (75-150 km)';
    tierColor = 'text-amber-400';
  } else if (roundedDist <= 250) {
    distancePoints = Math.round(500 - (roundedDist - 150) * 2.0);
    tierName = '📌 KOMŞU BÖLGE (150-250 km)';
    tierColor = 'text-orange-400';
  } else if (roundedDist <= 450) {
    distancePoints = Math.round(300 - (roundedDist - 250) * 1.0);
    tierName = '🧭 UZAK TAHMİN (250-450 km)';
    tierColor = 'text-rose-400';
  } else if (roundedDist <= 750) {
    distancePoints = Math.max(1, Math.round(100 - (roundedDist - 450) * 0.33));
    tierName = '⚠️ ÇOK UZAK (450-750 km)';
    tierColor = 'text-rose-500';
  } else {
    distancePoints = 0;
    tierName = '❌ ISKA (>750 km)';
    tierColor = 'text-slate-400';
  }

  // Time Bonus: Up to 300 pts (20 pts per second saved from 15s limit)
  const remainingSec = Math.max(0, 15 - Math.min(15, timeTakenSec));
  let timeBonusPoints = Math.round(remainingSec * 20);

  // Anti-spam multiplier (prevents rapid blind clicking far away)
  if (roundedDist > 500) {
    timeBonusPoints = 0;
  } else if (roundedDist > 250) {
    timeBonusPoints = Math.round(timeBonusPoints * 0.5);
  }

  const totalPoints = distancePoints + timeBonusPoints;

  return {
    distanceKm: roundedDist,
    distancePoints,
    timeBonusPoints,
    totalPoints,
    tierName,
    tierColor
  };
}

/**
 * Generates a clean 6-character room code like TR-7492
 */
export function generateRoomCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `TR-${digits}`;
}

/**
 * Builds question IDs list based on category filter and question count.
 */
export function prepareDuelQuestions(categoryFilter: string, questionCount: number): string[] {
  const pool = getFilteredPinQuestions(categoryFilter, true);
  const selected = pool.slice(0, questionCount);
  return selected.map(q => q.id);
}

/**
 * Retrieves question objects by list of IDs.
 */
export function getQuestionsByIds(questionIds: string[]): PinGameQuestion[] {
  const map = new Map(PIN_GAME_QUESTIONS.map(q => [q.id, q]));
  const result: PinGameQuestion[] = [];
  for (const id of questionIds) {
    const q = map.get(id);
    if (q) result.push(q);
  }
  return result.length > 0 ? result : PIN_GAME_QUESTIONS.slice(0, 10);
}

/**
 * Creates a new Duel Room (either Quick Match or Private with Code & PIN)
 */
export async function createDuelRoom(
  player: { id: string; rumuz: string; rumuzKey: string },
  options: {
    mode: 'quick' | 'private';
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
    roomPin?: string;
  }
): Promise<DuelSession> {
  const duelId = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generateRoomCode();
  const questionIds = prepareDuelQuestions(options.categoryFilter, options.questionCount);

  const initialPlayer: DuelPlayer = {
    id: player.id,
    rumuz: player.rumuz,
    rumuzKey: player.rumuzKey,
    isHost: true,
    score: 0,
    totalDistanceKm: 0,
    currentGuess: null,
    isReady: true,
    pingMs: 0
  };

  const payload: DuelSession = {
    id: duelId,
    roomCode,
    roomPin: options.roomPin?.trim() || '',
    mode: options.mode,
    status: 'waiting',
    questionCount: options.questionCount,
    categoryFilter: options.categoryFilter,
    questionIds,
    player1: initialPlayer,
    player2: null,
    currentRound: 0,
    roundStartTime: 0,
    roundTimeLimit: 15,
    bothAnsweredAt: null,
    winnerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'duels', duelId), payload);
    return payload;
  } catch (error) {
    console.error('Create duel room error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duelId}`);
    throw error;
  }
}

/**
 * Searches for an open Quick Match lobby matching filters, or creates one.
 */
export async function findOrCreateQuickMatch(
  player: { id: string; rumuz: string; rumuzKey: string },
  options: {
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
  }
): Promise<{ duel: DuelSession; isNew: boolean }> {
  try {
    const q = query(
      collection(db, 'duels'),
      where('mode', '==', 'quick'),
      where('status', '==', 'waiting'),
      where('questionCount', '==', options.questionCount),
      where('categoryFilter', '==', options.categoryFilter),
      limit(5)
    );

    const snap = await getDocs(q);
    
    // Find an open room where player is not already player1
    for (const docSnap of snap.docs) {
      const duelData = docSnap.data() as DuelSession;
      if (duelData.player1.id !== player.id && !duelData.player2) {
        // Join this room
        const joiningPlayer: DuelPlayer = {
          id: player.id,
          rumuz: player.rumuz,
          rumuzKey: player.rumuzKey,
          isHost: false,
          score: 0,
          totalDistanceKm: 0,
          currentGuess: null,
          isReady: true,
          pingMs: 0
        };

        const now = Date.now();
        const updatedFields = {
          player2: joiningPlayer,
          status: 'starting',
          roundStartTime: now + 3500, // 3.5s countdown before 1st question starts
          updatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, 'duels', duelData.id), updatedFields);
        return {
          duel: { ...duelData, ...updatedFields } as DuelSession,
          isNew: false
        };
      }
    }

    // No available room found, create new quick match lobby
    const newDuel = await createDuelRoom(player, {
      mode: 'quick',
      questionCount: options.questionCount,
      categoryFilter: options.categoryFilter
    });
    return { duel: newDuel, isNew: true };
  } catch (error) {
    console.error('Quick match error:', error);
    handleFirestoreError(error, OperationType.LIST, 'duels');
    throw error;
  }
}

/**
 * Joins a private duel room with Room Code and optional Room PIN
 */
export async function joinPrivateDuelRoom(
  roomCode: string,
  player: { id: string; rumuz: string; rumuzKey: string },
  roomPin?: string
): Promise<{ success: boolean; duel?: DuelSession; errorMsg?: string }> {
  try {
    const formattedCode = roomCode.trim().toUpperCase();
    const q = query(
      collection(db, 'duels'),
      where('roomCode', '==', formattedCode),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      return { success: false, errorMsg: `'${formattedCode}' kodlu oda bulunamadı. Lütfen kodu kontrol edin.` };
    }

    const docSnap = snap.docs[0];
    const duelData = docSnap.data() as DuelSession;

    if (duelData.status !== 'waiting') {
      return { success: false, errorMsg: 'Bu oda şu anda müsait değil veya oyun zaten başladı.' };
    }

    if (duelData.roomPin && duelData.roomPin !== (roomPin?.trim() || '')) {
      return { success: false, errorMsg: 'Hatalı Oda Şifresi (PIN)! Lütfen doğru şifreyi girin.' };
    }

    if (duelData.player1.id === player.id) {
      return { success: true, duel: duelData };
    }

    const joiningPlayer: DuelPlayer = {
      id: player.id,
      rumuz: player.rumuz,
      rumuzKey: player.rumuzKey,
      isHost: false,
      score: 0,
      totalDistanceKm: 0,
      currentGuess: null,
      isReady: true,
      pingMs: 0
    };

    const now = Date.now();
    const updatedFields = {
      player2: joiningPlayer,
      status: 'starting',
      roundStartTime: now + 3500,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(doc(db, 'duels', duelData.id), updatedFields);
    return {
      success: true,
      duel: { ...duelData, ...updatedFields } as DuelSession
    };
  } catch (error) {
    console.error('Join duel room error:', error);
    handleFirestoreError(error, OperationType.GET, 'duels');
    return { success: false, errorMsg: 'Odaya bağlanırken veritabanı hatası oluştu.' };
  }
}

/**
 * Starts a practice match against the AI / Bot opponent instantly
 */
export async function startBotDuel(
  player: { id: string; rumuz: string; rumuzKey: string },
  options: {
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
  }
): Promise<DuelSession> {
  const duelId = `duel_bot_${Date.now()}`;
  const roomCode = 'BOT-3D';
  const questionIds = prepareDuelQuestions(options.categoryFilter, options.questionCount);

  const initialPlayer: DuelPlayer = {
    id: player.id,
    rumuz: player.rumuz,
    rumuzKey: player.rumuzKey,
    isHost: true,
    score: 0,
    totalDistanceKm: 0,
    currentGuess: null,
    isReady: true,
    pingMs: 15
  };

  const botPlayer: DuelPlayer = {
    id: 'kpss_ai_bot',
    rumuz: 'Coğrafya Yapay Zeka 🤖',
    rumuzKey: 'cografya_ai_bot',
    isHost: false,
    score: 0,
    totalDistanceKm: 0,
    currentGuess: null,
    isReady: true,
    pingMs: 10,
    isBot: true
  };

  const now = Date.now();
  const payload: DuelSession = {
    id: duelId,
    roomCode,
    mode: 'quick',
    status: 'starting',
    questionCount: options.questionCount,
    categoryFilter: options.categoryFilter,
    questionIds,
    player1: initialPlayer,
    player2: botPlayer,
    currentRound: 0,
    roundStartTime: now + 2500,
    roundTimeLimit: 15,
    bothAnsweredAt: null,
    winnerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'duels', duelId), payload);
    return payload;
  } catch (error) {
    console.error('Start bot duel error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duelId}`);
    throw error;
  }
}

/**
 * Submits a player's guess for current round and checks if both answered
 */
export async function submitPlayerGuess(
  duel: DuelSession,
  playerId: string,
  coords: [number, number], // [lng, lat]
  targetCoords: [number, number], // [lng, lat]
  timeTakenSec: number
): Promise<void> {
  const isPlayer1 = duel.player1.id === playerId;
  const isPlayer2 = duel.player2?.id === playerId;

  if (!isPlayer1 && !isPlayer2) return;

  const [tLng, tLat] = targetCoords;
  const [uLng, uLat] = coords;

  // Calculate Haversine distance in km
  const R = 6371; // Earth radius in km
  const dLat = (tLat - uLat) * (Math.PI / 180);
  const dLon = (tLng - uLng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(uLat * (Math.PI / 180)) * Math.cos(tLat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const scoreResult = calculateDuelScore(distanceKm, timeTakenSec);

  const guess: DuelGuess = {
    lat: uLat,
    lng: uLng,
    distanceKm: scoreResult.distanceKm,
    timeTakenSec: Math.round(timeTakenSec * 10) / 10,
    pointsEarned: scoreResult.totalPoints,
    submittedAt: Date.now()
  };

  const otherPlayer = isPlayer1 ? duel.player2 : duel.player1;
  const otherHasGuessed = !!otherPlayer?.currentGuess;

  const playerKey = isPlayer1 ? 'player1' : 'player2';
  const currentPlayer = isPlayer1 ? duel.player1 : duel.player2!;

  const newScore = currentPlayer.score + scoreResult.totalPoints;
  const newDistance = currentPlayer.totalDistanceKm + scoreResult.distanceKm;

  const updates: Record<string, unknown> = {
    [`${playerKey}.currentGuess`]: guess,
    [`${playerKey}.score`]: newScore,
    [`${playerKey}.totalDistanceKm`]: newDistance,
    updatedAt: new Date().toISOString()
  };

  // If both players have answered, switch to round_reveal immediately!
  if (otherHasGuessed) {
    updates['status'] = 'round_reveal';
    updates['bothAnsweredAt'] = Date.now();
  }

  try {
    await updateDoc(doc(db, 'duels', duel.id), updates);
  } catch (error) {
    console.error('Submit guess error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Handles round timeout if a player hasn't clicked within 15 seconds
 */
export async function handleRoundTimeout(duel: DuelSession, _targetCoords?: [number, number]): Promise<void> {
  const updates: Record<string, unknown> = {
    status: 'round_reveal',
    bothAnsweredAt: Date.now(),
    updatedAt: new Date().toISOString()
  };

  // If Player 1 didn't answer
  if (!duel.player1.currentGuess) {
    const missGuess: DuelGuess = {
      lat: 0,
      lng: 0,
      distanceKm: 850,
      timeTakenSec: 15,
      pointsEarned: 0,
      submittedAt: Date.now()
    };
    updates['player1.currentGuess'] = missGuess;
    updates['player1.totalDistanceKm'] = duel.player1.totalDistanceKm + 850;
  }

  // If Player 2 didn't answer
  if (duel.player2 && !duel.player2.currentGuess) {
    const missGuess: DuelGuess = {
      lat: 0,
      lng: 0,
      distanceKm: 850,
      timeTakenSec: 15,
      pointsEarned: 0,
      submittedAt: Date.now()
    };
    updates['player2.currentGuess'] = missGuess;
    updates['player2.totalDistanceKm'] = duel.player2.totalDistanceKm + 850;
  }

  try {
    await updateDoc(doc(db, 'duels', duel.id), updates);
  } catch (error) {
    console.error('Handle timeout error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Advances to the next round or finishes the duel
 */
export async function advanceDuelRound(duel: DuelSession): Promise<void> {
  const nextRound = duel.currentRound + 1;
  const isFinished = nextRound >= duel.questionCount;

  if (isFinished) {
    let winnerId: string | 'draw' = 'draw';
    if (duel.player1.score > (duel.player2?.score ?? 0)) {
      winnerId = duel.player1.id;
    } else if ((duel.player2?.score ?? 0) > duel.player1.score) {
      winnerId = duel.player2?.id || 'draw';
    }

    try {
      await updateDoc(doc(db, 'duels', duel.id), {
        status: 'finished',
        winnerId,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Finish duel error:', error);
      handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
    }
    return;
  }

  const now = Date.now();
  try {
    await updateDoc(doc(db, 'duels', duel.id), {
      currentRound: nextRound,
      status: 'in_progress',
      roundStartTime: now,
      bothAnsweredAt: null,
      'player1.currentGuess': null,
      'player2.currentGuess': null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Advance round error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Cancels or leaves the duel room
 */
export async function leaveOrCancelDuel(duelId: string): Promise<void> {
  try {
    const duelRef = doc(db, 'duels', duelId);
    const snap = await getDoc(duelRef);
    if (snap.exists()) {
      const data = snap.data() as DuelSession;
      if (data.status === 'waiting') {
        await deleteDoc(duelRef);
      } else {
        await updateDoc(duelRef, {
          status: 'abandoned',
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Leave duel error:', error);
  }
}

/**
 * Subscribes to real-time updates for a duel session
 */
export function subscribeToDuel(duelId: string, callback: (duel: DuelSession | null) => void): () => void {
  const duelRef = doc(db, 'duels', duelId);
  return onSnapshot(
    duelRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as DuelSession);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Duel subscription error:', error);
      handleFirestoreError(error, OperationType.GET, `duels/${duelId}`);
    }
  );
}
