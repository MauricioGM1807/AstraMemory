/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserStatistics } from '../types/game';
import { BarChart3, Trophy, Flame, Clock, Hash, Sparkles, Users, Award } from 'lucide-react';

interface StatsScreenProps {
  statistics: UserStatistics;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ statistics, onBack }) => {
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const modeLabels: Record<string, string> = {
    classic: 'Clásico',
    time_attack: 'Contrarreloj',
    moves_limit: 'Movimientos',
    daily_challenge: 'Desafío Diario',
    extreme_memory: 'Memoria Extrema',
    two_players: 'Duelo 2 Jugadores',
  };

  const winRate =
    statistics.gamesCompleted > 0
      ? Math.round((statistics.gamesWon / statistics.gamesCompleted) * 100)
      : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Estadísticas y Récords</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historial de misiones y rendimiento cognitivo en este dispositivo
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          Volver
        </button>
      </div>

      {/* Global Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase">Partidas Jugadas</span>
            <Trophy className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{statistics.gamesCompleted}</p>
          <p className="text-[11px] text-slate-500 mt-1">{statistics.gamesWon} victorias ({winRate}%)</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase">Racha de Victorias</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-300">{statistics.currentWinStreak}</p>
          <p className="text-[11px] text-slate-500 mt-1">Máxima racha: {statistics.highestWinStreak}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase">Tiempo Total</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-white">
            {formatTime(statistics.totalTimePlayedSeconds)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{statistics.totalMoves} movimientos totales</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase">Parejas Encontradas</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-300">{statistics.totalPairsFound}</p>
          <p className="text-[11px] text-slate-500 mt-1">Símbolos espaciales</p>
        </div>
      </div>

      {/* Mode by Mode Breakdown & 2-Player Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Solo Modes Breakdown (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h2 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Rendimiento por Modo Solitario</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(statistics.modeStats)
              .filter(([mode]) => mode !== 'two_players')
              .map(([mode, data]) => (
                <div
                  key={mode}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{modeLabels[mode] || mode}</span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {data.won} vic / {data.started} part
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-1">
                    <span>Mejor Puntuación:</span>
                    <span className="text-white font-bold">{data.bestScore} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-0.5">
                    <span>Mejor Tiempo:</span>
                    <span className="text-slate-300">{data.bestTimeSeconds > 0 ? `${data.bestTimeSeconds}s` : '--'}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 2-Player Local Duel Summary (1 col) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 via-slate-900 to-indigo-950/20 border border-rose-500/30 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Historial Duelo 2 Jugadores</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Enfrentamientos locales cara a cara en el mismo terminal.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Victorias Jugador 1</span>
                <span className="text-lg font-bold font-mono text-white">{statistics.twoPlayerStats.p1Wins}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">Victorias Jugador 2</span>
                <span className="text-lg font-bold font-mono text-white">{statistics.twoPlayerStats.p2Wins}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Empates</span>
                <span className="text-lg font-bold font-mono text-white">{statistics.twoPlayerStats.ties}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono text-center">
            {statistics.twoPlayerStats.totalMatches} duelos completados
          </div>
        </div>
      </div>

      {/* Recent Matches Log */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-base font-bold text-white font-display mb-3">Historial de Misiones Recientes</h2>
        {statistics.recentMatches.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            Aún no has registrado ninguna misión. ¡Inicia una partida clásica o un duelo para construir tu historial!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-mono text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Modo</th>
                  <th className="py-2 px-3">Resultado</th>
                  <th className="py-2 px-3">Puntuación</th>
                  <th className="py-2 px-3">Movimientos</th>
                  <th className="py-2 px-3">Tiempo</th>
                  <th className="py-2 px-3">Precisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {statistics.recentMatches.slice(0, 8).map((match) => (
                  <tr key={match.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-slate-200">
                      {modeLabels[match.mode] || match.mode}
                    </td>
                    <td className="py-2 px-3">
                      {match.victory ? (
                        <span className="text-emerald-400 font-bold">Victoria</span>
                      ) : (
                        <span className="text-rose-400 font-bold">Derrota</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-cyan-300 font-bold">{match.score}</td>
                    <td className="py-2 px-3 text-slate-400">{match.moves}</td>
                    <td className="py-2 px-3 text-slate-400">{match.timeSeconds}s</td>
                    <td className="py-2 px-3 text-slate-400">{match.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
