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
    ? getDuelPrestigeTier(duelWins, duelStreak, unlockedBadges, equippedTitle)
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
      container: 'w-7.5 h-7.5 sm:w-8 sm:h-8 text-xs font-black',
      pin: '-top-1 -right-1 w-4 h-4 text-[9px]',
      titleText: 'text-[10px]'
    },
    md: {
      container: 'w-9 h-9 sm:w-10 sm:h-10 text-sm font-black',
      pin: '-top-1.5 -right-1.5 w-4.5 h-4.5 sm:w-5 sm:h-5 text-[10px] sm:text-[11px]',
      titleText: 'text-[10px] sm:text-[11px]'
    },
    lg: {
      container: 'w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg font-black',
      pin: '-top-2 -right-2 w-5.5 h-5.5 sm:w-6 sm:h-6 text-xs',
      titleText: 'text-xs'
    },
    xl: {
      container: 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl font-black',
      pin: '-top-2.5 -right-2.5 w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm',
      titleText: 'text-xs sm:text-sm'
    }
  }[size];

  const activeTitle = prestige.title || equippedTitle || '3D Coğrafyacı Çırağı';
  const pinClass = themeObj?.badgePinBg || prestige.pinBorderClass;

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`relative inline-flex items-center justify-center rounded-full flex-shrink-0 select-none shadow-md transition-all ${sizeClasses.container} ${borderClass} ${bgClass}`}
        title={`${rumuz} • ${activeTitle} (${prestige.tierLabel} • ${prestige.badgeCount} Rozet, ${duelWins} Zafer)`}
      >
        {/* Tier-Hierarchical Radial Glow Layer (Strictly proportional to tier level: 5 > 4 > 3 > 2 > 1 > 0) */}
        {prestige.tierLevel > 0 && (
          <div
            className={`absolute rounded-full bg-gradient-to-r ${prestige.glowClass} -z-10 transition-all ${
              prestige.tierLevel === 5
                ? '-inset-1.5 opacity-100 blur-[8px] animate-pulse'
                : prestige.tierLevel === 4
                ? '-inset-1 opacity-90 blur-[6px] animate-pulse'
                : prestige.tierLevel === 3
                ? '-inset-0.5 opacity-75 blur-[4px] animate-pulse'
                : prestige.tierLevel === 2
                ? '-inset-0.5 opacity-45 blur-[3px]'
                : '-inset-0.5 opacity-25 blur-[2px]'
            }`}
          />
        )}

        {/* Level 5 Cosmic Mythic Orbital Halo Effect */}
        {prestige.tierLevel === 5 && (
          <>
            <div className="absolute -inset-2 rounded-full border-2 border-fuchsia-400/80 ring-2 ring-cyan-400/70 animate-ping opacity-40 pointer-events-none -z-10" />
            <div className="absolute -inset-1 rounded-full border border-amber-300/60 animate-spin opacity-50 pointer-events-none -z-10" style={{ animationDuration: '6s' }} />
          </>
        )}

        {/* Level 4 Diamond Sparkle Halo */}
        {prestige.tierLevel === 4 && (
          <div className="absolute -inset-1.5 rounded-full border border-cyan-400/60 ring-1 ring-purple-400/50 animate-ping opacity-30 pointer-events-none -z-10" />
        )}

        {/* Center Icon / Initial */}
        <span className={`text-white drop-shadow-md font-black tracking-tight ${isEmojiIcon ? 'scale-110' : ''}`}>
          {displayIcon}
        </span>

        {/* Glorious Top-Right Title / Badge Pin Icon (Strictly hierarchical frame) */}
        {showBadgePin && (
          <div
            className={`absolute ${sizeClasses.pin} rounded-full ${pinClass} flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform z-10`}
            title={`${prestige.pinBadgeName} • ${activeTitle} (${prestige.tierLabel})`}
          >
            <span className="leading-none">{prestige.pinIcon}</span>
          </div>
        )}
      </div>

      {showTitleBadge && (
        <span className={`truncate max-w-[130px] text-center px-1.5 py-0.5 rounded shadow-sm transition-all ${prestige.titleBadgeClass} ${sizeClasses.titleText}`}>
          {activeTitle}
        </span>
      )}
    </div>
  );
}
