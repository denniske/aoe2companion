import { AsyncStorage } from 'react-native';
import { sleep } from '../helper/util';
import {composeUserId, sameUser} from "../helper/user";
import {Flag} from "../helper/flags";
import {IPlayerListPlayer} from "../view/components/player-list";
import {DarkMode} from "../redux/reducer";
import {LeaderboardId} from "../helper/leaderboards";
import store from "../redux/store";
import {v4 as uuidv4} from "uuid";

export interface IConfig {
    darkMode: DarkMode;
    pushNotificationsEnabled: boolean;
}

export interface IPrefs {
    leaderboardId?: LeaderboardId;
    changelogLastVersionRead?: string;
    techTreeSize?: string;
}

export interface ISettings {
    id: string;
    steam_id?: string;
    profile_id?: number;
}

export interface IAccount {
    id: string;
}

export interface IFollowingEntry {
    id?: string;
    steam_id?: string;
    profile_id: number;
    name: string;
    games: number;
    country: Flag;
}

export const loadPrefsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('prefs');
    if (entry == null) {
        return {

        };
    }
    return JSON.parse(entry) as IPrefs;
};

export const saveCurrentPrefsToStorage = async () => {
    const prefs = store.getState().prefs;
    await AsyncStorage.setItem('prefs', JSON.stringify(prefs));
};

export const loadConfigFromStorage = async () => {
    const entry = await AsyncStorage.getItem('config');
    if (entry == null) {
        return {
            darkMode: 'light',
        };
    }
    return JSON.parse(entry) as IConfig;
};

export const saveConfigToStorage = async (config: IConfig) => {
    await AsyncStorage.setItem('config', JSON.stringify(config));
};

export const loadSettingsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('settings');
    if (entry == null) {
        return null;
    }
    return JSON.parse(entry) as ISettings;
};

export const loadAccountFromStorage = async () => {
    const entry = await AsyncStorage.getItem('account');
    if (entry == null) {
        return {
            id: uuidv4(),
        };
    }
    return JSON.parse(entry) as IAccount;
};

export const saveSettingsToStorage = async (settings: ISettings) => {
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
};


export const loadFollowingFromStorage = async () => {
    const entry = await AsyncStorage.getItem('following');
    if (entry == null) {
        return [];
    }
    return JSON.parse(entry) as IFollowingEntry[];
};

export const saveFollowingToStorage = async (following: IFollowingEntry[]) => {
    await AsyncStorage.setItem('following', JSON.stringify(following));
};
