/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { storageService, DEFAULT_PROGRESSION, DEFAULT_STATISTICS } from '../game/persistence/storage';

describe('Storage & Persistence Service', () => {
  beforeEach(() => {
    storageService.resetAllProgress();
  });

  it('provides clean default progression and statistics', () => {
    const prog = storageService.getProgression();
    expect(prog.xp).toBe(0);
    expect(prog.unlockedLevels).toContain('sec1-lvl1');

    const stats = storageService.getStatistics();
    expect(stats.gamesCompleted).toBe(0);
    expect(stats.gamesWon).toBe(0);
  });

  it('exports and validates backup integrity', () => {
    const backupJson = storageService.exportBackup();
    expect(typeof backupJson).toBe('string');

    const parsed = JSON.parse(backupJson);
    expect(parsed.version).toBe(1);
    expect(parsed.progression).toBeDefined();
    expect(parsed.statistics).toBeDefined();

    // Import the exported backup
    const result = storageService.importBackup(backupJson);
    expect(result.success).toBe(true);
  });

  it('gracefully rejects corrupted or invalid backup JSON', () => {
    const invalidJson = '{ "version": "corrupted" ';
    const res1 = storageService.importBackup(invalidJson);
    expect(res1.success).toBe(false);

    const malformedPayload = JSON.stringify({ version: 1, foo: 'bar' });
    const res2 = storageService.importBackup(malformedPayload);
    expect(res2.success).toBe(false);
    expect(res2.error).toContain('datos de progresión');
  });

  it('saves and clears active games properly', () => {
    expect(storageService.getSavedGame()).toBeNull();

    storageService.saveActiveGame({
      version: 1,
      savedAt: Date.now(),
      mode: 'classic',
      levelId: 'sec1-lvl1',
      cards: [
        {
          id: 'card-1',
          pairId: 'pair-1',
          symbolId: 'sun',
          name: 'El Sol',
          category: 'planet',
          fact: 'Test fact',
          isFlipped: false,
          isMatched: false,
          position: 0,
        },
      ],
      flippedCardIds: [],
      matchedPairIds: [],
      gameState: 'playing',
      moves: 2,
      score: 100,
      comboStreak: 1,
      highestCombo: 1,
      elapsedMs: 5000,
      isMultiplayer: false,
      initialPairsCount: 1,
    });

    const loaded = storageService.getSavedGame();
    expect(loaded).not.toBeNull();
    expect(loaded?.score).toBe(100);

    storageService.clearSavedGame();
    expect(storageService.getSavedGame()).toBeNull();
  });
});
