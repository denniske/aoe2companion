module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@nex/data/hooks": ["./data/src/index-hooks.ts"],
            "@nex/data/api": ["./data/src/index-api.ts"],
            "@nex/data": ["./data/src/index.ts"],
            "@nex/dataset": [process.env.APP === 'aoe2' ? "./dataset2/src/index.ts" : "./dataset4/src/index.ts"],
            "@nex/app/view": [process.env.APP === 'aoe2' ? "./app/src/index-view.ts" : "./app4/src/index-view.ts"],
          }
        }
      ]
    ]
  };
};

// module.exports = {};
