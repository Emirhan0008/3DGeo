'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useStore';
import { getFeatureImageUrl } from '@/lib/data/turkeyData';
import DraggableCard from '@/components/ui/DraggableCard';
import { 
  Mountain, 
  Waves, 
  Droplet, 
  DoorOpen, 
  Milestone, 
  Trees, 
  Pickaxe, 
  X, 
  Bot, 
  Sparkles, 
  MapPin, 
  BookMarked, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

export default function FeatureDetailModal() {
  const { selectedFeature, setSelectedFeature, flyToCoords, setAiDrawerOpen } = useAppStore();

  if (!selectedFeature) return null;

  return (
    <DraggableCard
      className="absolute left-4 sm:left-20 bottom-6 z-30 w-80 sm:w-96 bg-[#09090b]/90 backdrop-blur-2xl border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Top Banner */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-950/80 via-[#09090b] to-slate-900 border-b border-white/10 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300">
            {selectedFeature.type === 'mountain' && <Mountain className="w-4 h-4 text-indigo-400" />}
            {selectedFeature.type === 'river' && <Waves className="w-4 h-4 text-blue-400" />}
            {selectedFeature.type === 'lake' && <Droplet className="w-4 h-4 text-cyan-400" />}
            {selectedFeature.type === 'border_gate' && <DoorOpen className="w-4 h-4 text-emerald-400" />}
            {selectedFeature.type === 'pass' && <Milestone className="w-4 h-4 text-purple-400" />}
            {(selectedFeature.type === 'plateau' || selectedFeature.type === 'plain') && <Trees className="w-4 h-4 text-orange-400" />}
            {selectedFeature.type === 'mine' && <Pickaxe className="w-4 h-4 text-slate-300" />}
          </div>
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-indigo-400 border border-indigo-500/30">
              {selectedFeature.category || selectedFeature.type}
            </span>
            <h3 className="font-extrabold text-sm text-white mt-0.5">
              {selectedFeature.name}
            </h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {selectedFeature.region} Bölgesi
              {selectedFeature.elevation && ` • ${selectedFeature.elevation} m`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedFeature(null)}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5 max-h-[50vh] overflow-y-auto text-xs">
        {/* Feature Photograph Image Banner */}
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 shadow-lg group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getFeatureImageUrl(selectedFeature)}
            alt={selectedFeature.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white/90 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-indigo-300 font-bold">
              📸 Coğrafi Görsel
            </span>
            <span className="text-slate-300 font-semibold">{selectedFeature.region}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed font-normal">
          {selectedFeature.description}
        </p>

        {/* Memory Mnemonic / Kodlama Box */}
        {selectedFeature.mnemonic && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-1 text-amber-300 font-extrabold text-[10px] mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>KPSS HAFIZA KODLAMASI</span>
            </div>
            <p className="text-amber-100 font-semibold italic text-xs">
              &quot;{selectedFeature.mnemonic}&quot;
            </p>
          </div>
        )}

        {/* Key KPSS Tips */}
        {selectedFeature.kpssTips && selectedFeature.kpssTips.length > 0 && (
          <div>
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
              <BookMarked className="w-3 h-3" />
              ÖSYM / KPSS PÜF NOKTALARI
            </h4>
            <ul className="space-y-1 pl-1">
              {selectedFeature.kpssTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-200 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Connected Details for Border Gates or Rivers */}
        {selectedFeature.details && (
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1 text-[10px]">
            {selectedFeature.details.connectedCountry && (
              <div className="flex justify-between">
                <span className="text-slate-400">Bağlanan Ülke:</span>
                <span className="font-bold text-slate-200">{selectedFeature.details.connectedCountry}</span>
              </div>
            )}
            {selectedFeature.details.railway !== undefined && (
              <div className="flex justify-between">
                <span className="text-slate-400">Demiryolu Hattı:</span>
                <span className={`font-bold ${selectedFeature.details.railway ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {selectedFeature.details.railway ? '✓ Aktif Demiryolu Var' : '✕ Demiryolu Yok'}
                </span>
              </div>
            )}
            {selectedFeature.details.dams && (
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400">Üzerindeki Ana Barajlar:</span>
                <span className="font-semibold text-cyan-300">{selectedFeature.details.dams.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-2.5 bg-white/5 border-t border-white/10 flex items-center gap-2">
        <button
          onClick={() => {
            flyToCoords(selectedFeature.coordinates, 0, 0, 8.0);
          }}
          className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border border-white/10 transition-all whitespace-nowrap"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Haritada Odaklan</span>
        </button>

        <button
          onClick={() => {
            setAiDrawerOpen(true);
          }}
          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Asistanına Sor</span>
        </button>
      </div>
    </DraggableCard>
  );
}
