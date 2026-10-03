/*
 * Génère les dossiers natifs (android/ ou windows/) à partir des templates officiels
 * React Native 0.76.5.
 *
 * Configure également automatiquement l'icône Android
 * depuis assets/icon.png.
 */

const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const target = process.argv[2];

const root = path.resolve(__dirname, '..');

const sh = (cmd, cwd = root) => {
  console.log(`> ${cmd}`);

  const result = spawnSync(cmd, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    console.error(`Échec : ${cmd}`);
    process.exit(result.status || 1);
  }
};

/**
 * Configure l'icône Android.
 */
function configureAndroidIcon() {
  const iconSource = path.join(root, 'assets', 'icon.png');

  if (!fs.existsSync(iconSource)) {
    console.error('');
    console.error('❌ Icône introuvable !');
    console.error(`Fichier attendu : ${iconSource}`);
    console.error('');
    process.exit(1);
  }

  const resDir = path.join(
    root,
    'android',
    'app',
    'src',
    'main',
    'res'
  );

  const densities = [
    'mipmap-mdpi',
    'mipmap-hdpi',
    'mipmap-xhdpi',
    'mipmap-xxhdpi',
    'mipmap-xxxhdpi',
  ];

  console.log('');
  console.log('🎨 Configuration de l’icône Android...');

  for (const density of densities) {
    const densityDir = path.join(resDir, density);

    if (!fs.existsSync(densityDir)) {
      fs.mkdirSync(densityDir, {recursive: true});
    }

    fs.copyFileSync(
      iconSource,
      path.join(densityDir, 'ic_launcher.png')
    );

    fs.copyFileSync(
      iconSource,
      path.join(densityDir, 'ic_launcher_round.png')
    );
  }

  console.log('✅ Icône Android installée.');
}

/**
 * Configure AndroidManifest.xml
 */
function configureAndroidManifest() {
  const manifestPath = path.join(
    root,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml'
  );

  if (!fs.existsSync(manifestPath)) {
    console.warn('⚠️ AndroidManifest.xml introuvable.');
    return;
  }

  let manifest = fs.readFileSync(manifestPath, 'utf8');

  manifest = manifest.replace(
    /android:icon="@mipmap\/[^"]+"/,
    'android:icon="@mipmap/ic_launcher"'
  );

  manifest = manifest.replace(
    /android:roundIcon="@mipmap\/[^"]+"/,
    'android:roundIcon="@mipmap/ic_launcher_round"'
  );

  fs.writeFileSync(manifestPath, manifest);

  console.log('✅ AndroidManifest.xml configuré.');
}

/**
 * Génération Android
 */
if (target === 'android') {
  if (fs.existsSync(path.join(root, 'android', 'gradlew'))) {
    console.log('android/ est déjà généré.');
  } else {
    const tmp = path.join(root, '.tmp-rn');

    fs.rmSync(tmp, {
      recursive: true,
      force: true,
    });

    sh(
      `npx --yes @react-native-community/cli@15.0.1 init DevineLeMot --version 0.76.5 --skip-install --skip-git-init --package-name com.devinelemot --directory .tmp-rn`
    );

    fs.cpSync(
      path.join(tmp, 'android'),
      path.join(root, 'android'),
      {recursive: true}
    );

    fs.rmSync(tmp, {
      recursive: true,
      force: true,
    });

    console.log('android/ généré.');
  }

  // Installation de l'icône
  configureAndroidIcon();

  // Configuration du manifeste
  configureAndroidManifest();

  console.log('');
  console.log('✅ Préparation Android terminée.');
  console.log('Prochaine étape : npm install puis npm run build:android');
}

/**
 * Génération Windows
 */
else if (target === 'windows') {
  if (!fs.existsSync(path.join(root, 'node_modules', 'react-native-windows'))) {
    sh('npm install');
  }

  sh('npx react-native init-windows --template cpp-app --overwrite');

  console.log('windows/ généré. Prochaine étape : npm run build:windows');
}

else {
  console.error('Usage : node scripts/setup-native.js <android|windows>');
  process.exit(1);
}
