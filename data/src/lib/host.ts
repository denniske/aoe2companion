import {getService, SERVICE_NAME} from "./di";
import {appConfig} from "@nex/dataset";
import { Platform } from 'react-native';
import * as Device from 'expo-device';

export type Host = 'aoe4world' | 'aoe2companion' | 'aoe2companion-api' | 'aoe2companion-graphql' | 'aoe2companion-data' | 'aoe2companion-socket' | 'aoe2net';
export type OS = 'windows' | 'macos' | 'android' | 'ios' | 'web';
export type Environment = 'development' | 'production';

export interface IHostService {
    getPlatform(): OS;
    getEnvironment(): Environment;
}

export interface ICivService {
    getCivs(): any;
}

export function getHost(host: Host) {
    const hostService = getService(SERVICE_NAME.HOST_SERVICE) as IHostService;
    const platform = hostService.getPlatform();
    const dev = hostService.getEnvironment() == 'development';
    const platformHost = Device.isDevice ? '192.168.178.21' : Platform.select({ios: 'localhost', android: '10.0.2.2'});
    switch (host) {
        case "aoe4world": {
            return `https://aoe4world.com/api/v0/`;
        }
        case "aoe2companion": {
            // if (__DEV__ && !Device.isDevice) {
            //     const platformHost = Platform.select({ios: 'localhost', android: '10.0.2.2'});
            //     return `http://${platformHost}:3000/dev/`;
            // }
            // if (__DEV__) {
            //     const platformHost = Device.isDevice ? '192.168.178.41' : Platform.select({ios: 'localhost', android: '10.0.2.2'});
            //     return `http://${platformHost}:3004/`;
            // }
            // if (__DEV__) {
            //     const platformHost = Device.isDevice ? '192.168.178.41' : Platform.select({ios: 'localhost', android: '10.0.2.2'});
            //     return `http://${platformHost}:3000/dev/`;
            // }
            if (dev) {
                const platformHost = Device.isDevice ? '192.168.10.30' : Platform.select({ios: 'localhost', android: '10.0.2.2'});
                return `http://${platformHost}:4200/`;
                // return 'http://localhost:4200/';
            }
            return `https://${appConfig.hostAoeCompanion}/`;
        }
        case "aoe2companion-api": {
            if (dev) {
                return `http://${platformHost}:3332/`;
                // return 'http://localhost:3332/';
            }
            return `https://api.${appConfig.hostAoeCompanion}/`;
        }
        case "aoe2companion-graphql": {
            // if (__DEV__ && Device.isDevice) {
            //     const platformHost = '192.168.178.41';
            //     return `http://${platformHost}:3003/`;
            // }
            // if (dev) {
            //     return 'http://localhost:3333/graphql';
            // }
            return `https://graph.${appConfig.hostAoeCompanion}/graphql`;
        }
        case "aoe2companion-data": {
            // if (__DEV__ && Device.isDevice) {
            //     const platformHost = '192.168.178.41';
            //     return `http://${platformHost}:3003/`;
            // }
            if (dev) {
                return `http://${platformHost}:3335/`;
                // return 'http://localhost:3335/';
            }
            return `https://data.${appConfig.hostAoeCompanion}/`;
        }
        case "aoe2companion-socket": {
            // if (__DEV__ && Device.isDevice) {
            //     const platformHost = '192.168.178.41';
            //     return `http://${platformHost}:3003/`;
            // }
            // if (dev) {
            //     return 'http://localhost:3335/';
            // }
            return `wss://socket.${appConfig.hostAoeCompanion}/`;
        }
        case "aoe2net": {
            console.log('appConfig', appConfig);
            // if (dev) {
            //     // return 'https://aoe2backend-legacy-worker.denniske.workers.dev/';
            //     // return 'http://aoe2backend-legacy.deno.dev/';
            //     return 'http://localhost:3334/';
            // }
            if (platform === 'web') {
                return `https://${appConfig.hostAoeNet}/`;
            }
            return `http://${appConfig.hostAoeNet}/`;
        }
    }
}
