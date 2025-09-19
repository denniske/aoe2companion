import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest } from 'expo-auth-session';
import { authLinkTwitch } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';

export function useTwitchAuth() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: 'yxslhhtxc8um77cg9k05uriupg6as3',
            responseType: 'code',
            usePKCE: false,
            redirectUri: oAuthRedirectUri,
            prompt: Prompt.Consent,
            extraParams: {
                access_type: 'offline',
            },
            scopes: ['user:read:email'],
        },
        {
            authorizationEndpoint: 'https://id.twitch.tv/oauth2/authorize',
            tokenEndpoint: 'https://id.twitch.tv/oauth2/token',
            revocationEndpoint: 'https://id.twitch.tv/oauth2/revoke',
        }
    );

    console.log();
    // console.log('twitch request');
    // console.log(request);

    const link = async () => {
        if (!response) return;
        try {
            console.log();
            console.log('==> twitch response', response);

            if (response?.type === 'success') {
                console.log('response.params', response.params);
                const data = await authLinkTwitch({
                    ...response.params,
                    redirect_uri: oAuthRedirectUri,
                });
                console.log('authLinkTwitch', data);
                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            }
        } catch (error: any) {
            showAlert('Error linking twitch', error.message);
        }
    };

    useEffect(() => {
        link();
    }, [response]);

    return promptAsync;
}