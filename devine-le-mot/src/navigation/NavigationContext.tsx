import {createContext, useContext} from 'react';
import {Route} from '../types/navigation';

interface NavigationValue {
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
}

export const NavigationContext = createContext<NavigationValue | null>(null);

export function useNavigation(): NavigationValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation doit être utilisé dans <Navigator>');
  }
  return ctx;
}
