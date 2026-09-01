'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { 
  findOrCreateQuickMatch, 
  joinPrivateDuelRoom, 
  createDuelRoom, 
  startBotDuel,
  sendDuelHeartbeat,
  submitPlayerGuess,
  submitPlayerTestAnswer,
  advanceDuelRound, 
  voteToAdvanceDuelRound,
  leaveOrCancelDuel, 
  subscribeToDuel,
  getQuestionsByIds,
  getQuizQuestionsByIds,
  handleRoundTimeout,
  calculateDuelScore,
  DistanceScoreBreakdown,
  DuelType,
  findCrossModeWaitingRooms,
  joinSuggestedDuelRoom,
  WaitingRoomSuggestion
} from '@/lib/duelService';
import { checkRumuzExists, saveRumuzProfile, normalizeRumuzKey } from '@/lib/rumuzService';
import { 
  PinGameQuestion, 
  MultipleChoiceQuestion, 
  PIN_GAME_QUESTIONS,
  MULTIPLE_CHOICE_QUESTIONS,
  cleanFeatureTitle 
} from '@/lib/data/quizQuestions';
import AvatarWithBadgeFrame from '@/components/ui/AvatarWithBadgeFrame';
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
  HelpCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Genel', label: 'Genel Karma (Tüm KPSS)', icon: '🌟' },
  { id: 'Şehir Bulmaca (81 İl)', label: 'Şehir Bulmaca (81 İl & Plaka)', icon: '🇹🇷' },
  { id: 'Dağlar', label: 'Dağlar & Masifler', icon: '⛰️' },
  { id: 'Akarsular', label: 'Akarsular & Nehirler', icon: '🌊' },
  { id: 'Göller', label: 'Göller & Doğal Göller', icon: '💧' },
  { id: 'Madenler', label: 'Madenler & Enerji', icon: '⛏️' },
  { id: 'Geçitler', label: 'Geçitler & Boğazlar', icon: '🛣️' },
  { id: 'Sınır Kapıları', label: 'Sınır Kapıları & Limanlar', icon: '🚪' },
  { id: 'Platolar & Ovalar', label: 'Platolar & Delta Ovaları', icon: '🌾' },
  { id: 'Karstik & Kıyı', label: 'Karstik & Kıyı Tipleri', icon: '🏖️' }
];

