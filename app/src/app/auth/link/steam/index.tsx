import { View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { Header } from '@app/components/header';
import { useEffect } from 'react';
import { authLinkSteam } from '@app/api/account';
import { useAuthLinkSteam } from '@app/app/_layout';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthLinkSteam() {

    // const segments = useSegments();
    const router = useRouter();
    // const pathname = usePathname();
    const params = useGlobalSearchParams();
    //
    // console.log('segments', segments);
    // console.log('pathname', pathname);
    // console.log('params', params);
    //
    // const { data, error } = useAuthLinkSteam(params);
    // console.log('data', data);
    // console.log('error', error);
    //
    // // useEffect(() => {
    // //     authLinkSteam(params).then(data => {
    // //         console.log('authLinkSteam', data);
    // //         router.navigate('/account');
    // //     })
    // // }, [params]);
    //
    // useEffect(() => {
    //     if (data) {
    //         router.dismiss();
    //         // router.replace('/more/account');
    //     }
    // }, [data]);

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
