/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Swords, X, Play } from 'lucide-react';

interface TwoPlayerSetupModalProps {
  isOpen: boolean;
  defaultP1Name?: string;
  onClose: () => void;
  onStartMatch: (p1Name: string, p2Name: string, pairsCount: number) => void;
}

export const TwoPlayerSetupModal: React.FC<TwoPlayerSetupModalProps> = ({
  isOpen,
  defaultP1Name = 'Comandante Nova',
  onClose,
  onStartMatch,
}) => {
  const [p1Name, setP1Name] = useState(defaultP1Name);
  const [p2Name, setP2Name] = useState('Piloto Orión');
  const [pairsCount, setPairsCount] = useState<number>(8); // 16 cards

  useEffect(() => {
    if (defaultP1Name) {
      setP1Name(defaultP1Name);
    }
  }, [defaultP1Name]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartMatch(p1Name.trim() || 'Jugador 1', p2Name.trim() || 'Jugador 2', pairsCount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Duelo Local en Gravedad Cero</h2>
            <p className="text-xs text-slate-400">Dos jugadores en el mismo dispositivo por turnos alternados</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          {/* Player Names Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/40 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">Jugador 1</span>
              </div>
              <input
                type="text"
                maxLength={20}
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Nombre Jugador 1"
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/40 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">Jugador 2</span>
              </div>
              <input
                type="text"
                maxLength={20}
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Nombre Jugador 2"
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-rose-400 font-mono"
              />
            </div>
          </div>

          {/* Board Size Selection - Responsive zero-scroll optimized */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Tamaño del Tablero (Ajuste Panorámico sin Scroll)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { pairs: 6, label: 'Rápido', desc: '12 cartas (6x2 en PC)' },
                { pairs: 8, label: 'Estándar', desc: '16 cartas (8x2 en PC)' },
                { pairs: 10, label: 'Desafío', desc: '20 cartas (10x2 en PC)' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.pairs}
                  onClick={() => setPairsCount(opt.pairs)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    pairsCount === opt.pairs
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-100">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Rules Summary */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
            <p className="font-semibold text-slate-200">Reglas del Duelo:</p>
            <p className="text-[11px] text-slate-400">• Cada acierto otorga 100 puntos y te permite seguir volteando.</p>
            <p className="text-[11px] text-slate-400">• Si fallas la pareja, suena la alerta y el turno pasa al rival.</p>
            <p className="text-[11px] text-slate-400">• Todo el tablero se adapta al ancho de tu pantalla sin scroll vertical.</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Comenzar Duelo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
