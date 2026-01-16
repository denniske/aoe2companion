import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { authLinkDiscord, authLinkSteam, authLinkTwitch } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';
import { getHost, makeQueryString } from '@nex/data';
import { Linking, Platform } from 'react-native';
import { appConfig } from '@nex/dataset';

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

    // console.log();
    // console.log('steam request');
    // console.log(request);
    // console.log({
    //     authorizationEndpoint: getHost('aoe2companion-api') + `authorize`,
    // });
    // console.log('steam discovery', discovery);

    const link = async (params: any) => {
        try {
            console.log('params', params);
            const data = await authLinkSteam({
                ...params,
                redirect_uri: oAuthRedirectUri,
            });
            console.log('authLinkSteam', data);
            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
        } catch (error: any) {
            showAlert('Error linking steam', error.message);
        }
    };

    useEffect(() => {
        if (Platform.OS === 'android') return;
        if (response?.type === 'success') {
            link(response.params)
        }
    }, [response]);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        console.log('==> SUB create');

        const sub = Linking.addEventListener('url', ({ url }) => {

            console.log('==> SUB url', url);

            if (url.startsWith(`${appConfig.app.slug}://more/account`)) {
                const params = Object.fromEntries(new URL(url).searchParams.entries());
                // console.log('params', params);
                // console.log('request', request);
                if (params?.['openid.claimed_id'] && params?.state === request?.state) {
                    link(params);
                }
            }
        });
        return () => sub.remove();
    }, [request]);

    return promptAsync;
}
