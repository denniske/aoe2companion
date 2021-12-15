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
            "@nex/data": ["./data/src/index.ts"],
            "@nex/dataset": [process.env.APP === 'aoe2' ? "./dataset2/src/index.ts" : "./dataset4/src/index.ts"],
          }
        }
      ]
    ]
  };
};

// module.exports = {};
