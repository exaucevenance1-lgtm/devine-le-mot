import {GameResult} from '../types/game';
import {Statistics} from '../types/progress';

export const EMPTY_STATS: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesAbandoned: 0,
  bestScore: 0,
  totalLettersFound: 0,
  totalErrors: 0,
  maxLevelReached: 1,
};

export const StatisticsManager = {
  apply(stats: Statistics, result: GameResult, unlockedLevel: number): Statistics {
    return {
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (result.won ? 1 : 0),
      gamesAbandoned: stats.gamesAbandoned + (result.abandoned ? 1 : 0),
      bestScore: stats.gamesPlayed === 0 ? result.score : Math.max(stats.bestScore, result.score),
      totalLettersFound: stats.totalLettersFound + result.lettersFound,
      totalErrors: stats.totalErrors + result.errors,
      maxLevelReached: Math.max(stats.maxLevelReached, unlockedLevel),
    };
  },
};
