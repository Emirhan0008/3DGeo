import { create } from 'zustand';
import { GeoFeature, ALL_GEO_FEATURES } from '../data/turkeyData';
import { 
  PIN_GAME_QUESTIONS, 
  MULTIPLE_CHOICE_QUESTIONS,
  getCurrentPinQuestion,
  getCurrentQuizQuestion,
  getFilteredPinQuestions,
  getFilteredQuizQuestions,
  shuffleArray,
  PinGameQuestion,
  MultipleChoiceQuestion
} from '../data/quizQuestions';
import confetti from 'canvas-confetti';

export type MapStyleType = 'topographic' | 'hybrid' | 'dark' | 'satellite';
export type ActiveTabType = 'map' | 'pin_game' | 'quiz_test' | 'flashcards' | 'stats' | 'ai_tutor';

export interface LayerState {
  mountainsVolcanic: boolean;
  mountainsFold: boolean;
  mountainsFault: boolean;
  mountainsGlacial: boolean;
  rivers: boolean;
  lakes: boolean;
  plainsDelta: boolean;
  plainsTectonic: boolean;
  plainsKarstic: boolean;
  plateaus: boolean;
  karstics: boolean;
  coastal: boolean;
  passes: boolean;
  borderGates: boolean;
  mines: boolean;
  provinces: boolean;
}

export interface AppState {
  // Navigation & UI
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isAiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;

  // Map Controls
  mapStyle: MapStyleType;
  setMapStyle: (style: MapStyleType) => void;
  terrainExaggeration: number;
  setTerrainExaggeration: (factor: number) => void;
  layers: LayerState;
  toggleLayer: (layerKey: keyof LayerState) => void;
  selectAllLayers: () => void;
  clearAllLayers: () => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  
  // Category Filter for Games/Tests
  gameCategoryFilter: string;
  setGameCategoryFilter: (category: string) => void;

  // Feature Selection & Search
  selectedFeature: GeoFeature | null;
  setSelectedFeature: (feature: GeoFeature | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Camera Fly To Signal
  cameraFlyTarget: { coords: [number, number]; pitch?: number; bearing?: number; zoom?: number } | null;
  flyToCoords: (coords: [number, number], pitch?: number, bearing?: number, zoom?: number) => void;
  clearFlyTarget: () => void;

  // Pin Guess Game State
  shuffledPinQuestions: PinGameQuestion[];
  pinGameIndex: number;
  score: number;
  streak: number;
  lastGuessDistanceKm: number | null;
  lastGuessPoints: number | null;
  pinGuessCoords: [number, number] | null;
  isPinGuessed: boolean;
  submitPinGuess: (userLng: number, userLat: number) => void;
  nextPinQuestion: () => void;
  resetPinGame: () => void;
  shufflePinQuestions: () => void;

  // Multiple Choice Quiz State
  shuffledQuizQuestions: MultipleChoiceQuestion[];
  quizTestIndex: number;
  quizScore: number;
  quizSelectedOption: number | null;
  isQuizAnswered: boolean;
  answerQuizQuestion: (optionIndex: number) => void;
  nextQuizQuestion: () => void;
  resetQuizTest: () => void;
  shuffleQuizQuestions: () => void;

  // Gamification & Badges
  unlockedBadges: string[];
  totalQuestionsAnswered: number;
  correctAnswersCount: number;

  // Analytics & Statistics Tracking State
  regionalStats: Record<string, { correct: number; wrong: number }>;
  categoryStats: Record<string, { correct: number; wrong: number }>;
  totalDistanceErrorKm: number;
  pinGuessCount: number;

  // Dilsiz Harita (Blind Outline Map) Mode
  isBlindMapMode: boolean;
  toggleBlindMapMode: () => void;
  setBlindMapMode: (enabled: boolean) => void;

  // Tracked Weak Spots / Misplaced Geography Items
  missedItems: Record<string, { id: string; name: string; category: string; region: string; coords: [number, number]; wrongCount: number }>;
  resetStats: () => void;
  hydrateUserData: (data: Partial<AppState>) => void;
}

// Haversine formula to calculate distance in km between two lat/lng points
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'map',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isAiDrawerOpen: false,
  setAiDrawerOpen: (open) => set({ isAiDrawerOpen: open }),

