import { useQuery } from '@tanstack/react-query';
import { LeaderboardId } from '@nex/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const QUERY_KEY_PREFS = () => ['prefs'];
// export const QUERY_KEY_TODO = (todoId?: number) => ['todo', todoId];

export const usePrefs = () =>
    useQuery({
        queryKey: QUERY_KEY_PREFS(),
        queryFn: async () => await loadPrefsFromStorage(),
    });

export const usePrefData = <T>(select?: (data: IPrefs) => T) =>
    useQuery({
        queryKey: QUERY_KEY_PREFS(),
        queryFn: async () => await loadPrefsFromStorage(),
        select,
    }).data;

export const useTechTreeSize = () => usePrefData((data) => data.techTreeSize);

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
