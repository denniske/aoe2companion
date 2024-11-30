import { ActivityIndicator, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';
import { supabaseClient } from '@nex/data';
import { EmailOtpType } from '@supabase/supabase-js';

export default function AuthConfirm() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient();

    const init = async () => {
        const authResponse = await supabaseClient.auth.verifyOtp({
            type: params.type as EmailOtpType,
            token_hash: params.token_hash as string,
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
