'use client';

import React, { useState, useRef } from 'react';
import { useAppStore, MapStyleType } from '@/lib/store/useStore';
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
  const {
    isSidebarOpen,
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
    toggleBlindMapMode
  } = useAppStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute left-2 top-16 bottom-6 z-20 bg-[#09090b]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-80' : 'w-12'
      }`}
    >
      {/* Collapsed Bar State */}
      {!isExpanded ? (
        <div className="w-full h-full flex flex-col items-center justify-between py-4 cursor-pointer hover:bg-white/5 transition-all overflow-hidden select-none">
          <div className="flex flex-col items-center gap-3">
            <div className="relative p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400 animate-pulse">
              <Layers className="w-5 h-5" />
              {activeLayersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center border border-[#09090b]">
                  {activeLayersCount}
                </span>
              )}
            </div>
            <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
              <Compass className="w-4 h-4" />
            </div>
            <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
              <Globe className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center my-2 overflow-hidden">
            <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-extrabold tracking-widest uppercase text-slate-400 hover:text-indigo-300 transition-colors whitespace-nowrap max-h-36 overflow-hidden">
              KATMANLAR
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ChevronRight className="w-4 h-4 text-indigo-400 animate-bounce" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPinned(true);
              }}
              title="Menüyü Ekrana Sabitle"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-all"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Full Content State */
        <div className="w-80 h-full flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300">
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
                className={`p-1.5 rounded-lg transition-all ${
                  isPinned
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsPinned(false);
                  setIsHovered(false);
                  if (isSidebarOpen) toggleSidebar();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-5 text-xs">
            {/* Map Styles Selector */}
            <div>
              <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1">
                <span>Harita Stili (3D Base Layer)</span>
              </h3>
              <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setMapStyle(style.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      mapStyle === style.id
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200 font-bold shadow-lg shadow-indigo-500/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
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
              <button
                onClick={toggleBlindMapMode}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  isBlindMapMode
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-extrabold shadow-md ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isBlindMapMode ? 'bg-amber-500 text-slate-950 font-black' : 'bg-white/10 text-slate-400'}`}>
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Dilsiz Harita Modu</div>
                    <div className="text-[9px] text-slate-400 font-normal">Şehir İsimleri &amp; Sınırlar Gizli</div>
                  </div>
                </div>

                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${isBlindMapMode ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                  {isBlindMapMode ? 'AÇIK 🔥' : 'KAPALI'}
                </div>
              </button>
            </div>

            {/* Category Layer Toggles Header with Select All / Clear All */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">
                  Fiziki &amp; Siyasi Katmanlar
                </h3>
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    onClick={selectAllLayers}
                    className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 font-semibold transition-all whitespace-nowrap"
                  >
                    Tümünü Seç
                  </button>
                  <button
                    onClick={clearAllLayers}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 font-medium transition-all whitespace-nowrap"
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
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 hover:bg-white/10 text-left transition-colors select-none"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="font-extrabold text-[11px] text-slate-200 truncate whitespace-nowrap">
            {title}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
            {activeCount}/{totalCount}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-2 space-y-1 border-t border-white/5 bg-black/30 animate-in fade-in slide-in-from-top-1 duration-150">
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
      className={`w-full flex items-center justify-between p-1.5 px-2 rounded-lg border text-xs transition-all ${
        active
          ? 'bg-slate-800/90 border-slate-700 text-slate-100 font-semibold'
          : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200'
      }`}
    >
      <span className="truncate whitespace-nowrap pr-2 font-medium">{label}</span>
      <div className={`p-1 rounded-md shrink-0 ${active ? 'bg-slate-700' : 'bg-slate-900'}`}>
        {active ? <Eye className={`w-3.5 h-3.5 ${color}`} /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
      </div>
    </button>
  );
}
