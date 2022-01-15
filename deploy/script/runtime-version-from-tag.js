const semver = require('semver')

const tag = process.argv[2];

if (tag === 'master') {
    console.log('master');
    process.exit();
}
if (tag === 'yarn2') {
    console.log('yarn2');
    process.exit();
}

const regex = /(v.+)/gm;
const match = regex.exec(tag);

console.log(semver.major(match[1]));

