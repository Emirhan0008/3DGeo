'use client';

import React from 'react';
import { levelFromXp, nextRank, xpForLevel, MAX_LEVEL } from '@/lib/data/rankSystem';

/* ==================================================================
   Rank chip + XP bar.

   Two components, one visual language:
   - <RankChip>   compact level badge for the navbar / profile button
   - <RankBar>    the full progress readout for the stats panel

   The bar is the thing that makes the climb feel real: it always shows
   concrete numbers ("240 / 530 XP") next to the abstract fill, because
   a bare progress bar reads as decoration after the first day.
   ================================================================== */

type Sizes = 'sm' | 'md';

export function RankChip({
  totalXp,
  size = 'sm',
  showXp = false,
}: {
  totalXp: number;
  size?: Sizes;
  showXp?: boolean;
}) {
  const info = levelFromXp(totalXp);
  const dims =
    size === 'sm'
      ? { box: 'h-6 w-6', num: 'text-[10px]', label: 'text-[9px]' }
      : { box: 'h-9 w-9', num: 'text-sm', label: 'text-[10px]' };

  return (
    <div className="flex items-center gap-2" title={`${info.rank.name} · Seviye ${info.level}`}>
      <div
        className={`relative grid ${dims.box} shrink-0 place-items-center rounded-full border font-bold`}
        style={{
          borderColor: `${info.rank.accent}99`,
          backgroundColor: `${info.rank.accent}1f`,
          color: info.rank.accent,
        }}
      >
        <span className={`hf-serif ${dims.num} leading-none`}>{info.level}</span>
        {/* progress ring — a thin arc, cheap and legible */}
        <svg
          viewBox="0 0 36 36"
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="18"
            r="16.5"
            fill="none"
            stroke={info.rank.accent}
            strokeOpacity="0.9"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray={`${(info.progressPct / 100) * 103.7} 103.7`}
          />
        </svg>
      </div>

      <div className="leading-tight">
        <div className={`hf-serif ${dims.label} font-semibold`} style={{ color: info.rank.accent }}>
          {info.rank.name}
        </div>
        {showXp && (
          <div className="text-[9px] text-[#a9a894]">
            {info.isMax ? 'Zirve' : `${info.xpIntoLevel}/${info.xpForNext} XP`}
          </div>
        )}
      </div>
    </div>
  );
}

export function RankBar({ totalXp }: { totalXp: number }) {
  const info = levelFromXp(totalXp);
  const upcoming = nextRank(info.level);
  const xpToNextRank = upcoming ? xpForLevel(upcoming.minLevel) - totalXp : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="hf-label text-[9px] text-[#8b8f7f]">Rütbe</div>
          <div
            className="hf-serif text-lg font-semibold leading-tight"
            style={{ color: info.rank.accent }}
          >
            {info.rank.name}
          </div>
          <div className="text-[10px] text-[#a9a894]">{info.rank.blurb}</div>
        </div>

        <div className="text-right">
          <div className="hf-label text-[9px] text-[#8b8f7f]">Seviye</div>
          <div className="hf-serif text-2xl font-semibold leading-none text-[#f5ecd4]">
            {info.level}
            <span className="text-sm text-[#8b8f7f]">/{MAX_LEVEL}</span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div>
        <div className="mb-1 flex items-baseline justify-between text-[10px]">
          <span className="text-[#c9b273]">
            {info.isMax ? 'Maksimum seviye' : `${info.xpIntoLevel} / ${info.xpForNext} XP`}
          </span>
          <span className="text-[#8b8f7f]">
            {info.isMax ? '' : `${info.xpRemaining} XP kaldı`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-black/45 ring-1 ring-inset ring-[#c9a24a]/20">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(info.isMax ? 100 : 2, info.progressPct)}%`,
              backgroundImage: `linear-gradient(90deg, ${info.rank.accent}bb, ${info.rank.accent})`,
            }}
          />
        </div>
      </div>

      {upcoming && (
        <div className="flex items-center justify-between rounded-lg border border-[#c9a24a]/20 bg-[#c9a24a]/6 px-2.5 py-1.5 text-[10px]">
          <span className="text-[#a9a894]">
            Sıradaki rütbe: <span className="font-semibold" style={{ color: upcoming.accent }}>{upcoming.name}</span>
          </span>
          <span className="font-semibold text-[#c9b273]">
            {Math.max(0, xpToNextRank).toLocaleString('tr-TR')} XP
          </span>
        </div>
      )}
    </div>
  );
}
