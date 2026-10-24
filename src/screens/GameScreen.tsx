/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  GameMode,
  GameState,
  LevelConfig,
  Player,
  SavedGameData,
  UserPreferences,
  UserProgression,
  UserStatistics,
} from '../types/game';
import { GameEngine, GameEngineState } from '../game/engine/gameEngine';
import { generateBoard, getDailyChallengeConfig } from '../game/engine/boardGenerator';
import { soundManager } from '../game/engine/sound';
import { storageService } from '../game/persistence/storage';
import { Hud } from '../components/Hud';
import { GameBoard } from '../components/GameBoard';
import { ParticleSystem, ParticleSystemRef } from '../components/ParticleSystem';
import { ResultsModal } from './ResultsModal';
import { Play, RotateCcw, ArrowLeft } from 'lucide-react';
import { ALL_LEVELS } from '../game/data/levels';
import { calculatePilotRank } from '../game/data/achievements';
import { RankBadge } from '../components/RankBadge';

interface GameScreenProps {
  mode: GameMode;
  levelConfig?: LevelConfig;
  customMultiplayerConfig?: {
    player1Name: string;
    player2Name: string;
    pairsCount: number;
  };
  initialSavedGame?: SavedGameData | null;
  preferences: UserPreferences;
  progression: UserProgression;
  statistics: UserStatistics;
  onUpdateProgression: (updated: UserProgression) => void;
  onUpdateStatistics: (updated: UserStatistics) => void;
  onGoToMap: () => void;
  onGoHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  levelConfig,
  customMultiplayerConfig,
  initialSavedGame,
  preferences,
  progression,
  statistics,
  onUpdateProgression,
  onUpdateStatistics,
  onGoToMap,
  onGoHome,
}) => {
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [engineState, setEngineState] = useState<GameEngineState | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultStars, setResultStars] = useState<number>(0);
  const [resultXp, setResultXp] = useState<number>(0);
  const [isPersonalBest, setIsPersonalBest] = useState<boolean>(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [turnBannerPlayer, setTurnBannerPlayer] = useState<Player | null>(null);
  const [newRankUnlocked, setNewRankUnlocked] = useState<{ title: string; level: number } | null>(null);

  const particleRef = useRef<ParticleSystemRef>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);

  // Initialize or restore the engine
  const initGame = useCallback(() => {
    let pairsCount = levelConfig?.pairsCount || 8;
    let timeLimit: number | undefined = levelConfig?.timeLimitSeconds;
    let movesLimit: number | undefined = levelConfig?.movesLimit;
    let memorizeSeconds: number | undefined = levelConfig?.memorizeDurationSeconds;
    let isMultiplayer = mode === 'two_players';

    let players: Player[] = [
      {
        id: 1,
        name: customMultiplayerConfig?.player1Name || preferences.playerName || 'Jugador 1',
        avatar: 'astro_1',
        score: 0,
        pairsFound: 0,
        color: '#22d3ee', // Cyan
      },
      {
        id: 2,
        name: customMultiplayerConfig?.player2Name || 'Jugador 2',
        avatar: 'astro_2',
        score: 0,
        pairsFound: 0,
        color: '#f43f5e', // Rose
      },
    ];

    if (customMultiplayerConfig) {
      pairsCount = customMultiplayerConfig.pairsCount;
      timeLimit = undefined;
      movesLimit = undefined;
    } else if (mode === 'daily_challenge') {
      const daily = getDailyChallengeConfig();
      pairsCount = daily.pairsCount;
      timeLimit = daily.timeLimitSeconds;
      movesLimit = daily.movesLimit;
    } else if (mode === 'extreme_memory') {
      memorizeSeconds = 5;
    } else if (mode === 'time_attack' && !timeLimit) {
      timeLimit = 60;
    } else if (mode === 'moves_limit' && !movesLimit) {
      movesLimit = 24;
    }

    // Check if resuming from saved game
    if (initialSavedGame) {
      const restoredState: GameEngineState = {
        gameId: `game-restored-${Date.now()}`,
        operationToken: 1,
        mode: initialSavedGame.mode,
        levelId: initialSavedGame.levelId,
        gameState: initialSavedGame.gameState === 'paused' ? 'playing' : initialSavedGame.gameState,
        cards: initialSavedGame.cards,
        flippedCardIds: initialSavedGame.flippedCardIds || [],
        matchedPairIds: initialSavedGame.matchedPairIds || [],
        moves: initialSavedGame.moves,
        score: initialSavedGame.score,
        comboStreak: initialSavedGame.comboStreak,
        highestCombo: initialSavedGame.highestCombo,
        elapsedMs: initialSavedGame.elapsedMs,
        timeRemainingSeconds: initialSavedGame.timeRemainingSeconds,
        movesRemaining: initialSavedGame.movesRemaining,
        isMultiplayer: initialSavedGame.isMultiplayer,
        players: initialSavedGame.players || players,
        activePlayerIndex: initialSavedGame.activePlayerIndex || 0,
        initialPairsCount: initialSavedGame.initialPairsCount,
      };

      const newEngine = new GameEngine(restoredState);
      setEngine(newEngine);
      setEngineState(restoredState);
      return newEngine;
    }

    // Generate fresh board
    const cards = generateBoard({
      pairsCount,
      symbolTheme: preferences.symbolTheme === 'celestial' ? 'planet' : 'all',
      allFlippedInitial: mode === 'extreme_memory',
    });

    const freshState: GameEngineState = {
      gameId: `game-${Date.now()}`,
      operationToken: 1,
      mode,
      levelId: levelConfig?.id || 'arcade-custom',
      gameState: mode === 'extreme_memory' ? 'memorizing' : 'playing',
      cards,
      flippedCardIds: [],
      matchedPairIds: [],
      moves: 0,
      score: 0,
      comboStreak: 0,
      highestCombo: 0,
      elapsedMs: 0,
      timeRemainingSeconds: timeLimit,
      movesRemaining: movesLimit,
      memorizeSecondsRemaining: memorizeSeconds,
      isMultiplayer,
      players,
      activePlayerIndex: 0,
      initialPairsCount: pairsCount,
    };

    const newEngine = new GameEngine(freshState);
    setEngine(newEngine);
    setEngineState(freshState);
    setShowResults(false);
    return newEngine;
  }, [mode, levelConfig, customMultiplayerConfig, initialSavedGame, preferences.symbolTheme, preferences.playerName]);

  // Handle Match Victory / Loss Processing
  const handleGameEnd = useCallback(
    (finalState: GameEngineState, isVictory: boolean) => {
      storageService.clearSavedGame();

      const elapsedSecs = Math.round(finalState.elapsedMs / 1000);
      const accuracy =
        finalState.moves > 0
          ? Math.min(100, Math.round((finalState.initialPairsCount / finalState.moves) * 100))
          : 100;

      if (isVictory && particleRef.current) {
        particleRef.current.triggerVictoryCelebration();
      }

      // 1. Calculate Stars
      let stars = 0;
      if (isVictory) {
        stars = 1;
        if (levelConfig) {
          if (finalState.moves <= levelConfig.threeStarMoves) stars++;
          if (elapsedSecs <= levelConfig.threeStarSeconds) stars++;
        } else {
          if (accuracy >= 65) stars++;
          if (elapsedSecs <= 40) stars++;
        }
      }
      setResultStars(stars);

      // 2. Calculate XP
      let xp = 0;
      if (isVictory) {
        xp = levelConfig?.xpReward || (finalState.mode === 'daily_challenge' ? 400 : 200);
        xp += stars * 35;
      }
      setResultXp(xp);

      // 3. Update Progression
      const currentProg = storageService.getProgression();
      let pb = false;

      const prevRank = calculatePilotRank(currentProg.xp);
      const newRank = calculatePilotRank(currentProg.xp + xp);
      if (newRank.level > prevRank.level) {
        soundManager.playRankUp();
        setNewRankUnlocked(newRank);
      }

      const newProg: UserProgression = {
        ...currentProg,
        xp: currentProg.xp + xp,
        pilotRank: newRank.title,
        rankLevel: newRank.level,
      };

      if (levelConfig && isVictory) {
        const prevLevelData = currentProg.levelProgress[levelConfig.id];
        const prevStars = prevLevelData?.stars || 0;
        const prevBestScore = prevLevelData?.bestScore || 0;

        if (finalState.score > prevBestScore) {
          pb = true;
        }

        newProg.levelProgress = {
          ...currentProg.levelProgress,
          [levelConfig.id]: {
            stars: Math.max(prevStars, stars),
            bestScore: Math.max(prevBestScore, finalState.score),
            bestTimeSeconds: prevLevelData
              ? Math.min(prevLevelData.bestTimeSeconds, elapsedSecs)
              : elapsedSecs,
            bestMoves: prevLevelData ? Math.min(prevLevelData.bestMoves, finalState.moves) : finalState.moves,
            completedCount: (prevLevelData?.completedCount || 0) + 1,
          },
        };

        const currentIdx = ALL_LEVELS.findIndex((l) => l.id === levelConfig.id);
        if (currentIdx !== -1 && currentIdx + 1 < ALL_LEVELS.length) {
          const nextLvl = ALL_LEVELS[currentIdx + 1];
          if (!newProg.unlockedLevels.includes(nextLvl.id)) {
            newProg.unlockedLevels = [...newProg.unlockedLevels, nextLvl.id];
          }
        }
      }

      if (finalState.mode === 'daily_challenge' && isVictory) {
        const today = new Date().toISOString().slice(0, 10);
        newProg.dailyChallengeHistory = {
          ...currentProg.dailyChallengeHistory,
          [today]: {
            date: today,
            completed: true,
            score: finalState.score,
            moves: finalState.moves,
            timeSeconds: elapsedSecs,
            completedAt: Date.now(),
          },
        };
      }

      setIsPersonalBest(pb);

      // 4. Update Statistics
      const currentStats = storageService.getStatistics();
      const updatedModeStats = { ...currentStats.modeStats };
      const mStats = updatedModeStats[finalState.mode] || {
        started: 0,
        won: 0,
        bestScore: 0,
        bestTimeSeconds: 0,
      };

      mStats.started += 1;
      if (isVictory) {
        mStats.won += 1;
        mStats.bestScore = Math.max(mStats.bestScore, finalState.score);
        mStats.bestTimeSeconds =
          mStats.bestTimeSeconds > 0
            ? Math.min(mStats.bestTimeSeconds, elapsedSecs)
            : elapsedSecs;
      }
      updatedModeStats[finalState.mode] = mStats;

      const updatedTwoPlayer = { ...currentStats.twoPlayerStats };
      if (finalState.isMultiplayer && finalState.players.length >= 2) {
        updatedTwoPlayer.totalMatches += 1;
        const p1 = finalState.players[0];
        const p2 = finalState.players[1];
        if (p1.score > p2.score) updatedTwoPlayer.p1Wins += 1;
        else if (p2.score > p1.score) updatedTwoPlayer.p2Wins += 1;
        else updatedTwoPlayer.ties += 1;
      }

      const newStats: UserStatistics = {
        ...currentStats,
        gamesCompleted: currentStats.gamesCompleted + 1,
        gamesWon: isVictory ? currentStats.gamesWon + 1 : currentStats.gamesWon,
        gamesLost: !isVictory ? currentStats.gamesLost + 1 : currentStats.gamesLost,
        totalTimePlayedSeconds: currentStats.totalTimePlayedSeconds + elapsedSecs,
        totalMoves: currentStats.totalMoves + finalState.moves,
        totalPairsFound: currentStats.totalPairsFound + finalState.matchedPairIds.length,
        currentWinStreak: isVictory ? currentStats.currentWinStreak + 1 : 0,
        highestWinStreak: isVictory
          ? Math.max(currentStats.highestWinStreak, currentStats.currentWinStreak + 1)
          : currentStats.highestWinStreak,
        modeStats: updatedModeStats,
        twoPlayerStats: updatedTwoPlayer,
        recentMatches: [
          {
            id: `match-${Date.now()}`,
            timestamp: Date.now(),
            mode: finalState.mode,
            levelId: finalState.levelId,
            victory: isVictory,
            score: finalState.score,
            moves: finalState.moves,
            timeSeconds: elapsedSecs,
            accuracy,
            isMultiplayer: finalState.isMultiplayer,
            winnerName: finalState.isMultiplayer
              ? finalState.players[0].score > finalState.players[1].score
                ? finalState.players[0].name
                : finalState.players[1].name
              : undefined,
          },
          ...currentStats.recentMatches.slice(0, 19),
        ],
      };

      // 5. Evaluate Achievements
      const newlyUnlocked: string[] = [];
      const ach = { ...newProg.achievements };

      if (isVictory && !ach.first_contact?.unlocked) {
        ach.first_contact = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Primer Contacto');
      }

      if (isVictory && accuracy >= 75 && !ach.perfectionist?.unlocked) {
        ach.perfectionist = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Precisión Orbital');
      }

      if (
        isVictory &&
        finalState.mode === 'time_attack' &&
        (finalState.timeRemainingSeconds || 0) >= 15 &&
        !ach.speed_demon?.unlocked
      ) {
        ach.speed_demon = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Salto Hiperespacial');
      }

      if (
        isVictory &&
        finalState.mode === 'moves_limit' &&
        (finalState.movesRemaining || 0) >= 4 &&
        !ach.iron_will?.unlocked
      ) {
        ach.iron_will = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Maniobra Eficiente');
      }

      if (isVictory && finalState.mode === 'extreme_memory' && !ach.photographic_mind?.unlocked) {
        ach.photographic_mind = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Memoria Fotográfica');
      }

      if (isVictory && finalState.mode === 'daily_challenge' && !ach.daily_explorer?.unlocked) {
        ach.daily_explorer = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Pionero Diario');
      }

      if (finalState.isMultiplayer && !ach.duelist?.unlocked) {
        ach.duelist = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Duelo en Gravedad Cero');
      }

      if (finalState.highestCombo >= 3 && !ach.combo_master?.unlocked) {
        ach.combo_master = { unlocked: true, unlockedAt: Date.now(), progress: 1 };
        newlyUnlocked.push('Ráfaga de Pulso');
      }

      if (newStats.totalPairsFound >= 50 && !ach.galactic_ace?.unlocked) {
        ach.galactic_ace = { unlocked: true, unlockedAt: Date.now(), progress: 50 };
        newlyUnlocked.push('Archivero Cósmico');
      }

      if (newStats.currentWinStreak >= 3 && !ach.streak_master?.unlocked) {
        ach.streak_master = { unlocked: true, unlockedAt: Date.now(), progress: 3 };
        newlyUnlocked.push('Racha Estelar');
      }

      newProg.achievements = ach;
      setUnlockedAchievements(newlyUnlocked);

      storageService.saveProgression(newProg);
      storageService.saveStatistics(newStats);
      onUpdateProgression(newProg);
      onUpdateStatistics(newStats);

      setShowResults(true);
    },
    [levelConfig, onUpdateProgression, onUpdateStatistics]
  );

  // Setup game engine subscription and timers
  useEffect(() => {
    const activeEngine = initGame();

    const unsubscribe = activeEngine.subscribe((event) => {
      setEngineState({ ...activeEngine.getState() });

      switch (event.type) {
        case 'CARD_FLIPPED':
          soundManager.playCardFlip();
          break;
        case 'MATCH_SUCCESS': {
          soundManager.playMatchSuccess(event.combo);

          // Subtle tactile screen shake on match
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 200);

          // Spawn particle explosion & floating score in center of board
          if (particleRef.current && boardWrapperRef.current) {
            const rect = boardWrapperRef.current.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            particleRef.current.triggerMatchExplosion(centerX, centerY, '#38bdf8');

            const scoreText = event.combo > 1 ? `+${100 + (event.combo - 1) * 50} COMBO x${event.combo}!` : '+100 PTS';
            particleRef.current.triggerScorePopup(scoreText, centerX, centerY, event.combo > 1);
          }

          // Auto-save on matched pair
          storageService.saveActiveGame({
            version: 1,
            savedAt: Date.now(),
            ...activeEngine.getState(),
          });
          break;
        }
        case 'MATCH_FAIL':
          soundManager.playMatchFail();
          break;
        case 'TURN_SWITCH': {
          soundManager.playTurnSwitch();
          const pList = activeEngine.getState().players;
          const nextP = pList[event.newActivePlayerIndex];
          if (nextP) {
            setTurnBannerPlayer(nextP);
            setTimeout(() => setTurnBannerPlayer(null), 1800);
          }
          break;
        }
        case 'GAME_WON':
          soundManager.playVictory();
          handleGameEnd(activeEngine.getState(), true);
          break;
        case 'GAME_LOST':
          soundManager.playDefeat();
          handleGameEnd(activeEngine.getState(), false);
          break;
      }
    });

    // 1-second ticker loop
    tickerRef.current = setInterval(() => {
      activeEngine.tick(1);
      const st = activeEngine.getState();
      setEngineState({ ...st });

      if (st.timeRemainingSeconds !== undefined && st.timeRemainingSeconds <= 5 && st.timeRemainingSeconds > 0) {
        soundManager.playTimerWarning();
      }
    }, 1000);

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
      unsubscribe();
      activeEngine.cleanup();
    };
  }, [initGame, handleGameEnd]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && engine) {
        const curr = engine.getState();
        if (curr.gameState === 'playing') {
          engine.pause();
          setEngineState({ ...engine.getState() });
        } else if (curr.gameState === 'paused') {
          engine.resume();
          setEngineState({ ...engine.getState() });
        }
      }

      if ((e.key === 'r' || e.key === 'R') && engine) {
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  const handleCardClick = (cardId: string) => {
    if (!engine) return;
    engine.flipCard(cardId, 850);
    setEngineState({ ...engine.getState() });
  };

  const handlePause = () => {
    if (!engine) return;
    engine.pause();
    setEngineState({ ...engine.getState() });
  };

  const handleResume = () => {
    if (!engine) return;
    engine.resume();
    setEngineState({ ...engine.getState() });
  };

  const handleRestart = () => {
    if (!engine) return;
    storageService.clearSavedGame();
    setShowResults(false);

    let pairsCount = engine.getState().initialPairsCount;
    const cards = generateBoard({
      pairsCount,
      symbolTheme: preferences.symbolTheme === 'celestial' ? 'planet' : 'all',
      allFlippedInitial: mode === 'extreme_memory',
    });

    engine.restart(cards, {
      timeRemainingSeconds: levelConfig?.timeLimitSeconds,
      movesRemaining: levelConfig?.movesLimit,
      memorizeSecondsRemaining: mode === 'extreme_memory' ? 5 : undefined,
    });

    setEngineState({ ...engine.getState() });
  };

  const handleNextLevel = () => {
    if (!levelConfig) return;
    const currentIdx = ALL_LEVELS.findIndex((l) => l.id === levelConfig.id);
    if (currentIdx !== -1 && currentIdx + 1 < ALL_LEVELS.length) {
      const nextLvl = ALL_LEVELS[currentIdx + 1];
      storageService.clearSavedGame();
      window.location.hash = `#level-${nextLvl.id}`;
      window.location.reload();
    } else {
      onGoToMap();
    }
  };

  if (!engineState) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-xs sm:text-sm font-arcade text-cyan-400 animate-pulse">CARGANDO SENSORES ESPACIALES...</p>
      </div>
    );
  }

  const isBoardDisabled =
    engineState.gameState === 'resolving' ||
    engineState.gameState === 'memorizing' ||
    engineState.gameState === 'paused' ||
    engineState.gameState === 'won' ||
    engineState.gameState === 'lost';

  const elapsedSeconds = Math.round(engineState.elapsedMs / 1000);

  return (
    <div className="w-full h-[calc(100dvh-54px)] max-h-[calc(100dvh-54px)] max-w-6xl mx-auto px-2 sm:px-4 py-1 sm:py-2 flex flex-col justify-between items-center overflow-hidden">
      {/* 2-Player Turn Switch Notification Alert Banner */}
      {turnBannerPlayer && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div
            className="px-5 py-2.5 rounded-2xl bg-slate-950/95 border-2 shadow-[0_0_35px_rgba(34,211,238,0.7)] flex items-center gap-3 backdrop-blur-xl"
            style={{ borderColor: turnBannerPlayer.color }}
          >
            <span className="w-3.5 h-3.5 rounded-full animate-ping" style={{ backgroundColor: turnBannerPlayer.color }} />
            <span className="font-arcade text-xs sm:text-sm tracking-wider uppercase text-white">
              ¡TURNO DE {turnBannerPlayer.name}!
            </span>
          </div>
        </div>
      )}

      {/* Rank Up Celebration Popup */}
      {newRankUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border-2 border-amber-400 p-6 text-center shadow-[0_0_40px_rgba(251,191,36,0.6)]">
            <div className="flex justify-center mb-3">
              <RankBadge level={newRankUnlocked.level} title={newRankUnlocked.title} size="lg" />
            </div>
            <span className="text-[10px] font-arcade text-amber-400 uppercase tracking-widest">
              ¡NUEVO RANGO ALCANZADO!
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-1 mb-2">
              {newRankUnlocked.title}
            </h3>
            <p className="text-xs text-slate-300 font-mono mb-5">
              Has demostrado gran maestría en la memoria estelar. ¡Insignia de rango {newRankUnlocked.level} otorgada!
            </p>
            <button
              type="button"
              onClick={() => setNewRankUnlocked(null)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-arcade text-xs font-bold transition-colors shadow-lg cursor-pointer"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      )}

      {/* Top Arcade Breadcrumb & Mode Tag */}
      <div className="w-full max-w-5xl shrink-0 mb-1 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            if (engine) engine.pause();
            onGoHome();
          }}
          className="font-arcade text-[9px] sm:text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
        >
          <span>◄ VOLVER</span>
        </button>

        <span className="font-arcade text-[9px] sm:text-[10px] text-cyan-400/90 tracking-wider uppercase">
          {levelConfig?.name || (mode === 'daily_challenge' ? 'DESAFÍO DIARIO' : mode === 'two_players' ? 'DUELO 2 JUGADORES' : 'ARCADE')}
        </span>
      </div>

      {/* Retro Arcade HUD */}
      <div className="w-full shrink-0">
        <Hud
          mode={engineState.mode}
          gameState={engineState.gameState}
          moves={engineState.moves}
          movesRemaining={engineState.movesRemaining}
          elapsedSeconds={elapsedSeconds}
          timeRemainingSeconds={engineState.timeRemainingSeconds}
          pairsFound={engineState.matchedPairIds.length}
          totalPairs={engineState.initialPairsCount}
          score={engineState.score}
          comboStreak={engineState.comboStreak}
          isMultiplayer={engineState.isMultiplayer}
          players={engineState.players}
          activePlayerIndex={engineState.activePlayerIndex}
          lastMatchedFact={engineState.lastMatchedFact}
          memorizeSecondsRemaining={engineState.memorizeSecondsRemaining}
          onPause={handlePause}
          onResume={handleResume}
          onRestart={handleRestart}
        />
      </div>

      {/* Prominent Game Board Arena with Particles and Glow */}
      <div
        ref={boardWrapperRef}
        className="relative w-full flex-1 min-h-0 flex items-center justify-center my-auto overflow-hidden p-1 sm:p-2"
      >
        <GameBoard
          cards={engineState.cards}
          onCardClick={handleCardClick}
          disabled={isBoardDisabled}
          theme={preferences.cardBackTheme}
          highContrast={preferences.highContrast}
          isShaking={isShaking}
        />

        {/* Canvas Particle Overlay for Explosions and Floating Scores */}
        <ParticleSystem ref={particleRef} reducedMotion={preferences.reducedMotion} />

        {/* Pause Overlay */}
        {engineState.gameState === 'paused' && (
          <div className="absolute inset-0 z-50 rounded-2xl bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <h2 className="text-xl sm:text-2xl font-bold font-arcade text-white mb-2">MISIÓN EN PAUSA</h2>
            <p className="text-xs text-slate-400 mb-6 max-w-xs font-mono">
              Los cronómetros orbitales están detenidos. Reanuda cuando estés listo.
            </p>
            <div className="flex flex-col gap-2.5 w-52">
              <button
                type="button"
                onClick={handleResume}
                className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-arcade text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>REANUDAR</span>
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-arcade text-[10px] flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REINICIAR TABLERO</span>
              </button>
              <button
                type="button"
                onClick={onGoToMap}
                className="py-2 text-[10px] font-arcade text-slate-400 hover:text-white transition-colors"
              >
                SALIR AL MAPA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Modal */}
      {showResults && (
        <ResultsModal
          victory={engineState.gameState === 'won'}
          defeatReason={
            engineState.timeRemainingSeconds !== undefined && engineState.timeRemainingSeconds <= 0
              ? 'time_up'
              : 'moves_exhausted'
          }
          mode={engineState.mode}
          levelName={levelConfig?.name}
          score={engineState.score}
          moves={engineState.moves}
          elapsedSeconds={elapsedSeconds}
          timeRemainingSeconds={engineState.timeRemainingSeconds}
          pairsFound={engineState.matchedPairIds.length}
          totalPairs={engineState.initialPairsCount}
          starsEarned={resultStars}
          xpEarned={resultXp}
          isPersonalBest={isPersonalBest}
          unlockedAchievements={unlockedAchievements}
          isMultiplayer={engineState.isMultiplayer}
          players={engineState.players}
          hasNextLevel={Boolean(levelConfig)}
          onReplay={handleRestart}
          onNextLevel={handleNextLevel}
          onGoToMap={onGoToMap}
          onGoHome={onGoHome}
        />
      )}
    </div>
  );
};
