/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserPreferences, UserProgression } from '../types/game';
import { Sparkles, Check, Palette } from 'lucide-react';

interface ThemesScreenProps {
  preferences: UserPreferences;
  progression: UserProgression;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onBack: () => void;
}

export const ThemesScreen: React.FC<ThemesScreenProps> = ({
  preferences,
  progression,
  onUpdatePreferences,
  onBack,
}) => {
  const cardBacks = [
    {
      id: 'holo_hex' as const,
      name: 'Holo-Hexágono',
      description: 'Diseño estándar de la academia de cadetes espaciales en cyan cuántico.',
      unlocked: true,
      color: '#38bdf8',
    },
    {
      id: 'plasma_core' as const,
      name: 'Núcleo de Plasma',
      description: 'Patrón reactivo violeta inspirado en los reactores de fusión de cruceros estelares.',
      unlocked: progression.xp >= 400,
      req: 'Requiere 400 XP (Nivel 2)',
      color: '#a855f7',
    },
    {
      id: 'cosmic_seal' as const,
      name: 'Sello Cósmico',
      description: 'Filigrana geométrica dorada forjada en honor a los pioneros interplanetarios.',
      unlocked: progression.xp >= 1200,
      req: 'Requiere 1,200 XP (Nivel 3)',
      color: '#f59e0b',
    },
    {
      id: 'quantum_matrix' as const,
      name: 'Matriz Cuántica',
      description: 'Celosía de nodos esmeralda con entrelazamiento cuántico visual.',
      unlocked: progression.xp >= 2500,
      req: 'Requiere 2,500 XP (Nivel 4)',
      color: '#10b981',
    },
  ];

  const symbolThemes = [
    {
      id: 'celestial' as const,
      name: 'Cuerpos Celestes y Planetas',
      desc: 'Sol, planetas del sistema solar, lunas y gigantes gaseosos.',
    },
    {
      id: 'stations' as const,
      name: 'Estaciones y Naves Espaciales',
      desc: 'ISS, James Webb, telescopio Hubble, rover Curiosity, sondas Voyager.',
    },
    {
      id: 'constellations' as const,
      name: 'Astrofísica y Constelaciones',
      desc: 'Agujeros negros, supernovas, púlsares, galaxias espirales y agujeros de gusano.',
    },
    {
      id: 'artifacts' as const,
      name: 'Megaestructuras y Artefactos',
      desc: 'Esferas de Dyson, propulsores de curvatura warp, balizas cuánticas.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Personalización Visual</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personaliza el reverso de tus cartas y el catálogo de símbolos según tu rango de piloto
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

      {/* Card Back Themes Selection */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Diseño de Reversos de Cartas</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Selecciona el estilo holográfico del reverso de las cartas para tus partidas
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {cardBacks.map((theme) => {
            const isSelected = preferences.cardBackTheme === theme.id;

            return (
              <button
                type="button"
                key={theme.id}
                disabled={!theme.unlocked}
                onClick={() => theme.unlocked && onUpdatePreferences({ cardBackTheme: theme.id })}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                    : theme.unlocked
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.color, boxShadow: `0 0 8px ${theme.color}` }}
                    />
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                        <Check className="w-3 h-3" />
                        Activo
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{theme.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{theme.description}</p>
                </div>

                {!theme.unlocked && (
                  <p className="text-[10px] font-mono text-rose-400/90 mt-3 pt-2 border-t border-slate-800/80">
                    {theme.req}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Symbol Category Filter */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Colección de Símbolos Preferida</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Selecciona el conjunto temático prioritario para partidas rápidas
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {symbolThemes.map((st) => {
            const isSelected = preferences.symbolTheme === st.id;

            return (
              <button
                type="button"
                key={st.id}
                onClick={() => onUpdatePreferences({ symbolTheme: st.id })}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{st.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
