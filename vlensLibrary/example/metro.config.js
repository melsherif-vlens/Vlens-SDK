const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Ensure asset extensions are included
defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'png', // Add 'png' if not already included
  'jpg', 
  'jpeg',
  'svg',
];

module.exports = getConfig(defaultConfig, {
  root,
  pkg,
  project: __dirname,
});
