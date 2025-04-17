import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAccount, saveAccountThrottled } from '@app/api/account';
import { QUERY_KEY_ACCOUNT } from '@app/queries/all';
import { IPrefs } from '@app/queries/prefs';

export const useSaveAccountMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['saveAccount'],
        mutationFn: saveAccount,
        onMutate: async (_account) => {
            console.log('ON MUTATE');
            await queryClient.cancelQueries({ queryKey: QUERY_KEY_ACCOUNT() });
            const previousAccount = queryClient.getQueryData(QUERY_KEY_ACCOUNT()) as {};
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), {
                ...previousAccount,
                ..._account,
            });
            return { previousAccount, _account };
        },
        onError: (err, _account, context) => {
            console.log('ON ERROR', err);
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

export const useSavePrefsMutation = () => {
    const saveAccountMutation = useSaveAccountMutation();

    return {
        ...saveAccountMutation,
        mutate: (preferences: Partial<IPrefs>) => {
            saveAccountMutation.mutate({ preferences });
        },
        mutateAsync: async (preferences: Partial<IPrefs>) => {
            return saveAccountMutation.mutateAsync({ preferences });
        }
    };
};
