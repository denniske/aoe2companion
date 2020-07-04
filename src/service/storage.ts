import { AsyncStorage } from 'react-native';
import { sleep } from '../helper/util';
import {composeUserId} from "../helper/user";

export interface ISettings {
    steam_id: string;
    profile_id: number;
}

export interface IFollowingEntry {
    id?: string;
    steam_id?: string;
    profile_id?: number;
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

export const loadFollowingFromStorage = async () => {
    // console.log("RETRIEVING JSON settings...");
    // await sleep(2000);
    const entry = await AsyncStorage.getItem('following');
    // console.log("RETRIEVED JSON settings", entry);
    if (entry == null) {
        return [];
    }
    return JSON.parse(entry) as IFollowingEntry[];
    // return {
    //     steam_id: new Date(),
    //     profile_id: 1,
    // }
};

export const saveFollowingToStorage = async (following: IFollowingEntry[]) => {
    // console.log("RETRIEVING JSON settings...");
    // await sleep(2000);
    await AsyncStorage.setItem('following', JSON.stringify(following));
    // return {
    //     steam_id: new Date(),
    //     profile_id: 1,
    // }
};
