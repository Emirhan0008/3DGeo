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
import { 
  PIN_GAME_QUESTIONS, 
  PinGameQuestion, 
  MULTIPLE_CHOICE_QUESTIONS, 
  MultipleChoiceQuestion, 
  getFilteredPinQuestions, 
  getFilteredQuizQuestions 
} from '@/lib/data/quizQuestions';

export interface DuelGuess {
  lat: number;
  lng: number;
  distanceKm: number;
  timeTakenSec: number;
  pointsEarned: number;
  submittedAt: number;
}

export interface DuelRoundHistory {
  roundIndex: number;
  questionId: string;
  targetTitle: string;
  targetCoords: [number, number];
  targetCategory?: string;
  // Pin Map fields
  player1Guess: DuelGuess | null;
  player2Guess: DuelGuess | null;
  player1Points: number;
  player2Points: number;
  player1DistanceKm: number;
  player2DistanceKm: number;
  // KPSS Test fields
  options?: string[];
  correctOptionIndex?: number;
  player1SelectedOption?: number | null;
  player2SelectedOption?: number | null;
  player1IsCorrect?: boolean;
  player2IsCorrect?: boolean;
}

export interface DuelPlayer {
  id: string;
  rumuz: string;
  rumuzKey: string;
  isHost: boolean;
  score: number;
  totalDistanceKm: number;
  currentGuess?: DuelGuess | null;
  currentOptionAnswer?: number | null;
  isReady: boolean;
  readyToAdvance?: boolean;
  pingMs?: number;
  isBot?: boolean;
}

export type DuelType = 'pin_map' | 'kpss_test';

