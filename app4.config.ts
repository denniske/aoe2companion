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

const sentryConfigPlugins = process.env.EAS_BUILD_PROFILE?.includes('production') ? [sentryConfigPlugin] : [];

export default {
    "expo": {
        "name": "AoE IV Companion",
        "description": "Track your AoE IV matches. This app fetches information about your matches so you are always up-to-date.",
        "slug": "aoe4companion",
        "scheme": "aoe4companion",
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
        "runtimeVersion": "14.0.0",
        "version": "14.0.0",
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
            "versionCode": 140000,
            "permissions": [],
            "googleServicesFile": "./google-services4.json",
            "splash": splash,
        },
        "ios": {
            "userInterfaceStyle": "automatic",
            "icon": "./app4/assets/icon-no-alpha.png",
            "bundleIdentifier": "com.aoe4companion",
            "buildNumber": "14.0.0",
            "supportsTablet": false,
            "config": {
                "usesNonExemptEncryption": false
            },
            "infoPlist": {
                "LSApplicationQueriesSchemes": ["itms-apps"]
            },
            "splash": splash,
        },
    }
};
