const semver = require('semver')
const fs = require('fs')

require('dotenv').config();

const commitSha1 = process.env.COMMIT_SHA1;
const serviceName = process.env.SERVICE_NAME;

let dockerComposeStr = fs.readFileSync('docker-compose-worker.yml', 'utf8');

const regex = new RegExp(`image: denniske\/aoe2companion-${serviceName}:.*`, 'gm');
console.log(regex);
dockerComposeStr = dockerComposeStr.replace(regex, `image: denniske/aoe2companion-${serviceName}:${commitSha1}`);

fs.writeFileSync('docker-compose-worker.yml', dockerComposeStr, { encoding: 'utf-8' });
