/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType } from '../components/Header';
import { SavedGameData, UserProgression, UserStatistics } from '../types/game';
import { calculatePilotRank } from '../game/data/achievements';
import { PixelLogo } from '../components/PixelLogo';
import { RankBadge } from '../components/RankBadge';
import { soundManager } from '../game/engine/sound';
import {
  RotateCcw,
  Map,
  Layers,
  Users,
  BookOpen,
  Award,
  BarChart3,
  Sparkles,
  Star,
  ChevronRight,
  Edit3,
  Check,
  Gamepad2,
} from 'lucide-react';

interface HomeScreenProps {
  progression: UserProgression;
  statistics: UserStatistics;
  savedGame: SavedGameData | null;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onOpenSplash: () => void;
  onNavigate: (screen: ScreenType) => void;
  onResumeSavedGame: () => void;
  onStartCampaign: () => void;
  onOpenTwoPlayer: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progression,
  statistics,
  savedGame,
  playerName,
  onUpdatePlayerName,
  onOpenSplash,
  onNavigate,
  onResumeSavedGame,
  onStartCampaign,
  onOpenTwoPlayer,
}) => {
  const rank = calculatePilotRank(progression.xp);
  const totalStars = Object.values(progression.levelProgress).reduce((acc, lvl) => acc + lvl.stars, 0);

  // Inline pilot name editor state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(playerName || 'COMANDANTE NOVA');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Calculate XP progress bar percentage to next level
  const xpInCurrentLevel = progression.xp - rank.currentLevelXp;
  const xpNeededForNext = rank.nextLevelXp - rank.currentLevelXp;
  const xpPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)));

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameValue.trim() || 'COMANDANTE NOVA';
    setNameValue(trimmed);
    onUpdatePlayerName(trimmed);
    setIsEditingName(false);
    setSavedFeedback(true);
    soundManager.playUiClick();
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 flex flex-col items-center">
      {/* Pilot Hologram Status Card - Displays Pilot Rank Badge & Customizable Callsign */}
      <div className="w-full mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Authentic Pixel-Art Rank Shield */}
          <div className="shrink-0">
            <RankBadge level={rank.level} title={rank.title} size="md" />
          </div>

          <div className="text-left flex-1 min-w-0">
            {/* Pilot Callsign with Inline Editing */}
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={20}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-slate-950 border border-cyan-400 text-white focus:outline-none w-36"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                  title="Guardar nombre"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300 truncate max-w-[140px] sm:max-w-[180px]">
                  {playerName || nameValue}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                  title="Editar nombre de piloto"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                {savedFeedback && (
                  <span className="text-[10px] font-mono text-emerald-400 animate-fadeIn">
                    ✓ Guardado
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold text-slate-300">{rank.title}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Nvl {rank.level}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
              <span>{progression.xp} XP</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3 h-3 fill-amber-300" />
                {totalStars} ★
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full sm:w-56 flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between text-slate-400 font-mono">
            <span>Siguiente Rango</span>
            <span>{xpPercent}%</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Title & Hero Branding with Pixel Art Logo */}
      <div className="text-center mb-4 sm:mb-6 flex flex-col items-center max-w-xl">
        <div className="mb-3">
          <PixelLogo size="lg" showSubtitle={true} className="justify-center" />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Explora sectores galácticos, supera pruebas de memoria y compite en duelos tácticos para 2 jugadores en pantalla completa.
        </p>
      </div>

      {/* Continue Active Game Banner (If exists) */}
      {savedGame && (
        <div className="w-full max-w-lg mb-4 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/50 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="text-left">
            <p className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase">
              Misión en Pausa
            </p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              {savedGame.mode === 'two_players' ? 'Duelo 2 Jugadores' : 'Partida en Curso'}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
              {savedGame.matchedPairIds.length} / {savedGame.initialPairsCount} parejas encontradas
            </p>
          </div>
          <button
            type="button"
            onClick={onResumeSavedGame}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Continuar</span>
          </button>
        </div>
      )}

      {/* Primary Action Grid */}
      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        {/* Campaign / Map */}
        <button
          type="button"
          onClick={onStartCampaign}
          className="group p-3 sm:p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 transition-all text-left flex items-center justify-between shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Mapa Galáctico</p>
              <p className="text-[10px] sm:text-xs text-slate-400">4 sectores estelares</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
        </button>

        {/* 2-Player Local Duel */}
        <button
          type="button"
          onClick={onOpenTwoPlayer}
          className="group p-3 sm:p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-500/50 transition-all text-left flex items-center justify-between shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Duelo 2 Jugadores</p>
              <p className="text-[10px] sm:text-xs text-slate-400">En el mismo dispositivo</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
        </button>

        {/* Arcade Modes */}
        <button
          type="button"
          onClick={() => onNavigate('modes')}
          className="group p-3 sm:p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-violet-500/50 transition-all text-left flex items-center justify-between shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Modos Arcade</p>
              <p className="text-[10px] sm:text-xs text-slate-400">Contrarreloj, Extremo y Diario</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
        </button>

        {/* Tutorial */}
        <button
          type="button"
          onClick={() => onNavigate('tutorial')}
          className="group p-3 sm:p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Tutorial y Tácticas</p>
              <p className="text-[10px] sm:text-xs text-slate-400">Simulador y reglas</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>

      {/* Secondary Quick Navigation Bar & Retro Splash Screen Launcher */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap justify-center">
        <button
          type="button"
          onClick={onOpenSplash}
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5 text-[11px] sm:text-xs cursor-pointer"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Intro Arcade</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('stats')}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 text-[11px] sm:text-xs cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Estadísticas</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('achievements')}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 text-[11px] sm:text-xs cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Logros</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('themes')}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 text-[11px] sm:text-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Temas</span>
        </button>
      </div>
    </div>
  );
};
