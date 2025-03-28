import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followV2, IAccount } from '@app/api/account';
import produce from 'immer';
import { uniqBy } from 'lodash';

const QUERY_KEY_ACCOUNT = () => ['account'];

export const useFollowMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['follow'],
        mutationFn: followV2,
        onMutate: async (_profileIds) => {
            const allQueries = queryClient.getQueryCache().findAll();
            if (allQueries.length === 0) {
                throw new Error('No queries found in the cache. Did you do HMR?');
            }

            await queryClient.cancelQueries({ queryKey: QUERY_KEY_ACCOUNT() });
            const previousAccount = queryClient.getQueryData(QUERY_KEY_ACCOUNT());

            const newAccount = produce(previousAccount, (draft: IAccount) => {
                draft.followedPlayers.push(..._profileIds.map(profileId => ({ profileId })));
                draft.followedPlayers = uniqBy(draft.followedPlayers, p => p.profileId);
            });

            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), newAccount);

            return { previousAccount, _profileIds };
        },
        onError: (err, _profileIds, context) => {
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), context?.previousAccount);
        },
        onSettled: async (_profileIds) => {
            if ((queryClient.isMutating({ mutationKey: ['follow'] }) + queryClient.isMutating({ mutationKey: ['unfollow'] })) === 1) {
                await queryClient.invalidateQueries({ queryKey: QUERY_KEY_ACCOUNT(), refetchType: 'all' });
            }
        },
    });
}
