import { ConfigContext, ExpoConfig } from 'expo/config';
import { WidgetFamily } from 'expo-widgets/plugin/build/types/WidgetFamily.type';
import { ConfigPlugin, withGradleProperties } from '@expo/config-plugins';
import expoWidgets from 'expo-widgets/plugin';
import expoRouter from 'expo-router/plugin';
import expoNotifications from 'expo-notifications/plugin';
import expoSplashScreen from 'expo-splash-screen/plugin';
import expoVideo from 'expo-video/plugin';
import expoImage from 'expo-image/plugin';
import expoFont from 'expo-font/plugin';
import expoLocalization from 'expo-localization/plugin';
import expoWebBrowser from 'expo-web-browser/plugin';

const versionAoe2 = '204.0.0';
const versionAoe4 = '40.0.0';

console.log('Building for', process.env.GAME, process.env.EAS_BUILD_PROFILE, process.env.EAS_BUILD_RUNNER);

const app = process.env.GAME === 'aoe2' ? {
    assetsFolder: 'assets',
    version: versionAoe2,
    name: "AoE II Companion",
    description: "Track your AoE II Definitive Edition matches. This app fetches information about your matches so you are always up-to-date.",
    slug: 'aoe2companion',
    scheme: "aoe2companion",
    sentryProject: "aoe2companion",
    website: "aoe2companion.com",
    associatedDomains: [
        "applinks:www.aoe2companion.com",
        "activitycontinuation:www.aoe2companion.com",
        "webcredentials:www.aoe2companion.com",
        "applinks:api.aoe2companion.com",
        "activitycontinuation:api.aoe2companion.com",
        "webcredentials:api.aoe2companion.com",
    ],
    package: "com.aoe2companion",
    bundleIdentifier: "com.aoe2companion",
    experienceId: "@denniske1001/aoe2companion",
    projectId: "668efd6d-8482-4ad8-8235-e1e94b7d508e",
    updateUrl: "https://u.expo.dev/668efd6d-8482-4ad8-8235-e1e94b7d508e",
    assetBundlePatterns: [
        "node_modules/**",
        "assets/civilizations/**",
        "assets/data/**",
        "assets/font/**",
        "assets/legal/**",
        "assets/buildings/**",
        "assets/techs/**",
        "assets/units/**",
        "assets/tips/icon/**",
        "assets/tips/poster/**",
        "assets/translations/**",
        "assets/*"
    ],
    splashBackgroundColor: "#ffebc7",
    splashBackgroundColorDark: "#181C29",
    adaptiveIconBackgroundColor: "#fbebd3",
    googleServicesFile: "./google-services2.json",
} : {
    assetsFolder: 'assets4',
    version: versionAoe4,
    name: "AoE IV Companion",
    description: "Track your AoE IV matches. This app fetches information about your matches so you are always up-to-date.",
    slug: 'aoe4companion',
    scheme: "aoe4companion",
    sentryProject: "aoe4companion",
    website: "aoe4companion.com",
    associatedDomains: [
        "applinks:www.aoe4companion.com",
        "activitycontinuation:www.aoe4companion.com",
        "webcredentials:www.aoe4companion.com",
        "applinks:api.aoe4companion.com",
        "activitycontinuation:api.aoe4companion.com",
        "webcredentials:api.aoe4companion.com",
    ],
    package: "com.aoe4companion",
    bundleIdentifier: "com.aoe4companion",
    experienceId: "@denniske1001/aoe4companion",
    projectId: "d8d79ec3-2477-4026-8c8a-456f79fc2f20",
    updateUrl: "https://u.expo.dev/d8d79ec3-2477-4026-8c8a-456f79fc2f20",
    assetBundlePatterns: [
        "node_modules/**",
        "assets/font/**",
        "assets/legal/**",
        "assets/translations/**",
        "app4/assets/civilizations/**",
        "app4/assets/*"
    ],
    splashBackgroundColor: "#000000",
    splashBackgroundColorDark: "#121212",
    adaptiveIconBackgroundColor: "#000000",
    googleServicesFile: "./google-services4.json",
};

const sentryConfigPlugin = [
    "@sentry/react-native/expo",
    {
        "url": "https://sentry.io/",
        "organization": "aoe2companion",
        "project": app.sentryProject,
    }
] as [string, any];

const widgetPlugin = expoWidgets({
    enablePushNotifications: true,
    widgets:
        process.env.GAME === 'aoe2'
            ? [
                  {
                      name: 'AABuilds',
                      displayName: 'AA Build Orders',
                      description: 'AA Quick access to your favorite build order',
                      contentMarginsDisabled: false, // false!
                      supportedFamilies: [WidgetFamily.systemMedium, WidgetFamily.systemLarge],
                  },
              ]
            : [],
});

const version = app.version;
const versionParts = version.split('.');

const runtimeVersion = versionParts[0] + '.' + versionParts[1] + '.0';

