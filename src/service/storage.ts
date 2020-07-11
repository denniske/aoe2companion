import { AsyncStorage } from 'react-native';
import { sleep } from '../helper/util';
import {composeUserId, sameUser} from "../helper/user";
import {Flag} from "../helper/flags";
import {IPlayerListPlayer} from "../view/components/player-list";
import {DarkMode} from "../redux/reducer";

export interface IConfig {
    darkMode: DarkMode;
}

export interface ISettings {
    id: string;
    steam_id?: string;
    profile_id?: number;
}

export interface IFollowingEntry {
    id?: string;
    steam_id?: string;
    profile_id?: number;
    name: string;
    games: number;
    country: Flag;
}

export const loadConfigFromStorage = async () => {
    const entry = await AsyncStorage.getItem('config');
    console.log('loadConfigFromStorage', entry);
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

export const toggleFollowingInStorage = async (user: IPlayerListPlayer) => {
    const following = await loadFollowingFromStorage();
    const index = following.findIndex(f => sameUser(f, user));
    if (index > -1) {
        following.splice(index, 1);
    } else {
        if (following.length >= 5) {
            alert('You can follow a maxmium of 2 users. Unfollow a user first to follow a new one.');
            return;
        }
        following.push({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
            name: user.name,
            games: user.games,
            country: user.country,
        });
    }
    console.log("MODIFIED FOLLOWING", following);
    await saveFollowingToStorage(following);
    return following;
};
