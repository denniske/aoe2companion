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
        youtubeClientId: '488773703040-894cl8823vjasguo1i8cin0vv5tsqosv.apps.googleusercontent.com',
        twitchClientId: '9l7clqgetb63e7sfkk28l6ar1jbrrk',
        discordClientId: '1437582633033924781',
    }
};

export const appIconData = require('../../../assets4/icon.png');
