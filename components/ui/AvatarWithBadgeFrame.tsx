'use client';

import React from 'react';
import { getPrestigeTier, getDuelPrestigeTier, AVATAR_THEMES } from '@/lib/data/badgesData';

interface AvatarWithBadgeFrameProps {
  rumuz: string;
  unlockedBadges?: string[];
  duelWins?: number;
  duelStreak?: number;
  isDuelMode?: boolean;
  avatarIcon?: string;
  avatarBg?: string;
  equippedTitle?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadgePin?: boolean;
  showTitleBadge?: boolean;
  className?: string;
}

export default function AvatarWithBadgeFrame({
  rumuz,
  unlockedBadges = [],
  duelWins = 0,
  duelStreak = 0,
  isDuelMode = false,
  avatarIcon,
  avatarBg,
  equippedTitle,
  size = 'md',
  showBadgePin = true,
  showTitleBadge = false,
  className = ''
}: AvatarWithBadgeFrameProps) {
  const prestige = isDuelMode 
    ? getDuelPrestigeTier(duelWins, duelStreak, unlockedBadges)
    : getPrestigeTier(unlockedBadges, duelWins, equippedTitle);

  const displayIcon = avatarIcon || (rumuz?.trim()?.[0] || 'K').toUpperCase();
  const isEmojiIcon = avatarIcon && avatarIcon.length > 0;

  // Custom or theme background
  const themeObj = AVATAR_THEMES.find(t => t.id === avatarBg);
  const bgClass = themeObj?.bgGradient || prestige.gradientBg;
  const borderClass = themeObj?.borderGlow || prestige.frameBorderClass;

  const sizeClasses = {
    xs: {
      container: 'w-6 h-6 text-[10px]',
      pin: '-top-1 -right-1 w-3.5 h-3.5 text-[8px]',
      titleText: 'text-[9px]'
    },
    sm: {
      container: 'w-8 h-8 text-xs font-black',
      pin: '-top-1 -right-1 w-4 h-4 text-[9px]',
      titleText: 'text-[10px]'
    },
    md: {
      container: 'w-10 h-10 text-sm font-black',
      pin: '-top-1.5 -right-1.5 w-5 h-5 text-[11px]',
      titleText: 'text-[11px]'
    },
    lg: {
      container: 'w-14 h-14 text-lg font-black',
      pin: '-top-2 -right-2 w-6 h-6 text-xs',
      titleText: 'text-xs'
    },
    xl: {
      container: 'w-20 h-20 text-2xl font-black',
      pin: '-top-2.5 -right-2.5 w-8 h-8 text-sm',
      titleText: 'text-sm'
    }
  }[size];

  const activeTitle = prestige.title || equippedTitle || '3D Coğrafyacı Çırağı';

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`relative inline-flex items-center justify-center rounded-full flex-shrink-0 select-none shadow-lg ${sizeClasses.container} ${borderClass} ${bgClass}`}
        title={`${rumuz} • ${activeTitle} (${prestige.badgeCount} Rozet, ${duelWins} Zafer)`}
      >
        {/* Background radial glow */}
        {prestige.tier !== 'starter' && (
          <div
            className={`absolute -inset-0.5 rounded-full bg-gradient-to-r ${prestige.glowClass} opacity-60 blur-[2px] -z-10 animate-pulse`}
          />
        )}

        {/* Center Icon / Initial */}
        <span className={`text-white drop-shadow-md font-black tracking-tight ${isEmojiIcon ? 'scale-110' : ''}`}>
          {displayIcon}
        </span>

        {/* Glorious Top-Right Title / Badge Pin Icon */}
        {showBadgePin && (
          <div
            className={`absolute ${sizeClasses.pin} rounded-full bg-slate-950 border-2 border-amber-400 shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform z-10`}
            title={`${prestige.pinBadgeName} • ${activeTitle}`}
          >
            <span className="leading-none">{prestige.pinIcon}</span>
          </div>
        )}
      </div>

      {showTitleBadge && (
        <span className={`font-extrabold text-amber-300 truncate max-w-[120px] text-center px-1.5 py-0.5 rounded bg-black/70 border border-amber-400/40 shadow-sm ${sizeClasses.titleText}`}>
          {activeTitle}
        </span>
      )}
    </div>
  );
}
