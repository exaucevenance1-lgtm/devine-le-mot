import {useCallback, useEffect, useRef, useState} from 'react';
import {GameEngine} from '../logic/gameEngine';
import {WordRepository} from '../logic/wordRepository';
import {feedback} from '../services/feedbackService';
import {useApp} from '../state/AppContext';
import {GameEvent, GameState} from '../types/game';

export function useGame(level: number, resume: boolean) {
  const app = useApp();
  const initial = useRef<GameState>(
    resume && app.activeGame && app.activeGame.level === level
      ? app.activeGame
      : GameEngine.create(level, WordRepository.pickWord(level, app.progress.lastWords[level])),
  ).current;
  const ref = useRef<GameState>(initial);
  const [game, setGame] = useState<GameState>(initial);
  const [event, setEvent] = useState<GameEvent | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    if (!resume) {
      app.clearActiveGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guess = useCallback(
    (letter: string) => {
      const r = GameEngine.guess(ref.current, letter);
      if (r.ignored) {
        return; // double-tap / clics très rapides : ignoré proprement
      }
      ref.current = r.state;
      setGame(r.state);
      counter.current += 1;
      setEvent({id: counter.current, type: r.correct ? 'gain' : 'loss', letter, delta: r.delta, bonus: r.bonusAwarded});
      if (r.correct) {
        r.state.status === 'won' ? feedback.win() : feedback.correct();
      } else {
        feedback.wrong();
      }
      if (r.state.status === 'playing') {
        app.saveActiveGame(r.state);
      }
    },
    [app],
  );

  const abandon = useCallback(() => {
    const next = GameEngine.abandon(ref.current);
    if (next === ref.current) {
      return;
    }
    ref.current = next;
    setGame(next);
    feedback.abandon();
  }, []);

  return {game, event, guess, abandon};
}
