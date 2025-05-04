import { ExpoConfig } from '@expo/config-types';

const sentryConfigPlugin = [
    "@sentry/react-native/expo",
    {
        "url": "https://sentry.io/",
        "organization": "aoe2companion",
        "project": "aoe2companion",
    }
];

const version = '127.0.0';
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
        "runtimeVersion": runtimeVersion,
        "version": version,
        "orientation": "portrait",
        "githubUrl": "https://github.com/denniske/aoe2companion",
        "icon": "./app/assets/icon.png",

        // The custom update server does not work with local builds because
        // npx expo run:<platform> has no --private-key-path
        "updates": isProdBuild ? {
            "fallbackToCacheTimeout": 0,
            "url": "https://update.aoe2companion.com/api/manifest",
            "codeSigningCertificate": "./update/certificate.pem",
            "codeSigningMetadata": {
                "keyid": "main",
                "alg": "rsa-v1_5-sha256"
            }
        } : {
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
                    "icon": "./app/assets/notification.png"
                }
            ],
            ...sentryConfigPlugins,
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
                        "deploymentTarget": "15.1"
                    }
                }
            ],
            [
                "expo-splash-screen",
                {
                    "image": "./app/assets/icon-adaptive.png",
                    "backgroundColor": "#ffebc7",
                    "dark": {
                        "image": "./app/assets/icon-adaptive.png",
                        "backgroundColor": "#181C29",
                    },
                    "imageWidth": 200
                }
            ],
            "expo-video",
            "expo-localization",
        ],
        "android": {
            "userInterfaceStyle": "automatic",
            "adaptiveIcon": {
                "foregroundImage": "./app/assets/icon-adaptive.png",
                "backgroundColor": "#fbebd3"
            },
            "package": "com.aoe2companion",
            "versionCode": runtimeVersionCode as any as number,
            "permissions": [],
            "googleServicesFile": "./google-services2.json",
        },
        "ios": {
            "userInterfaceStyle": "automatic",
            "icon": {
                "light": "./app/assets/icon-adaptive-no-alpha.png",
                "dark": "./app/assets/icon-adaptive.png",
                "tinted": "./app/assets/icon-tinted.png"
            },
            "bundleIdentifier": "com.aoe2companion",
            "buildNumber": runtimeVersion,
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
            "associatedDomains": ["applinks:www.aoe2companion.com"],
            "appleTeamId": "HAFGZBHF9M",
        },
    } as ExpoConfig
};
