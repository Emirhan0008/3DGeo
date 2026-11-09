'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, MapStyleType, type LayerState } from '@/lib/store/useStore';
import { useAppFullscreen } from '@/lib/utils';
import {
  Layers,
  Eye,
  EyeOff,
  X,
  Pin,
  PinOff,
  ChevronRight,
  Globe2,
  Satellite,
} from 'lucide-react';
import { CompassRose, NorthMark } from '@/components/ui/MapOrnaments';

const MAP_STYLES: {
  id: MapStyleType;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'topographic', label: 'Topoğrafya', Icon: Layers },
  { id: 'hybrid', label: 'Siyasi', Icon: Globe2 },
  { id: 'satellite', label: 'Uydu', Icon: Satellite },
];

const SECTIONS: {
  title: string;
  items: { key: keyof LayerState; label: string }[];
}[] = [
  {
    title: 'Dağ Sistemleri',
    items: [
      { key: 'mountainsVolcanic', label: 'Volkanik Dağlar' },
      { key: 'mountainsFold', label: 'Kıvrım Dağları' },
      { key: 'mountainsFault', label: 'Kırık Dağlar (Horst)' },
      { key: 'mountainsGlacial', label: 'Buzul Dağları' },
    ],
  },
  {
    title: 'Su Kaynakları',
    items: [
      { key: 'rivers', label: 'Akarsular & Havzalar' },
      { key: 'lakes', label: 'Göller & Barajlar' },
    ],
  },
  {
    title: 'Ovalar & Platolar',
    items: [
      { key: 'plainsDelta', label: 'Delta Ovaları' },
      { key: 'plainsTectonic', label: 'Tektonik Ovalar' },
      { key: 'plainsKarstic', label: 'Karstik Ovalar (Polyeler)' },
      { key: 'plateaus', label: 'Platolar (Lav / Tabaka / Aşınım)' },
    ],
  },
  {
    title: 'Tarih & Antik Kentler',
    items: [{ key: 'ancientCities', label: 'Antik Kentler & Ören Yerleri' }],
  },
  {
    title: 'Karstik Şekiller & Kıyılar',
    items: [
      { key: 'caves', label: 'Önemli Mağaralar' },
      { key: 'karstics', label: 'Travertenler & Karstik Şekiller' },
      { key: 'coastal', label: 'Kıyı Tipleri & Tombololar' },
    ],
  },
  {
    title: 'Sınır, Geçit & Madenler',
    items: [
      { key: 'borderGates', label: 'Sınır Kapıları' },
      { key: 'passes', label: 'Geçitler & Tüneller' },
      { key: 'mines', label: 'Madenler & Enerji' },
      { key: 'provinces', label: '81 İl Merkezi' },
    ],
  },
];

