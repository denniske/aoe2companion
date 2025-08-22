import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { authLinkSteam, authLinkTwitch } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';
import { getHost, makeQueryString } from '@nex/data';

export function useSteamAuth() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '16hAlu2kwHVdf8AC0SQwkrxI', // does not really matter for steam
            responseType: 'code',
            usePKCE: false,
            redirectUri: oAuthRedirectUri,
            // prompt: Prompt.Consent, // not working with steam
            extraParams: {
                access_type: 'offline',
            },
            scopes: ['openid'],
        },
        {
            authorizationEndpoint: getHost('aoe2companion-api') + `authorize`,
        }
    );

    console.log();
    // console.log('steam request');
    // console.log(request);
    // console.log('steam discovery', discovery);

    const link = async () => {
        if (!response) return;
        try {
            console.log();
            console.log('==> steam response', response);

            if (response?.type === 'success') {
                console.log('response.params', response.params);
                const data = await authLinkSteam({
                    ...response.params,
                    redirect_uri: oAuthRedirectUri,
                });
                console.log('authLinkSteam', data);
                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            }
        } catch (error: any) {
            showAlert('Error linking steam', error.message);
        }
    };

    useEffect(() => {
        link();
    }, [response]);

    return promptAsync;
}
