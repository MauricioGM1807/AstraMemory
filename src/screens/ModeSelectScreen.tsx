/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode } from '../types/game';
import {
  Compass,
  Clock,
  Hash,
  Calendar,
  Eye,
  Users,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface ModeSelectScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenTwoPlayer: () => void;
  dailyCompletedToday: boolean;
  onBack: () => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  onSelectMode,
  onOpenTwoPlayer,
  dailyCompletedToday,
  onBack,
}) => {
  const modes = [
    {
      id: 'classic' as GameMode,
      name: 'Modo Clásico',
      tag: 'Exploración Libre',
      icon: <Compass className="w-6 h-6 text-cyan-400" />,
      color: 'cyan',
      description: 'Encuentra todas las parejas espaciales a tu propio ritmo. Perfecto para calibrar tu agudeza mental sin estrés de tiempo.',
      rules: ['Sin límite de tiempo', 'Movimientos libres', 'Multiplicador por rachas'],
    },
    {
      id: 'time_attack' as GameMode,
      name: 'Contrarreloj Estelar',
      tag: 'Alerta Roja',
      icon: <Clock className="w-6 h-6 text-rose-400" />,
      color: 'rose',
      description: 'El reactor espacial está en cuenta regresiva. Completa el tablero antes de que el cronómetro llegue a cero absoluto.',
      rules: ['Tiempo límite estricto', 'Pausa disponible', 'Bonificación por segundos restantes'],
    },
    {
      id: 'moves_limit' as GameMode,
      name: 'Movimientos Limitados',
      tag: 'Eficiencia Orbital',
      icon: <Hash className="w-6 h-6 text-violet-400" />,
      color: 'violet',
      description: 'El propulsor de maniobra tiene combustible contado. Cada intento consume un movimiento; planifica cada giro con precisión quirúrgica.',
      rules: ['Presupuesto fijo de maniobras', 'Aciertos y fallos consumen intento', 'Derrota al agotar movimientos'],
    },
    {
      id: 'daily_challenge' as GameMode,
      name: 'Desafío Diario',
      tag: 'Semilla Cósmica UTC',
      icon: <Calendar className="w-6 h-6 text-amber-400" />,
      color: 'amber',
      description: 'Un enigma cósmico idéntico generado por la fecha astronómica para todos los pilotos espaciales del mundo cada 24 horas.',
      rules: ['Disposición universal diaria', 'Recompensa especial de XP', 'Registro de racha'],
      isCompleted: dailyCompletedToday,
    },
    {
      id: 'extreme_memory' as GameMode,
      name: 'Memoria Extrema',
      tag: 'Reto Fotográfico',
      icon: <Eye className="w-6 h-6 text-emerald-400" />,
      color: 'emerald',
      description: 'Observa el tablero completo al descubierto durante 5 segundos. Luego todas las cartas se ocultan y debes resolverlo de memoria.',
      rules: ['Fase de memorización visible', 'Sin ayudas contextuales', 'Alta recompensa de experiencia'],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Modos de Juego Arcade</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cinco disciplinas cognitivas espaciales y una modalidad competitiva para dos personas
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {modes.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  {m.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  {m.isCompleted && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Completado hoy
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {m.tag}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-bold font-display text-white">{m.name}</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{m.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
                {m.rules.map((rule, idx) => (
                  <p key={idx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>{rule}</span>
                  </p>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectMode(m.id)}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jugar {m.name}</span>
            </button>
          </div>
        ))}

        {/* 2-Player Local Banner Card */}
        <div className="rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-indigo-950/30 border border-rose-500/40 p-5 flex flex-col justify-between shadow-lg text-left">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300">
                2 Jugadores
              </span>
            </div>

            <h2 className="text-lg font-bold font-display text-white">Duelo Local en Mismo Dispositivo</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Enfrentamiento táctico sin necesidad de internet. Nombres personalizados, turnos dinámicos y revanchas instantáneas.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose-400" />
                <span>Turno alternado al cometer un fallo</span>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose-400" />
                <span>Acierto otorga +1 punto y retiene el turno</span>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose-400" />
                <span>Marcador y nombres personalizados</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenTwoPlayer}
            className="mt-5 w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Configurar Duelo 2 Jugadores</span>
          </button>
        </div>
      </div>
    </div>
  );
};
