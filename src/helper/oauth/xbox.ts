import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt, useAuthRequest } from 'expo-auth-session';
import { authLinkXbox } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';
import { Linking, Platform } from 'react-native';
import { appConfig } from '@nex/dataset';

export function useXboxAuth() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: Platform.OS === 'web' ? appConfig.oauth.xboxClientIdWeb : appConfig.oauth.xboxClientId,
            responseType: 'code',
            usePKCE: false,
            redirectUri: oAuthRedirectUri,
            prompt: Prompt.Consent,
            extraParams: {
                access_type: 'offline',
            },
            scopes: [],
        },
        {
            authorizationEndpoint: `https://xbl.io/app/auth/${Platform.OS === 'web' ? appConfig.oauth.xboxPublicKeyWeb : appConfig.oauth.xboxPublicKey}`,
        }
    );

    console.log();
    console.log('xbox request');
    console.log(request);
    console.log('xbox response');
    console.log(response);

    const link = async (params: any) => {
        try {
            console.log('params', params);
            const data = await authLinkXbox({
                ...params,
                redirect_uri: oAuthRedirectUri,
            });
            console.log('authLinkXbox', data);

            if (data.error) {
                showAlert(data.error.code)
                return;
            }

            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
        } catch (error: any) {
            console.log('error', error);
            showAlert('Error linking xbox', error.message);
        }
    };

    useEffect(() => {
        if (Platform.OS === 'android') return;
        if ((response as any)?.params?.state.startsWith('xbox?code=')) {
            const code = (response as any)?.params.state.replace('xbox?code=', '');
            link({
                code,
            });
        }
    }, [response]);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        console.log('params listen');

        const sub = Linking.addEventListener('url', ({ url }) => {
            if (url.startsWith(`${appConfig.app.slug}://more/account`)) {
                const params = Object.fromEntries(new URL(url).searchParams.entries());
                console.log('params', params);

                // xbl.io does not understand oauth state, so we get something like this:
                // {"state": "xbox?code=M...."}

                if (params?.state.startsWith('xbox?code=')) {
                    const code = params.state.replace('xbox?code=', '');
                    link({
                        code,
                    });
                }
            }
        });
        return () => sub.remove();
    }, [request]);

    return promptAsync;
}