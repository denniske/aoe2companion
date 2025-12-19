import { appConfig } from '@nex/dataset';
import { Href } from 'expo-router';

export const availableMainPages: Href[] =
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
          ] as const)
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
          ] as const);

export type AvailableMainPage = (typeof availableMainPages)[number];
