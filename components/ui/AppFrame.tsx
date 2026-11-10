'use client';

import React from 'react';

/* ==================================================================
   The atlas frame.

   A mounted-plate border: the whole app sits inside a band of aged
   parchment/leather, exactly like a chart pasted onto a book cover.
   Four strips are used instead of `border-image` so the texture keeps
   its natural scale on every edge (border-image would stretch the
   grain differently on the short sides).

   Purely decorative — pointer-events-none, sits above content, but
   only the 20px band is visible so it never blocks the UI.
   ================================================================== */

const TEX = "url('/assets/theme/frame-wood.jpg')";

/**
 * The band thickness lives in CSS (`--hf-band`) so it can shrink on phones
 * without duplicating the component: 6px on small screens (every pixel of map
 * counts there), 12px from `sm` up.
 *
 * The grain must read at its own scale. Stretching a 1024² tile across a
 * narrow band with `cover` turns every stain into a giant blob, so the tile
 * is repeated at 300px and only a slice shows through.
 */
function stripStyle(axis: 'x' | 'y'): React.CSSProperties {
  // First layer paints on top: the wash sits above the grain.
  const wash =
    axis === 'x'
      ? 'linear-gradient(180deg, rgba(26,17,7,.5), rgba(10,6,2,.82))'
      : 'linear-gradient(90deg, rgba(26,17,7,.5), rgba(10,6,2,.82))';
  return {
    ...(axis === 'x'
      ? { height: 'var(--hf-band)' }
      : { width: 'var(--hf-band)' }),
    backgroundImage: `${wash}, ${TEX}`,
    backgroundSize: '100% 100%, 300px 300px',
    backgroundPosition: 'center, center',
    backgroundBlendMode: 'normal, normal',
  };
}

export default function AppFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] select-none"
    >
      {/* ---- four texture strips ---- */}
      <div className="absolute inset-x-0 top-0" style={stripStyle('x')} />
      <div className="absolute inset-x-0 bottom-0" style={stripStyle('x')} />
      <div className="absolute inset-y-0 left-0" style={stripStyle('y')} />
      <div className="absolute inset-y-0 right-0" style={stripStyle('y')} />

      {/* ---- warm burnish: keeps the band from going flat black ---- */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(0,0,0,.55), inset 0 2px 0 rgba(201,162,74,.12), inset 0 -2px 0 rgba(201,162,74,.10)',
        }}
      />

      {/* ---- the inner edge: brass hairline + recessed shadow ---- */}
      <div
        className="absolute"
        style={{
          inset: 'var(--hf-band)',
          boxShadow:
            'inset 0 0 0 1px rgba(201,162,74,.55), inset 0 0 0 3px rgba(20,14,6,.55), inset 0 0 26px rgba(10,8,4,.55)',
          borderRadius: 3,
        }}
      />

      {/* ---- outer bevel: dark edge of the book cover ---- */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(0,0,0,.75), inset 0 0 0 2px rgba(201,162,74,.16)',
        }}
      />

      {/* ---- corner studs ---- */}
      {[
        { top: 4, left: 4 },
        { top: 4, right: 4 },
        { bottom: 4, left: 4 },
        { bottom: 4, right: 4 },
      ].map((pos, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            ...pos,
            background:
              'radial-gradient(circle at 32% 30%, #f2e2b4, #c9a24a 45%, #6b4f16 78%, #2a1f0a)',
            boxShadow: '0 1px 2px rgba(0,0,0,.9)',
          }}
        />
      ))}

      {/* ---- bottom-left armillary + scroll emblem ----
          Nudged below the viewport edge so the sphere reads as a corner
          vignette instead of a sticker floating over the map. Smaller on
          phones, where it would otherwise sit on the scale bar. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/theme/corner-emblem.png"
        alt=""
        className="absolute bottom-0 left-0 w-[190px] max-w-[46vw] translate-y-[20%] opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,.75)] sm:w-[330px] sm:translate-y-[16%] lg:w-[390px]"
        draggable={false}
      />
    </div>
  );
}
