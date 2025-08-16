import * as Google from 'expo-auth-session/providers/google';
import { oAuthRedirectUri } from '@app/helper/oauth/oauth';
import { Prompt } from 'expo-auth-session';
import { authLinkYoutube } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { useEffect } from 'react';
import { showAlert } from '@app/helper/alert';

// We need to use expo auth session for google because google sends back the
// scope https://www.googleapis.com/auth/youtube.readonly in the redirect url
// and this breaks expo url handling

export function useYoutubeAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        responseType: 'code',
        usePKCE: false,
        redirectUri: oAuthRedirectUri,
        shouldAutoExchangeCode: false, // we need to handle the code exchange manually server side with client_secret
        prompt: Prompt.Consent, // force user to re-consent every time
        extraParams: {
            access_type: 'offline', // request refresh token
        },
        scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/youtube.readonly'],
    });

    console.log();
    console.log('youtube request');
    console.log(request);

    const link = async () => {
        try {
            console.log();
            console.log('==> youtube response', response);

            if (response?.type === 'success') {
                console.log('response.params', response.params);
                const data = await authLinkYoutube({
                    ...response.params,
                    redirect_uri: oAuthRedirectUri,
                });
                console.log('authLinkYoutube', data);
                await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
            }
        } catch (error: any) {
            showAlert('Error linking youtube', error.message);
        }
    };

    useEffect(() => {
        link();
    }, [response]);

    return promptAsync;
}
