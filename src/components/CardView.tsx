/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CardItem } from '../types/game';
import { SPACE_SYMBOLS } from '../game/data/symbols';
import { CardIcon } from './CardIcon';
import { Check } from 'lucide-react';

interface CardViewProps {
  card: CardItem;
  onClick: (cardId: string) => void;
  disabled: boolean;
  theme?: 'holo_hex' | 'plasma_core' | 'cosmic_seal' | 'quantum_matrix';
  highContrast?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  onClick,
  disabled,
  theme = 'holo_hex',
  highContrast = false,
}) => {
  const symbol = SPACE_SYMBOLS.find((s) => s.id === card.symbolId) || {
    id: card.symbolId,
    name: card.name,
    category: card.category,
    fact: card.fact,
    accentColor: '#38bdf8',
    secondaryColor: '#0284c7',
    iconType: 'star',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !card.isFlipped && !card.isMatched) {
      e.preventDefault();
      onClick(card.id);
    }
  };

  const categoryLabels: Record<string, string> = {
    planet: 'PLANETA',
    station: 'ESTACIÓN',
    constellation: 'ASTRO',
    artifact: 'ENERGÍA',
  };

  const isRevealed = card.isFlipped || card.isMatched;

  // Back face arcade cyber cartridge styling
  const renderCardBack = () => {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-950 border-2 border-cyan-500/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] overflow-hidden transition-all group-hover:border-cyan-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]">
        {/* Retro arcade background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

        {/* Pixel Corner Brackets */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

        {/* Top Header Label */}
        <div className="w-full flex items-center justify-between text-[7px] sm:text-[8px] font-arcade text-cyan-400 z-10">
          <span>ASTRA</span>
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
        </div>

        {/* Central Glowing Arcade Emblem with passive rotation hover */}
        <div className="my-auto relative flex items-center justify-center z-10">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg border border-cyan-400/70 bg-cyan-950/60 flex items-center justify-center relative rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <div className="w-3 h-3 sm:w-5 sm:h-5 bg-gradient-to-tr from-cyan-400 to-indigo-400 rounded-sm -rotate-45" />
          </div>
        </div>

        {/* Bottom Cartridge Strip */}
        <div className="w-full flex items-center justify-center z-10">
          <span className="text-[6.5px] sm:text-[7.5px] font-arcade tracking-wider text-slate-400">
            [ CART-0{card.position + 1} ]
          </span>
        </div>
      </div>
    );
  };

  // Front face revealed state with 100% opaque solid background to completely eliminate bleed-through
  const renderCardFront = () => {
    return (
      <div
        className={`relative w-full h-full rounded-xl p-1.5 sm:p-2.5 flex flex-col items-center justify-between overflow-hidden transition-all bg-slate-950 border-2 ${
          card.isMatched
            ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
            : 'border-slate-700 shadow-xl'
        }`}
        style={
          card.isMatched
            ? { borderColor: symbol.accentColor, boxShadow: `0 0 16px ${symbol.accentColor}70` }
            : undefined
        }
      >
        {/* Subtle holographic sheen overlay */}
        <div className="absolute inset-0 holo-sheen pointer-events-none opacity-30" />

        {/* Corner pixel brackets */}
        <div
          className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2"
          style={{ borderColor: card.isMatched ? symbol.accentColor : '#64748b' }}
        />
        <div
          className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2"
          style={{ borderColor: card.isMatched ? symbol.accentColor : '#64748b' }}
        />
        <div
          className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2"
          style={{ borderColor: card.isMatched ? symbol.accentColor : '#64748b' }}
        />
        <div
          className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2"
          style={{ borderColor: card.isMatched ? symbol.accentColor : '#64748b' }}
        />

        {/* Top Arcade Tag */}
        <div className="w-full flex items-center justify-between text-[6.5px] sm:text-[7.5px] font-arcade z-10">
          <span
            className="px-1.5 py-0.5 rounded bg-slate-900 uppercase tracking-wider border border-slate-800"
            style={{ color: symbol.accentColor }}
          >
            {categoryLabels[symbol.category] || symbol.category}
          </span>
          {card.isMatched && (
            <span className="flex items-center text-emerald-400 gap-0.5 bg-emerald-950 px-1 py-0.5 rounded border border-emerald-500/50">
              <Check className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {/* Center Graphic with passive hover pulse */}
        <div className="my-auto flex flex-col items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110">
          <CardIcon
            iconType={symbol.iconType}
            accentColor={symbol.accentColor}
            secondaryColor={symbol.secondaryColor}
            size={40}
          />
        </div>

        {/* Bottom Card Title & Status Pips */}
        <div className="w-full text-center z-10 border-t border-slate-800/80 pt-0.5">
          <p
            className="text-[10px] sm:text-xs font-bold font-display uppercase tracking-wider truncate"
            style={{ color: card.isMatched ? '#ffffff' : '#f1f5f9' }}
          >
            {symbol.name}
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: symbol.accentColor }} />
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: symbol.accentColor }} />
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: symbol.accentColor }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && !card.isFlipped && !card.isMatched && onClick(card.id)}
      onKeyDown={handleKeyDown}
      disabled={disabled || card.isMatched}
      tabIndex={card.isMatched ? -1 : 0}
      aria-label={
        isRevealed
          ? `${card.name}, ${card.isMatched ? 'emparejada' : 'descubierta'}`
          : `Carta espacial en celda ${card.position + 1}, sin revelar`
      }
      aria-pressed={isRevealed}
      className={`group relative w-full aspect-[3/3.8] sm:aspect-[3/4] max-h-[145px] sm:max-h-[165px] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-transform duration-200 select-none ${
        card.isMatched
          ? 'cursor-default ring-1 ring-emerald-400'
          : disabled
          ? 'cursor-not-allowed opacity-90'
          : 'cursor-pointer hover:scale-[1.04] active:scale-[0.96]'
      }`}
    >
      {/* 
        CRITICAL BUG FIX: 
        Directly isolate front face and back face visibility to completely eliminate 
        mirrored ghost bleed-through (e.g. AЯTƧA or backwards CART-01 showing over card front).
      */}
      {/* BACK FACE (When NOT revealed) */}
      <div
        className={`absolute inset-0 w-full h-full rounded-xl transition-all duration-300 ${
          isRevealed
            ? 'opacity-0 invisible pointer-events-none scale-95'
            : 'opacity-100 visible pointer-events-auto scale-100'
        }`}
      >
        {renderCardBack()}
      </div>

      {/* FRONT FACE (When revealed) */}
      <div
        className={`absolute inset-0 w-full h-full rounded-xl transition-all duration-300 ${
          isRevealed
            ? 'opacity-100 visible pointer-events-auto scale-100'
            : 'opacity-0 invisible pointer-events-none scale-95'
        }`}
      >
        {renderCardFront()}
      </div>
    </button>
  );
};
