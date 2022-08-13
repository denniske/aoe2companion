require('ts-node/register');

console.log('APP ENV', process.env.APP);

module.exports = process.env.APP === 'aoe2' ? require('./app2.config.ts') : require('./app4.config.ts');

// import app2Config from "./app2.config";
// import app4Config from "./app4.config";
//
// export default {
//   ...(process.env.APP === 'aoe2' ? app2Config : app4Config)
// };
