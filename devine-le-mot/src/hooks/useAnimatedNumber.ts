import {useEffect, useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';

/** Nombre animé (JS driver, courte durée) : fonctionne aussi sous zéro. */
export function useAnimatedNumber(target: number, enabled: boolean, duration = 450, from?: number): number {
  const anim = useRef(new Animated.Value(from ?? target)).current;
  const [display, setDisplay] = useState(Math.round(from ?? target));

  useEffect(() => {
    const id = anim.addListener(({value}) => setDisplay(Math.round(value)));
    return () => anim.removeListener(id);
  }, [anim]);

  useEffect(() => {
    if (!enabled) {
      anim.setValue(target);
      setDisplay(target);
      return;
    }
    Animated.timing(anim, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [target, enabled, duration, anim]);

  return display;
}
