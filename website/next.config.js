
// console.log('TRANSPILE');

const withTM = require('next-transpile-modules')(['../data', 'lodash-es']); // pass the modules you would like to see transpiled

module.exports = withTM({
    target: 'serverless',
    // target: 'server',
});
