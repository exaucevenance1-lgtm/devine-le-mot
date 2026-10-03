import React, {memo, useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text} from 'react-native';
import {COLORS} from '../constants/theme';
import {LetterStatus} from '../types/game';
import {spring, timing} from '../utils/animation';

interface Props {
  letter: string;
  status: LetterStatus;
  size: number;
  animated: boolean;
  disabled: boolean;
  onPress: (letter: string) => void;
}

function LetterKeyBase({letter, status, size, animated, disabled, onPress}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const correct = useRef(new Animated.Value(status === 'correct' ? 1 : 0)).current;
  const wrong = useRef(new Animated.Value(status === 'wrong' ? 1 : 0)).current;
  const prev = useRef(status);

  useEffect(() => {
    if (prev.current === status) {
      return;
    }
    prev.current = status;
    if (status === 'correct') {
      timing(correct, 1, 260, animated).start();
      Animated.sequence([
        Animated.timing(scale, {toValue: 1.18, duration: animated ? 110 : 0, useNativeDriver: true}),
        spring(scale, 1, animated),
      ]).start();
    } else if (status === 'wrong') {
      timing(wrong, 1, 300, animated).start();
      Animated.sequence([
        Animated.timing(shake, {toValue: 1, duration: animated ? 50 : 0, useNativeDriver: true}),
        Animated.timing(shake, {toValue: -1, duration: animated ? 80 : 0, useNativeDriver: true}),
        Animated.timing(shake, {toValue: 0.6, duration: animated ? 70 : 0, useNativeDriver: true}),
        Animated.timing(shake, {toValue: 0, duration: animated ? 60 : 0, useNativeDriver: true}),
      ]).start();
    }
  }, [status, animated, correct, wrong, scale, shake]);

  const translateX = shake.interpolate({inputRange: [-1, 1], outputRange: [-6, 6]});
  const used = status !== 'available';

  return (
    <Pressable
      disabled={disabled || used}
      accessibilityRole="button"
      accessibilityLabel={`Lettre ${letter}`}
      accessibilityState={{disabled: used}}
      onPressIn={() => spring(scale, 0.9, animated).start()}
      onPressOut={() => !used && spring(scale, 1, animated).start()}
      onPress={() => onPress(letter)}>
      <Animated.View style={[styles.key, {width: size, height: size * 1.12, transform: [{translateX}, {scale}]}]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.correct, {opacity: correct}]} />
        <Animated.View style={[StyleSheet.absoluteFill, styles.wrong, {opacity: wrong}]} />
        <Text style={[styles.text, {fontSize: size * 0.42}, status === 'wrong' && styles.textWrong]}>{letter}</Text>
      </Animated.View>
    </Pressable>
  );
}

export const LetterKey = memo(LetterKeyBase);

const styles = StyleSheet.create({
  key: {borderRadius: 12, backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  correct: {backgroundColor: COLORS.neon},
  wrong: {backgroundColor: COLORS.redDark},
  text: {color: COLORS.text, fontWeight: '800'},
  textWrong: {color: COLORS.redLight, opacity: 0.6},
});
