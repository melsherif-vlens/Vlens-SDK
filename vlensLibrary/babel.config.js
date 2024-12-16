module.exports = {
  presets: [
    ['module:react-native-builder-bob/babel-preset', { modules: 'commonjs' }],
    'module:metro-react-native-babel-preset', // for React Native
    '@babel/preset-react', // add this for JSX support
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['react-native-worklets-core/plugin'],
  ],
};
