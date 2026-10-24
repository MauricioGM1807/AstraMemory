/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CardItem } from '../types/game';
import { CardView } from '../components/CardView';
import { BookOpen, CheckCircle2, RotateCcw, Sparkles, Keyboard, Users, Layers } from 'lucide-react';
import { soundManager } from '../game/engine/sound';

interface TutorialScreenProps {
  onBack: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack }) => {
  // Interactive mini-board with 4 cards (2 pairs: Sol and Tierra)
  const initialMiniCards: CardItem[] = [
    {
      id: 'tut-sun-1',
      pairId: 'tut-sun',
      symbolId: 'sun',
      name: 'El Sol',
      category: 'planet',
      fact: 'Contiene el 99.86% de toda la masa del Sistema Solar.',
      isFlipped: false,
      isMatched: false,
      position: 0,
    },
    {
      id: 'tut-earth-1',
      pairId: 'tut-earth',
      symbolId: 'earth',
      name: 'La Tierra',
      category: 'planet',
      fact: 'El único mundo conocido con agua líquida continua.',
      isFlipped: false,
      isMatched: false,
      position: 1,
    },
    {
      id: 'tut-sun-2',
      pairId: 'tut-sun',
      symbolId: 'sun',
      name: 'El Sol',
      category: 'planet',
      fact: 'Contiene el 99.86% de toda la masa del Sistema Solar.',
      isFlipped: false,
      isMatched: false,
      position: 2,
    },
    {
      id: 'tut-earth-2',
      pairId: 'tut-earth',
      symbolId: 'earth',
      name: 'La Tierra',
      category: 'planet',
      fact: 'El único mundo conocido con agua líquida continua.',
      isFlipped: false,
      isMatched: false,
      position: 3,
    },
  ];

  const [cards, setCards] = useState<CardItem[]>(initialMiniCards);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Haz clic o pulsa Enter sobre cualquier carta oculta.');

  const handleCardClick = (cardId: string) => {
    if (isResolving || flippedIds.length >= 2) return;

    soundManager.playCardFlip();
    const newFlippedIds = [...flippedIds, cardId];
    const updatedCards = cards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    if (newFlippedIds.length === 1) {
      setFlippedIds(newFlippedIds);
      setMessage('¡Primera carta revelada! Ahora busca su pareja gemela.');
      return;
    }

    // Second card
    setFlippedIds(newFlippedIds);
    const firstCard = updatedCards.find((c) => c.id === newFlippedIds[0])!;
    const secondCard = updatedCards.find((c) => c.id === cardId)!;

    if (firstCard.pairId === secondCard.pairId) {
      soundManager.playMatchSuccess();
      const matchedCards = updatedCards.map((c) =>
        c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
      );
      setCards(matchedCards);
      setFlippedIds([]);
      const allDone = matchedCards.every((c) => c.isMatched);
      if (allDone) {
        soundManager.playVictory();
        setMessage('¡Excelente! Has encontrado todas las parejas del entrenamiento.');
      } else {
        setMessage('¡Coincidencia correcta! Las cartas emparejadas permanecen fijas.');
      }
    } else {
      soundManager.playMatchFail();
      setIsResolving(true);
      setMessage('No coinciden. El sistema las volteará automáticamente en un instante.');
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === firstCard.id || c.id === secondCard.id ? { ...c, isFlipped: false } : c))
        );
        setFlippedIds([]);
        setIsResolving(false);
        setMessage('Inténtalo de nuevo memorizando dónde estaba cada una.');
      }, 1000);
    }
  };

  const handleResetMiniBoard = () => {
    setCards(initialMiniCards.map((c) => ({ ...c, isFlipped: false, isMatched: false })));
    setFlippedIds([]);
    setIsResolving(false);
    setMessage('Tablero reiniciado. Selecciona tu primera carta.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Manual y Entrenamiento</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aprende las mecánicas de juego, atajos de teclado y estrategias de memoria
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

      {/* Interactive Mini-Board Practice Arena */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Simulador Interactivo de Entrenamiento</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{message}</p>
          </div>
          <button
            type="button"
            onClick={handleResetMiniBoard}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Simulador</span>
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto my-2">
          {cards.map((card) => (
            <CardView
              key={card.id}
              card={card}
              onClick={handleCardClick}
              disabled={isResolving}
              theme="holo_hex"
            />
          ))}
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Rules */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Reglas Fundamentales</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Mecánica de Pares:</strong> Voltea dos cartas consecutivas. Si ambas representan el mismo símbolo espacial, quedan descubiertas permanentemente.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Control Asíncrono Seguro:</strong> Si las dos cartas no coinciden, se bloquean las interacciones brevemente y vuelven a ocultarse automáticamente.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Multiplicador de Combo:</strong> Cada acierto consecutivo sin cometer fallos multiplica la puntuación obtenida.</span>
            </li>
          </ul>
        </div>

        {/* Keyboard Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span>Accesibilidad y Atajos de Teclado</span>
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">Flechas</kbd>
              <p className="text-[11px] text-slate-400 mt-1">Navegar por las cartas del tablero</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">Enter / Espacio</kbd>
              <p className="text-[11px] text-slate-400 mt-1">Voltear la carta seleccionada</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">Tecla P</kbd>
              <p className="text-[11px] text-slate-400 mt-1">Pausar o reanudar la partida</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">Tecla R</kbd>
              <p className="text-[11px] text-slate-400 mt-1">Reiniciar el tablero actual</p>
            </div>
          </div>
        </div>

        {/* Multiplayer Instructions */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            <span>Mecánica del Duelo Local (2 Jugadores)</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Juega contra un amigo en el mismo ordenador o tablet:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• El Jugador 1 comienza volteando un par.</li>
            <li>• Si acierta: gana 1 punto, se registra su puntuación y <strong>mantiene el turno</strong> para seguir jugando.</li>
            <li>• Si falla: las cartas se ocultan y el turno pasa inmediatamente al Jugador 2.</li>
            <li>• El juego termina al descubrir todas las parejas; el sistema determina al vencedor o declara empate.</li>
          </ul>
        </div>

        {/* Persistence & Save */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Autoguardado y Reanudación</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tu partida se guarda automáticamente en cada movimiento en el almacenamiento local de tu navegador. Si cierras la pestaña o sales al menú, podrás reanudar exactamente la misma disposición sin volver a barajar las cartas.
          </p>
        </div>
      </div>
    </div>
  );
};
