# Compilation cloud GitHub Actions

Ce projet contient maintenant deux workflows :

- `.github/workflows/android.yml` : génère un APK Android Release.
- `.github/workflows/windows.yml` : génère un installateur Windows `.exe`.

## Utilisation

1. Créer un dépôt GitHub et y envoyer tout le contenu du projet.
2. Ouvrir l'onglet **Actions**.
3. Sélectionner **Android APK** ou **Windows Installer**.
4. Cliquer sur **Run workflow**.
5. Une fois terminé, télécharger l'artefact correspondant.

Les workflows génèrent les dossiers natifs `android/` et `windows/` pendant le build : ils n'ont pas besoin d'être présents dans le dépôt.

## Remarque

Le build Android utilise Java 17 et Android SDK 35. Le build Windows utilise le runner Windows de GitHub et Inno Setup.
