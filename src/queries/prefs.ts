import { useQuery } from '@tanstack/react-query';
import { LeaderboardId } from '@nex/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAccountData } from '@app/queries/all';
import { IPrefs } from '@app/service/storage';

export function usePrefData(): IPrefs | undefined;
export function usePrefData<T>(select: (data?: IPrefs) => T): T;
export function usePrefData<T>(select?: (data?: IPrefs) => T): T | IPrefs | undefined {
    return useAccountData((account) =>
        select ? select(account?.preferences) : account?.preferences
    );
}

export const useTechTreeSize = () => usePrefData((data) => data?.techTreeSize);
