/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { GameMode, LevelConfig, SavedGameData, UserPreferences, UserProgression, UserStatistics } from './types/game';
import { storageService } from './game/persistence/storage';
import { soundManager } from './game/engine/sound';
import { Header, ScreenType } from './components/Header';
import { CosmicBackground } from './components/CosmicBackground';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import { GalacticMapScreen } from './screens/GalacticMapScreen';
import { GameScreen } from './screens/GameScreen';
import { StatsScreen } from './screens/StatsScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ThemesScreen } from './screens/ThemesScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TwoPlayerSetupModal } from './screens/TwoPlayerSetupModal';
import { SECTORS } from './game/data/levels';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [preferences, setPreferences] = useState<UserPreferences>(storageService.getPreferences());
  const [progression, setProgression] = useState<UserProgression>(storageService.getProgression());
  const [statistics, setStatistics] = useState<UserStatistics>(storageService.getStatistics());
  const [savedGame, setSavedGame] = useState<SavedGameData | null>(storageService.getSavedGame());

  // Retro Arcade Splash screen state: open on first session visit or when requested
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('astra_splash_dismissed');
  });

  // Game launch parameters
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('classic');
  const [activeLevelConfig, setActiveLevelConfig] = useState<LevelConfig | undefined>(undefined);
  const [activeSavedGame, setActiveSavedGame] = useState<SavedGameData | null>(null);
  const [isTwoPlayerModalOpen, setIsTwoPlayerModalOpen] = useState<boolean>(false);
  const [customMultiplayer, setCustomMultiplayer] = useState<{
    player1Name: string;
    player2Name: string;
    pairsCount: number;
  } | undefined>(undefined);

  // Sync sound settings with preferences
  useEffect(() => {
    soundManager.setEnabled(preferences.soundEnabled);
    soundManager.setVolume(preferences.soundVolume);
  }, [preferences.soundEnabled, preferences.soundVolume]);

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = storageService.savePreferences(updates);
    setPreferences(updated);
  };

  const handleSavePlayerName = (name: string) => {
    handleUpdatePreferences({ playerName: name });
  };

  const handleDismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('astra_splash_dismissed', '1');
  };

  const handleToggleSound = () => {
    const nextState = !preferences.soundEnabled;
    handleUpdatePreferences({ soundEnabled: nextState });
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    // Check if saved game changed
    setSavedGame(storageService.getSavedGame());
  };

  // Launch fresh Campaign / Galactic Map
  const handleStartCampaign = () => {
    setCurrentScreen('map');
  };

  // Launch specific level from Galactic Map
  const handleSelectLevel = (level: LevelConfig) => {
    setActiveGameMode('classic');
    setActiveLevelConfig(level);
    setActiveSavedGame(null);
    setCustomMultiplayer(undefined);
    setCurrentScreen('game');
  };

  // Launch specific solo arcade mode
  const handleSelectMode = (mode: GameMode) => {
    setActiveGameMode(mode);
    setActiveLevelConfig(undefined);
    setActiveSavedGame(null);
    setCustomMultiplayer(undefined);
    setCurrentScreen('game');
  };

  // Launch 2-player local duel
  const handleStartTwoPlayerMatch = (p1Name: string, p2Name: string, pairsCount: number) => {
    setIsTwoPlayerModalOpen(false);
    setActiveGameMode('two_players');
    setActiveLevelConfig(undefined);
    setActiveSavedGame(null);
    setCustomMultiplayer({
      player1Name: p1Name,
      player2Name: p2Name,
      pairsCount,
    });
    // Persist player 1 name as the user's primary name
    if (p1Name) {
      handleSavePlayerName(p1Name);
    }
    setCurrentScreen('game');
  };

  // Resume saved game
  const handleResumeSavedGame = () => {
    const saved = storageService.getSavedGame();
    if (saved) {
      setActiveGameMode(saved.mode);
      setActiveSavedGame(saved);
      setActiveLevelConfig(SECTORS.flatMap((s) => s.levels).find((l) => l.id === saved.levelId));
      setCurrentScreen('game');
    }
  };

  const handleResetAllData = () => {
    storageService.resetAllProgress();
    setProgression(storageService.getProgression());
    setStatistics(storageService.getStatistics());
    setSavedGame(null);
    setCurrentScreen('home');
  };

  const today = new Date().toISOString().slice(0, 10);
  const dailyCompletedToday = Boolean(progression.dailyChallengeHistory[today]?.completed);

  return (
    <div
      className={`relative min-h-screen flex flex-col ${
        preferences.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Cosmic Animated Starfield Background */}
      <CosmicBackground reducedMotion={preferences.reducedMotion} />

      {/* Top Bar Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        soundEnabled={preferences.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Screen Router */}
      <main className="relative z-10 flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            progression={progression}
            statistics={statistics}
            savedGame={savedGame}
            playerName={preferences.playerName}
            onUpdatePlayerName={handleSavePlayerName}
            onOpenSplash={() => setShowSplash(true)}
            onNavigate={handleNavigate}
            onResumeSavedGame={handleResumeSavedGame}
            onStartCampaign={handleStartCampaign}
            onOpenTwoPlayer={() => setIsTwoPlayerModalOpen(true)}
          />
        )}

        {currentScreen === 'modes' && (
          <ModeSelectScreen
            onSelectMode={handleSelectMode}
            onOpenTwoPlayer={() => setIsTwoPlayerModalOpen(true)}
            dailyCompletedToday={dailyCompletedToday}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'map' && (
          <GalacticMapScreen
            progression={progression}
            onSelectLevel={handleSelectLevel}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'game' && (
          <GameScreen
            mode={activeGameMode}
            levelConfig={activeLevelConfig}
            customMultiplayerConfig={customMultiplayer}
            initialSavedGame={activeSavedGame}
            preferences={preferences}
            progression={progression}
            statistics={statistics}
            onUpdateProgression={setProgression}
            onUpdateStatistics={setStatistics}
            onGoToMap={() => setCurrentScreen('map')}
            onGoHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'stats' && (
          <StatsScreen
            statistics={statistics}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'achievements' && (
          <AchievementsScreen
            progression={progression}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'themes' && (
          <ThemesScreen
            preferences={preferences}
            progression={progression}
            onUpdatePreferences={handleUpdatePreferences}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'tutorial' && (
          <TutorialScreen onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onResetAllData={handleResetAllData}
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>

      {/* 2-Player Local Duel Setup Modal */}
      <TwoPlayerSetupModal
        isOpen={isTwoPlayerModalOpen}
        defaultP1Name={preferences.playerName}
        onClose={() => setIsTwoPlayerModalOpen(false)}
        onStartMatch={handleStartTwoPlayerMatch}
      />

      {/* Retro Arcade Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen
          initialPlayerName={preferences.playerName}
          onSavePlayerName={handleSavePlayerName}
          onStartGame={handleDismissSplash}
        />
      )}
    </div>
  );
}
