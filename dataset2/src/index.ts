import * as configAoe2 from "./data/index.aoe2";
import * as configAoe4 from "./data/index.aoe4";
import Constants from 'expo-constants';

const game = Constants.expoConfig?.slug === 'aoe2companion' ? 'aoe2' : 'aoe4';
console.log('GAME', game);

export const appConfig = game === 'aoe2' ? configAoe2.appConfig : configAoe4.appConfig;
export const dataset = game === 'aoe2' ? configAoe2 : configAoe4;

export function getDataset(): typeof configAoe2 | typeof configAoe4 {
    return game === 'aoe2' ? { ...configAoe2 } : { ...configAoe4 };
}
