import {GameResult} from './game';

export type Route =
  | {name: 'home'}
  | {name: 'levels'; highlightLevel?: number}
  | {name: 'game'; level: number; resume?: boolean}
  | {name: 'result'; result: GameResult}
  | {name: 'stats'}
  | {name: 'settings'}
  | {name: 'howto'};
