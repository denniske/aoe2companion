// Experimental dark splash screen: https://expo.canny.io/feature-requests/p/dark-mode-splash-screen
const splash = {
    "image": "./app4/assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#000000",
    "dark": {
        "image": "./app4/assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#121212",
    },
};

const sentryConfigPlugin = [
    "@sentry/react-native/expo",
    {
        "url": "https://sentry.io/",
        "organization": "aoe2companion",
        "project": "aoe4companion",
    }
];

const version = '16.0.0';
const versionParts = version.split('.');

const runtimeVersion = versionParts[0] + '.' + versionParts[1] + '.0';

const runtimeVersionParts = runtimeVersion.split('.');
const runtimeVersionCode = runtimeVersionParts[0] + runtimeVersionParts[1].padStart(2, '0') + runtimeVersionParts[2].padStart(2, '0');

// console.log('Version: ' + version);
// console.log('Runtime version: ' + runtimeVersion);
// console.log('Runtime version code: ' + runtimeVersionCode);

const isProdBuild = process.env.EAS_BUILD_PROFILE?.includes('production');
const isRunningInEasCI = process.env.EAS_BUILD_RUNNER === 'eas-build';
const sentryConfigPlugins = isProdBuild && isRunningInEasCI ? [sentryConfigPlugin] : [];

export default {
    "expo": {
        "name": "AoE IV Companion",
        "description": "Track your AoE IV matches. This app fetches information about your matches so you are always up-to-date.",
        "slug": "aoe4companion",
        "scheme": "aoe4companion",
        "owner": "aoecompanion",
        "platforms": [
            "ios",
            "android",
            "web"
        ],
        "extra": {
            "website": "aoe4companion.com",
            "experienceId": "@denniske1001/aoe4companion",
            "eas": {
                "projectId": "d8d79ec3-2477-4026-8c8a-456f79fc2f20",
            }
        },
        "userInterfaceStyle": "automatic",
        "jsEngine": "hermes",
        "runtimeVersion": runtimeVersion,
        "version": version,
        "orientation": "portrait",
        "privacy": "public",
        "githubUrl": "https://github.com/denniske/aoe2companion",
        "icon": "./app4/assets/icon.png",
        "splash": splash,
        "updates": {
            "fallbackToCacheTimeout": 0,
            "url": "https://u.expo.dev/d8d79ec3-2477-4026-8c8a-456f79fc2f20"
        },
        "assetBundlePatterns": [
            "node_modules/**",
            "app/assets/font/**",
            "app/assets/legal/**",
            "app/assets/translations/**",
            "app4/assets/civilizations/**",
            "app4/assets/*"
        ],
        "plugins": [
            [
                "expo-router",
                {
                    "root": "./app/src/app",
                }
            ],
            [
                "expo-notifications",
                {
                    "icon": "./app4/assets/notification.png"
                }
            ],
            // Needed since SDK 50. But it should not be needed because this is the default value.
            [
                "expo-av",
                {
                    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
                }
            ],
            ...sentryConfigPlugins,
            [
                "expo-build-properties",
                {
                    "ios": {
                        "deploymentTarget": "13.4"
                    }
                }
            ],
            "expo-localization",
        ],
        "android": {
            "userInterfaceStyle": "automatic",
            "package": "com.aoe4companion",
            "versionCode": runtimeVersionCode,
            "permissions": [],
            "googleServicesFile": "./google-services4.json",
            "splash": splash,
        },
        "ios": {
            "userInterfaceStyle": "automatic",
            "icon": "./app4/assets/icon-no-alpha.png",
            "bundleIdentifier": "com.aoe4companion",
            "buildNumber": runtimeVersion,
            "supportsTablet": false,
            "config": {
                "usesNonExemptEncryption": false
            },
            "infoPlist": {
                "LSApplicationQueriesSchemes": ["itms-apps"],
                "UIBackgroundModes": ["remote-notification"]
            },
            "splash": splash,
        },
    }
};
