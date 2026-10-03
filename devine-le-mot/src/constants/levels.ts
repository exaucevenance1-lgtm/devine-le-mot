import {LevelConfig} from '../types/game';
import {GAME_CONFIG} from './gameConfig';

const W = GAME_CONFIG.WINS_TO_UNLOCK_NEXT_LEVEL;

/**
 * Pour ajouter un niveau : ajouter une entrée ici + un fichier
 * data/words/levelN.ts + l'enregistrer dans data/words/index.ts.
 */
export const LEVELS: readonly LevelConfig[] = [
  {id: 1, difficulty: 'Très facile', minLength: 3, maxLength: 6, winsToUnlockNext: W},
  {id: 2, difficulty: 'Facile', minLength: 4, maxLength: 7, winsToUnlockNext: W},
  {id: 3, difficulty: 'Moyen', minLength: 5, maxLength: 8, winsToUnlockNext: W},
  {id: 4, difficulty: 'Moyen', minLength: 6, maxLength: 9, winsToUnlockNext: W},
  {id: 5, difficulty: 'Intermédiaire', minLength: 7, maxLength: 10, winsToUnlockNext: W},
  {id: 6, difficulty: 'Difficile', minLength: 8, maxLength: 11, winsToUnlockNext: W},
  {id: 7, difficulty: 'Difficile', minLength: 9, maxLength: 12, winsToUnlockNext: W},
  {id: 8, difficulty: 'Très difficile', minLength: 10, maxLength: 13, winsToUnlockNext: W},
  {id: 9, difficulty: 'Expert', minLength: 10, maxLength: 15, winsToUnlockNext: W},
  {id: 10, difficulty: 'Légendaire', minLength: 12, maxLength: 25, winsToUnlockNext: W},
];

export const TOTAL_LEVELS = LEVELS.length;
