/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { CardItem } from '../types/game';
import { CardView } from './CardView';

interface GameBoardProps {
  cards: CardItem[];
  onCardClick: (cardId: string) => void;
  disabled: boolean;
  theme?: 'holo_hex' | 'plasma_core' | 'cosmic_seal' | 'quantum_matrix';
  highContrast?: boolean;
  isShaking?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  onCardClick,
  disabled,
  theme = 'holo_hex',
  highContrast = false,
  isShaking = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute optimal column configuration:
  // Utilizes widescreen horizontal space (e.g. 8 cols x 2 rows on 16 cards)
  // to ensure 100% of cards fit without vertical scrolling on desktop, laptop and mobile!
  const getGridConfig = () => {
    const total = cards.length;

    if (total <= 12) {
      // 12 cards: 3 cols on mobile, 4 on tablet, 6 cols x 2 rows on desktop
      return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 max-w-sm sm:max-w-2xl md:max-w-4xl';
    }
    if (total <= 16) {
      // 16 cards: 4 cols on mobile, 8 cols x 2 rows on widescreen desktop!
      return 'grid-cols-4 md:grid-cols-8 max-w-sm sm:max-w-md md:max-w-5xl';
    }
    if (total <= 20) {
      // 20 cards: 4 cols on mobile, 10 cols x 2 rows on widescreen desktop!
      return 'grid-cols-4 sm:grid-cols-5 md:grid-cols-10 max-w-sm sm:max-w-2xl md:max-w-6xl';
    }
    // 24 cards: 4 cols on mobile, 8 cols x 3 rows on desktop
    return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 max-w-sm sm:max-w-3xl md:max-w-6xl';
  };

  const gridClass = getGridConfig();

  // Keyboard navigation handler with arrow keys
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    const activeElement = document.activeElement;
    if (!activeElement || !containerRef.current) return;

    const buttons = Array.from(
      containerRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
    );
    const currentIndex = buttons.indexOf(activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    e.preventDefault();
    let targetIndex = currentIndex;
    const total = buttons.length;

    let cols = 4;
    const isWidescreen = window.innerWidth >= 768;

    if (isWidescreen) {
      if (cards.length <= 12) cols = 6;
      else if (cards.length <= 16) cols = 8;
      else if (cards.length <= 20) cols = 10;
      else cols = 8;
    } else {
      cols = cards.length <= 12 ? 3 : 4;
    }

    switch (e.key) {
      case 'ArrowLeft':
        targetIndex = (currentIndex - 1 + total) % total;
        break;
      case 'ArrowRight':
        targetIndex = (currentIndex + 1) % total;
        break;
      case 'ArrowUp':
        targetIndex = (currentIndex - cols + total) % total;
        break;
      case 'ArrowDown':
        targetIndex = (currentIndex + cols) % total;
        break;
    }

    buttons[targetIndex]?.focus();
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleGridKeyDown}
      role="region"
      aria-label="Tablero de cartas espaciales"
      className={`w-full mx-auto grid gap-1.5 sm:gap-2.5 p-2 sm:p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-all ${gridClass} ${
        isShaking ? 'animate-[shake_0.2s_ease-in-out]' : ''
      }`}
    >
      {cards.map((card) => (
        <CardView
          key={card.id}
          card={card}
          onClick={onCardClick}
          disabled={disabled}
          theme={theme}
          highContrast={highContrast}
        />
      ))}
    </div>
  );
};
