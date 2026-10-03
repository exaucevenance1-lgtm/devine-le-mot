import {Vibration} from 'react-native';

/** Android / iOS : vibration courte. (Windows : voir haptics.windows.ts) */
export function vibrate(ms: number): void {
  Vibration.vibrate(ms);
}