  gameCategoryFilter: 'Genel',
  setGameCategoryFilter: (category) =>
    set({
      gameCategoryFilter: category,
      shuffledPinQuestions: shuffleArray(getFilteredPinQuestions(category)),
      shuffledQuizQuestions: shuffleArray(getFilteredQuizQuestions(category)),
      pinGameIndex: 0,
      quizTestIndex: 0,
      isPinGuessed: false,
      pinGuessCoords: null,
      lastGuessDistanceKm: null,
      lastGuessPoints: null,
      quizSelectedOption: null,
      isQuizAnswered: false,
    }),

  mapStyle: 'topographic',
  setMapStyle: (style) => set({ mapStyle: style }),
  terrainExaggeration: 1.8,
  setTerrainExaggeration: (factor) => set({ terrainExaggeration: factor }),

  layers: {
    mountainsVolcanic: true,
    mountainsFold: true,
    mountainsFault: true,
    mountainsGlacial: true,
    rivers: true,
    lakes: true,
    plainsDelta: true,
    plainsTectonic: true,
    plainsKarstic: true,
    plateaus: true,
    karstics: true,
    coastal: true,
    passes: true,
    borderGates: true,
    mines: true,
    provinces: true,
  },
  toggleLayer: (layerKey) =>
    set((state) => ({
      layers: { ...state.layers, [layerKey]: !state.layers[layerKey] }
    })),
  selectAllLayers: () =>
    set({
      layers: {
        mountainsVolcanic: true,
        mountainsFold: true,
        mountainsFault: true,
        mountainsGlacial: true,
        rivers: true,
        lakes: true,
        plainsDelta: true,
        plainsTectonic: true,
        plainsKarstic: true,
        plateaus: true,
        karstics: true,
        coastal: true,
        passes: true,
        borderGates: true,
        mines: true,
        provinces: true,
      }
    }),
  clearAllLayers: () =>
    set({
      layers: {
        mountainsVolcanic: false,
        mountainsFold: false,
        mountainsFault: false,
        mountainsGlacial: false,
        rivers: false,
        lakes: false,
        plainsDelta: false,
        plainsTectonic: false,
        plainsKarstic: false,
        plateaus: false,
        karstics: false,
        coastal: false,
        passes: false,
        borderGates: false,
        mines: false,
        provinces: false,
      }
    }),

  selectedRegion: 'Tüm Bölgeler',
  setSelectedRegion: (region) => set({ selectedRegion: region }),

  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  cameraFlyTarget: null,
  flyToCoords: (coords, pitch = 0, bearing = 0, zoom = 7.5) =>
    set({ cameraFlyTarget: { coords, pitch: 0, bearing: 0, zoom: Math.min(zoom, 8.2) } }),
  clearFlyTarget: () => set({ cameraFlyTarget: null }),

  // Pin Guessing Game Logic
  shuffledPinQuestions: [],
  pinGameIndex: 0,
  score: 0,
  streak: 0,
  lastGuessDistanceKm: null,
  lastGuessPoints: null,
  pinGuessCoords: null,
  isPinGuessed: false,

  shufflePinQuestions: () => {
    const state = get();
    set({
      shuffledPinQuestions: shuffleArray(getFilteredPinQuestions(state.gameCategoryFilter)),
      pinGameIndex: 0,
      isPinGuessed: false,
      pinGuessCoords: null,
      lastGuessDistanceKm: null,
      lastGuessPoints: null
    });
  },

