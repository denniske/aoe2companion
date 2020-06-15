const blacklist = require('react-native/packager/blacklist');
const blacklist = require('metro-config/src/defaults/blacklist')

const config = {
    getBlacklistRE() {
        return blacklist([
            /assets\/raw\/.*/,
            /tools\/.*/,
            /website\/.*/
        ]);
    }
};

module.exports = config;