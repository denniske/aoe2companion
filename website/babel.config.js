
module.exports = function(api) {
  console.log('BABEL WEBSITE');
  console.log('BABEL WEBSITE', process.env.APP);
  // api.cache(true);
  return {
    presets: ['next/babel'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@nex/data/hooks": ["./data/src/index-hooks.ts"],
            "@nex/data/api": ["./data/src/index-api.ts"],
            "@nex/data": ["./data/src/index.ts"],
            "@nex/dataset": [process.env.APP === 'aoe2' ? "./dataset2/src/index-website.ts" : "./dataset2/src/index-website.ts"],
            "@nex/app/view": [process.env.APP === 'aoe2' ? "./app/src/index-view.ts" : "./app4/src/index-view.ts"],
          }
        }
      ]
    ]
  };
};

// module.exports = {};
