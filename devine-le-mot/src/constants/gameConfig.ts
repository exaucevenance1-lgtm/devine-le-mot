/** Configuration centrale du jeu : toutes les valeurs de gameplay sont ici. */
export const GAME_CONFIG = {
  INITIAL_SCORE: 100,
  CORRECT_LETTER_POINTS: 10,
  WRONG_LETTER_POINTS: 15,
  BONUS_COMPLETION: 50,
  /** Victoires nécessaires dans un niveau pour débloquer le suivant. */
  WINS_TO_UNLOCK_NEXT_LEVEL: 3,
  RESULT_DELAY_WIN_MS: 1300,
  RESULT_DELAY_ABANDON_MS: 1500,
} as const;

export const STORAGE_KEYS = {
  PROGRESS: '@devinelemot/progress/v1',
  SETTINGS: '@devinelemot/settings/v1',
  ACTIVE_GAME: '@devinelemot/activeGame/v1',
} as const;

export const APP_TEXT = {
  TITLE: 'DEVINE LE MOT',
  SUBTITLE: 'Trouve les lettres. Découvre le mot. Gagne des points.',
} as const;
