import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { MMKV, useMMKVString } from 'react-native-mmkv';
import { useQuery } from '@tanstack/react-query';

export const mmkv = new MMKV();

export const useRecentSearches = () => {
    const [] = useMMKVString('recentSearches');
    const {
        data = [],
        isLoading,
        refetch,
    } = useQuery<IProfilesResultProfile[]>({
        queryKey: ['recent-searches'],
        queryFn: async () => {
            const recentSearches = mmkv.getString('recentSearches');

            return recentSearches ? JSON.parse(recentSearches) : [];
        },
    });

    const clear = async () => {
        mmkv.delete('recentSearches');
        await refetch();
    };

    const add = async (search: IProfilesResultProfile) => {
        const newRecentSearches = [search, ...data.filter((d) => d.profileId !== search.profileId)].slice(0, 10);
        await mmkv.set('recentSearches', JSON.stringify(newRecentSearches));
        await refetch();
    };

    return { data, isLoading, clear, add };
};
