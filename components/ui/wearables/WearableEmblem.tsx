'use client';

import React from 'react';
import { GLYPHS } from './glyphs';

/* ==================================================================
   Wearable frames — the *shell* that tells you what kind of thing you
   are looking at, and which tier it belongs to.

   Three families, deliberately different silhouettes so a badge can
   never be mistaken for a title or an avatar:

     badge    medallion   (circle → shield → star → gem cut → burst)
     title    banner      (plaque → band → swallowtail → hex → ribbon)
     avatar   ring/halo   (dashed ring → double ring → ray ring → …)

   Five tiers, and the jump that matters — 4 → 5 — changes geometry,
   colour *and* motion: the mythic shell is a radiating burst with an
   orbit ring, the diamond shell is a cold faceted gem with no orbit.
   At 16px they are still different shapes, which is the whole point.
   ================================================================== */

export type WearableTier = 0 | 1 | 2 | 3 | 4 | 5;

type Family = 'badge' | 'title' | 'avatar';

type Palette = { edge: string; soft: string; glyph: string; halo: string };

const TIER_COLORS: Record<WearableTier, Palette> = {
  0: { edge: '#94a3b8', soft: '#64748b', glyph: '#e2e8f0', halo: 'rgba(148,163,184,0.35)' },
  1: { edge: '#f5a86b', soft: '#b45309', glyph: '#ffe3c4', halo: 'rgba(245,168,107,0.45)' },
  2: { edge: '#e8eef5', soft: '#8fa3b8', glyph: '#ffffff', halo: 'rgba(226,232,240,0.45)' },
  3: { edge: '#fde047', soft: '#d97706', glyph: '#fff7cc', halo: 'rgba(253,224,71,0.5)' },
  4: { edge: '#67e8f9', soft: '#818cf8', glyph: '#e0f7ff', halo: 'rgba(103,232,249,0.5)' },
  5: { edge: '#f0abfc', soft: '#22d3ee', glyph: '#ffffff', halo: 'rgba(240,171,252,0.6)' }
};

export function tierPalette(tier: number): Palette {
  return TIER_COLORS[(Math.max(0, Math.min(5, tier)) as WearableTier)];
}

const GLYPH_TRANSFORM: Record<Family, string> = {
  badge: 'translate(5.4 5.4) scale(1.55)',
  title: 'translate(6.4 6.4) scale(1.47)',
  avatar: 'translate(7.2 7.2) scale(1.4)'
};

/* Badge medallions ------------------------------------------------- */
function BadgeFrame({ tier }: { tier: WearableTier }) {
  switch (tier) {
    case 5:
      return (
        <>
          <path d="M24.00 2.20 L28.50 7.19 L34.90 5.12 L36.30 11.70 L42.88 13.10 L40.81 19.50 L45.80 24.00 L40.81 28.50 L42.88 34.90 L36.30 36.30 L34.90 42.88 L28.50 40.81 L24.00 45.80 L19.50 40.81 L13.10 42.88 L11.70 36.30 L5.12 34.90 L7.19 28.50 L2.20 24.00 L7.19 19.50 L5.12 13.10 L11.70 11.70 L13.10 5.12 L19.50 7.19Z" />
          <ellipse cx="24" cy="24" rx="23.2" ry="6.2" transform="rotate(-30 24 24)" strokeDasharray="4 3.4" opacity="0.8" />
          <ellipse cx="24" cy="24" rx="23.2" ry="6.2" transform="rotate(34 24 24)" strokeDasharray="2 3.6" opacity="0.55" />
        </>
      );
    case 4:
      return (
        <>
          <path d="M24.00 2.00 L43.05 13.00 L43.05 35.00 L24.00 46.00 L4.95 35.00 L4.95 13.00Z" />
          <path d="M24 2 24 9M43.05 13 37 16.5M43.05 35 37 31.5M24 46 24 39M4.95 35 11 31.5M4.95 13 11 16.5" opacity="0.75" strokeWidth="1.2" />
        </>
      );
    case 3:
      return (
        <>
          <path d="M24.00 2.40 L30.58 8.11 L39.27 8.73 L39.89 17.42 L45.60 24.00 L39.89 30.58 L39.27 39.27 L30.58 39.89 L24.00 45.60 L17.42 39.89 L8.73 39.27 L8.11 30.58 L2.40 24.00 L8.11 17.42 L8.73 8.73 L17.42 8.11Z" />
        </>
      );
    case 2:
      return (
        <>
          <path d="M24 3.6 42.4 9.6v12.6c0 9.8-7 17.2-18.4 22.2C12.6 39.4 5.6 32 5.6 22.2V9.6z" />
          <path d="M24 3.6v6M18.4 5.6v4.2M29.6 5.6v4.2" opacity="0.7" strokeWidth="1.2" />
        </>
      );
    case 1:
      return (
        <>
          <circle cx="24" cy="24" r="20.2" />
          <circle cx="24" cy="4" r="1.9" fill="#f5a86b" stroke="none" />
          <circle cx="24" cy="44" r="1.9" fill="#f5a86b" stroke="none" />
          <circle cx="4" cy="24" r="1.9" fill="#f5a86b" stroke="none" />
          <circle cx="44" cy="24" r="1.9" fill="#f5a86b" stroke="none" />
        </>
      );
    default:
      return <circle cx="24" cy="24" r="20" strokeDasharray="3.4 4.4" />;
  }
}

