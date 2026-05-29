import { Civ, Flag, LeaderboardId } from '@nex/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Image, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Widget } from '../../modules/widget';
import { DarkMode } from '../redux/reducer';
import { fetchAssets } from '@app/api/helper/api';
import * as Crypto from 'expo-crypto';
import { appConfig } from '@nex/dataset';
import * as Localization from 'expo-localization';
import { AvailableMainPage } from '@app/helper/routing';
import { Directory, File, Paths } from 'expo-file-system';
import { camelCase } from 'lodash';
import { genericCivIcon, getCivIconLocal } from '@app/helper/civs';

const supportedMainLocales = ['ms', 'fr', 'es', 'it', 'pt', 'ru', 'vi', 'tr', 'de', 'en', 'es', 'hi', 'ja', 'ko'];

// console.log('WIDGET', `group.${Constants.expoConfig?.ios?.bundleIdentifier}`);
// console.log('WIDGET', Widget.getAppGroupPath(`group.${Constants.expoConfig?.ios?.bundleIdentifier}`));

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
    selectedLeaderboards?: string;
    selectedOfficialLeaderboards?: string;
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

    console.log('==> lang', getLanguageFromSystemLocale(Localization.getLocales()[0].languageTag))

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

export async function md5(contents: string) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, contents);
}

export const widgetGroupDir = Paths.appleSharedContainers[`group.${Constants.expoConfig?.ios?.bundleIdentifier}`];

const slugifyFilename = (url?: string, size?: number) => {
    if (!url) return '';

    url = url.replace('https://backend.cdn.aoe2companion.com/', '');

    const dotIndex = url.lastIndexOf('.');

    const name = dotIndex !== -1 ? url.slice(0, dotIndex) : url;
    const ext = dotIndex !== -1 ? url.slice(dotIndex) : '';

    const slugged = name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

    const sizeStr = size ? `-${size}` : '';

    return slugged + sizeStr + ext;
};

import { SaveFormat, ImageManipulator } from 'expo-image-manipulator';

const processImageFast = async (uri: string) => {
    try {
        const start = new Date();

        const manipResult = await ImageManipulator.manipulate(uri).resize({ width: 75 }).renderAsync();
        const result = await manipResult.saveAsync({ format: SaveFormat.WEBP }); // compress: 0.7

        const end = new Date();
        console.log('MANIP', end.getTime() - start.getTime(), 'ms');

        return result.uri;
    } catch (error) {
        console.error('Image manipulation failed:', error);
    }
};

export const cacheLiveActivityAssets = async () => {
    try {
        const assets = await fetchAssets();
        console.log('cacheLiveActivityAssets', new Date());

        // const imagePath = Paths.join(widgetGroupDir, slugifyFilename('https://backend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_coastal.png'));
        // const imageSource = () => 'https://backend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_coastal.png';
        // const url = await widgetSetFileIfNotExists(imagePath, imageSource);
        // console.log('cacheLiveActivityAssets', imageSource(), url, new Date());
        //
        // if (url) {
        //     const smallImage = await processImageFast(url);
        //     if (smallImage) {
        //         const smallImageFile = new File(smallImage);
        //         const smallImagePath = Paths.join(
        //             widgetGroupDir,
        //             slugifyFilename('https://backend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_coastal_75.png')
        //         );
        //         smallImageFile.copySync(new File(smallImagePath), { overwrite: true });
        //         console.log('cacheLiveActivityAssets small', smallImagePath, new Date());
        //     }
        // }

        // const imagePath2 = Paths.join(widgetGroupDir, slugifyFilename('https://backend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_coastal_75.png'));
        // const imageSource2 = () => processImageFast('https://backend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_coastal.png');
        // const url2 = await widgetSetFileIfNotExists(imagePath2, imageSource2);
        // console.log('cacheLiveActivityAssets', url2, new Date());

        for (const asset of assets) {
            console.log('hasImage', asset.imageUrl, new Date());
            const imagePath = Paths.join(widgetGroupDir, slugifyFilename(asset.imageUrl));
            const imageSource = () => asset.imageUrl;
            const url = await widgetSetFileIfNotExists(imagePath, imageSource);
            console.log('cacheLiveActivityAssets', asset.imageUrl, url, new Date());

            // 75px (3 times 25px) for dynamic island icon
            if (asset.imageUrl.includes('/maps')) {
                const smallImagePath = Paths.join(widgetGroupDir, slugifyFilename(asset.imageUrl, 75));
                const smallImageFile = new File(smallImagePath);
                if (url && !smallImageFile.exists) {
                    const tempImage = await processImageFast(url);
                    if (tempImage) {
                        const tempImageFile = new File(tempImage);
                        tempImageFile.copySync(smallImageFile, { overwrite: true });
                        console.log('cacheLiveActivityAssets small', smallImagePath, new Date());
                    }
                }
            }

            // const imagePathDI = Paths.join(widgetGroupDir, slugifyFilename(asset.imageUrl, 25));
            // const imageSourceDI = () => asset.imageUrl;
            // const urlDI = await widgetSetFileIfNotExists(imagePathDI, imageSourceDI);
            // console.log('cacheLiveActivityAssets-25', asset.imageUrl, urlDI, new Date());
            // if (!Widget.hasImage(await md5(asset.imageUrl))) {
            //     const url = Widget.setImage(asset.imageUrl, await md5(asset.imageUrl));
            //     // console.log('cacheLiveActivityAssets', asset.imageUrl, url, new Date());
            // } else {
            //     // console.log('cacheLiveActivityAssets already cached', await md5(asset.imageUrl));
            // }
        }
        console.log('cacheLiveActivityAssets finish', new Date());
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

export type BuildFilters = {
    civilization?: Civ;
    buildType?: string | 'favorites';
    difficulty?: 1 | 2 | 3;
};



// async function widgetSetFileIfNotExists(destPath: string, getSourcePath: () => string) {
//     const destFile = new File(destPath);
//     if (!destFile.exists) {
//         await new File(getSourcePath()).copy(destFile);
//     }
//     return destFile.uri;
// }

export async function widgetSetFileIfNotExists(destPath: string, getSourcePath: () => string | undefined) {
    const destFile = new File(destPath);
    // if (!destFile.exists || destPath.includes('coastal')) {
        const sourcePath = getSourcePath();

        if (!sourcePath) {
            console.log('widgetSetFileIfNotExists no SourcePath');
            return undefined;
        }

        // console.log('TRY TO COPY FROM', sourcePath)

        if (sourcePath.startsWith('file:')) {
            await new File(sourcePath).copy(destFile);
        } else {
            await File.downloadFileAsync(sourcePath, destFile, {
                idempotent: true,
            });
        }
    // }
    // console.log(destFile.uri, destFile.exists);
    return destFile.uri;
}

// async function widgetSetFileIfNotExists(destPath: string, sourcePath: string) {
//     const destFile = new File(destPath);
//     if (!destFile.exists) {
//         new File(sourcePath).copy(destFile);
//     }
//     return destFile.uri;
// }
