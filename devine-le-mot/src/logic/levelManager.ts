import {LEVELS, TOTAL_LEVELS} from '../constants/levels';
import {LevelConfig} from '../types/game';
import {ProgressData} from '../types/progress';

export const LevelManager = {
  get(level: number): LevelConfig {
    return LEVELS[Math.min(Math.max(level, 1), TOTAL_LEVELS) - 1];
  },

  isUnlocked(progress: ProgressData, level: number): boolean {
    return level >= 1 && level <= progress.unlockedLevel;
  },

  /** Plus haut niveau débloqué d'après les victoires par niveau. */
  computeUnlocked(wins: Record<number, number>): number {
    let unlocked = 1;
    while (
      unlocked < TOTAL_LEVELS &&
      (wins[unlocked] ?? 0) >= LevelManager.get(unlocked).winsToUnlockNext
    ) {
      unlocked += 1;
    }
    return unlocked;
  },

  unlockCondition(level: number): string {
    const prev = LevelManager.get(level - 1);
    return `Gagne ${prev.winsToUnlockNext} parties au niveau ${prev.id}`;
  },
};
