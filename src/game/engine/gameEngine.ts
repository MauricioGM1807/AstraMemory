/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardItem, GameMode, GameState, Player } from '../../types/game';

export interface GameEngineState {
  gameId: string;
  operationToken: number;
  mode: GameMode;
  levelId: string;
  gameState: GameState;
  cards: CardItem[];
  flippedCardIds: string[];
  matchedPairIds: string[];
  moves: number;
  score: number;
  comboStreak: number;
  highestCombo: number;
  elapsedMs: number;
  timeRemainingSeconds?: number;
  movesRemaining?: number;
  isMultiplayer: boolean;
  players: Player[];
  activePlayerIndex: number;
  initialPairsCount: number;
  lastMatchedFact?: string;
  memorizeSecondsRemaining?: number;
}

export type EngineEvent = 
  | { type: 'CARD_FLIPPED'; card: CardItem; attemptNumber: 1 | 2 }
  | { type: 'MATCH_SUCCESS'; pairId: string; fact: string; combo: number; playerIndex: number }
  | { type: 'MATCH_FAIL'; cardIds: [string, string]; playerIndex: number }
  | { type: 'TURN_SWITCH'; newActivePlayerIndex: number }
  | { type: 'GAME_WON'; finalScore: number; moves: number; elapsedSeconds: number }
  | { type: 'GAME_LOST'; reason: 'time_up' | 'moves_exhausted' }
  | { type: 'MEMORIZATION_ENDED' };

export type EngineListener = (event: EngineEvent) => void;

/**
 * Pure Game Engine supporting both synchronous unit testing
 * and real-time UI execution with robust async token isolation.
 */
export class GameEngine {
  private state: GameEngineState;
  private listeners: EngineListener[] = [];
  private resolveTimerId: ReturnType<typeof setTimeout> | null = null;
  private gameTickerId: ReturnType<typeof setInterval> | null = null;

  constructor(initialState: GameEngineState) {
    this.state = { ...initialState };
  }

