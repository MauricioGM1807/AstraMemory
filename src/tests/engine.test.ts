/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { generateBoard, getDailyChallengeConfig } from '../game/engine/boardGenerator';
import { GameEngine, GameEngineState } from '../game/engine/gameEngine';
import { Player } from '../types/game';

describe('Board Generator', () => {
  it('generates a valid board with exactly 2 cards per pair and unique IDs', () => {
    const pairsCount = 6;
    const cards = generateBoard({ pairsCount, seed: 42 });

    expect(cards).toHaveLength(pairsCount * 2);

    const ids = new Set(cards.map((c) => c.id));
    expect(ids.size).toBe(cards.length);

    // Verify pairs
    const pairMap: Record<string, number> = {};
    cards.forEach((c) => {
      pairMap[c.pairId] = (pairMap[c.pairId] || 0) + 1;
    });

    expect(Object.keys(pairMap)).toHaveLength(pairsCount);
    Object.values(pairMap).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it('produces deterministic output when given the same seed', () => {
    const seed = 99999;
    const boardA = generateBoard({ pairsCount: 8, seed });
    const boardB = generateBoard({ pairsCount: 8, seed });

    expect(boardA.map((c) => c.id)).toEqual(boardB.map((c) => c.id));
    expect(boardA.map((c) => c.pairId)).toEqual(boardB.map((c) => c.pairId));
  });

  it('generates deterministic daily challenge for identical dates', () => {
    const day = '2026-10-24';
    const configA = getDailyChallengeConfig(day);
    const configB = getDailyChallengeConfig(day);

    expect(configA.seed).toBe(configB.seed);
    expect(configA.pairsCount).toBe(configB.pairsCount);
    expect(configA.timeLimitSeconds).toBe(configB.timeLimitSeconds);
  });
});

describe('GameEngine State Machine & Anti-Spam Guardrails', () => {
  function createTestEngine(isMultiplayer = false) {
    const pairsCount = 3;
    const cards = generateBoard({ pairsCount, seed: 101 });
    const players: Player[] = [
      { id: 1, name: 'Jugador 1', avatar: 'astro_1', score: 0, pairsFound: 0, color: '#38bdf8' },
      { id: 2, name: 'Jugador 2', avatar: 'astro_2', score: 0, pairsFound: 0, color: '#f43f5e' },
    ];

    const initialState: GameEngineState = {
      gameId: 'test-game-1',
      operationToken: 1,
      mode: isMultiplayer ? 'two_players' : 'classic',
      levelId: 'sec1-lvl1',
      gameState: 'playing',
      cards,
      flippedCardIds: [],
      matchedPairIds: [],
      moves: 0,
      score: 0,
      comboStreak: 0,
      highestCombo: 0,
      elapsedMs: 0,
      isMultiplayer,
      players,
      activePlayerIndex: 0,
      initialPairsCount: pairsCount,
    };

    return new GameEngine(initialState);
  }

  it('allows flipping a valid first card', () => {
    const engine = createTestEngine();
    const state = engine.getState();
    const firstCard = state.cards[0];

    const success = engine.flipCard(firstCard.id);
    expect(success).toBe(true);

    const updated = engine.getState();
    expect(updated.flippedCardIds).toEqual([firstCard.id]);
    expect(updated.cards[0].isFlipped).toBe(true);
    expect(updated.moves).toBe(0); // Moves only increment when attempt is completed
  });

  it('prevents flipping the same card twice', () => {
    const engine = createTestEngine();
    const firstCard = engine.getState().cards[0];

    engine.flipCard(firstCard.id);
    const retrySame = engine.flipCard(firstCard.id);

    expect(retrySame).toBe(false);
    expect(engine.getState().flippedCardIds).toHaveLength(1);
  });

  it('resolves matching pair and increases combo and score', () => {
    const engine = createTestEngine();
    const state = engine.getState();
    
    // Find two matching cards
    const cardA = state.cards[0];
    const cardB = state.cards.find((c) => c.pairId === cardA.pairId && c.id !== cardA.id)!;

    engine.flipCard(cardA.id);
    engine.flipCard(cardB.id);

    const updated = engine.getState();
    expect(updated.moves).toBe(1);
    expect(updated.matchedPairIds).toContain(cardA.pairId);
    expect(updated.comboStreak).toBe(1);
    expect(updated.score).toBe(100);
    expect(updated.gameState).toBe('playing');
  });

  it('blocks a third card click while resolving a failed pair', () => {
    const engine = createTestEngine();
    const state = engine.getState();

    // Pick two non-matching cards
    const cardA = state.cards[0];
    const cardNonMatch = state.cards.find((c) => c.pairId !== cardA.pairId)!;
    const thirdCard = state.cards.find((c) => c.id !== cardA.id && c.id !== cardNonMatch.id)!;

    engine.flipCard(cardA.id, 5000); // 5 second resolution delay
    engine.flipCard(cardNonMatch.id, 5000);

    const resolvingState = engine.getState();
    expect(resolvingState.gameState).toBe('resolving');

    // Try flipping 3rd card immediately: MUST BE REJECTED
    const thirdAttempt = engine.flipCard(thirdCard.id);
    expect(thirdAttempt).toBe(false);
    expect(engine.getState().cards.find((c) => c.id === thirdCard.id)!.isFlipped).toBe(false);
  });

  it('switches turn to Player 2 on a failed attempt in 2-player mode', () => {
    const engine = createTestEngine(true);
    const state = engine.getState();

    expect(state.activePlayerIndex).toBe(0);

    const cardA = state.cards[0];
    const cardNonMatch = state.cards.find((c) => c.pairId !== cardA.pairId)!;

    engine.flipCard(cardA.id, 100);
    engine.flipCard(cardNonMatch.id, 100);

    // Manually trigger resolveFailedPair (or tick)
    engine.resolveFailedPair(cardA.id, cardNonMatch.id);

    const afterResolve = engine.getState();
    expect(afterResolve.activePlayerIndex).toBe(1);
    expect(afterResolve.gameState).toBe('playing');
  });

  it('keeps turn for the active player when matching in 2-player mode', () => {
    const engine = createTestEngine(true);
    const state = engine.getState();

    const cardA = state.cards[0];
    const cardB = state.cards.find((c) => c.pairId === cardA.pairId && c.id !== cardA.id)!;

    engine.flipCard(cardA.id);
    engine.flipCard(cardB.id);

    const updated = engine.getState();
    expect(updated.activePlayerIndex).toBe(0); // Kept turn!
    expect(updated.players[0].pairsFound).toBe(1);
    expect(updated.players[0].score).toBe(100);
  });

  it('triggers game over when time runs out in Time Attack', () => {
    const engine = createTestEngine();
    // Simulate time attack with 2 seconds
    engine.restart(engine.getState().cards, {
      mode: 'time_attack',
      timeRemainingSeconds: 2,
    });

    engine.tick(1);
    expect(engine.getState().gameState).toBe('playing');
    expect(engine.getState().timeRemainingSeconds).toBe(1);

    engine.tick(1);
    expect(engine.getState().gameState).toBe('lost');
    expect(engine.getState().timeRemainingSeconds).toBe(0);
  });

  it('triggers victory when all pairs are matched', () => {
    const engine = createTestEngine();
    const cards = engine.getState().cards;

    // Match pair 1
    const pair1 = cards.filter((c) => c.pairId === cards[0].pairId);
    engine.flipCard(pair1[0].id);
    engine.flipCard(pair1[1].id);

    // Match pair 2
    const remainingAfter1 = engine.getState().cards.filter((c) => !c.isMatched);
    const pair2 = remainingAfter1.filter((c) => c.pairId === remainingAfter1[0].pairId);
    engine.flipCard(pair2[0].id);
    engine.flipCard(pair2[1].id);

    // Match pair 3
    const remainingAfter2 = engine.getState().cards.filter((c) => !c.isMatched);
    const pair3 = remainingAfter2.filter((c) => c.pairId === remainingAfter2[0].pairId);
    engine.flipCard(pair3[0].id);
    engine.flipCard(pair3[1].id);

    expect(engine.getState().gameState).toBe('won');
    expect(engine.getState().matchedPairIds).toHaveLength(3);
  });
});
