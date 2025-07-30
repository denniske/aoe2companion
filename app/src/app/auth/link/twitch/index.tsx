import { ActivityIndicator, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Space from '@app/view/components/space';
import { useTranslation } from '@app/helper/translate';
import { authLinkTwitch } from '@app/api/account';

export default function AuthLinkTwitch() {
    const router = useRouter();
    const params = useGlobalSearchParams();
    const queryClient = useQueryClient();
    const getTranslation = useTranslation();

    const init = async () => {
        console.log('authLinkTwitch', params);
        const data = await authLinkTwitch(params);
        console.log('authLinkTwitch', data);
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
                <MyText>{getTranslation('auth.linkingTwitch')}</MyText>
            </View>
        </View>
    );
}
