
const tag = process.argv[2];

const regex = /(.+)-v.+/gm;
const match = regex.exec(tag);

console.log(match[1].replace('aoe2-', '').replace('aoe4-', ''));
