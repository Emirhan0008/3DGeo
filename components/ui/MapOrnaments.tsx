'use client';

import React from 'react';

/* ==================================================================
   Antiquarian cartography ornaments, drawn as inline SVG so they
   scale crisply and inherit the brass palette without image assets.
   Every piece is purely decorative: aria-hidden + pointer-events-none.
   ================================================================== */

type OrnamentProps = {
  className?: string;
  /** Stroke/fill tint. Defaults to the brass accent. */
  tone?: string;
};

/** Classic eight-point compass rose with an inner double ring. */
export function CompassRose({ className = '', tone = '#c9a24a' }: OrnamentProps) {
  const points = Array.from({ length: 32 });
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {/* outer rings */}
      <circle cx="100" cy="100" r="96" stroke={tone} strokeOpacity="0.55" />
      <circle cx="100" cy="100" r="88" stroke={tone} strokeOpacity="0.32" />
      <circle cx="100" cy="100" r="62" stroke={tone} strokeOpacity="0.25" />

      {/* degree ticks */}
      {points.map((_, i) => {
        const angle = (i * 360) / points.length;
        const major = i % 4 === 0;
        const mid = i % 2 === 0;
        const len = major ? 12 : mid ? 7 : 4;
        return (
          <line
            key={i}
            x1="100"
            y1={major ? 4 : mid ? 8 : 11}
            x2="100"
            y2={11 + len}
            stroke={tone}
            strokeOpacity={major ? 0.7 : 0.3}
            strokeWidth={major ? 1.2 : 0.7}
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* cardinal star — light half / dark half for an engraved look */}
      {[0, 90, 180, 270].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 100 100)`}>
          <path d="M100 18 L108 92 L100 100 L92 92 Z" fill={tone} fillOpacity="0.5" />
          <path d="M100 18 L100 100 L92 92 Z" fill={tone} fillOpacity="0.8" />
        </g>
      ))}

      {/* intercardinal points */}
      {[45, 135, 225, 315].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 100 100)`}>
          <path d="M100 48 L105 94 L100 100 L95 94 Z" fill={tone} fillOpacity="0.34" />
        </g>
      ))}

      {/* needle + hub */}
      <path d="M100 66 L104 100 L100 134 L96 100 Z" fill={tone} fillOpacity="0.22" />
      <circle cx="100" cy="100" r="9" stroke={tone} strokeOpacity="0.75" />
      <circle cx="100" cy="100" r="4" fill={tone} fillOpacity="0.8" />
    </svg>
  );
}

/** Armillary sphere: a globe caged in graduated brass rings. */
export function ArmillarySphere({ className = '', tone = '#c9a24a' }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <circle cx="100" cy="100" r="52" stroke={tone} strokeOpacity="0.6" />
      <circle cx="100" cy="100" r="52" stroke={tone} strokeOpacity="0.25" strokeDasharray="2 5" />

      {/* meridians */}
      <ellipse cx="100" cy="100" rx="52" ry="52" stroke={tone} strokeOpacity="0.35" />
      <ellipse cx="100" cy="100" rx="26" ry="52" stroke={tone} strokeOpacity="0.45" />
      <ellipse cx="100" cy="100" rx="72" ry="72" stroke={tone} strokeOpacity="0.28" />
      <ellipse cx="100" cy="100" rx="86" ry="86" stroke={tone} strokeOpacity="0.2" />

      {/* parallels */}
      <ellipse cx="100" cy="100" rx="52" ry="18" stroke={tone} strokeOpacity="0.4" />
      <ellipse cx="100" cy="100" rx="52" ry="36" stroke={tone} strokeOpacity="0.22" />

      {/* tilted ecliptic ring */}
      <ellipse
        cx="100"
        cy="100"
        rx="88"
        ry="88"
        stroke={tone}
        strokeOpacity="0.45"
        transform="rotate(-23 100 100)"
      />

      {/* axis */}
      <line x1="100" y1="24" x2="100" y2="176" stroke={tone} strokeOpacity="0.3" />
      <circle cx="100" cy="100" r="3.5" fill={tone} fillOpacity="0.85" />
    </svg>
  );
}

/** Engraved landscape silhouette: ridge, firs and a watchtower. */
export function TerrainSilhouette({
  className = '',
  tone = '#2a2412',
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 420 120"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill={tone}>
        {/* rear ridge */}
        <path
          d="M0 120 L0 92 L26 74 L48 86 L70 62 L96 84 L118 68 L142 88 L168 66 L192 86 L214 72 L240 92 L262 78 L288 96 L310 82 L336 98 L360 84 L386 100 L420 86 L420 120 Z"
          opacity="0.28"
        />
        {/* front ridge */}
        <path
          d="M0 120 L0 108 L30 94 L58 104 L86 90 L112 104 L140 92 L166 106 L194 94 L222 108 L250 96 L278 110 L306 98 L334 112 L362 100 L390 112 L420 102 L420 120 Z"
          opacity="0.55"
        />
        {/* firs */}
        <g opacity="0.6">
          <path d="M352 118 L352 96 L344 100 L352 88 L360 100 L352 96 Z" />
          <path d="M364 118 L364 102 L358 105 L364 96 L370 105 L364 102 Z" />
          <path d="M374 118 L374 100 L367 104 L374 92 L381 104 L374 100 Z" />
          <path d="M386 118 L386 104 L380 107 L386 98 L392 107 L386 104 Z" />
          <path d="M398 118 L398 98 L390 102 L398 90 L406 102 L398 98 Z" />
        </g>
        {/* watchtower */}
        <g opacity="0.75">
          <rect x="300" y="76" width="14" height="44" />
          <rect x="296" y="70" width="22" height="8" />
          <path d="M296 70 L307 58 L318 70 Z" />
          <rect x="304" y="86" width="6" height="9" fill="#efe3c6" opacity="0.5" />
          <line x1="296" y1="62" x2="296" y2="52" stroke={tone} strokeWidth="1.6" />
          <path d="M296 52 L308 55 L296 58 Z" />
        </g>
        {/* ground scatter */}
        <ellipse cx="120" cy="118" rx="60" ry="5" opacity="0.18" />
        <ellipse cx="250" cy="119" rx="50" ry="4" opacity="0.14" />
      </g>
    </svg>
  );
}

/** Compass letter N mark used on the sidebar spine and plaque headers. */
export function NorthMark({ className = '', tone = '#c9a24a' }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 56"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <text
        x="20"
        y="14"
        textAnchor="middle"
        fill={tone}
        fillOpacity="0.85"
        fontSize="11"
        fontFamily="ui-serif, Georgia, serif"
        letterSpacing="1"
      >
        N
      </text>
      <path d="M20 20 L24 40 L20 36 L16 40 Z" fill={tone} fillOpacity="0.75" />
      <circle cx="20" cy="46" r="3" stroke={tone} strokeOpacity="0.6" />
    </svg>
  );
}
