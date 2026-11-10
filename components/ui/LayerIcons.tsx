'use client';

import React from 'react';

/* ==================================================================
   Layer-type icons.

   Every glyph is drawn on a 24×24 grid with a single stroke weight so
   the column of icons in the sidebar reads as one engraved plate rather
   than a pile of borrowed pictograms. They are filled/stroked with
   currentColor, so the brass palette controls them.
   ================================================================== */

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

/** Volcano: low cone with a crater notch and a plume. */
export function IconVolcano({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 19h19" strokeOpacity=".55" />
      <path d="M4.5 19 10 9.5h4L19.5 19" />
      <path d="M9.6 9.5h4.8l-1.1 2.2h-2.6z" fill="currentColor" fillOpacity=".28" stroke="none" />
      <path d="M11 7.2c0-1.4.8-1.8.8-3" strokeOpacity=".75" />
      <path d="M13.2 7.4c.5-1 .2-1.6.9-2.6" strokeOpacity=".45" />
    </svg>
  );
}

/** Fold range: two soft, rounded ridges. */
export function IconFold({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 19h19" strokeOpacity=".55" />
      <path d="M2.8 18.4c2.2-6.2 3.7-8.6 6-8.6 2.6 0 3.2 3.4 6 3.4 2.4 0 3.6-3.8 6.4-3.8" />
      <path d="M4.6 18.4c1.4-3.4 2.4-4.8 4-4.8" strokeOpacity=".4" />
    </svg>
  );
}

/** Fault range: a stepped, blocky horst. */
export function IconFault({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 19h19" strokeOpacity=".55" />
      <path d="M3 18.6 6.4 12h4.2l2-3.6h5.4L21 18.6" />
      <path d="M6.4 12v6.6M10.6 12v6.6M12.6 8.4v10.2M18 8.4v10.2" strokeOpacity=".38" />
    </svg>
  );
}

/** Glacial range: sharp horns plus a snow cap. */
export function IconGlacier({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 19h19" strokeOpacity=".55" />
      <path d="M3 19 9.2 8.2 12.6 14l2.4-4.2L21 19" />
      <path d="M8.3 11.4h1.8l-.9 1.6zM14 12.6l1 .1-.5 1z" fill="currentColor" fillOpacity=".45" stroke="none" />
    </svg>
  );
}

/** Rivers & basins: a meandering current. */
export function IconRiver({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6.5c3.4 0 3.4 4 6.8 4s3.4-4 6.8-4" strokeOpacity=".45" />
      <path d="M3 12.5c3.4 0 3.4 4 6.8 4s3.4-4 6.8-4" />
      <path d="M17.4 15.4c1.2 0 1.9.4 2.8.9" strokeOpacity=".6" />
      <circle cx="5.2" cy="18.6" r=".9" fill="currentColor" stroke="none" strokeOpacity="1" />
    </svg>
  );
}

/** Lakes & dams: a shore with a held pool. */
export function IconLake({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 14.6h4.1L8.9 9.4h5.9l2 5.2h4.7" />
      <path d="M5.6 17.4c1.8 0 1.8 1.4 3.6 1.4s1.8-1.4 3.6-1.4 1.8 1.4 3.6 1.4 1.8-1.4 3.1-1.4" strokeOpacity=".6" />
      <path d="M9.2 14.6h5.2" strokeOpacity=".4" />
    </svg>
  );
}

/** Delta plain: a fan of distributaries. */
export function IconDelta({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11 4v4.6" />
      <path d="M11 8.6 4.4 19M11 8.6 8 19M11 8.6l3 10.4M11 8.6 17.6 19" strokeOpacity=".75" />
      <path d="M2.6 19h18.8" strokeOpacity=".45" />
    </svg>
  );
}

/** Tectonic plain: a flat plate bounded by fault ticks. */
export function IconTectonic({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.4" y="9.2" width="17.2" height="6.4" rx=".6" />
      <path d="M3.4 12.4h17.2" strokeOpacity=".3" />
      <path d="M6.6 9.2V6.6M17.4 9.2V6.6M6.6 15.6v2.6M17.4 15.6v2.6" strokeOpacity=".55" />
      <path d="M4.6 6.6h4M15.4 6.6h4M4.6 18.2h4M15.4 18.2h4" strokeOpacity=".35" />
    </svg>
  );
}

/** Karstic polje: a closed depression ringed by rock. */
export function IconPolje({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="12.4" rx="8.2" ry="5.2" />
      <ellipse cx="12" cy="12.4" rx="4.6" ry="2.6" strokeOpacity=".45" />
      <path d="M5.4 8.2 6.8 5.6M18.6 8.2 17.2 5.6M12 7v-2" strokeOpacity=".6" />
    </svg>
  );
}

