import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAccount, unfollowV2 } from '@app/api/account';
import produce from 'immer';
import { QUERY_KEY_ACCOUNT } from '@app/queries/all';


export const useUnfollowMutation = () => {
    const queryClient = useQueryClient();

    // I think the profileIds need be added to the mutationKey?
    // what if multiple overlapping unfollows are done at the same time?

    return useMutation({
        mutationKey: ['unfollow'],
        mutationFn: unfollowV2,
        onMutate: async (_profileIds) => {
            const allQueries = queryClient.getQueryCache().findAll();
            if (allQueries.length === 0) {
                throw new Error('No queries found in the cache. Did you do HMR?');
            }

            await queryClient.cancelQueries({ queryKey: QUERY_KEY_ACCOUNT() });
            const previousAccount = queryClient.getQueryData(QUERY_KEY_ACCOUNT());

            const newAccount = produce(previousAccount, (draft: IAccount) => {
                draft.followedPlayers = draft.followedPlayers.filter(
                    (f) => !_profileIds.includes(f.profileId)
                );
            });

            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), newAccount);

            return { previousAccount, _profileIds };
        },

        onError: (err, _profileIds, context) => {
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), context?.previousAccount);
        },
        onSettled: async (_profileIds) => {
            if ((queryClient.isMutating({ mutationKey: ['follow'] }) + queryClient.isMutating({ mutationKey: ['unfollow'] })) === 1) {
                console.log('Settled unfollow invalidateQueries');
                await queryClient.invalidateQueries({ queryKey: QUERY_KEY_ACCOUNT(), refetchType: 'all' });
            }
        },
    });
}
