/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MatchRecord,
  SavedGameData,
  UserPreferences,
  UserProgression,
  UserStatistics,
} from '../../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

const DB_NAME = 'AstraMemoryDB';
const DB_VERSION = 1;

export const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  soundVolume: 0.85,
  cardBackTheme: 'holo_hex',
  symbolTheme: 'celestial',
  reducedMotion: false,
  highContrast: false,
  playerName: 'Cadete Espacial',
};

export const DEFAULT_PROGRESSION: UserProgression = {
  xp: 0,
  pilotRank: 'Cadete Espacial',
  rankLevel: 1,
  unlockedLevels: ['sec1-lvl1'],
  levelProgress: {},
  unlockedThemes: ['holo_hex', 'celestial'],
  achievements: INITIAL_ACHIEVEMENTS.reduce(
    (acc, ach) => {
      acc[ach.id] = { unlocked: false, progress: 0 };
      return acc;
    },
    {} as UserProgression['achievements']
  ),
  dailyChallengeHistory: {},
};

export const DEFAULT_STATISTICS: UserStatistics = {
  gamesStarted: 0,
  gamesCompleted: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalTimePlayedSeconds: 0,
  totalMoves: 0,
  totalPairsFound: 0,
  currentWinStreak: 0,
  highestWinStreak: 0,
  modeStats: {
    classic: { started: 0, won: 0, bestScore: 0, bestTimeSeconds: 0 },
    time_attack: { started: 0, won: 0, bestScore: 0, bestTimeSeconds: 0 },
    moves_limit: { started: 0, won: 0, bestScore: 0, bestTimeSeconds: 0 },
    daily_challenge: { started: 0, won: 0, bestScore: 0, bestTimeSeconds: 0 },
    extreme_memory: { started: 0, won: 0, bestScore: 0, bestTimeSeconds: 0 },
    two_players: { started: 0, won: 0, bestScore: 0, bestTimeSeconds: 0 },
  },
  twoPlayerStats: {
    totalMatches: 0,
    p1Wins: 0,
    p2Wins: 0,
    ties: 0,
  },
  recentMatches: [],
};

class StorageService {
  private memoryCache: {
    progression: UserProgression | null;
    statistics: UserStatistics | null;
    preferences: UserPreferences | null;
    savedGame: SavedGameData | null;
  } = {
    progression: null,
    statistics: null,
    preferences: null,
    savedGame: null,
  };

  private getLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  private setLocalStorage<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage quota or restricted iframe
    }
  }

  public getPreferences(): UserPreferences {
    if (this.memoryCache.preferences) return this.memoryCache.preferences;
    const pref = this.getLocalStorage<UserPreferences>('astramemory_preferences', DEFAULT_PREFERENCES);
    const merged = { ...DEFAULT_PREFERENCES, ...pref };
    this.memoryCache.preferences = merged;
    return merged;
  }

  public savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    this.memoryCache.preferences = updated;
    this.setLocalStorage('astramemory_preferences', updated);
    return updated;
  }

  public getProgression(): UserProgression {
    if (this.memoryCache.progression) return this.memoryCache.progression;
    const prog = this.getLocalStorage<UserProgression>('astramemory_progression', DEFAULT_PROGRESSION);
    const merged: UserProgression = {
      ...DEFAULT_PROGRESSION,
      ...prog,
      levelProgress: prog.levelProgress || {},
      unlockedLevels: Array.isArray(prog.unlockedLevels) && prog.unlockedLevels.length > 0 
        ? prog.unlockedLevels 
        : DEFAULT_PROGRESSION.unlockedLevels,
      unlockedThemes: Array.isArray(prog.unlockedThemes) && prog.unlockedThemes.length > 0
        ? prog.unlockedThemes
        : DEFAULT_PROGRESSION.unlockedThemes,
      achievements: { ...DEFAULT_PROGRESSION.achievements, ...(prog.achievements || {}) },
      dailyChallengeHistory: prog.dailyChallengeHistory || {},
    };
    this.memoryCache.progression = merged;
    return merged;
  }

  public saveProgression(prog: UserProgression): void {
    this.memoryCache.progression = prog;
    this.setLocalStorage('astramemory_progression', prog);
  }

  public getStatistics(): UserStatistics {
    if (this.memoryCache.statistics) return this.memoryCache.statistics;
    const stats = this.getLocalStorage<UserStatistics>('astramemory_statistics', DEFAULT_STATISTICS);
    const merged: UserStatistics = {
      ...DEFAULT_STATISTICS,
      ...stats,
      modeStats: {
        ...DEFAULT_STATISTICS.modeStats,
        ...(stats.modeStats || {}),
      },
      twoPlayerStats: {
        ...DEFAULT_STATISTICS.twoPlayerStats,
        ...(stats.twoPlayerStats || {}),
      },
      recentMatches: Array.isArray(stats.recentMatches) ? stats.recentMatches : [],
    };
    this.memoryCache.statistics = merged;
    return merged;
  }

  public saveStatistics(stats: UserStatistics): void {
    this.memoryCache.statistics = stats;
    this.setLocalStorage('astramemory_statistics', stats);
  }

  public getSavedGame(): SavedGameData | null {
    if (this.memoryCache.savedGame) return this.memoryCache.savedGame;
    const game = this.getLocalStorage<SavedGameData | null>('astramemory_saved_game', null);
    if (!game || !Array.isArray(game.cards) || game.cards.length === 0) {
      return null;
    }
    this.memoryCache.savedGame = game;
    return game;
  }

  public saveActiveGame(game: SavedGameData): void {
    this.memoryCache.savedGame = game;
    this.setLocalStorage('astramemory_saved_game', game);
  }

  public clearSavedGame(): void {
    this.memoryCache.savedGame = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('astramemory_saved_game');
      }
    } catch {
      // Ignore
    }
  }

  public exportBackup(): string {
    const backup = {
      version: 1,
      exportedAt: Date.now(),
      progression: this.getProgression(),
      statistics: this.getStatistics(),
      preferences: this.getPreferences(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public importBackup(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Formato de archivo inválido.' };
      }
      if (!data.progression || !data.statistics) {
        return { success: false, error: 'El respaldo no contiene datos de progresión válidos.' };
      }

      this.saveProgression(data.progression);
      this.saveStatistics(data.statistics);
      if (data.preferences) {
        this.savePreferences(data.preferences);
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Error al interpretar el archivo JSON.' };
    }
  }

  public resetAllProgress(): void {
    this.memoryCache = {
      progression: null,
      statistics: null,
      preferences: null,
      savedGame: null,
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('astramemory_progression');
        window.localStorage.removeItem('astramemory_statistics');
        window.localStorage.removeItem('astramemory_saved_game');
      }
    } catch {
      // Ignore
    }
  }
}

export const storageService = new StorageService();
