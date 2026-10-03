import React, {useEffect, useRef} from 'react';
import {Animated, Easing, ScrollView, StyleSheet, Text, View} from 'react-native';
import {FadeIn} from '../components/FadeIn';
import {NeonButton} from '../components/NeonButton';
import {APP_TEXT} from '../constants/gameConfig';
import {COLORS} from '../constants/theme';
import {useNavigation} from '../navigation/NavigationContext';
import {useApp} from '../state/AppContext';

export function HomeScreen() {
  const nav = useNavigation();
  const {progress, settings, activeGame} = useApp();
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!settings.animations) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
        Animated.timing(glow, {toValue: 0, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [settings.animations, glow]);

  const level = Math.min(progress.lastLevel, progress.unlockedLevel);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FadeIn style={styles.hero}>
        <Animated.View style={[styles.titleGlow, {opacity: glow.interpolate({inputRange: [0, 1], outputRange: [0.4, 1]})}]} />
        <Text style={styles.title}>DEVINE</Text>
        <Text style={[styles.title, styles.titleAccent]}>LE MOT</Text>
        <Text style={styles.subtitle}>{APP_TEXT.SUBTITLE}</Text>
      </FadeIn>
      <View style={styles.buttons}>
        {activeGame && (
          <FadeIn delay={150}>
            <NeonButton title="REPRENDRE LA PARTIE" onPress={() => nav.navigate({name: 'game', level: activeGame.level, resume: true})} />
          </FadeIn>
        )}
        <FadeIn delay={220}>
          <NeonButton
            title={activeGame ? 'NOUVELLE PARTIE' : 'JOUER'}
            variant={activeGame ? 'secondary' : 'primary'}
            onPress={() => nav.navigate({name: 'game', level})}
          />
        </FadeIn>
        <FadeIn delay={290}>
          <NeonButton title="NIVEAUX" variant="secondary" onPress={() => nav.navigate({name: 'levels'})} />
        </FadeIn>
        <FadeIn delay={360}>
          <NeonButton title="COMMENT JOUER" variant="secondary" onPress={() => nav.navigate({name: 'howto'})} />
        </FadeIn>
        <FadeIn delay={430} style={styles.row}>
          <NeonButton title="STATISTIQUES" variant="ghost" compact onPress={() => nav.navigate({name: 'stats'})} />
          <NeonButton title="PARAMÈTRES" variant="ghost" compact onPress={() => nav.navigate({name: 'settings'})} />
        </FadeIn>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', padding: 24, gap: 36, maxWidth: 560, width: '100%', alignSelf: 'center'},
  hero: {alignItems: 'center'},
  titleGlow: {position: 'absolute', top: 10, width: 260, height: 160, borderRadius: 130, backgroundColor: 'rgba(255,36,66,0.14)'},
  title: {color: COLORS.text, fontSize: 52, fontWeight: '900', letterSpacing: 4, lineHeight: 56},
  titleAccent: {color: COLORS.neon, textShadowColor: COLORS.neon, textShadowRadius: 18},
  subtitle: {color: COLORS.textDim, fontSize: 15, textAlign: 'center', marginTop: 14, maxWidth: 320},
  buttons: {gap: 14},
  row: {flexDirection: 'row', justifyContent: 'center', gap: 8},
});
