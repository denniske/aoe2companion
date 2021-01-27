const { getDefaultConfig } = require("metro-config");

const blacklist = require('metro-config/src/defaults/blacklist');

console.log("Applying metro.config.js");

module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts }
    } = await getDefaultConfig();

    return {
        resolver: {
            blacklistRE: blacklist([/^tools\/.*/, /^website2\/.*/]),
            assetExts: [...assetExts, 'lazy'],
        }
    };
})();
