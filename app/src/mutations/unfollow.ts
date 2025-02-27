import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAccount, unfollowV2 } from '@app/api/account';
import produce from 'immer';
import { QUERY_KEY_ACCOUNT } from '@app/queries/all';


export const useUnfollowMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unfollow'],
        mutationFn: unfollowV2,
        onMutate: async (_profileId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY_ACCOUNT() });
            const previousAccount = queryClient.getQueryData(QUERY_KEY_ACCOUNT());

            const newAccount = produce(previousAccount, (draft: IAccount) => {
                draft.followedPlayers.splice(draft.followedPlayers.findIndex((f) => f.profileId === _profileId), 1);
            });

            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), newAccount);

            return { previousAccount, _profileId };
        },
        onError: (err, _profileId, context) => {
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), context?.previousAccount);
        },
        onSettled: async (_profileId) => {
            if ((queryClient.isMutating({ mutationKey: ['unfollow'] }) + queryClient.isMutating({ mutationKey: ['unfollow'] })) === 1) {
                await queryClient.invalidateQueries({ queryKey: QUERY_KEY_ACCOUNT(), refetchType: 'all' });
            }
        },
    });
}