  // Multiple Choice Quiz State
  shuffledQuizQuestions: [],
  quizTestIndex: 0,
  quizScore: 0,
  quizSelectedOption: null,
  isQuizAnswered: false,

  shuffleQuizQuestions: () => {
    const state = get();
    set({
      shuffledQuizQuestions: shuffleArray(getFilteredQuizQuestions(state.gameCategoryFilter)),
      quizTestIndex: 0,
      quizSelectedOption: null,
      isQuizAnswered: false
    });
  },

  // Analytics & Statistics Tracking State
  regionalStats: {
    'Marmara': { correct: 0, wrong: 0 },
    'Ege': { correct: 0, wrong: 0 },
    'Akdeniz': { correct: 0, wrong: 0 },
    'İç Anadolu': { correct: 0, wrong: 0 },
    'Karadeniz': { correct: 0, wrong: 0 },
    'Doğu Anadolu': { correct: 0, wrong: 0 },
    'Güneydoğu Anadolu': { correct: 0, wrong: 0 }
  },
  categoryStats: {
    'Dağlar': { correct: 0, wrong: 0 },
    'Akarsular': { correct: 0, wrong: 0 },
    'Göller': { correct: 0, wrong: 0 },
    'Sınır Kapıları': { correct: 0, wrong: 0 },
    'Geçitler': { correct: 0, wrong: 0 },
    'Platolar & Ovalar': { correct: 0, wrong: 0 },
    'Madenler': { correct: 0, wrong: 0 },
    'Karstik & Kıyı': { correct: 0, wrong: 0 }
  },
  totalDistanceErrorKm: 0,
  pinGuessCount: 0,

  // Dilsiz Harita (Blind Outline Map) State
  isBlindMapMode: false,
  toggleBlindMapMode: () => set((s) => ({ isBlindMapMode: !s.isBlindMapMode })),
  setBlindMapMode: (enabled) => set({ isBlindMapMode: enabled }),

  // Tracked Weak Spots / Misplaced Geography Items
  missedItems: {},

  resetStats: () => set({
    regionalStats: {
      'Marmara': { correct: 0, wrong: 0 },
      'Ege': { correct: 0, wrong: 0 },
      'Akdeniz': { correct: 0, wrong: 0 },
      'İç Anadolu': { correct: 0, wrong: 0 },
      'Karadeniz': { correct: 0, wrong: 0 },
      'Doğu Anadolu': { correct: 0, wrong: 0 },
      'Güneydoğu Anadolu': { correct: 0, wrong: 0 }
    },
    categoryStats: {
      'Dağlar': { correct: 0, wrong: 0 },
      'Akarsular': { correct: 0, wrong: 0 },
      'Göller': { correct: 0, wrong: 0 },
      'Sınır Kapıları': { correct: 0, wrong: 0 },
      'Geçitler': { correct: 0, wrong: 0 },
      'Platolar & Ovalar': { correct: 0, wrong: 0 },
      'Madenler': { correct: 0, wrong: 0 },
      'Karstik & Kıyı': { correct: 0, wrong: 0 }
    },
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
    totalDistanceErrorKm: 0,
    pinGuessCount: 0,
    missedItems: {}
  }),

  hydrateUserData: (data) => set((s) => ({ ...s, ...data })),

