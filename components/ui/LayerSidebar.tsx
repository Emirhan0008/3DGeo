'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, MapStyleType } from '@/lib/store/useStore';
import { useAppFullscreen } from '@/lib/utils';
import { 
  Mountain, 
  Waves, 
  Droplet, 
  DoorOpen, 
  Milestone, 
  Trees, 
  Pickaxe, 
  Layers, 
  Eye, 
  EyeOff, 
  Compass, 
  SlidersHorizontal,
  X,
  Globe,
  Check,
  Pin,
  PinOff,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const MAP_STYLES: { id: MapStyleType; label: string; desc: string; icon: string }[] = [
  { id: 'topographic', label: '3D Topografik', desc: 'Renkli Yükselti haritası', icon: '🏔️' },
  { id: 'hybrid', label: 'Hibrit Siyasi', desc: 'Net İl/İlçe Sınırları ve Yollar', icon: '🗺️' },
  { id: 'satellite', label: 'Aydınlık Uydu', desc: 'Açık renk uydu görünümü', icon: '☀️' },
];

export default function LayerSidebar() {
  const { isFullscreen } = useAppFullscreen();
  const {
    isSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    layers,
    toggleLayer,
    selectAllLayers,
    clearAllLayers,
    mapStyle,
    setMapStyle,
    terrainExaggeration,
    setTerrainExaggeration,
    selectedRegion,
    setSelectedRegion,
    isBlindMapMode,
    hideLandformsInBlindMode,
    toggleBlindMapMode,
    toggleHideLandformsInBlindMode
  } = useAppStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when store closes sidebar
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsHovered(false);
      setIsPinned(false);
    }
  }, [isSidebarOpen]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isExpanded = isHovered || isPinned || isSidebarOpen;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  // Count active layers
  const activeLayersCount = Object.values(layers).filter(Boolean).length;

  // In fullscreen mode, if not expanded, do not render a translucent column
  if (isFullscreen && !isExpanded) {
    return null;
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute left-1.5 sm:left-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 z-40 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-300 ease-in-out h-[calc(100%-0.75rem)] sm:h-[calc(100%-1rem)] max-h-full ${
        isExpanded
          ? isHovered || isPinned
            ? 'w-72 sm:w-80 bg-[#09090b]/95 opacity-100'
            : 'w-72 sm:w-80 bg-[#09090b]/75 opacity-75 hover:opacity-100'
          : isHovered
          ? 'w-10 sm:w-12 bg-[#09090b]/95 opacity-100'
          : 'w-10 sm:w-12 bg-[#09090b]/60 opacity-60 hover:opacity-100'
      }`}
    >
      {/* Collapsed Bar State */}
      {!isExpanded ? (
        <div 
          onClick={() => {
            setSidebarOpen(true);
            setIsPinned(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setSidebarOpen(true);
            setIsPinned(true);
          }}
          className="w-full h-full flex flex-col items-center justify-between py-2 sm:py-4 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-all overflow-hidden select-none touch-manipulation"
        >
          <div className="flex flex-col items-center gap-1.5 sm:gap-3 pointer-events-none">
            <div className="relative p-1.5 sm:p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400 animate-pulse">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              {activeLayersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-indigo-500 text-white font-extrabold text-[8px] sm:text-[9px] rounded-full flex items-center justify-center border border-[#09090b]">
                  {activeLayersCount}
                </span>
              )}
            </div>
            <div className="p-1 sm:p-1.5 rounded-lg text-slate-400">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="p-1 sm:p-1.5 rounded-lg text-slate-400">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center my-1 sm:my-2 overflow-hidden pointer-events-none">
            <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase text-slate-400 hover:text-indigo-300 transition-colors whitespace-nowrap max-h-20 sm:max-h-36 overflow-hidden">
              KATMANLAR
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 sm:gap-2 pointer-events-none">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 animate-bounce" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(true);
                setIsPinned(true);
              }}
              title="Menüyü Ekrana Sabitle"
              className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-all border border-transparent hover:border-white/20 pointer-events-auto"
            >
              <Pin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Full Content State */
        <div className="w-72 sm:w-80 h-full flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-white/15 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-300">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                3D Harita &amp; Katmanlar
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Sabitlemeyi Kaldır (Hover Modu)' : 'Ekrana Sabitle'}
                className={`p-1.5 rounded-lg transition-all border ${
                  isPinned
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'hover:bg-white/10 text-slate-400 hover:text-white border-transparent hover:border-white/20'
                }`}
              >
                {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsPinned(false);
                  setIsHovered(false);
                  setSidebarOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-5 text-xs">
            {/* Map Styles Selector */}
            <div>
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1">
                <span>Harita Stili (3D Base Layer)</span>
              </h3>
              <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setMapStyle(style.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      mapStyle === style.id
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 font-bold shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50'
                        : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{style.icon}</span>
                      {mapStyle === style.id && <Check className="w-3 h-3 text-indigo-400" />}
                    </div>
                    <div className="mt-1 font-semibold text-[11px] truncate">{style.label}</div>
                  </button>
                ))}
              </div>

              {/* Dilsiz Harita (Hardcore Mode) Toggle */}
              <div className="space-y-1.5">
                <button
                  onClick={toggleBlindMapMode}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isBlindMapMode
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-extrabold shadow-md ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${isBlindMapMode ? 'bg-amber-500 text-slate-950 font-black border-amber-300' : 'bg-white/10 text-slate-400 border-white/10'}`}>
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Dilsiz Harita Modu</div>
                      <div className="text-[9px] text-slate-400 font-normal">Şehir İsimleri &amp; Sınırlar Gizli</div>
                    </div>
                  </div>

                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${isBlindMapMode ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-white/10 text-slate-400 border-white/10'}`}>
                    {isBlindMapMode ? 'AÇIK 🔥' : 'KAPALI'}
                  </div>
                </button>

                {isBlindMapMode && (
                  <button
                    onClick={toggleHideLandformsInBlindMode}
                    className={`w-full p-2 ml-2 w-[calc(100%-0.5rem)] rounded-lg border text-left flex items-center justify-between transition-all text-[11px] ${
                      hideLandformsInBlindMode
                        ? 'bg-rose-500/25 border-rose-500/60 text-rose-200 font-bold'
                        : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      Yer Şekillerini de Kapat (Boş Harita)
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                      {hideLandformsInBlindMode ? 'KAPALI' : 'AÇIK'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Layer Toggles Header with Select All / Clear All */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                  Fiziki &amp; Siyasi Katmanlar
                </h3>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <button
                    onClick={selectAllLayers}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-400/50 font-bold transition-all whitespace-nowrap"
                  >
                    Tümünü Seç
                  </button>
                  <button
                    onClick={clearAllLayers}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/20 font-semibold transition-all whitespace-nowrap hover:border-white/30"
                  >
                    Tümünü Temizle
                  </button>
                </div>
              </div>

              {/* Collapsible Accordion Layer Groups */}
              <div className="space-y-2">
                {/* Group 1: Dağlar */}
                <AccordionGroup
                  title="🏔️ Dağ Sistemleri &amp; Çeşitleri"
                  groupId="mountains"
                  isOpen={!!openGroups['mountains']}
                  onToggle={() => toggleGroup('mountains')}
                  activeCount={
                    [
                      layers.mountainsVolcanic,
                      layers.mountainsFold,
                      layers.mountainsFault,
                      layers.mountainsGlacial
                    ].filter(Boolean).length
                  }
                  totalCount={4}
                >
                  <LayerToggleRow
                    label="🌋 Volkanik Dağlar"
                    active={layers.mountainsVolcanic}
                    onToggle={() => toggleLayer('mountainsVolcanic')}
                    color="text-red-400"
                  />
                  <LayerToggleRow
                    label="⛰️ Kıvrım Dağları"
                    active={layers.mountainsFold}
                    onToggle={() => toggleLayer('mountainsFold')}
                    color="text-amber-400"
                  />
                  <LayerToggleRow
                    label="⚡ Kırık Dağlar (Horst)"
                    active={layers.mountainsFault}
                    onToggle={() => toggleLayer('mountainsFault')}
                    color="text-yellow-400"
                  />
                  <LayerToggleRow
                    label="❄️ Buzul Şekilli Dağlar"
                    active={layers.mountainsGlacial}
                    onToggle={() => toggleLayer('mountainsGlacial')}
                    color="text-cyan-300"
                  />
                </AccordionGroup>

                {/* Group 2: Su Kaynakları */}
                <AccordionGroup
                  title="🌊 Akarsular &amp; Göller"
                  groupId="water"
                  isOpen={!!openGroups['water']}
                  onToggle={() => toggleGroup('water')}
                  activeCount={[layers.rivers, layers.lakes].filter(Boolean).length}
                  totalCount={2}
                >
                  <LayerToggleRow
                    label="🌊 Akarsular ve Havzalar"
                    active={layers.rivers}
                    onToggle={() => toggleLayer('rivers')}
                    color="text-blue-400"
                  />
                  <LayerToggleRow
                    label="💧 Göller ve Barajlar"
                    active={layers.lakes}
                    onToggle={() => toggleLayer('lakes')}
                    color="text-cyan-400"
                  />
                </AccordionGroup>

                {/* Group 3: Ovalar & Platolar */}
                <AccordionGroup
                  title="🌾 Ovalar &amp; Platolar"
                  groupId="plains_plateaus"
                  isOpen={!!openGroups['plains_plateaus']}
                  onToggle={() => toggleGroup('plains_plateaus')}
                  activeCount={
                    [
                      layers.plainsDelta,
                      layers.plainsTectonic,
                      layers.plainsKarstic,
                      layers.plateaus
                    ].filter(Boolean).length
                  }
                  totalCount={4}
                >
                  <LayerToggleRow
                    label="🌾 Delta Ovaları"
                    active={layers.plainsDelta}
                    onToggle={() => toggleLayer('plainsDelta')}
                    color="text-emerald-400"
                  />
                  <LayerToggleRow
                    label="🏚️ Tektonik Ovalar"
                    active={layers.plainsTectonic}
                    onToggle={() => toggleLayer('plainsTectonic')}
                    color="text-orange-400"
                  />
                  <LayerToggleRow
                    label="🏛️ Karstik Ovalar &amp; Polyeler"
                    active={layers.plainsKarstic}
                    onToggle={() => toggleLayer('plainsKarstic')}
                    color="text-lime-400"
                  />
                  <LayerToggleRow
                    label="🏜️ Platolar (Tabaka/Lav/Aşınım)"
                    active={layers.plateaus}
                    onToggle={() => toggleLayer('plateaus')}
                    color="text-amber-300"
                  />
                </AccordionGroup>

                {/* Group 4: Karstik & Kıyı Şekilleri */}
                <AccordionGroup
                  title="🕳️ Karstik &amp; Kıyı Şekilleri"
                  groupId="karstic_coastal"
                  isOpen={!!openGroups['karstic_coastal']}
                  onToggle={() => toggleGroup('karstic_coastal')}
                  activeCount={[layers.karstics, layers.coastal].filter(Boolean).length}
                  totalCount={2}
                >
                  <LayerToggleRow
                    label="🕳️ Karstik Şekiller &amp; Mağaralar"
                    active={layers.karstics}
                    onToggle={() => toggleLayer('karstics')}
                    color="text-purple-300"
                  />
                  <LayerToggleRow
                    label="🏖️ Kıyı Şekilleri &amp; Kıyı Tipleri"
                    active={layers.coastal}
                    onToggle={() => toggleLayer('coastal')}
                    color="text-teal-300"
                  />
                </AccordionGroup>

                {/* Group 5: Ulaşım, Sınır & Yeraltı */}
                <AccordionGroup
                  title="🚪 Sınır, Ulaşım &amp; Madenler"
                  groupId="transport_mines"
                  isOpen={!!openGroups['transport_mines']}
                  onToggle={() => toggleGroup('transport_mines')}
                  activeCount={
                    [
                      layers.borderGates,
                      layers.passes,
                      layers.mines,
                      layers.provinces
                    ].filter(Boolean).length
                  }
                  totalCount={4}
                >
                  <LayerToggleRow
                    label="🚪 Sınır Kapıları"
                    active={layers.borderGates}
                    onToggle={() => toggleLayer('borderGates')}
                    color="text-emerald-400"
                  />
                  <LayerToggleRow
                    label="🛣️ Geçitler ve Tüneller"
                    active={layers.passes}
                    onToggle={() => toggleLayer('passes')}
                    color="text-purple-400"
                  />
                  <LayerToggleRow
                    label="⛏️ Madenler &amp; Enerji"
                    active={layers.mines}
                    onToggle={() => toggleLayer('mines')}
                    color="text-slate-300"
                  />
                  <LayerToggleRow
                    label="🏛️ İl Merkezleri"
                    active={layers.provinces}
                    onToggle={() => toggleLayer('provinces')}
                    color="text-rose-400"
                  />
                </AccordionGroup>
              </div>
            </div>

            {/* Region Quick Filters */}
            <div>
              <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2">
                Coğrafi Bölge Odaklanma
              </h3>
              <div className="flex flex-wrap gap-1">
                {[
                  'Tüm Bölgeler',
                  'Marmara',
                  'Ege',
                  'Akdeniz',
                  'İç Anadolu',
                  'Karadeniz',
                  'Doğu Anadolu',
                  'Güneydoğu Anadolu'
                ].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      selectedRegion === reg
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function AccordionGroup({
  title,
  isOpen,
  onToggle,
  activeCount,
  totalCount,
  children
}: {
  title: string;
  groupId: string;
  isOpen: boolean;
  onToggle: () => void;
  activeCount: number;
  totalCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${
      isOpen 
        ? 'border-indigo-400/80 bg-indigo-950/30 shadow-lg shadow-indigo-500/10' 
        : 'border-white/20 bg-white/5 hover:border-indigo-400/60 hover:bg-white/10'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 text-left transition-colors select-none cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="font-extrabold text-xs text-slate-100 truncate whitespace-nowrap tracking-wide">
            {title}
          </span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border whitespace-nowrap shadow-sm ${
            activeCount > 0 
              ? 'bg-amber-400 text-slate-950 border-amber-300' 
              : 'bg-white/10 text-slate-400 border-white/20'
          }`}>
            {activeCount}/{totalCount}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-400' : 'text-slate-300'
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-2 space-y-1.5 border-t border-white/15 bg-black/60 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

function LayerToggleRow({
  label,
  active,
  onToggle,
  color
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-1.5 px-2.5 rounded-lg border text-xs transition-all ${
        active
          ? 'bg-slate-800/95 border-indigo-500/60 text-slate-100 font-semibold shadow-sm ring-1 ring-indigo-500/30'
          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25 hover:bg-white/5'
      }`}
    >
      <span className="truncate whitespace-nowrap pr-2 font-medium">{label}</span>
      <div className={`p-1 rounded-md shrink-0 border ${active ? 'bg-slate-700 border-indigo-400/40' : 'bg-slate-900 border-white/10'}`}>
        {active ? <Eye className={`w-3.5 h-3.5 ${color}`} /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
      </div>
    </button>
  );
}
