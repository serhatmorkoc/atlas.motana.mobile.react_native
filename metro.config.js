const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure Relay artifacts are properly resolved
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
