const semver = require('semver')

const version = process.argv[2];

console.log('v'+semver.major(version))