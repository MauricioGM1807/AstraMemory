/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Settings, Menu, X, Compass, Map, BarChart3, Award, Home } from 'lucide-react';
import { PixelLogo } from './PixelLogo';

export type ScreenType = 
  | 'home'
  | 'modes'
  | 'map'
  | 'game'
  | 'stats'
  | 'achievements'
  | 'themes'
  | 'tutorial'
  | 'settings';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-3 sm:px-6 py-2 sm:py-2.5">
        {/* Zone 1: Pixel Art Arcade Brand Mark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="hover:scale-105 transition-transform shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
        >
          <PixelLogo size="sm" />
        </button>

        {/* Zone 2: 4-5 clean single-line navigation links (Desktop) */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-400"
        >
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap shrink-0 py-0.5 border-b-2 ${
              currentScreen === 'home'
                ? 'text-cyan-300 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('modes')}
            className={`transition-colors whitespace-nowrap shrink-0 py-0.5 border-b-2 ${
              currentScreen === 'modes'
                ? 'text-cyan-300 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Modos
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('map')}
            className={`transition-colors whitespace-nowrap shrink-0 py-0.5 border-b-2 ${
              currentScreen === 'map'
                ? 'text-cyan-300 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Galaxia
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('stats')}
            className={`transition-colors whitespace-nowrap shrink-0 py-0.5 border-b-2 ${
              currentScreen === 'stats'
                ? 'text-cyan-300 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Estadísticas
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('achievements')}
            className={`transition-colors whitespace-nowrap shrink-0 py-0.5 border-b-2 ${
              currentScreen === 'achievements'
                ? 'text-cyan-300 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Logros
          </button>
        </nav>

        {/* Zone 3: Quick Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            aria-label="Ajustes de juego"
            className="p-1.5 sm:p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 py-3 grid grid-cols-2 gap-2 text-xs font-medium animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>Inicio</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('modes')}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            <Compass className="w-4 h-4 text-violet-400" />
            <span>Modos Arcade</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('map')}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            <Map className="w-4 h-4 text-emerald-400" />
            <span>Galaxia</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('stats')}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Estadísticas</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('achievements')}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 col-span-2"
          >
            <Award className="w-4 h-4 text-rose-400" />
            <span>Logros y Condecoraciones</span>
          </button>
        </div>
      )}
    </header>
  );
};
