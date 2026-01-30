declare var require: any

export const appConfig = {
    game: 'aoe4',
    gameTitle: 'Age of Empires IV',
    liquipediaName: 'Age of Empires IV',
    hostAoeCompanion: 'aoe4companion.com',
    leaderboards: [
        // {
        //     id: 0,
        // },
        {
            id: 1001,
        },
        {
            id: 17,
        },
        {
            id: 18,
        },
        {
            id: 19,
        },
        {
            id: 20,
        },
    ],
    app: {
        slug: 'aoe4companion',
        name: 'AoE IV Companion',
        android: {
            bundleId: 'com.aoe4companion',
        },
        ios: {
            bundleId: '1601333682',
        },
    },
    sentry: {
        dsn: 'https://42a075ff136400cea6b14fbe95b2adf5@o431543.ingest.sentry.io/4506235138080768',
    },
    oauth: {
        patreonClientId: '8XdrybGNipnVbCsNeXFoQLmMvpcqSRZEOBVR2idusfpgiMNAQUjqYrmnC22qF_8f',
        youtubeClientId: '33910465739-ra9373kllq6espu9khdea9930s7qmf16.apps.googleusercontent.com',
        twitchClientId: '9l7clqgetb63e7sfkk28l6ar1jbrrk',
        discordClientId: '1437582633033924781',
        xboxClientId: 'e24261f0-48b4-4920-a541-448ae6e2c0a1',
        xboxPublicKey: '325d6616-0566-5ce3-aa1f-8e85fa7123de',
        xboxClientIdWeb: '68e8c52e-d684-4f05-bd53-59530ef58cdf',
        xboxPublicKeyWeb: 'b6d9ad02-ee05-c393-5229-461237203309',
    },
    ms: {
        name: 'Age of Empires IV',
        url: 'https://www.ageofempires.com/games/age-of-empires-iv/',
    },
};

export const appIconData = require('../../../assets4/icon.png');
