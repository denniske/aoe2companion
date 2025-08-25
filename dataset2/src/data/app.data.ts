declare var require: any

export const appConfig = {
    game: 'aoe2',
    gameTitle: 'Age of Empires II: Definitive Edition',
    hostAoeCompanion: 'aoe2companion.com',
    leaderboards: [
        {
            id: 0,
        },
        {
            id: 13,
        },
        {
            id: 14,
        },
        {
            id: 3,
        },
        {
            id: 4,
        },
    ],
    app: {
        slug: 'aoe2companion',
        name: 'AoE II Companion',
        android: {
            bundleId: 'com.aoe2companion',
        },
        ios: {
            bundleId: '1518463195',
        },
    },
    sentry: {
        dsn: 'https://9081bd9af23c4367b6023a6b62d48164@o329359.ingest.sentry.io/5382944',
    },
};

export const appIconData = require('../../../app/assets/icon.png');
