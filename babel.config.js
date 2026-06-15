

module.exports = function(api) {
  // Printing this will lead to an error in android build because it will be in autolinking.json
  // console.log('BABEL ROOT');

  api.cache(true);

  // Rewrite FontAwesome barrel imports (e.g. `import { faHeart } from
  // '@fortawesome/sharp-solid-svg-icons'`) into deep per-icon imports
  // (`.../faHeart`). Metro does not tree-shake the multi-MB barrel `index.js`,
  // so without this every imported pack is bundled in full.
  const fontawesomePackages = [
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/free-brands-svg-icons',
    '@fortawesome/sharp-solid-svg-icons',
    '@fortawesome/sharp-regular-svg-icons',
  ];
  const fontawesomeTransformImports = Object.fromEntries(
    fontawesomePackages.map((pkg) => [
      pkg,
      {
        transform: (importName) => `${pkg}/${importName}`,
        skipDefaultConversion: true,
      },
    ])
  );

  return {
      presets: [
          ["babel-preset-expo"],
      ],
    plugins: [
      ['transform-imports', fontawesomeTransformImports],
      [
        "module-resolver",
        {
          extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
          root: ['.'],
          alias: {
            "@app": ["./src"],
            "@app4": ["./app4/src"],
            "@nex/data/hooks": ["./data/src/index-hooks.ts"],
            "@nex/data/api": ["./data/src/index-api.ts"],
            "@nex/data": ["./data/src/index.ts"],
            "@nex/data4": ["./data4/src/index.ts"],
            "@nex/dataset": ["./dataset2/src/index.ts"],
          }
        }
      ],
      '@babel/plugin-proposal-export-namespace-from',
      // 'react-native-reanimated/plugin',
    ]
  };
};

// module.exports = {};
