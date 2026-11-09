/* ==================================================================
   Rank system — the long climb.

   Two separate ladders, because they answer different questions:

   1. XP / Level  ("how much have I done?")  — always goes up, never
      resets. This is the dopamine loop: every correct answer is a
      small, visible step. 60 levels across 6 named ranks.

   2. Prestige badges  ("what have I proven?") — thresholds that stay
      hard. Deliberately steep so that a badge means something.

   The two are coupled: badges pay a large XP bounty, so a milestone
   both proves mastery and visibly jumps your level.

   Everything here is pure — no store, no React — so it can be unit
   tested and reused by the store, the profile card and the stats panel.
   ================================================================== */

export type RankId =
  | 'cirak'
  | 'gezgin'
  | 'kartograf'
  | 'uzman'
  | 'ustat'
  | 'efsane';

export interface RankDef {
  id: RankId;
  name: string;
  minLevel: number;
  /** Accent used for the level chip in the UI. */
  accent: string;
  blurb: string;
}

/** Six bands over 60 levels. Level 1 is the floor, 60 the ceiling. */
export const RANKS: RankDef[] = [
  {
    id: 'cirak',
    name: 'Çırak',
    minLevel: 1,
    accent: '#a9a894',
    blurb: 'Haritayı yeni tanıyorsun. Temelleri at.',
  },
  {
    id: 'gezgin',
    name: 'Gezgin',
    minLevel: 8,
    accent: '#9db8a4',
    blurb: 'Bölgeleri ayırt ediyorsun. Rotanı genişlet.',
  },
  {
    id: 'kartograf',
    name: 'Kartograf',
    minLevel: 18,
    accent: '#7fa8b8',
    blurb: 'Şekilleri okuyorsun. Artık harita çizebilirsin.',
  },
  {
    id: 'uzman',
    name: 'Uzman',
    minLevel: 30,
    accent: '#c9a24a',
    blurb: 'Detayları biliyorsun. Zayıf noktan kalmadı.',
  },
  {
    id: 'ustat',
    name: 'Üstat',
    minLevel: 43,
    accent: '#d4a94f',
    blurb: 'Arenada tanınıyorsun. Seni geçmek zor.',
  },
  {
    id: 'efsane',
    name: 'Efsane',
    minLevel: 55,
    accent: '#e3c987',
    blurb: 'Zirve. Burada sadece birkaç kişi var.',
  },
];

export const MAX_LEVEL = 60;

/**
 * XP needed to *reach* a level.
 * Deliberately super-linear: early levels come fast (the first ten
 * answers already level you up, so the loop hooks immediately), later
 * ones need real volume. Level 60 ≈ 37k XP — roughly 80-90 study
 * sessions, or faster if you also duel and collect badges.
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  // Quadratic core + linear term: smooth, no early plateaus.
  return Math.round(10 * n * n + 40 * n);
}

export interface LevelInfo {
  level: number;
  rank: RankDef;
  /** XP accumulated inside the current level. */
  xpIntoLevel: number;
  /** XP span of the current level. */
  xpForNext: number;
  progressPct: number;
  /** Remaining XP to the next level. */
  xpRemaining: number;
  isMax: boolean;
}

export function levelFromXp(totalXp: number): LevelInfo {
  const xp = Math.max(0, Math.floor(totalXp || 0));

  let level = 1;
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) {
    level += 1;
  }

  const floorXp = xpForLevel(level);
  const nextXp = level >= MAX_LEVEL ? floorXp : xpForLevel(level + 1);
  const span = Math.max(1, nextXp - floorXp);
  const into = Math.min(span, xp - floorXp);

  return {
    level,
    rank: rankForLevel(level),
    xpIntoLevel: into,
    xpForNext: span,
    progressPct: level >= MAX_LEVEL ? 100 : Math.round((into / span) * 100),
    xpRemaining: level >= MAX_LEVEL ? 0 : Math.max(0, nextXp - xp),
    isMax: level >= MAX_LEVEL,
  };
}

export function rankForLevel(level: number): RankDef {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel) current = r;
  }
  return current;
}

/** The next rank band, or null at the top. */
export function nextRank(level: number): RankDef | null {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}

/* ------------------------------------------------------------------
   XP values
   Tuned so a normal session (10 questions, a couple of duels) moves
   the bar visibly, but the top ranks stay months away.
   ------------------------------------------------------------------ */
export const XP = {
  /** Correct quiz / pin answer, before bonuses. */
  correctAnswer: 10,
  /** Wrong answer still teaches — but barely. */
  wrongAnswer: 1,
  /** Pin accuracy scaling: perfect guess earns the full bounty. */
  pinPerfect: 40,
  pinClose: 22,
  pinFar: 6,
  /** A live 1v1 win is worth far more than a solo answer. */
  duelWin: 320,
  duelDraw: 90,
  duelLoss: 40,
  /** Bot matches pay less than human opponents. */
  botWin: 140,
  botDraw: 45,
  botLoss: 25,
  /** Streak bonus applied on top of the answer itself. */
  streakBonus5: 60,
  streakBonus10: 180,
  /** Flat bounty for proving a badge. Large — this is the milestone. */
  badgeBounty: 400,
} as const;

/**
 * Pin-guess reward, scaled by how close the guess was.
 * distanceKm <= 5 is "perfect", <= 40 "close", otherwise "far".
 */
export function pinXpForDistance(distanceKm: number): number {
  if (!Number.isFinite(distanceKm)) return XP.pinFar;
  if (distanceKm <= 5) return XP.pinPerfect;
  if (distanceKm <= 15) return Math.round((XP.pinPerfect + XP.pinClose) / 2);
  if (distanceKm <= 40) return XP.pinClose;
  if (distanceKm <= 120) return Math.round((XP.pinClose + XP.pinFar) / 2);
  return XP.pinFar;
}

/** Streak bonus for a current streak count (0 when no bonus applies). */
export function streakBonus(streak: number): number {
  if (streak >= 10) return XP.streakBonus10;
  if (streak >= 5) return XP.streakBonus5;
  return 0;
}

/**
 * Daily-return bonus. Consecutive active days pay more, capped so it
 * rewards habit without becoming the main source of XP.
 */
export function dailyBonus(streakDays: number): number {
  if (streakDays <= 1) return 25;
  if (streakDays <= 3) return 45;
  if (streakDays <= 7) return 80;
  if (streakDays <= 30) return 120;
  return 160;
}

/* ------------------------------------------------------------------
   Prestige thresholds
   These are the "hard" gates. Each ladder is steep on purpose: the
   first step should be reachable in a session, the last one in months.
   ------------------------------------------------------------------ */

export const DUEL_WIN_LADDER = [1, 5, 15, 40, 100, 250] as const;
export const BOT_WIN_LADDER = [1, 5, 20, 60, 150] as const;
export const QUIZ_SCORE_LADDER = [500, 1500, 4000, 9000, 20000] as const;
export const STREAK_LADDER = [5, 12, 25, 50] as const;
export const PRECISION_LADDER = [3, 10, 25, 60] as const;

export interface MilestoneStep {
  /** Display threshold, e.g. "25 zafer". */
  label: string;
  target: number;
  /** XP awarded the first time this step is crossed. */
  xp: number;
}

/** Builds a milestone ladder with escalating XP bounties. */
export function buildLadder(
  targets: readonly number[],
  baseXp: number,
  unit: string
): MilestoneStep[] {
  return targets.map((target, i) => ({
    label: `${target} ${unit}`,
    target,
    xp: Math.round(baseXp * Math.pow(1.8, i)),
  }));
}
