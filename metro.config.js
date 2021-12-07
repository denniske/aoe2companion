const { getDefaultConfig } = require('expo/metro-config');

const exclusionList = require('metro-config/src/defaults/exclusionList');

console.log("Applying metro.config.js");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.blacklistRE = exclusionList([/^tools\/.*/, /^website2\/.*/]);
defaultConfig.resolver.assetExts.push('lazy');

module.exports = defaultConfig;
