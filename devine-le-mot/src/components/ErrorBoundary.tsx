import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/theme';
import {logger} from '../utils/logger';

interface State {
  failed: boolean;
}

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
  state: State = {failed: false};

  static getDerivedStateFromError(): State {
    return {failed: true};
  }

  componentDidCatch(error: Error): void {
    logger.error('ErrorBoundary', error);
  }

  render() {
    if (!this.state.failed) {
      return this.props.children;
    }
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Oups, un problème est survenu</Text>
        <Text style={styles.text}>Ta progression est sauvegardée. Relance l'écran pour continuer.</Text>
        <Pressable style={styles.btn} onPress={() => this.setState({failed: false})}>
          <Text style={styles.btnText}>RÉESSAYER</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {flex: 1, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center', padding: 24},
  title: {color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: 8},
  text: {color: COLORS.textDim, textAlign: 'center', marginBottom: 20},
  btn: {backgroundColor: COLORS.neon, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14},
  btnText: {color: '#fff', fontWeight: '800', letterSpacing: 1},
});
