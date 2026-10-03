import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Animated, BackHandler, Easing, StyleSheet} from 'react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {LevelsScreen} from '../screens/LevelsScreen';
import {GameScreen} from '../screens/GameScreen';
import {ResultScreen} from '../screens/ResultScreen';
import {StatsScreen} from '../screens/StatsScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {HowToPlayScreen} from '../screens/HowToPlayScreen';
import {useApp} from '../state/AppContext';
import {Route} from '../types/navigation';
import {isWindows} from '../utils/platform';
import {NavigationContext} from './NavigationContext';

interface Entry {
  route: Route;
  key: number;
}

function backTarget(route: Route): Route | null {
  switch (route.name) {
    case 'home':
      return null;
    case 'game':
    case 'result':
      return {name: 'levels'};
    default:
      return {name: 'home'};
  }
}

/**
 * Navigateur maison (aucune dépendance native) : un écran à la fois,
 * transition fade + scale + léger slide à chaque changement.
 */
export function Navigator() {
  const {settings} = useApp();
  const [entry, setEntry] = useState<Entry>({route: {name: 'home'}, key: 0});
  const anim = useRef(new Animated.Value(1)).current;
  const routeRef = useRef<Route>(entry.route);
  routeRef.current = entry.route;

  const navigate = useCallback((route: Route) => {
    setEntry(prev => ({route, key: prev.key + 1}));
  }, []);

  const goBack = useCallback(() => {
    const target = backTarget(routeRef.current);
    if (target) {
      navigate(target);
    }
  }, [navigate]);

  useLayoutEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: settings.animations ? 280 : 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry.key, settings.animations, anim]);

  useEffect(() => {
    if (isWindows) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backTarget(routeRef.current)) {
        goBack();
        return true;
      }
      return false; // écran d'accueil : laisse Android quitter l'app
    });
    return () => sub.remove();
  }, [goBack]);

  const value = useMemo(() => ({route: entry.route, navigate, goBack}), [entry.route, navigate, goBack]);
  const {route} = entry;

  let screen: React.ReactNode;
  switch (route.name) {
    case 'home':
      screen = <HomeScreen />;
      break;
    case 'levels':
      screen = <LevelsScreen highlightLevel={route.highlightLevel} />;
      break;
    case 'game':
      screen = <GameScreen level={route.level} resume={!!route.resume} />;
      break;
    case 'result':
      screen = <ResultScreen result={route.result} />;
      break;
    case 'stats':
      screen = <StatsScreen />;
      break;
    case 'settings':
      screen = <SettingsScreen />;
      break;
    default:
      screen = <HowToPlayScreen />;
  }

  return (
    <NavigationContext.Provider value={value}>
      <Animated.View
        key={entry.key}
        style={[
          styles.fill,
          {
            opacity: anim,
            transform: [
              {scale: anim.interpolate({inputRange: [0, 1], outputRange: [0.96, 1]})},
              {translateY: anim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})},
            ],
          },
        ]}>
        {screen}
      </Animated.View>
    </NavigationContext.Provider>
  );
}

const styles = StyleSheet.create({fill: {flex: 1}});
