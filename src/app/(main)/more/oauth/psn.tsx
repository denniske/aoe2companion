import React from 'react';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';
import { authLinkPsn } from '@app/api/account';
import { showAlert } from '@app/helper/alert';
import { queryClient } from '@app/service/query-client';
import { useRouter } from 'expo-router';

export default function PsnPage() {
    const router = useRouter();
    
    const link = async (params: any) => {
        router.dismiss();
        try {
            console.log('params', params);
            const data = await authLinkPsn({
                ...params,
            });
            console.log('authLinkPsn', data);

            if (data.error) {
                showAlert(data.error.code)
                return;
            }

            await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
        } catch (error: any) {
            console.log('error', error);
            showAlert('Error linking psn', error.message);
        }
    };

    const sourceUri = atob('aHR0cHM6Ly9jYS5hY2NvdW50LnNvbnkuY29tL2FwaS9hdXRoei92My9vYXV0aC9hdXRob3JpemU/YWNjZXNzX3R5cGU9b2ZmbGluZSZjbGllbnRfaWQ9MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxJnJlc3BvbnNlX3R5cGU9Y29kZSZzY29wZT1wc246bW9iaWxlLnYyLmNvcmUrcHNuOmNsaWVudGFwcCZyZWRpcmVjdF91cmk9Y29tLnNjZWUucHN4YW5kcm9pZC5zY2Vjb21wY2FsbDovL3JlZGlyZWN0');
    const navigationUriStartsWith = atob('Y29tLnNjZWUucHN4YW5kcm9pZC5zY2Vjb21wY2FsbDovL3JlZGlyZWN0');

    return (
        <WebView
            originWhitelist={['http://', 'https://', 'com.scee.psxandroid.scecompcall']}
            overScrollMode="never"
            bounces={false}
            scrollEnabled={true}
            {...(Platform.OS === 'ios' ? { decelerationRate: 'normal' } : {})}
            source={{ uri: sourceUri }}
            style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0)' }} // or #181c29
            className={'flex-1'}
            onNavigationStateChange={(event) => {
                console.log("URL changed:", event.url);

                if (event.url.startsWith(navigationUriStartsWith)) {
                    const urlObj = new URL(event.url);
                    const code = urlObj.searchParams.get('code');
                    console.log('Authorization code:', code);
                    link({ code });
                }
            }}
        />
    );
}
