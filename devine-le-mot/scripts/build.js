/* Usage : node scripts/build.js android [debug] | node scripts/build.js windows */
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const [target, mode] = process.argv.slice(2);
const root = path.resolve(__dirname, '..');
const run = (cmd, cwd = root) => {
  console.log(`> ${cmd}`);
  const r = spawnSync(cmd, {cwd, stdio: 'inherit', shell: true});
  if (r.status !== 0) process.exit(r.status || 1);
};

if (target === 'android') {
  const dir = path.join(root, 'android');
  if (!fs.existsSync(path.join(dir, 'gradlew'))) {
    console.error('android/ absent. Lance d\'abord : npm run setup:android');
    process.exit(1);
  }
  const debug = mode === 'debug';
  const gradle = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  run(`${gradle} ${debug ? 'assembleDebug' : 'assembleRelease'}`, dir);
  const apk = path.join(dir, 'app', 'build', 'outputs', 'apk', debug ? 'debug' : 'release', debug ? 'app-debug.apk' : 'app-release.apk');
  console.log(fs.existsSync(apk) ? `APK : ${apk}` : 'Build terminé mais APK introuvable : vérifier android/app/build/outputs/apk/');
} else if (target === 'windows') {
  if (!fs.existsSync(path.join(root, 'windows'))) {
    console.error('windows/ absent. Lance d\'abord : npm run setup:windows');
    process.exit(1);
  }
  run('npx react-native run-windows --release --arch x64 --no-launch --no-deploy --logging');
  console.log('Sortie : windows/x64/Release/ (voir BUILD.md pour MSIX / installateur .exe)');
} else {
  console.error('Usage : node scripts/build.js <android [debug]|windows>');
  process.exit(1);
}
