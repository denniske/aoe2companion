import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { MyText } from '@app/view/components/my-text';
import { createStylesheet } from '../../theming-new';
import { Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import useAuth from '../../../../data/src/hooks/use-auth';
import Login from '@app/components/login';
import { makeQueryString } from '@nex/data';
import Space from '@app/view/components/space';
import { openLink } from '@app/helper/url';
import { useAppTheme, useTheme } from '@app/theming';
import { appVariants } from '@app/styles';
import { accountUnlinkPatreon, accountUnlinkSteam } from '@app/api/account';
import { supabaseClient } from '../../../../data/src/helper/supabase';
import { useAccount } from '@app/queries/all';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@app/components/button';
import { Text } from '@app/components/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '@app/helper/translate';

function getPatreonLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: 'jsn5ztplpiU4BZ1PxAzOnK5ZyXti69KhEFGQpZSNCt2ahACRi1LMo6kMKmxLFVmn',
        // redirect_uri: `${getHost('aoe2companion')}auth/link/patreon`,
        redirect_uri: `https://www.aoe2companion.com/auth/link/patreon`,
        scope: 'identity identity.memberships',
        allow_signup: 'false',
    }).toString();

    return `https://www.patreon.com/oauth2/authorize?${queryString}`;
}

function getSteamLoginUrl() {
    // let realm = getHost('aoe2companion');
    // let returnUrl = `${getHost('aoe2companion')}auth/link/steam`;
    let realm = `https://www.aoe2companion.com`;
    let returnUrl = `https://www.aoe2companion.com/auth/link/steam`;

    let match = realm.match(/^(https?:\/\/[^:/]+)/);
    if (!match) {
        throw new Error(`"${realm}" does not appear to be a valid realm`);
    }
    realm = match[1].toLowerCase();

    let queryString = makeQueryString({
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.mode': 'checkid_setup',
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.realm': realm,
        'openid.return_to': returnUrl,
    });

    return 'https://steamcommunity.com/openid/login?' + queryString;
}

export default function AccountPage() {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const theme = useAppTheme();

    const user = useAuth();
    const account = useAccount();

    // const account = useQuery({
    //     queryKey: QUERY_KEY_ACCOUNT(),
    //     staleTime: 0,
    //     queryFn: async () => await fetchAccount(),
    //     refetchOnMount: true,
    // });

    // console.log('user', user);
    console.log('accountId', account.data?.accountId);

    const unlinkSteam = async () => {
        await accountUnlinkSteam();
        await account.refetch();
    }

    const unlinkPatreon = async () => {
        await accountUnlinkPatreon();
        await account.refetch();
    }

    const logout = async () => {
        await supabaseClient.auth.signOut();

        await AsyncStorage.removeItem('account');
        await AsyncStorage.removeItem('config');
        await AsyncStorage.removeItem('settings');
        await AsyncStorage.removeItem('following');
        await AsyncStorage.removeItem('prefs');

        await account.refetch();
    }

    const loggedIn = user && !user.is_anonymous && account.data;

    return (
        <ScrollView contentContainerStyle="min-h-full p-5">
            <Stack.Screen options={{ title: !loggedIn ? 'Sign In' : getTranslation('account.title')}} />

            {!loggedIn && <Login />}

            {loggedIn && (
                <View className="gap-6">
                    <View className="gap-2">
                        <Text variant="header-sm">Profile Information</Text>
                        <Text variant="label">Email</Text>
                        <MyText style={styles.content}>{user.email}</MyText>
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">Patreon</Text>
                        <Text variant="body">Link your Patreon account to access exclusive benefits</Text>
                        {
                            account.data?.patreonId &&
                            <>
                                <Text variant="label">Membership Status</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="heart" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">Free Membership</Text>
                                </View>
                                <Button onPress={() => unlinkPatreon()}
                                        className={'w-60 mt-2'}
                                >
                                    Unlink Patreon Account
                                </Button>
                            </>
                        }
                        {
                            !account.data?.patreonId &&
                            <Button onPress={() => openLink(getSteamLoginUrl())}
                                    // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'w-40'}
                            >
                                Link Patreon
                            </Button>
                        }
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">Steam</Text>
                        <Text variant="body">Link your Steam account</Text>
                        {
                            account.data?.steamId &&
                            <>
                                <Text variant="label">Steam ID</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="steam" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.steamId}</Text>
                                </View>
                                <Button onPress={() => unlinkSteam()}
                                        className={'w-60 mt-2'}
                                >
                                    Unlink Steam Account
                                </Button>
                            </>
                        }
                        {
                            !account.data?.steamId &&
                            <Button onPress={() => openLink(getSteamLoginUrl())}
                                    // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'w-40'}
                            >
                                Link Steam
                            </Button>
                        }
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm"></Text>
                        <Button onPress={() => logout()}
                                className={'w-40'}
                        >
                            Logout
                        </Button>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        title: {
            marginTop: 20,
            fontSize: 16,
            fontWeight: 'bold',
        },
        heading: {
            marginTop: 20,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        content: {
            marginBottom: 5,
        },
    } as const)
);