/* Title banners ---------------------------------------------------- */
function TitleFrame({ tier }: { tier: WearableTier }) {
  switch (tier) {
    case 5:
      return (
        <>
          <path d="M6.4 10.4h35.2l-4.6 13.6 4.6 13.6H6.4l4.6-13.6z" />
          <ellipse cx="24" cy="24" rx="22.4" ry="6" transform="rotate(-12 24 24)" strokeDasharray="3 3.4" opacity="0.55" />
          <circle cx="42.8" cy="7.4" r="1.4" fill="#f0abfc" stroke="none" />
          <circle cx="5.2" cy="40.6" r="1.4" fill="#22d3ee" stroke="none" />
        </>
      );
    case 4:
      return (
        <>
          <path d="M24.00 2.00 L43.05 13.00 L43.05 35.00 L24.00 46.00 L4.95 35.00 L4.95 13.00Z" />
          <path d="M24 3.5 6.6 14M24 44.5 6.6 34" opacity="0.5" strokeWidth="1.2" />
        </>
      );
    case 3:
      return (
        <>
          <path d="M4.4 10.6h39.2v17.6l-9.8 7.2-9.8-7.2-9.8 7.2-9.8-7.2z" />
          <path d="M4.4 10.6h39.2" opacity="0.6" strokeWidth="2.6" />
        </>
      );
    case 2:
      return (
        <>
          <path d="M3.6 10.6h40.8l-6 13.4 6 13.4H3.6l6-13.4z" />
          <path d="M9.6 10.6 15.6 24 9.6 37.4" opacity="0.6" strokeWidth="1.2" />
        </>
      );
    case 1:
      return (
        <>
          <path d="M4 10.6h40v26.8H4z" />
          <circle cx="4" cy="10.6" r="2.2" fill="#f5a86b" stroke="none" />
          <circle cx="44" cy="10.6" r="2.2" fill="#f5a86b" stroke="none" />
          <circle cx="4" cy="37.4" r="2.2" fill="#f5a86b" stroke="none" />
          <circle cx="44" cy="37.4" r="2.2" fill="#f5a86b" stroke="none" />
        </>
      );
    default:
      return <path d="M9 10.6h30l5 5v16.8l-5 5H9l-5-5V15.6z" strokeDasharray="3.2 3.6" />;
  }
}

/* Avatar rings ----------------------------------------------------- */
function AvatarFrame({ tier }: { tier: WearableTier }) {
  switch (tier) {
    case 5:
      return (
        <>
          <circle cx="24" cy="24" r="19.8" strokeDasharray="27 8" strokeWidth="2.6" />
          <ellipse cx="24" cy="24" rx="21.6" ry="6.4" transform="rotate(-30 24 24)" strokeDasharray="3 3.6" opacity="0.7" />
          <ellipse cx="24" cy="24" rx="21.6" ry="6.4" transform="rotate(34 24 24)" strokeDasharray="2 4" opacity="0.45" />
          <circle cx="43.6" cy="8.6" r="1.4" fill="#f0abfc" stroke="none" />
          <circle cx="4.6" cy="37.4" r="1.2" fill="#22d3ee" stroke="none" />
        </>
      );
    case 4:
      return (
        <>
          <path d="M32.42 3.67 L44.33 15.58 L44.33 32.42 L32.42 44.33 L15.58 44.33 L3.67 32.42 L3.67 15.58 L15.58 3.67Z" />
          <path d="M32.4 3.7 24 10.4 15.6 3.7M44.3 15.6 37.6 24l6.7 8.4M32.4 44.3 24 37.6 15.6 44.3M3.7 32.4 10.4 24 3.7 15.6" opacity="0.65" strokeWidth="1.2" />
        </>
      );
    case 3:
      return (
        <>
          <circle cx="24" cy="24" r="18.8" />
          <path d="M24 1.6v4.6M24 41.8v4.6M1.6 24h4.6M41.8 24h4.6M8.4 8.4l3.2 3.2M36.4 36.4l3.2 3.2M39.6 8.4l-3.2 3.2M11.6 36.4l-3.2 3.2" opacity="0.9" />
        </>
      );
    case 2:
      return (
        <>
          <circle cx="24" cy="24" r="20.2" />
          <circle cx="24" cy="24" r="17.2" opacity="0.55" strokeWidth="1.2" />
        </>
      );
    case 1:
      return (
        <>
          <circle cx="24" cy="24" r="19.6" />
          <circle cx="6.8" cy="6.8" r="2" fill="#f5a86b" stroke="none" />
          <circle cx="41.2" cy="6.8" r="2" fill="#f5a86b" stroke="none" />
          <circle cx="6.8" cy="41.2" r="2" fill="#f5a86b" stroke="none" />
          <circle cx="41.2" cy="41.2" r="2" fill="#f5a86b" stroke="none" />
        </>
      );
    default:
      return <circle cx="24" cy="24" r="19.4" strokeDasharray="3.4 4.6" />;
  }
}

