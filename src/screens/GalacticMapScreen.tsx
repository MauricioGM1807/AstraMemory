/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LevelConfig, SectorConfig, UserProgression } from '../types/game';
import { SECTORS } from '../game/data/levels';
import { Star, Lock, Play, Trophy, Clock, Hash, CheckCircle2, ChevronRight } from 'lucide-react';

interface GalacticMapScreenProps {
  progression: UserProgression;
  onSelectLevel: (level: LevelConfig) => void;
  onBack: () => void;
}

export const GalacticMapScreen: React.FC<GalacticMapScreenProps> = ({
  progression,
  onSelectLevel,
  onBack,
}) => {
  const [activeSectorId, setActiveSectorId] = useState<number>(1);

  // Total stars collected by the player across all levels
  const totalStars = Object.values(progression.levelProgress).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];

  const isLevelUnlocked = (level: LevelConfig, sector: SectorConfig): boolean => {
    // Check sector star prerequisite
    if (totalStars < sector.requiredStars) return false;

    // First level of game or first level of an unlocked sector
    if (level.unlockedByDefault || level.levelNumber === 1) return true;

    // Check if explicitly unlocked in progression
    if (progression.unlockedLevels.includes(level.id)) return true;

    // Or check if the previous level has at least 1 star
    const prevLevelNumber = level.levelNumber - 1;
    const allSectorLevels = SECTORS.flatMap((s) => s.levels);
    const prevLevel = allSectorLevels.find((l) => l.levelNumber === prevLevelNumber);
    if (prevLevel) {
      const prevProgress = progression.levelProgress[prevLevel.id];
      if (prevProgress && prevProgress.stars > 0) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Mapa Galáctico</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Progresa a través de los sectores del cosmos y recolecta estrellas de maestría
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs">
            <Star className="w-4 h-4 fill-amber-300" />
            <span className="font-bold">{totalStars}</span>
            <span className="text-slate-500">/ 48 estrellas</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-medium px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Sector Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {SECTORS.map((sector) => {
          const isSectorUnlocked = totalStars >= sector.requiredStars;
          const isCurrent = sector.id === activeSectorId;

          return (
            <button
              type="button"
              key={sector.id}
              onClick={() => setActiveSectorId(sector.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isCurrent
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-md'
                  : isSectorUnlocked
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">{sector.codename}</span>
                {!isSectorUnlocked && (
                  <span className="flex items-center gap-1 text-rose-400">
                    <Lock className="w-3 h-3" />
                    <span>{sector.requiredStars} ★</span>
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-white truncate">Sector {sector.id}</p>
            </button>
          );
        })}
      </div>

      {/* Active Sector Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <h2 className="text-xl font-bold font-display text-white">{activeSector.name}</h2>
        <p className="text-xs text-slate-400 mt-1">{activeSector.description}</p>
        {totalStars < activeSector.requiredStars && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Requiere {activeSector.requiredStars} estrellas para explorar este sector.</span>
          </div>
        )}
      </div>

      {/* Levels in Sector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeSector.levels.map((level) => {
          const unlocked = isLevelUnlocked(level, activeSector);
          const progress = progression.levelProgress[level.id];
          const stars = progress?.stars || 0;

          return (
            <div
              key={level.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                unlocked
                  ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 shadow-lg'
                  : 'bg-slate-950/50 border-slate-900 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Nivel {level.levelNumber}
                  </span>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white font-display">{level.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{level.description}</p>

                {/* Level parameters specs */}
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[11px] font-mono p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <div>
                    <span className="text-[9px] text-slate-500 block">PAREJAS</span>
                    <span className="text-slate-200">{level.pairsCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">TIEMPO 3★</span>
                    <span className="text-slate-200">&lt;{level.threeStarSeconds}s</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">MOVIM. 3★</span>
                    <span className="text-slate-200">&lt;{level.threeStarMoves}</span>
                  </div>
                </div>

                {/* Best Score Banner if played */}
                {progress && (
                  <div className="mt-2 text-[10px] font-mono text-cyan-300/80 flex items-center justify-between px-1">
                    <span>Mejor marca: {progress.bestScore} pts</span>
                    <span>{progress.bestTimeSeconds}s</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => unlocked && onSelectLevel(level)}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                  unlocked
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {unlocked ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{stars > 0 ? 'Repetir Nivel' : 'Iniciar Nivel'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Bloqueado</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
