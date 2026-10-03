import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, StyleSheet, View, useWindowDimensions} from 'react-native';
import {COLORS} from '../constants/theme';

const COLOR_LIST = [COLORS.neon, COLORS.redLight, COLORS.redDark];

/** Particules rouges légères (18 pièces, driver natif). */
export function Confetti({count = 18}: {count?: number}) {
  const {width, height} = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        x: Math.random() * width,
        drift: (Math.random() - 0.5) * 120,
        size: 6 + Math.random() * 6,
        color: COLOR_LIST[i % COLOR_LIST.length],
        start: Math.random() * 0.35,
      })),
    [count, width],
  );

  useEffect(() => {
    Animated.timing(progress, {toValue: 1, duration: 2600, easing: Easing.out(Easing.quad), useNativeDriver: true}).start();
  }, [progress]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.piece,
            {
              left: p.x,
              width: p.size,
              height: p.size * 1.6,
              backgroundColor: p.color,
              opacity: progress.interpolate({inputRange: [0, p.start, p.start + 0.1, 0.85, 1], outputRange: [0, 0, 1, 1, 0]}),
              transform: [
                {translateY: progress.interpolate({inputRange: [0, 1], outputRange: [-20, height * 0.8]})},
                {translateX: progress.interpolate({inputRange: [0, 1], outputRange: [0, p.drift]})},
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({piece: {position: 'absolute', top: 0, borderRadius: 2}});
