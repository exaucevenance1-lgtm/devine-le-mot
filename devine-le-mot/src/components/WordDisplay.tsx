import React, {memo, useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {COLORS} from '../constants/theme';
import {GameEngine} from '../logic/gameEngine';
import {GameState} from '../types/game';
import {useApp} from '../state/AppContext';

interface CellProps {
  char: string;
  revealed: boolean;
  missed: boolean;
  size: number;
  delay: number;
  celebrate: boolean;
  animated: boolean;
}

const Cell = memo(function Cell({char, revealed, missed, size, delay, celebrate, animated}: CellProps) {
  const progress = useRef(new Animated.Value(revealed ? 1 : 0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const wasRevealed = useRef(revealed);

  useEffect(() => {
    if (revealed && !wasRevealed.current) {
      Animated.timing(progress, {toValue: 1, duration: animated ? 420 : 0, delay: animated ? delay : 0, useNativeDriver: true}).start();
    }
    wasRevealed.current = revealed;
  }, [revealed, animated, delay, progress]);

  useEffect(() => {
    if (celebrate && animated) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(wave, {toValue: 1, duration: 220, useNativeDriver: true}),
        Animated.timing(wave, {toValue: 0, duration: 320, useNativeDriver: true}),
      ]).start();
    }
  }, [celebrate, animated, delay, wave]);

  const scale = Animated.multiply(
    progress.interpolate({inputRange: [0, 0.5, 0.8, 1], outputRange: [0.85, 1.22, 0.96, 1]}),
    wave.interpolate({inputRange: [0, 1], outputRange: [1, 1.15]}),
  );
  const letterOpacity = progress.interpolate({inputRange: [0, 0.35, 1], outputRange: [0, 0, 1]});
  const glow = progress.interpolate({inputRange: [0, 0.4, 1], outputRange: [0, 1, 0]});
  const lift = progress.interpolate({inputRange: [0, 1], outputRange: [8, 0]});
  const fontSize = Math.max(14, size * 0.58);

  return (
    <Animated.View style={[styles.cell, {width: size, height: size * 1.2}, missed && styles.cellMissed, {transform: [{scale}]}]}>
      <Animated.View pointerEvents="none" style={[styles.glow, {opacity: glow}]} />
      <Animated.Text
        style={[styles.letter, {fontSize, opacity: letterOpacity, transform: [{translateY: lift}]}, missed && styles.letterMissed]}>
        {char}
      </Animated.Text>
      {!revealed && <View style={styles.blank} />}
    </Animated.View>
  );
});

export function WordDisplay({game, celebrate}: {game: GameState; celebrate: boolean}) {
  const {width} = useWindowDimensions();
  const {settings} = useApp();
  const n = game.chars.length;
  const gap = 6;
  const perRow = n <= 9 ? n : Math.ceil(n / 2);
  const size = Math.max(22, Math.min(50, Math.floor((width - 40 - gap * (perRow - 1)) / perRow)));
  const abandoned = game.status === 'abandoned';

  const rows: number[][] = [];
  for (let i = 0; i < n; i += perRow) {
    rows.push(Array.from({length: Math.min(perRow, n - i)}, (_, k) => i + k));
  }

  return (
    <View style={styles.wrap} accessibilityLabel={`Mot de ${n} lettres`}>
      {rows.map((row, r) => (
        <View key={r} style={[styles.row, {gap}]}>
          {row.map(i => (
            <Cell
              key={i}
              char={game.chars[i]}
              revealed={game.revealed[i]}
              missed={GameEngine.isMissed(game, i)}
              size={size}
              delay={abandoned || celebrate ? i * 70 : 0}
              celebrate={celebrate}
              animated={settings.animations}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', gap: 10, paddingHorizontal: 20},
  row: {flexDirection: 'row', justifyContent: 'center'},
  cell: {
    borderRadius: 12,
    backgroundColor: COLORS.panel,
    borderWidth: 1.5,
    borderColor: COLORS.redDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cellMissed: {borderColor: COLORS.redDarker, backgroundColor: COLORS.black2},
  glow: {...StyleSheet.absoluteFillObject, backgroundColor: COLORS.neonGlow},
  letter: {color: COLORS.text, fontWeight: '900'},
  letterMissed: {color: COLORS.redLight},
  blank: {position: 'absolute', bottom: 8, width: '45%', height: 3, borderRadius: 2, backgroundColor: COLORS.border},
});
