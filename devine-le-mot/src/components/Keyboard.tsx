import React, {memo} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {LetterStatus} from '../types/game';
import {LetterKey} from './LetterKey';

const ROWS: readonly string[][] = [
  'ABCDEFG'.split(''),
  'HIJKLMN'.split(''),
  'OPQRSTU'.split(''),
  'VWXYZ'.split(''),
];

interface Props {
  guessed: Record<string, 'correct' | 'wrong'>;
  disabled: boolean;
  animated: boolean;
  onPress: (letter: string) => void;
}

function KeyboardBase({guessed, disabled, animated, onPress}: Props) {
  const {width, height} = useWindowDimensions();
  const gap = 7;
  const byWidth = (Math.min(width, 520) - 32 - gap * 6) / 7;
  const byHeight = (height * 0.3 - gap * 3) / (4 * 1.12);
  const size = Math.max(34, Math.min(56, Math.floor(Math.min(byWidth, byHeight))));

  return (
    <View style={[styles.wrap, {gap}]}>
      {ROWS.map((row, i) => (
        <View key={i} style={[styles.row, {gap}]}>
          {row.map(l => (
            <LetterKey
              key={l}
              letter={l}
              size={size}
              status={(guessed[l] ?? 'available') as LetterStatus}
              animated={animated}
              disabled={disabled}
              onPress={onPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export const Keyboard = memo(KeyboardBase);

const styles = StyleSheet.create({
  wrap: {alignItems: 'center'},
  row: {flexDirection: 'row', justifyContent: 'center'},
});
