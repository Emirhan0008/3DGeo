'use client';

import React, { useState, useEffect } from 'react';
import { getPrestigeTier, getDuelPrestigeTier, getAvatarOutlineFilter, ALL_TITLES, AVATAR_ICONS } from '@/lib/data/badgesData';
import { getCachedUserMedalInfo, subscribeToLeaderboardMedals } from '@/lib/rumuzService';
import { WearableEmblem, glyphFromEmoji } from '@/components/ui/wearables/WearableEmblem';
import { AVATAR_GLYPHS, TITLE_GLYPHS, glyphFromAvatarToken } from '@/lib/data/wearableGlyphs';

interface AvatarWithBadgeFrameProps {
  rumuz: string;
  nick?: string;
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
  rank?: number;
  isRecordStreakHolder?: boolean;
  specialMedal?: 'gold' | 'silver' | 'bronze' | 'record' | null;
}

export default function AvatarWithBadgeFrame({
  rumuz,
  nick,
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
  className = '',
  rank: explicitRank,
  isRecordStreakHolder: explicitIsRecord,
  specialMedal: explicitSpecialMedal
}: AvatarWithBadgeFrameProps) {
  const activeName = nick || rumuz || '';

  // Auto-resolve medals from leaderboard cache if not explicitly passed
  const [cachedMedals, setCachedMedals] = useState(() => getCachedUserMedalInfo(activeName));

  useEffect(() => {
    setCachedMedals(getCachedUserMedalInfo(activeName));
    const unsubscribe = subscribeToLeaderboardMedals(() => {
      setCachedMedals(getCachedUserMedalInfo(activeName));
    });
    return () => unsubscribe();
  }, [activeName]);

  const resolvedRank = explicitRank !== undefined ? explicitRank : cachedMedals.rank;
  const resolvedIsRecord = explicitIsRecord !== undefined ? explicitIsRecord : cachedMedals.isRecordStreakHolder;
  const resolvedSpecialMedal = explicitSpecialMedal !== undefined ? explicitSpecialMedal : cachedMedals.specialMedal;

  const prestige = isDuelMode
    ? getDuelPrestigeTier(duelWins, duelStreak, unlockedBadges, equippedTitle)
    : getPrestigeTier(unlockedBadges, duelWins, equippedTitle);

  /* Avatar glyph resolution order:
     1. new token (`g:galaxy`)         — written by ProfileEditModal
     2. legacy emoji matched to AVATAR_ICONS — old localStorage saves
     3. single-letter fallback          — brand-new profiles                */
  const legacyEntry = avatarIcon ? AVATAR_ICONS.find((item) => item.icon === avatarIcon) : undefined;
  const avatarGlyph =
    glyphFromAvatarToken(avatarIcon) ||
    (legacyEntry ? AVATAR_GLYPHS[legacyEntry.id] : glyphFromEmoji(avatarIcon));

  const activeTitle = prestige.title || equippedTitle || '3D Coğrafyacı Çırağı';
  const titleEntry = ALL_TITLES.find((t) => t.name === activeTitle || t.name === equippedTitle);
  const pinGlyph = titleEntry ? TITLE_GLYPHS[titleEntry.id] : 'laurel';

  // Transparent object sticker outline filter (No rectangular or circular box)
  const activeOutlineFilter = getAvatarOutlineFilter(avatarBg, prestige.tierLevel);

  const sizeClasses = {
    xs: {
      container: 'w-5 h-5',
      avatarText: 'text-xs',
      pin: '-top-1 -right-1',
      pinBox: 'w-2.5 h-2.5',
      medalContainer: '-bottom-1.5 -left-1',
      medalBox: 'w-2.5 h-2.5',
      titleText: 'text-[9px]'
    },
    sm: {
      container: 'w-7 h-7 sm:w-8 sm:h-8',
      avatarText: 'text-base sm:text-lg',
      pin: '-top-1 -right-1',
      pinBox: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
      medalContainer: '-bottom-1.5 -left-1.5',
      medalBox: 'w-3 h-3',
      titleText: 'text-[10px]'
    },
    md: {
      container: 'w-10 h-10',
      avatarText: 'text-xl sm:text-2xl',
      pin: '-top-1.5 -right-1.5',
      pinBox: 'w-4 h-4',
      medalContainer: '-bottom-2 -left-1.5',
      medalBox: 'w-3.5 h-3.5',
      titleText: 'text-[10px] sm:text-[11px]'
    },
    lg: {
      container: 'w-13 h-13 sm:w-14 sm:h-14',
      avatarText: 'text-2xl sm:text-3xl',
      pin: '-top-1.5 -right-1.5',
      pinBox: 'w-5 h-5',
      medalContainer: '-bottom-2.5 -left-2',
      medalBox: 'w-4 h-4',
      titleText: 'text-xs'
    },
    xl: {
      container: 'w-16 h-16 sm:w-20 sm:h-20',
      avatarText: 'text-4xl sm:text-5xl',
      pin: '-top-2 -right-2',
      pinBox: 'w-6 h-6 sm:w-7 sm:h-7',
      medalContainer: '-bottom-3 -left-2',
      medalBox: 'w-5 h-5',
      titleText: 'text-xs sm:text-sm'
    }
  }[size];

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
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 select-none bg-transparent transition-transform duration-200 ${sizeClasses.container} ${tierScaleClass}`}
        title={`${rumuz} • ${activeTitle} (${prestige.tierLabel} • ${prestige.badgeCount} Rozet, ${duelWins} Zafer)`}
      >
        {/* Avatar ring (family: avatar) + content glyph. The ring is what
            separates an avatar from a badge medallion or a title banner. */}
        {avatarGlyph ? (
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ filter: activeOutlineFilter }}
          >
            <WearableEmblem
              family="avatar"
              tier={prestige.tierLevel}
              glyph={avatarGlyph}
              className="h-full w-full"
            />
          </span>
        ) : (
          <span
            className={`leading-none flex items-center justify-center select-none font-black tracking-tight transition-all ${sizeClasses.avatarText} text-white`}
            style={{
              filter: activeOutlineFilter,
              WebkitTextStroke: '1px #ffffff'
            }}
          >
            {(activeName?.trim()?.[0] || 'K').toUpperCase()}
          </span>
        )}

        {/* Equipped-title pin: badge medallion of the title's concept */}
        {showBadgePin && (
          <span
            className={`absolute ${sizeClasses.pin} ${sizeClasses.pinBox} flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform z-10`}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85)) drop-shadow(0 0 3px rgba(0,0,0,0.6))'
            }}
            title={`${prestige.pinBadgeName} • ${activeTitle} (${prestige.tierLabel})`}
          >
            <WearableEmblem
              family="badge"
              tier={prestige.tierLevel}
              glyph={pinGlyph}
              className="h-full w-full"
              strokeWidth={2.2}
            />
          </span>
        )}

        {/* Placement / record medals keep their own frame so they never
            blend into the avatar ring. */}
        {(() => {
          const medals: Array<{ id: string; tier: number; glyph: string; title: string }> = [];
          if (resolvedSpecialMedal === 'gold' || resolvedRank === 1) {
            medals.push({ id: 'gold', tier: 3, glyph: 'medal', title: '1.lik — Global Lider (Altın)' });
          } else if (resolvedSpecialMedal === 'silver' || resolvedRank === 2) {
            medals.push({ id: 'silver', tier: 2, glyph: 'medal', title: '2.lik — Global Gümüş' });
          } else if (resolvedSpecialMedal === 'bronze' || resolvedRank === 3) {
            medals.push({ id: 'bronze', tier: 1, glyph: 'medal', title: '3.lük — Global Bronz' });
          }
          if (resolvedIsRecord || resolvedSpecialMedal === 'record') {
            medals.push({ id: 'record', tier: 4, glyph: 'bolt', title: 'Zafer serisi rekoru sahibi' });
          }
          if (medals.length === 0) return null;
          return (
            <div className={`absolute ${sizeClasses.medalContainer} flex items-center gap-0.5 cursor-pointer z-10`}>
              {medals.map((m) => (
                <span key={m.id} className={`${sizeClasses.medalBox} transform hover:scale-125 transition-transform`} title={m.title}>
                  <WearableEmblem family="badge" tier={m.tier} glyph={m.glyph} className="h-full w-full" strokeWidth={2.4} />
                </span>
              ))}
            </div>
          );
        })()}
      </div>

      {showTitleBadge && (
        <span className={`truncate max-w-[130px] text-center px-1.5 py-0.5 rounded shadow-sm transition-all mt-0.5 ${prestige.titleBadgeClass} ${sizeClasses.titleText}`}>
          {activeTitle}
        </span>
      )}
    </div>
  );
}
