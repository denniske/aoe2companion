import { Civ, Flag, LeaderboardId } from '@nex/data';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { camelCase, compact } from 'lodash';
import { useEffect, useState } from 'react';
import { Image, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Widget } from '../../modules/widget';
import { genericCivIcon, getCivIconLocal } from '../helper/civs';
import { DarkMode } from '../redux/reducer';
import { fetchAssets, fetchBuilds } from '@app/api/helper/api';
import * as Crypto from 'expo-crypto';
import { appConfig } from '@nex/dataset';
import * as Localization from 'expo-localization';
import { AvailableMainPage } from '@app/helper/routing';
import { useAccount } from '@app/queries/all';
import { useSaveAccountMutation } from '@app/mutations/save-account';

const supportedMainLocales = ['ms', 'fr', 'es', 'it', 'pt', 'ru', 'vi', 'tr', 'de', 'en', 'es', 'hi', 'ja', 'ko'];

function getLanguageFromSystemLocale(locale: string) {
    locale = locale.toLowerCase();

    if (locale.startsWith('es-mx')) {
        return 'es-MX';
    }
    if (locale.startsWith('zh-hant') || locale.startsWith('zh-tw')) {
        return 'zh-hant';
    }
    if (locale.startsWith('zh-hans')) {
        return 'zh-hans';
    }

    for (const supportedMainLocale of supportedMainLocales) {
        if (locale.startsWith(supportedMainLocale)) {
            return supportedMainLocale;
        }
    }

    return 'en';
}

export interface IConfig {
    darkMode: DarkMode;
    pushNotificationsEnabled: boolean;
    // preventScreenLockOnGuidePage: boolean;
    language: string;
    mainPage: AvailableMainPage;
}

export interface IScroll {
    scrollPosition: number;
    scrollToTop?: string;
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
    profileId: number;
    name?: string;
    games?: number;
    country?: Flag;
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
    buildFilter?: BuildFilters;
}

export const loadAccountFromStorage = async () => {
    const entry = await AsyncStorage.getItem('account');
    if (entry == null) {
        const newAccountId = uuidv4();
        await AsyncStorage.setItem('account', JSON.stringify({ id: newAccountId }));
        return {
            id: newAccountId,
        };
    }
    return JSON.parse(entry) as IAccount;
};

export const loadConfigFromStorage = async () => {
    const entryJson = await AsyncStorage.getItem('config');
    const entry = (entryJson ? JSON.parse(entryJson) : {}) as IConfig;
    entry.language = entry.language ?? getLanguageFromSystemLocale(Localization.getLocales()[0].languageTag);
    entry.darkMode = entry.darkMode ?? 'system';
    // entry.preventScreenLockOnGuidePage = entry.preventScreenLockOnGuidePage ?? true;
    entry.pushNotificationsEnabled = entry.pushNotificationsEnabled ?? false;
    return entry;
};

export const loadPrefsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('prefs');
    if (entry == null) {
        return {} as IPrefs;
    }
    return JSON.parse(entry) as IPrefs;
};

export const saveConfigToStorage = async (config: Partial<IConfig>) => {
    // await AsyncStorage.setItem('config', JSON.stringify(config));
    await AsyncStorage.mergeItem('config', JSON.stringify(config));
};

export const saveAuthToStorage = async (settings: ISettings) => {
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
};

export const loadAuthFromStorage = async () => {
    const entry = await AsyncStorage.getItem('settings');
    if (entry == null) {
        return null;
    }
    const settings = JSON.parse(entry) as ISettings;
    return { profileId: settings.profileId };
};

export const loadFollowingFromStorage = async () => {
    const entry = await AsyncStorage.getItem('following');
    if (entry == null) {
        return [] as IFollowingEntry[];
    }
    const entries = JSON.parse(entry) as IFollowingEntry[];
    return entries.filter((e) => e.profileId != null);
};

export const saveFollowingToStorage = async (following: IFollowingEntry[]) => {
    await AsyncStorage.setItem('following', JSON.stringify(following));
};

if (Platform.OS === 'ios' && appConfig.game === 'aoe2') {
    Widget.setAppGroup(`group.${Constants.expoConfig?.ios?.bundleIdentifier}.widget`);
    // console.log('setAppGroup', `group.${Constants.expoConfig?.ios?.bundleIdentifier}.widget`);
}

