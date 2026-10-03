import {GameResult} from '../types/game';
import {ProgressData} from '../types/progress';
import {LevelManager} from './levelManager';
import {EMPTY_STATS, StatisticsManager} from './statisticsManager';

export const EMPTY_PROGRESS: ProgressData = {
  unlockedLevel: 1,
  bestScores: {},
  winsByLevel: {},
  lastWords: {},
  lastLevel: 1,
  stats: EMPTY_STATS,
};

/** Applique le résultat d'une partie. `result.newlyUnlocked` est renseigné ici. */
export function applyResult(
  progress: ProgressData,
  result: GameResult,
): {progress: ProgressData; result: GameResult} {
  const wins = {...progress.winsByLevel};
  if (result.won) {
    wins[result.level] = (wins[result.level] ?? 0) + 1;
  }
  const unlocked = Math.max(progress.unlockedLevel, LevelManager.computeUnlocked(wins));
  const newlyUnlocked = unlocked > progress.unlockedLevel ? unlocked : null;
  const prevBest = progress.bestScores[result.level];
  const finalResult: GameResult = {...result, newlyUnlocked};
  const next: ProgressData = {
    unlockedLevel: unlocked,
    winsByLevel: wins,
    bestScores: {
      ...progress.bestScores,
      [result.level]: prevBest === undefined ? result.score : Math.max(prevBest, result.score),
    },
    lastWords: {...progress.lastWords, [result.level]: result.word},
    lastLevel: result.level,
    stats: StatisticsManager.apply(progress.stats, finalResult, unlocked),
  };
  return {progress: next, result: finalResult};
}

export function toGameResult(g: {
  level: number; word: string; status: string; score: number; errors: number;
  lettersFound: number; totalLetters: number; bonus: number;
}): GameResult {
  return {
    level: g.level,
    word: g.word,
    won: g.status === 'won',
    abandoned: g.status === 'abandoned',
    score: g.score,
    errors: g.errors,
    lettersFound: g.lettersFound,
    totalLetters: g.totalLetters,
    bonus: g.bonus,
    newlyUnlocked: null,
  };
}
