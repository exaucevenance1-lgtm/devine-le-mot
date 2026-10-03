import {GameState, GuessResult} from '../types/game';
import {baseLetter} from '../utils/text';
import {DEFAULT_RULES, ScoreManager, ScoreRules} from './scoreManager';

/**
 * Gestion des accents : le clavier affiche A-Z. Choisir "E" révèle toutes les
 * occurrences de É, È, Ê, Ë et E. Idem pour A (À Â Ä), C (Ç), I (Î Ï), O (Ô Ö), U (Ù Û Ü).
 */
export const GameEngine = {
  create(level: number, word: string, rules: ScoreRules = DEFAULT_RULES): GameState {
    const chars = word.toUpperCase().split('');
    const keys = chars.map(baseLetter);
    return {
      level,
      word: chars.join(''),
      chars,
      keys,
      revealed: chars.map(() => false),
      guessed: {},
      score: ScoreManager.initial(rules),
      errors: 0,
      lettersFound: 0,
      totalLetters: new Set(keys).size,
      bonus: 0,
      status: 'playing',
    };
  },

  guess(state: GameState, letter: string, rules: ScoreRules = DEFAULT_RULES): GuessResult {
    const key = baseLetter(letter);
    const ignoredResult: GuessResult = {
      state,
      ignored: true,
      correct: false,
      delta: 0,
      bonusAwarded: 0,
      revealedIndices: [],
    };
    if (state.status !== 'playing' || state.guessed[key]) {
      return ignoredResult;
    }

    const indices: number[] = [];
    state.keys.forEach((k, i) => {
      if (k === key) {
        indices.push(i);
      }
    });

    if (indices.length === 0) {
      const next: GameState = {
        ...state,
        guessed: {...state.guessed, [key]: 'wrong'},
        score: ScoreManager.onWrong(state.score, rules),
        errors: state.errors + 1,
      };
      return {state: next, ignored: false, correct: false, delta: -rules.wrong, bonusAwarded: 0, revealedIndices: []};
    }

    const revealed = state.revealed.slice();
    indices.forEach(i => {
      revealed[i] = true;
    });
    let score = ScoreManager.onCorrect(state.score, rules);
    const won = revealed.every(Boolean);
    let bonus = state.bonus;
    let bonusAwarded = 0;
    if (won) {
      score = ScoreManager.onCompletion(score, rules);
      bonusAwarded = rules.completionBonus;
      bonus = bonusAwarded;
    }
    const next: GameState = {
      ...state,
      revealed,
      guessed: {...state.guessed, [key]: 'correct'},
      score,
      lettersFound: state.lettersFound + 1,
      bonus,
      status: won ? 'won' : 'playing',
    };
    return {state: next, ignored: false, correct: true, delta: rules.correct, bonusAwarded, revealedIndices: indices};
  },

  abandon(state: GameState): GameState {
    if (state.status !== 'playing') {
      return state;
    }
    return {...state, revealed: state.revealed.map(() => true), status: 'abandoned'};
  },

  /** Vrai si la case a été révélée par l'abandon et non gagnée par le joueur. */
  isMissed(state: GameState, index: number): boolean {
    return state.status === 'abandoned' && state.guessed[state.keys[index]] !== 'correct';
  },
};
