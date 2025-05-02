const createExpoWebpackConfigAsync = require("@expo/webpack-config");
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(
        {
            ...env,
            // Passing true will enable the default Workbox + Expo SW configuration.
            // offline: true,
            babel: {
                dangerouslyAddModulePathsToTranspile: ["nativewind"]
            }
        },
        argv
    );
    // Customize the config before returning it.
    // if (env.mode === 'production') {
    //     config.plugins.push(
    //         new BundleAnalyzerPlugin({
    //             path: 'web-report',
    //         })
    //     );
    // }

    config.module.rules.push({
        test: /\.css$/i,
        use: ["postcss-loader"],
    });

    return config;
};
