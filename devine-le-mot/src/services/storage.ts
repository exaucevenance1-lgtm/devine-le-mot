import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '../utils/logger';

/** Couche unique d'accès au stockage : remplaçable sans toucher au reste du code. */
export const storage = {
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      logger.warn('storage.getJson', key, e);
      return null;
    }
  },
  async setJson<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      logger.warn('storage.setJson', key, e);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      logger.warn('storage.remove', key, e);
    }
  },
};
