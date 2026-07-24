'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore, MapStyleType } from '@/lib/store/useStore';
import { ALL_GEO_FEATURES, GeoFeature } from '@/lib/data/turkeyData';
import { PIN_GAME_QUESTIONS, MULTIPLE_CHOICE_QUESTIONS } from '@/lib/data/quizQuestions';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Sparkles,
  MapPin,
  Compass,
  Zap,
  Volume2,
  VolumeX,
  X,
  EyeOff
} from 'lucide-react';

// Turkey geographic bounding box (SW: [24.5, 35.0], NE: [45.5, 43.0])
const TURKEY_BOUNDS: maplibregl.LngLatBoundsLike = [
  [24.5, 35.0], // Southwest longitude, latitude
  [45.5, 43.0], // Northeast longitude, latitude
];

// Region camera focal points
const REGION_CENTERS: Record<string, { coords: [number, number]; zoom: number }> = {
  'Tüm Bölgeler': { coords: [35.243, 38.963], zoom: 6.2 },
  'Marmara': { coords: [28.0, 40.8], zoom: 7.2 },
  'Ege': { coords: [28.2, 38.2], zoom: 7.2 },
  'Akdeniz': { coords: [32.5, 37.0], zoom: 7.2 },
  'İç Anadolu': { coords: [33.5, 39.0], zoom: 6.8 },
  'Karadeniz': { coords: [36.5, 41.0], zoom: 6.8 },
  'Doğu Anadolu': { coords: [41.5, 39.5], zoom: 6.8 },
  'Güneydoğu Anadolu': { coords: [39.5, 37.5], zoom: 7.2 },
};

