import AsyncStorage from '@react-native-async-storage/async-storage';
import { compact } from 'lodash';
import { useEffect } from 'react';
import { useAccount } from '@app/queries/all';
import { useSaveAccountMutation } from '@app/mutations/save-account';

// Read straight off the module API rather than via useAsyncStorage: that hook builds
// new getItem/removeItem closures on every call, so listing them as dependencies of
// the migration effect below would re-run it on every render.
const FOLLOWED_TOURNAMENTS_KEY = 'followedTournaments';

export const useFollowedTournaments = () => {
    const { data: account, isLoading: isLoadingAccount } = useAccount();
    const favoriteIds = compact(account?.favoriteTournamentIds);

    // Destructured: react-query returns a new mutation object every render, but
    // `mutate` itself is a stable reference, so the migration effect below can depend
    // on it without re-running (and re-migrating) on every render.
    const { mutate: saveAccount } = useSaveAccountMutation();

    useEffect(() => {
        const readItemFromStorage = async () => {
            if (!isLoadingAccount && !account?.favoriteTournamentIds || account?.favoriteTournamentIds?.length === 0) {
                const item = await AsyncStorage.getItem(FOLLOWED_TOURNAMENTS_KEY);
                if (item) {
                    const favorites = JSON.parse(item);

                    console.log('Migrating local favorited tournaments to server', favorites);
                    await saveAccount({
                        favoriteTournamentIds: favorites,
                    });
                    await AsyncStorage.removeItem(FOLLOWED_TOURNAMENTS_KEY);
                }
            }
        };

        readItemFromStorage();
    }, [isLoadingAccount, account, saveAccount]);

    const toggleFollow = async (id: string) => {
        let favoriteTournamentIds;
        if (favoriteIds.includes(id)) {
            favoriteTournamentIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
        } else {
            favoriteTournamentIds = [...favoriteIds, id];
        }

        await saveAccount({
            favoriteTournamentIds,
        });
    };

    return {
        toggleFollow,
        followedIds: compact(favoriteIds),
    };
};

export const useFollowedTournament = (id: string) => {
    const { followedIds, toggleFollow } = useFollowedTournaments();

    return {
        toggleFollow: () => toggleFollow(id),
        isFollowed: followedIds.includes(id),
    };
};
