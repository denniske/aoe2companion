import { getSupabaseClient } from '@nex/data';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export const useRedirectUnauthenticated = () => {
    useFocusEffect(
        useCallback(() => {
            getSupabaseClient().auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    router.replace('/more/account');
                }
            });
        }, [])
    );
};
