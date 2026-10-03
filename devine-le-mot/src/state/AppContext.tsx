import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {applyResult, EMPTY_PROGRESS} from '../logic/progressLogic';
import {DEFAULT_SETTINGS, ProgressRepository} from '../services/progressRepository';
import {feedback} from '../services/feedbackService';
import {GameResult, GameState} from '../types/game';
import {ProgressData, Settings} from '../types/progress';

interface AppContextValue {
  loaded: boolean;
  progress: ProgressData;
  settings: Settings;
  activeGame: GameState | null;
  updateSettings: (patch: Partial<Settings>) => void;
  /** Enregistre une partie terminée et renvoie le résultat enrichi (déblocage). */
  recordResult: (result: GameResult) => GameResult;
  saveActiveGame: (game: GameState) => void;
  clearActiveGame: () => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState<ProgressData>(EMPTY_PROGRESS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activeGame, setActiveGame] = useState<GameState | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, s, g] = await Promise.all([
        ProgressRepository.loadProgress(),
        ProgressRepository.loadSettings(),
        ProgressRepository.loadActiveGame(),
      ]);
      if (!alive) {
        return;
      }
      setProgress(p);
      setSettings(s);
      setActiveGame(g && g.status === 'playing' ? g : null);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    feedback.configure({sound: settings.sound, vibration: settings.vibration});
  }, [settings.sound, settings.vibration]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings(prev => {
      const next = {...prev, ...patch};
      ProgressRepository.saveSettings(next);
      return next;
    });
  }, []);

  const recordResult = useCallback((result: GameResult): GameResult => {
    const applied = applyResult(progressRef.current, result);
    progressRef.current = applied.progress;
    setProgress(applied.progress);
    ProgressRepository.saveProgress(applied.progress);
    ProgressRepository.clearActiveGame();
    setActiveGame(null);
    return applied.result;
  }, []);

  const saveActiveGame = useCallback((game: GameState) => {
    setActiveGame(game);
    ProgressRepository.saveActiveGame(game);
  }, []);

  const clearActiveGame = useCallback(() => {
    setActiveGame(null);
    ProgressRepository.clearActiveGame();
  }, []);

  const resetProgress = useCallback(() => {
    progressRef.current = EMPTY_PROGRESS;
    setProgress(EMPTY_PROGRESS);
    setActiveGame(null);
    ProgressRepository.resetProgress();
  }, []);

  const value = useMemo(
    () => ({loaded, progress, settings, activeGame, updateSettings, recordResult, saveActiveGame, clearActiveGame, resetProgress}),
    [loaded, progress, settings, activeGame, updateSettings, recordResult, saveActiveGame, clearActiveGame, resetProgress],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp doit être utilisé dans <AppProvider>');
  }
  return ctx;
}
