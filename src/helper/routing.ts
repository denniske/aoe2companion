import {appConfig} from "@nex/dataset";


export const availableMainPages =
    appConfig.game === 'aoe2'
        ? [
            '/',
            '/matches',
            '/matches/live/lobbies',
            '/matches/live/all',
            '/explore',
            '/explore/civilizations',
            '/explore/units',
            '/explore/buildings',
            '/explore/technologies',
            '/explore/build-orders',
            '/explore/tips',
            '/statistics',
            '/competitive',
            '/competitive/games',
            '/competitive/tournaments',
        ] as const
        : [
            '/',
            '/matches',
            '/matches/live/lobbies',
            '/matches/live/all',
            '/explore',
            // '/explore/civilizations',
            // '/explore/units',
            // '/explore/buildings',
            // '/explore/technologies',
            // '/explore/build-orders',
            // '/explore/tips',
            '/statistics',
            '/competitive',
            // '/competitive/games',
            '/competitive/tournaments',
        ] as const;

export type AvailableMainPage = (typeof availableMainPages)[number];
