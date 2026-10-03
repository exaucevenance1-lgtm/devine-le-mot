import {Animated, Easing} from 'react-native';

export function timing(
  value: Animated.Value,
  toValue: number,
  duration: number,
  enabled: boolean,
  extra: Partial<Animated.TimingAnimationConfig> = {},
): Animated.CompositeAnimation {
  return Animated.timing(value, {
    toValue,
    duration: enabled ? duration : 0,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
    ...extra,
  });
}

export function spring(
  value: Animated.Value,
  toValue: number,
  enabled: boolean,
): Animated.CompositeAnimation {
  return Animated.spring(value, {
    toValue,
    speed: enabled ? 40 : 1000,
    bounciness: enabled ? 8 : 0,
    useNativeDriver: true,
  });
}
