import React, {useEffect, useRef} from 'react';
import {Animated, Easing, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Confetti} from '../components/Confetti';
import {FadeIn} from '../components/FadeIn';
import {NeonButton} from '../components/NeonButton';
import {COLORS, RADIUS} from '../constants/theme';
import {useAnimatedNumber} from '../hooks/useAnimatedNumber';
import {useNavigation} from '../navigation/NavigationContext';
import {useApp} from '../state/AppContext';
import {GameResult} from '../types/game';

function Row({label, value, delay}: {label: string; value: string; delay: number}) {
  return (
    <FadeIn delay={delay} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </FadeIn>
  );
}

export function ResultScreen({result}: {result: GameResult}) {
  const nav = useNavigation();
  const {settings} = useApp();
  const animated = settings.animations;
  const title = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const unlock = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const score = useAnimatedNumber(result.score, animated, 900, result.won ? result.score - result.bonus - 10 : result.score);

  useEffect(() => {
    if (!animated) {
      return;
    }
    Animated.spring(title, {toValue: 1, speed: result.won ? 10 : 18, bounciness: result.won ? 14 : 2, useNativeDriver: true}).start();
    if (result.newlyUnlocked) {
      Animated.timing(unlock, {toValue: 1, duration: 600, delay: 1200, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true}).start();
    }
  }, [animated, result, title, unlock]);

  const replay = () => nav.navigate({name: 'game', level: result.level});
  const toLevels = () => nav.navigate({name: 'levels', highlightLevel: result.newlyUnlocked ?? undefined});

  return (
    <View style={styles.root}>
      {result.won && animated && <Confetti />}
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{alignItems: 'center', opacity: title, transform: [{scale: title.interpolate({inputRange: [0, 1], outputRange: [result.won ? 0.6 : 0.95, 1]})}]}}>
          <Text style={[styles.title, !result.won && styles.titleSober]}>{result.won ? '🎉 BRAVO !' : 'PARTIE TERMINÉE'}</Text>
          <Text style={styles.sub}>{result.won ? 'Tu as trouvé le mot.' : 'Le mot était :'}</Text>
          <Text style={[styles.word, !result.won && styles.wordSober]}>{result.word}</Text>
        </Animated.View>

        <View style={styles.card}>
          <Row label="Niveau" value={`${result.level}`} delay={500} />
          <Row label="Score" value={`${score}`} delay={600} />
          {result.won && result.bonus > 0 && <Row label="Bonus" value={`+${result.bonus}`} delay={700} />}
          <Row label="Erreurs" value={`${result.errors}`} delay={800} />
          <Row label="Lettres trouvées" value={`${result.lettersFound} / ${result.totalLetters}`} delay={900} />
          {!result.won && <Row label="Statut" value="Partie abandonnée" delay={1000} />}
        </View>

        {result.newlyUnlocked && (
          <Animated.View style={[styles.unlock, {opacity: unlock, transform: [{scale: unlock.interpolate({inputRange: [0, 1], outputRange: [0.8, 1]})}]}]}>
            <Text style={styles.unlockText}>🔓 NIVEAU {result.newlyUnlocked} DÉBLOQUÉ</Text>
          </Animated.View>
        )}

        <FadeIn delay={1000} style={styles.buttons}>
          <NeonButton title={result.won ? 'PARTIE SUIVANTE' : 'REJOUER'} onPress={replay} />
          <NeonButton title="RETOUR AUX NIVEAUX" variant="secondary" onPress={toLevels} />
          {!result.won && <NeonButton title="MENU" variant="ghost" compact onPress={() => nav.navigate({name: 'home'})} />}
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {flexGrow: 1, justifyContent: 'center', padding: 20, gap: 20, maxWidth: 520, width: '100%', alignSelf: 'center'},
  title: {color: COLORS.neon, fontSize: 38, fontWeight: '900', letterSpacing: 2, textShadowColor: COLORS.neon, textShadowRadius: 16},
  titleSober: {color: COLORS.text, fontSize: 28, textShadowRadius: 0},
  sub: {color: COLORS.textDim, fontSize: 15, marginTop: 6},
  word: {color: COLORS.text, fontSize: 34, fontWeight: '900', letterSpacing: 3, marginTop: 8, textAlign: 'center'},
  wordSober: {color: COLORS.redLight},
  card: {borderRadius: RADIUS.md, backgroundColor: COLORS.anthracite, borderWidth: 1, borderColor: COLORS.redDarker, padding: 8},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10},
  rowLabel: {color: COLORS.textDim, fontSize: 15},
  rowValue: {color: COLORS.text, fontSize: 16, fontWeight: '800'},
  unlock: {alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: RADIUS.md, backgroundColor: COLORS.redDarker, borderWidth: 1.5, borderColor: COLORS.neon},
  unlockText: {color: COLORS.redLight, fontWeight: '900', letterSpacing: 1},
  buttons: {gap: 12},
});
