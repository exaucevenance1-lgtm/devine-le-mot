# Devine le Mot

Jeu de devinettes de mots en français (hors ligne), React Native + TypeScript, pensé pour Android et Windows.
Identité visuelle : noir dominant, rouge néon / rouge clair / rouge sombre en accents.

Démarrage rapide : voir **BUILD.md**.

## Architecture
```
src/
├── constants/    gameConfig.ts (GAME_CONFIG : score, bonus, déblocage), levels.ts, theme.ts
├── data/words/   level1..level10.ts (30+ mots chacun) + index.ts
├── logic/        gameEngine, scoreManager, levelManager, statisticsManager, wordRepository, progressLogic (fonctions pures, testées)
├── services/     storage, progressRepository, feedbackService (sons/vibrations), haptics(.windows)
├── state/        AppContext (progression, paramètres, partie en cours)
├── hooks/        useGame, useAnimatedNumber
├── components/   NeonButton, Keyboard, LetterKey, WordDisplay, ScoreBoard, FloatingText, ConfirmModal, Confetti...
├── screens/      Home, Levels, Game, Result, Stats, Settings, HowToPlay
├── navigation/   Navigator maison (transitions fade+scale+slide, aucune dépendance native)
└── assets/       images, icons, sounds, animations (vides, prêts à l'emploi)
```
Séparation par plateforme : `services/haptics.ts` (Android) et `haptics.windows.ts` (no-op) — mécanisme d'extensions de Metro.

## Règles et configuration
Tout est dans `src/constants/gameConfig.ts` : score initial 100, +10 / −15, bonus de réussite +50, 3 victoires pour débloquer le niveau suivant. Le score peut devenir négatif.

**Accents** : le clavier affiche A–Z. « E » révèle É, È, Ê, Ë ; « A » → À Â Ä ; « C » → Ç ; « I » → Î Ï ; « O » → Ô Ö ; « U » → Ù Û Ü.

**Partie interrompue** : la partie en cours est sauvegardée après chaque lettre ; « REPRENDRE LA PARTIE » apparaît à l'accueil.

## Ajouter un niveau
1. Entrée dans `constants/levels.ts`. 2. Fichier `data/words/levelN.ts`. 3. Ligne dans `data/words/index.ts`.

## Limites connues
- Non compilé ni testé sur appareil par l'auteur (voir BUILD.md).
- Pas de sons réels (architecture prête dans `feedbackService.ts`).
- Pas de saisie au clavier physique sous Windows (souris et tactile fonctionnent).
