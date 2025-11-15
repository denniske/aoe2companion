declare var require: any

export const appConfig = {
    game: 'aoe2',
    gameTitle: 'Age of Empires II: Definitive Edition',
    liquipediaName: 'Age of Empires II',
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
    oauth: {
        patreonClientId: 'jsn5ztplpiU4BZ1PxAzOnK5ZyXti69KhEFGQpZSNCt2ahACRi1LMo6kMKmxLFVmn',
        youtubeClientId: '488773703040-894cl8823vjasguo1i8cin0vv5tsqosv.apps.googleusercontent.com',
        twitchClientId: 'yxslhhtxc8um77cg9k05uriupg6as3',
        discordClientId: '1311364669465956442',
        xboxClientId: '3dbfbf8a-884a-482c-92a2-718557a8905e',
        xboxPublicKey: 'a1f4b913-4e04-23a3-69cf-bfc1a870e0cf',
    }
};

export const appIconData = require('../../../assets/icon.png');
