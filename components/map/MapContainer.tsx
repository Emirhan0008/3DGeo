'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useAppStore, MapStyleType } from '@/lib/store/useStore';
import { ALL_GEO_FEATURES, GeoFeature } from '@/lib/data/turkeyData';
import { 
  PIN_GAME_QUESTIONS, 
  MULTIPLE_CHOICE_QUESTIONS,
  getCurrentPinQuestion,
  getCurrentQuizQuestion
} from '@/lib/data/quizQuestions';
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
            ? 'https://a.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
            : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          isBlind
            ? 'https://b.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
            : 'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          isBlind
            ? 'https://c.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
            : 'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
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
            ? 'https://a.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
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
  dark: (isBlind) => ({
    version: 8,
    name: 'Carto Dark',
    sources: {
      'dark-source': {
        type: 'raster',
        tiles: [
          isBlind
            ? 'https://a.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png'
            : 'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: 'CARTO',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'dark-layer',
        type: 'raster',
        source: 'dark-source',
      },
    ],
  }),
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

// Detailed high-resolution Turkey national border ring coordinates (110+ precise waypoints)
const DETAILED_TURKEY_BORDER_RING: [number, number][] = [
  // --- Thrace / Bulgaria & Greece Borders ---
  [26.04, 41.72], [26.35, 41.71], [26.70, 41.85], [27.05, 41.98], [27.50, 42.01], [28.02, 41.87],
  [28.10, 41.50], [28.60, 41.35], [29.10, 41.25], [29.50, 41.18], [29.90, 41.15],
  
  // --- Black Sea Coastline (West to East) ---
  [30.30, 41.15], [30.70, 41.20], [31.20, 41.30], [31.80, 41.50], [32.10, 41.70], [32.50, 41.90],
  [33.10, 41.95], [34.00, 42.00], [34.50, 42.05], [35.00, 42.10], [35.50, 41.95], [36.00, 41.80],
  [36.50, 41.40], [37.00, 41.10], [37.70, 41.00], [38.30, 41.00], [39.00, 41.02], [39.70, 41.05],
  [40.20, 41.08], [40.50, 41.10], [40.80, 41.20], [41.20, 41.35], [41.55, 41.55],
  
  // --- Georgia / Armenia / Nakhchivan Land Borders ---
  [41.80, 41.50], [42.20, 41.50], [42.50, 41.35], [42.80, 41.20], [43.10, 41.15], [43.50, 41.10],
  [43.70, 40.80], [43.90, 40.65], [44.00, 40.50], [44.20, 40.25], [44.50, 40.00], [44.80, 39.70],
  [44.82, 39.60], [44.60, 39.45],
  
  // --- Iran Land Border ---
  [44.40, 39.30], [44.30, 39.00], [44.30, 38.80], [44.32, 38.50], [44.35, 38.20], [44.45, 37.90],
  [44.50, 37.60], [44.70, 37.40], [44.80, 37.20], [44.55, 37.15], [44.30, 37.10],
  
  // --- Iraq & Syria Land Borders ---
  [44.00, 37.12], [43.80, 37.15], [43.40, 37.18], [43.00, 37.20], [42.60, 37.15], [42.30, 37.10],
  [41.80, 37.12], [41.20, 37.30], [40.60, 37.10], [40.00, 37.00], [39.40, 36.85], [38.80, 36.70],
  [38.30, 36.70], [37.80, 36.70], [37.20, 36.68], [36.80, 36.70], [36.60, 36.60], [36.20, 36.30],
  [35.90, 35.85], [35.95, 36.30], [36.20, 36.80],
  
  // --- Mediterranean Coastline ---
  [35.80, 36.70], [35.50, 36.75], [35.20, 36.60], [34.70, 36.55], [34.30, 36.50], [33.90, 36.30],
  [33.50, 36.15], [33.10, 36.12], [32.80, 36.10], [32.30, 36.20], [32.00, 36.30], [31.50, 36.80],
  [31.00, 36.85], [30.60, 36.30], [30.10, 36.25], [29.80, 36.20], [29.40, 36.22], [29.10, 36.20],
  [28.70, 36.40], [28.30, 36.70], [27.80, 36.70], [27.30, 36.70],
  
  // --- Aegean Coastline ---
  [27.20, 37.00], [27.20, 37.30], [27.30, 37.60], [27.40, 37.80], [27.10, 37.95], [26.80, 38.00],
  [26.50, 38.15], [26.30, 38.30], [26.50, 38.55], [26.80, 38.80], [26.90, 39.10], [26.90, 39.30],
  [26.50, 39.40], [26.00, 39.50], [26.00, 39.80], [26.00, 40.00], [26.30, 40.20], [26.50, 40.40],
  [26.35, 40.60], [26.20, 40.80], [26.10, 41.20], [26.04, 41.72]
];

// Interior Regional Boundary Division Lines (7 Geographical Regions)
const TURKEY_REGION_DIVISIONS: [number, number][][] = [
  // Marmara - Ege / İç Anadolu Border
  [[26.00, 40.00], [27.00, 40.10], [28.20, 39.80], [29.50, 40.10], [30.20, 40.40], [31.20, 40.80], [31.80, 41.50]],
  // Ege - Akdeniz / İç Anadolu Border
  [[27.30, 36.70], [28.50, 37.20], [29.50, 37.50], [30.20, 38.00], [31.50, 38.20], [32.00, 38.50]],
  // Akdeniz - İç Anadolu / Güneydoğu Border
  [[31.50, 36.80], [32.50, 37.20], [33.50, 37.50], [34.50, 37.30], [35.80, 37.50], [36.80, 37.80], [37.80, 38.20]],
  // Karadeniz - İç Anadolu / Doğu Anadolu Border
  [[31.80, 41.50], [33.00, 41.00], [34.50, 41.00], [36.00, 40.80], [37.50, 40.50], [39.00, 40.50], [40.50, 40.80], [41.55, 41.55]],
  // İç Anadolu - Doğu Anadolu Border
  [[35.80, 38.50], [37.00, 39.20], [38.50, 39.50], [39.00, 40.50]],
  // Doğu Anadolu - Güneydoğu Anadolu Border
  [[37.80, 38.20], [39.00, 38.20], [40.50, 38.00], [42.00, 38.00], [43.00, 37.80], [44.30, 37.10]]
];

function setupTurkeyNationalBordersAndMask(map: maplibregl.Map, isBlind: boolean = false) {
  if (!map.isStyleLoaded()) return;

  // Clean existing sources/layers if present
  const layersToRemove = [
    'turkey-border-line-layer',
    'turkey-border-glow-layer',
    'turkey-border-shadow-layer',
    'turkey-regions-line-layer',
    'turkey-provinces-line-layer',
    'turkey-provinces-fill-layer',
    'turkey-mask-layer'
  ];
  layersToRemove.forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
  });

  const sourcesToRemove = ['turkey-border-src', 'turkey-mask-src', 'turkey-regions-src', 'turkey-provinces-src'];
  sourcesToRemove.forEach((id) => {
    if (map.getSource(id)) map.removeSource(id);
  });

  // 1. Vignette Outer Dark Mask
  map.addSource('turkey-mask-src', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
          DETAILED_TURKEY_BORDER_RING
        ]
      }
    }
  });

  map.addLayer({
    id: 'turkey-mask-layer',
    type: 'fill',
    source: 'turkey-mask-src',
    paint: {
      'fill-color': '#020617',
      'fill-opacity': isBlind ? 0.45 : 0.35
    }
  });

  // 2. Turkey 81 Provinces GeoJSON Layer (Only Province/City borders, no districts/villages!)
  map.addSource('turkey-provinces-src', {
    type: 'geojson',
    data: '/data/turkey-provinces.json'
  });

  map.addLayer({
    id: 'turkey-provinces-fill-layer',
    type: 'fill',
    source: 'turkey-provinces-src',
    paint: {
      'fill-color': '#f8fafc',
      'fill-opacity': isBlind ? 0.05 : 0.02
    }
  });

  map.addLayer({
    id: 'turkey-provinces-line-layer',
    type: 'line',
    source: 'turkey-provinces-src',
    paint: {
      'line-color': isBlind ? '#475569' : '#64748b',
      'line-width': isBlind ? 1.8 : 1.2,
      'line-opacity': isBlind ? 0.95 : 0.65
    }
  });

  // 3. Turkey National Border GeoJSON Source
  map.addSource('turkey-border-src', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: DETAILED_TURKEY_BORDER_RING
      }
    }
  });

  // Layer A: Dark Contrast Drop-Shadow Line (Underneath)
  map.addLayer({
    id: 'turkey-border-shadow-layer',
    type: 'line',
    source: 'turkey-border-src',
    paint: {
      'line-color': '#0f172a',
      'line-width': 8,
      'line-opacity': 0.95
    }
  });

  // Layer B: Vibrant Amber/Gold Outer Glow
  map.addLayer({
    id: 'turkey-border-glow-layer',
    type: 'line',
    source: 'turkey-border-src',
    paint: {
      'line-color': '#f59e0b',
      'line-width': 14,
      'line-opacity': 0.75,
      'line-blur': 5
    }
  });

  // Layer C: Core Bright Yellow Border Line
  map.addLayer({
    id: 'turkey-border-line-layer',
    type: 'line',
    source: 'turkey-border-src',
    paint: {
      'line-color': '#facc15',
      'line-width': 4,
      'line-opacity': 1.0
    }
  });

  // 4. Regional Interior Division Lines
  map.addSource('turkey-regions-src', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: TURKEY_REGION_DIVISIONS.map((lineCoords) => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: lineCoords
        }
      }))
    }
  });

  map.addLayer({
    id: 'turkey-regions-line-layer',
    type: 'line',
    source: 'turkey-regions-src',
    paint: {
      'line-color': '#38bdf8', // Sky Blue
      'line-width': 2.5,
      'line-dasharray': [3, 3],
      'line-opacity': 0.85
    }
  });
}

