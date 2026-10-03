export type LetterStatus = 'available' | 'correct' | 'wrong';
export type GameStatus = 'playing' | 'won' | 'abandoned';

export interface GameState {
  level: number;
  /** Mot affiché (majuscules, accents conservés). */
  word: string;
  chars: string[];
  /** Lettre de base (sans accent) pour chaque position. */
  keys: string[];
  revealed: boolean[];
  guessed: Record<string, 'correct' | 'wrong'>;
  score: number;
  errors: number;
  lettersFound: number;
  totalLetters: number;
  bonus: number;
  status: GameStatus;
}

export interface GuessResult {
  state: GameState;
  ignored: boolean;
  correct: boolean;
  delta: number;
  bonusAwarded: number;
  revealedIndices: number[];
}

export interface GameEvent {
  id: number;
  type: 'gain' | 'loss';
  letter: string;
  delta: number;
  bonus: number;
}

export interface GameResult {
  level: number;
  word: string;
  won: boolean;
  abandoned: boolean;
  score: number;
  errors: number;
  lettersFound: number;
  totalLetters: number;
  bonus: number;
  newlyUnlocked: number | null;
}

export interface LevelConfig {
  id: number;
  difficulty: string;
  minLength: number;
  maxLength: number;
  winsToUnlockNext: number;
}
