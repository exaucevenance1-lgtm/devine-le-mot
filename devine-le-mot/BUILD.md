# BUILD — Devine le Mot (React Native + TypeScript, Android + Windows)

> **État réel du projet** : le code (`src/`) est complet. Les dossiers natifs `android/` et `windows/`
> **ne sont pas inclus** : ils sont générés par les outils officiels (voir étape 2) car ils contiennent
> des binaires (gradle-wrapper.jar) et des solutions Visual Studio qu'on ne peut pas écrire à la main de façon fiable.
> Le projet n'a **pas** été compilé ni testé sur appareil par l'auteur (pas de réseau ni d'Android SDK au moment de la création).
> Seule la logique pure (`src/logic`) a été compilée en TypeScript strict et testée (12 tests OK).

## Versions de référence
| Outil | Version |
|---|---|
| Node.js | 18 ou 20 LTS |
| React Native | 0.76.5 (New Architecture, Hermes) |
| react-native-windows | ^0.76.0 |
| TypeScript | 5.0.4 |
| JDK | 17 |
| Android | SDK Platform 35, Build-Tools 35.0.0, NDK 26.1.10909125 (installés via Android Studio) |
| Windows | Windows 10/11, Visual Studio 2022 (workloads « Développement Desktop C++ » et « Développement UWP »), Windows SDK 10.0.19041+ |

## 1. Prérequis et vérification
```bash
npm install
npm run doctor        # vérifie Node, npm, Java, ANDROID_HOME, MSBuild
```
Variables : `ANDROID_HOME` (SDK Android), `JAVA_HOME` (JDK 17). Sous Windows, activer le « Mode développeur ».

## 2. Générer les dossiers natifs (une seule fois)
```bash
npm run setup:android     # génère android/ (package com.devinelemot) depuis le template RN 0.76.5
npm run setup:windows     # génère windows/ via react-native init-windows (cpp-app)
```
Ne touche ni à `src/`, ni à `package.json`, ni à `app.json`. Le nom du composant (`DevineLeMot`) doit rester identique à `app.json`.

## 3. Lancer en développement
```bash
npm start                 # Metro
npm run android           # émulateur ou téléphone USB (débogage USB activé)
npm run windows           # application Windows en mode debug
```

## 4. Vérifications et tests
```bash
npm run typecheck         # tsc --noEmit
npm run lint
npm test                  # tests Jest de la logique (moteur, score, niveaux, progression, mots)
npm run verify            # les trois à la suite
```

## 5. Construire Android
```bash
npm run build:android:debug     # APK debug
npm run build:android           # APK release
```
Sorties :
- `android/app/build/outputs/apk/debug/app-debug.apk`
- `android/app/build/outputs/apk/release/app-release.apk`

Le template RN signe la release avec la clé *debug* : l'APK est installable directement (`adb install app-release.apk`
ou copie sur le téléphone avec « sources inconnues » autorisées). **Pour une publication Play Store**, créer un keystore
et configurer `signingConfigs.release` dans `android/app/build.gradle`.

## 6. Construire Windows
```bash
npm run build:windows
```
Sortie : `windows/x64/Release/`.

**Installateur .exe** (option recommandée pour ce projet) :
1. Installer Inno Setup.
2. Vérifier le dossier réel de sortie Release, ajuster `SourceDir` dans `installer/windows/devine-le-mot.iss`.
3. Compiler le script (`iscc installer\windows\devine-le-mot.iss`) → `dist/DevineLeMot-Setup.exe`.

**Alternative MSIX** : ouvrir `windows/DevineLeMot.sln` dans Visual Studio → clic droit sur le projet → Publier → Créer des packages d'application.

## 7. Problèmes courants
- `SDK location not found` → définir `ANDROID_HOME` ou créer `android/local.properties` (`sdk.dir=...`).
- `Unsupported class file major version` → mauvais JDK, utiliser le JDK 17.
- Metro ne trouve pas un module → `npx react-native start --reset-cache`.
- Écran blanc Android en release → vérifier que le bundle est généré (`./gradlew clean assembleRelease`).
- Erreur de lien async-storage sous Windows → vérifier la version (1.24.0) et relancer `npm run setup:windows`. Le stockage est isolé dans `src/services/storage.ts` : remplaçable sans toucher au reste.
- Erreurs MSBuild « workload manquant » → installer les workloads Visual Studio listés plus haut.