export const useFavoritedBuilds = () => {
    const { getItem, removeItem } = useAsyncStorage('favoritedBuilds');

    const { data: account, isLoading: isLoadingAccount } = useAccount();
    const favoriteIds = compact(account?.favoriteBuildIds);

    const saveAccountMutation = useSaveAccountMutation();

    const readItemFromStorage = async () => {
        const item = await getItem();
        if (item) {
            const favorites = JSON.parse(item);

            if (!isLoadingAccount && !account?.favoriteBuildIds || account?.favoriteBuildIds?.length == 0) {
                // First time, migrate local storage to server
                console.log('Migrating local favorited builds to server', favorites);
                await saveAccountMutation.mutate({
                    favoriteBuildIds: favorites,
                });
                await removeItem();
            }
        }
    };

    useEffect(() => {
        readItemFromStorage();
    }, []);

    const toggleFavorite = async (id: string) => {
        let favoriteBuildIds;
        if (favoriteIds.includes(id)) {
            favoriteBuildIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
        } else {
            favoriteBuildIds = [...favoriteIds, id];
        }

        await saveAccountMutation.mutate({
            favoriteBuildIds,
        });

        // Store favorite builds for widget (just first page should be enough)
        const favoriteBuildsResult = await fetchBuilds({ build_ids: favoriteBuildIds });
        const favoriteBuilds = favoriteBuildsResult.builds;

        if (Platform.OS === 'ios' && appConfig.game === 'aoe2') {
            const newWidgetData = JSON.stringify(
                favoriteBuilds
                    .map((build) => ({
                        id: build.id.toString(),
                        title: build.title,
                        civilization: build.civilization,
                        image:
                            Widget.getImagePathIfExists(`${camelCase(build.civilization)}.png`) ??
                            Widget.setImage(
                                Image.resolveAssetSource(getCivIconLocal(build.civilization) ?? genericCivIcon).uri,
                                `${camelCase(build.civilization)}.png`
                            ),
                        icon:
                            Widget.getImagePathIfExists(`${camelCase(build.image.toString())}.png`) ??
                            Widget.setImage(Image.resolveAssetSource({ uri: build.imageURL }).uri, `${camelCase(build.image.toString())}.png`),
                    }))
            );
            Widget.setItem('savedData', newWidgetData);
            Widget.reloadAll();
        }
    };

    return {
        toggleFavorite,
        favoriteIds,
    };
};

async function md5(contents: string) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, contents);
}

export const cacheLiveActivityAssets = async () => {
    try {
        const assets = await fetchAssets();
        // console.log('cacheLiveActivityAssets', new Date());
        for (const asset of assets) {
            // console.log('hasImage', asset.imageUrl, new Date());
            if (!Widget.hasImage(await md5(asset.imageUrl))) {
                const url = Widget.setImage(asset.imageUrl, await md5(asset.imageUrl));
                // console.log('cacheLiveActivityAssets', asset.imageUrl, url, new Date());
            } else {
                // console.log('cacheLiveActivityAssets already cached', await md5(asset.imageUrl));
            }
        }
        // console.log('cacheLiveActivityAssets finish', new Date());
    } catch (error) {
        if (__DEV__) {
            console.error('cacheLiveActivityAssets error', error);
        } else {
            throw error;
        }
    }
};

// export const crashSetImage = async () => {
//     try {
//         console.log('pre crashSetImage');
//         const url = Widget.setImage(Image.resolveAssetSource(getCivIconLocal('Aztecs') ?? genericCivIcon).uri, '');
//         console.log('post crashSetImage', url);
//     }
//     catch (error) {
//         console.error('Error setting image:', error);
//     }
// }

export const useFavoritedBuild = (id: string) => {
    const { favoriteIds, toggleFavorite } = useFavoritedBuilds();

    return {
        toggleFavorite: () => toggleFavorite(id),
        isFavorited: favoriteIds.includes(id),
    };
};

export type BuildFilters = {
    civilization?: Civ;
    buildType?: string | 'favorites';
    difficulty?: 1 | 2 | 3;
};
