
console.log('TRANSPILE');

const withTM = require('next-transpile-modules')(['../data']); // pass the modules you would like to see transpiled

module.exports = withTM();