export interface DuelSession {
  id: string;
  roomCode: string;
  roomPin?: string;
  mode: 'quick' | 'private';
  duelType: DuelType; // 'pin_map' | 'kpss_test'
  status: 'waiting' | 'starting' | 'in_progress' | 'round_reveal' | 'finished' | 'abandoned';
  questionCount: 10 | 20 | 30;
  categoryFilter: string;
  questionIds: string[];
  player1: DuelPlayer;
  player2?: DuelPlayer | null;
  currentRound: number;
  roundStartTime: number;
  roundTimeLimit: number; // 15s for map, 40s for test
  bothAnsweredAt?: number | null;
  winnerId?: string | 'draw' | null;
  roundHistory?: DuelRoundHistory[];
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
 * Calculates continuous, multi-tier distance-based score and speed bonus for map duels.
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
 * Calculates score for KPSS Multiple Choice Test Duel
 */
export function calculateTestDuelScore(isCorrect: boolean, timeTakenSec: number, timeLimit = 40): { pointsEarned: number; speedBonus: number } {
  if (!isCorrect) return { pointsEarned: 0, speedBonus: 0 };

  const basePoints = 1000;
  const remainingSec = Math.max(0, timeLimit - Math.min(timeLimit, timeTakenSec));
  // Speed bonus up to 500 points (12.5 pts per saved second out of 40s)
  const speedBonus = Math.round(remainingSec * 12.5);
  return {
    pointsEarned: basePoints + speedBonus,
    speedBonus
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
 * Builds question IDs list based on duel type, category filter and question count.
 */
export function prepareDuelQuestions(categoryFilter: string, questionCount: number, duelType: DuelType = 'pin_map'): string[] {
  if (duelType === 'kpss_test') {
    const pool = getFilteredQuizQuestions(categoryFilter);
    const selected = pool.slice(0, questionCount);
    return selected.map(q => q.id);
  }

  const pool = getFilteredPinQuestions(categoryFilter, true);
  const selected = pool.slice(0, questionCount);
  return selected.map(q => q.id);
}

/**
 * Retrieves pin question objects by list of IDs.
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
 * Retrieves quiz test question objects by list of IDs.
 */
export function getQuizQuestionsByIds(questionIds: string[]): MultipleChoiceQuestion[] {
  const map = new Map(MULTIPLE_CHOICE_QUESTIONS.map(q => [q.id, q]));
  const result: MultipleChoiceQuestion[] = [];
  for (const id of questionIds) {
    const q = map.get(id);
    if (q) result.push(q);
  }
  return result.length > 0 ? result : MULTIPLE_CHOICE_QUESTIONS.slice(0, 10);
}

/**
 * Creates a new Duel Room (either Quick Match or Private with Code & PIN)
 */
export async function createDuelRoom(
  player: { id: string; rumuz: string; rumuzKey: string },
  options: {
    mode: 'quick' | 'private';
    duelType?: DuelType;
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
    roomPin?: string;
  }
): Promise<DuelSession> {
  const duelType = options.duelType || 'pin_map';
  const duelId = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generateRoomCode();
  const questionIds = prepareDuelQuestions(options.categoryFilter, options.questionCount, duelType);

  const initialPlayer: DuelPlayer = {
    id: player.id,
    rumuz: player.rumuz,
    rumuzKey: player.rumuzKey,
    isHost: true,
    score: 0,
    totalDistanceKm: 0,
    currentGuess: null,
    currentOptionAnswer: null,
    isReady: true,
    pingMs: 0
  };

  const payload: DuelSession = {
    id: duelId,
    roomCode,
    roomPin: options.roomPin?.trim() || '',
    mode: options.mode,
    duelType,
    status: 'waiting',
    questionCount: options.questionCount,
    categoryFilter: options.categoryFilter,
    questionIds,
    player1: initialPlayer,
    player2: null,
    currentRound: 0,
    roundStartTime: 0,
    roundTimeLimit: duelType === 'kpss_test' ? 40 : 15,
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
    duelType?: DuelType;
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
  }
): Promise<{ duel: DuelSession; isNew: boolean }> {
  const duelType = options.duelType || 'pin_map';
  try {
    const q = query(
      collection(db, 'duels'),
      where('mode', '==', 'quick'),
      where('status', '==', 'waiting'),
      where('duelType', '==', duelType),
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
          currentOptionAnswer: null,
          isReady: true,
          pingMs: 0
        };

        const now = Date.now();
        // 10-second countdown before 1st question starts
        const updatedFields = {
          player2: joiningPlayer,
          status: 'starting',
          roundStartTime: now + 10000,
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
      duelType,
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
      currentOptionAnswer: null,
      isReady: true,
      pingMs: 0
    };

    const now = Date.now();
    // 10-second countdown before 1st question starts
    const updatedFields = {
      player2: joiningPlayer,
      status: 'starting',
      roundStartTime: now + 10000,
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
    duelType?: DuelType;
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
  }
): Promise<DuelSession> {
  const duelType = options.duelType || 'pin_map';
  const duelId = `duel_bot_${Date.now()}`;
  const roomCode = 'BOT-3D';
  const questionIds = prepareDuelQuestions(options.categoryFilter, options.questionCount, duelType);

  const initialPlayer: DuelPlayer = {
    id: player.id,
    rumuz: player.rumuz,
    rumuzKey: player.rumuzKey,
    isHost: true,
    score: 0,
    totalDistanceKm: 0,
    currentGuess: null,
    currentOptionAnswer: null,
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
    currentOptionAnswer: null,
    isReady: true,
    pingMs: 10,
    isBot: true
  };

  const now = Date.now();
  const payload: DuelSession = {
    id: duelId,
    roomCode,
    mode: 'quick',
    duelType,
    status: 'starting',
    questionCount: options.questionCount,
    categoryFilter: options.categoryFilter,
    questionIds,
    player1: initialPlayer,
    player2: botPlayer,
    currentRound: 0,
    roundStartTime: now + 10000, // 10s countdown
    roundTimeLimit: duelType === 'kpss_test' ? 40 : 15,
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
 * Submits a player's guess for current round (Map Duel) and checks if both answered
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
 * Submits a player's test answer for current round (KPSS Test Duel) and checks if both answered
 */
export async function submitPlayerTestAnswer(
  duel: DuelSession,
  playerId: string,
  selectedOptionIndex: number,
  correctOptionIndex: number,
  timeTakenSec: number
): Promise<void> {
  const isPlayer1 = duel.player1.id === playerId;
  const isPlayer2 = duel.player2?.id === playerId;

  if (!isPlayer1 && !isPlayer2) return;

  const isCorrect = selectedOptionIndex === correctOptionIndex;
  const scoreResult = calculateTestDuelScore(isCorrect, timeTakenSec, duel.roundTimeLimit || 40);

  const playerKey = isPlayer1 ? 'player1' : 'player2';
  const currentPlayer = isPlayer1 ? duel.player1 : duel.player2!;
  const newScore = currentPlayer.score + scoreResult.pointsEarned;

  const otherPlayer = isPlayer1 ? duel.player2 : duel.player1;
  const otherHasAnswered = otherPlayer?.currentOptionAnswer !== null && otherPlayer?.currentOptionAnswer !== undefined;

  const updates: Record<string, unknown> = {
    [`${playerKey}.currentOptionAnswer`]: selectedOptionIndex,
    [`${playerKey}.score`]: newScore,
    updatedAt: new Date().toISOString()
  };

  // If both players have answered, switch to round_reveal immediately!
  if (otherHasAnswered) {
    updates['status'] = 'round_reveal';
    updates['bothAnsweredAt'] = Date.now();
  }

  try {
    await updateDoc(doc(db, 'duels', duel.id), updates);
  } catch (error) {
    console.error('Submit test answer error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Handles round timeout if a player hasn't responded within round limit
 */
export async function handleRoundTimeout(duel: DuelSession): Promise<void> {
  const isTest = duel.duelType === 'kpss_test';
  const updates: Record<string, unknown> = {
    status: 'round_reveal',
    bothAnsweredAt: Date.now(),
    updatedAt: new Date().toISOString()
  };

  if (isTest) {
    if (duel.player1.currentOptionAnswer === null || duel.player1.currentOptionAnswer === undefined) {
      updates['player1.currentOptionAnswer'] = -1; // timed out
    }
    if (duel.player2 && (duel.player2.currentOptionAnswer === null || duel.player2.currentOptionAnswer === undefined)) {
      updates['player2.currentOptionAnswer'] = -1;
    }
  } else {
    // Map Guess timeout
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
  }

  try {
    await updateDoc(doc(db, 'duels', duel.id), updates);
  } catch (error) {
    console.error('Handle timeout error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Builds history snapshot for the concluded round
 */
function recordCurrentRoundHistory(duel: DuelSession): DuelRoundHistory[] {
  const currentQId = duel.questionIds[duel.currentRound];
  const isTest = duel.duelType === 'kpss_test';

  if (isTest) {
    const questionObj = MULTIPLE_CHOICE_QUESTIONS.find((q) => q.id === currentQId);
    const correctIdx = questionObj?.correctIndex ?? 0;
    const p1Opt = duel.player1.currentOptionAnswer ?? -1;
    const p2Opt = duel.player2?.currentOptionAnswer ?? -1;
    const p1Correct = p1Opt === correctIdx;
    const p2Correct = p2Opt === correctIdx;

    const historyEntry: DuelRoundHistory = {
      roundIndex: duel.currentRound,
      questionId: currentQId || `q_${duel.currentRound}`,
      targetTitle: questionObj?.questionText || `Soru #${duel.currentRound + 1}`,
      targetCoords: questionObj?.targetCoords || [35.0, 39.0],
      targetCategory: questionObj?.category || duel.categoryFilter,
      player1Guess: null,
      player2Guess: null,
      player1Points: p1Correct ? 1000 : 0,
      player2Points: p2Correct ? 1000 : 0,
      player1DistanceKm: 0,
      player2DistanceKm: 0,
      options: questionObj?.options,
      correctOptionIndex: correctIdx,
      player1SelectedOption: p1Opt,
      player2SelectedOption: p2Opt,
      player1IsCorrect: p1Correct,
      player2IsCorrect: p2Correct
    };

    const existingHistory = duel.roundHistory || [];
    const filtered = existingHistory.filter(h => h.roundIndex !== duel.currentRound);
    return [...filtered, historyEntry];
  }

  const questionObj = PIN_GAME_QUESTIONS.find((q) => q.id === currentQId);
  const historyEntry: DuelRoundHistory = {
    roundIndex: duel.currentRound,
    questionId: currentQId || `q_${duel.currentRound}`,
    targetTitle: questionObj?.title || `Soru #${duel.currentRound + 1}`,
    targetCoords: questionObj?.targetCoords || [35.0, 39.0],
    targetCategory: questionObj?.category || duel.categoryFilter,
    player1Guess: duel.player1.currentGuess || null,
    player2Guess: duel.player2?.currentGuess || null,
    player1Points: duel.player1.currentGuess?.pointsEarned || 0,
    player2Points: duel.player2?.currentGuess?.pointsEarned || 0,
    player1DistanceKm: duel.player1.currentGuess ? Math.round(duel.player1.currentGuess.distanceKm * 10) / 10 : 850,
    player2DistanceKm: duel.player2?.currentGuess ? Math.round(duel.player2.currentGuess.distanceKm * 10) / 10 : 850
  };

  const existingHistory = duel.roundHistory || [];
  const filtered = existingHistory.filter(h => h.roundIndex !== duel.currentRound);
  return [...filtered, historyEntry];
}

/**
 * Advances to the next round or finishes the duel
 */
export async function advanceDuelRound(duel: DuelSession): Promise<void> {
  const nextRound = duel.currentRound + 1;
  const isFinished = nextRound >= duel.questionCount;
  const updatedHistory = recordCurrentRoundHistory(duel);

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
        roundHistory: updatedHistory,
        'player1.readyToAdvance': false,
        'player2.readyToAdvance': false,
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
      roundHistory: updatedHistory,
      'player1.currentGuess': null,
      'player2.currentGuess': null,
      'player1.currentOptionAnswer': null,
      'player2.currentOptionAnswer': null,
      'player1.readyToAdvance': false,
      'player2.readyToAdvance': false,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Advance round error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Handles a player clicking "İlerle" (Vote to advance) during round_reveal.
 */
export async function voteToAdvanceDuelRound(duel: DuelSession, playerId: string): Promise<void> {
  if (duel.status !== 'round_reveal') return;

  const isPlayer1 = duel.player1.id === playerId;
  const isPlayer2 = duel.player2?.id === playerId;
  if (!isPlayer1 && !isPlayer2) return;

  const playerKey = isPlayer1 ? 'player1' : 'player2';
  const otherPlayer = isPlayer1 ? duel.player2 : duel.player1;
  const isBotMatch = !!otherPlayer?.isBot;
  const otherIsReady = isBotMatch || !!otherPlayer?.readyToAdvance;

  if (otherIsReady) {
    await advanceDuelRound(duel);
    return;
  }

  try {
    await updateDoc(doc(db, 'duels', duel.id), {
      [`${playerKey}.readyToAdvance`]: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Vote to advance error:', error);
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