// Reliable MapLibre Style Specifications that support both normal and Blind Map (Dilsiz Harita) modes
const MAP_STYLE_CONFIGS: Record<MapStyleType, (isBlind: boolean) => maplibregl.StyleSpecification | string> = {
  topographic: (isBlind) => ({
    version: 8,
    name: 'Carto Voyager Topo',
    sources: {
      'carto-voyager': {
        type: 'raster',
        tiles: [
          isBlind
            ? 'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
            : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          isBlind
            ? 'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
            : 'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          isBlind
            ? 'https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
            : 'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
        ],
        tileSize: 256,
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'carto-voyager-layer',
        type: 'raster',
        source: 'carto-voyager',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  }),
  hybrid: (isBlind) => ({
    version: 8,
    name: 'Esri World Topo / Positron',
    sources: {
      'hybrid-source': {
        type: 'raster',
        tiles: [
          isBlind
            ? 'https://a.basemaps.cartocdn.com/rastertiles/positron_nolabels/{z}/{x}/{y}@2x.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'Esri & Carto',
        maxzoom: 18,
      },
    },
    layers: [
      {
        id: 'hybrid-layer',
        type: 'raster',
        source: 'hybrid-source',
      },
    ],
  }),
  dark: (isBlind) => (
    isBlind
      ? {
          version: 8,
          name: 'Carto Dark No Labels',
          sources: {
            'dark-nolabels': {
              type: 'raster',
              tiles: ['https://a.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}@2x.png'],
              tileSize: 256,
              attribution: 'CARTO',
              maxzoom: 19,
            }
          },
          layers: [{ id: 'dark-nolabels-layer', type: 'raster', source: 'dark-nolabels' }]
        }
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
  ),
  satellite: () => ({
    version: 8,
    name: 'Esri World Imagery',
    sources: {
      'esri-sat': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri World Imagery',
        maxzoom: 18,
      },
    },
    layers: [
      {
        id: 'esri-sat-layer',
        type: 'raster',
        source: 'esri-sat',
      },
    ],
  }),
};

// Color styles and ring themes per landform category
const CATEGORY_STYLES: Record<GeoFeature['type'], { bg: string; ring: string; pulse: string; badgeBg: string; text: string; border: string }> = {
  mountain: { bg: 'bg-amber-500', ring: 'ring-amber-400', pulse: 'bg-amber-400', badgeBg: 'bg-amber-950/90', text: 'text-amber-200', border: 'border-amber-400/60' },
  river: { bg: 'bg-blue-500', ring: 'ring-blue-400', pulse: 'bg-blue-400', badgeBg: 'bg-blue-950/90', text: 'text-blue-200', border: 'border-blue-400/60' },
  lake: { bg: 'bg-cyan-500', ring: 'ring-cyan-400', pulse: 'bg-cyan-400', badgeBg: 'bg-cyan-950/90', text: 'text-cyan-200', border: 'border-cyan-400/60' },
  border_gate: { bg: 'bg-emerald-500', ring: 'ring-emerald-400', pulse: 'bg-emerald-400', badgeBg: 'bg-emerald-950/90', text: 'text-emerald-200', border: 'border-emerald-400/60' },
  pass: { bg: 'bg-purple-500', ring: 'ring-purple-400', pulse: 'bg-purple-400', badgeBg: 'bg-purple-950/90', text: 'text-purple-200', border: 'border-purple-400/60' },
  plateau: { bg: 'bg-orange-500', ring: 'ring-orange-400', pulse: 'bg-orange-400', badgeBg: 'bg-orange-950/90', text: 'text-orange-200', border: 'border-orange-400/60' },
  plain: { bg: 'bg-green-500', ring: 'ring-green-400', pulse: 'bg-green-400', badgeBg: 'bg-green-950/90', text: 'text-green-200', border: 'border-green-400/60' },
  mine: { bg: 'bg-slate-600', ring: 'ring-slate-400', pulse: 'bg-slate-400', badgeBg: 'bg-slate-900/90', text: 'text-slate-200', border: 'border-slate-400/60' },
  province: { bg: 'bg-rose-500', ring: 'ring-rose-400', pulse: 'bg-rose-400', badgeBg: 'bg-rose-950/90', text: 'text-rose-200', border: 'border-rose-400/60' },
  karstic: { bg: 'bg-purple-600', ring: 'ring-purple-400', pulse: 'bg-purple-400', badgeBg: 'bg-purple-950/90', text: 'text-purple-200', border: 'border-purple-400/60' },
  coastal: { bg: 'bg-teal-500', ring: 'ring-teal-400', pulse: 'bg-teal-400', badgeBg: 'bg-teal-950/90', text: 'text-teal-200', border: 'border-teal-400/60' }
};

export default function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const guessMarkerRef = useRef<maplibregl.Marker | null>(null);
  const targetMarkerRef = useRef<maplibregl.Marker | null>(null);

  const {
    mapStyle,
    layers,
    selectedRegion,
    setSelectedFeature,
    cameraFlyTarget,
    clearFlyTarget,
    activeTab,
    pinGameIndex,
    isPinGuessed,
    pinGuessCoords,
    quizTestIndex,
    isQuizAnswered,
    searchQuery,
    isBlindMapMode,
    toggleBlindMapMode
  } = useAppStore();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentPitch, setCurrentPitch] = useState(50);
  const [currentZoom, setCurrentZoom] = useState(6.2);

  // Animated Tour Mode state
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourSpeedMs, setTourSpeedMs] = useState(5000);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 1. Initialize MapLibre GL bounded strictly to Turkey
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const currentStore = useAppStore.getState();
    const styleFn = MAP_STYLE_CONFIGS[currentStore.mapStyle] || MAP_STYLE_CONFIGS.topographic;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleFn(currentStore.isBlindMapMode),
      center: [35.243, 38.963], // Turkey Center
      zoom: 6.2,
      pitch: 0,
      bearing: 0,
      maxPitch: 0,
      dragRotate: false, // Always keep North top, South bottom, West left, East right
      touchPitch: false,
      pitchWithRotate: false,
      maxBounds: TURKEY_BOUNDS, // Strictly restrict map panning to Turkey only
      minZoom: 5.5,
      maxZoom: 9.5, // Prevent excessive zooming
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);

      // Add navigation and fullscreen controls
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      map.addControl(new maplibregl.FullscreenControl(), 'bottom-right');
    });

    map.on('pitch', () => setCurrentPitch(Math.round(map.getPitch())));
    map.on('zoom', () => setCurrentZoom(parseFloat(map.getZoom().toFixed(1))));

    // Click handler for Pin Guess Game
    map.on('click', (e) => {
      const storeState = useAppStore.getState();
      if (storeState.activeTab === 'pin_game' && !storeState.isPinGuessed) {
        storeState.submitPinGuess(e.lngLat.lng, e.lngLat.lat);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Handle Style & Blind Map Mode Changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const styleFn = MAP_STYLE_CONFIGS[mapStyle] || MAP_STYLE_CONFIGS.topographic;
    mapRef.current.setStyle(styleFn(isBlindMapMode));
  }, [mapStyle, isBlindMapMode, mapLoaded]);

  // 3. Handle Camera FlyTo Signal
  useEffect(() => {
    if (!mapRef.current || !cameraFlyTarget) return;

    mapRef.current.flyTo({
      center: cameraFlyTarget.coords,
      zoom: Math.min(cameraFlyTarget.zoom ?? 7.5, 8.2),
      pitch: 0,
      bearing: 0,
      duration: 2000,
      essential: true,
    });

    clearFlyTarget();
  }, [cameraFlyTarget, clearFlyTarget]);

  // 4. Handle Region Focal FlyTo
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const focal = REGION_CENTERS[selectedRegion];
    if (focal) {
      mapRef.current.flyTo({
        center: focal.coords,
        zoom: Math.min(focal.zoom, 7.5),
        pitch: 0,
        bearing: 0,
        duration: 1600,
        essential: true,
      });
    }
  }, [selectedRegion, mapLoaded]);

  // 5. Update Animated Interactive Feature Markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Hide all standard map markers during game modes (Pin Game or Quiz Test)
    // so that ONLY the target answer pin and user location stand out cleanly!
    if (activeTab === 'pin_game' || activeTab === 'quiz_test') {
      return;
    }

    const filteredFeatures = ALL_GEO_FEATURES.filter((feat) => {
      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          feat.name.toLowerCase().includes(q) ||
          feat.category?.toLowerCase().includes(q) ||
          feat.region.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Region Filter
      if (selectedRegion !== 'Tüm Bölgeler' && feat.region !== selectedRegion) {
        return false;
      }

      // Layer Toggles
      if (feat.type === 'mountain') {
        if (feat.subCategory === 'volcanic' && !layers.mountainsVolcanic) return false;
        if (feat.subCategory === 'fold' && !layers.mountainsFold) return false;
        if (feat.subCategory === 'fault' && !layers.mountainsFault) return false;
        if (feat.subCategory === 'glacial' && !layers.mountainsGlacial) return false;
        if (!feat.subCategory && !layers.mountainsFold) return false;
      }
      if (feat.type === 'river' && !layers.rivers) return false;
      if (feat.type === 'lake' && !layers.lakes) return false;
      if (feat.type === 'border_gate' && !layers.borderGates) return false;
      if (feat.type === 'pass' && !layers.passes) return false;
      if (feat.type === 'plain') {
        if (feat.subCategory === 'delta' && !layers.plainsDelta) return false;
        if (feat.subCategory === 'tectonic' && !layers.plainsTectonic) return false;
        if (feat.subCategory === 'karstic' && !layers.plainsKarstic) return false;
        if (!feat.subCategory && !layers.plainsTectonic) return false;
      }
      if (feat.type === 'plateau' && !layers.plateaus) return false;
      if (feat.type === 'karstic' && !layers.karstics) return false;
      if (feat.type === 'coastal' && !layers.coastal) return false;
      if (feat.type === 'mine' && !layers.mines) return false;
      if (feat.type === 'province' && !layers.provinces) return false;
      return true;
    });

    filteredFeatures.forEach((feature) => {
      const style = CATEGORY_STYLES[feature.type] || CATEGORY_STYLES.mountain;
      const el = document.createElement('div');

      // Category Icon Symbol
      let iconSymbol = '📍';
      if (feature.type === 'mountain') {
        if (feature.subCategory === 'volcanic') iconSymbol = '🌋';
        else if (feature.subCategory === 'fault') iconSymbol = '⚡';
        else if (feature.subCategory === 'glacial') iconSymbol = '❄️';
        else iconSymbol = '⛰️';
      }
      else if (feature.type === 'river') iconSymbol = '🌊';
      else if (feature.type === 'lake') iconSymbol = '💧';
      else if (feature.type === 'border_gate') iconSymbol = '🚪';
      else if (feature.type === 'pass') iconSymbol = '🛣️';
      else if (feature.type === 'plain') {
        if (feature.subCategory === 'delta') iconSymbol = '🌾';
        else if (feature.subCategory === 'karstic') iconSymbol = '🏛️';
        else iconSymbol = '🏚️';
      }
      else if (feature.type === 'plateau') iconSymbol = '🏜️';
      else if (feature.type === 'karstic') iconSymbol = '🕳️';
      else if (feature.type === 'coastal') iconSymbol = '🏖️';
      else if (feature.type === 'mine') iconSymbol = '⛏️';
      else if (feature.type === 'province') iconSymbol = '🏛️';

      // Create animated HTML structure with radar pulse rings & bounce effects
      el.className = 'relative group cursor-pointer pointer-events-auto';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <!-- Animated Pulse Ring -->
          <div class="absolute w-8 h-8 ${style.pulse} rounded-full opacity-40 animate-ping"></div>
          
          <!-- Marker Badge -->
          <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xl border ${style.badgeBg} ${style.border} ${style.text} backdrop-blur-md transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1">
            <span class="text-sm leading-none animate-bounce">${iconSymbol}</span>
            <span class="max-w-[120px] truncate text-white font-black tracking-wide">${feature.name}</span>
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedFeature(feature);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: feature.coordinates,
            zoom: 8.2,
            pitch: 0,
            bearing: 0,
            duration: 1600,
          });
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(feature.coordinates)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, layers, selectedRegion, activeTab, isPinGuessed, searchQuery, setSelectedFeature]);

  // 6. Handle Animated Auto-Tour Engine
  const advanceTourStep = useCallback((nextIdx: number) => {
    if (!ALL_GEO_FEATURES.length) return;
    const targetFeature = ALL_GEO_FEATURES[nextIdx % ALL_GEO_FEATURES.length];
    if (!targetFeature) return;

    const idx = nextIdx % ALL_GEO_FEATURES.length;
    setTourIndex(idx);

    setTimeout(() => {
      setSelectedFeature(targetFeature);
    }, 0);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: targetFeature.coordinates,
        zoom: 8.0,
        pitch: 0,
        bearing: 0,
        duration: 1800,
        essential: true,
      });
    }

    // Gentle audio cue if enabled
    if (soundEnabled && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // ignore audio block
      }
    }
  }, [setSelectedFeature, soundEnabled]);

  useEffect(() => {
    if (!isTourActive) return;

    const interval = setInterval(() => {
      setTourIndex((prev) => {
        const next = (prev + 1) % ALL_GEO_FEATURES.length;
        setTimeout(() => {
          advanceTourStep(next);
        }, 0);
        return next;
      });
    }, tourSpeedMs);

    return () => clearInterval(interval);
  }, [isTourActive, tourSpeedMs, advanceTourStep]);

  // 7. Handle Pin Guess Game Markers and GeoGuessr Line
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const lineSourceId = 'pin-guess-line-src';
    const lineLayerId = 'pin-guess-line-lyr';

    if (guessMarkerRef.current) {
      guessMarkerRef.current.remove();
      guessMarkerRef.current = null;
    }
    if (targetMarkerRef.current) {
      targetMarkerRef.current.remove();
      targetMarkerRef.current = null;
    }

    // Clean previous line layer if exists
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getSource(lineSourceId)) map.removeSource(lineSourceId);

    if (activeTab === 'pin_game' && isPinGuessed && pinGuessCoords) {
      const currentQ = PIN_GAME_QUESTIONS[pinGameIndex];

      // User Guess Marker (Red Pulse)
      const userEl = document.createElement('div');
      userEl.className = 'relative flex items-center justify-center';
      userEl.innerHTML = `
        <div class="absolute w-8 h-8 bg-red-500/40 rounded-full animate-ping"></div>
        <div class="w-6 h-6 bg-red-600 border-2 border-white text-white font-bold rounded-full flex items-center justify-center text-xs shadow-xl">🎯</div>
      `;
      guessMarkerRef.current = new maplibregl.Marker({ element: userEl })
        .setLngLat(pinGuessCoords)
        .addTo(map);

      // Target Location Marker (Gold Star)
      if (currentQ) {
        const targetEl = document.createElement('div');
        targetEl.className = 'relative flex items-center justify-center';
        targetEl.innerHTML = `
          <div class="absolute w-10 h-10 bg-amber-400/50 rounded-full animate-pulse"></div>
          <div class="px-3 py-1 bg-amber-500 border-2 border-white text-slate-900 font-extrabold rounded-full shadow-2xl text-xs flex items-center gap-1">
            ⭐ ${currentQ.title}
          </div>
        `;
        targetMarkerRef.current = new maplibregl.Marker({ element: targetEl })
          .setLngLat(currentQ.targetCoords)
          .addTo(map);

        // Draw GeoGuessr-style dashed line between click coords and target
        map.addSource(lineSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [pinGuessCoords, currentQ.targetCoords]
            }
          }
        });

        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: lineSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#f59e0b', // Amber
            'line-width': 3.5,
            'line-dasharray': [2, 2]
          }
        });
      }
    } else if (activeTab === 'quiz_test' && isQuizAnswered) {
      const currentQ = MULTIPLE_CHOICE_QUESTIONS[quizTestIndex];
      if (currentQ && currentQ.targetCoords) {
        const targetEl = document.createElement('div');
        targetEl.className = 'relative flex items-center justify-center';
        targetEl.innerHTML = `
          <div class="absolute w-10 h-10 bg-emerald-400/50 rounded-full animate-pulse"></div>
          <div class="px-3 py-1 bg-emerald-500 border-2 border-white text-slate-950 font-extrabold rounded-full shadow-2xl text-xs flex items-center gap-1">
            ⭐ DOĞRU CEVAP: ${currentQ.options[currentQ.correctIndex]}
          </div>
        `;
        targetMarkerRef.current = new maplibregl.Marker({ element: targetEl })
          .setLngLat(currentQ.targetCoords)
          .addTo(map);
      }
    }
  }, [activeTab, isPinGuessed, pinGuessCoords, pinGameIndex, isQuizAnswered, quizTestIndex, mapLoaded]);

  const resetCameraToTurkey = () => {
    if (mapRef.current) {
      mapRef.current.fitBounds(TURKEY_BOUNDS, {
        padding: 20,
        pitch: 0,
        bearing: 0,
        duration: 1600,
      });
    }
  };

  const currentTourFeature = ALL_GEO_FEATURES[tourIndex];

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* 3D Map Viewport */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#09090b]/90 backdrop-blur-md border border-white/10 rounded-xl text-slate-200 text-xs shadow-xl font-medium">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Yön: <strong className="text-emerald-400">Kuzey ↑</strong></span>
          <span className="text-slate-600">|</span>
          <span>Yakınlaşma: <strong className="text-indigo-400">{currentZoom}x</strong></span>
        </div>

        <button
          onClick={resetCameraToTurkey}
          title="Türkiye Genel Görünümüne Odaklan"
          className="px-3 py-1.5 bg-[#09090b]/90 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-slate-200 text-xs font-bold shadow-xl transition-all active:scale-95 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Türkiye&apos;ye Odaklan</span>
        </button>

        {/* Dilsiz Harita (Blind Map Mode) Toggle */}
        <button
          onClick={toggleBlindMapMode}
          title={isBlindMapMode ? "Dilsiz Harita Modunu Kapat" : "Dilsiz Harita Modunu Aç (Şehir İsimleri & Sınırlar Gizlenir)"}
          className={`px-3 py-1.5 backdrop-blur-md border rounded-xl text-xs font-bold shadow-xl transition-all active:scale-95 flex items-center gap-1.5 ${
            isBlindMapMode
              ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 font-extrabold animate-pulse'
              : 'bg-[#09090b]/90 hover:bg-white/10 border-white/10 text-slate-200'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          <span>{isBlindMapMode ? '🙈 Dilsiz Harita: AÇIK' : '🙈 Dilsiz Harita'}</span>
        </button>

        {/* Animated Tour Control Button */}
        <button
          onClick={() => {
            const newActive = !isTourActive;
            setIsTourActive(newActive);
            if (newActive) {
              advanceTourStep(tourIndex);
            }
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xl transition-all flex items-center gap-2 ${
            isTourActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 animate-pulse border border-amber-300'
              : 'bg-[#09090b]/90 hover:bg-white/10 border border-white/10 text-indigo-300'
          }`}
        >
          {isTourActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          <span>{isTourActive ? 'Animasyon Turunu Durdur' : 'KPSS Animasyon Turu'}</span>
        </button>
      </div>

      {/* Animated Tour Active Card Banner */}
      {isTourActive && currentTourFeature && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-lg bg-[#09090b]/95 backdrop-blur-2xl border border-indigo-500/40 rounded-2xl shadow-2xl p-4 text-slate-100 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-extrabold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                TUR {tourIndex + 1}/{ALL_GEO_FEATURES.length}
              </span>
              <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {currentTourFeature.region}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>

              <button
                onClick={() => setIsTourActive(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-black text-base text-amber-300 tracking-wide flex items-center justify-between">
              <span>{currentTourFeature.name}</span>
              <span className="text-xs font-medium text-slate-400">{currentTourFeature.category || currentTourFeature.type}</span>
            </h3>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {currentTourFeature.description}
            </p>

            {currentTourFeature.mnemonic && (
              <div className="mt-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 font-semibold flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
                <span><strong>ÖSYM Kodlama:</strong> {currentTourFeature.mnemonic}</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => advanceTourStep(tourIndex - 1 < 0 ? ALL_GEO_FEATURES.length - 1 : tourIndex - 1)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all"
                title="Önceki"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => advanceTourStep(tourIndex + 1)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all"
                title="Sonraki"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <span>Hız:</span>
              <button
                onClick={() => setTourSpeedMs(3000)}
                className={`px-2 py-0.5 rounded-md border ${tourSpeedMs === 3000 ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
              >
                3s
              </button>
              <button
                onClick={() => setTourSpeedMs(5000)}
                className={`px-2 py-0.5 rounded-md border ${tourSpeedMs === 5000 ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
              >
                5s
              </button>
              <button
                onClick={() => setTourSpeedMs(8000)}
                className={`px-2 py-0.5 rounded-md border ${tourSpeedMs === 8000 ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
              >
                8s
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pin Game Active Guidance Banner */}
      {activeTab === 'pin_game' && !isPinGuessed && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-600/90 backdrop-blur-lg border border-amber-400/50 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 animate-pulse">
          <MapPin className="w-5 h-5 text-amber-200" />
          <span>Sorulan yerin konumunu harita üzerinde **TIKLAYIN!**</span>
        </div>
      )}
    </div>
  );
}


