import {GAME_CONFIG} from '../constants/gameConfig';

export interface ScoreRules {
  initial: number;
  correct: number;
  wrong: number;
  completionBonus: number;
}

export const DEFAULT_RULES: ScoreRules = {
  initial: GAME_CONFIG.INITIAL_SCORE,
  correct: GAME_CONFIG.CORRECT_LETTER_POINTS,
  wrong: GAME_CONFIG.WRONG_LETTER_POINTS,
  completionBonus: GAME_CONFIG.BONUS_COMPLETION,
};

/** Le score peut devenir négatif : aucune borne basse. */
export const ScoreManager = {
  initial: (rules: ScoreRules = DEFAULT_RULES): number => rules.initial,
  onCorrect: (score: number, rules: ScoreRules = DEFAULT_RULES): number => score + rules.correct,
  onWrong: (score: number, rules: ScoreRules = DEFAULT_RULES): number => score - rules.wrong,
  onCompletion: (score: number, rules: ScoreRules = DEFAULT_RULES): number =>
    score + rules.completionBonus,
};
