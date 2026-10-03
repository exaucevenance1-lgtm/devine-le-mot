import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/theme';
import {feedback} from '../services/feedbackService';
import {timing} from '../utils/animation';

interface Props {
  label: string;
  value: boolean;
  animated: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({label, value, animated, onChange}: Props) {
  const v = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    timing(v, value ? 1 : 0, 200, animated).start();
  }, [value, animated, v]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{checked: value}}
      style={styles.row}
      onPress={() => {
        feedback.tap();
        onChange(!value);
      }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.trackOn, {opacity: v}]} />
        <Animated.View style={[styles.thumb, {transform: [{translateX: v.interpolate({inputRange: [0, 1], outputRange: [2, 24]})}]}]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: COLORS.anthracite, borderWidth: 1, borderColor: COLORS.border},
  label: {color: COLORS.text, fontSize: 16, fontWeight: '700'},
  track: {width: 52, height: 30, borderRadius: 15, backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', justifyContent: 'center'},
  trackOn: {backgroundColor: COLORS.neon},
  thumb: {width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff'},
});
