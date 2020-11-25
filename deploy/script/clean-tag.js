
let tag = process.argv[2];

tag = tag.replace('refs/heads/', '');
tag = tag.replace('refs/tags/', '');

console.log(tag);
