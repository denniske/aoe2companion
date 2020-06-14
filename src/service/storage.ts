import { AsyncStorage } from 'react-native';
import { sleep } from '../helper/util';

export interface ISettings {
    steam_id: string;
    profile_id: number;
}


export const loadSettingsFromStorage = async () => {
    // console.log("RETRIEVING JSON settings...");
    // await sleep(2000);
    const entry = await AsyncStorage.getItem('settings');
    // console.log("RETRIEVED JSON settings", entry);
    if (entry == null) {
        return null;
    }
    return JSON.parse(entry) as ISettings;
    // return {
    //     steam_id: new Date(),
    //     profile_id: 1,
    // }
};