/**
 * One wearable: family shell + content glyph, both drawn on the same
 * 48×48 plate. `glyph` may be an unknown key — it falls back to the
 * compass so a missing mapping never renders an empty hole.
 */
export function WearableEmblem({
  family,
  tier,
  glyph,
  className = '',
  strokeWidth = 1.9,
  egg,
}: {
  family: Family;
  tier: number;
  glyph?: string;
  className?: string;
  strokeWidth?: number;
  egg?: string;
}) {
  const t = Math.max(0, Math.min(5, Math.round(tier))) as WearableTier;
  const palette = TIER_COLORS[t];
  const def = GLYPHS[glyph || ''] ?? GLYPHS.compass;
  const Frame = family === 'badge' ? BadgeFrame : family === 'title' ? TitleFrame : AvatarFrame;

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ color: palette.edge, overflow: 'visible' }}
    >
      <g stroke={palette.edge} strokeWidth={t >= 4 ? strokeWidth + 0.2 : strokeWidth}>
        <Frame tier={t} />
      </g>
      <g transform={GLYPH_TRANSFORM[family]} stroke={palette.glyph} strokeWidth={1.7} fill="none">
        {def.f?.map((d, i) => (
          <path key={`f${i}`} d={d} fill={palette.edge} fillOpacity={0.28} stroke="none" />
        ))}
        {def.s?.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
      </g>
      {egg ? (
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fontSize="20"
          fill={palette.glyph}
          stroke="none"
          fontWeight="700"
        >
          {egg}
        </text>
      ) : null}
    </svg>
  );
}

/** Frame only — used for tier filter chips and legends. */
export function TierMark({ tier, className = '' }: { tier: number; className?: string }) {
  const t = Math.max(0, Math.min(5, Math.round(tier))) as WearableTier;
  const palette = TIER_COLORS[t];
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke={palette.edge}
      strokeWidth={t >= 4 ? 2.4 : 2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <BadgeFrame tier={t} />
    </svg>
  );
}

/**
 * Small, safe mapping for legacy emoji that may still live in old
 * localStorage saves or in callbacks fired from `useStore`.
 */
const LEGACY_EMOJI_GLYPH: Record<string, string> = {
  '🌌': 'galaxy', '🔱': 'trident', '🪐': 'planet', '☀️': 'sun', '🔮': 'oracle',
  '🌠': 'starfall', '👁️': 'eye', '🪽': 'wings', '🛸': 'ufo', '♾️': 'infinity',
  '💎': 'gem', '👑': 'crown', '⚡': 'bolt', '🌟': 'star8', '🏛️': 'temple',
  '🦚': 'phoenix', '🐉': 'dragon', '🗡️': 'saber', '⛈️': 'storm', '🧿': 'amulet',
  '☄️': 'comet', '✨': 'sparkle', '🏆': 'trophy', '🎓': 'gradcap', '🦁': 'lion',
  '🔥': 'flame', '🧠': 'brain', '🏰': 'castle', '🐆': 'leopard', '🌋': 'volcano',
  '⚔️': 'swords', '🦅': 'eagle', '🎯': 'target', '🛡️': 'shield', '🌊': 'wave',
  '🐎': 'horse', '🐺': 'wolf', '🏹': 'bow', '⚓': 'anchor', '🐴': 'horse',
  '💧': 'droplet', '🗺️': 'map', '🧭': 'compass', '🎒': 'backpack', '⛺': 'tent',
  '🌲': 'tree', '⛰️': 'mountain', '🛶': 'canoe', '🔭': 'binocular', '🌄': 'sunrise',
  '🎈': 'balloon', '🐣': 'chick', '🌱': 'sprout', '📍': 'pin', '🚶': 'walker',
  '🫖': 'teacup', '🍀': 'clover', '🙈': 'blindfold', '🇹🇷': 'flag', '🌉': 'bridge',
  '🌾': 'wheat', '🚪': 'gate', '🏖️': 'coast', '🤖': 'robot', '🚀': 'rocket',
  '🏅': 'medal'
};

export function glyphFromEmoji(emoji?: string): string | undefined {
  if (!emoji) return undefined;
  return LEGACY_EMOJI_GLYPH[emoji];
}