  submitPinGuess: (userLng, userLat) => {
    const state = get();
    if (state.isPinGuessed) return;

    const currentQ = getCurrentPinQuestion(state.pinGameIndex, state.gameCategoryFilter, state.shuffledPinQuestions);
    if (!currentQ) return;

    const [targetLng, targetLat] = currentQ.targetCoords;
    const distanceKm = calculateDistanceKm(userLat, userLng, targetLat, targetLng);

    // Scoring formula: Max 100 points. Full points if within 15km, decays with distance
    let points = 0;
    if (distanceKm <= 15) {
      points = 100;
    } else if (distanceKm <= 50) {
      points = Math.max(70, 100 - Math.round((distanceKm - 15) * 0.8));
    } else if (distanceKm <= 150) {
      points = Math.max(30, 70 - Math.round((distanceKm - 50) * 0.4));
    } else if (distanceKm <= 300) {
      points = Math.max(10, 30 - Math.round((distanceKm - 150) * 0.1));
    } else {
      points = 0;
    }

    const isGoodGuess = points >= 60;
    const newStreak = isGoodGuess ? state.streak + 1 : 0;
    const newTotalScore = state.score + points;

    if (isGoodGuess) {
      confetti({
        particleCount: points === 100 ? 100 : 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // Check badges
    const newBadges = [...state.unlockedBadges];
    if (points === 100 && !newBadges.includes('Tam İsabet Kaptan')) {
      newBadges.push('Tam İsabet Kaptan');
    }
    if (newStreak >= 5 && !newBadges.includes('5\'li Seri Canavarı')) {
      newBadges.push('5\'li Seri Canavarı');
    }

    // Update Analytics Stats
    const reg = currentQ.region || 'İç Anadolu';
    const cat = currentQ.category || 'Dağlar';
    const updatedRegStats = { ...state.regionalStats };
    const updatedCatStats = { ...state.categoryStats };

    if (!updatedRegStats[reg]) updatedRegStats[reg] = { correct: 0, wrong: 0 };
    if (!updatedCatStats[cat]) updatedCatStats[cat] = { correct: 0, wrong: 0 };

    if (isGoodGuess) {
      updatedRegStats[reg].correct += 1;
      updatedCatStats[cat].correct += 1;
    } else {
      updatedRegStats[reg].wrong += 1;
      updatedCatStats[cat].wrong += 1;
    }

    // Track missed item if error > 40km
    const updatedMissed = { ...state.missedItems };
    if (!isGoodGuess || distanceKm > 40) {
      const itemKey = currentQ.id || currentQ.title;
      if (!updatedMissed[itemKey]) {
        updatedMissed[itemKey] = {
          id: currentQ.id,
          name: currentQ.title,
          category: cat,
          region: reg,
          coords: currentQ.targetCoords,
          wrongCount: 1
        };
      } else {
        updatedMissed[itemKey].wrongCount += 1;
      }
    }

    set({
      pinGuessCoords: [userLng, userLat],
      lastGuessDistanceKm: distanceKm,
      lastGuessPoints: points,
      isPinGuessed: true,
      score: newTotalScore,
      streak: newStreak,
      unlockedBadges: newBadges,
      totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
      correctAnswersCount: isGoodGuess ? state.correctAnswersCount + 1 : state.correctAnswersCount,
      regionalStats: updatedRegStats,
      categoryStats: updatedCatStats,
      totalDistanceErrorKm: state.totalDistanceErrorKm + distanceKm,
      pinGuessCount: state.pinGuessCount + 1,
      missedItems: updatedMissed
    });

    // Smoothly fly and zoom to 7.0x at the target location when answer/guess is revealed
    get().flyToCoords(currentQ.targetCoords, 0, 0, 7.0);
  },

  nextPinQuestion: () => {
    const state = get();
    let questions = state.shuffledPinQuestions;
    if (!questions || questions.length === 0) {
      questions = shuffleArray(getFilteredPinQuestions(state.gameCategoryFilter));
    }
    const nextIdx = state.pinGameIndex + 1;
    if (nextIdx >= questions.length) {
      const reshuffled = shuffleArray(getFilteredPinQuestions(state.gameCategoryFilter));
      set({
        shuffledPinQuestions: reshuffled,
        pinGameIndex: 0,
        isPinGuessed: false,
        pinGuessCoords: null,
        lastGuessDistanceKm: null,
        lastGuessPoints: null
      });
    } else {
      set({
        pinGameIndex: nextIdx,
        isPinGuessed: false,
        pinGuessCoords: null,
        lastGuessDistanceKm: null,
        lastGuessPoints: null
      });
    }
    // Lock zoom to 5.5x at every question start
    get().flyToCoords([35.243, 38.963], 0, 0, 5.5);
  },

  resetPinGame: () => {
    const state = get();
    set({
      shuffledPinQuestions: shuffleArray(getFilteredPinQuestions(state.gameCategoryFilter)),
      pinGameIndex: 0,
      isPinGuessed: false,
      pinGuessCoords: null,
      lastGuessDistanceKm: null,
      lastGuessPoints: null
    });
    // Lock zoom to 5.5x at every question start
    get().flyToCoords([35.243, 38.963], 0, 0, 5.5);
  },

  answerQuizQuestion: (optionIndex) => {
    const state = get();
    if (state.isQuizAnswered) return;

    const currentQ = getCurrentQuizQuestion(state.quizTestIndex, state.gameCategoryFilter, state.shuffledQuizQuestions);
    if (!currentQ) return;

    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }

    const newScore = isCorrect ? state.quizScore + 100 : state.quizScore;
    const newBadges = [...state.unlockedBadges];
    if (newScore >= 300 && !newBadges.includes('KPSS Coğrafya Üstadı')) {
      newBadges.push('KPSS Coğrafya Üstadı');
    }

    // Update Analytics
    const reg = currentQ.region || 'İç Anadolu';
    const cat = currentQ.category || 'Dağlar';
    const updatedRegStats = { ...state.regionalStats };
    const updatedCatStats = { ...state.categoryStats };

    if (!updatedRegStats[reg]) updatedRegStats[reg] = { correct: 0, wrong: 0 };
    if (!updatedCatStats[cat]) updatedCatStats[cat] = { correct: 0, wrong: 0 };

    if (isCorrect) {
      updatedRegStats[reg].correct += 1;
      updatedCatStats[cat].correct += 1;
    } else {
      updatedRegStats[reg].wrong += 1;
      updatedCatStats[cat].wrong += 1;
    }

    set({
      quizSelectedOption: optionIndex,
      isQuizAnswered: true,
      quizScore: newScore,
      unlockedBadges: newBadges,
      totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
      correctAnswersCount: isCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount,
      regionalStats: updatedRegStats,
      categoryStats: updatedCatStats
    });

    if (currentQ.targetCoords) {
      get().flyToCoords(currentQ.targetCoords, 0, 0, 7.0);
    }
  },

  nextQuizQuestion: () => {
    const state = get();
    let questions = state.shuffledQuizQuestions;
    if (!questions || questions.length === 0) {
      questions = shuffleArray(getFilteredQuizQuestions(state.gameCategoryFilter));
    }
    const nextIdx = state.quizTestIndex + 1;
    if (nextIdx >= questions.length) {
      const reshuffled = shuffleArray(getFilteredQuizQuestions(state.gameCategoryFilter));
      set({
        shuffledQuizQuestions: reshuffled,
        quizTestIndex: 0,
        quizSelectedOption: null,
        isQuizAnswered: false
      });
    } else {
      set({
        quizTestIndex: nextIdx,
        quizSelectedOption: null,
        isQuizAnswered: false
      });
    }
    // Lock zoom to 5.5x at every question start
    get().flyToCoords([35.243, 38.963], 0, 0, 5.5);
  },

  resetQuizTest: () => {
    const state = get();
    set({
      shuffledQuizQuestions: shuffleArray(getFilteredQuizQuestions(state.gameCategoryFilter)),
      quizTestIndex: 0,
      quizScore: 0,
      quizSelectedOption: null,
      isQuizAnswered: false
    });
    // Lock zoom to 5.5x at every question start
    get().flyToCoords([35.243, 38.963], 0, 0, 5.5);
  },

  unlockedBadges: ['3D Coğrafyacı Çırağı'],
  totalQuestionsAnswered: 0,
  correctAnswersCount: 0
}));
