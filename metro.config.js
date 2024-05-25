const {getSentryExpoConfig} = require("@sentry/react-native/metro");

const exclusionList = require('metro-config/src/defaults/exclusionList');

console.log("Applying metro.config.js");

const defaultConfig = getSentryExpoConfig(__dirname, {
    // For TailWindCSS
    isCSSEnabled: true,
});

defaultConfig.resolver.blacklistRE = exclusionList([/^tools\/.*/]);

module.exports = defaultConfig;
