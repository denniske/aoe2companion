import { IProfilesResultProfile } from '@app/api/helper/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

export const useRecentSearches = () => {
    const {
        data = [],
        isLoading,
        refetch,
    } = useQuery<IProfilesResultProfile[]>({
        queryKey: ['recent-searches'],
        queryFn: async () => {
            const recentSearches = await AsyncStorage.getItem('recentSearches');

            return recentSearches ? JSON.parse(recentSearches) : [];
        },
    });

    const clear = async () => {
        await AsyncStorage.removeItem('recentSearches');
        await refetch();
    };

    const add = async (search: IProfilesResultProfile) => {
        const newRecentSearches = [search, ...data.filter((d) => d.profileId !== search.profileId)].slice(0, 10);
        await AsyncStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
        await refetch();
    };

    return { data, isLoading, clear, add };
};
