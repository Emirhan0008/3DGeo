'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { 
  ALL_BADGES, 
  ALL_TITLES, 
  AVATAR_ICONS, 
  AVATAR_THEMES, 
  getPrestigeTier,
  getTitleProgress,
  getTitleTierStyle,
  BadgeTier
} from '@/lib/data/badgesData';
import AvatarWithBadgeFrame from '@/components/ui/AvatarWithBadgeFrame';
import { WearableEmblem, TierMark } from '@/components/ui/wearables/WearableEmblem';
import {
  AVATAR_GLYPHS,
  TITLE_GLYPHS,
  BADGE_GLYPHS,
  TIER_LABELS,
  avatarToken,
  glyphFromAvatarToken
} from '@/lib/data/wearableGlyphs';
import { 
  changeRumuzNickname, 
  updateRumuzCustomization, 
  deleteRumuzProfile
} from '@/lib/rumuzService';
import {
  X,
  User,
  Trash2,
  Crown,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Palette,
  Shield,
  Medal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/** Shared section header: icon + title + one-line role, badge stacks on
 *  mobile so long titles never collide with the tier chip. */
function SectionHeader({
  icon,
  tone,
  title,
  role,
  desc,
  border,
  badge,
}: {
  icon: React.ReactNode;
  tone: 'indigo' | 'purple' | 'amber' | 'cyan' | 'blue';
  title: string;
  role: string;
  desc: string;
  border: string;
  badge?: React.ReactNode;
}) {
  const tones = {
    indigo: { chip: 'bg-indigo-600', title: 'text-indigo-200', accent: 'text-indigo-400/80' },
    purple: { chip: 'bg-purple-600', title: 'text-purple-200', accent: 'text-purple-400/80' },
    amber: { chip: 'bg-amber-600', title: 'text-amber-200', accent: 'text-amber-400/80' },
    cyan: { chip: 'bg-cyan-600', title: 'text-cyan-200', accent: 'text-cyan-400/80' },
    blue: { chip: 'bg-blue-600', title: 'text-blue-200', accent: 'text-blue-400/80' }
  }[tone];

  return (
    <div className={`flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between border-b pb-2 ${border}`}>
      <div className="flex items-start gap-2 min-w-0">
        <div className={`w-6 h-6 mt-0.5 rounded-lg ${tones.chip} text-white flex items-center justify-center shadow-md shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className={`font-black text-sm tracking-wide uppercase ${tones.title}`}>
            {title} <span className={`${tones.accent} font-bold normal-case`}>— {role}</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium leading-snug">{desc}</p>
        </div>
      </div>
      {badge ? <div className="shrink-0 self-start sm:self-auto">{badge}</div> : null}
    </div>
  );
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRumuz: string;
  currentPin?: string;
  onProfileUpdated?: (newRumuz: string, newPin?: string) => void;
  onProfileDeleted?: () => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentRumuz,
  currentPin = '',
  onProfileUpdated,
  onProfileDeleted
}: ProfileEditModalProps) {
  const {
    avatarIcon,
    avatarBg,
    equippedTitle,
    unlockedBadges,
    duelStats,
    botStats,
    score,
    correctAnswersCount,
    categoryMasteryProgress,
    setAvatarIcon,
    setAvatarBg,
    setEquippedTitle,
    clearAllUserData
  } = useAppStore();

  // Calculate cumulative career points across all modes (Duels + KPSS Questions + Pin Games)
  const duelPts = duelStats?.duelScore || (duelStats?.duelWins || 0) * 120;
  const kpssPts = (correctAnswersCount || 0) * 10;
  const sessionScore = score || 0;
  const totalCareerScore = Math.max(sessionScore, duelPts + kpssPts + sessionScore);

  const [newRumuzInput, setNewRumuzInput] = useState(currentRumuz);
  const [pinInput, setPinInput] = useState(currentPin);
  const [newPinInput, setNewPinInput] = useState('');
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [deleteConfirmPin, setDeleteConfirmPin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  // Smart Highest Unlocked Tier Detection (Default views load user's highest reached tier)
  const userHighestAvatarTier = React.useMemo<'all' | 'mythic' | 'diamond' | 'gold' | 'silver' | 'bronze' | 'starter'>(() => {
    for (const t of ['mythic', 'diamond', 'gold', 'silver', 'bronze'] as const) {
      const hasUnlocked = AVATAR_ICONS.some((item) => {
        if (item.tier !== t) return false;
        const isBadgesMet = !item.minBadgesRequired || unlockedBadges.length >= item.minBadgesRequired;
        const isDuelMet = !item.minDuelWinsRequired || duelStats.duelWins >= item.minDuelWinsRequired;
        const isScoreMet = !item.minScoreRequired || totalCareerScore >= item.minScoreRequired;
        return isBadgesMet && isDuelMet && isScoreMet;
      });
      if (hasUnlocked) return t;
    }
    return 'starter';
  }, [unlockedBadges.length, duelStats.duelWins, totalCareerScore]);

  const userHighestTitleTier = React.useMemo<'all' | 'mythic' | 'diamond' | 'gold' | 'silver' | 'bronze'>(() => {
    for (const t of ['mythic', 'diamond', 'gold', 'silver', 'bronze'] as const) {
      const hasUnlocked = ALL_TITLES.some((item) => {
        if (item.tier !== t) return false;
        const prog = getTitleProgress(item, unlockedBadges, duelStats?.duelWins || 0, score || 0, categoryMasteryProgress, botStats?.botWins || 0);
        return prog.isUnlocked;
      });
      if (hasUnlocked) return t;
    }
    return 'bronze';
  }, [unlockedBadges, duelStats?.duelWins, score, categoryMasteryProgress, botStats?.botWins]);

  const userHighestBadgeTier = React.useMemo<'all' | 'mythic' | 'diamond' | 'gold' | 'silver' | 'bronze'>(() => {
    for (const t of ['mythic', 'diamond', 'gold', 'silver', 'bronze'] as const) {
      const hasUnlocked = ALL_BADGES.some((b) => b.tier === t && unlockedBadges.includes(b.name));
      if (hasUnlocked) return t;
    }
    return 'bronze';
  }, [unlockedBadges]);

  const [avatarTierFilter, setAvatarTierFilter] = useState<'all' | 'mythic' | 'diamond' | 'gold' | 'silver' | 'bronze' | 'starter'>(userHighestAvatarTier);
  const [titleTierFilter, setTitleTierFilter] = useState<'all' | 'mythic' | 'diamond' | 'gold' | 'silver' | 'bronze'>(userHighestTitleTier);
  const [badgeTierFilter, setBadgeTierFilter] = useState<'all' | 'mythic' | 'diamond' | 'gold' | 'silver' | 'bronze'>(userHighestBadgeTier);

  // Sync default tier when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAvatarTierFilter(userHighestAvatarTier);
      setTitleTierFilter(userHighestTitleTier);
      setBadgeTierFilter(userHighestBadgeTier);
    }
  }, [isOpen, userHighestAvatarTier, userHighestTitleTier, userHighestBadgeTier]);
  const [inspectedItem, setInspectedItem] = useState<{
    type: 'avatar' | 'title' | 'badge';
    title: string;
    glyph?: string;
    tier: string;
    tierLevel: number;
    isUnlocked: boolean;
    reqDescription: string;
    howToUnlock: string;
    currentProgress?: string;
  } | null>(null);

  if (!isOpen) return null;

  const prestige = getPrestigeTier(unlockedBadges, duelStats.duelWins, equippedTitle);
  const prestigeTitleGlyph =
    TITLE_GLYPHS[ALL_TITLES.find((t) => t.name === prestige.title)?.id || ''] || 'laurel';
  const currentAvatarGlyph =
    glyphFromAvatarToken(avatarIcon) ||
    AVATAR_GLYPHS[AVATAR_ICONS.find((i) => i.icon === avatarIcon)?.id || ''] ||
    'compass';

  // Filter badges by tier
  const tierBadges = {
    mythic: ALL_BADGES.filter(b => b.tier === 'mythic'),
    diamond: ALL_BADGES.filter(b => b.tier === 'diamond'),
    gold: ALL_BADGES.filter(b => b.tier === 'gold'),
    silver: ALL_BADGES.filter(b => b.tier === 'silver'),
    bronze: ALL_BADGES.filter(b => b.tier === 'bronze')
  };

  // Handle Nickname or PIN update
  const handleSaveProfileInfo = async () => {
    setStatusMsg(null);
    setIsSaving(true);

    try {
      const trimmedNewRumuz = newRumuzInput.trim();
      const activePin = pinInput.trim() || currentPin.trim();
      const updatedPin = newPinInput.trim();

      if (!activePin) {
        setStatusMsg({ type: 'error', text: 'Değişiklikleri kaydetmek için lütfen mevcut PIN şifrenizi girin.' });
        setIsSaving(false);
        return;
      }

      if (trimmedNewRumuz && trimmedNewRumuz !== currentRumuz) {
        const renameRes = await changeRumuzNickname(currentRumuz, trimmedNewRumuz, activePin, updatedPin || undefined);
        if (!renameRes.success) {
          setStatusMsg({ type: 'error', text: renameRes.errorMsg || 'Rumuz değiştirilemedi.' });
          setIsSaving(false);
          return;
        }

        const effectivePin = updatedPin || activePin;
        if (typeof window !== 'undefined') {
          localStorage.setItem('kpss3d_active_rumuz', trimmedNewRumuz);
          localStorage.setItem('kpss3d_active_pin', effectivePin);
        }

        if (onProfileUpdated) {
          onProfileUpdated(trimmedNewRumuz, effectivePin);
        }

        setStatusMsg({ type: 'success', text: `✓ Rumuzunuz ve şifreniz '${trimmedNewRumuz}' olarak tek hesap altında güncellendi!` });
        setNewPinInput('');
        setIsSaving(false);
        return;
      }

      if (updatedPin) {
        const pinRes = await updateRumuzCustomization(currentRumuz, activePin, { pin: updatedPin });
        if (!pinRes.success) {
          setStatusMsg({ type: 'error', text: pinRes.errorMsg || 'PIN güncellenemedi.' });
          setIsSaving(false);
          return;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('kpss3d_active_pin', updatedPin);
        }
        if (onProfileUpdated) {
          onProfileUpdated(currentRumuz, updatedPin);
        }
        setStatusMsg({ type: 'success', text: '✓ PIN güvenlik şifreniz güncellendi!' });
        setNewPinInput('');
      } else {
        setStatusMsg({ type: 'success', text: '✓ Profil bilgileriniz bulutta güncel.' });
      }
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      const message = err instanceof Error ? err.message : 'Kaydetme sırasında bir hata oluştu.';
      setStatusMsg({ type: 'error', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  // Instant Select Avatar Icon
  const handleSelectAvatarIcon = (icon: string) => {
    setAvatarIcon(icon);
    if (currentRumuz && (currentPin || pinInput)) {
      updateRumuzCustomization(currentRumuz, currentPin || pinInput, { avatarIcon: icon }).catch(() => {});
    }
  };

  // Instant Select Avatar Background Theme
  const handleSelectAvatarBg = (themeId: string) => {
    setAvatarBg(themeId);
    if (currentRumuz && (currentPin || pinInput)) {
      updateRumuzCustomization(currentRumuz, currentPin || pinInput, { avatarBg: themeId }).catch(() => {});
    }
  };

  // Instant Equip Title
  const handleEquipTitle = (titleName: string) => {
    setEquippedTitle(titleName);
    if (currentRumuz && (currentPin || pinInput)) {
      updateRumuzCustomization(currentRumuz, currentPin || pinInput, { equippedTitle: titleName }).catch(() => {});
    }
  };

  // Permanent Delete Profile
  const handleDeleteAccount = async () => {
    setStatusMsg(null);
    if (!deleteConfirmPin.trim()) {
      setStatusMsg({ type: 'error', text: 'Hesabınızı ve bulut verilerinizi silmek için lütfen PIN şifrenizi girin.' });
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteRumuzProfile(currentRumuz, deleteConfirmPin.trim());
      if (!res.success) {
        setStatusMsg({ type: 'error', text: res.errorMsg || 'Hesap silinemedi. Lütfen doğru PIN giriniz.' });
        setIsDeleting(false);
        return;
      }

      clearAllUserData();
      setStatusMsg({ type: 'success', text: '🗑️ Hesabınız ve tüm bulut verileriniz kalıcı olarak silindi.' });

      setTimeout(() => {
        if (onProfileDeleted) onProfileDeleted();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error('Account delete error:', err);
      setStatusMsg({ type: 'error', text: 'Silme işlemi sırasında hata oluştu.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="hf-modal hf-modal-rule relative max-h-[92vh] w-full max-w-3xl space-y-4 overflow-y-auto p-4 sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
          title="Kapat (Dışarı tıklayarak da kapatabilirsiniz)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Live Avatar Preview & Quick Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5 pr-8">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0">
              <AvatarWithBadgeFrame
                rumuz={newRumuzInput || currentRumuz}
                unlockedBadges={unlockedBadges}
                duelWins={duelStats.duelWins}
                avatarIcon={avatarIcon}
                avatarBg={avatarBg}
                equippedTitle={equippedTitle}
                size="lg"
                showBadgePin={true}
              />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-base text-white tracking-wide truncate">
                {newRumuzInput || currentRumuz}
              </h2>
              <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30 max-w-full">
                <WearableEmblem
                  family="badge"
                  tier={prestige.tierLevel}
                  glyph={prestigeTitleGlyph}
                  className="h-3.5 w-3.5 shrink-0"
                  strokeWidth={2.4}
                />
                <span className="truncate">{prestige.title}</span>
              </span>
              <p className="text-xs text-slate-300 mt-1 truncate">
                Kuşanılan: <strong className="text-amber-300 font-extrabold">{equippedTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-center self-stretch sm:self-auto justify-around sm:justify-start">
            <div>
              <div className="text-[9px] uppercase font-black text-amber-400">Toplam Puan</div>
              <div className="text-xs font-black text-emerald-400">{totalCareerScore} p</div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <div className="text-[9px] uppercase font-black text-indigo-300">1v1 Zafer</div>
              <div className="text-xs font-black text-indigo-300">{duelStats.duelWins} G</div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <div className="text-[9px] uppercase font-black text-slate-400">Açılan Rozet</div>
              <div className="text-xs font-black text-slate-200">{unlockedBadges.length}/{ALL_BADGES.length}</div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {statusMsg && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 animate-in zoom-in-95 duration-150 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-400/80 text-emerald-300 font-bold'
                : 'bg-rose-500/20 border-rose-400/80 text-rose-300 font-bold'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* ALL-IN-ONE COMPACT CONTENT */}
        <div className="space-y-4 text-xs">

          {/* GIYILEBILIR LEJANDI — üç katmanın ne olduğu ve beş kademenin
              görsel dili. Tekrar eden "5. Kademe" çipleri yerine tek yer. */}
          <div className="rounded-2xl border border-[#c9a24a]/35 bg-black/35 p-3 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#e3c987]">
                Giyilebilir Katmanlar
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Üçü farklı şeydir — biri görünüm, biri kimlik, biri başarı.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  family: 'avatar' as const,
                  tier: 3,
                  glyph: 'lion',
                  title: 'Avatar İkonu',
                  role: 'Sadece görünüm',
                  desc: 'Profil resmin. Puan ya da rozet vermez, sadece karakterini gösterir.',
                  accent: 'border-indigo-400/40 bg-indigo-500/10',
                  label: 'text-indigo-200'
                },
                {
                  family: 'title' as const,
                  tier: 3,
                  glyph: 'crown',
                  title: 'Resmi Ünvan',
                  role: 'Kimlik / saygınlık',
                  desc: 'Adının altında görünen isim. Zirvede tek ünvan kuşanılır, puan eklemez.',
                  accent: 'border-amber-400/40 bg-amber-500/10',
                  label: 'text-amber-200'
                },
                {
                  family: 'badge' as const,
                  tier: 3,
                  glyph: 'trophy',
                  title: 'Başarı Rozeti',
                  role: 'Kanıt / koleksiyon',
                  desc: 'Bir hedefi tamamladığının kanıtı. Rozetler kademeni ve ünvanlarını açar.',
                  accent: 'border-cyan-400/40 bg-cyan-500/10',
                  label: 'text-cyan-200'
                }
              ].map((card) => (
                <div key={card.family} className={`rounded-xl border p-2 flex items-start gap-2 ${card.accent}`}>
                  <WearableEmblem family={card.family} tier={card.tier} glyph={card.glyph} className="h-9 w-9 shrink-0" />
                  <div className="min-w-0">
                    <div className={`text-[11px] font-black ${card.label}`}>{card.title}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{card.role}</div>
                    <p className="text-[9.5px] text-slate-300 leading-snug mt-0.5">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#e3c987]">Kademe Merdiveni</span>
                <span className="text-[10px] text-slate-400">Şekil, renk ve efekt birlikte değişir — 4 ile 5 karışmaz.</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((t) => (
                  <div key={t} className="rounded-lg border border-white/10 bg-white/5 px-1.5 py-1.5 flex items-center gap-1.5">
                    <TierMark tier={t} className="h-6 w-6 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[9.5px] font-black text-slate-100 leading-none">
                        {TIER_LABELS[t].name}
                      </div>
                      <div className="text-[8px] text-slate-400 leading-tight mt-0.5">{TIER_LABELS[t].short}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ITEM INSPECTOR DIALOG / BANNER (Reveals exactly how to unlock and current progress on click/hover) */}
          {inspectedItem && (
            <div className="p-3.5 rounded-xl border border-[#c9a24a]/50 bg-[#c9a24a]/10 space-y-2 animate-in fade-in zoom-in-95 duration-150 relative">
              <button
                onClick={() => setInspectedItem(null)}
                className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white"
                title="Kapat"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-black/40 border border-white/10">
                  <WearableEmblem
                    family={inspectedItem.type === 'avatar' ? 'avatar' : inspectedItem.type === 'title' ? 'title' : 'badge'}
                    tier={inspectedItem.tierLevel}
                    glyph={inspectedItem.glyph}
                    className="h-10 w-10"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-white">{inspectedItem.title}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      inspectedItem.tierLevel === 5 ? 'bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-400' :
                      inspectedItem.tierLevel === 4 ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' :
                      inspectedItem.tierLevel === 3 ? 'bg-amber-500/30 text-amber-300 border border-amber-400' :
                      inspectedItem.tierLevel === 2 ? 'bg-slate-400/30 text-slate-300 border border-slate-400' :
                      'bg-amber-900/40 text-amber-200 border border-amber-700'
                    }`}>
                      {inspectedItem.tier} (Kademe {inspectedItem.tierLevel})
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      inspectedItem.isUnlocked ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                    }`}>
                      {inspectedItem.isUnlocked ? '✓ Açık / Kullanılabilir' : '🔒 Kilitli'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-200 mt-1 font-medium">{inspectedItem.reqDescription}</p>

                  <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[10px]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>Nasıl Elde Edilir?</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">{inspectedItem.howToUnlock}</p>
                    {inspectedItem.currentProgress && (
                      <p className="text-[10px] text-cyan-300 font-bold mt-1">{inspectedItem.currentProgress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. KATEGORİ: AVATAR İKONU SEÇİMİ */}
          <div className="p-3.5 rounded-2xl border border-[#c9a24a]/30 bg-[#c9a24a]/8 space-y-3">
            <SectionHeader
              icon={<Palette className="w-3.5 h-3.5" />}
              tone="indigo"
              title="1. Avatar İkonu"
              role="sadece görünüm"
              desc="Profilindeki sembol. Puan veya rozet kazandırmaz, yalnızca seni temsil eder."
              border="border-indigo-500/30"
              badge={
                <span className="text-[10px] text-amber-300 font-black bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <TierMark tier={userHighestAvatarTier === 'mythic' ? 5 : userHighestAvatarTier === 'diamond' ? 4 : userHighestAvatarTier === 'gold' ? 3 : userHighestAvatarTier === 'silver' ? 2 : userHighestAvatarTier === 'bronze' ? 1 : 0} className="h-4 w-4" />
                  Kademen: {TIER_LABELS[userHighestAvatarTier === 'mythic' ? 5 : userHighestAvatarTier === 'diamond' ? 4 : userHighestAvatarTier === 'gold' ? 3 : userHighestAvatarTier === 'silver' ? 2 : userHighestAvatarTier === 'bronze' ? 1 : 0].short}
                </span>
              }
            />

            {/* Kademe Filtreleme Sekmeleri */}
            <div className="flex flex-wrap items-center gap-1 pb-1 text-[10px] font-bold">
              {[
                { id: 'all', label: `Tümü (${AVATAR_ICONS.length})`, tier: 0 },
                { id: 'mythic', label: '5 · Kozmik', tier: 5 },
                { id: 'diamond', label: '4 · Elmas', tier: 4 },
                { id: 'gold', label: '3 · Altın', tier: 3 },
                { id: 'silver', label: '2 · Gümüş', tier: 2 },
                { id: 'bronze', label: '1 · Bronz', tier: 1 },
                { id: 'starter', label: 'Başlangıç', tier: 0 }
              ].map((tab) => {
                const isActive = avatarTierFilter === tab.id;
                const isUserCurrent = userHighestAvatarTier === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAvatarTierFilter(tab.id as typeof avatarTierFilter)}
                    className={`px-2 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1 ${
                      isActive
                        ? 'hf-btn-brass border-[#c9a24a]/60'
                        : isUserCurrent
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.tier > 0 && <TierMark tier={tab.tier} className="h-3.5 w-3.5" />}
                    {tab.label} {isUserCurrent && tab.id !== 'all' && '★'}
                  </button>
                );
              })}
            </div>

            {/* Avatar Icons Grid (Compact) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
              {AVATAR_ICONS.filter((item) => avatarTierFilter === 'all' || item.tier === avatarTierFilter).map((item) => {
                const isBadgesMet = !item.minBadgesRequired || unlockedBadges.length >= item.minBadgesRequired;
                const isDuelMet = !item.minDuelWinsRequired || duelStats.duelWins >= item.minDuelWinsRequired;
                const isScoreMet = !item.minScoreRequired || totalCareerScore >= item.minScoreRequired;
                const isUnlocked = isBadgesMet && isDuelMet && isScoreMet;
                const itemGlyph = AVATAR_GLYPHS[item.id];
                const itemToken = avatarToken(itemGlyph || 'compass');
                const isSelected = avatarIcon === itemToken || avatarIcon === item.icon;

                const itemTierLevel = item.tier === 'mythic' ? 5 : item.tier === 'diamond' ? 4 : item.tier === 'gold' ? 3 : item.tier === 'silver' ? 2 : item.tier === 'bronze' ? 1 : 0;

                const reqList: string[] = [];
                if (item.minBadgesRequired) reqList.push(`${item.minBadgesRequired} Rozet`);
                if (item.minDuelWinsRequired) reqList.push(`${item.minDuelWinsRequired} Düello Zaferi`);
                if (item.minScoreRequired) reqList.push(`${item.minScoreRequired} Puan`);
                const reqString = reqList.join(' + ') || 'Başlangıçta Açık';

                const howTo = item.minDuelWinsRequired
                  ? `Canlı 1v1 Düello modunda en az ${item.minDuelWinsRequired} maç kazanın ve başarı rozetlerini toplayın.`
                  : item.minBadgesRequired
                  ? `Coğrafya harita testlerini çözerek ve düellolara katılarak en az ${item.minBadgesRequired} farklı başarı rozeti kazanın.`
                  : 'Bu avatar başlangıç seviyesinde tüm kullanıcılara açıktır.';

                const inspectData = {
                  type: 'avatar' as const,
                  title: item.label,
                  glyph: itemGlyph,
                  tier: `${itemTierLevel}. Kademe (${item.tier.toUpperCase()})`,
                  tierLevel: itemTierLevel,
                  isUnlocked,
                  reqDescription: isUnlocked ? `Bu avatar kuşanılabilir durumdadır.` : `Kilit Açma Şartı: ${reqString}`,
                  howToUnlock: howTo,
                  currentProgress: `Mevcut: ${unlockedBadges.length} Rozet, ${duelStats.duelWins} Zafer, ${totalCareerScore} Puan`
                };

                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setInspectedItem(inspectData)}
                    onClick={() => {
                      if (isUnlocked) {
                        handleSelectAvatarIcon(itemToken);
                      }
                      setInspectedItem(inspectData);
                    }}
                    title={isUnlocked ? `${item.label} (Kuşan)` : `Kilitli: ${reqString}`}
                    className={`relative p-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[58px] ${
                      isSelected
                        ? 'bg-[linear-gradient(180deg,rgba(201,162,74,.28),rgba(29,21,8,.55))] outline outline-2 outline-offset-1 outline-[#d4a94f] border-2 border-[#e3c987] ring-2 ring-[#c9a24a]/60 shadow-[0_0_16px_rgba(251,191,36,0.8)] scale-105 z-10'
                        : isUnlocked
                        ? 'border border-[#6d9479]/50 bg-[#3c6d55]/18 text-[#dfe9df] hover:border-[#9db8a4] hover:scale-105'
                        : 'bg-black/60 border border-slate-700/60 text-slate-500 opacity-60 hover:opacity-90 hover:border-slate-500'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-md bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center shadow ring-1 ring-white">
                        ✓
                      </span>
                    )}
                    <WearableEmblem
                      family="avatar"
                      tier={isUnlocked ? itemTierLevel : 0}
                      glyph={itemGlyph}
                      className="my-0.5 h-7 w-7 shrink-0 transition-transform hover:scale-110"
                    />
                    <span className="text-[8px] font-bold truncate max-w-full text-center leading-none">
                      {item.label}
                    </span>
                    {isSelected ? (
                      <span className="text-[7px] font-black text-amber-300 bg-amber-950/90 px-1 py-0.2 rounded border border-amber-400/60 leading-none">
                        Aktif
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[7px] font-black text-emerald-300 bg-emerald-950/90 px-1 py-0.2 rounded border border-emerald-400/70 leading-none">
                        Açık
                      </span>
                    ) : (
                      <span className="text-[7px] text-slate-400 font-extrabold truncate max-w-full">
                        🔒 Kilitli
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. KATEGORİ: AVATAR EFEKTİ & PARILTI */}
          <div className="p-3.5 rounded-2xl border border-[#c9a24a]/30 bg-[#c9a24a]/8 space-y-3">
            <SectionHeader
              icon={<Sparkles className="w-3.5 h-3.5" />}
              tone="purple"
              title="2. Avatar Efekti"
              role="aura"
              desc="Avatarının dış hattını boyayan ışık. Oyunu etkilemez; kademen yükseldikçe daha güçlü görünür."
              border="border-purple-500/30"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {AVATAR_THEMES.map((theme) => {
                const isSelected = avatarBg === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectAvatarBg(theme.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-amber-300 ring-2 ring-amber-400/70 bg-purple-900/30 shadow-[0_0_16px_rgba(251,191,36,0.6)] scale-[1.01] z-10 relative'
                        : 'border border-purple-400/40 hover:border-purple-300 bg-white/5 hover:scale-[1.01]'
                    }`}
                  >
                    <span
                      className="shrink-0 select-none"
                      style={{ filter: theme.outlineFilter }}
                    >
                      <WearableEmblem
                        family="avatar"
                        tier={theme.tierLevel}
                        glyph={currentAvatarGlyph}
                        className="h-9 w-9"
                      />
                    </span>
                    <div className="min-w-0 text-left">
                      <span className="text-xs font-bold text-slate-200 block truncate">{theme.name}</span>
                    </div>
                    {isSelected ? (
                      <span className="ml-auto text-[8px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 shadow border border-amber-200 shrink-0">
                        KUŞANILDI ✓
                      </span>
                    ) : (
                      <span className="ml-auto text-[8px] font-bold text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-400/60 shrink-0">
                        Seç
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. KATEGORİ: KUŞANILABİLİR RESMİ ÜNVANLAR */}
          <div className="p-3.5 rounded-2xl border border-[#c9a24a]/40 bg-[#c9a24a]/10 space-y-3">
            <SectionHeader
              icon={<Crown className="w-3.5 h-3.5 text-amber-100" />}
              tone="amber"
              title="3. Resmi Ünvanlar"
              role="kimlik"
              desc="Adının altında görünen isim. Aynı anda tek ünvan kuşanılır; puan vermez, saygınlık verir."
              border="border-amber-500/30"
              badge={
                <span className="text-[10px] text-amber-300 font-black bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <TierMark tier={userHighestTitleTier === 'mythic' ? 5 : userHighestTitleTier === 'diamond' ? 4 : userHighestTitleTier === 'gold' ? 3 : userHighestTitleTier === 'silver' ? 2 : 1} className="h-4 w-4" />
                  Kademen: {TIER_LABELS[userHighestTitleTier === 'mythic' ? 5 : userHighestTitleTier === 'diamond' ? 4 : userHighestTitleTier === 'gold' ? 3 : userHighestTitleTier === 'silver' ? 2 : 1].short}
                </span>
              }
            />

            {/* Ünvan Kademe Filtreleme Sekmeleri */}
            <div className="flex flex-wrap items-center gap-1 pb-1 text-[10px] font-bold">
              {[
                { id: 'all', label: `Tümü (${ALL_TITLES.length})`, tier: 0 },
                { id: 'mythic', label: '5 · Kozmik', tier: 5 },
                { id: 'diamond', label: '4 · Elmas', tier: 4 },
                { id: 'gold', label: '3 · Altın', tier: 3 },
                { id: 'silver', label: '2 · Gümüş', tier: 2 },
                { id: 'bronze', label: '1 · Bronz', tier: 1 }
              ].map((tab) => {
                const isActive = titleTierFilter === tab.id;
                const isUserCurrent = userHighestTitleTier === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTitleTierFilter(tab.id as typeof titleTierFilter)}
                    className={`px-2 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-500 border-amber-300 text-slate-950 font-black shadow-md shadow-amber-500/30'
                        : isUserCurrent
                        ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.tier > 0 && <TierMark tier={tab.tier} className="h-3.5 w-3.5" />}
                    {tab.label} {isUserCurrent && tab.id !== 'all' && '★'}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {ALL_TITLES.filter((titleObj) => titleTierFilter === 'all' || titleObj.tier === titleTierFilter).map((titleObj) => {
                const prog = getTitleProgress(
                  titleObj,
                  unlockedBadges,
                  duelStats?.duelWins || 0,
                  score || 0,
                  categoryMasteryProgress,
                  botStats?.botWins || 0
                );
                const isUnlocked = prog.isUnlocked;
                const isEquipped = equippedTitle === titleObj.name;
                const tierStyle = getTitleTierStyle(titleObj.tier);

                const tierLevel = titleObj.tier === 'mythic' ? 5 : titleObj.tier === 'diamond' ? 4 : titleObj.tier === 'gold' ? 3 : titleObj.tier === 'silver' ? 2 : 1;

                const howTo = titleObj.tier === 'mythic'
                  ? 'En az 30 başarı rozeti toplayın ve 1v1 canlı düellolarda 100 galibiyete ulaşarak coğrafya zirvesine çıkın.'
                  : titleObj.tier === 'diamond'
                  ? 'En az 20 rozet ve 50 düello galibiyetine ulaşın.'
                  : titleObj.tier === 'gold'
                  ? '10 rozet ve 20 düello galibiyeti kazanın.'
                  : titleObj.tier === 'silver'
                  ? '5 rozet veya 5 düello galibiyeti elde edin.'
                  : 'Coğrafya testlerine başlayarak ilk sorularınızı doğru yanıtlayın.';

                const inspectData = {
                  type: 'title' as const,
                  title: titleObj.name,
                  glyph: TITLE_GLYPHS[titleObj.id],
                  tier: tierStyle.tierName,
                  tierLevel,
                  isUnlocked,
                  reqDescription: titleObj.desc,
                  howToUnlock: howTo,
                  currentProgress: isUnlocked ? 'Şartlar sağlandı ve ünvan kuşanılmaya hazır!' : `${prog.remainingText} (${prog.currentValue}/${prog.targetValue} - %${prog.progressPct})`
                };

                return (
                  <div
                    key={titleObj.id}
                    onMouseEnter={() => setInspectedItem(inspectData)}
                    onClick={() => {
                      setInspectedItem(inspectData);
                    }}
                    className={`rounded-xl border p-2 flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                      isEquipped
                        ? `border-2 border-amber-300 ring-2 ring-amber-400 ${tierStyle.bgClass} shadow-[0_0_20px_rgba(251,191,36,0.7)] relative z-10`
                        : isUnlocked
                        ? `border-2 border-emerald-400 hover:border-emerald-300 ${tierStyle.bgClass} hover:scale-[1.01]`
                        : 'bg-black/50 border border-slate-700/50 opacity-65 hover:opacity-90 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <WearableEmblem
                          family="title"
                          tier={tierLevel}
                          glyph={TITLE_GLYPHS[titleObj.id]}
                          className="h-7 w-7 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className={`font-black text-xs truncate ${isUnlocked ? tierStyle.textClass : 'text-slate-200'}`}>
                              {titleObj.name}
                            </span>
                            <span className={`text-[8px] font-black px-1 rounded ${tierStyle.badgeClass}`}>
                              {tierStyle.tierName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipTitle(titleObj.name);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-black shrink-0 transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-amber-400 text-slate-950 shadow border border-amber-200'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow border border-emerald-300'
                          }`}
                        >
                          {isEquipped ? 'KUŞANILDI ✓' : 'Kuşan'}
                        </button>
                      ) : (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">
                          🔒 Şartı Gör
                        </span>
                      )}
                    </div>

                    {/* Progress Bar for Titles */}
                    {!isUnlocked && (
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#a8871f,#d4a94f)] transition-all duration-300"
                          style={{ width: `${prog.progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. KATEGORİ: KADEMELİ ROZETLER GALERİSİ */}
          <div className="p-3.5 rounded-2xl border border-[#3f7070]/40 bg-[#3f7070]/8 space-y-3">
            <SectionHeader
              icon={<Medal className="w-3.5 h-3.5 text-cyan-100" />}
              tone="cyan"
              title={`4. Başarı Rozetleri (${unlockedBadges.length}/${ALL_BADGES.length})`}
              role="kanıt"
              desc="Tamamladığın hedeflerin madalyonları. Rozet sayın kademeni, kademen de açılan avatar ve ünvanları belirler."
              border="border-cyan-500/30"
              badge={
                <span className="text-[10px] text-cyan-300 font-black bg-cyan-500/15 px-2.5 py-1 rounded-lg border border-cyan-500/30 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <TierMark tier={userHighestBadgeTier === 'mythic' ? 5 : userHighestBadgeTier === 'diamond' ? 4 : userHighestBadgeTier === 'gold' ? 3 : userHighestBadgeTier === 'silver' ? 2 : 1} className="h-4 w-4" />
                  Kademen: {TIER_LABELS[userHighestBadgeTier === 'mythic' ? 5 : userHighestBadgeTier === 'diamond' ? 4 : userHighestBadgeTier === 'gold' ? 3 : userHighestBadgeTier === 'silver' ? 2 : 1].short}
                </span>
              }
            />

            {/* Rozet Kademe Filtreleme Sekmeleri */}
            <div className="flex flex-wrap items-center gap-1 pb-1 text-[10px] font-bold">
              {[
                { id: 'all', label: `Tümü (${ALL_BADGES.length})`, tier: 0 },
                { id: 'mythic', label: '5 · Kozmik', tier: 5 },
                { id: 'diamond', label: '4 · Elmas', tier: 4 },
                { id: 'gold', label: '3 · Altın', tier: 3 },
                { id: 'silver', label: '2 · Gümüş', tier: 2 },
                { id: 'bronze', label: '1 · Bronz', tier: 1 }
              ].map((tab) => {
                const isActive = badgeTierFilter === tab.id;
                const isUserCurrent = userHighestBadgeTier === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setBadgeTierFilter(tab.id as typeof badgeTierFilter)}
                    className={`px-2 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1 ${
                      isActive
                        ? 'border-[#3f6673]/70 bg-[#30525d]/40 text-[#c3d0d2] font-semibold'
                        : isUserCurrent
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.tier > 0 && <TierMark tier={tab.tier} className="h-3.5 w-3.5" />}
                    {tab.label} {isUserCurrent && tab.id !== 'all' && '★'}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {(['mythic', 'diamond', 'gold', 'silver', 'bronze'] as BadgeTier[])
                .filter((tierKey) => badgeTierFilter === 'all' || badgeTierFilter === tierKey)
                .map((tierKey) => {
                const badgesInTier = tierBadges[tierKey];
                if (!badgesInTier || badgesInTier.length === 0) return null;

                const tierStyle = getTitleTierStyle(tierKey);
                const tierLevel = tierKey === 'mythic' ? 5 : tierKey === 'diamond' ? 4 : tierKey === 'gold' ? 3 : tierKey === 'silver' ? 2 : 1;

                return (
                  <div key={tierKey} className="space-y-1">
                    <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider flex items-center justify-between ${tierStyle.badgeClass}`}>
                      <span>{tierStyle.tierName}</span>
                      <span className="text-[8px] opacity-90">{badgesInTier.length} Adet</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {badgesInTier.map((badge) => {
                        const isUnlocked = unlockedBadges.includes(badge.name);
                        const currentProgress = (categoryMasteryProgress && categoryMasteryProgress[badge.trackerKey]) || 0;
                        const target = badge.targetCount || 1;
                        const pct = Math.min(100, Math.round((currentProgress / target) * 100));
                        const remaining = Math.max(0, target - currentProgress);

                        const inspectData = {
                          type: 'badge' as const,
                          title: badge.name,
                          glyph: BADGE_GLYPHS[badge.id],
                          tier: tierStyle.tierName,
                          tierLevel,
                          isUnlocked,
                          reqDescription: badge.desc,
                          howToUnlock: badge.category === 'duel'
                            ? `Canlı 1v1 Düellolarda rakiplerinizi yenerek galibiyet hedefine ulaşın.`
                            : `3D Türkiye Haritasında ilgili kategorideki KPSS sorularını doğru yanıtlayın.`,
                          currentProgress: isUnlocked
                            ? 'Tebrikler! Bu rozet kilidi açılmış ve koleksiyonunuza eklenmiştir.'
                            : `İlerleme: ${currentProgress}/${target} (%${pct}) • Kalan: ${remaining}`
                        };

                        return (
                          <div
                            key={badge.id}
                            onMouseEnter={() => setInspectedItem(inspectData)}
                            onClick={() => {
                              setInspectedItem(inspectData);
                            }}
                            className={`rounded-xl border p-1.5 flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                              isUnlocked
                                ? `border border-emerald-400/80 ${tierStyle.bgClass} hover:border-emerald-300`
                                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100 hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <WearableEmblem
                                family="badge"
                                tier={tierLevel}
                                glyph={BADGE_GLYPHS[badge.id]}
                                className="h-6 w-6 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className={`font-black text-[11px] truncate block ${isUnlocked ? tierStyle.textClass : 'text-slate-300'}`}>
                                  {badge.name}
                                </span>
                              </div>
                            </div>

                            {isUnlocked ? (
                              <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 shrink-0">
                                AÇIK ✓
                              </span>
                            ) : (
                              <span className="text-[7.5px] text-amber-300 font-bold px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                                %{pct}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. KATEGORİ: NICK & PIN ŞİFRESİ DEĞİŞTİRME */}
          <div className="p-3.5 rounded-2xl border border-[#3f6673]/40 bg-[#3f6673]/8 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <User className="w-3.5 h-3.5 text-blue-100" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-blue-200 tracking-wide uppercase">
                    5. Nick &amp; Güvenlik Şifresi Ayarları
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Oyuncu adını (Nick) ve hesabını koruyan 4 haneli PIN şifreni güncelle</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Oyuncu Adı (Nick):</label>
                <input
                  type="text"
                  value={newRumuzInput}
                  onChange={(e) => setNewRumuzInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Yeni nickiniz"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Mevcut PIN / Şifre:</label>
                <input
                  type="password"
                  maxLength={8}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-indigo-400 tracking-widest"
                  placeholder="Mevcut 4 haneli PIN"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Yeni PIN Belirle (İsteğe Bağlı):</label>
              <input
                type="password"
                maxLength={8}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-indigo-400 tracking-widest"
                placeholder="Değiştirmek istemiyorsanız boş bırakın"
              />
            </div>

            <button
              onClick={handleSaveProfileInfo}
              disabled={isSaving}
              className="hf-btn-brass w-full py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>Nick &amp; Şifre Değişikliğini Kaydet</span>
            </button>
          </div>

          {/* 5. HESAP SİLME / DANGER ZONE (Kompakt Akordeon) */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDangerZone(!showDangerZone)}
              className="w-full p-2.5 bg-white/5 hover:bg-rose-950/30 text-slate-300 hover:text-rose-300 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-rose-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Gelişmiş: Hesabı ve Bulut Verilerini Kalıcı Olarak Sil</span>
              </span>
              {showDangerZone ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDangerZone && (
              <div className="p-3 bg-rose-950/20 border-t border-rose-500/30 space-y-2.5 animate-in fade-in duration-150">
                <p className="text-[11px] text-rose-200 leading-relaxed">
                  Bu işlem geri alınamaz. <strong>&apos;{currentRumuz}&apos;</strong> profiliniz ve Firestore bulutundaki tüm test geçmişiniz tamamen silinir.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-rose-300">Silme İçin PIN Şifreniz:</label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
                    <input
                      type="password"
                      maxLength={8}
                      value={deleteConfirmPin}
                      onChange={(e) => setDeleteConfirmPin(e.target.value)}
                      placeholder="PIN şifrenizi girin"
                      className="w-full bg-black/60 border border-rose-500/40 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-rose-300 focus:outline-none focus:border-rose-400 tracking-widest"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Hesabımı Kalıcı Olarak Sil</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
