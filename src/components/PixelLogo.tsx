/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PixelLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const PixelLogo: React.FC<PixelLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* 8-Bit Pixel Spacecraft & Memory Core Icon */}
      <div
        className={`relative shrink-0 flex items-center justify-center rounded-lg bg-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] ${
          isSm ? 'w-8 h-8' : isLg ? 'w-14 h-14' : 'w-10 h-10'
        }`}
        style={{
          boxShadow: '0 0 16px rgba(6,182,212,0.6), inset 0 0 8px rgba(6,182,212,0.3)',
        }}
      >
        <svg
          viewBox="0 0 16 16"
          className="w-full h-full p-1 image-pixelated"
          shapeRendering="crispEdges"
        >
          {/* Outer pixel frame corners */}
          <rect x="0" y="0" width="1" height="1" fill="#22d3ee" />
          <rect x="15" y="0" width="1" height="1" fill="#22d3ee" />
          <rect x="0" y="15" width="1" height="1" fill="#22d3ee" />
          <rect x="15" y="15" width="1" height="1" fill="#22d3ee" />

          {/* Retro 8-bit Spacecraft / Neural Core */}
          {/* Nosecone */}
          <rect x="7" y="2" width="2" height="2" fill="#38bdf8" />
          {/* Cockpit / Hologram Core */}
          <rect x="6" y="4" width="4" height="2" fill="#67e8f9" />
          <rect x="7" y="4" width="2" height="1" fill="#ffffff" />
          {/* Main Hull */}
          <rect x="5" y="6" width="6" height="4" fill="#0284c7" />
          <rect x="7" y="7" width="2" height="2" fill="#38bdf8" />
          {/* Wing Cannons / Memory Pods */}
          <rect x="3" y="8" width="2" height="3" fill="#0369a1" />
          <rect x="11" y="8" width="2" height="3" fill="#0369a1" />
          <rect x="2" y="10" width="1" height="2" fill="#38bdf8" />
          <rect x="13" y="10" width="1" height="2" fill="#38bdf8" />
          {/* Dual Thrusters */}
          <rect x="5" y="10" width="2" height="2" fill="#075985" />
          <rect x="9" y="10" width="2" height="2" fill="#075985" />
          {/* Plasma Thruster Plume (animated vibrant orange/yellow) */}
          <rect x="5" y="12" width="2" height="2" fill="#f59e0b" className="animate-pulse" />
          <rect x="9" y="12" width="2" height="2" fill="#f59e0b" className="animate-pulse" />
          <rect x="6" y="14" width="1" height="1" fill="#ef4444" />
          <rect x="10" y="14" width="1" height="1" fill="#ef4444" />
        </svg>

        {/* Pulsing beacon pixel */}
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-300 animate-ping opacity-75" />
      </div>

      {/* Typography: Authentic Pixel Arcade Branding */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span
            className={`font-arcade tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] ${
              isSm ? 'text-xs' : isLg ? 'text-2xl' : 'text-base'
            }`}
          >
            ASTRA
          </span>
          <span
            className={`font-arcade tracking-wider text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] ${
              isSm ? 'text-xs' : isLg ? 'text-2xl' : 'text-base'
            }`}
          >
            MEMORY
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
            [ MEMORIA ESPACIAL · 16-BIT ARCADE ]
          </span>
        )}
      </div>
    </div>
  );
};
