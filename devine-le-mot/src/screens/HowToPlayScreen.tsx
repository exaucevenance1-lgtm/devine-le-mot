import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {FadeIn} from '../components/FadeIn';
import {ScreenHeader} from '../components/ScreenHeader';
import {GAME_CONFIG} from '../constants/gameConfig';
import {COLORS, RADIUS} from '../constants/theme';

const RULES: [string, string][] = [
  ['Devine le mot', 'Un mot secret est caché. Touche une lettre : si elle est dans le mot, elle apparaît à toutes ses places.'],
  ['Bonne lettre', `+${GAME_CONFIG.CORRECT_LETTER_POINTS} points par lettre trouvée, et +${GAME_CONFIG.BONUS_COMPLETION} de bonus quand le mot est complet.`],
  ['Mauvaise lettre', `-${GAME_CONFIG.WRONG_LETTER_POINTS} points. Le score peut descendre sous zéro.`],
  ['Accents', 'E révèle aussi É, È, Ê, Ë. Pareil pour A, C, I, O et U.'],
  ['Niveaux', `Gagne ${GAME_CONFIG.WINS_TO_UNLOCK_NEXT_LEVEL} parties dans un niveau pour débloquer le suivant.`],
  ['Abandonner', 'Tu peux abandonner à tout moment : le mot est alors révélé.'],
];

export function HowToPlayScreen() {
  return (
    <View style={styles.root}>
      <ScreenHeader title="COMMENT JOUER" />
      <ScrollView contentContainerStyle={styles.content}>
        {RULES.map(([title, text], i) => (
          <FadeIn key={title} delay={i * 70}>
            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.text}>{text}</Text>
            </View>
          </FadeIn>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: 16, gap: 12, maxWidth: 560, width: '100%', alignSelf: 'center'},
  card: {borderRadius: RADIUS.md, backgroundColor: COLORS.anthracite, borderWidth: 1, borderColor: COLORS.redDarker, padding: 16},
  title: {color: COLORS.redLight, fontSize: 16, fontWeight: '800', marginBottom: 4},
  text: {color: COLORS.text, fontSize: 15, lineHeight: 21},
});
