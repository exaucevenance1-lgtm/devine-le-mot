import {LEVEL_WORDS} from '../data/words';

export const WordRepository = {
  getWords(level: number): readonly string[] {
    return LEVEL_WORDS[level] ?? LEVEL_WORDS[1];
  },

  /** Mot aléatoire du niveau, en évitant `exclude` (dernier mot joué) si possible. */
  pickWord(level: number, exclude?: string, rng: () => number = Math.random): string {
    const all = WordRepository.getWords(level);
    const pool = exclude && all.length > 1 ? all.filter(w => w !== exclude) : all;
    return pool[Math.floor(rng() * pool.length) % pool.length].toUpperCase();
  },
};
