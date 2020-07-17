const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: __dirname,
  // mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  mode: 'development',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'cheap-module-eval-source-map' : 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: () => true,
        sideEffects: true,
      },
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: true,
                },
              },
            ],
            '@babel/typescript',
          ],
        },
        include: [__dirname],
        exclude: /node_modules/,
      },
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      // {
      //   test: /\.(tsx?)$/,
      //   loader: 'ts-loader',
      //   exclude: [
      //     [
      //       path.resolve(__dirname, 'node_modules'),
      //       path.resolve(__dirname, '.serverless'),
      //       path.resolve(__dirname, '.webpack'),
      //     ],
      //   ],
      //   options: {
      //     transpileOnly: true,
      //     experimentalWatchApi: true,
      //   },
      // },
    ],
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   eslint: true,
    //   eslintOptions: {
    //     cache: true
    //   }
    // })
  ],
};
