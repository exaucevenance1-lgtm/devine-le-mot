import {Vibration} from 'react-native';

/**
 * Vibration sécurisée.
 * Une erreur native de vibration ne doit jamais provoquer
 * la fermeture de l'application.
 */
export function vibrate(ms: number): void {
  try {
    Vibration.vibrate(ms);
  } catch (error) {
    // La vibration est optionnelle : on ne bloque jamais le jeu.
    console.warn('Vibration indisponible:', error);
  }
}
