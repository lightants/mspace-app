const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/private/defaults/exclusionList').default;

const projectRoot = __dirname;
const rootReactNative = path.resolve(projectRoot, 'node_modules/react-native');
const rootReact = path.resolve(projectRoot, 'node_modules/react');

const config = getDefaultConfig(projectRoot);
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'react-native': rootReactNative,
  react: rootReact,
};

// Keep Metro on this app's single React Native copy if a dependency nests one.
config.resolver.blockList = exclusionList([
  /node_modules[/\\].+[/\\]node_modules[/\\]react-native[/\\].*/,
]);

module.exports = config;
