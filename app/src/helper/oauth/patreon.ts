import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest } from 'expo-auth-session';
import { authLinkPatreon } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';

export function usePatreonAuth() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: 'jsn5ztplpiU4BZ1PxAzOnK5ZyXti69KhEFGQpZSNCt2ahACRi1LMo6kMKmxLFVmn',
            responseType: 'code',
            usePKCE: false,
            redirectUri: oAuthRedirectUri,
            prompt: Prompt.Consent,
            extraParams: {
                access_type: 'offline',
            },
            scopes: ['identity', 'identity.memberships'],
        },
        {
            authorizationEndpoint: 'https://www.patreon.com/oauth2/authorize',
        }
    );

    console.log();
    // console.log('patreon request');
    // console.log(request);

    const link = async () => {
        if (!response) return;
        try {
            console.log();
            console.log('==> patreon response', response);

            if (response?.type === 'success') {
                console.log('response.params', response.params);
                const data = await authLinkPatreon({
                    ...response.params,
                    redirect_uri: oAuthRedirectUri,
                });
                console.log('authLinkPatreon', data);
                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            }
        } catch (error: any) {
            showAlert('Error linking patreon', error.message);
        }
    };

    useEffect(() => {
        link();
    }, [response]);

    return promptAsync;
}
