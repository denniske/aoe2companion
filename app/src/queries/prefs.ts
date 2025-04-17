import { useQuery } from '@tanstack/react-query';
import { LeaderboardId } from '@nex/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAccountData } from '@app/queries/all';

export function usePrefData(): IPrefs | undefined;
export function usePrefData<T>(select: (data?: IPrefs) => T): T;
export function usePrefData<T>(select?: (data?: IPrefs) => T): T | IPrefs | undefined {
    return useAccountData((account) =>
        select ? select(account?.preferences) : account?.preferences
    );
}

export const useTechTreeSize = () => usePrefData((data) => data?.techTreeSize);

export const loadPrefsFromStorage = async () => {
    const entry = await AsyncStorage.getItem('prefs');
    if (entry == null) {
        return {} as IPrefs;
    }
    return JSON.parse(entry) as IPrefs;
};


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
