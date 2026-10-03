import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ConfirmModal} from '../components/ConfirmModal';
import {FadeIn} from '../components/FadeIn';
import {Keyboard} from '../components/Keyboard';
import {NeonButton} from '../components/NeonButton';
import {ScoreBoard} from '../components/ScoreBoard';
import {WordDisplay} from '../components/WordDisplay';
import {GAME_CONFIG} from '../constants/gameConfig';
import {COLORS} from '../constants/theme';
import {useGame} from '../hooks/useGame';
import {toGameResult} from '../logic/progressLogic';
import {useNavigation} from '../navigation/NavigationContext';
import {useApp} from '../state/AppContext';

export function GameScreen({level, resume}: {level: number; resume: boolean}) {
  const nav = useNavigation();
  const app = useApp();
  const {game, event, guess, abandon} = useGame(level, resume);
  const [confirm, setConfirm] = useState(false);
  const handled = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finished = game.status !== 'playing';
  const animated = app.settings.animations;

  // Fin de partie : enregistre le résultat, laisse jouer l'animation, puis affiche le résultat.
  useEffect(() => {
    if (!finished || handled.current) {
      return;
    }
    handled.current = true;
    const result = app.recordResult(toGameResult(game));
    const delay = animated
      ? game.status === 'won' ? GAME_CONFIG.RESULT_DELAY_WIN_MS : GAME_CONFIG.RESULT_DELAY_ABANDON_MS
      : 200;
    timer.current = setTimeout(() => nav.navigate({name: 'result', result}), delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FadeIn style={styles.header}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>NIVEAU</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>
          <ScoreBoard score={game.score} event={event} animated={animated} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>ERREURS</Text>
            <Text style={[styles.statValue, game.errors > 0 && styles.statError]}>{game.errors}</Text>
          </View>
        </FadeIn>

        <View style={styles.word}>
          <WordDisplay game={game} celebrate={game.status === 'won'} />
        </View>

        <FadeIn delay={120}>
          <Keyboard guessed={game.guessed} disabled={finished || confirm} animated={animated} onPress={guess} />
        </FadeIn>

        <View style={styles.footer}>
          <NeonButton title="ABANDONNER" variant="danger" compact disabled={finished} onPress={() => setConfirm(true)} />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={confirm && !finished}
        message="Voulez-vous vraiment abandonner cette partie ?"
        cancelLabel="CONTINUER"
        confirmLabel="ABANDONNER"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          abandon();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {flexGrow: 1, justifyContent: 'space-between', paddingVertical: 12, gap: 16, maxWidth: 560, width: '100%', alignSelf: 'center'},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16},
  stat: {minWidth: 64, alignItems: 'center'},
  statLabel: {color: COLORS.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1.5},
  statValue: {color: COLORS.text, fontSize: 24, fontWeight: '900'},
  statError: {color: COLORS.redLight},
  word: {minHeight: 120, justifyContent: 'center'},
  footer: {alignItems: 'center', paddingTop: 4},
});
