import {STORAGE_KEYS} from '../constants/gameConfig';
import {EMPTY_PROGRESS} from '../logic/progressLogic';
import {EMPTY_STATS} from '../logic/statisticsManager';
import {GameState} from '../types/game';
import {ProgressData, Settings} from '../types/progress';
import {storage} from './storage';

export const DEFAULT_SETTINGS: Settings = {sound: true, vibration: true, animations: true};

export const ProgressRepository = {
  async loadProgress(): Promise<ProgressData> {
    const saved = await storage.getJson<Partial<ProgressData>>(STORAGE_KEYS.PROGRESS);
    // Fusion avec les valeurs par défaut : tolère les versions anciennes/partielles.
    return {
      ...EMPTY_PROGRESS,
      ...saved,
      stats: {...EMPTY_STATS, ...(saved?.stats ?? {})},
    };
  },
  saveProgress: (p: ProgressData) => storage.setJson(STORAGE_KEYS.PROGRESS, p),

  async loadSettings(): Promise<Settings> {
    const saved = await storage.getJson<Partial<Settings>>(STORAGE_KEYS.SETTINGS);
    return {...DEFAULT_SETTINGS, ...saved};
  },
  saveSettings: (s: Settings) => storage.setJson(STORAGE_KEYS.SETTINGS, s),

  loadActiveGame: () => storage.getJson<GameState>(STORAGE_KEYS.ACTIVE_GAME),
  saveActiveGame: (g: GameState) => storage.setJson(STORAGE_KEYS.ACTIVE_GAME, g),
  clearActiveGame: () => storage.remove(STORAGE_KEYS.ACTIVE_GAME),

  async resetProgress(): Promise<void> {
    await storage.remove(STORAGE_KEYS.PROGRESS);
    await storage.remove(STORAGE_KEYS.ACTIVE_GAME);
  },
};
