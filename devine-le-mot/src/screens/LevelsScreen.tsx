import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {FadeIn} from '../components/FadeIn';
import {ScreenHeader} from '../components/ScreenHeader';
import {LEVELS} from '../constants/levels';
import {COLORS, RADIUS} from '../constants/theme';
import {LevelManager} from '../logic/levelManager';
import {useNavigation} from '../navigation/NavigationContext';
import {feedback} from '../services/feedbackService';
import {useApp} from '../state/AppContext';
import {LevelConfig} from '../types/game';
import {spring} from '../utils/animation';

interface CardProps {
  level: LevelConfig;
  unlocked: boolean;
  best: number | undefined;
  wins: number;
  highlight: boolean;
  animated: boolean;
  onPress: () => void;
}

function LevelCard({level, unlocked, best, wins, highlight, animated, onPress}: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const unlockGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!highlight || !animated) {
      return;
    }
    Animated.sequence([
      Animated.timing(unlockGlow, {toValue: 1, duration: 500, delay: 350, useNativeDriver: true}),
      Animated.timing(unlockGlow, {toValue: 0, duration: 900, useNativeDriver: true}),
    ]).start();
    Animated.sequence([
      Animated.timing(scale, {toValue: 1.08, duration: 300, delay: 350, useNativeDriver: true}),
      spring(scale, 1, true),
    ]).start();
  }, [highlight, animated, unlockGlow, scale]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Niveau ${level.id}${unlocked ? '' : ' verrouillé'}`}
      onPressIn={() => spring(scale, 0.96, animated).start()}
      onPressOut={() => spring(scale, 1, animated).start()}
      onPress={() => {
        feedback.tap();
        onPress();
      }}>
      <Animated.View style={[styles.card, !unlocked && styles.cardLocked, {transform: [{scale}]}]}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.unlockGlow, {opacity: unlockGlow}]} />
        <Text style={[styles.cardTitle, !unlocked && styles.dim]}>{unlocked ? `Niveau ${level.id}` : `🔒 Niveau ${level.id}`}</Text>
        <Text style={[styles.difficulty, !unlocked && styles.dim]}>{level.difficulty}</Text>
        {unlocked ? (
          <Text style={styles.meta}>
            {best !== undefined ? `Meilleur : ${best}` : 'Pas encore joué'}
            {'\n'}
            {`Victoires : ${wins}/${level.winsToUnlockNext}`}
          </Text>
        ) : (
          <Text style={styles.condition}>{LevelManager.unlockCondition(level.id)}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function LevelsScreen({highlightLevel}: {highlightLevel?: number}) {
  const nav = useNavigation();
  const {progress, settings} = useApp();
  const [lockedMsg, setLockedMsg] = React.useState<string | null>(null);

  return (
    <View style={styles.root}>
      <ScreenHeader title="NIVEAUX" />
      <ScrollView contentContainerStyle={styles.grid}>
        {LEVELS.map((level, i) => {
          const unlocked = LevelManager.isUnlocked(progress, level.id);
          return (
            <FadeIn key={level.id} delay={i * 45} style={styles.cardWrap}>
              <LevelCard
                level={level}
                unlocked={unlocked}
                best={progress.bestScores[level.id]}
                wins={progress.winsByLevel[level.id] ?? 0}
                highlight={highlightLevel === level.id}
                animated={settings.animations}
                onPress={() => {
                  if (unlocked) {
                    nav.navigate({name: 'game', level: level.id});
                  } else {
                    setLockedMsg(LevelManager.unlockCondition(level.id));
                  }
                }}
              />
            </FadeIn>
          );
        })}
      </ScrollView>
      {lockedMsg && <Text style={styles.toast}>🔒 {lockedMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  grid: {flexDirection: 'row', flexWrap: 'wrap', padding: 10, maxWidth: 640, width: '100%', alignSelf: 'center'},
  cardWrap: {width: '50%', padding: 6},
  card: {minHeight: 130, borderRadius: RADIUS.md, padding: 14, backgroundColor: COLORS.anthracite, borderWidth: 1.5, borderColor: COLORS.redDark, overflow: 'hidden', justifyContent: 'space-between'},
  cardLocked: {borderColor: COLORS.border, backgroundColor: COLORS.black2},
  unlockGlow: {backgroundColor: COLORS.neonGlow},
  cardTitle: {color: COLORS.text, fontSize: 18, fontWeight: '800'},
  difficulty: {color: COLORS.redLight, fontSize: 13, fontWeight: '600'},
  dim: {color: COLORS.textDim},
  meta: {color: COLORS.textDim, fontSize: 12, marginTop: 8},
  condition: {color: COLORS.textDim, fontSize: 12, marginTop: 8},
  toast: {textAlign: 'center', color: COLORS.redLight, padding: 12, fontWeight: '700'},
});
