const path = require('path');
const fs = require('fs');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

// Évite que Metro indexe les dossiers de build natifs Windows.
const blockList = [new RegExp(`${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`)];
try {
  const rnwPath = fs.realpathSync(path.resolve(require.resolve('react-native-windows/package.json'), '..'));
  blockList.push(new RegExp(`${rnwPath.replace(/[/\\]/g, '/')}/build/.*`));
  blockList.push(new RegExp(`${rnwPath.replace(/[/\\]/g, '/')}/target/.*`));
} catch {
  // react-native-windows non installé : ignoré.
}
blockList.push(/.*\.ProjectImports\.zip/);

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {blockList: exclusionList(blockList)},
});
