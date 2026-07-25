import { getSupabaseClient } from '@nex/data';
import { router, useFocusEffect } from 'expo-router';

export const useRedirectUnauthenticated = () => {
    useFocusEffect(() => {
        getSupabaseClient()
            .auth.getSession()
            .then(({ data: { session } }) => {
                if (!session) {
                    router.replace('/more/account');
                }
            });
    });
};
