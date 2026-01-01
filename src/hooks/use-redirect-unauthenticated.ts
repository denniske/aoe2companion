import { supabaseClient } from '@nex/data';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export const useRedirectUnauthenticated = () => {
    useFocusEffect(
        useCallback(() => {
            supabaseClient.auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    router.replace('/more/account');
                }
            });
        }, [])
    );
};
