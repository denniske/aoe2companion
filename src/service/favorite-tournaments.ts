import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { compact } from 'lodash';
import { useEffect } from 'react';
import { useAccount } from '@app/queries/all';
import { useSaveAccountMutation } from '@app/mutations/save-account';

export const useFollowedTournaments = () => {
    const { getItem, removeItem } = useAsyncStorage('followedTournaments');

    const { data: account, isLoading: isLoadingAccount } = useAccount();
    const favoriteIds = compact(account?.favoriteTournamentIds);

    const saveAccountMutation = useSaveAccountMutation();

    const readItemFromStorage = async () => {
        if (!isLoadingAccount && !account?.favoriteTournamentIds || account?.favoriteTournamentIds?.length == 0) {
            const item = await getItem();
            if (item) {
                const favorites = JSON.parse(item);

                console.log('Migrating local favorited tournaments to server', favorites);
                await saveAccountMutation.mutate({
                    favoriteTournamentIds: favorites,
                });
                await removeItem();
            }
        }
    };

    useEffect(() => {
        readItemFromStorage();
    }, [isLoadingAccount, account]);

    const toggleFollow = async (id: string) => {
        let favoriteTournamentIds;
        if (favoriteIds.includes(id)) {
            favoriteTournamentIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
        } else {
            favoriteTournamentIds = [...favoriteIds, id];
        }

        await saveAccountMutation.mutate({
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
