require('ts-node/register');

// console.log('APP ENV', process.env.APP);

module.exports = process.env.APP === 'aoe2' ? require('./app2.config.ts') : require('./app4.config.ts');
