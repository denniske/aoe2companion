import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAccountThrottled } from '@app/api/account';
import { QUERY_KEY_ACCOUNT } from '@app/app/_layout';

export const useSaveAccountMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['saveAccount'],
        mutationFn: saveAccountThrottled,
        onMutate: async (_account) => {
            console.log('ON MUTATE');
            await queryClient.cancelQueries({ queryKey: QUERY_KEY_ACCOUNT() });
            const previousAccount = queryClient.getQueryData(QUERY_KEY_ACCOUNT());
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), _account);
            return { previousAccount, _account };
        },
        onError: (err, _account, context) => {
            console.log('ON ERROR');
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), context?.previousAccount);
        },
        onSettled: async (_account) => {
            console.log('ON SETTLED');
            console.log('ON SETTLED IS PENDING', queryClient.isMutating({ mutationKey: ['saveAccount'] }));
            if (queryClient.isMutating({ mutationKey: ['saveAccount'] }) === 1) {
                await queryClient.invalidateQueries({ queryKey: QUERY_KEY_ACCOUNT() }); // , refetchType: 'all'
                console.log('ON SETTLED INVALIDATED');
            }
        },
    });
};
