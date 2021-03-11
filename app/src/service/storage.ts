import {DarkMode} from "../redux/reducer";
import {LeaderboardId} from "@nex/data";
import store from "../redux/store";
import {v4 as uuidv4} from "uuid";
import {Flag} from '@nex/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isElectron, sendConfig, sendSettings} from "../helper/electron";
import { merge } from 'lodash';

export interface IConfig {
    hotkeyShowHideEnabled: boolean;
    hotkeySearchEnabled: boolean;
    darkMode: DarkMode;
    pushNotificationsEnabled: boolean;
    overlayEnabled: boolean;
    overlay: {
        opacity: number;
        offset: number;
        duration: number;
    }
    preventScreenLockOnGuidePage: boolean;
    language: string;
}

export interface IPrefs {
    country?: Flag;
    leaderboardId?: LeaderboardId;
    changelogLastVersionRead?: string;
    birthdayRead?: boolean;
    techTreeSize?: string;
    ratingHistoryDuration?: string;
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

export const saveAccountToStorage = async (account: IAccount) => {
    await AsyncStorage.setItem('account', JSON.stringify(account));
};

export const loadAccountFromStorage = async () => {
    const entry = await AsyncStorage.getItem('account');
    if (entry == null) {
        const newAccountId = uuidv4();
        await saveAccountToStorage({ id: newAccountId });
        return {
            id: newAccountId,
        };
    }
    return JSON.parse(entry) as IAccount;
};

export const loadConfigFromStorage = async () => {
    const entryJson = await AsyncStorage.getItem('config');
    const entry = (entryJson ? JSON.parse(entryJson) : {}) as IConfig;
    entry.language = entry.language ?? 'en';
    entry.darkMode = entry.darkMode ?? 'system';
    entry.preventScreenLockOnGuidePage = entry.preventScreenLockOnGuidePage ?? true;
    entry.pushNotificationsEnabled = entry.pushNotificationsEnabled ?? false;
    entry.hotkeyShowHideEnabled = entry.hotkeyShowHideEnabled ?? true;
    entry.hotkeySearchEnabled = entry.hotkeySearchEnabled ?? true;
    entry.overlay = merge({
        opacity: 80,
        offset: 7,
        duration: 60,
    }, entry.overlay);
    await sendConfigToElectron(entry);
    return entry;
};

export const saveConfigToStorage = async (config: IConfig) => {
    await AsyncStorage.setItem('config', JSON.stringify(config));
    await sendConfigToElectron(config);
};

export const clearSettingsInStorage = async () => {
    await AsyncStorage.removeItem('settings');
    await sendSettingsToElectron(null);
};

export const saveSettingsToStorage = async (settings: ISettings) => {
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
    await sendSettingsToElectron(settings);
};

export const loadSettingsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('settings');
    if (entry == null) {
        return null;
    }
    const settings = JSON.parse(entry) as ISettings;
    await sendSettingsToElectron(settings);
    return settings;
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

const sendConfigToElectron = async (config: IConfig) => {
    if (isElectron()) {
        await sendConfig(config);
    }
}

const sendSettingsToElectron = async (settings: ISettings | null) => {
    if (isElectron()) {
        await sendSettings(settings);
    }
}
