/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RankBadgeProps {
  level: number;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  level,
  title,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  // Normalize rank level from 1 to 5
  const rankLevel = Math.max(1, Math.min(5, level));

  const rankThemes: Record<
    number,
    {
      borderColor: string;
      glowColor: string;
      bgGradient: string;
      textColor: string;
      badgeName: string;
      tier: string;
    }
  > = {
    1: {
      borderColor: '#b45309', // Bronze
      glowColor: 'rgba(217, 119, 6, 0.4)',
      bgGradient: 'from-amber-950 via-slate-950 to-amber-950/80',
      textColor: 'text-amber-400',
      badgeName: 'Escudo Cometa de Bronce',
      tier: 'BRONCE',
    },
    2: {
      borderColor: '#94a3b8', // Silver
      glowColor: 'rgba(148, 163, 184, 0.5)',
      bgGradient: 'from-slate-800 via-slate-950 to-slate-900',
      textColor: 'text-slate-200',
      badgeName: 'Compás de Navegación Plateado',
      tier: 'PLATA',
    },
    3: {
      borderColor: '#eab308', // Gold
      glowColor: 'rgba(234, 179, 8, 0.55)',
      bgGradient: 'from-yellow-950 via-slate-950 to-amber-950',
      textColor: 'text-yellow-400',
      badgeName: 'Caza Estelar de Oro',
      tier: 'ORO',
    },
    4: {
      borderColor: '#06b6d4', // Platinum / Cyan
      glowColor: 'rgba(6, 182, 212, 0.6)',
      bgGradient: 'from-cyan-950 via-slate-950 to-indigo-950',
      textColor: 'text-cyan-300',
      badgeName: 'Corona de Flota Platino',
      tier: 'PLATINO',
    },
    5: {
      borderColor: '#ec4899', // Cosmic Diamond
      glowColor: 'rgba(236, 72, 153, 0.7)',
      bgGradient: 'from-purple-950 via-slate-950 to-pink-950',
      textColor: 'text-fuchsia-300',
      badgeName: 'Gran Insignia Cósmica Primordial',
      tier: 'CÓSMICO',
    },
  };

  const theme = rankThemes[rankLevel] || rankThemes[1];

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  }[size];

  // Render authentic pixel art shield for each rank
  const renderShieldSvg = () => {
    switch (rankLevel) {
      case 1:
        // Rank 1: Cadete Espacial (Bronze Comet Shield)
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full p-1" shapeRendering="crispEdges">
            {/* Outer Bronze Shield */}
            <rect x="3" y="1" width="10" height="2" fill="#d97706" />
            <rect x="2" y="3" width="12" height="6" fill="#b45309" />
            <rect x="3" y="9" width="10" height="3" fill="#78350f" />
            <rect x="4" y="12" width="8" height="2" fill="#78350f" />
            <rect x="6" y="14" width="4" height="1" fill="#b45309" />
            <rect x="7" y="15" width="2" height="1" fill="#d97706" />

            {/* Shield Core: Glowing Comet */}
            <rect x="6" y="4" width="4" height="4" fill="#fef08a" />
            <rect x="7" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="4" y="8" width="2" height="2" fill="#f59e0b" />
            <rect x="10" y="8" width="2" height="2" fill="#f59e0b" />
            <rect x="7" y="10" width="2" height="2" fill="#ea580c" />
          </svg>
        );

      case 2:
        // Rank 2: Oficial de Navegación (Silver Winged Compass)
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full p-1" shapeRendering="crispEdges">
            {/* Outer Silver Shield */}
            <rect x="2" y="2" width="12" height="2" fill="#cbd5e1" />
            <rect x="1" y="4" width="14" height="6" fill="#94a3b8" />
            <rect x="2" y="10" width="12" height="3" fill="#64748b" />
            <rect x="4" y="13" width="8" height="2" fill="#475569" />
            <rect x="6" y="15" width="4" height="1" fill="#94a3b8" />

            {/* Nav Compass Rose */}
            <rect x="7" y="3" width="2" height="3" fill="#38bdf8" />
            <rect x="7" y="9" width="2" height="3" fill="#38bdf8" />
            <rect x="4" y="6" width="3" height="2" fill="#38bdf8" />
            <rect x="9" y="6" width="3" height="2" fill="#38bdf8" />
            <rect x="6" y="5" width="4" height="4" fill="#ffffff" />
            <rect x="7" y="6" width="2" height="2" fill="#0284c7" />
          </svg>
        );

      case 3:
        // Rank 3: Piloto Estelar (Gold Starfighter Shield)
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full p-1" shapeRendering="crispEdges">
            {/* Outer Gold Shield */}
            <rect x="2" y="1" width="12" height="2" fill="#fde047" />
            <rect x="1" y="3" width="14" height="7" fill="#eab308" />
            <rect x="2" y="10" width="12" height="3" fill="#ca8a04" />
            <rect x="4" y="13" width="8" height="2" fill="#a16207" />
            <rect x="6" y="15" width="4" height="1" fill="#facc15" />

            {/* Dual Starfighter Wings & Plasma Core */}
            <rect x="7" y="3" width="2" height="3" fill="#ffffff" />
            <rect x="6" y="6" width="4" height="3" fill="#f59e0b" />
            <rect x="7" y="7" width="2" height="1" fill="#ffffff" />
            <rect x="3" y="6" width="2" height="4" fill="#facc15" />
            <rect x="11" y="6" width="2" height="4" fill="#facc15" />
            <rect x="2" y="8" width="1" height="3" fill="#ef4444" />
            <rect x="13" y="8" width="1" height="3" fill="#ef4444" />
            <rect x="6" y="11" width="4" height="1" fill="#38bdf8" />
          </svg>
        );

      case 4:
        // Rank 4: Comandante de Flota (Platinum Fleet Crown)
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full p-1" shapeRendering="crispEdges">
            {/* Crowned Platinum Shield */}
            <rect x="2" y="1" width="2" height="2" fill="#22d3ee" />
            <rect x="7" y="0" width="2" height="3" fill="#67e8f9" />
            <rect x="12" y="1" width="2" height="2" fill="#22d3ee" />
            <rect x="2" y="3" width="12" height="3" fill="#0891b2" />
            <rect x="1" y="6" width="14" height="4" fill="#0e7490" />
            <rect x="2" y="10" width="12" height="3" fill="#155e75" />
            <rect x="4" y="13" width="8" height="2" fill="#164e63" />
            <rect x="7" y="15" width="2" height="1" fill="#67e8f9" />

            {/* Fleet Commander Triple Chevrons */}
            <rect x="5" y="5" width="6" height="1" fill="#ffffff" />
            <rect x="6" y="6" width="4" height="1" fill="#22d3ee" />
            <rect x="7" y="7" width="2" height="1" fill="#67e8f9" />

            <rect x="5" y="9" width="6" height="1" fill="#ffffff" />
            <rect x="6" y="10" width="4" height="1" fill="#22d3ee" />
            <rect x="7" y="11" width="2" height="1" fill="#67e8f9" />
          </svg>
        );

      case 5:
      default:
        // Rank 5: Almirante Galáctico (Cosmic Diamond Solar Crest)
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full p-1" shapeRendering="crispEdges">
            {/* Prismatic Stellar Diamond Shield */}
            <rect x="6" y="0" width="4" height="2" fill="#f43f5e" />
            <rect x="4" y="2" width="8" height="2" fill="#ec4899" />
            <rect x="2" y="4" width="12" height="3" fill="#d946ef" />
            <rect x="1" y="7" width="14" height="2" fill="#a855f7" />
            <rect x="2" y="9" width="12" height="3" fill="#8b5cf6" />
            <rect x="4" y="12" width="8" height="2" fill="#6366f1" />
            <rect x="6" y="14" width="4" height="2" fill="#3b82f6" />

            {/* Pulsing Galactic Nova Core */}
            <rect x="7" y="4" width="2" height="8" fill="#ffffff" />
            <rect x="4" y="7" width="8" height="2" fill="#ffffff" />
            <rect x="6" y="6" width="4" height="4" fill="#fef08a" />
            <rect x="7" y="7" width="2" height="2" fill="#ffffff" />

            {/* Quad Energy Sparks */}
            <rect x="2" y="2" width="1" height="1" fill="#38bdf8" />
            <rect x="13" y="2" width="1" height="1" fill="#38bdf8" />
            <rect x="2" y="13" width="1" height="1" fill="#38bdf8" />
            <rect x="13" y="13" width="1" height="1" fill="#38bdf8" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Pixel Shield Vessel */}
      <div
        className={`relative ${sizeClasses} rounded-xl bg-gradient-to-b ${theme.bgGradient} flex items-center justify-center border-2 transition-transform duration-300 hover:scale-110`}
        style={{
          borderColor: theme.borderColor,
          boxShadow: `0 0 16px ${theme.glowColor}, inset 0 0 10px ${theme.glowColor}`,
        }}
        title={`${title} (Rango ${rankLevel} - ${theme.tier})`}
      >
        {renderShieldSvg()}

        {/* Ambient rank aura pip */}
        <span
          className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900"
          style={{ backgroundColor: theme.borderColor }}
        />
      </div>

      {showLabel && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs sm:text-sm font-bold font-display uppercase ${theme.textColor}`}>
              {title}
            </span>
            <span
              className="text-[8px] font-arcade px-1.5 py-0.5 rounded border tracking-wider"
              style={{
                borderColor: theme.borderColor,
                color: theme.borderColor,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              {theme.tier}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Rango {rankLevel} / 5</span>
        </div>
      )}
    </div>
  );
};
