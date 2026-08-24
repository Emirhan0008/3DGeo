'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { 
  findOrCreateQuickMatch, 
  joinPrivateDuelRoom, 
  createDuelRoom, 
  startBotDuel,
  submitPlayerGuess,
  submitPlayerQuizAnswer,
  advanceDuelRound, 
  voteToAdvanceDuelRound,
  leaveOrCancelDuel, 
  subscribeToDuel,
  getQuestionsByIds,
  handleRoundTimeout,
  calculateDuelScore,
  DistanceScoreBreakdown
} from '@/lib/duelService';
import { checkRumuzExists, saveRumuzProfile, normalizeRumuzKey } from '@/lib/rumuzService';
import { 
  PinGameQuestion, 
  MultipleChoiceQuestion, 
  cleanFeatureTitle 
} from '@/lib/data/quizQuestions';
import { 
  Swords, 
  Users, 
  KeyRound, 
  Bot, 
  Trophy, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Crosshair, 
  ChevronRight,
  RefreshCw,
  MapPin,
  BookOpen
} from 'lucide-react';

const PIN_CATEGORIES = [
  { id: 'Genel', label: 'Genel Karma (216+ Yer Şekli)', icon: '🌟' },
  { id: 'Dağlar', label: 'Dağlar & Masifler', icon: '⛰️' },
  { id: 'Akarsular', label: 'Akarsular & Nehirler', icon: '🌊' },
  { id: 'Göller', label: 'Göller & Doğal Göller', icon: '💧' },
  { id: 'Madenler', label: 'Madenler & Enerji', icon: '⛏️' },
  { id: 'Geçitler', label: 'Geçitler & Boğazlar', icon: '🛣️' },
  { id: 'Sınır Kapıları', label: 'Sınır Kapıları', icon: '🚪' },
  { id: 'Platolar & Ovalar', label: 'Platolar & Ovalar', icon: '🌾' },
  { id: 'Karstik & Kıyı', label: 'Karstik & Kıyılar', icon: '🏖️' }
];

const QUIZ_CATEGORIES = [
  { id: 'Genel', label: 'Genel Coğrafya Soru Havuzu', icon: '📚' },
  { id: 'Fiziki', label: 'Türkiye Fiziki Coğrafyası', icon: '🗺️' },
  { id: 'İklim', label: 'İklim, Bitki Örtüsü & Toprak', icon: '⛅' },
  { id: 'Nüfus', label: 'Nüfus, Yerleşme & Göç', icon: '👥' },
  { id: 'Ekonomik', label: 'Tarım, Hayvancılık & Madenler', icon: '🏭' },
  { id: 'Ulaşım', label: 'Ulaşım, Ticaret & Turizm', icon: '🚢' },
  { id: 'Bölgeler', label: 'Coğrafi Bölgeler & Özellikler', icon: '🏛️' }
];

