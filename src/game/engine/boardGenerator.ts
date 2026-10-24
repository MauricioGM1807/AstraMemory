/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardItem } from '../../types/game';
import { SPACE_SYMBOLS, SpaceSymbol } from '../data/symbols';

/**
 * Deterministic 32-bit pseudo-random number generator (Mulberry32)
 */
export function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Convert string seed (e.g. "2026-10-24") to integer seed
 */
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) || 123456789;
}

/**
 * Fisher-Yates array shuffle with optional custom random function
 */
export function shuffleArray<T>(array: T[], randomFn: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface GenerateBoardOptions {
  pairsCount: number;
  symbolTheme?: 'all' | 'planet' | 'station' | 'constellation' | 'artifact';
  seed?: number;
  allFlippedInitial?: boolean; // For extreme memory mode preview
}

/**
 * Generates a valid board verifying:
 * 1. Exactly 2 cards per pair.
 * 2. Unique card IDs.
 * 3. Total cards is exactly 2 * pairsCount.
 * 4. All cards start hidden unless allFlippedInitial is specified.
 */
export function generateBoard(options: GenerateBoardOptions): CardItem[] {
  const { pairsCount, symbolTheme = 'all', seed, allFlippedInitial = false } = options;
  const randomFn = seed !== undefined ? createSeededRandom(seed) : Math.random;

  // Filter symbols by category if requested, or fallback to all if not enough symbols
  let pool = symbolTheme === 'all' 
    ? [...SPACE_SYMBOLS] 
    : SPACE_SYMBOLS.filter((s) => s.category === symbolTheme);

  if (pool.length < pairsCount) {
    pool = [...SPACE_SYMBOLS];
  }

  // Shuffle candidate symbols to pick pairsCount distinct symbols
  const shuffledSymbols = shuffleArray(pool, randomFn);
  const selectedSymbols = shuffledSymbols.slice(0, pairsCount);

  // If there are still fewer symbols than requested pairs, cycle through
  const finalSymbols: SpaceSymbol[] = [];
  for (let i = 0; i < pairsCount; i++) {
    finalSymbols.push(selectedSymbols[i % selectedSymbols.length]);
  }

  // Generate 2 cards for each chosen symbol
  const rawCards: CardItem[] = [];
  finalSymbols.forEach((symbol, pairIndex) => {
    const pairId = `pair-${symbol.id}-${pairIndex}`;
    
    // Copy A
    rawCards.push({
      id: `card-${pairId}-a`,
      pairId,
      symbolId: symbol.id,
      name: symbol.name,
      category: symbol.category,
      fact: symbol.fact,
      isFlipped: allFlippedInitial,
      isMatched: false,
      position: 0,
    });

    // Copy B
    rawCards.push({
      id: `card-${pairId}-b`,
      pairId,
      symbolId: symbol.id,
      name: symbol.name,
      category: symbol.category,
      fact: symbol.fact,
      isFlipped: allFlippedInitial,
      isMatched: false,
      position: 0,
    });
  });

  // Shuffle the final board cards
  const shuffledCards = shuffleArray(rawCards, randomFn);

  // Assign stable grid positions
  return shuffledCards.map((card, index) => ({
    ...card,
    position: index,
  }));
}

/**
 * Generates Daily Challenge configuration deterministically based on UTC date
 */
export function getDailyChallengeConfig(dateStr?: string): {
  date: string;
  seed: number;
  pairsCount: number;
  timeLimitSeconds: number;
  movesLimit: number;
  xpReward: number;
} {
  const today = dateStr || new Date().toISOString().slice(0, 10);
  const seed = stringToSeed(`astramemory-daily-${today}`);
  const rng = createSeededRandom(seed);

  // Difficulty varies deterministically between 8 and 12 pairs
  const pairsCount = 8 + Math.floor(rng() * 5); // 8, 9, 10, 11, or 12 pairs
  const timeLimitSeconds = pairsCount * 7 + 10;
  const movesLimit = Math.floor(pairsCount * 2.8) + 4;
  const xpReward = 350 + pairsCount * 20;

  return {
    date: today,
    seed,
    pairsCount,
    timeLimitSeconds,
    movesLimit,
    xpReward,
  };
}
