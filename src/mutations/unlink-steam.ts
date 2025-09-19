import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountUnlinkSteam, IAccount, unfollowV2 } from '@app/api/account';
import produce from 'immer';
import { QUERY_KEY_ACCOUNT } from '@app/queries/all';


export const useUnlinkSteamMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unlinkSteam'],
        mutationFn: accountUnlinkSteam,
        onSettled: async (_profileId) => {
            if (queryClient.isMutating({ mutationKey: ['unlinkSteam'] }) === 1) {
                await queryClient.invalidateQueries({ queryKey: QUERY_KEY_ACCOUNT(), refetchType: 'all' });
            }
        },
    });
}
