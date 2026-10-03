import {GameState} from './game';

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  gamesAbandoned: number;
  bestScore: number;
  totalLettersFound: number;
  totalErrors: number;
  maxLevelReached: number;
}

export interface ProgressData {
  unlockedLevel: number;
  bestScores: Record<number, number>;
  winsByLevel: Record<number, number>;
  lastWords: Record<number, string>;
  lastLevel: number;
  stats: Statistics;
}

export interface Settings {
  sound: boolean;
  vibration: boolean;
  animations: boolean;
}

export type ActiveGame = GameState | null;
