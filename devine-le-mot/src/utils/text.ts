const ACCENT_MAP: Record<string, string> = {
  À: 'A', Â: 'A', Ä: 'A', Ç: 'C', É: 'E', È: 'E', Ê: 'E', Ë: 'E',
  Î: 'I', Ï: 'I', Ô: 'O', Ö: 'O', Ù: 'U', Û: 'U', Ü: 'U', Ÿ: 'Y',
};

/** Lettre de base en majuscule : "é" -> "E", "ç" -> "C". */
export function baseLetter(ch: string): string {
  const up = ch.toUpperCase();
  return ACCENT_MAP[up] ?? up;
}

export const ALPHABET: readonly string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
