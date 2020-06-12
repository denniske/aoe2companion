import { AsyncStorage } from 'react-native';
import { sleep } from '../helper/util';

export interface ISettings {
    steam_id: string;
    profile_id: number;
}


export const loadSettingsFromStorage = async () => {
    await sleep(2000);
    const entry = await AsyncStorage.getItem('settings');
    if (entry == null) {
        return undefined;
    }
    console.log("json settings", entry);
    return JSON.parse(entry) as ISettings;
    // return {
    //     steam_id: new Date(),
    //     profile_id: 1,
    // }
};