/** Plateau: a raised table with scarp edges. */
export function IconPlateau({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.6 9.4h14.8" />
      <path d="M4.6 9.4 2.8 18.4M19.4 9.4l1.8 9" strokeOpacity=".7" />
      <path d="M4.6 9.4 6 6.2h12l1.4 3.2" strokeOpacity=".45" />
      <path d="M2.8 18.4h18.4" strokeOpacity=".55" />
    </svg>
  );
}

/** Ancient city: a colonnade under a pediment. */
export function IconAncientCity({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.4 8.6 12 3.8l8.6 4.8" />
      <path d="M5 8.6h14" strokeOpacity=".7" />
      <path d="M6.5 18.4V9.4M10.2 18.4V9.4M13.8 18.4V9.4M17.5 18.4V9.4" />
      <path d="M4 18.4h16M3.2 20.6h17.6" strokeOpacity=".6" />
    </svg>
  );
}

/** Cave: an arched mouth in a rock face. */
export function IconCave({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.6 20.4c0-5.4 4.2-9.6 9.4-9.6s9.4 4.2 9.4 9.6" strokeOpacity=".55" />
      <path d="M7.2 20.4c0-3.2 2.2-5.6 4.8-5.6s4.8 2.4 4.8 5.6" />
      <path d="M9.6 7.2v2.4M14.4 7.2v2.4M12 6v2" strokeOpacity=".4" />
    </svg>
  );
}

/** Travertine terraces: stepped pools. */
export function IconTravertine({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.8 9.2h8.4v3.2H2.8zM11.2 12.4h5.6v3.2h-5.6zM16.8 15.6h4.4v3.2h-4.4z" strokeOpacity=".85" />
      <path d="M2.8 9.2c1.6 0 1.6 1.6 3.2 1.6M11.2 12.4c1.2 0 1.2 1.6 2.4 1.6" strokeOpacity=".4" />
    </svg>
  );
}

/** Coastal types: a headland with surf lines. */
export function IconCoast({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.2 3.4v17.2" strokeOpacity=".5" />
      <path d="M6 3.4c0 4.4 3.4 5.4 3.4 8.6S6 15.4 6 20.6" />
      <path d="M14.4 8.6c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4" strokeOpacity=".6" />
      <path d="M14.4 13.4c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4" strokeOpacity=".45" />
      <path d="M14.4 18.2c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4" strokeOpacity=".3" />
    </svg>
  );
}

/** Border gate: two posts under a lintel. */
export function IconGate({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.4 20V7.4M18.6 20V7.4" />
      <path d="M4 7.4h16" strokeOpacity=".8" />
      <path d="M5.4 11.2h13.2" strokeOpacity=".45" />
      <path d="M12 12.6v7.4" strokeDasharray="2.4 2" strokeOpacity=".6" />
    </svg>
  );
}

/** Pass / tunnel: a notch between two shoulders. */
export function IconPass({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.6 20.4 8.4 8.6" />
      <path d="M21.4 20.4 15.6 8.6" />
      <path d="M9.6 15.4h4.8" strokeOpacity=".7" />
      <path d="M12 11.6v8.8" strokeDasharray="2.4 2" strokeOpacity=".55" />
    </svg>
  );
}

/** Mines & energy: crossed pick and hammer. */
export function IconMine({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.6 19.4 15 9" />
      <path d="M12.6 6.6c2-1.6 4.4-1.4 6.4.6s2.2 4.4.6 6.4" strokeOpacity=".8" />
      <path d="M7.4 16.6 4.4 13.6M14.6 19.4l3-3" strokeOpacity=".45" />
      <path d="M19.4 4.6l-2.6 2.6" strokeOpacity=".6" />
    </svg>
  );
}

/** Provinces: a domed civic silhouette. */
export function IconProvince({ className = '' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20.4V12l4-3.4 4 3.4v8.4" />
      <path d="M12 20.4v-6.2l3.4-2.8 3.4 2.8v6.2" strokeOpacity=".8" />
      <path d="M8 12.6c0-1.4 0-2 .5-2.6M16.4 11c0-1.2 0-1.6.4-2" strokeOpacity=".5" />
      <path d="M3 20.4h18" strokeOpacity=".6" />
    </svg>
  );
}

/* ---- registry: layer key → glyph ---------------------------------- */

export const LAYER_ICONS: Record<string, React.ComponentType<IconProps>> = {
  mountainsVolcanic: IconVolcano,
  mountainsFold: IconFold,
  mountainsFault: IconFault,
  mountainsGlacial: IconGlacier,
  rivers: IconRiver,
  lakes: IconLake,
  plainsDelta: IconDelta,
  plainsTectonic: IconTectonic,
  plainsKarstic: IconPolje,
  plateaus: IconPlateau,
  ancientCities: IconAncientCity,
  caves: IconCave,
  karstics: IconTravertine,
  coastal: IconCoast,
  borderGates: IconGate,
  passes: IconPass,
  mines: IconMine,
  provinces: IconProvince,
};
