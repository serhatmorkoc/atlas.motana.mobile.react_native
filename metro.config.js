const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add .cjs extension support
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Ensure node_modules is properly watched (especially for rxjs)
const projectRoot = __dirname;
const nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

config.watchFolders = [
  ...(config.watchFolders || []),
  ...nodeModulesPaths,
];

// Ensure rxjs is not blocked
if (!config.resolver.blockList) {
  config.resolver.blockList = [];
}

// Remove rxjs from blockList if it exists
config.resolver.blockList = config.resolver.blockList.filter(
  (pattern) => {
    const patternStr = pattern.toString();
    return !patternStr.includes('rxjs') && !patternStr.includes('node_modules/rxjs');
  }
);

module.exports = config;
