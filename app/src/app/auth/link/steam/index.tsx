import { ActivityIndicator, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { authLinkSteam } from '@app/api/account';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';
import { useTranslation } from '@app/helper/translate';

export default function AuthLinkSteam() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient()
    const getTranslation = useTranslation();

    const init = async () => {
        const data = await authLinkSteam(params);
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
                title: getTranslation('account.title'),
                headerShown: true,
                header: (props) => <Header {...props} />
            }} />

            <View className="flex w-full pt-20 items-center justify-center">
                <ActivityIndicator />
                <Space />
                <MyText>{getTranslation('auth.linkingSteam')}</MyText>
            </View>
        </View>
    );
}
