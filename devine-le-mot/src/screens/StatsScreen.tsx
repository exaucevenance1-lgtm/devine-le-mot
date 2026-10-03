import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {FadeIn} from '../components/FadeIn';
import {ScreenHeader} from '../components/ScreenHeader';
import {COLORS, RADIUS} from '../constants/theme';
import {useAnimatedNumber} from '../hooks/useAnimatedNumber';
import {useApp} from '../state/AppContext';

function StatCard({label, value, delay, animated}: {label: string; value: number; delay: number; animated: boolean}) {
  const shown = useAnimatedNumber(value, animated, 700, 0);
  return (
    <FadeIn delay={delay} style={styles.cardWrap}>
      <View style={styles.card}>
        <Text style={styles.value}>{shown}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </FadeIn>
  );
}

export function StatsScreen() {
  const {progress, settings} = useApp();
  const s = progress.stats;
  const items: [string, number][] = [
    ['Parties jouées', s.gamesPlayed],
    ['Parties gagnées', s.gamesWon],
    ['Parties abandonnées', s.gamesAbandoned],
    ['Meilleur score', s.bestScore],
    ['Lettres trouvées', s.totalLettersFound],
    ['Erreurs totales', s.totalErrors],
    ['Niveau maximum atteint', s.maxLevelReached],
  ];
  return (
    <View style={styles.root}>
      <ScreenHeader title="STATISTIQUES" />
      <ScrollView contentContainerStyle={styles.grid}>
        {items.map(([label, value], i) => (
          <StatCard key={label} label={label} value={value} delay={i * 60} animated={settings.animations} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  grid: {flexDirection: 'row', flexWrap: 'wrap', padding: 10, maxWidth: 560, width: '100%', alignSelf: 'center'},
  cardWrap: {width: '50%', padding: 6},
  card: {borderRadius: RADIUS.md, backgroundColor: COLORS.anthracite, borderWidth: 1, borderColor: COLORS.redDarker, padding: 16, minHeight: 100, justifyContent: 'center'},
  value: {color: COLORS.neon, fontSize: 32, fontWeight: '900'},
  label: {color: COLORS.textDim, fontSize: 13, marginTop: 4},
});
