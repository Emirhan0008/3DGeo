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
import { recordFinishedDuelToRumuzes } from '@/lib/rumuzService';
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

export interface DuelPlayerRoundResult {
  id: string;
  rumuz: string;
  avatarIcon?: string;
  avatarBg?: string;
  guess: DuelGuess | null;
  points: number;
  distanceKm: number;
  selectedOption?: number | null;
  isCorrect?: boolean;
}

export interface DuelRoundHistory {
  roundIndex: number;
  questionId: string;
  targetTitle: string;
  targetCoords: [number, number];
  targetCategory?: string;
  // Backward compatible 2-player fields
  player1Guess: DuelGuess | null;
  player2Guess: DuelGuess | null;
  player1Points: number;
  player2Points: number;
  player1DistanceKm: number;
  player2DistanceKm: number;
  // 3-4 Player fields
  player3Guess?: DuelGuess | null;
  player4Guess?: DuelGuess | null;
  player3Points?: number;
  player4Points?: number;
  player3DistanceKm?: number;
  player4DistanceKm?: number;
  // KPSS Test fields
  options?: string[];
  correctOptionIndex?: number;
  player1SelectedOption?: number | null;
  player2SelectedOption?: number | null;
  player3SelectedOption?: number | null;
  player4SelectedOption?: number | null;
  player1IsCorrect?: boolean;
  player2IsCorrect?: boolean;
  player3IsCorrect?: boolean;
  player4IsCorrect?: boolean;
  // All active players snapshot
  allPlayerResults?: DuelPlayerRoundResult[];
}

export interface PlayerProfileInput {
  id: string;
  rumuz: string;
  rumuzKey: string;
  avatarIcon?: string;
  avatarBg?: string;
  equippedTitle?: string;
  unlockedBadges?: string[];
  duelWins?: number;
  duelStreak?: number;
}