export default function DuelMode() {
  const {
    setActiveTab,
    activeDuelSession,
    setActiveDuelSession,
    activeDuelPlayerKey,
    setActiveDuelPlayerKey,
    flyToCoords,
    unlockedBadges,
    avatarIcon,
    avatarBg,
    equippedTitle,
    duelStats,
    recordDuelFinish
  } = useAppStore();

  // Local user profile state (Rumuz + PIN)
  const [rumuz, setRumuz] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isAuthSaved, setIsAuthSaved] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Matchmaking / Lobby setup state
  const [selectedDuelType, setSelectedDuelType] = useState<DuelType>('pin_map');
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
  const [roundQuestions, setRoundQuestions] = useState<PinGameQuestion[]>([]);
  const [roundTestQuestions, setRoundTestQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [revealCountdown, setRevealCountdown] = useState<number>(7);
  const [lastRoundScore, setLastRoundScore] = useState<DistanceScoreBreakdown | null>(null);
  const [opponentRoundScore, setOpponentRoundScore] = useState<DistanceScoreBreakdown | null>(null);
  const [recordedFinishedId, setRecordedFinishedId] = useState<string | null>(null);

  // Cross-mode matchmaking suggestions & 1-min waiting tracker
  const [waitingSeconds, setWaitingSeconds] = useState<number>(0);
  const [crossModeSuggestions, setCrossModeSuggestions] = useState<WaitingRoomSuggestion[]>([]);
  const [joiningSuggestionId, setJoiningSuggestionId] = useState<string | null>(null);

  // 2-click outside exit confirmation state
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);
  const [outsideClickWarning, setOutsideClickWarning] = useState<boolean>(false);
  const outsideClickRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  // Bot auto-play ref
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeDuelRef = useRef(activeDuelSession);

  useEffect(() => {
    activeDuelRef.current = activeDuelSession;
  }, [activeDuelSession]);

  // Track waiting time and poll for cross-mode waiting rooms
  useEffect(() => {
    if (!activeDuelSession || activeDuelSession.status !== 'waiting') {
      setWaitingSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setWaitingSeconds(prev => prev + 1);
    }, 1000);

    const pollSuggestions = () => {
      const myId = normalizeRumuzKey(rumuz);
      findCrossModeWaitingRooms(myId).then(suggs => {
        // Exclude current room
        const filtered = suggs.filter(s => s.id !== activeDuelSession.id);
        setCrossModeSuggestions(filtered);
      });
    };

    pollSuggestions();
    const suggInterval = setInterval(pollSuggestions, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(suggInterval);
    };
  }, [activeDuelSession, rumuz]);

  // Outside click listener: Double click outside duel UI triggers Exit Confirmation
  // CRITICAL: Only active in KPSS Test mode. NEVER active in pin_map game (where user clicks the map to place pins)!
  useEffect(() => {
    // If duel is active and it's a map duel, do NOT listen for outside clicks (map clicks are gameplay!)
    if (activeDuelSession && activeDuelSession.duelType === 'pin_map') {
      outsideClickRef.current = { count: 0, lastTime: 0 };
      return;
    }

    const isDuelActive = activeDuelSession && (
      activeDuelSession.status === 'in_progress' ||
      activeDuelSession.status === 'round_reveal' ||
      activeDuelSession.status === 'starting'
    );

    // Only attach pointerdown listener when in KPSS Test mode
    if (isDuelActive && activeDuelSession.duelType === 'kpss_test') {
      const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Check if click was inside duel card or HUD elements
        const isInsideDuelUI = target.closest(
          '#duel-active-hud, #duel-active-card, #duel-round-reveal-banner, #duel-exit-modal, button, input, a'
        );

        if (isInsideDuelUI) {
          outsideClickRef.current = { count: 0, lastTime: 0 };
          return;
        }

        const now = Date.now();
        const { count, lastTime } = outsideClickRef.current;

        if (now - lastTime < 2800) {
          const newCount = count + 1;
          if (newCount >= 2) {
            setShowExitConfirmModal(true);
            setOutsideClickWarning(false);
            outsideClickRef.current = { count: 0, lastTime: 0 };
          } else {
            outsideClickRef.current = { count: newCount, lastTime: now };
            setOutsideClickWarning(true);
            setTimeout(() => setOutsideClickWarning(false), 2400);
          }
        } else {
          outsideClickRef.current = { count: 1, lastTime: now };
          setOutsideClickWarning(true);
          setTimeout(() => setOutsideClickWarning(false), 2400);
        }
      };

      window.addEventListener('pointerdown', handlePointerDown);
      return () => {
        window.removeEventListener('pointerdown', handlePointerDown);
      };
    }
  }, [activeDuelSession]);

  // Clean up waiting duel rooms on component unmount or browser tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeDuelRef.current && activeDuelRef.current.status === 'waiting') {
        leaveOrCancelDuel(activeDuelRef.current.id).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      if (activeDuelRef.current && activeDuelRef.current.status === 'waiting') {
        leaveOrCancelDuel(activeDuelRef.current.id).catch(() => {});
      }
    };
  }, []);

  // Heartbeat to keep waiting room alive & detect alive players
  useEffect(() => {
    if (!activeDuelSession?.id || activeDuelSession.status !== 'waiting') return;

    // Send immediate heartbeat
    sendDuelHeartbeat(activeDuelSession.id);

    const interval = setInterval(() => {
      if (activeDuelRef.current?.id && activeDuelRef.current.status === 'waiting') {
        sendDuelHeartbeat(activeDuelRef.current.id);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeDuelSession?.id, activeDuelSession?.status]);

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

      // Load questions according to duelType
      if (updatedDuel.questionIds && updatedDuel.questionIds.length > 0) {
        if (updatedDuel.duelType === 'kpss_test') {
          const testQuestions = getQuizQuestionsByIds(updatedDuel.questionIds);
          setRoundTestQuestions(testQuestions);
        } else {
          const pinQuestions = getQuestionsByIds(updatedDuel.questionIds);
          setRoundQuestions(pinQuestions);
        }
      }
    });

    return () => unsubscribe();
  }, [activeDuelSession?.id, rumuz, setActiveDuelSession, setActiveDuelPlayerKey]);

  // Handle Synchronized 10s Starting Countdown & Round Timer & Zoom out
  useEffect(() => {
    if (!activeDuelSession) return;

    // 1. Starting phase: 10-second countdown (10.. 9.. 8.. 7.. 6.. 5.. 4.. 3.. 2.. 1..)
    if (activeDuelSession.status === 'starting') {
      if (activeDuelSession.player2?.isBot) {
        setCountdownNum(null);
        if (activeDuelPlayerKey === 'player1') {
          advanceDuelRound({ ...activeDuelSession, currentRound: -1 });
        }
        return;
      }

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

    // 2. In-progress round timer (15s for map, 40s for test)
    if (activeDuelSession.status === 'in_progress') {
      setCountdownNum(null);
      const startMs = activeDuelSession.roundStartTime || Date.now();
      const limitSec = activeDuelSession.roundTimeLimit || (activeDuelSession.duelType === 'kpss_test' ? 40 : 15);

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
          if (activeDuelPlayerKey === 'player1') {
            handleRoundTimeout(activeDuelSession);
          }
        }
      }, 100);

      // Bot AI auto-play simulation for both Map & Test modes
      const isBotOpponent = activeDuelSession.player2?.isBot;
      const isTestDuel = activeDuelSession.duelType === 'kpss_test';

      if (isBotOpponent) {
        if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

        if (isTestDuel && (activeDuelSession.player2?.currentOptionAnswer === null || activeDuelSession.player2?.currentOptionAnswer === undefined)) {
          const currentTestQ = roundTestQuestions[activeDuelSession.currentRound];
          if (currentTestQ) {
            const randomThinkSec = 3.5 + Math.random() * 8.5;
            botTimeoutRef.current = setTimeout(() => {
              if (activeDuelSession.status === 'in_progress') {
                // 75% chance to pick correct option
                const isCorrect = Math.random() < 0.75;
                const pickedOption = isCorrect 
                  ? currentTestQ.correctIndex 
                  : (currentTestQ.correctIndex + 1 + Math.floor(Math.random() * (currentTestQ.options.length - 1))) % currentTestQ.options.length;
                
                submitPlayerTestAnswer(activeDuelSession, 'kpss_ai_bot', pickedOption, currentTestQ.correctIndex, randomThinkSec);
              }
            }, randomThinkSec * 1000);
          }
        } else if (!isTestDuel && !activeDuelSession.player2?.currentGuess) {
          const currentMapQ = roundQuestions[activeDuelSession.currentRound];
          if (currentMapQ) {
            const randomThinkSec = 2.5 + Math.random() * 6.5;
            botTimeoutRef.current = setTimeout(() => {
              if (activeDuelSession.status === 'in_progress') {
                const scatterLat = (Math.random() - 0.5) * 0.8;
                const scatterLng = (Math.random() - 0.5) * 1.2;
                const botGuessCoords: [number, number] = [
                  currentMapQ.targetCoords[0] + scatterLng,
                  currentMapQ.targetCoords[1] + scatterLat
                ];
                submitPlayerGuess(activeDuelSession, 'kpss_ai_bot', botGuessCoords, currentMapQ.targetCoords, randomThinkSec);
              }
            }, randomThinkSec * 1000);
          }
        }
      }

      return () => {
        clearInterval(interval);
        if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
      };
    }

    // 3. Round reveal phase (7 seconds display, auto advance, camera zoom to target and then zoom out)
    if (activeDuelSession.status === 'round_reveal') {
      const isTestDuel = activeDuelSession.duelType === 'kpss_test';
      const myPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1 : activeDuelSession.player2;
      const otherPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player2 : activeDuelSession.player1;

      if (!isTestDuel) {
        if (myPlayer?.currentGuess) {
          const breakdown = calculateDuelScore(myPlayer.currentGuess.distanceKm, myPlayer.currentGuess.timeTakenSec);
          setLastRoundScore(breakdown);
        }
        if (otherPlayer?.currentGuess) {
          const breakdown = calculateDuelScore(otherPlayer.currentGuess.distanceKm, otherPlayer.currentGuess.timeTakenSec);
          setOpponentRoundScore(breakdown);
        }

        // Camera focus on target coords during reveal
        const currentQ = roundQuestions[activeDuelSession.currentRound];
        if (currentQ) {
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
          // Zoom out map fully back to Turkey overview for next question!
          flyToCoords([35.243, 38.963], 0, 0, 5.5);
          if (activeDuelPlayerKey === 'player1' || activeDuelSession.player2?.isBot) {
            advanceDuelRound(activeDuelSession);
          }
        }
      }, 300);

      return () => {
        clearInterval(revealTicker);
      };
    }

    // 4. Finished phase: record duel stats once
    if (activeDuelSession.status === 'finished' && activeDuelSession.id !== recordedFinishedId) {
      setRecordedFinishedId(activeDuelSession.id);
      const myPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1 : activeDuelSession.player2;
      const myId = myPlayer?.id || normalizeRumuzKey(rumuz);
      const myScore = myPlayer?.score || 0;
      recordDuelFinish(activeDuelSession.winnerId || 'draw', myId, myScore);

      if (activeDuelSession.winnerId === myId && typeof window !== 'undefined') {
        import('canvas-confetti').then((m) => {
          const confettiFn = m.default || m;
          confettiFn({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }).catch(() => {});
      }
    }
  }, [
    activeDuelSession,
    activeDuelPlayerKey, 
    roundQuestions, 
    roundTestQuestions,
    flyToCoords,
    rumuz,
    recordedFinishedId,
    recordDuelFinish
  ]);

  // Handle Quick Match Finding
  const handleStartQuickMatch = async () => {
    if (activeDuelSession) {
      await leaveOrCancelDuel(activeDuelSession.id);
      setActiveDuelSession(null);
    }
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const res = await findOrCreateQuickMatch(
        { id: myId, rumuz, rumuzKey: myId },
        { 
          questionCount: selectedQuestionCount, 
          categoryFilter: selectedCategory,
          duelType: selectedDuelType
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
    if (activeDuelSession) {
      await leaveOrCancelDuel(activeDuelSession.id);
      setActiveDuelSession(null);
    }
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const session = await createDuelRoom(
        { id: myId, rumuz, rumuzKey: myId },
        {
          mode: 'private',
          duelType: selectedDuelType,
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
    if (activeDuelSession) {
      await leaveOrCancelDuel(activeDuelSession.id);
      setActiveDuelSession(null);
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
    if (activeDuelSession) {
      await leaveOrCancelDuel(activeDuelSession.id);
      setActiveDuelSession(null);
    }
    setActionLoading(true);
    setLobbyError(null);
    try {
      const myId = normalizeRumuzKey(rumuz);
      const session = await startBotDuel(
        { id: myId, rumuz, rumuzKey: myId },
        { 
          questionCount: selectedQuestionCount, 
          categoryFilter: selectedCategory,
          duelType: selectedDuelType
        }
      );
      setActiveDuelSession(session);
    } catch {
      setLobbyError('Antrenman modu başlatılamadı.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle accepting a cross-mode suggestion
  const handleAcceptSuggestion = async (suggestion: WaitingRoomSuggestion) => {
    if (!activeDuelSession) return;
    setJoiningSuggestionId(suggestion.id);
    try {
      const myId = normalizeRumuzKey(rumuz);
      // Leave current waiting lobby first
      await leaveOrCancelDuel(activeDuelSession.id);
      const res = await joinSuggestedDuelRoom(suggestion.id, { id: myId, rumuz, rumuzKey: myId });
      if (res.success && res.duel) {
        setActiveDuelSession(res.duel);
      } else {
        setLobbyError(res.errorMsg || 'Önerilen maça bağlanılamadı.');
      }
    } catch {
      setLobbyError('Önerilen maça geçilirken hata oluştu.');
    } finally {
      setJoiningSuggestionId(null);
    }
  };

  // Handle Leave or Cancel
  const handleLeaveDuel = async () => {
    setShowExitConfirmModal(false);
    if (activeDuelSession) {
      await leaveOrCancelDuel(activeDuelSession.id);
    }
    setActiveDuelSession(null);
    setActiveDuelPlayerKey(null);
    setRoundQuestions([]);
    setRoundTestQuestions([]);
    setLastRoundScore(null);
    setOpponentRoundScore(null);
    setRecordedFinishedId(null);
    flyToCoords([35.243, 38.963], 0, 0, 5.5);
  };

  // Copy Room Code to clipboard
  const handleCopyCode = () => {
    if (activeDuelSession?.roomCode) {
      navigator.clipboard.writeText(activeDuelSession.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // -------------------------------------------------------------
  // 1. RUMUZ & ŞİFRE GİRİŞ EKRANI
  // -------------------------------------------------------------
  if (!isAuthSaved) {
    return (
      <div 
        onClick={(e) => { if (e.target === e.currentTarget) setActiveTab('map'); }}
        className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-[#09090b]/95 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Swords className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-400">1v1 Canlı KPSS Düellosu</h2>
              <p className="text-xs text-slate-300">Rumuz ve şifrenizi belirleyerek arenaya adım atın</p>
            </div>
          </div>

          <form onSubmit={handleSaveRumuz} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Düello Rumuzu (Kullanıcı Adı)
              </label>
              <input
                type="text"
                value={rumuz}
                onChange={(e) => setRumuz(e.target.value)}
                placeholder="Örn: HaritaUstası, CografyaFatihi"
                maxLength={20}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Rumuz Şifresi / PIN (Skorunuzu ve Odanızı Korur)
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Örn: 1234 veya şifreniz"
                maxLength={20}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-bold"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                * Bu şifre ile aynı rumuzu diğer cihazlardan da kullanabilirsiniz.
              </span>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                Vazgeç (Haritaya Dön)
              </button>

              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
  // 2. DÜELLO LOBİSİ (Oda Seçimi, Havuz Filtresi, Harita vs Test Modu Sekmesi)
  // -------------------------------------------------------------
  if (!activeDuelSession) {
    return (
      <div 
        id="duel-lobby-overlay"
        onClick={(e) => {
          // Click outside lobby to return to map
          if (e.target === e.currentTarget) {
            setActiveTab('map');
          }
        }}
        className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md overflow-y-auto p-2 sm:p-4 flex flex-col items-center justify-center cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="w-full max-w-2xl bg-[#09090b]/95 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-4 sm:p-5 text-white my-auto cursor-default animate-in zoom-in-95 duration-150"
        >
          {/* Header with Avatar and Frame */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <AvatarWithBadgeFrame 
                rumuz={rumuz}
                unlockedBadges={unlockedBadges}
                duelWins={duelStats.duelWins}
                duelStreak={duelStats.duelStreak}
                isDuelMode={true}
                avatarIcon={avatarIcon}
                avatarBg={avatarBg}
                equippedTitle={equippedTitle}
                size="md"
              />
              <div>
                <h1 className="text-base sm:text-lg font-black text-amber-400 tracking-tight flex items-center gap-2">
                  <span>1v1 Canlı KPSS Düellosu</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-[10px] font-black uppercase">
                    Canlı Arena
                  </span>
                </h1>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <span>{rumuz}</span>
                  <span className="text-amber-400 font-bold">• {duelStats.duelWins} Galibiyet</span>
                  {duelStats.duelStreak > 1 && <span className="text-orange-400 font-black">🔥 {duelStats.duelStreak} Seri</span>}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('map')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-all border border-white/10"
              title="Haritaya Dön"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DÜELLO MODU SEKMELERİ: Harita İşaretleme Düellosu vs KPSS Test Düellosu */}
          <div className="grid grid-cols-2 gap-2 mb-3 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setSelectedDuelType('pin_map')}
              className={`py-2 px-3 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedDuelType === 'pin_map'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.01]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4 text-slate-950 shrink-0" />
              <div className="text-left leading-tight">
                <div>Harita İşaretleme</div>
                <div className="text-[9px] opacity-80 font-normal">15 sn • Mesafe & Hız Puanı</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDuelType('kpss_test')}
              className={`py-2 px-3 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedDuelType === 'kpss_test'
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.01]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-white shrink-0" />
              <div className="text-left leading-tight">
                <div>KPSS Test Yarışması</div>
                <div className="text-[9px] opacity-80 font-normal">40 sn • Çoktan Seçmeli Test</div>
              </div>
            </button>
          </div>

          {/* Soru Sayısı & Kategori Seçimi */}
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
                    className={`py-1.5 px-3 rounded-xl font-black text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedQuestionCount === count
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
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
                2. KPSS Konu Havuzu
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-28 overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-1.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-1.5 truncate cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400 shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mod Seçim Tabları */}
          <div className="border-t border-white/10 pt-3">
            <div className="flex border-b border-white/10 mb-3 overflow-x-auto scrollbar-none gap-1">
              <button
                onClick={() => setLobbyTab('quick')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  lobbyTab === 'quick'
                    ? 'bg-amber-500 text-slate-950 border-b-2 border-amber-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Rastgele Rakip</span>
              </button>

              <button
                onClick={() => setLobbyTab('private_create')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                className={`px-3 py-1.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
              <div className="space-y-2.5">
                <div className="p-2.5 bg-amber-500/10 border border-amber-400/30 rounded-xl text-xs text-amber-200">
                  ⚡ <strong>Canlı Eşleşme</strong>: {selectedDuelType === 'kpss_test' ? 'KPSS test yarışmasında' : 'Harita işaretlemede'} aynı ayarlardaki gerçek bir rakiple anında eşleşin.
                </div>
                <button
                  onClick={handleStartQuickMatch}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Rastgele Canlı Rakip Ara & Başla</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 2: Özel Oda Kur */}
            {lobbyTab === 'private_create' && (
              <div className="space-y-2.5">
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
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Özel Oda Oluştur (Oda Kodu Al)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 3: Odaya Katıl */}
            {lobbyTab === 'private_join' && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    6 Haneli Oda Kodu
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
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Odaya Katıl ve Başla</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 4: Yapay Zeka Botu */}
            {lobbyTab === 'bot' && (
              <div className="space-y-2.5">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-400/30 rounded-xl text-xs text-indigo-200">
                  🤖 <strong>Antrenman Arenası</strong>: {selectedDuelType === 'kpss_test' ? 'KPSS test' : 'Harita'} yapay zekasına karşı refleks ve bilgilerinizi geliştirin.
                </div>
                <button
                  onClick={handleStartBotDuel}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Yapay Zekaya Karşı Başla</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {lobbyError && (
              <div className="mt-2.5 p-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-xs flex items-center gap-2 font-medium">
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
  // 3. ODA BEKLEME EKRANI (Akıllı Çapraz Mod Eşleştirme & 1 Dk Öneri Desteği)
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'waiting') {
    const mins = Math.floor(waitingSeconds / 60);
    const secs = waitingSeconds % 60;
    const formattedWaiting = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    return (
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowExitConfirmModal(true);
          }
        }}
        className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="w-full max-w-md bg-[#09090b]/95 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-5 text-white text-center animate-in zoom-in-95 duration-150 my-auto cursor-default"
        >
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-lg font-black text-amber-400">
              {activeDuelSession.mode === 'private' ? 'Arkadaşınız Bekleniyor...' : 'Canlı Rakip Aranıyor...'}
            </h2>
            <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-lg">
              ⏱️ {formattedWaiting}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            {activeDuelSession.duelType === 'kpss_test' ? '📝 KPSS Test Modu' : '📍 Harita İşaretleme Modu'} • {activeDuelSession.categoryFilter} • {activeDuelSession.questionCount} Soru
          </p>

          {activeDuelSession.mode === 'private' && (
            <div className="bg-white/5 border border-white/20 rounded-xl p-3 mb-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Arkadaşınızla Paylaşılacak Oda Kodu
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-amber-300 tracking-widest font-mono">
                  {activeDuelSession.roomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1 text-xs font-bold"
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

          {/* Çapraz Mod Eşleştirme Önerisi (Farklı modda veya soru sayısında bekleyenler) */}
          {crossModeSuggestions.length > 0 && (
            <div className="mb-3 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 border-b border-white/10 pb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Farklı Modda Rakip Bekleyen Adaylar Bulundu:</span>
              </div>
              {crossModeSuggestions.map((sugg) => (
                <div 
                  key={sugg.id} 
                  className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-indigo-500/40 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-indigo-300 truncate">{sugg.hostRumuz}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shrink-0">
                        {Math.floor(sugg.waitingDurationSec / 60)}d {sugg.waitingDurationSec % 60}s bekliyor
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                      {sugg.duelType === 'kpss_test' ? '📝 KPSS Test' : '📍 Harita İşaretleme'} • {sugg.questionCount} Soru • {sugg.categoryFilter}
                    </p>
                  </div>

                  <button
                    disabled={joiningSuggestionId === sugg.id}
                    onClick={() => handleAcceptSuggestion(sugg)}
                    className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-xs rounded-lg shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {joiningSuggestionId === sugg.id ? 'Bağlanıyor...' : '🚀 Maça Katıl'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 1 Dakika ve Üzeri Bekleme Tavsiyesi */}
          {waitingSeconds >= 45 && (
            <div className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs text-left flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block font-bold">Bekleme Süresi 1 Dakikaya Yaklaştı:</strong>
                <span>Dilerseniz hemen Yapay Zeka (AI) KPSS botuna karşı başlayarak pratik yapabilir ve istatistik toplayabilirsiniz.</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleLeaveDuel}
              className="flex-1 py-2 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Aramayı İptal Et
            </button>

            <button
              onClick={handleStartBotDuel}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
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
  // 3.5 DÜELLO İPTAL / RAKİP AYRILDI EKRANI
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'abandoned') {
    return (
      <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#09090b]/95 border-2 border-rose-500/50 rounded-2xl shadow-2xl p-5 text-white text-center animate-in zoom-in-95 duration-150">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mx-auto mb-3">
            <X className="w-7 h-7 text-rose-400" />
          </div>

          <h2 className="text-lg font-black text-rose-400 mb-1">
            Düello Sonlandırıldı
          </h2>
          <p className="text-xs text-slate-300 mb-4">
            Rakip oyuncu düellodan ayrıldı veya bağlantısı kesildi.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleLeaveDuel}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Lobiye Dön
            </button>

            <button
              onClick={async () => {
                await handleLeaveDuel();
                handleStartQuickMatch();
              }}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Yeni Rakip Bul</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. BAŞLAMA SAYACI: 10 Saniyelik Geri Sayım & Karşılıklı Kartlar
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'starting' && countdownNum !== null) {
    const isTest = activeDuelSession.duelType === 'kpss_test';

    return (
      <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#09090b]/95 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-300 mb-4 px-3 py-1 bg-amber-500/15 border border-amber-400/30 rounded-full inline-block">
            {isTest ? '📝 KPSS TEST DÜELLOSU BAŞLIYOR' : '📍 1v1 HARİTA DÜELLOSU BAŞLIYOR'}
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-6">
            {/* Player 1 */}
            <div className="flex flex-col items-center">
              <AvatarWithBadgeFrame 
                rumuz={activeDuelSession.player1.rumuz}
                unlockedBadges={activeDuelSession.player1.id === normalizeRumuzKey(rumuz) ? unlockedBadges : ['3D Coğrafyacı']}
                duelWins={activeDuelSession.player1.id === normalizeRumuzKey(rumuz) ? duelStats.duelWins : 1}
                duelStreak={activeDuelSession.player1.id === normalizeRumuzKey(rumuz) ? duelStats.duelStreak : 0}
                isDuelMode={true}
                avatarIcon={activeDuelSession.player1.id === normalizeRumuzKey(rumuz) ? avatarIcon : '⚔️'}
                avatarBg={activeDuelSession.player1.id === normalizeRumuzKey(rumuz) ? avatarBg : 'night_blue'}
                equippedTitle={activeDuelSession.player1.id === normalizeRumuzKey(rumuz) ? equippedTitle : 'KPSS Adayı'}
                size="lg"
              />
              <span className="text-sm font-black text-indigo-300 max-w-[120px] truncate mt-2">
                {activeDuelSession.player1.rumuz}
              </span>
              <span className="text-[10px] text-slate-400">
                {activeDuelPlayerKey === 'player1' ? '(Sen)' : 'Oyuncu 1'}
              </span>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 italic">
                VS
              </span>
            </div>

            {/* Player 2 */}
            <div className="flex flex-col items-center">
              <AvatarWithBadgeFrame 
                rumuz={activeDuelSession.player2?.rumuz || 'Rakip'}
                unlockedBadges={activeDuelSession.player2?.isBot ? ['KPSS Yapay Zeka'] : ['1v1 Gladyatör']}
                duelWins={activeDuelSession.player2?.isBot ? 99 : 3}
                duelStreak={activeDuelSession.player2?.isBot ? 5 : 1}
                isDuelMode={true}
                size="lg"
              />
              <span className="text-sm font-black text-rose-300 max-w-[120px] truncate mt-2">
                {activeDuelSession.player2?.rumuz || 'Rakip'}
              </span>
              <span className="text-[10px] text-slate-400">
                {activeDuelPlayerKey === 'player2' ? '(Sen)' : activeDuelSession.player2?.isBot ? '(Bot)' : 'Oyuncu 2'}
              </span>
            </div>
          </div>

          {/* 10s Countdown Circle */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-3xl flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/50 animate-pulse">
            {countdownNum}
          </div>

          <p className="text-xs font-bold text-slate-300 mt-4">
            {isTest 
              ? 'Her soru için 40 saniyeniz var! İki taraf da cevaplarsa anında sonuca geçilir.' 
              : 'Haritada aranan yeri en hızlı ve en yakın işaretleyen puanı kapar!'}
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. MAÇ SONUÇ EKRANI (Kompakt, Smooth & Mobilde Kaydırılabilir Tasarım)
  // -------------------------------------------------------------
  if (activeDuelSession.status === 'finished') {
    const isWinner = activeDuelSession.winnerId === activeDuelPlayerKey;
    const isDraw = activeDuelSession.winnerId === 'draw';
    const historyList = activeDuelSession.roundHistory || [];
    const isTest = activeDuelSession.duelType === 'kpss_test';

    return (
      <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-xl max-h-[92dvh] bg-[#09090b]/95 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-3.5 sm:p-5 text-white text-center animate-in zoom-in-95 duration-200 flex flex-col my-auto">
          {/* Header Summary */}
          <div className="shrink-0 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center mx-auto mb-1.5 shadow-xl shadow-amber-500/30">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
            </div>

            <h2 className="text-base sm:text-xl font-black text-amber-400 mb-0.5">
              {isDraw ? '🤝 BERABERE BİTTİ!' : isWinner ? '🏆 TEBRİKLER! DÜELLOYU KAZANDINIZ!' : '⚔️ DÜELLO TAMAMLANDI!'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400">
              {isTest ? 'KPSS Test Modu' : 'Harita Modu'} • {activeDuelSession.questionCount} Soru • {activeDuelSession.categoryFilter}
            </p>
          </div>

          {/* Karşılaştırma Kartları */}
          <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
            {/* Player 1 */}
            <div className={`p-2 sm:p-3 rounded-xl border ${activeDuelSession.player1.id === activeDuelSession.winnerId ? 'bg-amber-500/20 border-amber-400' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <AvatarWithBadgeFrame 
                  rumuz={activeDuelSession.player1.rumuz}
                  unlockedBadges={unlockedBadges}
                  duelWins={duelStats.duelWins}
                  duelStreak={duelStats.duelStreak}
                  isDuelMode={true}
                  avatarIcon={avatarIcon}
                  avatarBg={avatarBg}
                  equippedTitle={equippedTitle}
                  size="sm"
                />
                <span className="text-xs font-bold text-slate-200 truncate">
                  {activeDuelSession.player1.rumuz} {activeDuelPlayerKey === 'player1' ? '(Sen)' : ''}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-indigo-400 block">
                {activeDuelSession.player1.score} P
              </span>
              {!isTest && (
                <span className="text-[9px] sm:text-[10px] text-slate-400 block">
                  Hata: <strong className="text-amber-300">{Math.round(activeDuelSession.player1.totalDistanceKm)} km</strong>
                </span>
              )}
            </div>

            {/* Player 2 */}
            <div className={`p-2 sm:p-3 rounded-xl border ${activeDuelSession.player2?.id === activeDuelSession.winnerId ? 'bg-amber-500/20 border-amber-400' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <AvatarWithBadgeFrame 
                  rumuz={activeDuelSession.player2?.rumuz || 'Rakip'}
                  unlockedBadges={activeDuelSession.player2?.isBot ? ['KPSS Yapay Zeka'] : ['Düello Yarışçısı']}
                  duelWins={activeDuelSession.player2?.isBot ? 50 : 2}
                  duelStreak={activeDuelSession.player2?.isBot ? 2 : 0}
                  isDuelMode={true}
                  size="sm"
                />
                <span className="text-xs font-bold text-slate-200 truncate">
                  {activeDuelSession.player2?.rumuz || 'Rakip'} {activeDuelPlayerKey === 'player2' ? '(Sen)' : ''}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-rose-400 block">
                {activeDuelSession.player2?.score || 0} P
              </span>
              {!isTest && (
                <span className="text-[9px] sm:text-[10px] text-slate-400 block">
                  Hata: <strong className="text-amber-300">{Math.round(activeDuelSession.player2?.totalDistanceKm || 0)} km</strong>
                </span>
              )}
            </div>
          </div>

          {/* Soru Soru Karşılaştırma Tablosu (Mobilde Kusursuz Kaydırma & Kompakt Görünüm) */}
          <div className="flex-1 min-h-0 bg-black/40 border border-white/10 rounded-xl p-2 sm:p-2.5 mb-3 flex flex-col text-left">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 shrink-0">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                {isTest ? <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> : <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isTest ? 'Soru & Cevap Karşılaştırması' : 'Lokasyon & Uzaklık Karşılaştırması'}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {historyList.length} / {activeDuelSession.questionCount}
              </span>
            </div>

            {/* Scrollable list of round history */}
            <div className="overflow-y-auto pr-1 space-y-1.5 max-h-[32vh] sm:max-h-[38vh]">
              {historyList.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  Karşılaştırma detayları yükleniyor...
                </div>
              ) : (
                historyList.map((item, idx) => {
                  if (isTest) {
                    const p1Opt = item.player1SelectedOption;
                    const p2Opt = item.player2SelectedOption;
                    const correctIdx = item.correctOptionIndex ?? 0;
                    const p1Correct = p1Opt === correctIdx;
                    const p2Correct = p2Opt === correctIdx;
                    const optionsList = item.options || [];

                    return (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-2 transition-all">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1 truncate">
                            <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {item.targetTitle}
                            </span>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">
                            Doğru: {optionsList[correctIdx] || `Seçenek ${correctIdx + 1}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          <div className={`p-1 rounded flex items-center justify-between gap-1 ${p1Correct ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'}`}>
                            <span className="truncate text-[10px]">{activeDuelSession.player1.rumuz}: {p1Opt !== null && p1Opt !== undefined && p1Opt >= 0 ? (optionsList[p1Opt] || `Seçenek ${p1Opt + 1}`) : 'Boş'}</span>
                            <span className="font-black text-[10px] shrink-0">+{item.player1Points}P</span>
                          </div>

                          <div className={`p-1 rounded flex items-center justify-between gap-1 ${p2Correct ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'}`}>
                            <span className="truncate text-[10px]">{activeDuelSession.player2?.rumuz || 'Rakip'}: {p2Opt !== null && p2Opt !== undefined && p2Opt >= 0 ? (optionsList[p2Opt] || `Seçenek ${p2Opt + 1}`) : 'Boş'}</span>
                            <span className="font-black text-[10px] shrink-0">+{item.player2Points}P</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Pin Map round
                  const p1Dist = item.player1DistanceKm;
                  const p2Dist = item.player2DistanceKm;
                  const p1Closer = p1Dist < p2Dist;
                  const p2Closer = p2Dist < p1Dist;

                  return (
                    <div key={item.questionId || idx} className="bg-white/5 border border-white/10 rounded-lg p-2 transition-all">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {cleanFeatureTitle(item.targetTitle)}
                          </span>
                        </div>
                        {item.targetCategory && (
                          <span className="text-[9px] text-slate-400 bg-white/5 px-1 py-0.5 rounded border border-white/5 shrink-0 hidden xs:inline">
                            {item.targetCategory}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div className={`p-1 rounded flex items-center justify-between gap-1 ${p1Closer ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200' : 'bg-black/30 text-slate-300'}`}>
                          <div className="truncate">
                            <span className="font-semibold text-[10px] text-indigo-300 block truncate">{activeDuelSession.player1.rumuz}</span>
                            <span className="font-mono font-bold">{item.player1Guess ? `${Math.round(p1Dist)} km` : 'Cevapsız'}</span>
                          </div>
                          <span className="font-black text-[10px] text-emerald-400 shrink-0">+{item.player1Points}P</span>
                        </div>

                        <div className={`p-1 rounded flex items-center justify-between gap-1 ${p2Closer ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200' : 'bg-black/30 text-slate-300'}`}>
                          <div className="truncate">
                            <span className="font-semibold text-[10px] text-rose-300 block truncate">{activeDuelSession.player2?.rumuz || 'Rakip'}</span>
                            <span className="font-mono font-bold">{item.player2Guess ? `${Math.round(p2Dist)} km` : 'Cevapsız'}</span>
                          </div>
                          <span className="font-black text-[10px] text-emerald-400 shrink-0">+{item.player2Points}P</span>
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
              className="flex-1 py-2 sm:py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Lobiye Dön
            </button>

            <button
              onClick={handleStartQuickMatch}
              className="flex-1 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeni Düello</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. CANLI OYUN HUD'I (HARİTA MODU VEYA KPSS TEST YARIŞMASI MODU)
  // -------------------------------------------------------------
  const isTestMode = activeDuelSession.duelType === 'kpss_test';
  const curRound = activeDuelSession.currentRound ?? 0;
  const currentMapQ = !isTestMode 
    ? (roundQuestions[curRound] || roundQuestions[curRound % Math.max(1, roundQuestions.length)] || PIN_GAME_QUESTIONS[curRound % PIN_GAME_QUESTIONS.length]) 
    : null;
  const currentTestQ = isTestMode 
    ? (roundTestQuestions[curRound] || roundTestQuestions[curRound % Math.max(1, roundTestQuestions.length)] || MULTIPLE_CHOICE_QUESTIONS[curRound % MULTIPLE_CHOICE_QUESTIONS.length]) 
    : null;

  if (!currentMapQ && !currentTestQ) return null;

  const myPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1 : activeDuelSession.player2;
  const otherPlayer = activeDuelPlayerKey === 'player1' ? activeDuelSession.player2 : activeDuelSession.player1;

  const isReveal = activeDuelSession.status === 'round_reveal';

  // -------------------------------------------------------------
  // 6A. KPSS TEST DÜELLOSU OYUN EKRANI (40 sn, Çoktan Seçmeli Soru Kartı)
  // -------------------------------------------------------------
  if (isTestMode && currentTestQ) {
    const hasMyAnswer = myPlayer?.currentOptionAnswer !== null && myPlayer?.currentOptionAnswer !== undefined;
    const hasOtherAnswer = otherPlayer?.currentOptionAnswer !== null && otherPlayer?.currentOptionAnswer !== undefined;
    const mySelectedOpt = myPlayer?.currentOptionAnswer;
    const isMyCorrect = isReveal && mySelectedOpt === currentTestQ.correctIndex;

    const handleSelectOption = (idx: number) => {
      if (hasMyAnswer || isReveal || !activeDuelPlayerKey) return;
      const myId = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1.id : activeDuelSession.player2?.id;
      if (!myId) return;

      const elapsedSec = (Date.now() - (activeDuelSession.roundStartTime || Date.now())) / 1000;
      submitPlayerTestAnswer(
        activeDuelSession, 
        myId, 
        idx, 
        currentTestQ.correctIndex, 
        Math.min(40, Math.max(0.5, elapsedSec))
      );
    };

    return (
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowExitConfirmModal(true);
          }
        }}
        className="absolute inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px] flex flex-col justify-between p-2 sm:p-4 cursor-pointer overflow-y-auto"
      >
        {/* Top Floating Match Header */}
        <div 
          id="duel-active-hud" 
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-xl mx-auto bg-[#09090b]/95 backdrop-blur-2xl border-2 border-indigo-500/80 rounded-2xl shadow-2xl p-2.5 text-white animate-in fade-in duration-150 cursor-default"
        >
          {/* Row 1: Kategori, Bölge & Tur */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-black text-[10px] shrink-0">
                KPSS TEST
              </span>
              <span className="font-black text-xs sm:text-sm text-indigo-300 truncate">
                {currentTestQ.category} • {currentTestQ.region}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-extrabold text-slate-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                {activeDuelSession.currentRound + 1}/{activeDuelSession.questionCount}
              </span>
              <button
                onClick={() => setShowExitConfirmModal(true)}
                className="p-1 rounded-lg bg-white/10 hover:bg-red-500/30 text-slate-300 transition-all cursor-pointer"
                title="Düellodan Çık"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2: Sen | 40s / Reveal Timer | Rakip */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <AvatarWithBadgeFrame 
                rumuz={myPlayer?.rumuz || 'Sen'}
                unlockedBadges={unlockedBadges}
                duelWins={duelStats.duelWins}
                duelStreak={duelStats.duelStreak}
                isDuelMode={true}
                avatarIcon={avatarIcon}
                avatarBg={avatarBg}
                equippedTitle={equippedTitle}
                size="sm"
              />
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-black text-indigo-300 truncate block">
                  {myPlayer?.rumuz} (Sen)
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-black text-white">{myPlayer?.score || 0} P</span>
                  {hasMyAnswer ? (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded">✓ Yanıtladın</span>
                  ) : (
                    <span className="text-[9px] font-medium text-amber-300 animate-pulse">Cevapla!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex flex-col items-center shrink-0 px-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-xs sm:text-sm shadow-lg ${
                isReveal
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
                  : timeLeftSec <= 5
                  ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-ping'
                  : timeLeftSec <= 15
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                  : 'bg-indigo-500/30 border-indigo-400 text-indigo-300'
              }`}>
                {isReveal ? `${revealCountdown}s` : `${timeLeftSec}s`}
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">
                {isReveal ? 'Sonraki' : 'Süre'}
              </span>
            </div>

            {/* Opponent */}
            <div className="flex items-center justify-end gap-1.5 min-w-0 text-right">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-black text-rose-300 truncate block">
                  {otherPlayer?.rumuz || 'Rakip'}
                </span>
                <div className="flex items-center justify-end gap-1">
                  {hasOtherAnswer ? (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded">✓ Yanıtladı</span>
                  ) : (
                    <span className="text-[9px] font-medium text-slate-400">Düşünüyor...</span>
                  )}
                  <span className="text-[11px] sm:text-xs font-black text-white">{otherPlayer?.score || 0} P</span>
                </div>
              </div>
              <AvatarWithBadgeFrame 
                rumuz={otherPlayer?.rumuz || 'Rakip'}
                unlockedBadges={otherPlayer?.isBot ? ['KPSS Yapay Zeka'] : ['Düello Yarışçısı']}
                duelWins={otherPlayer?.isBot ? 50 : 2}
                duelStreak={otherPlayer?.isBot ? 2 : 0}
                isDuelMode={true}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Center / Bottom: KPSS Question & Choice Options Card */}
        <div 
          id="duel-active-card" 
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-xl mx-auto bg-[#09090b]/95 backdrop-blur-2xl border-2 border-indigo-500/60 rounded-2xl shadow-2xl p-3 sm:p-4 text-white my-auto animate-in slide-in-from-bottom-3 duration-200 cursor-default"
        >
          <div className="font-extrabold text-xs sm:text-sm text-slate-100 leading-relaxed mb-3">
            {currentTestQ.questionText}
          </div>

          {/* Options A, B, C, D, E */}
          <div className="space-y-1.5">
            {currentTestQ.options.map((opt, idx) => {
              const optLetter = String.fromCharCode(65 + idx);
              const isSelectedByMe = mySelectedOpt === idx;
              const isCorrectOpt = idx === currentTestQ.correctIndex;

              let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200';
              if (isSelectedByMe && !isReveal) {
                btnStyle = 'bg-indigo-600 border-indigo-400 text-white font-black shadow-md';
              }
              if (isReveal) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white font-black shadow-md';
                } else if (isSelectedByMe && !isCorrectOpt) {
                  btnStyle = 'bg-rose-600/80 border-rose-400 text-white line-through opacity-80';
                } else {
                  btnStyle = 'bg-white/5 border-white/5 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasMyAnswer || isReveal}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-black shrink-0">
                      {optLetter}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isReveal && isCorrectOpt && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  )}
                  {isReveal && isSelectedByMe && !isCorrectOpt && (
                    <XCircle className="w-4 h-4 text-rose-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reveal Result & Advance Vote Banner */}
          {isReveal && (
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="text-xs">
                {isMyCorrect ? (
                  <span className="font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Doğru Cevap! (+100P + Hız Bonusu)
                  </span>
                ) : (
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    Yanlış! Doğru Seçenek: {String.fromCharCode(65 + currentTestQ.correctIndex)}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  if (activeDuelPlayerKey) {
                    const myId = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1.id : activeDuelSession.player2?.id;
                    if (myId) {
                      if (activeDuelSession.player2?.isBot) {
                        advanceDuelRound(activeDuelSession);
                      } else {
                        voteToAdvanceDuelRound(activeDuelSession, myId);
                      }
                    }
                  }
                }}
                className={`px-3 py-1.5 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer ${
                  myPlayer?.readyToAdvance
                    ? 'bg-emerald-500/30 border border-emerald-400/60 text-emerald-300'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {myPlayer?.readyToAdvance ? (
                  <span>Bekleniyor ({revealCountdown}s)</span>
                ) : (
                  <>
                    <span>Sonraki Soru</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 2-Click Outside Warning Toast */}
        {outsideClickWarning && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3.5 py-1.5 rounded-full bg-rose-600/95 text-white border border-rose-400/80 shadow-2xl text-xs font-black flex items-center gap-1.5 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <span>Düellodan çıkmak için ekrana 1 kez daha dokunun</span>
            </div>
          </div>
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirmModal && (
          <div id="duel-exit-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
            <div className="w-full max-w-sm bg-[#09090b]/98 border-2 border-rose-500/80 rounded-2xl shadow-2xl p-5 text-white text-center animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mx-auto mb-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white mb-1.5">
                Düellodan Çıkmak İstiyor Musunuz?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Aktif bir düellodan ayrılırsanız maç hükmen sonlanır ve skorunuz kaydedilmez.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExitConfirmModal(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Devam Et
                </button>
                <button
                  onClick={handleLeaveDuel}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Evet, Çık
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6B. HARİTA İŞARETLEME DÜELLOSU HUD'I (15 sn, Aranan Yer & Tıklama)
  // -------------------------------------------------------------
  const sanitizedTitle = currentMapQ ? cleanFeatureTitle(currentMapQ.title) : '';
  const hasMyGuess = !!myPlayer?.currentGuess;
  const hasOtherGuess = !!otherPlayer?.currentGuess;

  return (
    <>
      {/* Top Floating Match Header Bar */}
      <div id="duel-active-hud" className="absolute top-11 sm:top-2 left-1/2 -translate-x-1/2 z-30 w-[96vw] sm:w-auto max-w-xl sm:max-w-2xl bg-[#09090b]/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-2xl shadow-2xl p-2 sm:p-2.5 text-white animate-in fade-in duration-200">
        {/* Row 1: Soru İsmi, Kategori & Tur Sayısı */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] sm:text-xs shrink-0 flex items-center gap-1 shadow-sm">
              <Crosshair className="w-3 h-3" />
              ARANAN:
            </span>
            <span className="font-black text-xs sm:text-sm text-amber-300 leading-tight truncate">
              {sanitizedTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-extrabold text-slate-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
              {activeDuelSession.currentRound + 1}/{activeDuelSession.questionCount}
            </span>
            <button
              onClick={() => setShowExitConfirmModal(true)}
              className="p-1 rounded-lg bg-white/10 hover:bg-red-500/30 text-slate-300 transition-all cursor-pointer"
              title="Düellodan Çık"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Sen | 15s Timer | Rakip */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <AvatarWithBadgeFrame 
              rumuz={myPlayer?.rumuz || 'Sen'}
              unlockedBadges={unlockedBadges}
              duelWins={duelStats.duelWins}
              duelStreak={duelStats.duelStreak}
              isDuelMode={true}
              avatarIcon={avatarIcon}
              avatarBg={avatarBg}
              equippedTitle={equippedTitle}
              size="sm"
            />
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-black text-indigo-300 truncate block">
                {myPlayer?.rumuz} (Sen)
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-black text-white">{myPlayer?.score || 0} P</span>
                {hasMyGuess ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded">⚡ Tıkladın</span>
                ) : (
                  <span className="text-[9px] font-medium text-amber-300 animate-pulse">Haritaya Tıkla!</span>
                )}
              </div>
            </div>
          </div>

          {/* 15s Timer */}
          <div className="flex flex-col items-center shrink-0 px-2">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-xs sm:text-sm shadow-lg transition-all ${
              timeLeftSec <= 4
                ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-ping'
                : timeLeftSec <= 8
                ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                : 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
            }`}>
              {timeLeftSec}s
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kalan Süre</span>
          </div>

          {/* Opponent */}
          <div className="flex items-center justify-end gap-1.5 min-w-0 text-right">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-black text-rose-300 truncate block">
                {otherPlayer?.rumuz || 'Rakip'}
              </span>
              <div className="flex items-center justify-end gap-1">
                {hasOtherGuess ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded">⚡ Tıkladı</span>
                ) : (
                  <span className="text-[9px] font-medium text-slate-400">Düşünüyor...</span>
                )}
                <span className="text-[11px] sm:text-xs font-black text-white">{otherPlayer?.score || 0} P</span>
              </div>
            </div>
            <AvatarWithBadgeFrame 
              rumuz={otherPlayer?.rumuz || 'Rakip'}
              unlockedBadges={otherPlayer?.isBot ? ['KPSS Yapay Zeka'] : ['Düello Yarışçısı']}
              duelWins={otherPlayer?.isBot ? 50 : 2}
              duelStreak={otherPlayer?.isBot ? 2 : 0}
              isDuelMode={true}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Round Reveal Bar at the bottom */}
      {isReveal && (
        <div
          id="duel-round-reveal-banner"
          className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 w-[96vw] max-w-xl bg-[#09090b]/95 backdrop-blur-2xl border border-amber-400/80 rounded-xl shadow-2xl px-2.5 py-1.5 text-white animate-in slide-in-from-bottom-2 duration-150 flex items-center justify-between gap-1.5"
        >
          {/* Left: Sen */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="leading-none min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-indigo-300 truncate max-w-[65px] sm:max-w-[85px]">
                  {myPlayer?.rumuz} (Sen)
                </span>
                {lastRoundScore && (
                  <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded hidden sm:inline ${lastRoundScore.tierColor}`}>
                    {lastRoundScore.tierName}
                  </span>
                )}
              </div>
              {myPlayer?.currentGuess ? (
                <div className="text-[10px] font-bold text-amber-300 mt-0.5 whitespace-nowrap">
                  {Math.round(myPlayer.currentGuess.distanceKm)} km{' '}
                  <span className="text-emerald-400 font-black">+{myPlayer.currentGuess.pointsEarned}P</span>
                </div>
              ) : (
                <span className="text-[9px] text-rose-400 font-bold mt-0.5 block">0P (Geçti)</span>
              )}
            </div>
          </div>

          {/* Center: Target Location Badge & 7s Countdown */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[10px] font-black max-w-[130px] sm:max-w-[180px] truncate shrink">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate hidden xs:inline">{sanitizedTitle}</span>
            <span className="text-amber-300 font-mono font-bold ml-auto px-1 py-0.2 bg-amber-500/20 rounded">
              {revealCountdown}s
            </span>
          </div>

          {/* Right: Opponent */}
          <div className="flex items-center gap-1.5 min-w-0 text-right">
            <div className="leading-none min-w-0">
              <div className="flex items-center justify-end gap-1">
                {opponentRoundScore && (
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
                  {Math.round(otherPlayer.currentGuess.distanceKm)} km{' '}
                  <span className="text-emerald-400 font-black">+{otherPlayer.currentGuess.pointsEarned}P</span>
                </div>
              ) : (
                <span className="text-[9px] text-rose-400 font-bold mt-0.5 block">0P (Geçti)</span>
              )}
            </div>
          </div>

          {/* Advance Button */}
          <button
            onClick={() => {
              if (activeDuelPlayerKey) {
                const myId = activeDuelPlayerKey === 'player1' ? activeDuelSession.player1.id : activeDuelSession.player2?.id;
                if (myId) {
                  if (activeDuelSession.player2?.isBot) {
                    flyToCoords([35.243, 38.963], 0, 0, 5.5);
                    advanceDuelRound(activeDuelSession);
                  } else {
                    voteToAdvanceDuelRound(activeDuelSession, myId);
                  }
                }
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

      {/* 2-Click Outside Warning Toast */}
      {outsideClickWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3.5 py-1.5 rounded-full bg-rose-600/95 text-white border border-rose-400/80 shadow-2xl text-xs font-black flex items-center gap-1.5 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span>Düellodan çıkmak için ekrana 1 kez daha dokunun</span>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirmModal && (
        <div id="duel-exit-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-sm bg-[#09090b]/98 border-2 border-rose-500/80 rounded-2xl shadow-2xl p-5 text-white text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mx-auto mb-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-1.5">
              Düellodan Çıkmak İstiyor Musunuz?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Aktif bir düellodan ayrılırsanız maç hükmen sonlanır ve skorunuz kaydedilmez.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Devam Et
              </button>
              <button
                onClick={handleLeaveDuel}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Evet, Çık
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
