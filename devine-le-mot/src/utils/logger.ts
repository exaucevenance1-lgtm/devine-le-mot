declare const __DEV__: boolean;

const enabled = typeof __DEV__ !== 'undefined' && __DEV__;

export const logger = {
  warn: (...args: unknown[]) => {
    if (enabled) {
      console.warn('[DevineLeMot]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (enabled) {
      console.error('[DevineLeMot]', ...args);
    }
  },
};
