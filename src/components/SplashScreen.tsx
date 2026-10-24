/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PixelLogo } from './PixelLogo';
import { soundManager } from '../game/engine/sound';
import { Play, Sparkles, Check, User, Volume2, Shield } from 'lucide-react';

interface SplashScreenProps {
  initialPlayerName: string;
  onSavePlayerName: (name: string) => void;
  onStartGame: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  initialPlayerName,
  onSavePlayerName,
  onStartGame,
}) => {
  const [name, setName] = useState(initialPlayerName || 'COMANDANTE NOVA');
  const [isSaved, setIsSaved] = useState(false);

  const presets = [
    'COMANDANTE NOVA',
    'PILOTO ORIÓN',
    'AS CÓSMICO',
    'VALKYRIE-7',
    'ZERO-G',
    'ASTRO PHOENIX',
  ];

  const handleNameChange = (newName: string) => {
    setName(newName);
    setIsSaved(false);
  };

  const handleSaveName = () => {
    const trimmed = name.trim() || 'COMANDANTE NOVA';
    setName(trimmed);
    onSavePlayerName(trimmed);
    setIsSaved(true);
    soundManager.playUiClick();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleInsertCoin = () => {
    soundManager.playCoinInsert();
    // Auto-save name if modified
    if (name.trim()) {
      onSavePlayerName(name.trim());
    }
    // Transition smoothly after coin chime
    setTimeout(() => {
      onStartGame();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950 overflow-y-auto">
      {/* Retro Arcade Scanline Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40 z-20" />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Arcade Bezel Frame */}
      <div className="relative z-30 w-full max-w-lg rounded-2xl sm:rounded-3xl bg-slate-900/90 border-2 border-cyan-500/50 p-4 sm:p-8 flex flex-col items-center text-center shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-xl">
        {/* Pixel Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Arcade Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-arcade text-cyan-300 tracking-wider mb-4 animate-pulse">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>ARCADE STATION 1984 · 2026 EDITION</span>
        </div>

        {/* Large Pixel Logo */}
        <div className="mb-6">
          <PixelLogo size="lg" showSubtitle={true} className="justify-center" />
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
          Pon a prueba tu agilidad mental y memoria estelar en solitario o desafía a un rival en duelo local.
        </p>

        {/* Pilot Name Customizer */}
        <div className="w-full mb-6 p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-arcade text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Identificación de Piloto</span>
            </label>
            {isSaved && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Guardado</span>
              </span>
            )}
          </div>

          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              maxLength={22}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Tu nombre de piloto..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={handleSaveName}
              className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition-colors"
            >
              Guardar
            </button>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[9px] font-mono text-slate-400 mr-1 self-center">Sugerencias:</span>
            {presets.slice(0, 4).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  handleNameChange(p);
                  onSavePlayerName(p);
                  setIsSaved(true);
                  soundManager.playUiClick();
                  setTimeout(() => setIsSaved(false), 1500);
                }}
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Arcade "INSERT COIN" / "PRESS START" Action */}
        <button
          type="button"
          onClick={handleInsertCoin}
          className="group relative w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-arcade text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
        >
          {/* Animated Coin Indicator */}
          <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-300 shadow-inner animate-bounce">
            $
          </span>
          <span className="drop-shadow-sm font-bold">INSERT COIN · PRESS START</span>
          <Play className="w-4 h-4 fill-slate-950" />
        </button>

        {/* Bottom Credits & Quick Tip */}
        <div className="mt-4 flex items-center justify-between w-full text-[9px] font-mono text-slate-400">
          <span>CREDIT 01 · READY</span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Volume2 className="w-3 h-3" />
            <span>Sonido 16-Bit Activo</span>
          </span>
        </div>
      </div>
    </div>
  );
};
