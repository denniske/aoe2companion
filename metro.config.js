const { getDefaultConfig } = require("metro-config");

const exclusionList = require('metro-config/src/defaults/exclusionList');

console.log("Applying metro.config.js");

module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts }
    } = await getDefaultConfig();

    return {
        resolver: {
            blacklistRE: exclusionList([/^tools\/.*/, /^website2\/.*/]),
            assetExts: [...assetExts, 'lazy'],
        }
    };
})();