export default function DuelMode() {
  const {
    setActiveTab,
    activeDuelSession,
    setActiveDuelSession,
    activeDuelPlayerKey,
    setActiveDuelPlayerKey,
    flyToCoords
  } = useAppStore();

  // Local user profile state (Rumuz + PIN)
  const [rumuz, setRumuz] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isAuthSaved, setIsAuthSaved] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Mode Type Tab (Map Pin vs KPSS Multiple Choice Quiz)
  const [gameModeType, setGameModeType] = useState<'pin' | 'quiz'>('pin');

  // Matchmaking / Lobby setup state
  const [selectedCategory, setSelectedCategory] = useState<string>('Genel');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<10 | 20 | 30>(10);
  const [lobbyTab, setLobbyTab] = useState<'quick' | 'private_create' | 'private_join' | 'bot'>('quick');
  const [joinRoomCodeInput, setJoinRoomCodeInput] = useState('');
  const [joinRoomPinInput, setJoinRoomPinInput] = useState('');
  const [createRoomPinInput, setCreateRoomPinInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lobbyError, setLobbyError] = useState<string | null>(null);

  // Match Timer & Timing Sync state
  const [timeLeftSec, setTimeLeftSec] = useState<number>(15);
  const [roundQuestions, setRoundQuestions] = useState<(PinGameQuestion | MultipleChoiceQuestion)[]>([]);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [revealCountdown, setRevealCountdown] = useState<number>(7);
  const [lastRoundScore, setLastRoundScore] = useState<DistanceScoreBreakdown | null>(null);
  const [opponentRoundScore, setOpponentRoundScore] = useState<DistanceScoreBreakdown | null>(null);

  // Selected Option in Quiz Mode
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  // Bot auto-play ref
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check saved rumuz / PIN on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedR = localStorage.getItem('kpss3d_active_rumuz');
      const savedP = localStorage.getItem('kpss3d_active_pin');
      if (savedR && savedP) {
        setRumuz(savedR);
        setPin(savedP);
        setIsAuthSaved(true);
      }
    }
  }, []);

  // Handle Rumuz & PIN verification
  const handleSaveRumuz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumuz.trim() || rumuz.trim().length < 2) {
      setAuthError('Rumuz en az 2 karakter olmalıdır.');
      return;
    }
    if (!pin.trim() || pin.trim().length < 3) {
      setAuthError('Şifre / PIN en az 3 karakter olmalıdır.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const check = await checkRumuzExists(rumuz);
      if (check.exists && check.profile) {
        if (check.profile.pin && check.profile.pin !== pin.trim()) {
          setAuthError('Bu rumuz daha önce kayıt edilmiş. Girdiğiniz şifre hatalı!');
          setAuthLoading(false);
          return;
        }
      } else {
        await saveRumuzProfile(rumuz, pin, {
          score: 0,
          streak: 0,
          totalQuestionsAnswered: 0,
          correctAnswersCount: 0,
          totalDistanceErrorKm: 0,
          pinGuessCount: 0,
          unlockedBadges: ['3D Düellocu Adayı'],
          isBlindMapMode: false,
          regionalStats: {},
          categoryStats: {},
          missedItems: {}
        });
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kpss3d_active_rumuz', rumuz.trim());
        localStorage.setItem('kpss3d_active_pin', pin.trim());
      }
      setIsAuthSaved(true);
    } catch {
      setAuthError('Giriş yapılırken bağlantı hatası oluştu.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Subscribe to real-time duel session
  useEffect(() => {
    if (!activeDuelSession?.id) return;

    const unsubscribe = subscribeToDuel(activeDuelSession.id, (updatedDuel) => {
      if (!updatedDuel) {
        setActiveDuelSession(null);
        setActiveDuelPlayerKey(null);
        return;
      }

      setActiveDuelSession(updatedDuel);

      // Determine player key
      const myId = normalizeRumuzKey(rumuz);
      if (updatedDuel.player1.id === myId || updatedDuel.player1.rumuz === rumuz) {
        setActiveDuelPlayerKey('player1');
      } else if (updatedDuel.player2?.id === myId || updatedDuel.player2?.rumuz === rumuz) {
        setActiveDuelPlayerKey('player2');
      }

      // Load questions if not loaded
      if (updatedDuel.questionIds && updatedDuel.questionIds.length > 0) {
        const questions = getQuestionsByIds(updatedDuel.questionIds, updatedDuel.gameType || 'pin');
        setRoundQuestions(questions);
      }
    });

    return () => unsubscribe();
  }, [activeDuelSession?.id, rumuz, setActiveDuelSession, setActiveDuelPlayerKey]);

  // Handle Synchronized 10s Pre-Match Countdown, In-Round Timer & 7s Reveal
  useEffect(() => {
    if (!activeDuelSession) return;

    // 1. Starting 10-Second Countdown phase
    if (activeDuelSession.status === 'starting') {
      const diffMs = (activeDuelSession.roundStartTime || Date.now()) - Date.now();
      const secLeft = Math.max(1, Math.ceil(diffMs / 1000));
      setCountdownNum(secLeft);

      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((activeDuelSession.roundStartTime - Date.now()) / 1000));
        setCountdownNum(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          setCountdownNum(null);
          // If host, advance to in_progress
          if (activeDuelPlayerKey === 'player1') {
            advanceDuelRound({ ...activeDuelSession, currentRound: -1 });
          }
        }
      }, 500);

      return () => clearInterval(timer);
    }

    // 2. In progress 15s round timer & Bot behavior
    if (activeDuelSession.status === 'in_progress') {
      setCountdownNum(null);
      setSelectedQuizOption(null);
      const startMs = activeDuelSession.roundStartTime || Date.now();
      const limitSec = activeDuelSession.roundTimeLimit || 15;

      const calcRemaining = () => {
        const elapsedSec = (Date.now() - startMs) / 1000;
        const remain = Math.max(0, limitSec - elapsedSec);
        return Math.round(remain * 10) / 10;
      };

      setTimeLeftSec(calcRemaining());

      const interval = setInterval(() => {
        const remain = calcRemaining();
        setTimeLeftSec(remain);

        // Round timeout
        if (remain <= 0) {
          clearInterval(interval);
          const currentQ = roundQuestions[activeDuelSession.currentRound];
          const coords = currentQ && 'targetCoords' in currentQ ? currentQ.targetCoords : undefined;
          if (activeDuelPlayerKey === 'player1') {
            handleRoundTimeout(activeDuelSession, coords);
          }
        }
      }, 100);

      // Bot AI auto-play simulation
      if (activeDuelSession.player2?.isBot && !activeDuelSession.player2.currentGuess) {
        if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
        const randomThinkSec = 2.5 + Math.random() * 5.5;

        botTimeoutRef.current = setTimeout(() => {
          const currentQ = roundQuestions[activeDuelSession.currentRound];
          if (!currentQ || activeDuelSession.status !== 'in_progress') return;

          // A. Pin Game Bot Simulation
          if ((activeDuelSession.gameType || 'pin') === 'pin' && 'targetCoords' in currentQ && currentQ.targetCoords) {
            const scatterLat = (Math.random() - 0.5) * 0.8;
            const scatterLng = (Math.random() - 0.5) * 1.2;
            const botGuessCoords: [number, number] = [
              currentQ.targetCoords[0] + scatterLng,
              currentQ.targetCoords[1] + scatterLat
            ];
            submitPlayerGuess(activeDuelSession, 'kpss_ai_bot', botGuessCoords, currentQ.targetCoords, randomThinkSec);
          } 
          // B. Quiz Test Game Bot Simulation
          else if (activeDuelSession.gameType === 'quiz' && 'options' in currentQ) {
            // 75% accuracy for AI Bot
            const willBeCorrect = Math.random() < 0.75;
            let botChoice = currentQ.correctIndex;
            if (!willBeCorrect) {
              const wrongOptions = [0, 1, 2, 3].filter(idx => idx !== currentQ.correctIndex);
              botChoice = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
            }
            submitPlayerQuizAnswer(activeDuelSession, 'kpss_ai_bot', botChoice, currentQ.correctIndex, randomThinkSec);
          }
        }, randomThinkSec * 1000);
      }

      return () => {
        clearInterval(interval);
        if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      };
    }

    // 3. Round reveal phase (7 seconds display, auto advance, or advance if both press İlerle)
    if (activeDuelSession.status === 'round_reveal') {
      const myPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1 : activeDuelSession.player2;
      const otherPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player2 : activeDuelSession.player1;

      if ((activeDuelSession.gameType || 'pin') === 'pin') {
        if (myPlayer?.currentGuess) {
          const breakdown = calculateDuelScore(myPlayer.currentGuess.distanceKm, myPlayer.currentGuess.timeTakenSec);
          setLastRoundScore(breakdown);
        }
        if (otherPlayer?.currentGuess) {
          const breakdown = calculateDuelScore(otherPlayer.currentGuess.distanceKm, otherPlayer.currentGuess.timeTakenSec);
          setOpponentRoundScore(breakdown);
        }

        // Auto camera focus on target coords
        const currentQ = roundQuestions[activeDuelSession.currentRound];
        if (currentQ && 'targetCoords' in currentQ && currentQ.targetCoords) {
          flyToCoords(currentQ.targetCoords, 0, 0, 6.8);
        }
      }

      const revealStart = activeDuelSession.bothAnsweredAt || Date.now();
      const REVEAL_DURATION_SEC = 7;

      const updateTicker = () => {
        const elapsed = (Date.now() - revealStart) / 1000;
        const remain = Math.max(0, Math.ceil(REVEAL_DURATION_SEC - elapsed));
        setRevealCountdown(remain);
        return remain;
      };

      updateTicker();

      const revealTicker = setInterval(() => {
        const remain = updateTicker();
        if (remain <= 0) {
          clearInterval(revealTicker);
          if (activeDuelPlayerKey === 'player1' || activeDuelSession.player2?.isBot) {
            advanceDuelRound(activeDuelSession);
          }
        }
      }, 300);

      return () => {
        clearInterval(revealTicker);
      };
    }
  }, [
    activeDuelSession,
    activeDuelPlayerKey, 
    roundQuestions, 
    flyToCoords
  ]);

  // Handle Quick Match Finding
  const handleStartQuickMatch = async () => {
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const res = await findOrCreateQuickMatch(
        { id: myId, rumuz, rumuzKey: myId },
        { 
          gameType: gameModeType,
          questionCount: selectedQuestionCount, 
          categoryFilter: selectedCategory 
        }
      );
      setActiveDuelSession(res.duel);
    } catch {
      setLobbyError('Hızlı eşleşme aranırken bağlantı hatası oluştu.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Private Room Creation
  const handleCreatePrivateRoom = async () => {
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const session = await createDuelRoom(
        { id: myId, rumuz, rumuzKey: myId },
        {
          mode: 'private',
          gameType: gameModeType,
          questionCount: selectedQuestionCount,
          categoryFilter: selectedCategory,
          roomPin: createRoomPinInput
        }
      );
      setActiveDuelSession(session);
    } catch {
      setLobbyError('Özel oda kurulurken hata oluştu.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Joining Private Room
  const handleJoinPrivateRoom = async () => {
    if (!joinRoomCodeInput.trim()) {
      setLobbyError('Lütfen 6 haneli oda kodunu girin (Örn: TR-4921)');
      return;
    }
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const res = await joinPrivateDuelRoom(
        joinRoomCodeInput,
        { id: myId, rumuz, rumuzKey: myId },
        joinRoomPinInput
      );
      if (!res.success || !res.duel) {
        setLobbyError(res.errorMsg || 'Odaya bağlanılamadı.');
      } else {
        setActiveDuelSession(res.duel);
      }
    } catch {
      setLobbyError('Odaya katılırken hata oluştu.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Bot Practice Game
  const handleStartBotDuel = async () => {
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const session = await startBotDuel(
        { id: myId, rumuz, rumuzKey: myId },
        { 
          gameType: gameModeType,
          questionCount: selectedQuestionCount, 
          categoryFilter: selectedCategory 
        }
      );
      setActiveDuelSession(session);
    } catch {
      setLobbyError('Antrenman modu başlatılamadı.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Leave or Cancel
  const handleLeaveDuel = async () => {
    if (activeDuelSession) {
      await leaveOrCancelDuel(activeDuelSession.id);
    }
    setActiveDuelSession(null);
    setActiveDuelPlayerKey(null);
    setSelectedQuizOption(null);
  };

  // Copy Room Code to clipboard
  const handleCopyCode = () => {
    if (activeDuelSession?.roomCode) {
      navigator.clipboard.writeText(activeDuelSession.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Handle Quiz Option Selection
  const handleSelectQuizOption = (optionIndex: number) => {
    if (!activeDuelSession || activeDuelSession.status !== 'in_progress') return;
    const myPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1 : activeDuelSession.player2;
    if (!myPlayer || myPlayer.currentGuess || selectedQuizOption !== null) return;

    setSelectedQuizOption(optionIndex);
    const currentQ = roundQuestions[activeDuelSession.currentRound] as MultipleChoiceQuestion;
    if (!currentQ || !('correctIndex' in currentQ)) return;

    const startMs = activeDuelSession.roundStartTime || Date.now();
    const timeTakenSec = Math.max(0.5, Math.round(((Date.now() - startMs) / 1000) * 10) / 10);

    submitPlayerQuizAnswer(
      activeDuelSession, 
      myPlayer.id, 
      optionIndex, 
      currentQ.correctIndex, 
      timeTakenSec
    );
  };

  // -------------------------------------------------------------
  // 1. RUMUZ & ŞİFRE GİRİŞ EKRANI (Eğer kullanıcı henüz kaydolmadıysa)
  // -------------------------------------------------------------
  if (!isAuthSaved) {
    return (
      <div 
        id="duel-auth-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveTab('map');
        }}
        className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-[#09090b]/95 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Swords className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-black text-amber-400">1v1 Canlı KPSS Düellosu</h2>
                <p className="text-xs text-slate-300">Rumuz ve şifrenizi belirleyerek arenaya adım atın</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
              title="Kapat ve Haritaya Dön"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveRumuz} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Düello Rumuzu (Kullanıcı Adı)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rumuz}
                  onChange={(e) => setRumuz(e.target.value)}
                  placeholder="Örn: CografyaKrali, HaritaUstasi"
                  maxLength={16}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-amber-300 font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Güvenlik Şifresi / PIN (Skorlarınızı korur)
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="En az 3 haneli şifre"
                maxLength={20}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <span>Arenaya Katıl</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DÜELLO LOBİSİ (Harita Düellosu vs KPSS Testi Sekmeleri & Lobi Seçenekleri)
  // -------------------------------------------------------------
  if (!activeDuelSession) {
    const activeCategories = gameModeType === 'pin' ? PIN_CATEGORIES : QUIZ_CATEGORIES;

    return (
      <div 
        id="duel-lobby-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setActiveTab('map');
          }
        }}
        className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex flex-col items-center justify-center cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="w-full max-w-2xl bg-[#09090b]/95 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-white my-auto cursor-default"
        >
          {/* Header & User Info */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-amber-400 tracking-tight flex items-center gap-2">
                  <span>1v1 Canlı Düello Arenası</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-[10px] font-extrabold uppercase">
                    Canlı
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Oyuncu: <strong className="text-amber-300">{rumuz}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('map')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
              title="Haritaya Dön"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* GAME TYPE SELECTOR TABS (Harita Nokta Atışı vs KPSS Test Soru Yarışması) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-4">
            <button
              onClick={() => {
                setGameModeType('pin');
                setSelectedCategory('Genel');
              }}
              className={`py-2.5 px-3 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gameModeType === 'pin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Harita Nokta Atışı Düellosu</span>
            </button>

            <button
              onClick={() => {
                setGameModeType('quiz');
                setSelectedCategory('Genel');
              }}
              className={`py-2.5 px-3 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gameModeType === 'quiz'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>KPSS Test Soru Düellosu</span>
            </button>
          </div>

          {/* Soru Sayısı & Havuz Seçimi */}
          <div className="space-y-3 mb-4">
            {/* Soru Sayısı */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1 uppercase tracking-wider">
                1. Soru Sayısı
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([10, 20, 30] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedQuestionCount(count)}
                    className={`py-1.5 px-3 rounded-xl font-black text-xs sm:text-sm border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedQuestionCount === count
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{count} Soru</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kategori / Soru Havuzu */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1 uppercase tracking-wider">
                2. Soru Havuzu / Kategori
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-1.5 truncate cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400 shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mod Seçim Tabları (Hızlı Eşleşme / Özel Oda Kur / Odaya Katıl / Bot) */}
          <div className="border-t border-white/10 pt-3">
            <div className="flex border-b border-white/10 mb-3 overflow-x-auto scrollbar-none gap-1">
              <button
                onClick={() => setLobbyTab('quick')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  lobbyTab === 'quick'
                    ? 'bg-amber-500 text-slate-950 border-b-2 border-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Rastgele Rakip Bul</span>
              </button>

              <button
                onClick={() => setLobbyTab('private_create')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  lobbyTab === 'private_create'
                    ? 'bg-amber-500 text-slate-950 border-b-2 border-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Arkadaş Odası Kur</span>
              </button>

              <button
                onClick={() => setLobbyTab('private_join')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  lobbyTab === 'private_join'
                    ? 'bg-amber-500 text-slate-950 border-b-2 border-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Koda Katıl</span>
              </button>

              <button
                onClick={() => setLobbyTab('bot')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  lobbyTab === 'bot'
                    ? 'bg-amber-500 text-slate-950 border-b-2 border-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Yapay Zeka Botu</span>
              </button>
            </div>

            {/* Tab 1: Hızlı Eşleşme */}
            {lobbyTab === 'quick' && (
              <div className="space-y-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-400/30 rounded-xl text-xs text-amber-200">
                  ⚡ <strong>Canlı Eşleşme</strong>: {gameModeType === 'pin' ? 'Harita üzerinde en yakın noktayı işaretleyen' : 'KPSS sorularını en hızlı ve doğru cevaplayan'} gerçek bir KPSS adayıyla anında eşleşin.
                </div>
                <button
                  onClick={handleStartQuickMatch}
                  disabled={actionLoading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Rastgele Canlı Rakip Ara & Başla</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 2: Özel Oda Kur */}
            {lobbyTab === 'private_create' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    İsteğe Bağlı Oda Şifresi (PIN)
                  </label>
                  <input
                    type="password"
                    value={createRoomPinInput}
                    onChange={(e) => setCreateRoomPinInput(e.target.value)}
                    placeholder="Boş bırakabilirsiniz veya 4 haneli PIN koyun"
                    maxLength={10}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={handleCreatePrivateRoom}
                  disabled={actionLoading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Özel Oda Oluştur (Oda Kodu Al)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 3: Odaya Katıl */}
            {lobbyTab === 'private_join' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Arkadaşınızın Verdiği 6 Haneli Oda Kodu
                  </label>
                  <input
                    type="text"
                    value={joinRoomCodeInput}
                    onChange={(e) => setJoinRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="Örn: TR-8492"
                    maxLength={10}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-black placeholder:text-slate-500 focus:outline-none focus:border-amber-400 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Oda Şifresi (Varsa)
                  </label>
                  <input
                    type="password"
                    value={joinRoomPinInput}
                    onChange={(e) => setJoinRoomPinInput(e.target.value)}
                    placeholder="Şifresiz ise boş bırakın"
                    maxLength={10}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={handleJoinPrivateRoom}
                  disabled={actionLoading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      <span>Odaya Katıl ve Başla</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 4: Yapay Zeka Botu */}
            {lobbyTab === 'bot' && (
              <div className="space-y-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-400/30 rounded-xl text-xs text-indigo-200">
                  🤖 <strong>Antrenman Arenası</strong>: {gameModeType === 'pin' ? 'KPSS Coğrafya harita botuna karşı reflekslerinizi test edin.' : 'KPSS Coğrafya yapay zeka botuna karşı soru çözme hızınızı test edin.'}
                </div>
                <button
                  onClick={handleStartBotDuel}
                  disabled={actionLoading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      <span>Yapay Zekaya Karşı Antrenmana Başla</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {lobbyError && (
              <div className="mt-3 p-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{lobbyError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. ODA BEKLEME EKRANI (Arkadaş veya Canlı Rakip Bekleniyor)
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'waiting') {
    return (
      <div 
        id="duel-waiting-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleLeaveDuel();
        }}
        className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#09090b]/95 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-6 text-white text-center cursor-default"
        >
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>

          <h2 className="text-xl font-black text-amber-400 mb-1">
            {activeDuelSession.mode === 'private' ? 'Arkadaşınız Bekleniyor...' : 'Canlı Rakip Aranıyor...'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {activeDuelSession.gameType === 'quiz' ? '📝 KPSS Test Düellosu' : '📍 Harita Nokta Atışı'} • {activeDuelSession.categoryFilter} • {activeDuelSession.questionCount} Soru
          </p>

          {activeDuelSession.mode === 'private' && (
            <div className="bg-white/5 border border-white/20 rounded-xl p-3 mb-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Arkadaşınızla Paylaşılacak Oda Kodu
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-amber-300 tracking-widest font-mono">
                  {activeDuelSession.roomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              {activeDuelSession.roomPin && (
                <span className="text-xs text-slate-400 mt-1 block">
                  Oda PIN Şifresi: <strong className="text-white">{activeDuelSession.roomPin}</strong>
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleLeaveDuel}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Aramayı İptal Et
            </button>

            <button
              onClick={handleStartBotDuel}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Yapay Zekaya Geç</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. BAŞLAMA SAYACI (10 SANİYE GERİ SAYIM & VS ARENASI)
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'starting' && countdownNum !== null) {
    const isQuiz = activeDuelSession.gameType === 'quiz';
    return (
      <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center p-4">
        <div className="text-center animate-in zoom-in-95 duration-200 max-w-lg w-full">
          {/* Mode Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase mb-4">
            {isQuiz ? <BookOpen className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>{isQuiz ? 'KPSS Coğrafya Test Düellosu' : 'Harita Nokta Atışı Düellosu'}</span>
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-6">
            {/* Player 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 border-2 border-indigo-300 flex items-center justify-center shadow-xl shadow-indigo-500/40 text-2xl font-black text-white mb-2">
                {activeDuelSession.player1.rumuz.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm sm:text-base font-black text-indigo-300 max-w-[120px] truncate">
                {activeDuelSession.player1.rumuz}
              </span>
              <span className="text-[10px] text-slate-400">
                {activeDuelPlayerKey === 'player1' ? '(Sen)' : 'Oyuncu 1'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 italic">
                VS
              </span>
            </div>

            {/* Player 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-600 border-2 border-rose-300 flex items-center justify-center shadow-xl shadow-rose-500/40 text-2xl font-black text-white mb-2">
                {activeDuelSession.player2?.rumuz.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="text-sm sm:text-base font-black text-rose-300 max-w-[120px] truncate">
                {activeDuelSession.player2?.rumuz || 'Rakip'}
              </span>
              <span className="text-[10px] text-slate-400">
                {activeDuelPlayerKey === 'player2' ? '(Sen)' : 'Oyuncu 2'}
              </span>
            </div>
          </div>

          {/* 10s Circular Big Number Display */}
          <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-4xl flex items-center justify-center shadow-2xl shadow-amber-500/50">
              {countdownNum}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-300 px-4">
            {isQuiz
              ? '⚡ KPSS test sorularını en hızlı ve doğru işaretleyen daha yüksek puan alır!'
              : '⚡ Haritada aranan yeri en hızlı ve en yakın işaretleyen kazanır!'}
          </p>
          <span className="text-[11px] text-amber-400/90 font-medium block mt-1">
            {activeDuelSession.questionCount} Soru • 15 Saniye Süre Sınırı
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. MAÇ SONUÇ EKRANI (Kompakt, Smooth & Responsive Kaydırmalı Karşılaştırma)
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'finished') {
    const isWinner = activeDuelSession.winnerId === activeDuelPlayerKey;
    const isDraw = activeDuelSession.winnerId === 'draw';
    const historyList = activeDuelSession.roundHistory || [];
    const isQuiz = activeDuelSession.gameType === 'quiz';

    return (
      <div 
        id="duel-finished-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleLeaveDuel();
        }}
        className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[92dvh] bg-[#09090b]/95 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-3 sm:p-5 text-white text-center animate-in zoom-in-95 duration-200 flex flex-col my-auto cursor-default"
        >
          {/* Header Summary */}
          <div className="shrink-0 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-amber-500/40">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
            </div>

            <h2 className="text-lg sm:text-xl font-black text-amber-400 mb-0.5">
              {isDraw ? '🤝 BERABERE!' : isWinner ? '🏆 TEBRİKLER! DÜELLOYU KAZANDINIZ!' : '⚔️ DÜELLO TAMAMLANDI!'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400">
              {isQuiz ? '📝 KPSS Test Düellosu' : '📍 Harita Nokta Atışı'} • {activeDuelSession.questionCount} Soru • {activeDuelSession.categoryFilter}
            </p>
          </div>

          {/* Karşılaştırma Kartları (Overview) */}
          <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
            {/* Player 1 */}
            <div className={`p-2.5 rounded-xl border ${activeDuelSession.player1.id === activeDuelSession.winnerId ? 'bg-amber-500/20 border-amber-400' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-4 h-4 rounded bg-indigo-600 border border-indigo-400/50 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                  {activeDuelSession.player1.rumuz.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs font-bold text-slate-200 truncate">
                  {activeDuelSession.player1.rumuz} {activeDuelPlayerKey === 'player1' ? '(Sen)' : ''}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-indigo-400 block">
                {activeDuelSession.player1.score} P
              </span>
              {!isQuiz && (
                <span className="text-[10px] text-slate-400 block">
                  Hata: <strong className="text-amber-300">{Math.round(activeDuelSession.player1.totalDistanceKm)} km</strong>
                </span>
              )}
            </div>

            {/* Player 2 */}
            <div className={`p-2.5 rounded-xl border ${activeDuelSession.player2?.id === activeDuelSession.winnerId ? 'bg-amber-500/20 border-amber-400' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-4 h-4 rounded bg-rose-600 border border-rose-400/50 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                  {activeDuelSession.player2?.rumuz.charAt(0).toUpperCase() || 'R'}
                </span>
                <span className="text-xs font-bold text-slate-200 truncate">
                  {activeDuelSession.player2?.rumuz || 'Rakip'} {activeDuelPlayerKey === 'player2' ? '(Sen)' : ''}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-rose-400 block">
                {activeDuelSession.player2?.score || 0} P
              </span>
              {!isQuiz && (
                <span className="text-[10px] text-slate-400 block">
                  Hata: <strong className="text-amber-300">{Math.round(activeDuelSession.player2?.totalDistanceKm || 0)} km</strong>
                </span>
              )}
            </div>
          </div>

          {/* Soru Soru Karşılaştırma Tablosu (Aşağı Kaydırmalı & Tamamen Responsive) */}
          <div className="flex-1 min-h-[140px] max-h-[35vh] sm:max-h-[40vh] bg-black/40 border border-white/10 rounded-xl p-2.5 mb-3 flex flex-col text-left overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 shrink-0">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                {isQuiz ? <BookOpen className="w-3.5 h-3.5 text-amber-400" /> : <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                {isQuiz ? 'Soru ve Cevap Karşılaştırması' : 'Lokasyon & Uzaklık Karşılaştırması'}
              </span>
              <span className="text-[10px] text-slate-400">
                {historyList.length} / {activeDuelSession.questionCount} Soru
              </span>
            </div>

            {/* Scrollable list of question comparisons */}
            <div className="overflow-y-auto pr-1 space-y-1.5 flex-1 scrollbar-thin">
              {historyList.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  Karşılaştırma detayları yükleniyor...
                </div>
              ) : (
                historyList.map((item, idx) => {
                  const p1Pts = item.player1Points;
                  const p2Pts = item.player2Points;
                  const p1Win = p1Pts > p2Pts;
                  const p2Win = p2Pts > p1Pts;

                  return (
                    <div 
                      key={item.questionId || idx}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 transition-all text-xs"
                    >
                      {/* Top: Round number & Target title/question */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-white truncate">
                            {cleanFeatureTitle(item.targetTitle)}
                          </span>
                        </div>
                        {item.targetCategory && (
                          <span className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/5 shrink-0 hidden xs:inline">
                            {item.targetCategory}
                          </span>
                        )}
                      </div>

                      {/* Bottom: Player 1 vs Player 2 comparative distances or quiz answers */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-xs">
                        {/* Player 1 Stats */}
                        <div className={`p-1.5 rounded flex items-center justify-between gap-1 ${p1Win ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200' : 'bg-black/30 text-slate-300'}`}>
                          <div className="truncate">
                            <span className="font-semibold text-[9px] text-indigo-300 block truncate">
                              {activeDuelSession.player1.rumuz}
                            </span>
                            {isQuiz ? (
                              <span className="font-bold">
                                {item.player1SelectedOption !== undefined && item.player1SelectedOption >= 0
                                  ? `Seçim: ${String.fromCharCode(65 + item.player1SelectedOption)}`
                                  : 'Cevapsız'}
                              </span>
                            ) : (
                              <span className="font-mono font-bold">
                                {item.player1Guess ? `${Math.round(item.player1DistanceKm)} km` : 'Cevapsız'}
                              </span>
                            )}
                          </div>
                          <span className="font-black text-[10px] sm:text-xs text-emerald-400 shrink-0">
                            +{item.player1Points}P
                          </span>
                        </div>

                        {/* Player 2 Stats */}
                        <div className={`p-1.5 rounded flex items-center justify-between gap-1 ${p2Win ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200' : 'bg-black/30 text-slate-300'}`}>
                          <div className="truncate">
                            <span className="font-semibold text-[9px] text-rose-300 block truncate">
                              {activeDuelSession.player2?.rumuz || 'Rakip'}
                            </span>
                            {isQuiz ? (
                              <span className="font-bold">
                                {item.player2SelectedOption !== undefined && item.player2SelectedOption >= 0
                                  ? `Seçim: ${String.fromCharCode(65 + item.player2SelectedOption)}`
                                  : 'Cevapsız'}
                              </span>
                            ) : (
                              <span className="font-mono font-bold">
                                {item.player2Guess ? `${Math.round(item.player2DistanceKm)} km` : 'Cevapsız'}
                              </span>
                            )}
                          </div>
                          <span className="font-black text-[10px] sm:text-xs text-emerald-400 shrink-0">
                            +{item.player2Points}P
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleLeaveDuel}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Lobiye Dön
            </button>

            <button
              onClick={handleStartQuickMatch}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Yeni Düello Başlat</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. CANLI OYUN HUD'I & CEVAPLAMA EKRANI (Harita veya Test Modu)
  // -------------------------------------------------------------
  const currentQ = roundQuestions[activeDuelSession.currentRound];
  if (!currentQ) return null;

  const myPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1 : activeDuelSession.player2;
  const otherPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player2 : activeDuelSession.player1;

  const hasMyGuess = !!myPlayer?.currentGuess;
  const hasOtherGuess = !!otherPlayer?.currentGuess;
  const isReveal = activeDuelSession.status === 'round_reveal';
  const isQuizMode = activeDuelSession.gameType === 'quiz';

  const sanitizedTitle = cleanFeatureTitle('title' in currentQ ? currentQ.title : currentQ.category);
  const isQuizQuestion = 'options' in currentQ;

  return (
    <>
      {/* Top Floating Match Header Bar (Compact & Sleek) */}
      <div className="absolute top-11 sm:top-2 left-1/2 -translate-x-1/2 z-30 w-[96vw] sm:w-auto max-w-xl sm:max-w-2xl bg-[#09090b]/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-2xl shadow-2xl p-2 text-white animate-in fade-in duration-200 pointer-events-auto">
        {/* Row 1: Soru İsmi/Kategori & Tur Sayısı */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] sm:text-xs shrink-0 flex items-center gap-1 shadow-sm">
              {isQuizMode ? <BookOpen className="w-3 h-3" /> : <Crosshair className="w-3 h-3" />}
              {isQuizMode ? 'KPSS SORU:' : 'ARANAN:'}
            </span>
            <span className="font-black text-xs sm:text-sm text-amber-300 leading-tight truncate">
              {isQuizMode && isQuizQuestion ? currentQ.category : sanitizedTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-extrabold text-slate-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
              {activeDuelSession.currentRound + 1}/{activeDuelSession.questionCount}
            </span>
            <button
              onClick={handleLeaveDuel}
              className="p-1 rounded-lg bg-white/10 hover:bg-red-500/30 text-slate-300 transition-all cursor-pointer"
              title="Düellodan Çık"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Sen (Skor/Durum) | 15s Timer | Rakip (Skor/Durum) */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: You */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 border border-indigo-300 flex items-center justify-center font-black text-xs text-white shrink-0 shadow-md">
              {myPlayer?.rumuz.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-xs font-black text-indigo-300 truncate max-w-[80px] sm:max-w-[110px]">
                  {myPlayer?.rumuz} (Sen)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-black text-white">
                  {myPlayer?.score || 0} P
                </span>
                {hasMyGuess ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded">
                    ⚡ Cevapladın
                  </span>
                ) : (
                  <span className="text-[9px] font-medium text-amber-300 animate-pulse">
                    {isQuizMode ? 'Şık Seçin!' : 'Haritaya Tıkla!'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: 15s Circular Synchronized Countdown */}
          <div className="flex flex-col items-center shrink-0 px-2">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center font-black text-xs sm:text-sm shadow-lg transition-all ${
              timeLeftSec <= 4
                ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-ping'
                : timeLeftSec <= 8
                ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                : 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
            }`}>
              {timeLeftSec}s
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Süre
            </span>
          </div>

          {/* Right: Opponent */}
          <div className="flex items-center justify-end gap-1.5 min-w-0 text-right">
            <div className="min-w-0">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[10px] sm:text-xs font-black text-rose-300 truncate max-w-[80px] sm:max-w-[110px]">
                  {otherPlayer?.rumuz || 'Rakip'}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                {hasOtherGuess ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded">
                    ⚡ Cevapladı
                  </span>
                ) : (
                  <span className="text-[9px] font-medium text-slate-400">
                    Düşünüyor...
                  </span>
                )}
                <span className="text-[11px] sm:text-xs font-black text-white">
                  {otherPlayer?.score || 0} P
                </span>
              </div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-600 border border-rose-300 flex items-center justify-center font-black text-xs text-white shrink-0 shadow-md">
              {otherPlayer?.rumuz.charAt(0).toUpperCase() || 'R'}
            </div>
          </div>
        </div>
      </div>

      {/* IN-GAME QUIZ MULTIPLE CHOICE QUESTION CARD (Only for quiz mode) */}
      {isQuizMode && isQuizQuestion && !isReveal && (
        <div 
          id="duel-quiz-question-card"
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[96vw] max-w-xl bg-[#09090b]/95 backdrop-blur-2xl border-2 border-amber-400/90 rounded-2xl shadow-2xl p-3 sm:p-4 text-white animate-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
        >
          {/* Question Text */}
          <div className="mb-3">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-0.5">
              Soru #{activeDuelSession.currentRound + 1} ({currentQ.category})
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
              {currentQ.questionText}
            </p>
          </div>

          {/* 4 Options (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedQuizOption === oIdx || myPlayer?.currentGuess?.selectedOption === oIdx;
              const optionLetter = String.fromCharCode(65 + oIdx);

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectQuizOption(oIdx)}
                  disabled={hasMyGuess}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-[1.01]'
                      : hasMyGuess
                      ? 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                      : 'bg-white/5 hover:bg-white/15 border-white/15 text-slate-200 hover:border-amber-400/60'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-amber-300'
                  }`}>
                    {optionLetter}
                  </span>
                  <span className="truncate leading-tight">{opt}</span>
                </button>
              );
            })}
          </div>

          {hasMyGuess && (
            <div className="mt-2 text-center text-[10px] text-amber-300 font-bold animate-pulse">
              ⚡ Cevabınız kaydedildi. Rakibin cevabı bekleniyor...
            </div>
          )}
        </div>
      )}

      {/* ULTRA-COMPACT ROUND REVEAL BAR / PILL (Both Pin & Quiz Modes) */}
      {isReveal && (
        <div
          id="duel-round-reveal-banner"
          className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 w-[96vw] max-w-xl bg-[#09090b]/95 backdrop-blur-2xl border border-amber-400/80 rounded-xl shadow-2xl px-2.5 py-1.5 text-white animate-in slide-in-from-bottom-2 duration-150 flex items-center justify-between gap-1.5 pointer-events-auto"
        >
          {/* Left: Sen (Your Stats) */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-5 h-5 rounded-md bg-indigo-600 border border-indigo-400/50 flex items-center justify-center text-[10px] font-black text-white shrink-0">
              {myPlayer?.rumuz.charAt(0).toUpperCase() || 'S'}
            </span>
            <div className="leading-none min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-indigo-300 truncate max-w-[65px] sm:max-w-[85px]">
                  {myPlayer?.rumuz} (Sen)
                </span>
                {lastRoundScore && !isQuizMode && (
                  <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded hidden sm:inline ${lastRoundScore.tierColor}`}>
                    {lastRoundScore.tierName}
                  </span>
                )}
              </div>
              {myPlayer?.currentGuess ? (
                <div className="text-[10px] font-bold text-amber-300 mt-0.5 whitespace-nowrap">
                  {isQuizMode ? (
                    myPlayer.currentGuess.isCorrect ? (
                      <span className="text-emerald-400 font-black">✓ Doğru (+{myPlayer.currentGuess.pointsEarned}P)</span>
                    ) : (
                      <span className="text-rose-400 font-black">✗ Yanlış (0P)</span>
                    )
                  ) : (
                    <>
                      {Math.round(myPlayer.currentGuess.distanceKm)} km{' '}
                      <span className="text-emerald-400 font-black">+{myPlayer.currentGuess.pointsEarned}P</span>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-[9px] text-rose-400 font-bold mt-0.5 block">0P (Geçti)</span>
              )}
            </div>
          </div>

          {/* Center: Target Location / Correct Answer Badge & 7s Countdown */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[10px] font-black max-w-[130px] sm:max-w-[180px] truncate shrink">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate hidden xs:inline">
              {isQuizMode && isQuizQuestion
                ? `Cevap: ${String.fromCharCode(65 + currentQ.correctIndex)}`
                : sanitizedTitle}
            </span>
            <span className="text-amber-300 font-mono font-bold ml-auto px-1 py-0.2 bg-amber-500/20 rounded">
              {revealCountdown}s
            </span>
          </div>

          {/* Right: Opponent Stats */}
          <div className="flex items-center gap-1.5 min-w-0 text-right">
            <div className="leading-none min-w-0">
              <div className="flex items-center justify-end gap-1">
                {opponentRoundScore && !isQuizMode && (
                  <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded hidden sm:inline ${opponentRoundScore.tierColor}`}>
                    {opponentRoundScore.tierName}
                  </span>
                )}
                <span className="text-[10px] font-black text-rose-300 truncate max-w-[65px] sm:max-w-[85px]">
                  {otherPlayer?.rumuz || 'Rakip'}
                </span>
              </div>
              {otherPlayer?.currentGuess ? (
                <div className="text-[10px] font-bold text-amber-300 mt-0.5 whitespace-nowrap">
                  {isQuizMode ? (
                    otherPlayer.currentGuess.isCorrect ? (
                      <span className="text-emerald-400 font-black">✓ Doğru (+{otherPlayer.currentGuess.pointsEarned}P)</span>
                    ) : (
                      <span className="text-rose-400 font-black">✗ Yanlış (0P)</span>
                    )
                  ) : (
                    <>
                      {Math.round(otherPlayer.currentGuess.distanceKm)} km{' '}
                      <span className="text-emerald-400 font-black">+{otherPlayer.currentGuess.pointsEarned}P</span>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-[9px] text-rose-400 font-bold mt-0.5 block">0P (Geçti)</span>
              )}
            </div>
            <span className="w-5 h-5 rounded-md bg-rose-600 border border-rose-400/50 flex items-center justify-center text-[10px] font-black text-white shrink-0">
              {otherPlayer?.rumuz.charAt(0).toUpperCase() || 'R'}
            </span>
          </div>

          {/* Advance / Next Round Button (Votes to advance immediately if both click) */}
          <button
            onClick={() => {
              if (activeDuelPlayerKey) {
                const myId = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1.id : activeDuelSession.player2?.id;
                if (myId) voteToAdvanceDuelRound(activeDuelSession, myId);
              }
            }}
            className={`px-2.5 py-1 font-black text-[10px] sm:text-xs rounded-lg shadow-md transition-all flex items-center gap-0.5 shrink-0 cursor-pointer ml-1 ${
              myPlayer?.readyToAdvance
                ? 'bg-emerald-500/30 border border-emerald-400/60 text-emerald-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950'
            }`}
            title={myPlayer?.readyToAdvance ? 'Rakip bekleniyor...' : 'Sonraki soruya geç'}
          >
            {myPlayer?.readyToAdvance ? (
              <span>Bekleniyor...</span>
            ) : (
              <>
                <span>İlerle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
