import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleProp, ViewStyle} from 'react-native';
import {useApp} from '../state/AppContext';

interface Props {
  delay?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  distance?: number;
}

/** Apparition douce (fade + montée). Désactivée si les animations sont coupées. */
export function FadeIn({delay = 0, children, style, distance = 16}: Props) {
  const {settings} = useApp();
  const v = useRef(new Animated.Value(settings.animations ? 0 : 1)).current;

  useEffect(() => {
    if (!settings.animations) {
      return;
    }
    Animated.timing(v, {toValue: 1, duration: 380, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true}).start();
  }, [v, delay, settings.animations]);

  return (
    <Animated.View
      style={[style, {opacity: v, transform: [{translateY: v.interpolate({inputRange: [0, 1], outputRange: [distance, 0]})}]}]}>
      {children}
    </Animated.View>
  );
}
