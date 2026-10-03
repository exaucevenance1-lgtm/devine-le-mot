/*
 * Génère les dossiers natifs (android/ ou windows/) à partir des templates officiels
 * React Native 0.76.5, sans toucher à src/, package.json ni app.json.
 * Usage : npm run setup:android | npm run setup:windows
 */
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const target = process.argv[2];
const root = path.resolve(__dirname, '..');
const sh = (cmd, cwd = root) => {
  console.log(`> ${cmd}`);
  const r = spawnSync(cmd, {cwd, stdio: 'inherit', shell: true});
  if (r.status !== 0) {
    console.error(`Échec : ${cmd}`);
    process.exit(r.status || 1);
  }
};

if (target === 'android') {
  if (fs.existsSync(path.join(root, 'android', 'gradlew'))) {
    console.log('android/ est déjà généré.');
    process.exit(0);
  }
  const tmp = path.join(root, '.tmp-rn');
  fs.rmSync(tmp, {recursive: true, force: true});
  sh(`npx --yes @react-native-community/cli@15.0.1 init DevineLeMot --version 0.76.5 --skip-install --skip-git-init --package-name com.devinelemot --directory .tmp-rn`);
  fs.cpSync(path.join(tmp, 'android'), path.join(root, 'android'), {recursive: true});

// Autorisation Android nécessaire pour le module Vibration.
const manifestPath = path.join(
  root,
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml',
);

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');

  const vibrationPermission =
    '<uses-permission android:name="android.permission.VIBRATE" />';

  if (!manifest.includes(vibrationPermission)) {
    manifest = manifest.replace(
      '<manifest ',
      `<manifest ${vibrationPermission}\n    `,
    );

    fs.writeFileSync(manifestPath, manifest);
    console.log('Permission VIBRATE ajoutée à AndroidManifest.xml');
  }
}

fs.rmSync(tmp, {recursive: true, force: true});
  console.log('android/ généré. Prochaine étape : npm install puis npm run build:android');
} else if (target === 'windows') {
  if (!fs.existsSync(path.join(root, 'node_modules', 'react-native-windows'))) {
    sh('npm install');
  }
  sh('npx react-native init-windows --template cpp-app --overwrite');
  console.log('windows/ généré. Prochaine étape : npm run build:windows');
} else {
  console.error('Usage : node scripts/setup-native.js <android|windows>');
  process.exit(1);
}
