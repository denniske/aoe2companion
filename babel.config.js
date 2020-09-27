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
          }
        }
      ]
    ]
  };
};

// module.exports = {};
