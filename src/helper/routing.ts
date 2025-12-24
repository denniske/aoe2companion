import { appConfig } from '@nex/dataset';
import { Href } from 'expo-router';

export const availableMainPages =
    appConfig.game === 'aoe2'
        ? ([
              '/',
              '/matches',
              '/matches/lobbies',
              '/matches/live',
              '/matches/live/competitive',
              '/explore',
              '/explore/civilizations',
              '/explore/units',
              '/explore/buildings',
              '/explore/technologies',
              '/explore/build-orders',
              '/explore/tips',
              '/statistics',
              '/competitive',
              '/competitive/tournaments',
          ] as const satisfies Href[])
        : ([
              '/',
              '/matches',
              '/matches/lobbies',
              '/matches/live',
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
          ] as const satisfies Href[]);

export type AvailableMainPage = (typeof availableMainPages)[number];
