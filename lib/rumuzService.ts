import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface RumuzProfileData {
  rumuz: string;
  rumuzKey: string;
  pin: string;
  score: number;
  streak: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  totalDistanceErrorKm: number;
  pinGuessCount: number;
  unlockedBadges: string[];
  isBlindMapMode: boolean;
  regionalStats: Record<string, { correct: number; wrong: number }>;
  categoryStats: Record<string, { correct: number; wrong: number }>;
  missedItems: Record<string, { id: string; name: string; category: string; region: string; coords: [number, number]; wrongCount: number }>;
  updatedAt: string;
}

/**
 * Normalizes user nickname into a valid Firestore Document ID.
 * Replaces Turkish characters, replaces invalid chars with underscores.
 */
export function normalizeRumuzKey(rumuz: string): string {
  if (!rumuz) return '';
  const turkishMap: Record<string, string> = {
    'Ç': 'c', 'ç': 'c',
    'Ğ': 'g', 'ğ': 'g',
    'I': 'i', 'ı': 'i',
    'İ': 'i', 'i': 'i',
    'Ö': 'o', 'ö': 'o',
    'Ş': 's', 'ş': 's',
    'Ü': 'u', 'ü': 'u'
  };

  let cleaned = rumuz.trim();
  cleaned = cleaned.split('').map(char => turkishMap[char] || char).join('');
  cleaned = cleaned.toLowerCase();
  cleaned = cleaned.replace(/[^a-z0-9_\-]/g, '_');
  cleaned = cleaned.replace(/_+/g, '_');
  cleaned = cleaned.replace(/^_+|_+$/g, '');
  
  return cleaned || 'kpss_ogrencisi';
}

/**
 * Checks if a rumuz exists in Firestore.
 */
export async function checkRumuzExists(rumuz: string): Promise<{ exists: boolean; profile?: RumuzProfileData }> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  try {
    const snap = await getDoc(doc(db, 'rumuzes', key));
    if (snap.exists()) {
      return { exists: true, profile: snap.data() as RumuzProfileData };
    }
    return { exists: false };
  } catch (error) {
    console.warn('Rumuz check error:', error);
    handleFirestoreError(error, OperationType.GET, path);
    return { exists: false };
  }
}

/**
 * Registers or updates a unique rumuz profile in Firestore with PIN protection.
 */
export async function saveRumuzProfile(
  rumuz: string,
  pin: string,
  stats: Omit<RumuzProfileData, 'rumuz' | 'rumuzKey' | 'pin' | 'updatedAt'>
): Promise<RumuzProfileData> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  
  const payload: RumuzProfileData = {
    rumuz: rumuz.trim(),
    rumuzKey: key,
    pin: pin.trim(),
    score: stats.score || 0,
    streak: stats.streak || 0,
    totalQuestionsAnswered: stats.totalQuestionsAnswered || 0,
    correctAnswersCount: stats.correctAnswersCount || 0,
    totalDistanceErrorKm: stats.totalDistanceErrorKm || 0,
    pinGuessCount: stats.pinGuessCount || 0,
    unlockedBadges: stats.unlockedBadges || ['3D Coğrafyacı Çırağı'],
    isBlindMapMode: !!stats.isBlindMapMode,
    regionalStats: stats.regionalStats || {},
    categoryStats: stats.categoryStats || {},
    missedItems: stats.missedItems || {},
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'rumuzes', key), payload, { merge: true });
    return payload;
  } catch (error) {
    console.error('Rumuz save error:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Loads cloud profile for rumuz if PIN matches.
 */
export async function verifyAndLoadRumuzProfile(
  rumuz: string,
  pin: string
): Promise<{ success: boolean; profile?: RumuzProfileData; errorMsg?: string }> {
  const key = normalizeRumuzKey(rumuz);
  const path = `rumuzes/${key}`;
  try {
    const snap = await getDoc(doc(db, 'rumuzes', key));
    if (!snap.exists()) {
      return { success: false, errorMsg: `'${rumuz}' adında bir rumuz bulunamadı. Yeni rumuz oluşturabilirsiniz.` };
    }

    const data = snap.data() as RumuzProfileData;
    if (data.pin && data.pin !== pin.trim()) {
      return { success: false, errorMsg: 'Hatalı PIN / Şifre! Lütfen doğru rumuz şifresini girin.' };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Rumuz verification error:', error);
    handleFirestoreError(error, OperationType.GET, path);
    return { success: false, errorMsg: 'Veritabanı bağlantı hatası.' };
  }
}
