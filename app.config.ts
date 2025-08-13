import { ExpoConfig, ConfigContext } from 'expo/config';

const versionAoe2 = '144.0.0';
const versionAoe4 = '23.0.0';

const app = process.env.APP === 'aoe2' ? {
    folder: 'app',
    version: versionAoe2,
    name: "AoE II Companion",
    description: "Track your AoE II Definitive Edition matches. This app fetches information about your matches so you are always up-to-date.",
    slug: 'aoe2companion',
    scheme: "aoe2companion",
    sentryProject: "aoe2companion",
    website: "aoe2companion.com",
    associatedDomains: ["applinks:www.aoe2companion.com"],
    package: "com.aoe2companion",
    bundleIdentifier: "com.aoe2companion",
    experienceId: "@denniske1001/aoe2companion",
    projectId: "668efd6d-8482-4ad8-8235-e1e94b7d508e",
    updateUrl: "https://u.expo.dev/668efd6d-8482-4ad8-8235-e1e94b7d508e",
    assetBundlePatterns: [
        "node_modules/**",
        "app/assets/civilizations/**",
        "app/assets/data/**",
        "app/assets/font/**",
        "app/assets/legal/**",
        "app/assets/buildings/**",
        "app/assets/techs/**",
        "app/assets/units/**",
        "app/assets/tips/icon/**",
        "app/assets/tips/poster/**",
        "app/assets/translations/**",
        "app/assets/*"
    ],
    splashBackgroundColor: "#ffebc7",
    splashBackgroundColorDark: "#181C29",
    adaptiveIconBackgroundColor: "#fbebd3",
} : {
    folder: 'app4',
    version: versionAoe4,
    name: "AoE IV Companion",
    description: "Track your AoE IV matches. This app fetches information about your matches so you are always up-to-date.",
    slug: 'aoe4companion',
    scheme: "aoe4companion",
    sentryProject: "aoe4companion",
    website: "aoe4companion.com",
    associatedDomains: ["applinks:www.aoe4companion.com"],
    package: "com.aoe4companion",
    bundleIdentifier: "com.aoe4companion",
    experienceId: "@denniske1001/aoe4companion",
    projectId: "d8d79ec3-2477-4026-8c8a-456f79fc2f20",
    updateUrl: "https://u.expo.dev/d8d79ec3-2477-4026-8c8a-456f79fc2f20",
    assetBundlePatterns: [
        "node_modules/**",
        "app/assets/font/**",
        "app/assets/legal/**",
        "app/assets/translations/**",
        "app4/assets/civilizations/**",
        "app4/assets/*"
    ],
    splashBackgroundColor: "#000000",
    splashBackgroundColorDark: "#121212",
    adaptiveIconBackgroundColor: "#000000",
};

const sentryConfigPlugin = [
    "@sentry/react-native/expo",
    {
        "url": "https://sentry.io/",
        "organization": "aoe2companion",
        "project": app.sentryProject,
    }
] as [string, any];

const appPlugin = [
    "./app.plugin.js",
    {
        "widgetName": "widget",
        "ios": {
            "devTeamId": "HAFGZBHF9M",
            "appGroupIdentifier": "group.com.aoe2companion.widget",
            "topLevelFiles": ["Assets.xcassets", "WidgetBundle.swift"],
            "topLevelFolders": ["Widgets", "Helpers"]
        }
    }
] as [string, any];

const version = app.version;
const versionParts = version.split('.');

const runtimeVersion = versionParts[0] + '.' + versionParts[1] + '.0';

const runtimeVersionParts = runtimeVersion.split('.');
const runtimeVersionCode = runtimeVersionParts[0] + runtimeVersionParts[1].padStart(2, '0') + runtimeVersionParts[2].padStart(2, '0');

