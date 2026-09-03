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
    categoryMasteryProgress,
    setAvatarIcon,
    setAvatarBg,
    setEquippedTitle,
    clearAllUserData
  } = useAppStore();

  const [newRumuzInput, setNewRumuzInput] = useState(currentRumuz);
  const [pinInput, setPinInput] = useState(currentPin);
  const [newPinInput, setNewPinInput] = useState('');
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [deleteConfirmPin, setDeleteConfirmPin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [inspectedItem, setInspectedItem] = useState<{
    type: 'avatar' | 'title' | 'badge';
    title: string;
    icon: string;
    tier: string;
    tierLevel: number;
    isUnlocked: boolean;
    reqDescription: string;
    howToUnlock: string;
    currentProgress?: string;
  } | null>(null);

  if (!isOpen) return null;

  const prestige = getPrestigeTier(unlockedBadges, duelStats.duelWins, equippedTitle);

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
        className="bg-[#09090b] border-2 border-indigo-500/40 rounded-2xl max-w-3xl w-full p-4 sm:p-5 text-slate-100 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto"
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
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-white tracking-wide truncate">
                  {newRumuzInput || currentRumuz}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30 shrink-0">
                  {prestige.pinIcon} {prestige.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                Kuşanılan: <strong className="text-amber-300 font-extrabold">{equippedTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-center self-stretch sm:self-auto justify-around sm:justify-start">
            <div>
              <div className="text-[9px] uppercase font-black text-amber-400">Puan</div>
              <div className="text-xs font-black text-emerald-400">{score} p</div>
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

          {/* ITEM INSPECTOR DIALOG / BANNER (Reveals exactly how to unlock and current progress on click/hover) */}
          {inspectedItem && (
            <div className="p-3.5 rounded-xl border-2 border-amber-400/80 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-150 relative">
              <button
                onClick={() => setInspectedItem(null)}
                className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white"
                title="Kapat"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  inspectedItem.tierLevel === 5 ? 'bg-gradient-to-tr from-fuchsia-500 to-cyan-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-lg' :
                  inspectedItem.tierLevel === 4 ? 'bg-gradient-to-tr from-cyan-400 to-purple-500 text-slate-950 font-black ring-1 ring-cyan-300' :
                  inspectedItem.tierLevel === 3 ? 'bg-amber-400 text-slate-950 font-black' :
                  inspectedItem.tierLevel === 2 ? 'bg-slate-200 text-slate-950 font-black' :
                  'bg-amber-800 text-amber-100'
                }`}>
                  {inspectedItem.icon}
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

          {/* 1. KUŞANILABİLİR AVATAR & ÇERÇEVE TEMASI */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-indigo-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>1. Karakter Avatarı &amp; Renk Teması Seçimi</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                Tıkla ve anında kuşan • Kilitliye tıkla şartını gör
              </span>
            </div>

            {/* Avatar Icons Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {AVATAR_ICONS.map((item) => {
                const isBadgesMet = !item.minBadgesRequired || unlockedBadges.length >= item.minBadgesRequired;
                const isDuelMet = !item.minDuelWinsRequired || duelStats.duelWins >= item.minDuelWinsRequired;
                const isScoreMet = !item.minScoreRequired || score >= item.minScoreRequired;
                const isUnlocked = isBadgesMet && isDuelMet && isScoreMet;
                const isSelected = avatarIcon === item.icon;

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

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isUnlocked) {
                        handleSelectAvatarIcon(item.icon);
                      }
                      setInspectedItem({
                        type: 'avatar',
                        title: item.label,
                        icon: item.icon,
                        tier: isUnlocked ? 'Açık Avatar' : 'Kilitli Avatar',
                        tierLevel: item.minDuelWinsRequired ? 4 : item.minBadgesRequired ? 3 : 1,
                        isUnlocked,
                        reqDescription: isUnlocked ? `Bu avatar başarıyla kuşanıldı.` : `Kilit Açma Şartı: ${reqString}`,
                        howToUnlock: howTo,
                        currentProgress: `Mevcut Durumunuz: ${unlockedBadges.length} Rozet, ${duelStats.duelWins} Zafer, ${score} Puan`
                      });
                    }}
                    title={isUnlocked ? `${item.label} (Kullanılabilir)` : `Kilitli: ${reqString} (Detay için tıkla)`}
                    className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400 shadow-md scale-105'
                        : isUnlocked
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:scale-105'
                        : 'bg-black/50 border-white/10 text-slate-400 hover:border-amber-400/50 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[8px] font-bold truncate max-w-full text-center leading-tight">
                      {isUnlocked ? item.label : '🔒 Kilitli'}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[7px] text-amber-400 font-extrabold truncate max-w-full">
                        {reqList[0] || 'Kilitli'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Avatar Theme Color Palettes */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                Çerçeve Parıltısı &amp; Arka Plan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {AVATAR_THEMES.map((theme) => {
                  const isSelected = avatarBg === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleSelectAvatarBg(theme.id)}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400 bg-white/15 shadow-md'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${theme.bgGradient} border border-white/20 shadow shrink-0`} />
                      <span className="text-[10px] font-bold text-slate-200 truncate">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. KUŞANILABİLİR RESMİ ÜNVANLAR (Hiyerarşik Sıralama & İlerleme Barları & Kademeler Arası Boyut Farkı) */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 flex items-center gap-1.5 text-xs">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>2. Kuşanılabilir Resmi Ünvanlar</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                Kuşanılan: <strong className="text-amber-300">{equippedTitle}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {ALL_TITLES.map((titleObj) => {
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

                // Tier micro-scale differences (5. Kademe > 4. Kademe > 3. Kademe > 2. Kademe > 1. Kademe)
                const tierScaleClass = titleObj.tier === 'mythic'
                  ? 'scale-[1.03] p-3'
                  : titleObj.tier === 'diamond'
                  ? 'scale-[1.015] p-2.5'
                  : titleObj.tier === 'gold'
                  ? 'scale-[1.0] p-2.5'
                  : titleObj.tier === 'silver'
                  ? 'scale-[0.985] p-2'
                  : 'scale-[0.97] p-2';

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

                return (
                  <div
                    key={titleObj.id}
                    onClick={() => {
                      setInspectedItem({
                        type: 'title',
                        title: titleObj.name,
                        icon: titleObj.icon,
                        tier: tierStyle.tierName,
                        tierLevel,
                        isUnlocked,
                        reqDescription: titleObj.desc,
                        howToUnlock: howTo,
                        currentProgress: isUnlocked ? 'Şartlar sağlandı ve ünvan kuşanılmaya hazır!' : `${prog.remainingText} (${prog.currentValue}/${prog.targetValue} - %${prog.progressPct})`
                      });
                    }}
                    className={`rounded-xl border flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${tierScaleClass} ${
                      isEquipped
                        ? `${tierStyle.bgClass} ${tierStyle.borderClass} ${tierStyle.glowShadow} ring-2 ring-amber-400`
                        : isUnlocked
                        ? `${tierStyle.bgClass} border-white/15 hover:border-white/30 hover:scale-[1.04]`
                        : 'bg-black/40 border-white/5 opacity-75 hover:opacity-100 hover:border-amber-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`shrink-0 ${titleObj.tier === 'mythic' ? 'text-xl' : titleObj.tier === 'diamond' ? 'text-lg' : 'text-base'}`}>{titleObj.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-black truncate ${titleObj.tier === 'mythic' ? 'text-sm' : 'text-xs'} ${isUnlocked ? tierStyle.textClass : 'text-slate-300'}`}>
                              {titleObj.name}
                            </span>
                            <span className={`text-[8px] font-black px-1 rounded ${tierStyle.badgeClass}`}>
                              {titleObj.tier === 'mythic' ? '🌌 5. Kademe (Mistik)' : titleObj.tier === 'diamond' ? '💎 4. Kademe (Elmas)' : titleObj.tier === 'gold' ? '👑 3. Kademe (Altın)' : titleObj.tier === 'silver' ? '🛡️ 2. Kademe (Gümüş)' : '🐣 1. Kademe (Bronz)'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 truncate mt-0.5">
                            {isUnlocked ? titleObj.desc : `🔒 Şart: ${titleObj.requiredMetricText}`}
                          </p>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipTitle(titleObj.name);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                              : 'bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-slate-200'
                          }`}
                        >
                          {isEquipped ? 'Kuşanıldı ✓' : 'Kuşan'}
                        </button>
                      ) : (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">
                          🔒 Detay Gör
                        </span>
                      )}
                    </div>

                    {/* Progress Bar & Remaining Counter for Titles */}
                    {!isUnlocked && (
                      <div className="mt-1 pt-1.5 border-t border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-bold">
                          <span className="text-amber-400">{prog.remainingText}</span>
                          <span className="text-slate-300">{prog.currentValue}/{prog.targetValue} (%{prog.progressPct})</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                            style={{ width: `${prog.progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. KADEMELİ ROZETLER GALERİSİ (Boyut Hiyerarşisi & Detaylı Kilit Açıklamaları) */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-200 flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-cyan-400" />
                <span>3. Kademeli Başarı Rozetleri ({unlockedBadges.length}/{ALL_BADGES.length})</span>
              </span>
              <span className="text-[10px] text-amber-400 font-extrabold">
                %{Math.round((unlockedBadges.length / ALL_BADGES.length) * 100)} Tamamlandı
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(['mythic', 'diamond', 'gold', 'silver', 'bronze'] as BadgeTier[]).map((tierKey) => {
                const badgesInTier = tierBadges[tierKey];
                if (!badgesInTier || badgesInTier.length === 0) return null;

                const tierStyle = getTitleTierStyle(tierKey);
                const tierLevel = tierKey === 'mythic' ? 5 : tierKey === 'diamond' ? 4 : tierKey === 'gold' ? 3 : tierKey === 'silver' ? 2 : 1;

                // Micro scale classes for badge tiers
                const badgeCardScale = tierKey === 'mythic'
                  ? 'scale-[1.03] p-3'
                  : tierKey === 'diamond'
                  ? 'scale-[1.015] p-2.5'
                  : tierKey === 'gold'
                  ? 'scale-[1.0] p-2.5'
                  : tierKey === 'silver'
                  ? 'scale-[0.985] p-2'
                  : 'scale-[0.97] p-2';

                const badgeIconSize = tierKey === 'mythic'
                  ? 'w-9 h-9 text-xl'
                  : tierKey === 'diamond'
                  ? 'w-8 h-8 text-lg'
                  : tierKey === 'gold'
                  ? 'w-7.5 h-7.5 text-base'
                  : tierKey === 'silver'
                  ? 'w-7 h-7 text-sm'
                  : 'w-6.5 h-6.5 text-xs';

                return (
                  <div key={tierKey} className="space-y-1.5">
                    <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider flex items-center justify-between ${tierStyle.badgeClass}`}>
                      <span>{tierStyle.tierName} • {tierLevel}. Kademe</span>
                      <span className="text-[8px] opacity-80">Boyut Çarpanı: {tierLevel === 5 ? '1.03x' : tierLevel === 4 ? '1.015x' : tierLevel === 3 ? '1.0x' : tierLevel === 2 ? '0.985x' : '0.97x'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {badgesInTier.map((badge) => {
                        const isUnlocked = unlockedBadges.includes(badge.name);
                        const currentProgress = (categoryMasteryProgress && categoryMasteryProgress[badge.trackerKey]) || 0;
                        const target = badge.targetCount || 1;
                        const pct = Math.min(100, Math.round((currentProgress / target) * 100));
                        const remaining = Math.max(0, target - currentProgress);

                        const unlockedCardStyle = tierKey === 'mythic'
                          ? 'bg-gradient-to-r from-purple-950 via-slate-950 to-cyan-950 border-2 border-fuchsia-400 ring-2 ring-cyan-400 shadow-[0_0_22px_rgba(217,70,239,0.7)]'
                          : tierKey === 'diamond'
                          ? 'bg-gradient-to-r from-cyan-950/70 via-purple-950/50 to-slate-900 border-2 border-cyan-400 ring-2 ring-purple-500/70 shadow-[0_0_16px_rgba(6,182,212,0.55)]'
                          : tierKey === 'gold'
                          ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.45)]'
                          : tierKey === 'silver'
                          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-800 border border-slate-300 shadow-[0_0_8px_rgba(203,213,225,0.3)]'
                          : 'bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-700/60 shadow-none';

                        const iconBgStyle = isUnlocked
                          ? tierKey === 'mythic'
                            ? 'bg-gradient-to-tr from-fuchsia-500 via-cyan-400 to-amber-300 text-slate-950 font-black shadow-xl ring-2 ring-fuchsia-300'
                            : tierKey === 'diamond'
                            ? 'bg-gradient-to-tr from-cyan-400 to-purple-500 text-slate-950 font-black shadow-lg ring-1 ring-cyan-300'
                            : tierKey === 'gold'
                            ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-yellow-300'
                            : tierKey === 'silver'
                            ? 'bg-slate-200 text-slate-950 font-black shadow-sm ring-1 ring-slate-300'
                            : 'bg-amber-800 text-amber-100 font-bold'
                          : 'bg-white/10 text-slate-500';

                        const howToBadge = badge.category === 'duel'
                          ? `Canlı 1v1 Düellolarda rakiplerinizi yenerek galibiyet ve galibiyet serisi hedefine ulaşın.`
                          : badge.category === 'kpss'
                          ? `3D Türkiye Haritası üzerinde ilgili coğrafya kategorisindeki KPSS sorularını doğru yanıtlayarak ilerleyin.`
                          : `Tüm soru kategorilerini ve düelloları tamamlayarak büyük koleksiyonu açın.`;

                        return (
                          <div
                            key={badge.id}
                            onClick={() => {
                              setInspectedItem({
                                type: 'badge',
                                title: badge.name,
                                icon: badge.icon,
                                tier: tierStyle.tierName,
                                tierLevel,
                                isUnlocked,
                                reqDescription: badge.desc,
                                howToUnlock: howToBadge,
                                currentProgress: isUnlocked
                                  ? 'Tebrikler! Bu rozet kilidi açılmış ve koleksiyonunuza eklenmiştir.'
                                  : `İlerleme: ${currentProgress}/${target} (%${pct}) • Kalan: ${remaining} adet/zafer`
                              });
                            }}
                            className={`rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${badgeCardScale} ${
                              isUnlocked
                                ? unlockedCardStyle
                                : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100 hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`rounded-lg flex items-center justify-center shrink-0 ${badgeIconSize} ${iconBgStyle}`}>
                                {badge.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`font-black text-xs truncate ${isUnlocked ? tierStyle.textClass : 'text-slate-300'}`}>
                                    {badge.name}
                                  </span>
                                  {isUnlocked ? (
                                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                                      tierKey === 'mythic'
                                        ? 'bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-slate-950 font-black ring-1 ring-amber-300'
                                        : tierKey === 'diamond'
                                        ? 'bg-cyan-300 text-slate-950 ring-1 ring-purple-500'
                                        : tierKey === 'gold'
                                        ? 'bg-amber-400 text-slate-950'
                                        : tierKey === 'silver'
                                        ? 'bg-slate-200 text-slate-950'
                                        : 'bg-amber-700 text-white'
                                    }`}>
                                      KAZANILDI ✓
                                    </span>
                                  ) : (
                                    <span className="text-[8px] text-amber-300 font-bold px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                      🔒 Nasıl Alınır?
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-300 leading-snug mt-0.5 truncate">{badge.desc}</p>
                              </div>
                            </div>

                            {!isUnlocked && (
                              <div className="mt-1.5 pt-1 border-t border-white/10 space-y-0.5">
                                <div className="flex justify-between items-center text-[9px] text-slate-400">
                                  <span className="truncate text-amber-300/90 font-medium">{badge.reqText}</span>
                                  <span className="font-extrabold text-amber-400 shrink-0 ml-1">
                                    {currentProgress}/{target} (%{pct})
                                  </span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <div className="text-[8px] text-slate-400 font-semibold text-right">
                                  Kalan: <strong className="text-amber-300">{remaining} adet/zafer</strong>
                                </div>
                              </div>
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

          {/* 4. RUMUZ & PIN ŞİFRESİ DEĞİŞTİRME */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
            <h3 className="font-black text-indigo-300 flex items-center gap-1.5 text-xs">
              <User className="w-4 h-4 text-indigo-400" />
              <span>4. Rumuz &amp; Güvenlik Şifresi Ayarları</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Rumuz:</label>
                <input
                  type="text"
                  value={newRumuzInput}
                  onChange={(e) => setNewRumuzInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Yeni rumuzunuz"
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
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>Rumuz &amp; Şifre Değişikliğini Kaydet</span>
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