  public subscribe(listener: EngineListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(event: EngineEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch {
        // Prevent listener exceptions from breaking the engine
      }
    });
  }

  public getState(): Readonly<GameEngineState> {
    return this.state;
  }

  /**
   * Safe check if a card can currently be flipped by the user
   */
  public canFlipCard(cardId: string): boolean {
    if (this.state.gameState !== 'playing') {
      return false;
    }

    if (this.state.flippedCardIds.length >= 2) {
      return false;
    }

    const card = this.state.cards.find((c) => c.id === cardId);
    if (!card) return false;

    // Cannot flip if already matched or already flipped in current attempt
    if (card.isMatched || card.isFlipped) {
      return false;
    }

    return true;
  }

  /**
   * Action: Request to flip a card
   */
  public flipCard(cardId: string, resolveDelayMs: number = 900): boolean {
    if (!this.canFlipCard(cardId)) {
      return false;
    }

    const currentCard = this.state.cards.find((c) => c.id === cardId);
    if (!currentCard) return false;

    const currentToken = this.state.operationToken;
    const newFlippedIds = [...this.state.flippedCardIds, cardId];

    // Flip this card in the state
    const updatedCards = this.state.cards.map((c) => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    // Case 1: First card of the attempt
    if (newFlippedIds.length === 1) {
      this.state = {
        ...this.state,
        cards: updatedCards,
        flippedCardIds: newFlippedIds,
      };
      this.emit({ type: 'CARD_FLIPPED', card: currentCard, attemptNumber: 1 });
      return true;
    }

    // Case 2: Second card of the attempt
    const firstCardId = newFlippedIds[0];
    const firstCard = updatedCards.find((c) => c.id === firstCardId)!;
    const newMoves = this.state.moves + 1;
    let newMovesRemaining = this.state.movesRemaining;

    if (newMovesRemaining !== undefined) {
      newMovesRemaining = Math.max(0, newMovesRemaining - 1);
    }

    this.state = {
      ...this.state,
      cards: updatedCards,
      flippedCardIds: newFlippedIds,
      moves: newMoves,
      movesRemaining: newMovesRemaining,
    };

    this.emit({ type: 'CARD_FLIPPED', card: currentCard, attemptNumber: 2 });

    // Compare logical identities (symbolId or pairId)
    const isMatch = firstCard.pairId === currentCard.pairId;

    if (isMatch) {
      this.handleMatchSuccess(firstCard, currentCard);
    } else {
      this.handleMatchFail(firstCardId, cardId, currentToken, resolveDelayMs);
    }

    return true;
  }

  private handleMatchSuccess(firstCard: CardItem, secondCard: CardItem) {
    const pairId = firstCard.pairId;
    const newMatchedIds = [...this.state.matchedPairIds, pairId];
    const newCombo = this.state.comboStreak + 1;
    const newHighestCombo = Math.max(this.state.highestCombo, newCombo);

    // Calculate score addition
    const basePoints = 100;
    const comboBonus = (newCombo - 1) * 50;
    const addedPoints = basePoints + comboBonus;
    const newScore = this.state.score + addedPoints;

    // Mark both cards as matched
    const updatedCards = this.state.cards.map((c) => {
      if (c.pairId === pairId) {
        return { ...c, isFlipped: true, isMatched: true };
      }
      return c;
    });

    // Multiplayer scoring update
    let updatedPlayers = [...this.state.players];
    if (this.state.isMultiplayer && updatedPlayers.length >= 2) {
      const activeIdx = this.state.activePlayerIndex;
      const currentP = updatedPlayers[activeIdx];
      updatedPlayers[activeIdx] = {
        ...currentP,
        score: currentP.score + addedPoints,
        pairsFound: currentP.pairsFound + 1,
      };
    }

    const isAllMatched = newMatchedIds.length >= this.state.initialPairsCount;

    this.state = {
      ...this.state,
      cards: updatedCards,
      flippedCardIds: [],
      matchedPairIds: newMatchedIds,
      score: newScore,
      comboStreak: newCombo,
      highestCombo: newHighestCombo,
      players: updatedPlayers,
      lastMatchedFact: secondCard.fact,
      gameState: isAllMatched ? 'won' : 'playing',
    };

    this.emit({
      type: 'MATCH_SUCCESS',
      pairId,
      fact: secondCard.fact,
      combo: newCombo,
      playerIndex: this.state.activePlayerIndex,
    });

    if (isAllMatched) {
      this.handleVictory();
    }
  }

  private handleMatchFail(firstCardId: string, secondCardId: string, token: number, delayMs: number) {
    // Set state to resolving to strictly block all input
    this.state = {
      ...this.state,
      gameState: 'resolving',
      comboStreak: 0,
    };

    this.emit({
      type: 'MATCH_FAIL',
      cardIds: [firstCardId, secondCardId],
      playerIndex: this.state.activePlayerIndex,
    });

    // Clear any previous timer
    if (this.resolveTimerId) {
      clearTimeout(this.resolveTimerId);
      this.resolveTimerId = null;
    }

    // Schedule delayed resolution
    this.resolveTimerId = setTimeout(() => {
      // Invalidation check: make sure game wasn't reset, abandoned, or token changed
      if (this.state.operationToken !== token) {
        return;
      }

      this.resolveFailedPair(firstCardId, secondCardId);
    }, delayMs);
  }

  /**
   * Resolves a failed pair, flips them back down, and checks for moves limit loss or switches turns
   */
  public resolveFailedPair(firstCardId: string, secondCardId: string) {
    // Check if game is still in a state that should resolve
    if (this.state.gameState !== 'resolving') {
      return;
    }

    const updatedCards = this.state.cards.map((c) => {
      if (c.id === firstCardId || c.id === secondCardId) {
        return { ...c, isFlipped: false };
      }
      return c;
    });

    // Check if moves ran out
    if (this.state.movesRemaining !== undefined && this.state.movesRemaining <= 0) {
      this.state = {
        ...this.state,
        cards: updatedCards,
        flippedCardIds: [],
        gameState: 'lost',
      };
      this.emit({ type: 'GAME_LOST', reason: 'moves_exhausted' });
      return;
    }

    // Multiplayer: switch turn on fail
    let nextActiveIndex = this.state.activePlayerIndex;
    if (this.state.isMultiplayer && this.state.players.length >= 2) {
      nextActiveIndex = (nextActiveIndex + 1) % this.state.players.length;
      this.emit({ type: 'TURN_SWITCH', newActivePlayerIndex: nextActiveIndex });
    }

    this.state = {
      ...this.state,
      cards: updatedCards,
      flippedCardIds: [],
      activePlayerIndex: nextActiveIndex,
      gameState: 'playing',
    };
  }

  private handleVictory() {
    this.stopTicker();

    // Bonus points for time remaining
    let bonus = 0;
    if (this.state.timeRemainingSeconds !== undefined && this.state.timeRemainingSeconds > 0) {
      bonus += this.state.timeRemainingSeconds * 10;
    }

    // Bonus points for leftover moves
    if (this.state.movesRemaining !== undefined && this.state.movesRemaining > 0) {
      bonus += this.state.movesRemaining * 20;
    }

    const finalScore = this.state.score + bonus;

    this.state = {
      ...this.state,
      score: finalScore,
      gameState: 'won',
    };

    const elapsedSeconds = Math.round(this.state.elapsedMs / 1000);
    this.emit({
      type: 'GAME_WON',
      finalScore,
      moves: this.state.moves,
      elapsedSeconds,
    });
  }

  /**
   * Timer tick method called every second or delta ms
   */
  public tick(deltaSeconds: number = 1) {
    if (this.state.gameState === 'memorizing') {
      const currentMem = this.state.memorizeSecondsRemaining ?? 0;
      const nextMem = Math.max(0, currentMem - deltaSeconds);
      if (nextMem <= 0) {
        // End memorization: flip all cards back and start playing
        const unflippedCards = this.state.cards.map((c) => ({
          ...c,
          isFlipped: false,
          isMatched: false,
        }));
        this.state = {
          ...this.state,
          cards: unflippedCards,
          memorizeSecondsRemaining: 0,
          gameState: 'playing',
        };
        this.emit({ type: 'MEMORIZATION_ENDED' });
      } else {
        this.state = {
          ...this.state,
          memorizeSecondsRemaining: nextMem,
        };
      }
      return;
    }

    if (this.state.gameState !== 'playing' && this.state.gameState !== 'resolving') {
      return;
    }

    const newElapsedMs = this.state.elapsedMs + deltaSeconds * 1000;
    let newTimeRemaining = this.state.timeRemainingSeconds;

    if (newTimeRemaining !== undefined) {
      newTimeRemaining = Math.max(0, newTimeRemaining - deltaSeconds);
      if (newTimeRemaining <= 0) {
        this.state = {
          ...this.state,
          elapsedMs: newElapsedMs,
          timeRemainingSeconds: 0,
          gameState: 'lost',
        };
        this.stopTicker();
        this.emit({ type: 'GAME_LOST', reason: 'time_up' });
        return;
      }
    }

    this.state = {
      ...this.state,
      elapsedMs: newElapsedMs,
      timeRemainingSeconds: newTimeRemaining,
    };
  }

  public pause(): boolean {
    if (this.state.gameState === 'playing' || this.state.gameState === 'resolving') {
      this.state = {
        ...this.state,
        gameState: 'paused',
      };
      return true;
    }
    return false;
  }

  public resume(): boolean {
    if (this.state.gameState === 'paused') {
      this.state = {
        ...this.state,
        gameState: 'playing',
      };
      return true;
    }
    return false;
  }

  public restart(newCards: CardItem[], freshState?: Partial<GameEngineState>) {
    // Invalidate any pending timers
    if (this.resolveTimerId) {
      clearTimeout(this.resolveTimerId);
      this.resolveTimerId = null;
    }

    const newToken = this.state.operationToken + 1;
    const isMemorize = this.state.mode === 'extreme_memory';

    this.state = {
      ...this.state,
      operationToken: newToken,
      cards: newCards,
      flippedCardIds: [],
      matchedPairIds: [],
      moves: 0,
      score: 0,
      comboStreak: 0,
      highestCombo: 0,
      elapsedMs: 0,
      lastMatchedFact: undefined,
      gameState: isMemorize ? 'memorizing' : 'playing',
      memorizeSecondsRemaining: isMemorize ? (freshState?.memorizeSecondsRemaining ?? 5) : undefined,
      timeRemainingSeconds: freshState?.timeRemainingSeconds ?? this.state.timeRemainingSeconds,
      movesRemaining: freshState?.movesRemaining ?? this.state.movesRemaining,
      activePlayerIndex: 0,
      players: this.state.players.map((p) => ({ ...p, score: 0, pairsFound: 0 })),
      ...freshState,
    };
  }

  public abandon() {
    if (this.resolveTimerId) {
      clearTimeout(this.resolveTimerId);
      this.resolveTimerId = null;
    }
    this.stopTicker();
    this.state = {
      ...this.state,
      operationToken: this.state.operationToken + 1,
      gameState: 'abandoned',
    };
  }

  public stopTicker() {
    if (this.gameTickerId) {
      clearInterval(this.gameTickerId);
      this.gameTickerId = null;
    }
  }

  public cleanup() {
    if (this.resolveTimerId) {
      clearTimeout(this.resolveTimerId);
      this.resolveTimerId = null;
    }
    this.stopTicker();
    this.listeners = [];
  }
}
