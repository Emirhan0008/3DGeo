'use client';

import React, { useEffect, useState } from 'react';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAppStore } from '@/lib/store/useStore';
import { LogIn, LogOut, User as UserIcon, Loader2 } from 'lucide-react';

export default function AuthUserButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign-in error:', error);
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
          displayName: user.displayName || 'KPSS Öğrencisi',
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
  }, [user, score, streak, totalQuestionsAnswered, correctAnswersCount, unlockedBadges, isBlindMapMode, pinGuessCount, totalDistanceErrorKm, regionalStats, categoryStats, missedItems]);

  if (loading) {
    return (
      <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-[11px] shadow-md flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        title="Google ile Giriş Yap & Bulut Yedeklemeyi Aç"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Giriş Yap</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-[11px] font-bold shrink-0">
      <div className="flex items-center gap-1">
        {user.photoURL ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full border border-indigo-400" />
        ) : (
          <UserIcon className="w-4 h-4 text-indigo-400" />
        )}
        <span className="text-slate-200 font-bold hidden md:inline truncate max-w-[80px]">
          {user.displayName?.split(' ')[0] || 'Öğrenci'}
        </span>
      </div>

      <button
        onClick={handleSignOut}
        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
        title="Oturumu Kapat"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