export default function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const guessMarkerRef = useRef<maplibregl.Marker | null>(null);
  const targetMarkerRef = useRef<maplibregl.Marker | null>(null);
  const distanceMarkerRef = useRef<maplibregl.Marker | null>(null);

  const {
    mapStyle,
    layers,
    selectedRegion,
    setSelectedFeature,
    cameraFlyTarget,
    clearFlyTarget,
    activeTab,
    pinGameIndex,
    shuffledPinQuestions,
    isPinGuessed,
    pinGuessCoords,
    lastGuessDistanceKm,
    quizTestIndex,
    shuffledQuizQuestions,
    isQuizAnswered,
    searchQuery,
    isBlindMapMode,
    hideLandformsInBlindMode,
    toggleBlindMapMode,
    toggleHideLandformsInBlindMode,
    gameCategoryFilter
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
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const currentStore = useAppStore.getState();
    const styleFn = MAP_STYLE_CONFIGS[currentStore.mapStyle] || MAP_STYLE_CONFIGS.topographic;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleFn(currentStore.isBlindMapMode),
      center: [35.243, 38.963], // Turkey Center
      zoom: 5.5, // Default locked zoom
      pitch: 0,
      bearing: 0,
      maxPitch: 0,
      dragRotate: false, // Always keep North top, South bottom, West left, East right
      touchPitch: false,
      pitchWithRotate: false,
      maxBounds: TURKEY_BOUNDS, // Strictly restrict map panning to Turkey only
      minZoom: 5.0,
      maxZoom: 9.5,
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);
      setupTurkeyNationalBordersAndMask(map, currentStore.isBlindMapMode);

      // Add navigation and fullscreen controls
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      map.addControl(new maplibregl.FullscreenControl(), 'bottom-right');
    });

    map.on('styledata', () => {
      if (map.isStyleLoaded()) {
        setupTurkeyNationalBordersAndMask(map, useAppStore.getState().isBlindMapMode);
      }
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
    const map = mapRef.current;
    const styleFn = MAP_STYLE_CONFIGS[mapStyle] || MAP_STYLE_CONFIGS.topographic;

    map.setStyle(styleFn(isBlindMapMode));

    const handleStyleLoad = () => {
      setupTurkeyNationalBordersAndMask(map, isBlindMapMode);
    };

    map.once('style.load', handleStyleLoad);

    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [mapStyle, isBlindMapMode, mapLoaded]);

  // 3. Handle Camera FlyTo Signal
  useEffect(() => {
    if (!mapRef.current || !cameraFlyTarget) return;

    mapRef.current.flyTo({
      center: cameraFlyTarget.coords,
      zoom: cameraFlyTarget.zoom ?? 5.5,
      pitch: 0,
      bearing: 0,
      duration: 2200,
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
      // Hide geographical landforms in blind map (Dilsiz) mode if configured
      const isLandform = ['mountain', 'river', 'lake', 'plateau', 'plain', 'pass', 'karstic', 'coastal'].includes(feat.type);
      if (isBlindMapMode && hideLandformsInBlindMode && isLandform) {
        return false;
      }

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
      if (isBlindMapMode) {
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <!-- Animated Pulse Ring -->
            <div class="absolute w-8 h-8 ${style.pulse} rounded-full opacity-30 animate-ping"></div>
            
            <!-- Blind Mode Badge (Name hidden until hover/click) -->
            <div class="relative flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xl border ${style.badgeBg} ${style.border} ${style.text} backdrop-blur-md transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1">
              <span class="text-sm leading-none animate-bounce">${iconSymbol}</span>
              <span class="hidden group-hover:inline-block max-w-[140px] truncate text-amber-300 font-black tracking-wide pl-1 border-l border-amber-400/40">
                ${feature.name}
              </span>
              <span class="inline-block group-hover:hidden text-[10px] text-amber-400 font-black opacity-80">
                🙈 ?
              </span>
            </div>
          </div>
        `;
      } else {
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
      }

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
  }, [mapLoaded, layers, selectedRegion, activeTab, isPinGuessed, searchQuery, setSelectedFeature, isBlindMapMode, hideLandformsInBlindMode]);

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
    if (distanceMarkerRef.current) {
      distanceMarkerRef.current.remove();
      distanceMarkerRef.current = null;
    }

    // Clean previous line layer if exists
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getSource(lineSourceId)) map.removeSource(lineSourceId);

    if (activeTab === 'pin_game' && isPinGuessed && pinGuessCoords) {
      const currentQ = getCurrentPinQuestion(pinGameIndex, gameCategoryFilter, shuffledPinQuestions);

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

        // Draw GeoGuessr-style line between clicked position and true position
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

        // Add floating distance badge at line midpoint
        if (lastGuessDistanceKm !== null) {
          const midLng = (pinGuessCoords[0] + currentQ.targetCoords[0]) / 2;
          const midLat = (pinGuessCoords[1] + currentQ.targetCoords[1]) / 2;
          const distEl = document.createElement('div');
          distEl.className = 'px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[11px] border border-amber-300 rounded-full shadow-2xl animate-bounce';
          distEl.innerHTML = `📏 ${lastGuessDistanceKm} km`;
          distanceMarkerRef.current = new maplibregl.Marker({ element: distEl })
            .setLngLat([midLng, midLat])
            .addTo(map);
        }
      }
    } else if (activeTab === 'quiz_test' && isQuizAnswered) {
      const currentQ = getCurrentQuizQuestion(quizTestIndex, gameCategoryFilter, shuffledQuizQuestions);
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
  }, [activeTab, isPinGuessed, pinGuessCoords, lastGuessDistanceKm, pinGameIndex, shuffledPinQuestions, isQuizAnswered, quizTestIndex, shuffledQuizQuestions, gameCategoryFilter, mapLoaded]);

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

  // Keyboard Shortcuts (T: Turkey, D: Dilsiz Mode, P: Tour)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable)) {
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        resetCameraToTurkey();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        toggleBlindMapMode();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsTourActive(prev => {
          const next = !prev;
          if (next) advanceTourStep(tourIndex);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tourIndex, toggleBlindMapMode, advanceTourStep]);

  const currentTourFeature = ALL_GEO_FEATURES[tourIndex];

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* 3D Map Viewport */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating HUD Controls - Compact Hover-Expandable Pill Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto select-none">
        <div className="flex items-center gap-1 p-1 bg-[#09090b]/85 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl">
          
          {/* Compass & Zoom Pill */}
          <div 
            onClick={resetCameraToTurkey}
            title="Kuzey yönüne dön ve yakınlaşmayı gör (Tıkla: Odaklan)"
            className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/40 text-slate-200 text-xs font-semibold cursor-pointer transition-all duration-300 active:scale-95"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            
            {/* Always visible compact badge */}
            <span className="text-[11px] font-extrabold text-slate-300 group-hover:text-emerald-300">
              {currentZoom}x
            </span>

            {/* Expandable Label on Hover */}
            <div className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
              <span className="text-[11px] text-slate-300 pl-1 border-l border-white/10">
                Kuzey Yönü • <strong className="text-emerald-400">Pusula</strong>
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Türkiye'ye Odaklan Button */}
          <button
            onClick={resetCameraToTurkey}
            title="Türkiye Genel Görünümüne Odaklan (Kısayol: T)"
            className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/5 hover:border-sky-500/40 text-slate-200 text-xs font-bold transition-all duration-300 active:scale-95 shadow-sm"
          >
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>

            {/* Expandable Label on Hover */}
            <div className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
              <div className="flex items-center gap-1.5 pl-0.5">
                <span className="text-[11px] text-white font-bold">Türkiye&apos;ye Odaklan</span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-500/30 text-sky-200 border border-sky-400/30">T</span>
              </div>
            </div>
          </button>

          {/* Dilsiz Harita Toggle Button */}
          <div className="relative group">
            <button
              onClick={toggleBlindMapMode}
              title={isBlindMapMode ? "Dilsiz Harita Modunu Kapat (Kısayol: D)" : "Dilsiz Harita Modunu Aç - Şehir İsimleri & Sınırlar Gizlenir (Kısayol: D)"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300 active:scale-95 shadow-sm ${
                isBlindMapMode
                  ? 'bg-amber-500/25 border-amber-400/80 text-amber-200 ring-1 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                  : 'bg-white/5 hover:bg-amber-500/15 border-white/5 hover:border-amber-500/30 text-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                isBlindMapMode 
                  ? 'bg-amber-400 text-slate-950 font-black scale-105' 
                  : 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950'
              }`}>
                <EyeOff className="w-3.5 h-3.5" />
              </div>

              {/* Status indicator dot when active */}
              {isBlindMapMode && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              )}

              {/* Expandable Label on Hover */}
              <div className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
                <div className="flex items-center gap-1.5 pl-0.5">
                  <span className="text-[11px] font-bold">
                    {isBlindMapMode ? 'Dilsiz Harita: AÇIK 🔥' : 'Dilsiz Harita'}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    isBlindMapMode ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                  }`}>
                    D
                  </span>
                </div>
              </div>
            </button>

            {/* Quick Popover Menu for Blind Mode on Hover when active */}
            {isBlindMapMode && (
              <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-30 min-w-[220px] p-2.5 bg-[#09090b]/95 backdrop-blur-2xl border border-amber-500/40 rounded-xl shadow-2xl text-white animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Dilsiz Harita Ayarı
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHideLandformsInBlindMode();
                  }}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between text-[10px] transition-all ${
                    hideLandformsInBlindMode 
                      ? 'bg-rose-500/25 border-rose-500/50 text-rose-200 font-bold' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>Yer Şekillerini de Kapat:</span>
                  <span className="font-extrabold px-1.5 py-0.5 rounded bg-black/50 text-[9px]">
                    {hideLandformsInBlindMode ? 'GİZLİ' : 'GÖRÜNÜR'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* KPSS 3D Animasyon Turu Button */}
          <button
            onClick={() => {
              const newActive = !isTourActive;
              setIsTourActive(newActive);
              if (newActive) {
                advanceTourStep(tourIndex);
              }
            }}
            title={isTourActive ? "Animasyon Turunu Durdur (Kısayol: P)" : "3D KPSS Animasyonlu Rehber Turunu Başlat (Kısayol: P)"}
            className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300 active:scale-95 shadow-sm ${
              isTourActive
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400/80 text-emerald-200 ring-1 ring-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 hover:bg-indigo-500/20 border-white/5 hover:border-indigo-500/40 text-indigo-300'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
              isTourActive 
                ? 'bg-emerald-400 text-slate-950 font-black animate-pulse' 
                : 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'
            }`}>
              {isTourActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </div>

            {/* Expandable Label on Hover */}
            <div className="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
              <div className="flex items-center gap-1.5 pl-0.5">
                <span className="text-[11px] font-bold text-white">
                  {isTourActive ? 'Turu Durdur' : 'KPSS Animasyon Turu'}
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">P</span>
              </div>
            </div>
          </button>
        </div>
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