export interface DuelPlayer {
  id: string;
  rumuz: string;
  rumuzKey: string;
  avatarIcon?: string;
  avatarBg?: string;
  equippedTitle?: string;
  unlockedBadges?: string[];
  duelWins?: number;
  duelStreak?: number;
  isHost: boolean;
  playerSlot?: 'player1' | 'player2' | 'player3' | 'player4';
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
  maxPlayers?: 2 | 3 | 4;
  players?: DuelPlayer[];
  questionIds: string[];
  player1: DuelPlayer;
  player2?: DuelPlayer | null;
  player3?: DuelPlayer | null;
  player4?: DuelPlayer | null;
  currentRound: number;
  roundStartTime: number;
  roundTimeLimit: number; // 15s for map, 40s for test
  bothAnsweredAt?: number | null;
  winnerId?: string | 'draw' | null;
  roundHistory?: DuelRoundHistory[];
  lastHeartbeat?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Extracts all active players in a room in deterministic order (player1 -> player2 -> player3 -> player4).
 */
export function getAllSessionPlayers(session: DuelSession | null | undefined): DuelPlayer[] {
  if (!session) return [];
  if (Array.isArray(session.players) && session.players.length > 0) {
    return session.players.filter(Boolean);
  }
  const list: DuelPlayer[] = [];
  if (session.player1) list.push(session.player1);
  if (session.player2) list.push(session.player2);
  if (session.player3) list.push(session.player3);
  if (session.player4) list.push(session.player4);
  return list;
}

/**
 * Finds which player slot a given user ID occupies.
 */
export function getPlayerKeyById(session: DuelSession | null | undefined, playerId: string): 'player1' | 'player2' | 'player3' | 'player4' | null {
  if (!session || !playerId) return null;
  if (session.player1?.id === playerId) return 'player1';
  if (session.player2?.id === playerId) return 'player2';
  if (session.player3?.id === playerId) return 'player3';
  if (session.player4?.id === playerId) return 'player4';
  if (Array.isArray(session.players)) {
    const idx = session.players.findIndex(p => p?.id === playerId);
    if (idx === 0) return 'player1';
    if (idx === 1) return 'player2';
    if (idx === 2) return 'player3';
    if (idx === 3) return 'player4';
  }
  return null;
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
 * Fisher-Yates array shuffling helper for strictly randomized questions
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds question IDs list based on duel type, category filter and question count.
 * Ensures questions are strictly randomized on every match.
 */
export function prepareDuelQuestions(categoryFilter: string, questionCount: number, duelType: DuelType = 'pin_map'): string[] {
  if (duelType === 'kpss_test') {
    let pool = getFilteredQuizQuestions(categoryFilter, true);
    if (!pool || pool.length === 0) {
      pool = MULTIPLE_CHOICE_QUESTIONS;
    }
    const shuffled = shuffleArray([...pool]);
    const result: string[] = [];
    let idx = 0;
    while (result.length < questionCount) {
      result.push(shuffled[idx % shuffled.length].id);
      idx++;
    }
    return result;
  }

  let pool = getFilteredPinQuestions(categoryFilter, true);
  if (!pool || pool.length === 0) {
    pool = PIN_GAME_QUESTIONS;
  }
  const shuffled = shuffleArray([...pool]);
  const result: string[] = [];
  let idx = 0;
  while (result.length < questionCount) {
    result.push(shuffled[idx % shuffled.length].id);
    idx++;
  }
  return result;
}

/**
 * Retrieves pin question objects by list of IDs.
 */
export function getQuestionsByIds(questionIds: string[]): PinGameQuestion[] {
  const map = new Map(PIN_GAME_QUESTIONS.map(q => [q.id, q]));
  const result: PinGameQuestion[] = [];
  for (let i = 0; i < questionIds.length; i++) {
    const id = questionIds[i];
    const q = map.get(id);
    if (q) {
      result.push(q);
    } else {
      result.push(PIN_GAME_QUESTIONS[i % PIN_GAME_QUESTIONS.length]);
    }
  }
  return result.length > 0 ? result : PIN_GAME_QUESTIONS.slice(0, 10);
}

/**
 * Retrieves quiz test question objects by list of IDs.
 */
export function getQuizQuestionsByIds(questionIds: string[]): MultipleChoiceQuestion[] {
  const map = new Map(MULTIPLE_CHOICE_QUESTIONS.map(q => [q.id, q]));
  const result: MultipleChoiceQuestion[] = [];
  for (let i = 0; i < questionIds.length; i++) {
    const id = questionIds[i];
    const q = map.get(id);
    if (q) {
      result.push(q);
    } else {
      result.push(MULTIPLE_CHOICE_QUESTIONS[i % MULTIPLE_CHOICE_QUESTIONS.length]);
    }
  }
  return result.length > 0 ? result : MULTIPLE_CHOICE_QUESTIONS.slice(0, 10);
}

/**
 * Deep sanitization for Firestore payloads to prevent "Unsupported field value: undefined" crashes.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === undefined || obj === null) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Sanitizes and normalizes player profile input, ensuring no undefined fields.
 */
export function sanitizePlayer(player: PlayerProfileInput, isHost: boolean): DuelPlayer {
  const safeId = player.id || 'oyuncu_' + Math.random().toString(36).substring(2, 8);
  const safeRumuz = player.rumuz?.trim() || 'Oyuncu';
  return {
    id: safeId,
    rumuz: safeRumuz,
    rumuzKey: player.rumuzKey || safeId,
    avatarIcon: player.avatarIcon || '⚔️',
    avatarBg: player.avatarBg || 'gold_glory',
    equippedTitle: player.equippedTitle || '3D Coğrafyacı Çırağı',
    unlockedBadges: Array.isArray(player.unlockedBadges) && player.unlockedBadges.length > 0 
      ? player.unlockedBadges 
      : ['3D Coğrafyacı Çırağı'],
    duelWins: typeof player.duelWins === 'number' ? player.duelWins : 0,
    duelStreak: typeof player.duelStreak === 'number' ? player.duelStreak : 0,
    isHost,
    score: 0,
    totalDistanceKm: 0,
    currentGuess: null,
    currentOptionAnswer: null,
    isReady: true,
    pingMs: 0
  };
}

/**
 * Creates a new Duel Room (either Quick Match or Private with Code & PIN, 2-4 Players)
 */
export async function createDuelRoom(
  player: PlayerProfileInput,
  options: {
    mode: 'quick' | 'private';
    duelType?: DuelType;
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
    maxPlayers?: 2 | 3 | 4;
    roomPin?: string;
  }
): Promise<DuelSession> {
  const duelType = options.duelType || 'pin_map';
  const maxPlayers: 2 | 3 | 4 = options.maxPlayers || 2;
  const duelId = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generateRoomCode();
  const questionIds = prepareDuelQuestions(options.categoryFilter, options.questionCount, duelType);

  const initialPlayer: DuelPlayer = sanitizePlayer(player, true);
  initialPlayer.playerSlot = 'player1';

  const now = Date.now();
  const payload: DuelSession = {
    id: duelId,
    roomCode,
    roomPin: options.roomPin?.trim() || '',
    mode: options.mode,
    duelType,
    status: 'waiting',
    questionCount: options.questionCount,
    categoryFilter: options.categoryFilter || 'Genel',
    maxPlayers,
    players: [initialPlayer],
    questionIds,
    player1: initialPlayer,
    player2: null,
    player3: null,
    player4: null,
    currentRound: 0,
    roundStartTime: 0,
    roundTimeLimit: duelType === 'kpss_test' ? 40 : 15,
    bothAnsweredAt: null,
    winnerId: null,
    lastHeartbeat: now,
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString()
  };

  try {
    const cleaned = sanitizeForFirestore(payload);
    await setDoc(doc(db, 'duels', duelId), cleaned);
    return payload;
  } catch (error) {
    console.error('Create duel room error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duelId}`);
    throw error;
  }
}

/**
 * Sends a heartbeat to keep a waiting room alive
 */
export async function sendDuelHeartbeat(duelId: string): Promise<void> {
  try {
    const duelRef = doc(db, 'duels', duelId);
    await updateDoc(duelRef, {
      lastHeartbeat: Date.now(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    // Non-fatal error during heartbeat
    console.warn('Heartbeat error:', error);
  }
}

/**
 * Force starts a waiting duel room (e.g. host starts with 2 or 3 players without waiting for 4th)
 */
export async function forceStartDuel(duelId: string): Promise<void> {
  try {
    const duelRef = doc(db, 'duels', duelId);
    const snap = await getDoc(duelRef);
    if (!snap.exists()) return;
    const data = snap.data() as DuelSession;
    const currentPlayers = getAllSessionPlayers(data);
    if (currentPlayers.length < 2) return;

    const now = Date.now();
    await updateDoc(duelRef, {
      status: 'starting',
      roundStartTime: now + 5000,
      lastHeartbeat: now,
      updatedAt: new Date(now).toISOString()
    });
  } catch (error) {
    console.error('Force start duel error:', error);
  }
}

/**
 * Searches for an open Quick Match lobby matching filters, or creates one.
 * Uses index-free simple queries with in-memory filtering to prevent composite index errors.
 * Actively purges stale/dead rooms (> 35 seconds inactive) to prevent phantom matchups.
 */
export async function findOrCreateQuickMatch(
  player: PlayerProfileInput,
  options: {
    duelType?: DuelType;
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
    maxPlayers?: 2 | 3 | 4;
  }
): Promise<{ duel: DuelSession; isNew: boolean }> {
  const duelType = options.duelType || 'pin_map';
  const targetMaxPlayers: 2 | 3 | 4 = options.maxPlayers || 2;
  try {
    // Simple 2-field query on status & mode that NEVER requires composite indexes in Firestore
    const q = query(
      collection(db, 'duels'),
      where('mode', '==', 'quick'),
      where('status', '==', 'waiting'),
      limit(25)
    );

    const snap = await getDocs(q);
    const now = Date.now();
    let exactMatchRoom: DuelSession | null = null;
    let compatibleMatchRoom: DuelSession | null = null;

    for (const docSnap of snap.docs) {
      const duelData = docSnap.data() as DuelSession;
      if (!duelData || !duelData.id) continue;

      const existingPlayers = getAllSessionPlayers(duelData);
      const roomCapacity = duelData.maxPlayers || 2;

      // 1. If player previously created this room and was left waiting alone, purge it
      if (duelData.player1?.id === player.id && existingPlayers.length === 1) {
        deleteDoc(doc(db, 'duels', duelData.id)).catch(() => {});
        continue;
      }

      // 2. Check heartbeat age
      const lastActiveTime = duelData.lastHeartbeat || 
        (duelData.updatedAt ? new Date(duelData.updatedAt).getTime() : 0) || 
        (duelData.createdAt ? new Date(duelData.createdAt).getTime() : 0);
      const ageSec = (now - lastActiveTime) / 1000;

      // If room is older than 35 seconds without heartbeat, host is disconnected/left! Purge stale room.
      if (ageSec > 35) {
        deleteDoc(doc(db, 'duels', duelData.id)).catch(() => {});
        continue;
      }

      // 3. Match checking - room must have open space
      if (existingPlayers.length < roomCapacity && !existingPlayers.some(p => p.id === player.id)) {
        // Exact match
        if (
          duelData.duelType === duelType &&
          duelData.questionCount === options.questionCount &&
          duelData.categoryFilter === options.categoryFilter &&
          (duelData.maxPlayers || 2) === targetMaxPlayers
        ) {
          exactMatchRoom = duelData;
          break;
        }

        // Compatible match: same duelType & same question count
        if (
          !compatibleMatchRoom &&
          duelData.duelType === duelType &&
          duelData.questionCount === options.questionCount
        ) {
          compatibleMatchRoom = duelData;
        }
      }
    }

    const roomToJoin = exactMatchRoom || compatibleMatchRoom;

    if (roomToJoin) {
      // Valid active room found! Join this room
      const currentPlayers = getAllSessionPlayers(roomToJoin);
      const slotIndex = currentPlayers.length; // 1 -> player2, 2 -> player3, 3 -> player4
      const slotKey = slotIndex === 1 ? 'player2' : slotIndex === 2 ? 'player3' : 'player4';
      
      const joiningPlayer = sanitizePlayer(player, false);
      joiningPlayer.playerSlot = slotKey;

      const updatedPlayers = [...currentPlayers, joiningPlayer];
      const roomMax = roomToJoin.maxPlayers || 2;
      const isRoomFull = updatedPlayers.length >= roomMax;

      const updatedFields: Record<string, unknown> = {
        [slotKey]: joiningPlayer,
        players: updatedPlayers,
        lastHeartbeat: now,
        updatedAt: new Date(now).toISOString()
      };

      if (isRoomFull) {
        // 10-second countdown before 1st question starts
        updatedFields.status = 'starting';
        updatedFields.roundStartTime = now + 10000;
      }

      const cleanedUpdates = sanitizeForFirestore(updatedFields);
      await updateDoc(doc(db, 'duels', roomToJoin.id), cleanedUpdates);

      return {
        duel: { ...roomToJoin, ...updatedFields } as DuelSession,
        isNew: false
      };
    }

    // No active room found, create new quick match lobby
    const newDuel = await createDuelRoom(player, {
      mode: 'quick',
      duelType,
      questionCount: options.questionCount,
      categoryFilter: options.categoryFilter,
      maxPlayers: targetMaxPlayers
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
  player: PlayerProfileInput,
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
      return { success: false, errorMsg: 'Bu oda şu anda müsait değil veya oyun zaten başladı / kapandı.' };
    }

    // Check if private room is older than 15 minutes
    const now = Date.now();
    const createdTime = duelData.createdAt ? new Date(duelData.createdAt).getTime() : now;
    if ((now - createdTime) > 15 * 60 * 1000) {
      deleteDoc(doc(db, 'duels', duelData.id)).catch(() => {});
      return { success: false, errorMsg: 'Bu özel odanın süresi dolmuş. Lütfen arkadaşınızdan yeni bir oda kurmasını isteyin.' };
    }

    if (duelData.roomPin && duelData.roomPin !== (roomPin?.trim() || '')) {
      return { success: false, errorMsg: 'Hatalı Oda Şifresi (PIN)! Lütfen doğru şifreyi girin.' };
    }

    const currentPlayers = getAllSessionPlayers(duelData);
    if (currentPlayers.some(p => p.id === player.id)) {
      return { success: true, duel: duelData };
    }

    const roomCapacity = duelData.maxPlayers || 2;
    if (currentPlayers.length >= roomCapacity) {
      return { success: false, errorMsg: 'Bu oda tamamen doldu (Maksimum oyuncu sayısına ulaşıldı).' };
    }

    const slotIndex = currentPlayers.length; // 1 -> player2, 2 -> player3, 3 -> player4
    const slotKey = slotIndex === 1 ? 'player2' : slotIndex === 2 ? 'player3' : 'player4';

    const joiningPlayer: DuelPlayer = sanitizePlayer(player, false);
    joiningPlayer.playerSlot = slotKey;

    const updatedPlayers = [...currentPlayers, joiningPlayer];
    const isRoomFull = updatedPlayers.length >= roomCapacity;

    const updatedFields: Record<string, unknown> = {
      [slotKey]: joiningPlayer,
      players: updatedPlayers,
      lastHeartbeat: now,
      updatedAt: new Date(now).toISOString()
    };

    if (isRoomFull) {
      // 10-second countdown before 1st question starts
      updatedFields.status = 'starting';
      updatedFields.roundStartTime = now + 10000;
    }

    const cleanedUpdates = sanitizeForFirestore(updatedFields);
    await updateDoc(doc(db, 'duels', duelData.id), cleanedUpdates);
    return {
      success: true,
      duel: { ...duelData, ...updatedFields } as DuelSession
    };
  } catch (error) {
    console.error('Join duel room error:', error);
    handleFirestoreError(error, OperationType.GET, 'duels');
    return { success: false, errorMsg: 'Odaya bağlanırken bağlantı hatası oluştu.' };
  }
}

export interface WaitingRoomSuggestion {
  id: string;
  roomCode: string;
  hostRumuz: string;
  hostId: string;
  duelType: DuelType;
  questionCount: 10 | 20 | 30;
  categoryFilter: string;
  maxPlayers?: 2 | 3 | 4;
  currentPlayersCount?: number;
  waitingDurationSec: number;
  createdAt: string;
}

/**
 * Discovers active waiting players across all modes & question counts,
 * especially useful for suggesting matches when someone is waiting > 1 minute.
 */
export async function findCrossModeWaitingRooms(
  excludePlayerId: string
): Promise<WaitingRoomSuggestion[]> {
  try {
    const q = query(
      collection(db, 'duels'),
      where('mode', '==', 'quick'),
      where('status', '==', 'waiting'),
      limit(15)
    );

    const snap = await getDocs(q);
    const now = Date.now();
    const suggestions: WaitingRoomSuggestion[] = [];

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as DuelSession;
      if (!data || !data.player1 || data.player1.id === excludePlayerId) continue;

      const activePlayers = getAllSessionPlayers(data);
      const capacity = data.maxPlayers || 2;
      if (activePlayers.length >= capacity) continue;

      const lastHeartbeatTime = data.lastHeartbeat || (data.updatedAt ? new Date(data.updatedAt).getTime() : 0);
      const ageSec = (now - lastHeartbeatTime) / 1000;
      if (ageSec > 35) {
        // Stale room
        deleteDoc(doc(db, 'duels', data.id)).catch(() => {});
        continue;
      }

      const createdTime = data.createdAt ? new Date(data.createdAt).getTime() : now;
      const waitingSec = Math.max(0, Math.floor((now - createdTime) / 1000));

      suggestions.push({
        id: data.id,
        roomCode: data.roomCode,
        hostRumuz: data.player1.rumuz || 'Oyuncu',
        hostId: data.player1.id,
        duelType: data.duelType || 'pin_map',
        questionCount: data.questionCount || 10,
        categoryFilter: data.categoryFilter || 'Genel',
        maxPlayers: capacity as 2 | 3 | 4,
        currentPlayersCount: activePlayers.length,
        waitingDurationSec: waitingSec,
        createdAt: data.createdAt
      });
    }

    // Sort by longest waiting first
    return suggestions.sort((a, b) => b.waitingDurationSec - a.waitingDurationSec);
  } catch (error) {
    console.warn('Find cross mode waiting rooms error:', error);
    return [];
  }
}

/**
 * Immediately joins a suggested waiting duel room across modes/question counts.
 */
export async function joinSuggestedDuelRoom(
  duelId: string,
  player: PlayerProfileInput
): Promise<{ success: boolean; duel?: DuelSession; errorMsg?: string }> {
  try {
    const duelRef = doc(db, 'duels', duelId);
    const duelSnap = await getDoc(duelRef);
    if (!duelSnap.exists()) {
      return { success: false, errorMsg: 'Önerilen oda artık mevcut değil veya kapandı.' };
    }

    const duelData = duelSnap.data() as DuelSession;
    if (duelData.status !== 'waiting') {
      return { success: false, errorMsg: 'Bu odaya başka bir oyuncu katıldı veya oyun başladı.' };
    }

    const activePlayers = getAllSessionPlayers(duelData);
    const capacity = duelData.maxPlayers || 2;
    if (activePlayers.length >= capacity) {
      return { success: false, errorMsg: 'Bu oda doldu.' };
    }

    const slotIndex = activePlayers.length;
    const slotKey = slotIndex === 1 ? 'player2' : slotIndex === 2 ? 'player3' : 'player4';

    const now = Date.now();
    const joiningPlayer: DuelPlayer = sanitizePlayer(player, false);
    joiningPlayer.playerSlot = slotKey;

    const updatedPlayers = [...activePlayers, joiningPlayer];
    const isRoomFull = updatedPlayers.length >= capacity;

    const updatedFields: Record<string, unknown> = {
      [slotKey]: joiningPlayer,
      players: updatedPlayers,
      lastHeartbeat: now,
      updatedAt: new Date(now).toISOString()
    };

    if (isRoomFull) {
      updatedFields.status = 'starting';
      updatedFields.roundStartTime = now + 8000;
    }

    const cleanedUpdates = sanitizeForFirestore(updatedFields);
    await updateDoc(duelRef, cleanedUpdates);
    return {
      success: true,
      duel: { ...duelData, ...updatedFields } as DuelSession
    };
  } catch (error) {
    console.error('Join suggested duel error:', error);
    return { success: false, errorMsg: 'Önerilen maça bağlanırken hata oluştu.' };
  }
}

/**
 * Starts a practice match against the AI / Bot opponents instantly (2-4 Players)
 */
export async function startBotDuel(
  player: PlayerProfileInput,
  options: {
    duelType?: DuelType;
    questionCount: 10 | 20 | 30;
    categoryFilter: string;
    maxPlayers?: 2 | 3 | 4;
  }
): Promise<DuelSession> {
  const duelType = options.duelType || 'pin_map';
  const targetMaxPlayers: 2 | 3 | 4 = options.maxPlayers || 2;
  const duelId = `duel_bot_${Date.now()}`;
  const roomCode = 'BOT-3D';
  const questionIds = prepareDuelQuestions(options.categoryFilter, options.questionCount, duelType);

  const initialPlayer: DuelPlayer = sanitizePlayer(player, true);
  initialPlayer.playerSlot = 'player1';
  initialPlayer.pingMs = 15;

  const botPlayer1: DuelPlayer = sanitizePlayer({
    id: 'kpss_ai_bot',
    rumuz: 'Coğrafya Yapay Zeka 🤖',
    rumuzKey: 'cografya_ai_bot',
    avatarIcon: '🤖',
    avatarBg: 'indigo_midnight',
    equippedTitle: 'Turing Başmühendisi',
    unlockedBadges: ['Yapay Zeka Mat Eden', 'Turing Ustası'],
    duelWins: 50,
    duelStreak: 3
  }, false);
  botPlayer1.playerSlot = 'player2';
  botPlayer1.isBot = true;
  botPlayer1.pingMs = 10;

  const botPlayer2: DuelPlayer | null = targetMaxPlayers >= 3 ? sanitizePlayer({
    id: 'piri_reis_bot',
    rumuz: 'Pîrî Reis AI 🗺️',
    rumuzKey: 'piri_reis_bot',
    avatarIcon: '🗺️',
    avatarBg: 'emerald_forest',
    equippedTitle: 'Büyük Kartograf',
    unlockedBadges: ['81 İl Fatihi', 'Harita Dehası'],
    duelWins: 42,
    duelStreak: 2
  }, false) : null;
  if (botPlayer2) {
    botPlayer2.playerSlot = 'player3';
    botPlayer2.isBot = true;
    botPlayer2.pingMs = 12;
  }

  const botPlayer3: DuelPlayer | null = targetMaxPlayers >= 4 ? sanitizePlayer({
    id: 'evliya_celebi_bot',
    rumuz: 'Evliya Çelebi AI 📜',
    rumuzKey: 'evliya_celebi_bot',
    avatarIcon: '📜',
    avatarBg: 'crimson_dominance',
    equippedTitle: 'Seyyah-ı Âlem',
    unlockedBadges: ['Seyyah Ruhlu', 'Milli Park Bekçisi'],
    duelWins: 38,
    duelStreak: 1
  }, false) : null;
  if (botPlayer3) {
    botPlayer3.playerSlot = 'player4';
    botPlayer3.isBot = true;
    botPlayer3.pingMs = 14;
  }

  const activePlayersList: DuelPlayer[] = [initialPlayer, botPlayer1];
  if (botPlayer2) activePlayersList.push(botPlayer2);
  if (botPlayer3) activePlayersList.push(botPlayer3);

  const now = Date.now();
  const payload: DuelSession = {
    id: duelId,
    roomCode,
    mode: 'quick',
    duelType,
    status: 'in_progress', // Starts immediately for AI Practice!
    questionCount: options.questionCount,
    categoryFilter: options.categoryFilter || 'Genel',
    maxPlayers: targetMaxPlayers,
    players: activePlayersList,
    questionIds,
    player1: initialPlayer,
    player2: botPlayer1,
    player3: botPlayer2,
    player4: botPlayer3,
    currentRound: 0,
    roundStartTime: now, // Zero delay, instant start
    roundTimeLimit: duelType === 'kpss_test' ? 40 : 15,
    bothAnsweredAt: null,
    winnerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const cleaned = sanitizeForFirestore(payload);
    await setDoc(doc(db, 'duels', duelId), cleaned);
    return payload;
  } catch (error) {
    console.error('Start bot duel error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duelId}`);
    throw error;
  }
}

/**
 * Allows the room host (player1) to force start a match if at least 2 players have joined.
 */
export async function forceStartWaitingDuel(duelId: string): Promise<boolean> {
  try {
    const duelRef = doc(db, 'duels', duelId);
    const duelSnap = await getDoc(duelRef);
    if (!duelSnap.exists()) return false;

    const duelData = duelSnap.data() as DuelSession;
    const activePlayers = getAllSessionPlayers(duelData);
    if (activePlayers.length < 2) return false;

    const now = Date.now();
    const updates: Record<string, unknown> = {
      status: 'starting',
      maxPlayers: activePlayers.length as 2 | 3 | 4,
      roundStartTime: now + 6000,
      updatedAt: new Date(now).toISOString()
    };

    const cleaned = sanitizeForFirestore(updates);
    await updateDoc(duelRef, cleaned);
    return true;
  } catch (error) {
    console.error('Force start duel error:', error);
    return false;
  }
}

/**
 * Submits a player's guess for current round (Map Duel) and checks if all players answered
 */
export async function submitPlayerGuess(
  duel: DuelSession,
  playerId: string,
  coords: [number, number], // [lng, lat]
  targetCoords: [number, number], // [lng, lat]
  timeTakenSec: number
): Promise<void> {
  const allPlayers = getAllSessionPlayers(duel);
  const playerIndex = allPlayers.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return;

  const currentPlayer = allPlayers[playerIndex];
  const playerKey = getPlayerKeyById(duel, playerId) || (playerIndex === 0 ? 'player1' : playerIndex === 1 ? 'player2' : playerIndex === 2 ? 'player3' : 'player4');

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

  const newScore = currentPlayer.score + scoreResult.totalPoints;
  const newDistance = currentPlayer.totalDistanceKm + scoreResult.distanceKm;

  // Clone and update players array
  const updatedPlayers = allPlayers.map(p => {
    if (p.id === playerId) {
      return {
        ...p,
        currentGuess: guess,
        score: newScore,
        totalDistanceKm: newDistance
      };
    }
    return p;
  });

  const updates: Record<string, unknown> = {
    [`${playerKey}.currentGuess`]: guess,
    [`${playerKey}.score`]: newScore,
    [`${playerKey}.totalDistanceKm`]: newDistance,
    players: updatedPlayers,
    updatedAt: new Date().toISOString()
  };

  // Check if AI Bots are in this room and haven't answered yet
  const unAnsweredBots = updatedPlayers.filter(p => p.isBot && !p.currentGuess);
  for (const botPlayer of unAnsweredBots) {
    const scatterLat = (Math.random() - 0.5) * 0.7;
    const scatterLng = (Math.random() - 0.5) * 1.0;
    const botLat = targetCoords[1] + scatterLat;
    const botLng = targetCoords[0] + scatterLng;

    const bLatDiff = (tLat - botLat) * (Math.PI / 180);
    const bLonDiff = (tLng - botLng) * (Math.PI / 180);
    const bA =
      Math.sin(bLatDiff / 2) * Math.sin(bLatDiff / 2) +
      Math.cos(botLat * (Math.PI / 180)) * Math.cos(tLat * (Math.PI / 180)) * Math.sin(bLonDiff / 2) * Math.sin(bLonDiff / 2);
    const bC = 2 * Math.atan2(Math.sqrt(bA), Math.sqrt(1 - bA));
    const botDistKm = R * bC;

    const botTimeSec = Math.min(14.5, Math.max(1.0, timeTakenSec + (Math.random() * 1.2 - 0.6)));
    const botScoreResult = calculateDuelScore(botDistKm, botTimeSec);

    const botGuess: DuelGuess = {
      lat: botLat,
      lng: botLng,
      distanceKm: botScoreResult.distanceKm,
      timeTakenSec: Math.round(botTimeSec * 10) / 10,
      pointsEarned: botScoreResult.totalPoints,
      submittedAt: Date.now()
    };

    const botSlotKey = getPlayerKeyById(duel, botPlayer.id) || (botPlayer.playerSlot || 'player2');
    const botNewScore = (botPlayer.score || 0) + botScoreResult.totalPoints;
    const botNewDist = (botPlayer.totalDistanceKm || 0) + botScoreResult.distanceKm;

    updates[`${botSlotKey}.currentGuess`] = botGuess;
    updates[`${botSlotKey}.score`] = botNewScore;
    updates[`${botSlotKey}.totalDistanceKm`] = botNewDist;

    // update bot in players array
    const botIdx = updatedPlayers.findIndex(p => p.id === botPlayer.id);
    if (botIdx !== -1) {
      updatedPlayers[botIdx] = {
        ...updatedPlayers[botIdx],
        currentGuess: botGuess,
        score: botNewScore,
        totalDistanceKm: botNewDist
      };
      updates.players = updatedPlayers;
    }
  }

  // Check if all players have answered
  const allAnswered = updatedPlayers.every(p => !!p.currentGuess);
  if (allAnswered) {
    updates['status'] = 'round_reveal';
    updates['bothAnsweredAt'] = Date.now();
  }

  try {
    const cleaned = sanitizeForFirestore(updates);
    await updateDoc(doc(db, 'duels', duel.id), cleaned);
  } catch (error) {
    console.error('Submit guess error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Submits a player's test answer for current round (KPSS Test Duel) and checks if all players answered
 */
export async function submitPlayerTestAnswer(
  duel: DuelSession,
  playerId: string,
  selectedOptionIndex: number,
  correctOptionIndex: number,
  timeTakenSec: number
): Promise<void> {
  const allPlayers = getAllSessionPlayers(duel);
  const playerIndex = allPlayers.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return;

  const currentPlayer = allPlayers[playerIndex];
  const playerKey = getPlayerKeyById(duel, playerId) || (playerIndex === 0 ? 'player1' : playerIndex === 1 ? 'player2' : playerIndex === 2 ? 'player3' : 'player4');

  const isCorrect = selectedOptionIndex === correctOptionIndex;
  const scoreResult = calculateTestDuelScore(isCorrect, timeTakenSec, duel.roundTimeLimit || 40);
  const newScore = currentPlayer.score + scoreResult.pointsEarned;

  const updatedPlayers = allPlayers.map(p => {
    if (p.id === playerId) {
      return {
        ...p,
        currentOptionAnswer: selectedOptionIndex,
        score: newScore
      };
    }
    return p;
  });

  const updates: Record<string, unknown> = {
    [`${playerKey}.currentOptionAnswer`]: selectedOptionIndex,
    [`${playerKey}.score`]: newScore,
    players: updatedPlayers,
    updatedAt: new Date().toISOString()
  };

  // Check if AI Bots are in this room and haven't answered yet
  const unAnsweredBots = updatedPlayers.filter(p => p.isBot && (p.currentOptionAnswer === null || p.currentOptionAnswer === undefined));
  for (const botPlayer of unAnsweredBots) {
    const isBotCorrect = Math.random() < 0.75;
    const optionsCount = 5;
    const botPickedOption = isBotCorrect
      ? correctOptionIndex
      : (correctOptionIndex + 1 + Math.floor(Math.random() * (optionsCount - 1))) % optionsCount;

    const botTimeSec = Math.min(38, Math.max(1.2, timeTakenSec + (Math.random() * 1.5 - 0.5)));
    const botScoreResult = calculateTestDuelScore(isBotCorrect, botTimeSec, duel.roundTimeLimit || 40);

    const botSlotKey = getPlayerKeyById(duel, botPlayer.id) || (botPlayer.playerSlot || 'player2');
    const botNewScore = (botPlayer.score || 0) + botScoreResult.pointsEarned;

    updates[`${botSlotKey}.currentOptionAnswer`] = botPickedOption;
    updates[`${botSlotKey}.score`] = botNewScore;

    const botIdx = updatedPlayers.findIndex(p => p.id === botPlayer.id);
    if (botIdx !== -1) {
      updatedPlayers[botIdx] = {
        ...updatedPlayers[botIdx],
        currentOptionAnswer: botPickedOption,
        score: botNewScore
      };
      updates.players = updatedPlayers;
    }
  }

  // Check if all players have answered
  const allAnswered = updatedPlayers.every(p => p.currentOptionAnswer !== null && p.currentOptionAnswer !== undefined);
  if (allAnswered) {
    updates['status'] = 'round_reveal';
    updates['bothAnsweredAt'] = Date.now();
  }

  try {
    const cleaned = sanitizeForFirestore(updates);
    await updateDoc(doc(db, 'duels', duel.id), cleaned);
  } catch (error) {
    console.error('Submit test answer error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Handles round timeout if any player hasn't responded within round limit
 */
export async function handleRoundTimeout(duel: DuelSession): Promise<void> {
  const isTest = duel.duelType === 'kpss_test';
  const allPlayers = getAllSessionPlayers(duel);

  const updates: Record<string, unknown> = {
    status: 'round_reveal',
    bothAnsweredAt: Date.now(),
    updatedAt: new Date().toISOString()
  };

  const updatedPlayers = allPlayers.map((p, idx) => {
    const slotKey = getPlayerKeyById(duel, p.id) || (idx === 0 ? 'player1' : idx === 1 ? 'player2' : idx === 2 ? 'player3' : 'player4');
    if (isTest) {
      if (p.currentOptionAnswer === null || p.currentOptionAnswer === undefined) {
        updates[`${slotKey}.currentOptionAnswer`] = -1;
        return { ...p, currentOptionAnswer: -1 };
      }
    } else {
      if (!p.currentGuess) {
        const missGuess: DuelGuess = {
          lat: 0,
          lng: 0,
          distanceKm: 850,
          timeTakenSec: 15,
          pointsEarned: 0,
          submittedAt: Date.now()
        };
        updates[`${slotKey}.currentGuess`] = missGuess;
        updates[`${slotKey}.totalDistanceKm`] = (p.totalDistanceKm || 0) + 850;
        return {
          ...p,
          currentGuess: missGuess,
          totalDistanceKm: (p.totalDistanceKm || 0) + 850
        };
      }
    }
    return p;
  });

  updates.players = updatedPlayers;

  try {
    const cleaned = sanitizeForFirestore(updates);
    await updateDoc(doc(db, 'duels', duel.id), cleaned);
  } catch (error) {
    console.error('Handle timeout error:', error);
    handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
  }
}

/**
 * Builds history snapshot for the concluded round across all 2-4 players
 */
function recordCurrentRoundHistory(duel: DuelSession): DuelRoundHistory[] {
  const currentQId = duel.questionIds[duel.currentRound];
  const isTest = duel.duelType === 'kpss_test';
  const allPlayers = getAllSessionPlayers(duel);

  if (isTest) {
    const questionObj = MULTIPLE_CHOICE_QUESTIONS.find((q) => q.id === currentQId) || MULTIPLE_CHOICE_QUESTIONS[duel.currentRound % MULTIPLE_CHOICE_QUESTIONS.length];
    const correctIdx = questionObj?.correctIndex ?? 0;

    const p1Opt = duel.player1?.currentOptionAnswer ?? allPlayers[0]?.currentOptionAnswer ?? -1;
    const p2Opt = duel.player2?.currentOptionAnswer ?? allPlayers[1]?.currentOptionAnswer ?? -1;
    const p3Opt = duel.player3?.currentOptionAnswer ?? allPlayers[2]?.currentOptionAnswer ?? -1;
    const p4Opt = duel.player4?.currentOptionAnswer ?? allPlayers[3]?.currentOptionAnswer ?? -1;

    const p1Correct = p1Opt === correctIdx;
    const p2Correct = p2Opt === correctIdx;
    const p3Correct = p3Opt === correctIdx;
    const p4Correct = p4Opt === correctIdx;

    const allPlayerResults: DuelPlayerRoundResult[] = allPlayers.map(p => ({
      id: p.id,
      rumuz: p.rumuz,
      avatarIcon: p.avatarIcon,
      avatarBg: p.avatarBg,
      guess: null,
      points: (p.currentOptionAnswer === correctIdx) ? 1000 : 0,
      distanceKm: 0,
      selectedOption: p.currentOptionAnswer ?? -1,
      isCorrect: p.currentOptionAnswer === correctIdx
    }));

    const historyEntry: DuelRoundHistory = {
      roundIndex: duel.currentRound,
      questionId: currentQId || `q_${duel.currentRound}`,
      targetTitle: questionObj?.questionText || `Soru #${duel.currentRound + 1}`,
      targetCoords: (questionObj?.targetCoords && Array.isArray(questionObj.targetCoords) && questionObj.targetCoords.length === 2)
        ? questionObj.targetCoords
        : [35.0, 39.0],
      targetCategory: questionObj?.category || duel.categoryFilter || 'KPSS Coğrafya Testi',
      player1Guess: null,
      player2Guess: null,
      player3Guess: null,
      player4Guess: null,
      player1Points: p1Correct ? 1000 : 0,
      player2Points: p2Correct ? 1000 : 0,
      player3Points: p3Correct ? 1000 : 0,
      player4Points: p4Correct ? 1000 : 0,
      player1DistanceKm: 0,
      player2DistanceKm: 0,
      player3DistanceKm: 0,
      player4DistanceKm: 0,
      options: questionObj?.options ? [...questionObj.options] : ['A', 'B', 'C', 'D', 'E'],
      correctOptionIndex: correctIdx,
      player1SelectedOption: p1Opt,
      player2SelectedOption: p2Opt,
      player3SelectedOption: p3Opt,
      player4SelectedOption: p4Opt,
      player1IsCorrect: p1Correct,
      player2IsCorrect: p2Correct,
      player3IsCorrect: p3Correct,
      player4IsCorrect: p4Correct,
      allPlayerResults
    };

    const existingHistory = duel.roundHistory || [];
    const filtered = existingHistory.filter(h => h.roundIndex !== duel.currentRound);
    return [...filtered, historyEntry];
  }

  const questionObj = PIN_GAME_QUESTIONS.find((q) => q.id === currentQId) || PIN_GAME_QUESTIONS[duel.currentRound % PIN_GAME_QUESTIONS.length];

  const p1Guess = duel.player1?.currentGuess || allPlayers[0]?.currentGuess || null;
  const p2Guess = duel.player2?.currentGuess || allPlayers[1]?.currentGuess || null;
  const p3Guess = duel.player3?.currentGuess || allPlayers[2]?.currentGuess || null;
  const p4Guess = duel.player4?.currentGuess || allPlayers[3]?.currentGuess || null;

  const allPlayerResults: DuelPlayerRoundResult[] = allPlayers.map(p => ({
    id: p.id,
    rumuz: p.rumuz,
    avatarIcon: p.avatarIcon,
    avatarBg: p.avatarBg,
    guess: p.currentGuess || null,
    points: p.currentGuess?.pointsEarned || 0,
    distanceKm: p.currentGuess ? Math.round(p.currentGuess.distanceKm * 10) / 10 : 850,
    selectedOption: null,
    isCorrect: false
  }));

  const historyEntry: DuelRoundHistory = {
    roundIndex: duel.currentRound,
    questionId: currentQId || `q_${duel.currentRound}`,
    targetTitle: questionObj?.title || `Soru #${duel.currentRound + 1}`,
    targetCoords: (questionObj?.targetCoords && Array.isArray(questionObj.targetCoords) && questionObj.targetCoords.length === 2)
      ? questionObj.targetCoords
      : [35.0, 39.0],
    targetCategory: questionObj?.category || duel.categoryFilter || 'Harita İşaretleme',
    player1Guess: p1Guess,
    player2Guess: p2Guess,
    player3Guess: p3Guess,
    player4Guess: p4Guess,
    player1Points: p1Guess?.pointsEarned || 0,
    player2Points: p2Guess?.pointsEarned || 0,
    player3Points: p3Guess?.pointsEarned || 0,
    player4Points: p4Guess?.pointsEarned || 0,
    player1DistanceKm: p1Guess ? Math.round(p1Guess.distanceKm * 10) / 10 : 850,
    player2DistanceKm: p2Guess ? Math.round(p2Guess.distanceKm * 10) / 10 : 850,
    player3DistanceKm: p3Guess ? Math.round(p3Guess.distanceKm * 10) / 10 : 850,
    player4DistanceKm: p4Guess ? Math.round(p4Guess.distanceKm * 10) / 10 : 850,
    options: [],
    correctOptionIndex: 0,
    player1SelectedOption: null,
    player2SelectedOption: null,
    player3SelectedOption: null,
    player4SelectedOption: null,
    player1IsCorrect: false,
    player2IsCorrect: false,
    player3IsCorrect: false,
    player4IsCorrect: false,
    allPlayerResults
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
  const allPlayers = getAllSessionPlayers(duel);

  if (isFinished) {
    let winnerId: string | 'draw' = 'draw';
    if (allPlayers.length > 0) {
      const sortedByScore = [...allPlayers].sort((a, b) => (b.score || 0) - (a.score || 0));
      const topScore = sortedByScore[0]?.score || 0;
      const topWinners = sortedByScore.filter(p => p.score === topScore);

      if (topWinners.length === 1) {
        winnerId = topWinners[0].id;
      } else {
        winnerId = 'draw';
      }
    }

    const resetPlayers = allPlayers.map(p => ({
      ...p,
      readyToAdvance: false
    }));

    const updates: Record<string, unknown> = {
      status: 'finished',
      winnerId,
      roundHistory: updatedHistory,
      players: resetPlayers,
      'player1.readyToAdvance': false,
      'player2.readyToAdvance': false,
      'player3.readyToAdvance': false,
      'player4.readyToAdvance': false,
      updatedAt: new Date().toISOString()
    };

    try {
      const cleaned = sanitizeForFirestore(updates);
      await updateDoc(doc(db, 'duels', duel.id), cleaned);
      // Synchronize all duel players immediately to global rumuzes collection for leaderboard visibility
      recordFinishedDuelToRumuzes({
        ...duel,
        status: 'finished',
        winnerId,
        players: resetPlayers,
        roundHistory: updatedHistory
      }).catch(() => {});
    } catch (error) {
      console.error('Finish duel error:', error);
      handleFirestoreError(error, OperationType.WRITE, `duels/${duel.id}`);
    }
    return;
  }

  const now = Date.now();
  const resetPlayers = allPlayers.map(p => ({
    ...p,
    currentGuess: null,
    currentOptionAnswer: null,
    readyToAdvance: false
  }));

  const updates: Record<string, unknown> = {
    currentRound: nextRound,
    status: 'in_progress',
    roundStartTime: now,
    bothAnsweredAt: null,
    roundHistory: updatedHistory,
    players: resetPlayers,
    'player1.currentGuess': null,
    'player2.currentGuess': null,
    'player3.currentGuess': null,
    'player4.currentGuess': null,
    'player1.currentOptionAnswer': null,
    'player2.currentOptionAnswer': null,
    'player3.currentOptionAnswer': null,
    'player4.currentOptionAnswer': null,
    'player1.readyToAdvance': false,
    'player2.readyToAdvance': false,
    'player3.readyToAdvance': false,
    'player4.readyToAdvance': false,
    updatedAt: new Date().toISOString()
  };

  try {
    const cleaned = sanitizeForFirestore(updates);
    await updateDoc(doc(db, 'duels', duel.id), cleaned);
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

  const allPlayers = getAllSessionPlayers(duel);
  const playerIndex = allPlayers.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return;

  const playerKey = getPlayerKeyById(duel, playerId) || (playerIndex === 0 ? 'player1' : playerIndex === 1 ? 'player2' : playerIndex === 2 ? 'player3' : 'player4');

  const updatedPlayers = allPlayers.map(p => {
    if (p.id === playerId) {
      return { ...p, readyToAdvance: true };
    }
    return p;
  });

  // Check if ALL human players (and bots) are now ready to advance
  const allReady = updatedPlayers.every(p => p.isBot || p.readyToAdvance);

  if (allReady) {
    await advanceDuelRound(duel);
    return;
  }

  try {
    const updates: Record<string, unknown> = {
      [`${playerKey}.readyToAdvance`]: true,
      players: updatedPlayers,
      updatedAt: new Date().toISOString()
    };
    const cleaned = sanitizeForFirestore(updates);
    await updateDoc(doc(db, 'duels', duel.id), cleaned);
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
