// Experimental dark splash screen: https://expo.canny.io/feature-requests/p/dark-mode-splash-screen
const splash = {
    "image": "./app/assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#000000",
    "dark": {
        "image": "./app/assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#121212",
    },
};

const hooksProduction = {
    "postPublish": [
        {
            "file": "sentry-expo/upload-sourcemaps",
            "config": {
                "organization": "aoe2companion",
                "project": "aoe2companion"
            }
        }
    ]
};

const hooks = process.env.EAS_BUILD_PROFILE === 'production' ? hooksProduction : undefined;

export default {
    "expo": {
        "name": "AoE II Companion",
        "description": "Track your AoE II Definitive Edition games. This app fetches information about your games so you are always up-to-date.",
        "slug": "aoe2companion",
        "scheme": "aoe2companion",
        "owner": "aoecompanion",
        "platforms": [
            "ios",
            "android",
            "web"
        ],
        "extra": {
            "website": "aoe2companion.com",
            "experienceId": "@denniske1001/aoe2companion",
            "eas": {
                "projectId": "668efd6d-8482-4ad8-8235-e1e94b7d508e",
                "build": {
                    "experimental": {
                        "ios": {
                            "appExtensions": [
                                {
                                    "targetName": "widget",
                                    "bundleIdentifier": "com.aoe2companion.widget",
                                    "entitlements": {
                                        "com.apple.security.application-groups": [
                                            "group.com.aoe2companion.widget"
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            },
        },
        "userInterfaceStyle": "automatic",
        "jsEngine": "hermes",
        "runtimeVersion": "81.0.0",
        "version": "81.0.0",
        "orientation": "portrait",
        "privacy": "public",
        "githubUrl": "https://github.com/denniske/aoe2companion",
        "icon": "./app/assets/icon.png",
        "splash": splash,
        "updates": {
            "fallbackToCacheTimeout": 0,
            "url": "https://u.expo.dev/668efd6d-8482-4ad8-8235-e1e94b7d508e"
        },
        "assetBundlePatterns": [
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
        "plugins": [
            [
                "expo-notifications",
                {
                    "icon": "./app/assets/notification.png"
                }
            ],
            [
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
            ],
            [
                "expo-build-properties",
                {
                    "ios": {
                        "deploymentTarget": "13.4"
                    }
                }
            ],
            "expo-localization",
            "sentry-expo"
        ],
        "android": {
            "userInterfaceStyle": "automatic",
            "adaptiveIcon": {
                "foregroundImage": "./app/assets/icon-adaptive.png"
            },
            "package": "com.aoe2companion",
            "versionCode": 810000,
            "permissions": [],
            "googleServicesFile": "./google-services2.json",
            "splash": splash,
        },
        "ios": {
            "userInterfaceStyle": "automatic",
            "icon": "./app/assets/icon-adaptive-no-alpha.png",
            "bundleIdentifier": "com.aoe2companion",
            "buildNumber": "81.0.0",
            "supportsTablet": false,
            "config": {
                "usesNonExemptEncryption": false
            },
            "infoPlist": {
                "LSApplicationQueriesSchemes": ["itms-apps"],
                "NSSupportsLiveActivities": true,
                "NSUserActivityTypes": ["BuildsConfigurationIntent"],
                "UIBackgroundModes": ["remote-notification"]
            },
            "entitlements": {
                "com.apple.security.application-groups": [
                    "group.com.aoe2companion.widget"
                ]
            },
            "splash": splash,
        },
        hooks,
    }
};
