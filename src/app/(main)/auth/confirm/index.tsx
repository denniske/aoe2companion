import { ActivityIndicator, Alert, Platform, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';
import { supabaseClient } from '@nex/data';
import { authConfirm } from '@app/api/account';
import { useTranslation } from '@app/helper/translate';
import { usePrevious } from '@nex/data/hooks';
import { isEqual } from 'lodash';
import { showAlert } from '@app/helper/alert';

export default function AuthConfirm() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const prevParams = usePrevious(params);
    const queryClient = useQueryClient();
    const getTranslation = useTranslation();

    const init = async () => {
        console.log('authConfirm');
        console.log('params', params);
        const data = await authConfirm(params);
        console.log('data', data);

        if (data.error) {
            showAlert(data.error.code)
            return;
        }

        const authResponse = await supabaseClient.auth.setSession({
            access_token: data.session.accessToken,
            refresh_token: data.session.refreshToken,
        });

        console.log('authResponse', authResponse);

        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });

        if (params.type === 'recovery') {
            router.replace('/more/reset-password');
        } else {
            // On web the link is opened in new tab so we need to navigate to the account page. On mobile this should be the parent page.
            if (Platform.OS === 'web') {
                router.replace('/more/account');
            } else {
                router.dismiss();
            }
        }
    };

    if (!isEqual(params, prevParams)) {
        init();
    }

    return (
        <View>
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('account.title'),
                    headerShown: true,
                    header: (props) => <Header {...props} />,
                }}
            />

            <View className="flex w-full pt-20 items-center justify-center">
                <ActivityIndicator />
                <Space />
                <MyText>{getTranslation('auth.confirmingEmail')}</MyText>
            </View>
        </View>
    );
}
