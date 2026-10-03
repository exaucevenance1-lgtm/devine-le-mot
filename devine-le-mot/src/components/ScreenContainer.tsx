import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {COLORS} from '../constants/theme';
import {useApp} from '../state/AppContext';

/** Fond noir profond + halos rouges très subtils. */
export function ScreenContainer({children}: {children: React.ReactNode}) {
  const {settings} = useApp();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!settings.animations) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1, duration: 4200, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0, duration: 4200, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [settings.animations, pulse]);

  const glow = pulse.interpolate({inputRange: [0, 1], outputRange: [0.7, 1]});
  const top = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={[styles.root, {paddingTop: top}]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View pointerEvents="none" style={[styles.halo, styles.haloTop, {opacity: glow}]} />
      <Animated.View pointerEvents="none" style={[styles.halo, styles.haloBottom, {opacity: glow}]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.black},
  content: {flex: 1, paddingBottom: 12},
  halo: {position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,36,66,0.07)'},
  haloTop: {width: 420, height: 420, top: -190, right: -160},
  haloBottom: {width: 380, height: 380, bottom: -200, left: -170, backgroundColor: 'rgba(122,12,26,0.16)'},
});
