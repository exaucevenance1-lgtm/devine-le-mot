import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {ErrorBoundary} from './components/ErrorBoundary';
import {ScreenContainer} from './components/ScreenContainer';
import {COLORS} from './constants/theme';
import {Navigator} from './navigation/Navigator';
import {AppProvider, useApp} from './state/AppContext';

function Root() {
  const {loaded} = useApp();
  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.neon} size="large" />
      </View>
    );
  }
  return (
    <ScreenContainer>
      <ErrorBoundary>
        <Navigator />
      </ErrorBoundary>
    </ScreenContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loading: {flex: 1, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center'},
});
