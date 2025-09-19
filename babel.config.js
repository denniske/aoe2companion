

module.exports = function(api) {
  console.log('BABEL ROOT');

  api.cache(true);
  return {
      presets: [
          ["babel-preset-expo", { jsxImportSource: "nativewind" }],
          "nativewind/babel",
      ],
    plugins: [
      // [
      //   "module-resolver",
      //   {
      //     extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      //     root: ['.'],
      //     alias: {
      //       "@app": ["./src"],
      //       "@app4": ["./app4/src"],
      //       "@nex/data/hooks": ["./data/src/index-hooks.ts"],
      //       "@nex/data/api": ["./data/src/index-api.ts"],
      //       "@nex/data": ["./data/src/index.ts"],
      //       "@nex/data4": ["./data4/src/index.ts"],
      //       "@nex/dataset": [process.env.APP === 'aoe2' ? `./dataset2/src/index.ts` : `./dataset4/src/index.ts`],
      //       "@nex/app/view": [process.env.APP === 'aoe2' ? "./app/src/index-view.ts" : "./app4/src/index-view.ts"],
      //     }
      //   }
      // ],
      '@babel/plugin-proposal-export-namespace-from',
      // 'react-native-reanimated/plugin',
      // "nativewind/babel",
    ]
  };
};

// module.exports = {};
