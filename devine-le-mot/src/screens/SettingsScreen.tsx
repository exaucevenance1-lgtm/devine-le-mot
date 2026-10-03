import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {ConfirmModal} from '../components/ConfirmModal';
import {FadeIn} from '../components/FadeIn';
import {NeonButton} from '../components/NeonButton';
import {ScreenHeader} from '../components/ScreenHeader';
import {Toggle} from '../components/Toggle';
import {useApp} from '../state/AppContext';

export function SettingsScreen() {
  const {settings, updateSettings, resetProgress} = useApp();
  const [confirm, setConfirm] = useState(false);
  const a = settings.animations;
  return (
    <View style={styles.root}>
      <ScreenHeader title="PARAMÈTRES" />
      <ScrollView contentContainerStyle={styles.content}>
        <FadeIn><Toggle label="Sons" value={settings.sound} animated={a} onChange={v => updateSettings({sound: v})} /></FadeIn>
        <FadeIn delay={70}><Toggle label="Vibrations" value={settings.vibration} animated={a} onChange={v => updateSettings({vibration: v})} /></FadeIn>
        <FadeIn delay={140}><Toggle label="Animations" value={a} animated={a} onChange={v => updateSettings({animations: v})} /></FadeIn>
        <FadeIn delay={210}>
          <NeonButton title="RÉINITIALISER LA PROGRESSION" variant="danger" onPress={() => setConfirm(true)} />
        </FadeIn>
      </ScrollView>
      <ConfirmModal
        visible={confirm}
        message="Effacer toute la progression, les scores et les statistiques ?"
        cancelLabel="ANNULER"
        confirmLabel="RÉINITIALISER"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          resetProgress();
          setConfirm(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: 16, gap: 14, maxWidth: 520, width: '100%', alignSelf: 'center'},
});
