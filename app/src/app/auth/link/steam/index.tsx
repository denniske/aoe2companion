import { View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { authLinkSteam } from '@app/api/account';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthLinkSteam() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient()

    const init = async () => {
        const result = await authLinkSteam(params);
        const data = await result.json();
        console.log('authLinkSteam', data);
        await queryClient.invalidateQueries({ queryKey: ['account'] })
    }

    useEffect(() => {
        router.dismiss();
        init();
    }, [params]);

    return (
        <View>
            <Stack.Screen options={{ title: 'Account', headerShown: true, header: Header }} />

            <MyText>Linking steam profile...</MyText>
        </View>
    );
}
