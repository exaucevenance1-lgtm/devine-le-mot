import {vibrate} from './haptics';

export type SoundName = 'tap' | 'correct' | 'wrong' | 'win' | 'abandon';

/**
 * Sons : architecture prête, aucun fichier audio requis. Pour ajouter un son,
 * poser le fichier dans src/assets/sounds et brancher une lib audio dans playSound().
 */
function playSound(_name: SoundName): void {}

let soundOn = true;
let vibrationOn = true;

export const feedback = {
  configure(opts: {sound: boolean; vibration: boolean}): void {
    soundOn = opts.sound;
    vibrationOn = opts.vibration;
  },
  play(name: SoundName): void {
    if (soundOn) {
      playSound(name);
    }
  },
  tap(): void {
    feedback.play('tap');
    if (vibrationOn) {
      vibrate(8);
    }
  },
  correct(): void {
    feedback.play('correct');
    if (vibrationOn) {
      vibrate(15);
    }
  },
  wrong(): void {
    feedback.play('wrong');
    if (vibrationOn) {
      vibrate(40);
    }
  },
  win(): void {
    feedback.play('win');
    if (vibrationOn) {
      vibrate(80);
    }
  },
  abandon(): void {
    feedback.play('abandon');
  },
};
