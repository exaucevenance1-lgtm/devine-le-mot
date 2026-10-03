/* Vérifie l'environnement de build. Usage : npm run doctor */
const {spawnSync} = require('child_process');
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, {encoding: 'utf8', shell: true});
  return r.status === 0 ? (r.stdout || r.stderr).split('\n')[0].trim() : null;
};
const checks = [
  ['Node.js (>=18)', run('node', ['-v'])],
  ['npm', run('npm', ['-v'])],
  ['Java JDK 17', run('java', ['-version'])],
  ['ANDROID_HOME', process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || null],
];
if (process.platform === 'win32') {
  checks.push(['MSBuild (Visual Studio)', run('where', ['msbuild'])]);
}
let ko = 0;
for (const [name, value] of checks) {
  console.log(`${value ? 'OK ' : 'KO '} ${name}${value ? ' : ' + value : ''}`);
  if (!value) ko++;
}
process.exit(ko ? 1 : 0);
