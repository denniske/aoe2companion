import { ActivityIndicator, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { authLinkSteam } from '@app/api/account';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';

export default function AuthLinkSteam() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient()

    const init = async () => {
        const result = await authLinkSteam(params);
        const data = await result.json();
        console.log('authLinkSteam', data);
        await queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' })
        router.dismiss();
    }

    useEffect(() => {
        init();
    }, [params]);

    return (
        <View>
            <Stack.Screen options={{
                animation: 'none',
                title: 'Account',
                headerShown: true,
                header: Header
            }} />

            <View className="flex w-full pt-20 items-center justify-center">
                <ActivityIndicator />
                <Space />
                <MyText>Linking steam profile...</MyText>
            </View>
        </View>
    );
}
