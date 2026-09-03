'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, MapStyleType } from '@/lib/store/useStore';
import { useAppFullscreen } from '@/lib/utils';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  X,
  Pin,
  PinOff,
  ChevronRight
} from 'lucide-react';

const MAP_STYLES: { id: MapStyleType; label: string; icon: string }[] = [
  { id: 'topographic', label: 'Topografik 3D', icon: '🏔️' },
  { id: 'hybrid', label: 'Hibrit Siyasi', icon: '🗺️' },
  { id: 'satellite', label: 'Uydu', icon: '🛰️' },
];

export default function LayerSidebar() {
  const { isFullscreen } = useAppFullscreen();
  const {
    activeTab,
    isSidebarOpen,
    setSidebarOpen,
    layers,
    toggleLayer,
    selectAllLayers,
    clearAllLayers,
    mapStyle,
    setMapStyle,
    selectedRegion,
    setSelectedRegion,
    isBlindMapMode,
    toggleBlindMapMode
  } = useAppStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when store closes sidebar
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsHovered(false);
      setIsPinned(false);
    }
  }, [isSidebarOpen]);

  const isExpanded = isHovered || isPinned || isSidebarOpen;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250);
  };

  const activeLayersCount = Object.values(layers).filter(Boolean).length;
  const totalLayersCount = Object.keys(layers).length;

  // In fullscreen mode, or when active tab is not exploration map, hide the collapsed edge strip so it NEVER overlaps games or modals
  if ((isFullscreen || activeTab !== 'map') && !isExpanded) {
    return null;
  }

  return (
    <aside
      id="kpss-layer-sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute left-1 sm:left-2 top-1 sm:top-2 bottom-1 sm:bottom-2 backdrop-blur-2xl border border-white/15 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-300 ease-in-out h-[calc(100%-0.5rem)] sm:h-[calc(100%-1rem)] max-h-full ${
        isExpanded ? 'z-45' : 'z-20'
      } ${
        isExpanded
          ? isHovered || isPinned
            ? 'w-[85vw] max-w-xs sm:w-80 bg-slate-950/95 opacity-100'
            : 'w-[85vw] max-w-xs sm:w-80 bg-slate-950/85 opacity-90 hover:opacity-100'
          : isHovered
          ? 'w-7 sm:w-9 bg-slate-950/95 opacity-100'
          : 'w-7 sm:w-9 bg-slate-950/65 opacity-70 hover:opacity-100'
      }`}
    >
      {/* Collapsed Ultra-Slim State */}
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
          className="w-full h-full flex flex-col items-center justify-between py-2 sm:py-3 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-all select-none touch-manipulation"
        >
          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <div className="relative p-1 sm:p-1.5 bg-indigo-600/25 border border-indigo-500/40 rounded-lg text-indigo-400">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {activeLayersCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-3.5 bg-indigo-500 text-white font-black text-[8px] rounded-full flex items-center justify-center border border-slate-950">
                  {activeLayersCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center my-1 pointer-events-none overflow-hidden">
            <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] sm:text-[9px] font-black tracking-wider uppercase text-slate-400 hover:text-indigo-300 transition-colors whitespace-nowrap">
              KATMANLAR {activeLayersCount > 0 ? `(${activeLayersCount})` : ''}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 pointer-events-none">
            <ChevronRight className="w-3 h-3 text-indigo-400" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(true);
                setIsPinned(true);
              }}
              title="Sabitle"
              className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-all pointer-events-auto"
            >
              <Pin className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Full Smooth Scrolling State */
        <div className="w-full h-full flex flex-col">
          {/* Header Bar */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/[0.03] shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-300">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                  Harita Katmanları
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">
                  {activeLayersCount} / {totalLayersCount} Aktif
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                className={`p-1.5 rounded-lg transition-all border ${
                  isPinned
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'hover:bg-white/10 text-slate-400 hover:text-white border-transparent hover:border-white/20'
                }`}
              >
                {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setIsPinned(false);
                  setIsHovered(false);
                  setSidebarOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/20"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions (All On / All Off & Base Map Style) */}
          <div className="p-3 border-b border-white/10 bg-slate-900/50 space-y-2 shrink-0">
            {/* Base Style Tabs */}
            <div className="grid grid-cols-3 gap-1">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setMapStyle(style.id)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all text-[11px] font-semibold flex items-center justify-center gap-1 ${
                    mapStyle === style.id
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span className="truncate">{style.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Bulk Toggle & Dilsiz Harita */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={selectAllLayers}
                  className="px-2 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold text-[10px] transition-all"
                >
                  Tümünü Aç
                </button>
                <button
                  onClick={clearAllLayers}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 font-medium text-[10px] transition-all"
                >
                  Kapat
                </button>
              </div>

              <button
                onClick={toggleBlindMapMode}
                className={`px-2.5 py-1 rounded-md border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                  isBlindMapMode
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBlindMapMode ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3" />}
                <span>Dilsiz Harita</span>
              </button>
            </div>
          </div>

          {/* Smooth Scrollable Layers Container */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-4 text-xs scroll-smooth">
            {/* 1. DAĞ SİSTEMLERİ */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>🏔️</span> Dağ Sistemleri
                </h3>
              </div>
              <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
                <LayerItem
                  label="Volkanik Dağlar"
                  icon="🌋"
                  active={layers.mountainsVolcanic}
                  onToggle={() => toggleLayer('mountainsVolcanic')}
                  activeColor="text-red-400"
                />
                <LayerItem
                  label="Kıvrım Dağları"
                  icon="⛰️"
                  active={layers.mountainsFold}
                  onToggle={() => toggleLayer('mountainsFold')}
                  activeColor="text-amber-400"
                />
                <LayerItem
                  label="Kırık Dağlar (Horst)"
                  icon="⚡"
                  active={layers.mountainsFault}
                  onToggle={() => toggleLayer('mountainsFault')}
                  activeColor="text-yellow-400"
                />
                <LayerItem
                  label="Buzul Dağları"
                  icon="❄️"
                  active={layers.mountainsGlacial}
                  onToggle={() => toggleLayer('mountainsGlacial')}
                  activeColor="text-cyan-300"
                />
              </div>
            </section>

            {/* 2. SU KAYNAKLARI */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <span>🌊</span> Su Kaynakları
                </h3>
              </div>
              <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
                <LayerItem
                  label="Akarsular &amp; Havzalar"
                  icon="🌊"
                  active={layers.rivers}
                  onToggle={() => toggleLayer('rivers')}
                  activeColor="text-blue-400"
                />
                <LayerItem
                  label="Göller &amp; Barajlar"
                  icon="💧"
                  active={layers.lakes}
                  onToggle={() => toggleLayer('lakes')}
                  activeColor="text-cyan-400"
                />
              </div>
            </section>

            {/* 3. OVALAR & PLATOLAR */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span>🌾</span> Ovalar &amp; Platolar
                </h3>
              </div>
              <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
                <LayerItem
                  label="Delta Ovaları"
                  icon="🌾"
                  active={layers.plainsDelta}
                  onToggle={() => toggleLayer('plainsDelta')}
                  activeColor="text-emerald-400"
                />
                <LayerItem
                  label="Tektonik Ovalar"
                  icon="🏚️"
                  active={layers.plainsTectonic}
                  onToggle={() => toggleLayer('plainsTectonic')}
                  activeColor="text-orange-400"
                />
                <LayerItem
                  label="Karstik Ovalar (Polyeler)"
                  icon="🏛️"
                  active={layers.plainsKarstic}
                  onToggle={() => toggleLayer('plainsKarstic')}
                  activeColor="text-lime-400"
                />
                <LayerItem
                  label="Platolar (Lav/Tabaka/Aşınım)"
                  icon="🏜️"
                  active={layers.plateaus}
                  onToggle={() => toggleLayer('plateaus')}
                  activeColor="text-amber-300"
                />
              </div>
            </section>

            {/* 4. TARİHİ & ANTİK KENTLER */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span>🏛️</span> Tarihi &amp; Antik Kentler
                </h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  KPSS
                </span>
              </div>
              <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
                <LayerItem
                  label="Antik Kentler &amp; Ören Yerleri"
                  icon="🏛️"
                  active={layers.ancientCities}
                  onToggle={() => toggleLayer('ancientCities')}
                  activeColor="text-amber-300"
                />
              </div>
            </section>

            {/* 5. KARSTİK, MAĞARALAR & KIYILAR */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <span>🕳️</span> Karstik &amp; Mağaralar
                </h3>
              </div>
              <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
                <LayerItem
                  label="Önemli Mağaralar"
                  icon="🦇"
                  active={layers.caves}
                  onToggle={() => toggleLayer('caves')}
                  activeColor="text-indigo-400"
                />
                <LayerItem
                  label="Karstik Şekiller &amp; Travertenler"
                  icon="🕳️"
                  active={layers.karstics}
                  onToggle={() => toggleLayer('karstics')}
                  activeColor="text-purple-300"
                />
                <LayerItem
                  label="Kıyı Tipleri &amp; Tombololar"
                  icon="🏖️"
                  active={layers.coastal}
                  onToggle={() => toggleLayer('coastal')}
                  activeColor="text-teal-300"
                />
              </div>
            </section>

            {/* 6. ULAŞIM, SINIR & MADENLER */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span>🚪</span> Sınır, Geçit &amp; Madenler
                </h3>
              </div>
              <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
                <LayerItem
                  label="Sınır Kapıları"
                  icon="🚪"
                  active={layers.borderGates}
                  onToggle={() => toggleLayer('borderGates')}
                  activeColor="text-emerald-400"
                />
                <LayerItem
                  label="Geçitler &amp; Tüneller"
                  icon="🛣️"
                  active={layers.passes}
                  onToggle={() => toggleLayer('passes')}
                  activeColor="text-purple-400"
                />
                <LayerItem
                  label="Madenler &amp; Enerji Tesisleri"
                  icon="⛏️"
                  active={layers.mines}
                  onToggle={() => toggleLayer('mines')}
                  activeColor="text-slate-300"
                />
                <LayerItem
                  label="81 İl Merkezi"
                  icon="📍"
                  active={layers.provinces}
                  onToggle={() => toggleLayer('provinces')}
                  activeColor="text-rose-400"
                />
              </div>
            </section>

            {/* 7. BÖLGESEL ODAKLANMA */}
            <section className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span>📍</span> Bölge Filtresi
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/10">
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
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold border text-left truncate transition-all ${
                      selectedRegion === reg
                        ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </aside>
  );
}

function LayerItem({
  label,
  icon,
  active,
  onToggle,
  activeColor
}: {
  label: string;
  icon: string;
  active: boolean;
  onToggle: () => void;
  activeColor: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-1.5 px-2.5 rounded-lg border text-xs transition-all select-none cursor-pointer ${
        active
          ? 'bg-slate-900/90 border-indigo-500/50 text-slate-100 font-semibold shadow-sm ring-1 ring-indigo-500/30'
          : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <span className="text-sm shrink-0">{icon}</span>
        <span className="truncate whitespace-nowrap text-[11px] font-medium">{label}</span>
      </div>
      <div className={`p-1 rounded-md shrink-0 border ${active ? 'bg-indigo-950/60 border-indigo-400/40' : 'bg-slate-900 border-white/10'}`}>
        {active ? <Eye className={`w-3.5 h-3.5 ${activeColor}`} /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
      </div>
    </button>
  );
}
