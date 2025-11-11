import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest } from 'expo-auth-session';
import { authLinkDiscord, authLinkTwitch } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';
import { Linking, Platform } from 'react-native';
import { appConfig } from '@nex/dataset';

export function useTwitchAuth() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: appConfig.oauth.twitchClientId,
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

    // console.log();
    // console.log('twitch request');
    // console.log(request);
    // console.log('twitch response');
    // console.log(response);

    const link = async (params: any) => {
        try {
            console.log('params', params);
            const data = await authLinkTwitch({
                ...params,
                redirect_uri: oAuthRedirectUri,
            });
            console.log('authLinkTwitch', data);
            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
        } catch (error: any) {
            showAlert('Error linking twitch', error.message);
        }
    };

    useEffect(() => {
        if (Platform.OS !== 'ios') return;
        if (response?.type === 'success') {
            link(response.params)
        }
    }, [response]);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const sub = Linking.addEventListener('url', ({ url }) => {
            if (url.startsWith(`${appConfig.app.slug}://more/account`)) {
                const params = Object.fromEntries(new URL(url).searchParams.entries());
                if (params?.code && params?.state === request?.state) {
                    link(params);
                }
            }
        });
        return () => sub.remove();
    }, [request]);

    return promptAsync;
}