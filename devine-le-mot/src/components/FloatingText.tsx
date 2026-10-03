import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import {COLORS} from '../constants/theme';

interface Props {
  /** Change à chaque nouveau déclenchement. */
  trigger: number;
  text: string;
  tone: 'gain' | 'loss';
  animated: boolean;
  delay?: number;
}

/** Indicateur "+10" / "-15" : apparaît, monte légèrement puis disparaît. */
export function FloatingText({trigger, text, tone, animated, delay = 0}: Props) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger || !animated) {
      return;
    }
    v.setValue(0);
    Animated.timing(v, {toValue: 1, duration: 1000, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true}).start();
  }, [trigger, animated, delay, v]);

  const gain = tone === 'gain';
  const opacity = v.interpolate({inputRange: [0, 0.12, 0.7, 1], outputRange: [0, 1, 1, 0]});
  const translateY = v.interpolate({inputRange: [0, 1], outputRange: [gain ? 6 : -6, gain ? -34 : 26]});
  const scale = v.interpolate({inputRange: [0, 0.15, 1], outputRange: [0.7, 1.2, 1]});

  return (
    <Animated.Text
      pointerEvents="none"
      style={[styles.text, gain ? styles.gain : styles.loss, {opacity, transform: [{translateY}, {scale}]}]}>
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {position: 'absolute', right: 6, top: 6, fontSize: 22, fontWeight: '900'},
  gain: {color: COLORS.neon},
  loss: {color: COLORS.redLight},
});
