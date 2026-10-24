/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardIconProps {
  iconType: string;
  accentColor: string;
  secondaryColor?: string;
  size?: number;
  className?: string;
}

export const CardIcon: React.FC<CardIconProps> = ({
  iconType,
  accentColor,
  secondaryColor = '#38bdf8',
  size = 48,
  className = '',
}) => {
  // Rich retro-arcade & pixel-art inspired SVG graphics for each space entity
  const renderGraphic = () => {
    switch (iconType) {
      case 'sun':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_12px_#f59e0b]">
            <circle cx="32" cy="32" r="18" fill="url(#sun-grad)" />
            <circle cx="32" cy="32" r="22" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" className="animate-spin [animation-duration:12s]" />
            {/* Retro pixel flares */}
            <rect x="30" y="4" width="4" height="6" fill="#fbbf24" rx="1" />
            <rect x="30" y="54" width="4" height="6" fill="#fbbf24" rx="1" />
            <rect x="4" y="30" width="6" height="4" fill="#fbbf24" rx="1" />
            <rect x="54" y="30" width="6" height="4" fill="#fbbf24" rx="1" />
            <rect x="12" y="12" width="5" height="5" fill="#f97316" rx="1" />
            <rect x="47" y="12" width="5" height="5" fill="#f97316" rx="1" />
            <rect x="12" y="47" width="5" height="5" fill="#f97316" rx="1" />
            <rect x="47" y="47" width="5" height="5" fill="#f97316" rx="1" />
            <defs>
              <radialGradient id="sun-grad">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
            </defs>
          </svg>
        );

      case 'globe': // Earth
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#38bdf8]">
            <circle cx="32" cy="32" r="20" fill="#0284c7" />
            {/* Continents pixel-style patches */}
            <path d="M22 20 Q28 18 34 22 Q38 28 32 32 Q26 30 22 24 Z" fill="#10b981" />
            <path d="M26 38 Q32 34 38 38 Q42 46 36 48 Q30 46 26 38 Z" fill="#10b981" />
            <path d="M40 22 Q46 20 48 26 Q46 30 42 28 Z" fill="#10b981" />
            {/* Atmospheric cloud swirls */}
            <path d="M18 28 Q28 30 46 26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.65" fill="none" />
            <path d="M20 36 Q34 38 48 34" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />
            <circle cx="32" cy="32" r="21" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
          </svg>
        );

      case 'mountain': // Mars
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#ef4444]">
            <circle cx="32" cy="32" r="19" fill="url(#mars-grad)" />
            {/* Polar cap */}
            <ellipse cx="32" cy="14" rx="7" ry="2.5" fill="#ffffff" opacity="0.9" />
            {/* Crater & canyon details */}
            <circle cx="26" cy="28" r="4" fill="#991b1b" opacity="0.6" />
            <path d="M22 36 Q34 40 44 34" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="42" cy="24" r="2.5" fill="#991b1b" opacity="0.5" />
            <circle cx="32" cy="32" r="20" fill="none" stroke="#f87171" strokeWidth="1.2" opacity="0.7" />
            <defs>
              <radialGradient id="mars-grad">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="70%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
            </defs>
          </svg>
        );

      case 'disc': // Jupiter
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_12px_#eab308]">
            <circle cx="32" cy="32" r="21" fill="#ca8a04" />
            {/* Banded storm lines */}
            <path d="M12 24 Q32 26 52 24" stroke="#78350f" strokeWidth="3" fill="none" />
            <path d="M11 30 Q32 32 53 30" stroke="#fef08a" strokeWidth="2.5" fill="none" />
            <path d="M12 36 Q32 38 52 36" stroke="#92400e" strokeWidth="3" fill="none" />
            {/* Great Red Spot */}
            <ellipse cx="40" cy="38" rx="5" ry="3.5" fill="#dc2626" />
            <circle cx="32" cy="32" r="22" fill="none" stroke="#eab308" strokeWidth="1.5" opacity="0.8" />
          </svg>
        );

      case 'circle-dashed': // Saturn with Rings
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_12px_#fde047]">
            {/* Planet Body */}
            <circle cx="32" cy="32" r="14" fill="#d97706" />
            <path d="M19 32 Q32 34 45 32" stroke="#fef3c7" strokeWidth="1.5" fill="none" />
            {/* Spectacular Planetary Ring */}
            <ellipse
              cx="32"
              cy="32"
              rx="28"
              ry="9"
              fill="none"
              stroke="#fde047"
              strokeWidth="3.5"
              transform="rotate(-20 32 32)"
              opacity="0.9"
            />
            <ellipse
              cx="32"
              cy="32"
              rx="24"
              ry="7"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              transform="rotate(-20 32 32)"
              opacity="0.75"
            />
          </svg>
        );

      case 'moon': // Luna
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#e2e8f0]">
            <path
              d="M38 12 A 20 20 0 1 0 52 38 A 16 16 0 0 1 38 12 Z"
              fill="url(#moon-grad)"
            />
            <circle cx="28" cy="34" r="3" fill="#64748b" opacity="0.6" />
            <circle cx="34" cy="42" r="2" fill="#64748b" opacity="0.6" />
            <circle cx="24" cy="24" r="2" fill="#64748b" opacity="0.5" />
            <defs>
              <radialGradient id="moon-grad">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="80%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </radialGradient>
            </defs>
          </svg>
        );

      case 'circle': // Black Hole
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_14px_#c084fc]">
            {/* Accretion Vortex */}
            <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="#a855f7" strokeWidth="3" transform="rotate(-15 32 32)" />
            <ellipse cx="32" cy="32" rx="24" ry="7" fill="none" stroke="#ec4899" strokeWidth="2" transform="rotate(-15 32 32)" opacity="0.8" />
            {/* Event Horizon (Pure Black Center) */}
            <circle cx="32" cy="32" r="13" fill="#02040a" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="8" fill="#000000" />
            <circle cx="30" cy="29" r="1.5" fill="#ffffff" opacity="0.8" />
          </svg>
        );

      case 'sparkles': // Supernova
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_14px_#f43f5e]">
            {/* 8-Point Starburst blast */}
            <path
              d="M32 4 L37 26 L59 32 L37 38 L32 60 L27 38 L5 32 L27 26 Z"
              fill="url(#supernova-grad)"
            />
            <circle cx="32" cy="32" r="6" fill="#ffffff" />
            <circle cx="32" cy="32" r="18" fill="none" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="3 3" />
            <defs>
              <radialGradient id="supernova-grad">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </radialGradient>
            </defs>
          </svg>
        );

      case 'satellite': // ISS / Station
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#06b6d4]">
            {/* Central module */}
            <rect x="28" y="24" width="8" height="16" fill="#f8fafc" stroke="#64748b" strokeWidth="1" rx="2" />
            {/* Solar Panels Left */}
            <rect x="6" y="20" width="18" height="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <line x1="12" y1="20" x2="12" y2="30" stroke="#bae6fd" strokeWidth="0.8" />
            <line x1="18" y1="20" x2="18" y2="30" stroke="#bae6fd" strokeWidth="0.8" />
            <rect x="6" y="34" width="18" height="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <line x1="12" y1="34" x2="12" y2="44" stroke="#bae6fd" strokeWidth="0.8" />
            <line x1="18" y1="34" x2="18" y2="44" stroke="#bae6fd" strokeWidth="0.8" />
            {/* Solar Panels Right */}
            <rect x="40" y="20" width="18" height="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <line x1="46" y1="20" x2="46" y2="30" stroke="#bae6fd" strokeWidth="0.8" />
            <line x1="52" y1="20" x2="52" y2="30" stroke="#bae6fd" strokeWidth="0.8" />
            <rect x="40" y="34" width="18" height="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <line x1="46" y1="34" x2="46" y2="44" stroke="#bae6fd" strokeWidth="0.8" />
            <line x1="52" y1="34" x2="52" y2="44" stroke="#bae6fd" strokeWidth="0.8" />
            {/* Truss Bar */}
            <line x1="4" y1="32" x2="60" y2="32" stroke="#e2e8f0" strokeWidth="2" />
          </svg>
        );

      case 'hexagon': // JWST Mirror
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_12px_#eab308]">
            {/* Gold Hexagonal Beryllium Mirror Mosaic */}
            <polygon points="32,8 52,19 52,43 32,54 12,43 12,19" fill="#ca8a04" stroke="#facc15" strokeWidth="2.5" />
            <polygon points="32,16 44,23 44,39 32,46 20,39 20,23" fill="#eab308" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="32" cy="31" r="4" fill="#713f12" />
          </svg>
        );

      case 'radio': // Voyager 1
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#a855f7]">
            {/* High gain dish */}
            <ellipse cx="26" cy="32" rx="6" ry="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="26" y1="32" x2="46" y2="32" stroke="#cbd5e1" strokeWidth="2.5" />
            <rect x="42" y="27" width="10" height="10" fill="#a855f7" rx="2" />
            {/* Sensor boom */}
            <line x1="46" y1="32" x2="58" y2="18" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Radio waves */}
            <path d="M16 22 Q10 32 16 42" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M10 16 Q2 32 10 48" stroke="#c084fc" strokeWidth="1.5" fill="none" opacity="0.5" />
          </svg>
        );

      case 'rocket': // Apollo Lander / Ship
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#38bdf8]">
            {/* Rocket fuselage */}
            <path d="M32 8 C38 18 42 34 40 46 L24 46 C22 34 26 18 32 8 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Cockpit window */}
            <circle cx="32" cy="24" r="4" fill="#38bdf8" />
            {/* Fins */}
            <path d="M24 40 L16 50 L24 48 Z" fill="#ef4444" />
            <path d="M40 40 L48 50 L40 48 Z" fill="#ef4444" />
            {/* Exhaust fire */}
            <path d="M27 48 Q32 60 37 48 Z" fill="#f59e0b" className="animate-pulse" />
          </svg>
        );

      case 'zap': // Pulsar
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_12px_#06b6d4]">
            {/* Rotating magnetic beams */}
            <line x1="10" y1="10" x2="54" y2="54" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
            <line x1="10" y1="10" x2="54" y2="54" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Core neutron star */}
            <circle cx="32" cy="32" r="10" fill="#0891b2" stroke="#67e8f9" strokeWidth="2" />
            <circle cx="32" cy="32" r="5" fill="#ffffff" />
          </svg>
        );

      case 'cpu': // Warp Core
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_12px_#22d3ee]">
            {/* Reaction Chamber */}
            <rect x="20" y="10" width="24" height="44" rx="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
            {/* Magnetic constrictor rings */}
            <line x1="18" y1="20" x2="46" y2="20" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="18" y1="32" x2="46" y2="32" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="18" y1="44" x2="46" y2="44" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Pulsing Matter-Antimatter Stream */}
            <line x1="32" y1="12" x2="32" y2="52" stroke="#ffffff" strokeWidth="3" className="animate-pulse" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_0_10px_#38bdf8]">
            <polygon points="32,6 39,24 58,24 43,36 49,54 32,43 15,54 21,36 6,24 25,24" fill={accentColor} stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {renderGraphic()}
    </div>
  );
};
