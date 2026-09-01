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
  BadgeTier
} from '@/lib/data/badgesData';
import AvatarWithBadgeFrame from '@/components/ui/AvatarWithBadgeFrame';
import { 
  changeRumuzNickname, 
  updateRumuzCustomization, 
  deleteRumuzProfile, 
  saveRumuzProfile 
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
  Palette
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

  const [activeTab, setActiveTab] = useState<'customize' | 'badges_titles' | 'account_danger'>('customize');
  const [newRumuzInput, setNewRumuzInput] = useState(currentRumuz);
  const [pinInput, setPinInput] = useState(currentPin);
  const [newPinInput, setNewPinInput] = useState('');
  const [deleteConfirmPin, setDeleteConfirmPin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const prestige = getPrestigeTier(unlockedBadges, duelStats.duelWins, equippedTitle);

  // Filter badges by tier
  const tierBadges = {
    bronze: ALL_BADGES.filter(b => b.tier === 'bronze'),
    silver: ALL_BADGES.filter(b => b.tier === 'silver'),
    gold: ALL_BADGES.filter(b => b.tier === 'gold'),
    diamond: ALL_BADGES.filter(b => b.tier === 'diamond')
  };

  // Handle Nickname or PIN update
  const handleSaveProfileInfo = async () => {
    setStatusMsg(null);
    setIsSaving(true);

    try {
      const trimmedNewRumuz = newRumuzInput.trim();
      const activePin = pinInput.trim() || currentPin.trim();

      if (!activePin) {
        setStatusMsg({ type: 'error', text: 'Değişiklikleri kaydetmek için lütfen 4 haneli PIN şifrenizi girin.' });
        setIsSaving(false);
        return;
      }

      // Check if rumuz name is changing
      if (trimmedNewRumuz && trimmedNewRumuz !== currentRumuz) {
        const renameRes = await changeRumuzNickname(currentRumuz, trimmedNewRumuz, activePin);
        if (!renameRes.success) {
          setStatusMsg({ type: 'error', text: renameRes.errorMsg || 'Rumuz değiştirilemedi.' });
          setIsSaving(false);
          return;
        }

        // If new PIN was also provided, update it
        if (newPinInput.trim()) {
          await updateRumuzCustomization(trimmedNewRumuz, activePin, { pin: newPinInput.trim() });
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('kpss3d_active_rumuz', trimmedNewRumuz);
          if (newPinInput.trim()) localStorage.setItem('kpss3d_active_pin', newPinInput.trim());
        }

        setStatusMsg({ type: 'success', text: `🎉 Rumuzunuz başarıyla '${trimmedNewRumuz}' olarak güncellendi!` });
        if (onProfileUpdated) onProfileUpdated(trimmedNewRumuz, newPinInput.trim() || activePin);
        setIsSaving(false);
        return;
      }

      // If only PIN or customization is changing
      const updates: Record<string, unknown> = {
        avatarIcon,
        avatarBg,
        equippedTitle
      };
      if (newPinInput.trim()) {
        updates.pin = newPinInput.trim();
      }

      const updateRes = await updateRumuzCustomization(currentRumuz, activePin, updates);
      if (!updateRes.success) {
        // Fallback: save or create profile
        await saveRumuzProfile(currentRumuz, activePin, updates);
      }

      if (newPinInput.trim() && typeof window !== 'undefined') {
        localStorage.setItem('kpss3d_active_pin', newPinInput.trim());
      }

      setStatusMsg({ type: 'success', text: '✅ Profil ayarlarınız ve görünümünüz başarıyla buluta kaydedildi.' });
      if (onProfileUpdated) onProfileUpdated(currentRumuz, newPinInput.trim() || activePin);
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      const message = err instanceof Error ? err.message : 'Kaydetme sırasında bir hata oluştu.';
      setStatusMsg({ type: 'error', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Avatar or Title instant select
  const handleSelectAvatarIcon = (icon: string) => {
    setAvatarIcon(icon);
    // Background cloud sync
    if (currentRumuz && (currentPin || pinInput)) {
      updateRumuzCustomization(currentRumuz, currentPin || pinInput, { avatarIcon: icon }).catch(() => {});
    }
  };

  const handleSelectAvatarBg = (themeId: string) => {
    setAvatarBg(themeId);
    if (currentRumuz && (currentPin || pinInput)) {
      updateRumuzCustomization(currentRumuz, currentPin || pinInput, { avatarBg: themeId }).catch(() => {});
    }
  };

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

      // Clear local state
      clearAllUserData();
      setStatusMsg({ type: 'success', text: '🗑️ Hesabınız ve tüm bulut verileriniz kalıcı olarak silindi.' });

      setTimeout(() => {
        if (onProfileDeleted) onProfileDeleted();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error('Account delete error:', err);
      setStatusMsg({ type: 'error', text: 'Silme işlemi sırasında hata oluştu.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#09090b] border-2 border-indigo-500/40 rounded-2xl max-w-2xl w-full p-4 sm:p-5 text-slate-100 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Live Avatar Preview */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-3">
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
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-white tracking-wide truncate">
                {newRumuzInput || currentRumuz}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30 shrink-0">
                {prestige.pinIcon} {prestige.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aktif Ünvan: <span className="text-amber-300 font-extrabold">{equippedTitle}</span> • {unlockedBadges.length} Rozet • {duelStats.duelWins} Düello Zaferi
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMsg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in zoom-in-95 duration-150 ${
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

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">
          <button
            onClick={() => { setActiveTab('customize'); setStatusMsg(null); }}
            className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-black ${
              activeTab === 'customize' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Görünüm &amp; Rumuz</span>
          </button>

          <button
            onClick={() => { setActiveTab('badges_titles'); setStatusMsg(null); }}
            className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-black ${
              activeTab === 'badges_titles' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Ünvan &amp; Rozetler</span>
          </button>

          <button
            onClick={() => { setActiveTab('account_danger'); setStatusMsg(null); }}
            className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-black ${
              activeTab === 'account_danger' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hesap &amp; Silme</span>
          </button>
        </div>

        {/* TAB 1: CUSTOMIZATION & RUMUZ/PIN UPDATE */}
        {activeTab === 'customize' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Nickname & PIN Change Form */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <h3 className="font-black text-amber-300 flex items-center gap-1.5 text-xs">
                <User className="w-4 h-4 text-amber-400" />
                <span>Rumuz &amp; Güvenlik Şifresi Bilgileri</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Rumuz (Kullanıcı Adı):</label>
                  <input
                    type="text"
                    value={newRumuzInput}
                    onChange={(e) => setNewRumuzInput(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
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
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-indigo-400 tracking-widest"
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
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-indigo-400 tracking-widest"
                  placeholder="Değiştirmek istemiyorsanız boş bırakın"
                />
              </div>

              <button
                onClick={handleSaveProfileInfo}
                disabled={isSaving}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>Rumuz &amp; Şifre Bilgilerini Kaydet</span>
              </button>
            </div>

            {/* Avatar Icon Selector */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-indigo-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  <span>Karakter Avatar İkonu Seçimi</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  Kazanılan Rozet: {unlockedBadges.length} • Düello: {duelStats.duelWins}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {AVATAR_ICONS.map((item) => {
                  const isBadgesMet = !item.minBadgesRequired || unlockedBadges.length >= item.minBadgesRequired;
                  const isDuelMet = !item.minDuelWinsRequired || duelStats.duelWins >= item.minDuelWinsRequired;
                  const isUnlocked = isBadgesMet && isDuelMet;
                  const isSelected = avatarIcon === item.icon;

                  return (
                    <button
                      key={item.id}
                      disabled={!isUnlocked}
                      onClick={() => handleSelectAvatarIcon(item.icon)}
                      title={isUnlocked ? item.label : `Kilitli: ${item.minBadgesRequired ? `${item.minBadgesRequired} Rozet` : ''} ${item.minDuelWinsRequired ? `${item.minDuelWinsRequired} Düello Zaferi` : ''}`}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400 shadow-md scale-105'
                          : isUnlocked
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                          : 'bg-black/40 border-white/5 opacity-40 grayscale cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-[9px] font-bold truncate max-w-full text-center leading-tight">
                        {isUnlocked ? item.label : '🔒 Kilitli'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar Theme & Glow Color */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <span className="font-black text-xs text-indigo-300 block">
                🎨 Avatar Çerçeve &amp; Arka Plan Teması
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVATAR_THEMES.map((theme) => {
                  const isSelected = avatarBg === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleSelectAvatarBg(theme.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400 bg-white/10 shadow-lg'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${theme.bgGradient} border border-white/20 shadow`} />
                      <span className="text-[11px] font-bold text-slate-200 truncate">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRADUATED BADGES & UNLOCKABLE TITLES */}
        {activeTab === 'badges_titles' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Selectable Titles Section */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-300 flex items-center gap-1.5 text-xs">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Kuşanılabilir Resmi Ünvanlar</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  Aktif: <strong className="text-amber-300">{equippedTitle}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
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

                  return (
                    <div
                      key={titleObj.id}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                        isEquipped
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                          : isUnlocked
                          ? 'bg-white/5 hover:bg-white/10 border-white/10'
                          : 'bg-black/40 border-white/5 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg shrink-0">{titleObj.icon}</span>
                          <div className="min-w-0">
                            <div className="font-black text-xs text-white truncate">{titleObj.name}</div>
                            <p className="text-[10px] text-slate-300 truncate">
                              {isUnlocked ? titleObj.desc : titleObj.requiredMetricText}
                            </p>
                          </div>
                        </div>

                        {isUnlocked ? (
                          <button
                            onClick={() => handleEquipTitle(titleObj.name)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 transition-all cursor-pointer ${
                              isEquipped
                                ? 'bg-amber-400 text-slate-950 shadow'
                                : 'bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-slate-200'
                            }`}
                          >
                            {isEquipped ? 'Kuşanıldı ✓' : 'Kuşan'}
                          </button>
                        ) : (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/10 text-slate-400 shrink-0">
                            Kilitli
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

            {/* Graduated Badges Gallery by Tier */}
            <div className="space-y-3">
              <span className="font-black text-xs text-slate-200 block flex items-center justify-between">
                <span>🏅 Kademeli Rozetler Galerisi ({unlockedBadges.length}/{ALL_BADGES.length})</span>
                <span className="text-[10px] text-amber-400 font-extrabold">
                  %{Math.round((unlockedBadges.length / ALL_BADGES.length) * 100)} Tamamlandı
                </span>
              </span>

              {/* Tiers List */}
              {(['diamond', 'gold', 'silver', 'bronze'] as BadgeTier[]).map((tierKey) => {
                const badgesInTier = tierBadges[tierKey];
                if (badgesInTier.length === 0) return null;

                const tierName = {
                  diamond: '💎 Elmas & Efsanevi Seviye',
                  gold: '👑 Altın & Şampiyon Seviye',
                  silver: '🛡️ Gümüş & Uzman Seviye',
                  bronze: '🐣 Bronz & Başlangıç Seviyesi'
                }[tierKey];

                const tierColor = {
                  diamond: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
                  gold: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
                  silver: 'text-slate-300 border-slate-400/40 bg-slate-900/40',
                  bronze: 'text-orange-400 border-orange-500/40 bg-orange-950/20'
                }[tierKey];

                return (
                  <div key={tierKey} className="space-y-2">
                    <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase tracking-wider ${tierColor}`}>
                      {tierName}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {badgesInTier.map((badge) => {
                        const isUnlocked = unlockedBadges.includes(badge.name);
                        const currentProgress = (categoryMasteryProgress && categoryMasteryProgress[badge.trackerKey]) || 0;
                        const target = badge.targetCount || 1;
                        const pct = Math.min(100, Math.round((currentProgress / target) * 100));
                        const remaining = Math.max(0, target - currentProgress);

                        return (
                          <div
                            key={badge.id}
                            className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                              isUnlocked
                                ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/50 shadow-md'
                                : 'bg-white/5 border-white/10 opacity-75'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                                isUnlocked ? 'bg-amber-400 text-slate-950 font-black shadow' : 'bg-white/10 text-slate-500'
                              }`}>
                                {badge.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`font-black text-xs truncate ${isUnlocked ? 'text-amber-300' : 'text-slate-300'}`}>
                                    {badge.name}
                                  </span>
                                  {isUnlocked && (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                                      KAZANILDI ✓
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-300 leading-snug mt-0.5">{badge.desc}</p>
                              </div>
                            </div>

                            {!isUnlocked && (
                              <div className="mt-2 pt-1.5 border-t border-white/10 space-y-1">
                                <div className="flex justify-between items-center text-[9px] text-slate-400">
                                  <span>{badge.reqText}</span>
                                  <span className="font-extrabold text-amber-400">
                                    {currentProgress}/{target} (%{pct})
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
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
        )}

        {/* TAB 3: ACCOUNT & PERMANENT DELETION */}
        {activeTab === 'account_danger' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-3.5 bg-rose-500/10 border-2 border-rose-500/40 rounded-xl space-y-2 text-rose-200">
              <div className="flex items-center gap-2 font-black text-rose-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Kritik İşlem: Hesabı ve Tüm Bulut Verilerini Kalıcı Olarak Sil</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Bu işlem geri alınamaz. Profilinizi sildiğinizde <strong>&apos;{currentRumuz}&apos;</strong> rumuzu, Firestore veritabanındaki tüm test geçmişiniz, rozetleriniz ve düello istatistikleriniz tamamen silinecektir.
              </p>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-300 block">
                  Silme İşlemini Onaylamak İçin PIN Şifrenizi Girin:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    maxLength={8}
                    value={deleteConfirmPin}
                    onChange={(e) => setDeleteConfirmPin(e.target.value)}
                    placeholder="4 haneli PIN şifreniz"
                    className="w-full bg-black/60 border border-rose-500/40 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-rose-300 focus:outline-none focus:border-rose-400 tracking-widest"
                  />
                </div>
              </div>

              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Hesabımı ve Tüm Bulut Kayıtlarımı Kalıcı Olarak Sil</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
