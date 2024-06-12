import { DarkMode } from '../redux/reducer';
import { Civ, LeaderboardId } from '@nex/data';
import store from '../redux/store';
import { v4 as uuidv4 } from 'uuid';
import { Flag } from '@nex/data';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { isElectron, sendConfig, sendSettings } from '../helper/electron';
import { camelCase, merge } from 'lodash';
import { useEffect, useState } from 'react';
import { buildsData } from '../../../data/src/data/builds';
import { Widget } from '../../../modules/widget';
import Constants from 'expo-constants';
import { genericCivIcon, getCivIconLocal } from '../helper/civs';
import { Image, Platform } from 'react-native';

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
    };
    preventScreenLockOnGuidePage: boolean;
    language: string;
    mainPage: string;
}

export interface IPrefs {
    guideFavorites: string[];
    country?: string;
    clan?: string;
    leaderboardId?: LeaderboardId;
    changelogLastVersionRead?: string;
    birthdayRead?: boolean;
    techTreeSize?: string;
    ratingHistoryDuration?: string;
    ratingHistoryHiddenLeaderboardIds?: string[];
}

export interface ISettings {
    steamId?: string;
    profileId?: number;

    // Deprecated
    steam_id?: string;
    profile_id?: number;
}

export interface IAccount {
    id: string;
}

export interface IFollowingEntry {
    steam_id?: string;
    profileId: number;
    profile_id?: number;
    name: string;
    games: number;
    country: Flag;
}

export const loadPrefsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('prefs');
    if (entry == null) {
        return {};
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
    entry.overlay = merge(
        {
            opacity: 80,
            offset: 7,
            duration: 60,
        },
        entry.overlay
    );
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

    if (settings.profileId == null && settings.profile_id != null) {
        settings.profileId = settings.profile_id;
    }
    // if (settings.steamId == null && settings.steam_id != null) {
    //     settings.steamId = settings.steam_id;
    // }

    // delete settings.profile_id;
    // delete settings.steam_id;

    await sendSettingsToElectron({ profileId: settings.profileId });
    return { profileId: settings.profileId };
};

export const loadFollowingFromStorage = async () => {
    const entry = await AsyncStorage.getItem('following');
    if (entry == null) {
        return [];
    }
    const entries = JSON.parse(entry) as IFollowingEntry[];

    for (const entry of entries) {
        if (entry.profileId == null && entry.profile_id != null) {
            entry.profileId = entry.profile_id;
            delete entry.profile_id;
        }
        delete entry.steam_id;
        // if (entry.steamId == null && entry.steam_id != null) {
        //     entry.steamId = entry.steam_id;
        // }
    }

    return entries.filter(e => e.profileId != null);
};

export const saveFollowingToStorage = async (following: IFollowingEntry[]) => {
    await AsyncStorage.setItem('following', JSON.stringify(following));
};

const sendConfigToElectron = async (config: IConfig) => {
    if (isElectron()) {
        await sendConfig(config);
    }
};

const sendSettingsToElectron = async (settings: ISettings | null) => {
    if (isElectron()) {
        await sendSettings(settings);
    }
};

const GROUP_NAME = `group.${Constants.expoConfig?.ios?.bundleIdentifier}.widget`;
const widget = new Widget(GROUP_NAME);

type FavoriteId = number | string;
export const useFavoritedBuilds = () => {
    const { getItem, setItem } = useAsyncStorage('favoritedBuilds');
    const [favoriteIds, setFavoriteIds] = useState<FavoriteId[]>([]);
    const favorites = buildsData.filter((build) => favoriteIds.includes(build.id));

    const readItemFromStorage = async () => {
        const item = await getItem();
        if (item) {
            setFavoriteIds(JSON.parse(item));
        } else {
            setFavoriteIds([]);
        }
    };

    const writeItemToStorage = async (newValue: FavoriteId[]) => {
        if (Platform.OS !== 'web') {
            const newWidgetData = JSON.stringify(
                buildsData
                    .filter((build) => newValue.includes(build.id))
                    .map((build) => ({
                        id: build.id.toString(),
                        title: build.title,
                        civilization: build.civilization,
                        image: widget.setImage(
                            Image.resolveAssetSource(getCivIconLocal(build.civilization) ?? genericCivIcon).uri,
                            `${camelCase(build.civilization)}.png`
                        ),
                    }))
            );
            widget.setItem('savedData', newWidgetData);
            widget.reloadAll();
        }
        await setItem(JSON.stringify(newValue));
        setFavoriteIds(newValue);
    };

    useEffect(() => {
        readItemFromStorage();
    }, []);

    const toggleFavorite = (id: FavoriteId) => {
        if (favoriteIds.includes(id)) {
            writeItemToStorage(favoriteIds.filter((favoriteId) => favoriteId !== id));
        } else {
            writeItemToStorage([...favoriteIds, id]);
        }
    };

    return {
        toggleFavorite,
        favoriteIds,
        favorites,
        refetch: readItemFromStorage,
    };
};

export const useFavoritedBuild = (id: FavoriteId) => {
    const { favoriteIds, toggleFavorite } = useFavoritedBuilds();

    return {
        toggleFavorite: () => toggleFavorite(id),
        isFavorited: favoriteIds.includes(id),
    };
};

type BuildFilters = {
    civilization: Civ | 'all';
    buildType: string | 'favorites' | 'all';
    difficulty: 1 | 2 | 3 | 'all';
};
const defaultFilters: BuildFilters = {
    civilization: 'all',
    buildType: 'all',
    difficulty: 'all',
};
export const useBuildFilters = () => {
    const { getItem, setItem } = useAsyncStorage('buildFilters');
    const [filters, setFilters] = useState<BuildFilters>();

    const readItemFromStorage = async () => {
        const item = await getItem();
        if (item) {
            setFilters({ ...defaultFilters, ...JSON.parse(item) });
        } else {
            setFilters(defaultFilters);
        }
    };

    const writeItemToStorage = async (newValue: BuildFilters) => {
        await setItem(JSON.stringify(newValue));
        setFilters(newValue);
    };

    useEffect(() => {
        readItemFromStorage();
    }, []);

    const setFilter = (key: keyof BuildFilters, value: BuildFilters[typeof key]) => {
        writeItemToStorage({ ...defaultFilters, ...filters, [key]: value });
    };

    return {
        setFilter,
        filters: filters ?? defaultFilters,
        loading: !filters,
    };
};
