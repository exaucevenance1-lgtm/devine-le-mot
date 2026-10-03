import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import {useAnimatedNumber} from '../hooks/useAnimatedNumber';
import {GameEvent} from '../types/game';
import {FloatingText} from './FloatingText';

interface Props {
  score: number;
  event: GameEvent | null;
  animated: boolean;
}

export function ScoreBoard({score, event, animated}: Props) {
  const display = useAnimatedNumber(score, animated);
  const pulse = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!event || !animated) {
      return;
    }
    if (event.type === 'gain') {
      glow.setValue(1);
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {toValue: 1.12, duration: 120, useNativeDriver: true}),
          Animated.spring(pulse, {toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8}),
        ]),
        Animated.timing(glow, {toValue: 0, duration: 700, useNativeDriver: true}),
      ]).start();
    } else {
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, {toValue: 1, duration: 45, useNativeDriver: true}),
        Animated.timing(shake, {toValue: -1, duration: 70, useNativeDriver: true}),
        Animated.timing(shake, {toValue: 0.5, duration: 60, useNativeDriver: true}),
        Animated.timing(shake, {toValue: 0, duration: 50, useNativeDriver: true}),
      ]).start();
    }
  }, [event, animated, pulse, shake, glow]);

  const id = event?.id ?? 0;
  const gain = event?.type === 'gain';
  const negative = display < 0;

  return (
    <View style={styles.card}>
      <Animated.View pointerEvents="none" style={[styles.glow, {opacity: glow}]} />
      <Text style={styles.label}>SCORE</Text>
      <Animated.Text
        accessibilityLabel={`Score ${display}`}
        style={[
          styles.value,
          negative && styles.negative,
          {transform: [{scale: pulse}, {translateX: shake.interpolate({inputRange: [-1, 1], outputRange: [-7, 7]})}]},
        ]}>
        {display}
      </Animated.Text>
      <FloatingText trigger={gain ? id : 0} text={event ? `+${event.delta}` : ''} tone="gain" animated={animated} />
      <FloatingText trigger={!gain ? id : 0} text={event ? `${event.delta}` : ''} tone="loss" animated={animated} />
      <FloatingText trigger={gain && event && event.bonus > 0 ? id : 0} text={event ? `+${event.bonus} BONUS` : ''} tone="gain" animated={animated} delay={450} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {minWidth: 150, alignItems: 'center', paddingHorizontal: 22, paddingVertical: 8, borderRadius: RADIUS.md, backgroundColor: COLORS.anthracite, borderWidth: 1, borderColor: COLORS.redDarker, overflow: 'visible'},
  glow: {...StyleSheet.absoluteFillObject, borderRadius: RADIUS.md, backgroundColor: COLORS.neonGlow},
  label: {color: COLORS.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 2},
  value: {color: COLORS.neon, fontSize: 38, fontWeight: '900', fontVariant: ['tabular-nums']},
  negative: {color: COLORS.redLight},
});
