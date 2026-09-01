'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { auth, googleProvider, db } from '@/lib/firebase';
import {
  signInWithPopup,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppStore } from '@/lib/store/useStore';
import { 
  checkRumuzExists, 
  saveRumuzProfile, 
  verifyAndLoadRumuzProfile 
} from '@/lib/rumuzService';
import AvatarWithBadgeFrame from '@/components/ui/AvatarWithBadgeFrame';
import ProfileEditModal from '@/components/ui/ProfileEditModal';
import { 
  LogIn, 
  LogOut, 
  Loader2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Mail, 
  Lock, 
  User as UserIcon,
  KeyRound,
  CloudCheck,
  CheckCircle2,
  Settings
} from 'lucide-react';

export default function AuthUserButton() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [localRumuz, setLocalRumuz] = useState<string | null>(null);
  const [localPin, setLocalPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Custom name & PIN for guest/rumuz auth
  const [customName, setCustomName] = useState('');
  const [customPin, setCustomPin] = useState('');
  const [isExistingRumuzDetected, setIsExistingRumuzDetected] = useState(false);

  // Email auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authTab, setAuthTab] = useState<'guest' | 'email_login' | 'email_register' | 'google'>('guest');

  const {
    score,
    streak,
    totalQuestionsAnswered,
    correctAnswersCount,
    totalDistanceErrorKm,
    pinGuessCount,
    unlockedBadges,
    avatarIcon,
    avatarBg,
    equippedTitle,
    unlockedTitles,
    categoryMasteryProgress,
    duelStats,
    isBlindMapMode,
    regionalStats,
    categoryStats,
    missedItems,
    hydrateUserData
  } = useAppStore();

  // Load saved local rumuz & sync from Cloud Firestore on initial mount
  useEffect(() => {
    setMounted(true);
    async function initRumuzSession() {
      if (typeof window !== 'undefined') {
        const savedRumuz = localStorage.getItem('kpss3d_active_rumuz');
        const savedPin = localStorage.getItem('kpss3d_active_pin');

        if (savedRumuz) {
          setLocalRumuz(savedRumuz);
          setCustomName(savedRumuz);
          if (savedPin) setLocalPin(savedPin);

          // Try fetching latest cloud profile from Firestore across domains
          if (savedPin) {
            const result = await verifyAndLoadRumuzProfile(savedRumuz, savedPin);
            if (result.success && result.profile) {
              const st = useAppStore.getState();
              hydrateUserData({
                score: result.profile.score ?? st.score,
                streak: result.profile.streak ?? st.streak,
                avatarIcon: result.profile.avatarIcon ?? st.avatarIcon,
                avatarBg: result.profile.avatarBg ?? st.avatarBg,
                equippedTitle: result.profile.equippedTitle ?? st.equippedTitle,
                unlockedTitles: result.profile.unlockedTitles ?? st.unlockedTitles,
                totalQuestionsAnswered: result.profile.totalQuestionsAnswered ?? st.totalQuestionsAnswered,
                correctAnswersCount: result.profile.correctAnswersCount ?? st.correctAnswersCount,
                totalDistanceErrorKm: result.profile.totalDistanceErrorKm ?? st.totalDistanceErrorKm,
                pinGuessCount: result.profile.pinGuessCount ?? st.pinGuessCount,
                unlockedBadges: result.profile.unlockedBadges ?? st.unlockedBadges,
                categoryMasteryProgress: result.profile.categoryMasteryProgress ?? st.categoryMasteryProgress,
                duelStats: result.profile.duelStats ?? st.duelStats,
                isBlindMapMode: result.profile.isBlindMapMode ?? st.isBlindMapMode,
                regionalStats: result.profile.regionalStats ?? st.regionalStats,
                categoryStats: result.profile.categoryStats ?? st.categoryStats,
                missedItems: result.profile.missedItems ?? st.missedItems
              });
              setLoading(false);
              return;
            }
          }

          // Fallback to localStorage if offline or PIN mismatch
          try {
            const savedStatsStr = localStorage.getItem('kpss3d_stats_' + savedRumuz);
            if (savedStatsStr) {
              const parsed = JSON.parse(savedStatsStr);
              hydrateUserData(parsed);
            }
          } catch (e) {
            console.warn('Failed to parse local user stats:', e);
          }
        }
      }
      setLoading(false);
    }

    initRumuzSession();
  }, [hydrateUserData]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          const currentState = useAppStore.getState();
          const userRef = doc(db, 'users', currentUser.uid);
          const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'current');
          const userSnap = await getDoc(userRef);
          const progressSnap = await getDoc(progressRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const progData = progressSnap.exists() ? progressSnap.data() : {};

            hydrateUserData({
              score: data.score ?? currentState.score,
              streak: data.streak ?? currentState.streak,
              totalQuestionsAnswered: data.totalQuestionsAnswered ?? currentState.totalQuestionsAnswered,
              correctAnswersCount: data.correctAnswersCount ?? currentState.correctAnswersCount,
              totalDistanceErrorKm: data.totalDistanceErrorKm ?? currentState.totalDistanceErrorKm,
              pinGuessCount: data.pinGuessCount ?? currentState.pinGuessCount,
              unlockedBadges: data.unlockedBadges ?? currentState.unlockedBadges,
              isBlindMapMode: data.isBlindMapMode ?? currentState.isBlindMapMode,
              regionalStats: progData.regionalStats ?? currentState.regionalStats,
              categoryStats: progData.categoryStats ?? currentState.categoryStats,
              missedItems: progData.missedItems ?? currentState.missedItems
            });
          } else {
            await setDoc(userRef, {
              uid: currentUser.uid,
              displayName: currentUser.displayName || localRumuz || 'KPSS Öğrencisi',
              email: currentUser.email || '',
              score: currentState.score,
              streak: currentState.streak,
              totalQuestionsAnswered: currentState.totalQuestionsAnswered,
              correctAnswersCount: currentState.correctAnswersCount,
              totalDistanceErrorKm: currentState.totalDistanceErrorKm,
              pinGuessCount: currentState.pinGuessCount,
              unlockedBadges: currentState.unlockedBadges,
              isBlindMapMode: currentState.isBlindMapMode,
              updatedAt: new Date().toISOString()
            }, { merge: true });

            await setDoc(progressRef, {
              userId: currentUser.uid,
              regionalStats: currentState.regionalStats,
              categoryStats: currentState.categoryStats,
              missedItems: currentState.missedItems,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        } catch (err) {
          console.warn('Firebase sync warning (will fallback to localStorage):', err);
        }
      }
    });

    return () => unsubscribe();
  }, [hydrateUserData, localRumuz]);

  // Sync state to localStorage & Cloud Firestore continuously whenever stats change
  useEffect(() => {
    const activeName = firebaseUser?.displayName || localRumuz;
    if (!activeName || typeof window === 'undefined') return;

    const currentStats = {
      score,
      streak,
      avatarIcon,
      avatarBg,
      equippedTitle,
      unlockedTitles,
      totalQuestionsAnswered,
      correctAnswersCount,
      totalDistanceErrorKm,
      pinGuessCount,
      unlockedBadges,
      categoryMasteryProgress,
      duelStats,
      isBlindMapMode,
      regionalStats,
      categoryStats,
      missedItems
    };

    // 1. Save locally as fallback cache
    try {
      localStorage.setItem('kpss3d_stats_' + activeName, JSON.stringify({
        ...currentStats,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    // 2. Cross-domain Cloud Rumuz Firestore sync
    if (localRumuz && localPin) {
      const rumuzTimer = setTimeout(async () => {
        try {
          await saveRumuzProfile(localRumuz, localPin, currentStats);
        } catch (err) {
          console.warn('Background Rumuz Firestore sync error:', err);
        }
      }, 1500);

      return () => clearTimeout(rumuzTimer);
    }

    // 3. Debounced save to Firebase if logged into Firebase User Account
    if (firebaseUser) {
      const timer = setTimeout(async () => {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || activeName,
            email: firebaseUser.email || '',
            ...currentStats,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          const progressRef = doc(db, 'users', firebaseUser.uid, 'progress', 'current');
          await setDoc(progressRef, {
            userId: firebaseUser.uid,
            regionalStats,
            categoryStats,
            missedItems,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.warn('Background Firebase sync warning:', err);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [firebaseUser, localRumuz, localPin, score, streak, totalQuestionsAnswered, correctAnswersCount, unlockedBadges, isBlindMapMode, pinGuessCount, totalDistanceErrorKm, regionalStats, categoryStats, missedItems, avatarIcon, avatarBg, equippedTitle, unlockedTitles, duelStats, categoryMasteryProgress]);

  // Live Rumuz existence check when user types in the input
  const handleRumuzInputChange = async (val: string) => {
    setCustomName(val);
    setAuthErrorMsg(null);
    setSuccessMsg(null);
    if (val.trim().length >= 3) {
      const res = await checkRumuzExists(val.trim());
      setIsExistingRumuzDetected(res.exists);
    } else {
      setIsExistingRumuzDetected(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthErrorMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (error: unknown) {
      console.error('Sign-in error:', error);
      const err = error as { code?: string; message?: string };
      if (err?.code === 'auth/unauthorized-domain') {
        setAuthErrorMsg('Vercel özel etki alanlarında Google OAuth kısıtlıdır. Yandaki "⚡ Benzersiz Rumuz" seçeneğini kullanarak şifrenizle tüm cihazlardan puanlarınızı eşitleyebilirsiniz!');
      } else {
        setAuthErrorMsg(err?.message || 'Giriş yapılırken bir hata oluştu. Lütfen Rumuz İle Giriş yapın.');
      }
      setShowAuthModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthErrorMsg('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setLoading(true);
    setAuthErrorMsg(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const nameToSet = customName.trim() || email.split('@')[0];
      if (res.user) {
        await updateProfile(res.user, { displayName: nameToSet });
      }
      setLocalRumuz(nameToSet);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kpss3d_active_rumuz', nameToSet);
      }
      setShowAuthModal(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setAuthErrorMsg('Kayıt oluşturulamadı: ' + (err?.message || 'Geçersiz e-posta veya şifre.'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthErrorMsg('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setLoading(true);
    setAuthErrorMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowAuthModal(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setAuthErrorMsg('Giriş başarısız: ' + (err?.message || 'Hatalı e-posta veya şifre.'));
    } finally {
      setLoading(false);
    }
  };

  // Cross-Domain Unique Rumuz + Passcode Handler
  const handleRumuzSignInOrRegister = async () => {
    const nameToSet = customName.trim();
    const pinToSet = customPin.trim();

    if (!nameToSet) {
      setAuthErrorMsg('Lütfen bir rumuz veya isim giriniz.');
      return;
    }

    setLoading(true);
    setAuthErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Check if rumuz exists in Cloud Firestore
      const existCheck = await checkRumuzExists(nameToSet);

      if (existCheck.exists) {
        // CASE A: Rumuz already registered in Cloud Firestore
        if (!pinToSet) {
          setAuthErrorMsg(`🔑 '${nameToSet}' rumuzu bulutta kayıtlı! Lütfen bu rumuza ait 4 haneli PIN / Şifrenizi giriniz.`);
          setLoading(false);
          return;
        }

        const verifyRes = await verifyAndLoadRumuzProfile(nameToSet, pinToSet);
        if (!verifyRes.success || !verifyRes.profile) {
          setAuthErrorMsg(verifyRes.errorMsg || '❌ Hatalı PIN / Şifre!');
          setLoading(false);
          return;
        }

        // Hydrate store with fetched cloud profile stats
        const prof = verifyRes.profile;
        hydrateUserData({
          score: prof.score ?? score,
          streak: prof.streak ?? streak,
          avatarIcon: prof.avatarIcon ?? avatarIcon,
          avatarBg: prof.avatarBg ?? avatarBg,
          equippedTitle: prof.equippedTitle ?? equippedTitle,
          unlockedTitles: prof.unlockedTitles ?? unlockedTitles,
          totalQuestionsAnswered: prof.totalQuestionsAnswered ?? totalQuestionsAnswered,
          correctAnswersCount: prof.correctAnswersCount ?? correctAnswersCount,
          totalDistanceErrorKm: prof.totalDistanceErrorKm ?? totalDistanceErrorKm,
          pinGuessCount: prof.pinGuessCount ?? pinGuessCount,
          unlockedBadges: prof.unlockedBadges ?? unlockedBadges,
          categoryMasteryProgress: prof.categoryMasteryProgress ?? categoryMasteryProgress,
          duelStats: prof.duelStats ?? duelStats,
          isBlindMapMode: prof.isBlindMapMode ?? isBlindMapMode,
          regionalStats: prof.regionalStats ?? regionalStats,
          categoryStats: prof.categoryStats ?? categoryStats,
          missedItems: prof.missedItems ?? missedItems
        });

        // Set active local rumuz & pin
        setLocalRumuz(prof.rumuz);
        setLocalPin(pinToSet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kpss3d_active_rumuz', prof.rumuz);
          localStorage.setItem('kpss3d_active_pin', pinToSet);
        }

        setSuccessMsg(`⚡ HOŞ GELDİN ${prof.rumuz.toUpperCase()}! Tüm geçmişiniz ve rozetleriniz buluttan yüklendi.`);
        setTimeout(() => {
          setShowAuthModal(false);
          setSuccessMsg(null);
        }, 1200);

      } else {
        // CASE B: Rumuz is brand new and available
        if (!pinToSet) {
          setAuthErrorMsg(`🔑 '${nameToSet}' rumuzu henüz kullanılmıyor. Farklı domain ve cihazlardan erişebilmek için lütfen 4 haneli bir Şifre / PIN belirleyin.`);
          setLoading(false);
          return;
        }

        // Create new unique rumuz profile in Cloud Firestore
        const savedProf = await saveRumuzProfile(nameToSet, pinToSet, {
          score,
          streak,
          avatarIcon,
          avatarBg,
          equippedTitle,
          unlockedTitles,
          totalQuestionsAnswered,
          correctAnswersCount,
          totalDistanceErrorKm,
          pinGuessCount,
          unlockedBadges,
          categoryMasteryProgress,
          duelStats,
          isBlindMapMode,
          regionalStats,
          categoryStats,
          missedItems
        });

        setLocalRumuz(savedProf.rumuz);
        setLocalPin(pinToSet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kpss3d_active_rumuz', savedProf.rumuz);
          localStorage.setItem('kpss3d_active_pin', pinToSet);
        }

        // Optional background anonymous auth
        try {
          const anonUser = await signInAnonymously(auth);
          if (anonUser.user) {
            await updateProfile(anonUser.user, { displayName: nameToSet });
          }
        } catch (err) {
          console.warn('Anonymous auth skipped:', err);
        }

        setSuccessMsg(`🎉 BENZERSIZ RUMUZ OLUŞTURULDU: ${savedProf.rumuz}! Puanlarınız ve şifreniz buluta kaydedildi.`);
        setTimeout(() => {
          setShowAuthModal(false);
          setSuccessMsg(null);
        }, 1200);
      }

    } catch (err) {
      console.error('Rumuz processing error:', err);
      setAuthErrorMsg('Sistem hatası oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Sign-out warning:', error);
    }
    setFirebaseUser(null);
    setLocalRumuz(null);
    setLocalPin(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kpss3d_active_rumuz');
      localStorage.removeItem('kpss3d_active_pin');
    }
  };

  const activeDisplayName = firebaseUser?.displayName || localRumuz;

  if (loading) {
    return (
      <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center gap-1 text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
        <span className="hidden sm:inline">Giriş Yapılıyor...</span>
      </div>
    );
  }

  return (
    <>
      {!activeDisplayName ? (
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-lg shadow-indigo-500/20 border border-amber-300/50 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          title="Rumuz Gir veya Geçmiş Yükle"
        >
          <LogIn className="w-4 h-4 text-amber-300" />
          <span>Rumuz Gir / Giriş Yap</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-950/90 to-slate-900/90 border-2 border-amber-400/70 rounded-xl p-1 text-xs font-black shrink-0 shadow-lg">
          <button
            onClick={() => setShowProfileEditModal(true)}
            className="flex items-center gap-2 px-1.5 py-0.5 hover:bg-white/10 rounded-lg transition-all text-left"
            title="Profili Düzenle, Avatarını Değiştir veya Hesabı Yönet"
          >
            <AvatarWithBadgeFrame
              rumuz={activeDisplayName}
              unlockedBadges={unlockedBadges}
              duelWins={duelStats.duelWins}
              avatarIcon={avatarIcon}
              avatarBg={avatarBg}
              equippedTitle={equippedTitle}
              size="sm"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-amber-300 font-black truncate max-w-[90px] leading-tight">
                  {activeDisplayName}
                </span>
                <Settings className="w-3 h-3 text-slate-400 hover:text-amber-300 transition-colors" />
              </div>
              <span className="text-[9px] text-emerald-400 font-bold leading-tight flex items-center gap-0.5">
                <CloudCheck className="w-2.5 h-2.5 text-emerald-300" />
                {equippedTitle}
              </span>
            </div>
          </button>

          <button
            onClick={handleSignOut}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors border-l border-white/10 pl-1.5 pr-1"
            title="Oturumu Kapat / Rumuz Değiştir"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Profile Edit & Account Deletion Modal */}
      {showProfileEditModal && mounted && createPortal(
        <ProfileEditModal
          isOpen={showProfileEditModal}
          onClose={() => setShowProfileEditModal(false)}
          currentRumuz={activeDisplayName || ''}
          currentPin={localPin || ''}
          onProfileUpdated={(newRumuz, newPin) => {
            setLocalRumuz(newRumuz);
            if (newPin) setLocalPin(newPin);
          }}
          onProfileDeleted={() => {
            setLocalRumuz(null);
            setLocalPin(null);
            setFirebaseUser(null);
            setShowProfileEditModal(false);
          }}
        />,
        document.body
      )}

      {/* Auth Selector Modal */}
      {showAuthModal && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            className="bg-[#09090b] border-2 border-amber-400/80 rounded-2xl max-w-md w-full p-5 text-slate-100 shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <div className="p-2 bg-gradient-to-tr from-amber-500 to-emerald-500 rounded-xl text-slate-950 font-black">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Çapraz Domain Benzersiz Rumuz &amp; Geçmiş</h3>
                <p className="text-xs text-slate-400">Rumuzunuzu anahtar/şifre gibi kullanarak tüm domainlerden geçmişinizi yükleyin.</p>
              </div>
            </div>

            {/* Error Banner */}
            {authErrorMsg && (
              <div className="p-3 bg-amber-500/15 border-2 border-amber-400/80 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-black">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Bilgilendirme</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  {authErrorMsg}
                </p>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="p-3 bg-emerald-500/20 border-2 border-emerald-400/80 rounded-xl text-xs space-y-1 text-emerald-300 font-bold flex items-center gap-2 animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">
              <button
                onClick={() => setAuthTab('guest')}
                className={`py-1.5 px-2 rounded-lg transition-all text-[11px] font-black ${
                  authTab === 'guest' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                ⚡ Benzersiz Rumuz
              </button>
              <button
                onClick={() => setAuthTab('email_login')}
                className={`py-1.5 px-2 rounded-lg transition-all text-[11px] font-black ${
                  authTab === 'email_login' || authTab === 'email_register'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ✉️ E-Posta
              </button>
              <button
                onClick={() => setAuthTab('google')}
                className={`py-1.5 px-2 rounded-lg transition-all text-[11px] font-black ${
                  authTab === 'google' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🌐 Google
              </button>
            </div>

            {/* Tab 1: Guest / Unique Rumuz + Passcode Auth */}
            {authTab === 'guest' && (
              <div className="space-y-3 bg-white/5 border border-white/10 p-3.5 rounded-xl animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-300 block flex items-center justify-between">
                    <span>⚡ Rumuz &amp; PIN İle Çapraz Domain Yükle</span>
                    {isExistingRumuzDetected && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                        ● Kayıtlı Rumuz Bulundu
                      </span>
                    )}
                  </label>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Farklı bir domain veya cihazda olsanız dahi, rumuzunuzu ve PIN şifrenizi girerek tüm puan, rozet ve test geçmişinizi anında geri yükleyebilirsiniz!
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Benzersiz Rumuzunuz (örn: emirhan0008)"
                      value={customName}
                      onChange={(e) => handleRumuzInputChange(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      maxLength={8}
                      placeholder={isExistingRumuzDetected ? "4 Haneli PIN / Şifrenizi Girin" : "4 Haneli Şifre / PIN Belirleyin (örn: 1234)"}
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400 tracking-widest"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRumuzSignInOrRegister}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {isExistingRumuzDetected ? '⚡ Rumuz Geçmişini Buluttan Yükle' : '🔒 Rumuz Oluştur & Şifreyle Kaydet'}
                  </span>
                </button>
              </div>
            )}

            {/* Tab 2: Email Sign In / Register */}
            {(authTab === 'email_login' || authTab === 'email_register') && (
              <form
                onSubmit={authTab === 'email_login' ? handleEmailLogin : handleEmailRegister}
                className="space-y-2.5 bg-white/5 border border-white/10 p-3.5 rounded-xl animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300">
                    {authTab === 'email_login' ? '🔑 E-Posta ile Giriş Yap' : '📝 Yeni Hesap Oluştur'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAuthTab(authTab === 'email_login' ? 'email_register' : 'email_login')}
                    className="text-[10px] font-bold text-amber-400 underline hover:text-amber-300"
                  >
                    {authTab === 'email_login' ? 'Hesabın yok mu? Kaydol' : 'Zaten hesabın var mı? Giriş yap'}
                  </button>
                </div>

                {authTab === 'email_register' && (
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Ad Soyad veya Rumuz"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="E-Posta Adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Şifreniz (En az 6 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <span>{authTab === 'email_login' ? 'Giriş Yap' : 'Kayıt Ol ve Giriş Yap'}</span>
                </button>
              </form>
            )}

            {/* Tab 3: Google Sign In */}
            {authTab === 'google' && (
              <div className="space-y-3 bg-white/5 border border-white/10 p-3.5 rounded-xl animate-in fade-in duration-150">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Hesabı İle Giriş Yap</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Google pop-up doğrulaması önizleme ortamlarında çalışır. Vercel yayınlarında Hızlı Rumuz önerilir.
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
