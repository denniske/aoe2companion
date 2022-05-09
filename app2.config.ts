export default {
  "expo": {
    "name": "AoE II Companion",
    "description": "Track your AoE II Definitive Edition games. This app fetches information about your games from aoe2.net so you are always up-to-date.",
    "slug": "aoe2companion",
    "scheme": "aoe2companion",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "extra": {
      "website": "aoe2companion.com",
      "experienceId": "@denniske1001/aoe2companion"
    },
    "userInterfaceStyle": "automatic",
    "jsEngine": "hermes",
    "runtimeVersion": process.env.RUNTIME_VERSION,
    "version": "39.0.10", // update also in eas.json!
    "orientation": "portrait",
    "privacy": "public",
    "githubUrl": "https://github.com/denniske/aoe2companion",
    "icon": "./app/assets/icon.png",
    "splash": {
      "image": "./app/assets/splash.png",
      "resizeMode": "contain"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "node_modules/**",
      "app/assets/civilizations/**",
      "app/assets/data/**",
      "app/assets/flags/**",
      "app/assets/font/**",
      "app/assets/legal/**",
      "app/assets/maps/**",
      "app/assets/strings/**",
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
      ]
    ],
    "android": {
      "userInterfaceStyle": "automatic",
      "adaptiveIcon": {
        "foregroundImage": "./app/assets/icon-adaptive.png"
      },
      "package": "com.aoe2companion",
      "versionCode": 390010,
      "permissions": [],
      "googleServicesFile": "./google-services2.json",
      "useNextNotificationsApi": true
    },
    "ios": {
      "userInterfaceStyle": "automatic",
      "icon": "./app/assets/icon-adaptive-no-alpha.png",
      "bundleIdentifier": "com.aoe2companion",
      "buildNumber": "39.0.10",
      "supportsTablet": false,
      "config": {
        "usesNonExemptEncryption": false
      },
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["itms-apps"]
      }
    },
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "aoe2companion",
            "project": "aoe2companion"
          }
        }
      ]
    }
  }
};
