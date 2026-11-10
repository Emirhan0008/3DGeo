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
import { LAYER_ICONS } from '@/components/ui/LayerIcons';

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
    setSidebarHovered,
  } = useAppStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Accordion: the first group starts open so the plate never looks empty.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SECTIONS.forEach((s, i) => {
      init[s.title] = i === 0;
    });
    return init;
  });
  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  // Sync state when store closes sidebar
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsHovered(false);
      setIsPinned(false);
    }
  }, [isSidebarOpen]);

  // Never leave a stale hover flag behind when the plate unmounts
  // (fullscreen mode or a non-map tab hides it entirely).
  useEffect(() => {
    if (isFullscreen || activeTab !== 'map') setSidebarHovered(false);
  }, [isFullscreen, activeTab, setSidebarHovered]);

  useEffect(() => {
    return () => setSidebarHovered(false);
  }, [setSidebarHovered]);

  const isExpanded = isHovered || isPinned || isSidebarOpen;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
    setSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setSidebarHovered(false);
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
    <>
      {/* Hover hot zone: the decorative frame band on the left edge opens the
          plate on mouse-over, so the sidebar is discoverable without a click.
          `fixed` because the map wrapper clips overflow; exactly as wide as
          the frame band so it never steals clicks from the map. */}
      <div
        aria-hidden="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed bottom-0 left-0 top-0 z-20 w-2 sm:w-3"
      />

      <aside
        id="kpss-layer-sidebar"
        aria-label="Harita katmanları"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hf-plaque hf-double-rule absolute bottom-2 left-2 top-2 flex flex-col overflow-hidden rounded-2xl text-[#f5ecd4] transition-all duration-300 ease-in-out ${
          isExpanded ? 'z-45' : 'z-20'
        } ${
          isExpanded
            ? 'w-[85vw] max-w-xs opacity-100 sm:w-[290px]'
            : 'w-7 opacity-100 sm:w-9'
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
            className="flex h-full w-full cursor-pointer touch-manipulation select-none flex-col items-center justify-between py-2 transition-colors hover:bg-[#c9a24a]/10"
          >
            {/* top ornament */}
            <div className="pointer-events-none flex flex-col items-center gap-1">
              <span className="text-[9px] leading-none text-[#c9a24a]/80">◆</span>
              <div className="relative grid h-7 w-7 place-items-center rounded-full border border-[#c9a24a]/55 bg-[#c9a24a]/15 text-[#dcc07d] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                <Layers className="h-3.5 w-3.5" />
                {activeLayersCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-[#c9a24a] px-0.5 text-[8px] font-bold text-[#221b0c]">
                    {activeLayersCount}
                  </span>
                )}
              </div>
            </div>

            {/* vertical label — the discovery cue of the collapsed plate */}
            <div className="pointer-events-none my-1 flex flex-1 items-center justify-center overflow-hidden">
              <span className="hf-label [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[10px] font-semibold tracking-[0.22em] text-[#e2cd97]">
                Katmanlar{activeLayersCount > 0 ? ` · ${activeLayersCount}` : ''}
              </span>
            </div>

            <div className="pointer-events-none flex flex-col items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-[#dcc07d]" />
              <CompassRose className="h-7 w-7 opacity-60" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(true);
                  setIsPinned(true);
                }}
                title="Sabitle"
                className="pointer-events-auto rounded-full p-0.5 text-[#c0a970] transition-colors hover:text-[#e2c485]"
              >
              <Pin className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        /* ---------- expanded ---------- */
        <div className="flex h-full w-full flex-col">
          {/* header */}
          <div className="hf-parchment relative flex shrink-0 items-center justify-between border-b border-[#8a6a1d]/45 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="relative grid h-9 w-9 place-items-center rounded-full border border-[#8a6a1d]/60 bg-[radial-gradient(circle_at_32%_26%,#f6e9c2,#c9ac74_72%,#8a6a1d)] shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_2px_6px_rgba(0,0,0,.35)]">
                <CompassRose className="h-6 w-6" tone="#4a3714" />
              </div>
              <div className="leading-tight">
                <h2 className="hf-serif text-xs font-bold tracking-[0.1em] text-[#2a2314]">
                  HARİTA KATMANLARI
                </h2>
                <span className="text-[10px] font-medium text-[#6f5c33]">
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
                    ? 'bg-[#2a2314]/12 text-[#5a4413]'
                    : 'text-[#6f5c33] hover:bg-[#2a2314]/10 hover:text-[#2a2314]'
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
                className="rounded-full p-1.5 text-[#6f5c33] transition-colors hover:bg-[#2a2314]/10 hover:text-[#2a2314]"
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
          <div className="hf-scroll flex-1 overflow-y-auto overscroll-contain px-2.5 py-2 text-xs">
            {SECTIONS.map((section) => {
              const isOpen = Boolean(openSections[section.title]);
              const activeInSection = section.items.filter((i) => layers[i.key]).length;
              return (
                <section key={section.title} className="border-b border-[#c9a24a]/12 last:border-b-0">
                  <button
                    onClick={() => toggleSection(section.title)}
                    aria-expanded={isOpen}
                    className={`group flex w-full items-center gap-2 px-1.5 py-2 text-left transition-colors ${
                      isOpen ? 'text-[#e8d6a6]' : 'text-[#c2b283] hover:text-[#e8d6a6]'
                    }`}
                  >
                    <span
                      className={`shrink-0 text-[9px] leading-none text-[#c9a24a] transition-transform duration-200 ${
                        isOpen ? '' : 'rotate-180'
                      }`}
                      aria-hidden="true"
                    >
                      ▲
                    </span>
                    <span className="hf-label flex-1 truncate text-[10px] font-semibold">
                      {section.title}
                    </span>
                    {activeInSection > 0 && (
                      <span className="shrink-0 rounded-full border border-[#c9a24a]/30 bg-[#c9a24a]/12 px-1.5 text-[9px] font-bold leading-4 text-[#dcc07d]">
                        {activeInSection}
                      </span>
                    )}
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                    /* Closed groups keep their height animation but must not
                       stay keyboard-focusable: inert removes them from the tab
                       order without breaking the 0fr transition. */
                    inert={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-px pb-2">
                        {section.items.map((item) => (
                          <LayerItem
                            key={item.key}
                            iconKey={item.key}
                            label={item.label}
                            active={Boolean(layers[item.key])}
                            onToggle={() => toggleLayer(item.key)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            <section className="space-y-1.5 pt-2">
              <h3 className="hf-label flex items-center gap-2 px-1.5 text-[10px] font-semibold text-[#c2b283]">
                <span className="text-[9px] leading-none text-[#c9a24a]">◆</span>
                Bölge Filtresi
              </h3>
              <div className="grid grid-cols-2 gap-1 pb-1">
                {REGIONS.map((reg) => {
                  const isOn = selectedRegion === reg;
                  return (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`truncate rounded-md border px-2 py-1.5 text-left text-[10px] transition-colors ${
                        isOn
                          ? 'border-[#c9a24a]/70 bg-[#c9a24a]/15 font-semibold text-[#f0dba8]'
                          : 'border-[#c9a24a]/15 text-[#c2b283] hover:border-[#c9a24a]/35 hover:text-[#e6d3a4]'
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
    </>
  );
}

function LayerItem({
  iconKey,
  label,
  active,
  onToggle,
}: {
  iconKey: string;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  const Icon = LAYER_ICONS[iconKey];
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={`group flex w-full cursor-pointer select-none items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors ${
        active
          ? 'border-[#c9a24a]/35 bg-[#c9a24a]/10 text-[#f5ecd4]'
          : 'border-transparent text-[#c2b283] hover:border-[#c9a24a]/18 hover:bg-[#c9a24a]/6 hover:text-[#e6d3a4]'
      }`}
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
          active
            ? 'border-[#c9a24a]/55 bg-[#c9a24a]/18 text-[#e6c784]'
            : 'border-[#c9a24a]/18 text-[#9d9068] group-hover:border-[#c9a24a]/35 group-hover:text-[#c2b283]'
        }`}
        aria-hidden="true"
      >
        {Icon ? <Icon className="h-3.5 w-3.5" /> : <span className="h-1 w-1 rounded-full bg-current" />}
      </span>

      <span className="flex-1 truncate whitespace-nowrap text-[11px] font-medium">
        {label}
      </span>

      <span
        className={`shrink-0 transition-colors ${
          active ? 'text-[#dcc07d]' : 'text-[#5f5940] group-hover:text-[#b5a06a]'
        }`}
        aria-hidden="true"
      >
        {active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
