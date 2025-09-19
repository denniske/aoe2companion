import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest } from 'expo-auth-session';
import { authLinkDiscord } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';

export function useDiscordAuth() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '1311364669465956442',
            responseType: 'code',
            usePKCE: false,
            redirectUri: oAuthRedirectUri,
            prompt: Prompt.Consent,
            extraParams: {
                access_type: 'offline',
            },
            scopes: ['identify', 'email', 'guilds'],
        },
        {
            authorizationEndpoint: 'https://discord.com/oauth2/authorize',
            tokenEndpoint: 'https://discord.com/api/oauth2/token',
            revocationEndpoint: 'https://discord.com/api/oauth2/token/revoke',
        }
    );

    console.log();
    // console.log('discord request');
    // console.log(request);

    const link = async () => {
        if (!response) return;
        try {
            console.log();
            console.log('==> discord response', response);

            if (response?.type === 'success') {
                console.log('response.params', response.params);
                const data = await authLinkDiscord({
                    ...response.params,
                    redirect_uri: oAuthRedirectUri,
                });
                console.log('authLinkDiscord', data);
                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            }
        } catch (error: any) {
            showAlert('Error linking discord', error.message);
        }
    };

    useEffect(() => {
        link();
    }, [response]);

    return promptAsync;
}
