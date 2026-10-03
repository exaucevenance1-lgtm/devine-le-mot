import React, {memo, useRef} from 'react';
import {Animated, Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import {feedback} from '../services/feedbackService';
import {useApp} from '../state/AppContext';
import {spring} from '../utils/animation';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

function NeonButtonBase({title, onPress, variant = 'primary', disabled, style, compact}: Props) {
  const {settings} = useApp();
  const scale = useRef(new Animated.Value(1)).current;
  const anim = settings.animations;

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      onPressIn={() => spring(scale, 0.95, anim).start()}
      onPressOut={() => spring(scale, 1, anim).start()}
      onPress={() => {
        feedback.tap();
        onPress();
      }}>
      <Animated.View
        style={[
          styles.base,
          compact && styles.compact,
          variantStyles[variant],
          disabled && styles.disabled,
          style,
          {transform: [{scale}]},
        ]}>
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary, variant === 'ghost' && styles.textGhost]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export const NeonButton = memo(NeonButtonBase);

const styles = StyleSheet.create({
  base: {minHeight: 54, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22},
  compact: {minHeight: 44, borderRadius: RADIUS.sm},
  disabled: {opacity: 0.4},
  text: {color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.2},
  textSecondary: {color: COLORS.redLight},
  textGhost: {color: COLORS.textDim},
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.neon,
    shadowColor: COLORS.neon,
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  secondary: {backgroundColor: COLORS.anthracite, borderWidth: 1.5, borderColor: COLORS.redDark},
  danger: {backgroundColor: COLORS.redDark},
  ghost: {backgroundColor: 'transparent'},
});
