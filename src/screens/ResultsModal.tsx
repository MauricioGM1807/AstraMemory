/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode, Player } from '../types/game';
import { Trophy, RotateCcw, ArrowRight, Map, Star, Clock, Hash, Zap, Award, Users } from 'lucide-react';

interface ResultsModalProps {
  victory: boolean;
  defeatReason?: 'time_up' | 'moves_exhausted';
  mode: GameMode;
  levelName?: string;
  score: number;
  moves: number;
  elapsedSeconds: number;
  timeRemainingSeconds?: number;
  pairsFound: number;
  totalPairs: number;
  starsEarned: number;
  xpEarned: number;
  isPersonalBest: boolean;
  unlockedAchievements: string[];
  isMultiplayer: boolean;
  players: Player[];
  hasNextLevel: boolean;
  onReplay: () => void;
  onNextLevel?: () => void;
  onGoToMap: () => void;
  onGoHome: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  victory,
  defeatReason,
  mode,
  levelName,
  score,
  moves,
  elapsedSeconds,
  timeRemainingSeconds,
  pairsFound,
  totalPairs,
  starsEarned,
  xpEarned,
  isPersonalBest,
  unlockedAchievements,
  isMultiplayer,
  players,
  hasNextLevel,
  onReplay,
  onNextLevel,
  onGoToMap,
  onGoHome,
}) => {
  const accuracy = moves > 0 ? Math.min(100, Math.round((totalPairs / moves) * 100)) : 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine 2-player outcome
  const getMultiplayerOutcome = () => {
    if (!isMultiplayer || players.length < 2) return null;
    const p1 = players[0];
    const p2 = players[1];
    if (p1.score > p2.score) {
      return { winner: p1, isTie: false };
    } else if (p2.score > p1.score) {
      return { winner: p2, isTie: false };
    }
    return { winner: null, isTie: true };
  };

  const mpResult = getMultiplayerOutcome();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Top Trophy Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${
            victory
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.2)]'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.2)]'
          }`}
        >
          {isMultiplayer ? (
            <Users className="w-8 h-8" />
          ) : victory ? (
            <Trophy className="w-8 h-8" />
          ) : (
            <Clock className="w-8 h-8" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold font-display text-white">
          {isMultiplayer
            ? mpResult?.isTie
              ? '¡Empate Cósmico!'
              : `¡Victoria de ${mpResult?.winner?.name}!`
            : victory
            ? '¡Misión Cumplida!'
            : defeatReason === 'time_up'
            ? 'Tiempo Agotado'
            : 'Movimientos Agotados'}
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          {levelName || (mode === 'daily_challenge' ? 'Desafío Diario' : 'Partida Arcade')}
        </p>

        {/* Personal Best Tag */}
        {isPersonalBest && victory && (
          <div className="mt-2 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse">
            ★ ¡Nuevo Récord Personal! ★
          </div>
        )}

        {/* Star Rating for Single Player */}
        {!isMultiplayer && (
          <div className="flex items-center gap-2 my-4">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-7 h-7 transition-all ${
                  starIdx <= starsEarned
                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* 2-Player Scoreboard Breakdown */}
        {isMultiplayer && players.length >= 2 && (
          <div className="w-full my-4 grid grid-cols-2 gap-3">
            {players.map((p) => {
              const isWinner = mpResult?.winner?.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex flex-col items-center ${
                    isWinner
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-200">{p.name}</p>
                  <p className="text-xl font-bold font-mono text-white mt-1">{p.score} pts</p>
                  <p className="text-[10px] text-slate-400">{p.pairsFound} parejas encontradas</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Metrics Strip */}
        <div className="w-full my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-mono">Puntos</p>
            <p className="text-base font-bold font-mono text-cyan-300">{score}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-mono">Tiempo</p>
            <p className="text-base font-bold font-mono text-slate-200">{formatTime(elapsedSeconds)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-mono">Precisión</p>
            <p className="text-base font-bold font-mono text-emerald-300">{accuracy}%</p>
          </div>
        </div>

        {/* XP Gained Strip */}
        {xpEarned > 0 && (
          <div className="w-full py-2 px-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-indigo-200 text-xs flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Experiencia adquirida:</span>
            </span>
            <span className="font-bold font-mono text-indigo-300">+{xpEarned} XP</span>
          </div>
        )}

        {/* Newly Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="w-full p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs mb-4 text-left">
            <p className="font-bold flex items-center gap-1 text-[11px] mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>¡Logro Desbloqueado!</span>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-300/80">
              {unlockedAchievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {victory && hasNextLevel && onNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <span>Siguiente Nivel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={onReplay}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isMultiplayer ? 'Revancha' : 'Reintentar'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToMap}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Mapa Galáctico</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Volver al Menú Principal
          </button>
        </div>
      </div>
    </div>
  );
};
