const blacklist = require('metro-config/src/defaults/blacklist');

console.log("Applying metro.config.js");

module.exports = {
    resolver: {
        blacklistRE: blacklist([/^tools\/.*/, /^website2\/.*/]),
    },
};
