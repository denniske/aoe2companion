const semver = require('semver')

const tag = process.argv[2];

if (tag === 'master') {
    console.log('master');
    process.exit();
}

console.log(tag.replace('desktop-v', ''));
