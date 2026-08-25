'use client';

import React from 'react';
import { getPrestigeTier } from '@/lib/data/badgesData';

interface AvatarWithBadgeFrameProps {
  rumuz: string;
  unlockedBadges?: string[];
  duelWins?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadgePin?: boolean;
  className?: string;
}

export default function AvatarWithBadgeFrame({
  rumuz,
  unlockedBadges = [],
  duelWins = 0,
  size = 'md',
  showBadgePin = true,
  className = ''
}: AvatarWithBadgeFrameProps) {
  const prestige = getPrestigeTier(unlockedBadges, duelWins);
  const initial = (rumuz?.trim()?.[0] || 'K').toUpperCase();

  const sizeClasses = {
    sm: {
      container: 'w-7 h-7 text-xs',
      pin: '-top-1 -right-1 w-3.5 h-3.5 text-[8px]'
    },
    md: {
      container: 'w-10 h-10 text-sm font-black',
      pin: '-top-1.5 -right-1.5 w-5 h-5 text-[10px]'
    },
    lg: {
      container: 'w-14 h-14 text-lg font-black',
      pin: '-top-2 -right-2 w-6 h-6 text-xs'
    },
    xl: {
      container: 'w-20 h-20 text-2xl font-black',
      pin: '-top-2.5 -right-2.5 w-7 h-7 text-sm'
    }
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full flex-shrink-0 select-none ${sizeClasses.container} ${prestige.frameBorderClass} ${prestige.gradientBg} ${className}`}
      title={`${rumuz} (${prestige.title} - ${prestige.badgeCount} Rozet, ${duelWins} Düello Zaferi)`}
    >
      {/* Background radial glow */}
      {prestige.tier !== 'starter' && (
        <div
          className={`absolute -inset-0.5 rounded-full bg-gradient-to-r ${prestige.glowClass} opacity-40 blur-xs -z-10`}
        />
      )}

      {/* Center Initials */}
      <span className="text-white drop-shadow-sm font-extrabold tracking-tight">
        {initial}
      </span>

      {/* Glorious Edge Badge Pin */}
      {showBadgePin && (
        <div
          className={`absolute ${sizeClasses.pin} rounded-full bg-slate-900 border border-amber-400/80 shadow-md flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform z-10`}
          title={`${prestige.pinBadgeName} (${prestige.title})`}
        >
          <span>{prestige.pinIcon}</span>
        </div>
      )}
    </div>
  );
}
