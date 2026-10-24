/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 
  | 'classic'
  | 'time_attack'
  | 'moves_limit'
  | 'daily_challenge'
  | 'extreme_memory'
  | 'two_players';

export type GameState = 
  | 'ready'
  | 'memorizing'
  | 'playing'
  | 'resolving'
  | 'paused'
  | 'won'
  | 'lost'
  | 'abandoned';

export interface CardItem {
  id: string; // e.g. "card-0", "card-1"
  pairId: string; // e.g. "pair-mars"
  symbolId: string;
  name: string;
  category: 'planet' | 'station' | 'constellation' | 'artifact';
  fact: string;
  isFlipped: boolean;
  isMatched: boolean;
  position: number;
}

export interface Player {
  id: 1 | 2;
  name: string;
  avatar: string; // avatar identifier
  score: number;
  pairsFound: number;
  color: string;
}

export interface LevelConfig {
  id: string;
  sectorId: number;
  sectorName: string;
  levelNumber: number;
  name: string;
  description: string;
  pairsCount: number;
  gridCols: number;
  timeLimitSeconds?: number;
  movesLimit?: number;
  memorizeDurationSeconds?: number;
  threeStarMoves: number;
  threeStarSeconds: number;
  xpReward: number;
  unlockedByDefault?: boolean;
}

export interface SectorConfig {
  id: number;
  name: string;
  codename: string;
  description: string;
  levels: LevelConfig[];
  requiredStars: number;
}

export interface SavedGameData {
  version: number;
  savedAt: number;
  mode: GameMode;
  levelId: string;
  cards: CardItem[];
  flippedCardIds: string[];
  matchedPairIds: string[];
  gameState: GameState;
  moves: number;
  score: number;
  comboStreak: number;
  highestCombo: number;
  elapsedMs: number;
  timeRemainingSeconds?: number;
  movesRemaining?: number;
  players?: Player[];
  activePlayerIndex?: number;
  isMultiplayer: boolean;
  initialPairsCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface UserPreferences {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  cardBackTheme: 'holo_hex' | 'plasma_core' | 'cosmic_seal' | 'quantum_matrix';
  symbolTheme: 'celestial' | 'stations' | 'constellations' | 'artifacts';
  reducedMotion: boolean;
  highContrast: boolean;
  playerName: string;
}

export interface UserProgression {
  xp: number;
  pilotRank: string;
  rankLevel: number;
  unlockedLevels: string[];
  levelProgress: Record<string, {
    stars: number;
    bestScore: number;
    bestTimeSeconds: number;
    bestMoves: number;
    completedCount: number;
  }>;
  unlockedThemes: string[];
  achievements: Record<string, {
    unlocked: boolean;
    unlockedAt?: number;
    progress: number;
  }>;
  dailyChallengeHistory: Record<string, {
    date: string; // YYYY-MM-DD
    completed: boolean;
    score: number;
    moves: number;
    timeSeconds: number;
    completedAt: number;
  }>;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  mode: GameMode;
  levelId?: string;
  victory: boolean;
  score: number;
  moves: number;
  timeSeconds: number;
  accuracy: number;
  isMultiplayer?: boolean;
  winnerName?: string;
}

export interface UserStatistics {
  gamesStarted: number;
  gamesCompleted: number;
  gamesWon: number;
  gamesLost: number;
  totalTimePlayedSeconds: number;
  totalMoves: number;
  totalPairsFound: number;
  currentWinStreak: number;
  highestWinStreak: number;
  modeStats: Record<GameMode, {
    started: number;
    won: number;
    bestScore: number;
    bestTimeSeconds: number;
  }>;
  twoPlayerStats: {
    totalMatches: number;
    p1Wins: number;
    p2Wins: number;
    ties: number;
  };
  recentMatches: MatchRecord[];
}
