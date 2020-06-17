const semver = require('semver')

const tag = process.argv[2];

if (tag === 'master') {
    console.log('master');
    exit();
}

console.log('prod-v' + semver.major(tag));
