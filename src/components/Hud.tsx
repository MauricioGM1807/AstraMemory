/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode, GameState, Player } from '../types/game';
import { Clock, Hash, Zap, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';

interface HudProps {
  mode: GameMode;
  gameState: GameState;
  moves: number;
  movesRemaining?: number;
  elapsedSeconds: number;
  timeRemainingSeconds?: number;
  pairsFound: number;
  totalPairs: number;
  score: number;
  comboStreak: number;
  isMultiplayer: boolean;
  players: Player[];
  activePlayerIndex: number;
  lastMatchedFact?: string;
  memorizeSecondsRemaining?: number;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export const Hud: React.FC<HudProps> = ({
  mode,
  gameState,
  moves,
  movesRemaining,
  elapsedSeconds,
  timeRemainingSeconds,
  pairsFound,
  totalPairs,
  score,
  comboStreak,
  isMultiplayer,
  players,
  activePlayerIndex,
  lastMatchedFact,
  memorizeSecondsRemaining,
  onPause,
  onResume,
  onRestart,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getComboTitle = (streak: number) => {
    if (streak >= 5) return 'SUPERNOVA x5!';
    if (streak >= 4) return 'HIPER x4!';
    if (streak >= 3) return 'RÁFAGA x3!';
    return 'COMBO x2!';
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-1 sm:mb-2 flex flex-col gap-1.5 sm:gap-2 shrink-0 select-none">
      {/* 2-Player Retro Arcade Duel Header */}
      {isMultiplayer && players.length >= 2 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 p-2 rounded-xl bg-slate-900/90 border-2 border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {players.map((p, idx) => {
            const isActive = idx === activePlayerIndex;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-slate-800/90 border-2 shadow-[0_0_15px_rgba(34,211,238,0.35)] scale-[1.01]'
                    : 'bg-slate-950/60 border border-slate-800/60 opacity-60'
                }`}
                style={{ borderColor: isActive ? p.color : 'transparent' }}
              >
                <div className="flex items-center gap-2 truncate">
                  {isActive && (
                    <span className="text-[10px] text-cyan-400 font-arcade animate-pulse">▶</span>
                  )}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.color, boxShadow: isActive ? `0 0 10px ${p.color}` : 'none' }}
                  />
                  <div className="truncate">
                    <p className="font-arcade text-[9px] sm:text-[10px] text-slate-100 uppercase truncate">
                      {p.name}
                    </p>
                    <p className="text-[8px] font-mono text-slate-400">
                      {p.pairsFound} {p.pairsFound === 1 ? 'pareja' : 'parejas'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="font-arcade font-bold text-xs sm:text-sm text-amber-300">
                    {p.score}
                  </span>
                  <span className="text-[8px] font-arcade text-slate-500 block">PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Extreme Memory Preview Bar */}
      {gameState === 'memorizing' && (
        <div className="w-full py-2 px-3 rounded-xl bg-amber-950/60 border-2 border-amber-500/80 text-center animate-pulse flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <p className="text-[9px] sm:text-[10px] font-arcade uppercase tracking-wider text-amber-300">
            [ MEMORIZANDO POSICIONES ]
          </p>
          <span className="text-sm sm:text-base font-bold font-arcade text-amber-200">
            {memorizeSecondsRemaining}S
          </span>
        </div>
      )}

      {/* Main Retro Arcade HUD Strip */}
      <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border-2 border-slate-800/90 shadow-[0_0_20px_rgba(0,0,0,0.6)] text-xs">
        {/* Time */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[8px] font-arcade uppercase text-slate-400 block leading-none mb-1">
              {timeRemainingSeconds !== undefined ? 'TIEMPO' : 'RELOJ'}
            </span>
            <p
              className={`font-arcade text-xs sm:text-sm font-bold leading-none ${
                timeRemainingSeconds !== undefined && timeRemainingSeconds <= 10
                  ? 'text-rose-400 animate-pulse'
                  : 'text-cyan-300'
              }`}
            >
              {timeRemainingSeconds !== undefined ? formatTime(timeRemainingSeconds) : formatTime(elapsedSeconds)}
            </p>
          </div>
        </div>

        {/* Moves */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-950/80 border border-violet-500/30 text-violet-400">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[8px] font-arcade uppercase text-slate-400 block leading-none mb-1">
              {movesRemaining !== undefined ? 'RESTAN' : 'GIROS'}
            </span>
            <p
              className={`font-arcade text-xs sm:text-sm font-bold leading-none ${
                movesRemaining !== undefined && movesRemaining <= 3
                  ? 'text-rose-400 animate-pulse'
                  : 'text-violet-300'
              }`}
            >
              {movesRemaining !== undefined ? movesRemaining : moves}
            </p>
          </div>
        </div>

        {/* Pairs */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[8px] font-arcade uppercase text-slate-400 block leading-none mb-1">
              PAREJAS
            </span>
            <p className="font-arcade text-xs sm:text-sm font-bold text-emerald-300 leading-none">
              {pairsFound}/{totalPairs}
            </p>
          </div>
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[8px] font-arcade uppercase text-slate-400 block leading-none">PUNTOS</span>
              {comboStreak > 1 && (
                <span className="text-[7px] font-arcade text-amber-200 bg-amber-950 px-1 py-0.5 rounded border border-amber-500 animate-bounce">
                  {getComboTitle(comboStreak)}
                </span>
              )}
            </div>
            <p className="font-arcade text-xs sm:text-sm font-bold text-amber-300 leading-none">
              {score}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {gameState === 'playing' ? (
            <button
              type="button"
              onClick={onPause}
              aria-label="Pausar partida"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : gameState === 'paused' ? (
            <button
              type="button"
              onClick={onResume}
              aria-label="Reanudar partida"
              className="p-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={onRestart}
            aria-label="Reiniciar tablero"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Retro Space Curiosity Terminal Log */}
      {lastMatchedFact && (
        <div className="w-full px-3 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-[10px] sm:text-[11px] text-cyan-300 flex items-center gap-2 animate-fadeIn shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          <span className="text-[8px] font-arcade px-1 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
            DATO
          </span>
          <p className="truncate font-mono">{lastMatchedFact}</p>
        </div>
      )}
    </div>
  );
};
