// module.exports = {
//     // target: 'experimental-serverless-trace',
// }


// const withTM = require('next-transpile-modules');
//
// module.exports = withTM({
//     // transpileModules: ['@nex/data']
// });


console.log('TRANSPILE');

const withTM = require('next-transpile-modules')(['../data']); // pass the modules you would like to see transpiled
// const withTM = require('next-transpile-modules')([]); // pass the modules you would like to see transpiled

module.exports = withTM();