const isProdBuild = process.env.EAS_BUILD_PROFILE?.includes('production');
const isRunningInEasCI = process.env.EAS_BUILD_RUNNER === 'eas-build';
const sentryConfigPlugins = isProdBuild ? [sentryConfigPlugin] : [];
const appConfigPlugins = process.env.APP === 'aoe2' ? [appPlugin] : [];

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    // new arch scroll up on leaderboard page
    // https://github.com/facebook/react-native/issues/49077
    newArchEnabled: false, // react-native-nitro-image, and also see gradle.properties
    experiments: {
        // react-compiler-runtime needs to be installed for android
        // but then android fails with wierd async storage error
        reactCompiler: false,
    },
    name: app.name,
    description: app.description,
    slug: app.slug,
    scheme: app.scheme,
    owner: "aoecompanion",
    platforms: [
        "ios",
        "android",
        "web"
    ],
    extra: {
        website: app.website,
        experienceId: app.experienceId,
        eas: {
            projectId: app.projectId,
            build: process.env.APP === 'aoe2' ? {
                experimental: {
                    ios: {
                        appExtensions: [
                            {
                                targetName: "widget",
                                bundleIdentifier: "com.aoe2companion.widget",
                                entitlements: {
                                    "com.apple.security.application-groups": [
                                        "group.com.aoe2companion.widget"
                                    ]
                                }
                            }
                        ]
                    }
                }
            } : {}
        },
    },
    userInterfaceStyle: "automatic",
    runtimeVersion: runtimeVersion,
    version: version,
    orientation: "portrait",
    githubUrl: "https://github.com/denniske/aoe2companion",
    icon: `./${app.folder}/assets/icon.png`,

    // The custom update server does not work with local builds because
    // npx expo run:<platform> has no --private-key-path
    updates: process.env.APP === 'aoe2' && isProdBuild && false ? {
        fallbackToCacheTimeout: 0,
        url: "https://update.aoe2companion.com/api/manifest",
        codeSigningCertificate: "./update/certificate.pem",
        codeSigningMetadata: {
            keyid: "main",
            alg: "rsa-v1_5-sha256"
        }
    } : {
        fallbackToCacheTimeout: 0,
        url: app.updateUrl,
    },
    assetBundlePatterns: app.assetBundlePatterns,
    plugins: [
        [
            "react-native-edge-to-edge"
        ],
        [
            "expo-router",
            {
                "root": "./app/src/app",
                "sitemap": false,
            }
        ],
        [
            "expo-notifications",
            {
                "icon": `./${app.folder}/assets/notification.png`
            }
        ],
        ...sentryConfigPlugins,
        ...appConfigPlugins,
        [
            "expo-build-properties",
            {
                "ios": {
                    "deploymentTarget": "15.1"
                }
            }
        ],
        [
            "expo-splash-screen",
            {
                "image": `./${app.folder}/assets/icon-adaptive.png`,
                "backgroundColor": app.splashBackgroundColor,
                "dark": {
                    "image": `./${app.folder}/assets/icon-adaptive.png`,
                    "backgroundColor": app.splashBackgroundColorDark,
                },
                "imageWidth": 200
            }
        ],
        "expo-video",
        "expo-localization",
        "expo-web-browser",
    ],
    android: {
        userInterfaceStyle: "automatic",
        adaptiveIcon: {
            foregroundImage: `./${app.folder}/assets/icon-adaptive.png`,
            backgroundColor: app.adaptiveIconBackgroundColor
        },
        package: app.package,
        versionCode: runtimeVersionCode as any as number,
        permissions: [],
        googleServicesFile: "./google-services2.json",
    },
    ios: {
        userInterfaceStyle: "automatic",
        icon: {
            light: `./${app.folder}/assets/icon-adaptive-no-alpha.png`,
            dark: `./${app.folder}/assets/icon-adaptive.png`,
            tinted: `./${app.folder}/assets/icon-tinted.png`
        },
        bundleIdentifier: app.bundleIdentifier,
        buildNumber: runtimeVersion,
        supportsTablet: false,
        config: {
            usesNonExemptEncryption: false
        },
        infoPlist: {
            LSApplicationQueriesSchemes: ["itms-apps", "twitch"],
            NSSupportsLiveActivities: true,
            NSUserActivityTypes: ["BuildsConfigurationIntent"],
            UIBackgroundModes: ["remote-notification"]
        },
        entitlements: process.env.APP === 'aoe2' ? {
            "com.apple.security.application-groups": [
                "group.com.aoe2companion.widget"
            ]
        } : {},
        associatedDomains: app.associatedDomains,
        appleTeamId: "HAFGZBHF9M",
    },
});
