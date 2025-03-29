import { ActivityIndicator, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';
import { supabaseClient } from '@nex/data';
import { authConfirm } from '@app/api/account';

export default function AuthConfirm() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient();

    const init = async () => {
        console.log('authConfirm', params);
        const result = await authConfirm(params);
        const data = await result.json();
        console.log('authConfirm', data);
        const authResponse = await supabaseClient.auth.setSession({
            access_token: data.session.accessToken,
            refresh_token: data.session.refreshToken,
        });
        console.log('authConfirm', authResponse);
        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' });
        router.dismiss();
    };

    useEffect(() => {
        init();
    }, [params]);

    return (
        <View>
            <Stack.Screen
                options={{
                    animation: 'none',
                    title: 'Account',
                    headerShown: true,
                    header: Header,
                }}
            />

            <View className="flex w-full pt-20 items-center justify-center">
                <ActivityIndicator />
                <Space />
                <MyText>Confirming email...</MyText>
            </View>
        </View>
    );
}
