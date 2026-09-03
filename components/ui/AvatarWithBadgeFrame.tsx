'use client';

import React from 'react';
import { getPrestigeTier, getDuelPrestigeTier, getAvatarOutlineFilter } from '@/lib/data/badgesData';

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

  // Transparent object sticker outline filter (No rectangular or circular box)
  const activeOutlineFilter = getAvatarOutlineFilter(avatarBg, prestige.tierLevel);

  const sizeClasses = {
    xs: {
      container: 'w-5 h-5',
      avatarText: 'text-xs',
      emojiScale: 'scale-100',
      pin: '-top-1 -right-1 text-[8px]',
      titleText: 'text-[9px]'
    },
    sm: {
      container: 'w-7 h-7 sm:w-8 sm:h-8',
      avatarText: 'text-base sm:text-lg',
      emojiScale: 'scale-105',
      pin: '-top-1 -right-1 text-[10px]',
      titleText: 'text-[10px]'
    },
    md: {
      container: 'w-10 h-10',
      avatarText: 'text-xl sm:text-2xl',
      emojiScale: 'scale-105',
      pin: '-top-1.5 -right-1.5 text-xs',
      titleText: 'text-[10px] sm:text-[11px]'
    },
    lg: {
      container: 'w-13 h-13 sm:w-14 sm:h-14',
      avatarText: 'text-2xl sm:text-3xl',
      emojiScale: 'scale-110',
      pin: '-top-1.5 -right-1.5 text-sm',
      titleText: 'text-xs'
    },
    xl: {
      container: 'w-16 h-16 sm:w-20 sm:h-20',
      avatarText: 'text-4xl sm:text-5xl',
      emojiScale: 'scale-115',
      pin: '-top-2 -right-2 text-base',
      titleText: 'text-xs sm:text-sm'
    }
  }[size];

  const activeTitle = prestige.title || equippedTitle || '3D Coğrafyacı Çırağı';

  const tierScaleClass = prestige.tierLevel === 5
    ? 'scale-110'
    : prestige.tierLevel === 4
    ? 'scale-105'
    : prestige.tierLevel === 3
    ? 'scale-100'
    : prestige.tierLevel === 2
    ? 'scale-[0.96]'
    : prestige.tierLevel === 1
    ? 'scale-[0.92]'
    : 'scale-[0.88] opacity-90';

  return (
    <div className={`inline-flex flex-col items-center justify-center p-0.5 ${className}`}>
      {/* 
        SADECE OBJE & TRANSPARAN ARKAPLAN (Kutulanma/Dörtgen/Daire Çerçeve Yok)
        Kademeye göre zarif ölçeklenen, dış hatları net outline çizgili transparan obje
      */}
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none bg-transparent transition-transform duration-200 ${sizeClasses.container} ${tierScaleClass}`}
        title={`${rumuz} • ${activeTitle} (${prestige.tierLabel} • ${prestige.badgeCount} Rozet, ${duelWins} Zafer)`}
      >
        {/* Merkez Obje / Avatar İkonu (Transparan, Kenarlarını Zengin Saran Outline Çizgili) */}
        <span
          className={`leading-none flex items-center justify-center select-none font-black tracking-tight transition-all ${sizeClasses.avatarText} ${isEmojiIcon ? sizeClasses.emojiScale : 'text-white'}`}
          style={{
            filter: activeOutlineFilter,
            WebkitTextStroke: isEmojiIcon ? undefined : '1px #ffffff'
          }}
        >
          {displayIcon}
        </span>

        {/* Sağ Üst Başlık / Rozet İğnesi (Transparan Sticker Tarzı İnce Beyaz Outline Çizgili) */}
        {showBadgePin && (
          <span
            className={`absolute ${sizeClasses.pin} flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform z-10 leading-none select-none`}
            style={{
              filter: 'drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff) drop-shadow(0 1px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(0 0 2px rgba(0,0,0,0.8))'
            }}
            title={`${prestige.pinBadgeName} • ${activeTitle} (${prestige.tierLabel})`}
          >
            {prestige.pinIcon}
          </span>
        )}
      </div>

      {showTitleBadge && (
        <span className={`truncate max-w-[130px] text-center px-1.5 py-0.5 rounded shadow-sm transition-all mt-0.5 ${prestige.titleBadgeClass} ${sizeClasses.titleText}`}>
          {activeTitle}
        </span>
      )}
    </div>
  );
}
