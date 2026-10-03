import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import {useApp} from '../state/AppContext';
import {NeonButton} from './NeonButton';

interface Props {
  visible: boolean;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Fenêtre de confirmation avec ouverture et fermeture animées. */
export function ConfirmModal({visible, message, cancelLabel, confirmLabel, onCancel, onConfirm}: Props) {
  const {settings} = useApp();
  const v = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    const duration = settings.animations ? 220 : 0;
    if (visible) {
      setMounted(true);
      Animated.timing(v, {toValue: 1, duration, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true}).start();
    } else {
      Animated.timing(v, {toValue: 0, duration, easing: Easing.in(Easing.quad), useNativeDriver: true}).start(({finished}) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [visible, settings.animations, v]);

  if (!mounted) {
    return null;
  }
  return (
    <View style={styles.overlay}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, {opacity: v}]} />
      <Animated.View
        style={[styles.card, {opacity: v, transform: [{scale: v.interpolate({inputRange: [0, 1], outputRange: [0.88, 1]})}]}]}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.row}>
          <NeonButton title={cancelLabel} variant="secondary" compact onPress={onCancel} style={styles.btn} />
          <NeonButton title={confirmLabel} variant="danger" compact onPress={onConfirm} style={styles.btn} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50},
  backdrop: {backgroundColor: 'rgba(0,0,0,0.75)'},
  card: {width: '100%', maxWidth: 400, padding: 22, borderRadius: RADIUS.lg, backgroundColor: COLORS.anthracite, borderWidth: 1, borderColor: COLORS.redDark, gap: 20},
  message: {color: COLORS.text, fontSize: 18, fontWeight: '700', textAlign: 'center'},
  row: {flexDirection: 'row', gap: 12},
  btn: {flex: 1, paddingHorizontal: 8},
});
