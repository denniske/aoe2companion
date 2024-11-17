declare var require: any

export const appConfig = {
    game: 'aoe4',
    gameTitle: 'Age of Empires IV',
    hostAoeCompanion: 'aoe4companion.com',
    hostAoeNet: 'aoeiv.net',
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
};

export const appIconData = require('../../../app4/assets/icon.png');
