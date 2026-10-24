/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProgression } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../game/data/achievements';
import { Award, CheckCircle2, Lock, Star, Zap } from 'lucide-react';

interface AchievementsScreenProps {
  progression: UserProgression;
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  progression,
  onBack,
}) => {
  const achievements = INITIAL_ACHIEVEMENTS.map((ach) => {
    const userAch = progression.achievements[ach.id];
    const isUnlocked = userAch?.unlocked || false;
    const progress = userAch?.progress || 0;
    const unlockedAt = userAch?.unlockedAt;

    return {
      ...ach,
      unlocked: isUnlocked,
      progress: Math.min(ach.maxProgress, Math.max(0, progress)),
      unlockedAt,
    };
  });

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Logros y Condecoraciones</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supera hitos extraordinarios para forjar tu reputación como piloto espacial
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs">
            <Award className="w-4 h-4" />
            <span className="font-bold">{totalUnlocked}</span>
            <span className="text-slate-500">/ {achievements.length} desbloqueados</span>
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

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                        ach.unlocked
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
                      }`}
                    >
                      {ach.unlocked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-white font-display">{ach.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
                    </div>
                  </div>

                  <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{ach.unlocked ? 'Completado' : 'Progreso'}</span>
                  <span>
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      ach.unlocked ? 'bg-emerald-400' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {ach.unlockedAt && (
                  <p className="text-[9px] font-mono text-slate-500 mt-1.5 text-right">
                    Conseguido el {new Date(ach.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