const REGIONS = [
  'Tüm Bölgeler',
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
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
    toggleBlindMapMode,
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

  // In fullscreen mode, or when active tab is not the exploration map,
  // hide the collapsed edge strip so it never overlaps games or modals.
  if ((isFullscreen || activeTab !== 'map') && !isExpanded) {
    return null;
  }

  return (
    <aside
      id="kpss-layer-sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hf-plaque hf-double-rule absolute bottom-2 left-2 top-2 flex flex-col overflow-hidden rounded-2xl text-[#f5ecd4] transition-all duration-300 ease-in-out ${
        isExpanded ? 'z-45' : 'z-20'
      } ${
        isExpanded
          ? 'w-[85vw] max-w-xs opacity-100 sm:w-80'
          : isHovered
            ? 'w-9 opacity-100'
            : 'w-9 opacity-80 hover:opacity-100'
      }`}
    >
      {!isExpanded ? (
        /* ---------- collapsed spine ---------- */
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
          className="flex h-full w-full cursor-pointer touch-manipulation select-none flex-col items-center justify-between py-2 transition-colors hover:bg-[#c9a24a]/8"
        >
          {/* top ornament */}
          <div className="pointer-events-none flex flex-col items-center gap-1">
            <span className="text-[9px] leading-none text-[#c9a24a]/70">◆</span>
            <div className="relative grid h-7 w-7 place-items-center rounded-full border border-[#c9a24a]/40 bg-[#c9a24a]/10 text-[#c9a24a]">
              <Layers className="h-3.5 w-3.5" />
              {activeLayersCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-[#c9a24a] px-0.5 text-[8px] font-bold text-[#221b0c]">
                  {activeLayersCount}
                </span>
              )}
            </div>
          </div>

          <div className="pointer-events-none my-1 flex flex-1 items-center justify-center overflow-hidden">
            <span className="hf-label [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[9px] text-[#b5a06a]">
              Katmanlar{activeLayersCount > 0 ? ` · ${activeLayersCount}` : ''}
            </span>
          </div>

          <div className="pointer-events-none flex flex-col items-center gap-1">
            <CompassRose className="h-7 w-7 opacity-55" />
            <ChevronRight className="h-3 w-3 text-[#c9a24a]/70" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(true);
                setIsPinned(true);
              }}
              title="Sabitle"
              className="pointer-events-auto rounded-full p-0.5 text-[#b5a06a] transition-colors hover:text-[#e2c485]"
            >
              <Pin className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        /* ---------- expanded ---------- */
        <div className="flex h-full w-full flex-col">
          {/* header */}
          <div className="relative flex shrink-0 items-center justify-between border-b border-[#c9a24a]/18 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="relative grid h-8 w-8 place-items-center rounded-full border border-[#c9a24a]/40 bg-[radial-gradient(circle_at_32%_26%,#2b3118,#0f1209_78%)]">
                <CompassRose className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-[12px] font-semibold tracking-[0.14em] text-[#f5ecd4]">
                  Harita Katmanları
                </h2>
                <span className="text-[10px] text-[#b5a06a]">
                  {activeLayersCount} / {totalLayersCount} etkin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                className={`rounded-full p-1.5 transition-colors ${
                  isPinned
                    ? 'text-[#e2c485]'
                    : 'text-[#b5a06a] hover:text-[#e6d3a4]'
                }`}
              >
                {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={() => {
                  setIsPinned(false);
                  setIsHovered(false);
                  setSidebarOpen(false);
                }}
                title="Kapat"
                className="rounded-full p-1.5 text-[#b5a06a] transition-colors hover:text-[#e6d3a4]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* base style + bulk */}
          <div className="shrink-0 space-y-2 border-b border-[#c9a24a]/12 px-3 py-2.5">
            <div className="grid grid-cols-3 gap-1">
              {MAP_STYLES.map((style) => {
                const isOn = mapStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setMapStyle(style.id)}
                    className={`flex items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[10px] font-semibold transition-all ${
                      isOn
                        ? 'border-[#c9a24a]/70 bg-[#c9a24a]/15 text-[#f0dba8]'
                        : 'border-[#c9a24a]/15 text-[#c9b273] hover:border-[#c9a24a]/40 hover:text-[#e6d3a4]'
                    }`}
                  >
                    <style.Icon className="h-3 w-3" />
                    <span className="truncate">{style.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={selectAllLayers}
                  className="rounded-md border border-[#c9a24a]/30 px-2 py-1 text-[10px] font-semibold text-[#dcc07d] transition-colors hover:bg-[#c9a24a]/12"
                >
                  Tümünü Aç
                </button>
                <button
                  onClick={clearAllLayers}
                  className="rounded-md border border-[#c9a24a]/12 px-2 py-1 text-[10px] text-[#c9b273] transition-colors hover:border-[#c9a24a]/35 hover:text-[#e6d3a4]"
                >
                  Kapat
                </button>
              </div>

              <button
                onClick={toggleBlindMapMode}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors ${
                  isBlindMapMode
                    ? 'border-[#c9a24a]/70 bg-[#c9a24a]/15 text-[#f0dba8]'
                    : 'border-[#c9a24a]/15 text-[#c9b273] hover:border-[#c9a24a]/40 hover:text-[#e6d3a4]'
                }`}
              >
                {isBlindMapMode ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
                <span>Dilsiz</span>
              </button>
            </div>
          </div>

          {/* scroll area */}
          <div className="hf-scroll flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-3 text-xs">
            {SECTIONS.map((section) => (
              <section key={section.title} className="space-y-1.5">
                <h3 className="hf-label px-1 text-[10px] text-[#c9a24a]">
                  {section.title}
                </h3>
                <div className="space-y-0.5 rounded-xl border border-[#c9a24a]/12 bg-black/15 p-1">
                  {section.items.map((item) => (
                    <LayerItem
                      key={item.key}
                      label={item.label}
                      active={Boolean(layers[item.key])}
                      onToggle={() => toggleLayer(item.key)}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section className="space-y-1.5 pt-1">
              <h3 className="hf-label px-1 text-[10px] text-[#b5a06a]">Bölge Filtresi</h3>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#c9a24a]/12 bg-black/15 p-1">
                {REGIONS.map((reg) => {
                  const isOn = selectedRegion === reg;
                  return (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`truncate rounded-lg border px-2 py-1.5 text-left text-[10px] transition-colors ${
                        isOn
                          ? 'border-[#c9a24a]/70 bg-[#c9a24a]/15 font-semibold text-[#f0dba8]'
                          : 'border-transparent text-[#c9b273] hover:bg-[#c9a24a]/8 hover:text-[#e6d3a4]'
                      }`}
                    >
                      {reg}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* footer ornament */}
          <div className="flex shrink-0 items-center justify-center gap-2 border-t border-[#c9a24a]/15 px-3 py-1.5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a24a]/30" />
            <NorthMark className="h-6 w-6 opacity-60" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a24a]/30" />
          </div>
        </div>
      )}
    </aside>
  );
}

function LayerItem({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`group flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-lg border border-l-2 px-2 py-1.5 text-left transition-colors ${
        active
          ? 'border-transparent border-l-[#c9a24a] bg-[#c9a24a]/10 text-[#f5ecd4]'
          : 'border-transparent border-l-transparent text-[#c9b273] hover:bg-white/[0.03] hover:text-[#e6d3a4]'
      }`}
    >
      <span className="truncate whitespace-nowrap text-[11px] font-medium">
        {label}
      </span>
      <span
        className={`shrink-0 transition-colors ${
          active ? 'text-[#dcc07d]' : 'text-[#6e6647] group-hover:text-[#b5a06a]'
        }`}
      >
        {active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
