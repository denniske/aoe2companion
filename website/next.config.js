
console.log('TRANSPILE');

const withTM = require('next-transpile-modules')([
    process.cwd().includes('/vercel/path0') ? '/vercel/path0/data' : '../data'
]); // pass the modules you would like to see transpiled

module.exports = withTM({
    // target: 'serverless',
    // target: 'server',
});

// module.exports = {
//     // target: 'serverless',
//     // target: 'server',
// };
