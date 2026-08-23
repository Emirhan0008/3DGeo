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
import { LogIn, LogOut, Loader2, AlertTriangle, ShieldCheck, Sparkles, X, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function AuthUserButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRumuz = typeof window !== 'undefined' ? localStorage.getItem('kpss3d_rumuz') : null;
    if (savedRumuz) {
      setCustomName(savedRumuz);
    }
  }, []);
  
  // Custom name for guest/email
  const [customName, setCustomName] = useState('');
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
    isBlindMapMode,
    regionalStats,
    categoryStats,
    missedItems,
    hydrateUserData
  } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const progressRef = doc(db, 'users', currentUser.uid, 'progress', 'current');
        try {
          const userSnap = await getDoc(userRef);
          const progressSnap = await getDoc(progressRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const progData = progressSnap.exists() ? progressSnap.data() : {};

            hydrateUserData({
              score: data.score ?? score,
              streak: data.streak ?? streak,
              totalQuestionsAnswered: data.totalQuestionsAnswered ?? totalQuestionsAnswered,
              correctAnswersCount: data.correctAnswersCount ?? correctAnswersCount,
              totalDistanceErrorKm: data.totalDistanceErrorKm ?? totalDistanceErrorKm,
              pinGuessCount: data.pinGuessCount ?? pinGuessCount,
              unlockedBadges: data.unlockedBadges ?? unlockedBadges,
              isBlindMapMode: data.isBlindMapMode ?? isBlindMapMode,
              regionalStats: progData.regionalStats ?? regionalStats,
              categoryStats: progData.categoryStats ?? categoryStats,
              missedItems: progData.missedItems ?? missedItems
            });
          } else {
            await setDoc(userRef, {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'KPSS Öğrencisi',
              email: currentUser.email || '',
              score,
              streak,
              totalQuestionsAnswered,
              correctAnswersCount,
              totalDistanceErrorKm,
              pinGuessCount,
              unlockedBadges,
              isBlindMapMode,
              updatedAt: new Date().toISOString()
            });

            await setDoc(progressRef, {
              userId: currentUser.uid,
              regionalStats,
              categoryStats,
              missedItems,
              updatedAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn('Error fetching or initializing user profile from Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setAuthErrorMsg('Vercel özel etki alanlarında (3-d-geo.vercel.app) Google OAuth izni yetkisi kısıtlıdır. E-Posta veya Misafir Girişi ile saniyeler içinde tüm puanlarınızı buluta kaydedebilirsiniz!');
      } else {
        setAuthErrorMsg(err?.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
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

  const handleGuestSignIn = async () => {
    setLoading(true);
    setAuthErrorMsg(null);
    try {
      const anonUser = await signInAnonymously(auth);
      const nameToSet = customName.trim() || 'KPSS Öğrencisi';
      if (typeof window !== 'undefined') {
        localStorage.setItem('kpss3d_rumuz', nameToSet);
      }
      if (anonUser.user) {
        await updateProfile(anonUser.user, {
          displayName: nameToSet
        });
      }
      setShowAuthModal(false);
    } catch (error: unknown) {
      console.error('Guest sign-in error:', error);
      const err = error as { message?: string };
      setAuthErrorMsg('Rumuz ile giriş sırasında hata oluştu: ' + (err?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || customName || 'KPSS Öğrencisi',
          email: user.email || '',
          score,
          streak,
          totalQuestionsAnswered,
          correctAnswersCount,
          totalDistanceErrorKm,
          pinGuessCount,
          unlockedBadges,
          isBlindMapMode,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        const progressRef = doc(db, 'users', user.uid, 'progress', 'current');
        await setDoc(progressRef, {
          userId: user.uid,
          regionalStats,
          categoryStats,
          missedItems,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error('Error syncing user stats to Firebase:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, score, streak, totalQuestionsAnswered, correctAnswersCount, unlockedBadges, isBlindMapMode, pinGuessCount, totalDistanceErrorKm, regionalStats, categoryStats, missedItems, customName]);

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
      {!user ? (
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-lg shadow-indigo-500/20 border border-amber-300/50 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          title="Giriş Yap & İlerlemeni Bulutta Sakla"
        >
          <LogIn className="w-4 h-4 text-amber-300" />
          <span>Giriş Yap</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-950/80 to-slate-900/80 border-2 border-indigo-400/60 rounded-xl px-2.5 py-1 text-xs font-black shrink-0 shadow-md">
          <div className="flex items-center gap-1.5">
            {user.photoURL ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full border border-indigo-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                {user.displayName?.[0] || 'Ö'}
              </div>
            )}
            <span className="text-amber-300 font-black truncate max-w-[90px]">
              {user.displayName?.split(' ')[0] || 'Öğrenci'}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors ml-1 border-l border-white/10 pl-1.5"
            title="Oturumu Kapat"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Auth Selector Modal */}
      {showAuthModal && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border-2 border-amber-400/80 rounded-2xl max-w-md w-full p-5 text-slate-100 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <div className="p-2 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl text-slate-950 font-black">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">3D Coğrafya Oturum Açma</h3>
                <p className="text-xs text-slate-400">Tüm puanlarını, rozetlerini ve test kayıtlarını kaydet.</p>
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

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">
              <button
                onClick={() => setAuthTab('guest')}
                className={`py-1.5 px-2 rounded-lg transition-all text-[11px] font-black ${
                  authTab === 'guest' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                ⚡ Hızlı Misafir
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

            {/* Tab 1: Guest Sign In */}
            {authTab === 'guest' && (
              <div className="space-y-3 bg-white/5 border border-white/10 p-3.5 rounded-xl animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-300 block">
                    ⚡ Misafir Öğrenci Modu
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Şifre veya e-posta gerekmez. İsim girerek hemen başlayın, ilerlemeniz bulutta kaydedilir.
                  </p>
                </div>

                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Adınızı veya Rumuzunuzu Yazın"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  onClick={handleGuestSignIn}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Anında Misafir Girişi Yap</span>
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
                      placeholder="Ad Soyad"
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
                  Google pop-up doğrulaması AI Studio Önizleme ortamlarında doğrudan çalışır.
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