const runtimeVersionParts = runtimeVersion.split('.');
const runtimeVersionCode = runtimeVersionParts[0] + runtimeVersionParts[1].padStart(2, '0') + runtimeVersionParts[2].padStart(2, '0');

const isProdBuild = process.env.EAS_BUILD_PROFILE?.includes('production');
const isRunningInEasCI = process.env.EAS_BUILD_RUNNER === 'eas-build';
const sentry = isProdBuild ? [sentryConfigPlugin] : [];
const widgets = process.env.GAME === 'aoe2' ? [widgetPlugin] : [];

const gradleJvmArgs: ConfigPlugin = (config: ExpoConfig) => {
    return withGradleProperties(config, (config) => {
        const existing = config.modResults.findIndex((item) => item.type === 'property' && item.key === 'org.gradle.jvmargs');
        const entry = { type: 'property' as const, key: 'org.gradle.jvmargs', value: '-Xmx8g -XX:MaxMetaspaceSize=2g' };
        if (existing >= 0) {
            config.modResults[existing] = entry;
        } else {
            config.modResults.push(entry);
        }
        return config;
    });
};

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
        // Not working yet: https://github.com/expo/expo/issues/46219#issuecomment-4528046988
        // inlineModules: {
        //     watchedDirectories: ['src/modules']
        // },
    },
    name: app.name,
    description: app.description,
    slug: app.slug,
    scheme: app.scheme,
    owner: 'aoecompanion',
    platforms: ['ios', 'android', 'web'],
    extra: {
        website: app.website,
        experienceId: app.experienceId,
        eas: {
            projectId: app.projectId,
        },
    },
    userInterfaceStyle: 'automatic',
    runtimeVersion: runtimeVersion,
    version: version,
    orientation: 'portrait',
    githubUrl: 'https://github.com/denniske/aoe2companion',
    icon: `./${app.assetsFolder}/icon.png`,

    // The custom update server does not work with local builds because
    // npx expo run:<platform> has no --private-key-path
    updates:
        process.env.GAME === 'aoe2' && isProdBuild && false
            ? {
                  fallbackToCacheTimeout: 0,
                  url: 'https://update.aoe2companion.com/api/manifest',
                  codeSigningCertificate: './update/certificate.pem',
                  codeSigningMetadata: {
                      keyid: 'main',
                      alg: 'rsa-v1_5-sha256',
                  },
              }
            : {
                  fallbackToCacheTimeout: 0,
                  url: app.updateUrl,
              },
    assetBundlePatterns: app.assetBundlePatterns,
    plugins: [
        expoRouter({
            unstable_useServerRendering: true,
            sitemap: !isProdBuild,
            redirects: [
                { source: '/leaderboard', destination: '/statistics/leaderboard' },
                { source: '/lobby', destination: '/matches/lobbies' },
                { source: '/ongoing', destination: '/matches/live' },
                { source: '/privacy', destination: '/more/privacy' },
            ],
            headOrigin: process.env.GAME === 'aoe2' ? 'https://www.aoe2companion.com/' : 'https://www.aoe4companion.com/',
        } as any),
        expoNotifications({
            icon: `./${app.assetsFolder}/notification.png`,
        }),
        ...sentry,
        ...widgets,
        expoSplashScreen({
            image: `./${app.assetsFolder}/icon-adaptive.png`,
            backgroundColor: app.splashBackgroundColor,
            dark: {
                image: `./${app.assetsFolder}/icon-adaptive.png`,
                backgroundColor: app.splashBackgroundColorDark,
            },
            imageWidth: 200,
        }),
        expoVideo(),
        expoImage(),
        expoFont(),
        expoLocalization(),
        expoWebBrowser(),
        gradleJvmArgs as any,
    ],
    android: {
        userInterfaceStyle: 'automatic',
        adaptiveIcon: {
            foregroundImage: `${app.assetsFolder}/icon-adaptive.png`,
            backgroundColor: app.adaptiveIconBackgroundColor,
        },
        package: app.package,
        versionCode: runtimeVersionCode as any as number,
        permissions: [],
        googleServicesFile: app.googleServicesFile,
    },
    ios: {
        userInterfaceStyle: 'automatic',
        icon: {
            light: `./${app.assetsFolder}/icon-adaptive-no-alpha.png`,
            dark: `./${app.assetsFolder}/icon-adaptive.png`,
            tinted: `./${app.assetsFolder}/icon-tinted.png`,
        },
        bundleIdentifier: app.bundleIdentifier,
        buildNumber: runtimeVersion,
        supportsTablet: true,
        config: {
            usesNonExemptEncryption: false,
        },
        infoPlist: {
            LSApplicationQueriesSchemes: ['itms-apps', 'twitch'],
            NSSupportsLiveActivities: true,
            NSUserActivityTypes: ['BuildsConfigurationIntent'],
            UIBackgroundModes: ['remote-notification'],
        },
        associatedDomains: app.associatedDomains,
        appleTeamId: 'HAFGZBHF9M',
    },
    web: {
        output: 'server',
        favicon: `./${app.assetsFolder}/favicon-96x96.png`,
    },
});
