import { ActivityIndicator, Alert, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';
import { supabaseClient } from '@nex/data';
import { authConfirm } from '@app/api/account';
import { useTranslation } from '@app/helper/translate';

export default function AuthConfirm() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient();
    const getTranslation = useTranslation();

    const init = async () => {
        console.log('authConfirm', params);
        const result = await authConfirm(params);
        const data = await result.json();
        console.log('authConfirm', data);

        if (data.error) {
            Alert.alert(data.error.code)
        }

        const authResponse = await supabaseClient.auth.setSession({
            access_token: data.session.accessToken,
            refresh_token: data.session.refreshToken,
        });
        console.log('authConfirm', authResponse);
        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });

        if (params.type === 'recovery') {
            router.replace('/more/reset-password');
        } else {
            router.dismiss();
        }
    };

    useEffect(() => {
        init();
    }, [params]);

    return (
        <View>
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: getTranslation('account.title'),
                    headerShown: true,
                    header: Header,
                }}
            />

            <View className="flex w-full pt-20 items-center justify-center">
                <ActivityIndicator />
                <Space />
                <MyText>{getTranslation('authconfirm.confirming')}</MyText>
            </View>
        </View>
    );
}
