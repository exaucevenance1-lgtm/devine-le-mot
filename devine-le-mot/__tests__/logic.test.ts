import {GameEngine} from '../src/logic/gameEngine';
import {LevelManager} from '../src/logic/levelManager';
import {applyResult, EMPTY_PROGRESS, toGameResult} from '../src/logic/progressLogic';
import {WordRepository} from '../src/logic/wordRepository';
import {LEVEL_WORDS} from '../src/data/words';
import {TOTAL_LEVELS} from '../src/constants/levels';
import {baseLetter} from '../src/utils/text';

describe('GameEngine', () => {
  it('démarre une partie masquée avec le score initial', () => {
    const g = GameEngine.create(1, 'banane');
    expect(g.word).toBe('BANANE');
    expect(g.score).toBe(100);
    expect(g.revealed.some(Boolean)).toBe(false);
    expect(g.totalLetters).toBe(4);
  });

  it('révèle toutes les occurrences d\'une lettre correcte', () => {
    const r = GameEngine.guess(GameEngine.create(1, 'BANANE'), 'A');
    expect(r.correct).toBe(true);
    expect(r.revealedIndices).toEqual([1, 3]);
    expect(r.state.score).toBe(110);
  });

  it('pénalise une lettre incorrecte', () => {
    const r = GameEngine.guess(GameEngine.create(1, 'BANANE'), 'Z');
    expect(r.correct).toBe(false);
    expect(r.state.score).toBe(85);
    expect(r.state.errors).toBe(1);
  });

  it('ignore une lettre déjà jouée', () => {
    const a = GameEngine.guess(GameEngine.create(1, 'BANANE'), 'Z');
    const b = GameEngine.guess(a.state, 'Z');
    expect(b.ignored).toBe(true);
    expect(b.state.score).toBe(85);
  });

  it('autorise un score négatif', () => {
    let s = GameEngine.create(1, 'BANANE');
    'ZXWQKJVY'.split('').forEach(l => {
      s = GameEngine.guess(s, l).state;
    });
    expect(s.score).toBe(100 - 8 * 15);
    expect(s.score).toBeLessThan(0);
  });

  it('gère la victoire et le bonus', () => {
    let s = GameEngine.create(1, 'EAU');
    s = GameEngine.guess(s, 'E').state;
    s = GameEngine.guess(s, 'A').state;
    const r = GameEngine.guess(s, 'U');
    expect(r.state.status).toBe('won');
    expect(r.bonusAwarded).toBe(50);
    expect(r.state.score).toBe(100 + 30 + 50);
  });

  it('gère les accents : E révèle É, È, Ê', () => {
    const r = GameEngine.guess(GameEngine.create(1, 'ÉLÉPHANT'), 'e');
    expect(r.revealedIndices).toEqual([0, 2]);
    expect(baseLetter('ç')).toBe('C');
  });

  it('abandon : révèle le mot et termine la partie', () => {
    const g = GameEngine.abandon(GameEngine.create(1, 'CHAT'));
    expect(g.status).toBe('abandoned');
    expect(g.revealed.every(Boolean)).toBe(true);
    expect(GameEngine.guess(g, 'C').ignored).toBe(true);
  });
});

describe('Mots', () => {
  it('au moins 30 mots valides par niveau', () => {
    for (let l = 1; l <= TOTAL_LEVELS; l++) {
      const words = WordRepository.getWords(l);
      expect(words.length).toBeGreaterThanOrEqual(30);
      words.forEach(w => expect(/^[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ]+$/.test(w)).toBe(true));
      expect(new Set(words).size).toBe(words.length);
    }
    expect(Object.keys(LEVEL_WORDS)).toHaveLength(TOTAL_LEVELS);
  });

  it('évite de reprendre immédiatement le dernier mot', () => {
    for (let i = 0; i < 200; i++) {
      expect(WordRepository.pickWord(1, 'CHAT')).not.toBe('CHAT');
    }
  });
});

describe('Progression', () => {
  const win = (level: number) =>
    toGameResult({...GameEngine.create(level, 'CHAT'), status: 'won'});

  it('débloque le niveau suivant après 3 victoires', () => {
    let p = EMPTY_PROGRESS;
    let unlocked: number | null = null;
    for (let i = 0; i < 3; i++) {
      const r = applyResult(p, win(1));
      p = r.progress;
      unlocked = r.result.newlyUnlocked;
    }
    expect(p.unlockedLevel).toBe(2);
    expect(unlocked).toBe(2);
    expect(LevelManager.isUnlocked(p, 3)).toBe(false);
    expect(p.stats.gamesWon).toBe(3);
  });

  it('compte les abandons et conserve le meilleur score', () => {
    const ab = toGameResult({...GameEngine.create(1, 'CHAT'), status: 'abandoned', score: 65});
    const r = applyResult(EMPTY_PROGRESS, ab);
    expect(r.progress.stats.gamesAbandoned).toBe(1);
    expect(r.progress.bestScores[1]).toBe(65);
  });
});
