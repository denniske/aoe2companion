import AsyncStorage from '@react-native-async-storage/async-storage';
import {minBy, pull, sumBy} from 'lodash';

export interface IMatchCacheEntry {
    id: string;
    date: Date;
    size: number;
}

export interface IMatchCacheIndex {
    entries: IMatchCacheEntry[];
}

export interface IMatchCache {
    [key: string]: any[];
}


export async function tidyMatchCache() {
    const index = await loadMatchCacheIndexFromStorage();
    console.log('tidyMatchCache', sumBy(index.entries, e => e.size) / 1000 / 1000);
    // 40 MB
    while (sumBy(index.entries, e => e.size) / 1000 / 1000 > 40) {
        const oldestEntry = minBy(index.entries, e => e.date);
        await AsyncStorage.removeItem(`matchcache-${oldestEntry!.id}`);
        pull(index.entries, oldestEntry);
        console.log('tidyMatchCache removed', oldestEntry);
    }
    await saveMatchCacheIndexToStorage(index);
}

export async function clearMatchCache() {
    const keys = await AsyncStorage.getAllKeys();
    const keysToDelete = keys.filter(key => key.startsWith('matchcache-'));
    await AsyncStorage.multiRemove(keysToDelete);
    await AsyncStorage.removeItem('matchcacheindex');
}

export async function getMatchCacheSize() {
    const index = await loadMatchCacheIndexFromStorage();
    return sumBy(index.entries, e => e.size);
}

export async function loadMatchCacheEntry(profileId: number) {
    const entry = await AsyncStorage.getItem(`matchcache-${profileId}`);
    if (entry == null) {
        return [];
    }
    return JSON.parse(entry) as any[];
}

export async function saveMatchCacheEntry(profileId: number, data: any[]) {
    const index = await loadMatchCacheIndexFromStorage();
    const existingEntry = index.entries.find(e => e.id == profileId.toString());
    if (existingEntry) {
        existingEntry.date = new Date();
        existingEntry.size = JSON.stringify(data).length;
    } else {
        index.entries.push({
            id: profileId.toString(),
            date: new Date(),
            size: JSON.stringify(data).length,
        });
    }
    await AsyncStorage.setItem(`matchcache-${profileId}`, JSON.stringify(data));
    await saveMatchCacheIndexToStorage(index);
}

const loadMatchCacheIndexFromStorage = async () => {
    const entry = await AsyncStorage.getItem('matchcacheindex');
    if (entry == null) {
        return {
            entries: [],
        };
    }
    return JSON.parse(entry) as IMatchCacheIndex;
};

const saveMatchCacheIndexToStorage = async (matchcache: IMatchCacheIndex) => {
    await AsyncStorage.setItem('matchcacheindex', JSON.stringify(matchcache));
};

// export const loadMatchCacheFromStorage = async () => {
//     const entry = await AsyncStorage.getItem('matchcache');
//     if (entry == null) {
//         return {};
//     }
//     return JSON.parse(entry) as IMatchCache;
// };
//
// export const saveMatchCacheToStorage = async (matchcache: IMatchCache) => {
//     await AsyncStorage.setItem('matchcache', JSON.stringify(matchcache));
// };
