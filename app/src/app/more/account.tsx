import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { MyText } from '@app/view/components/my-text';
import { createStylesheet } from '../../theming-new';
import { router, Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import useAuth from '../../../../data/src/hooks/use-auth';
import Login from '@app/components/login';
import { getHost, makeQueryString } from '@nex/data';
import Space from '@app/view/components/space';
import { openLink } from '@app/helper/url';
import { useAppTheme, useTheme } from '@app/theming';
import { appVariants } from '@app/styles';
import {
    accountDelete,
    accountDiscordInvitation,
    accountRelicVerify, accountUnlinkDiscord,
    accountUnlinkPatreon,
    accountUnlinkSteam,
    accountUnlinkTwitch,
    accountUnlinkYoutube,
} from '@app/api/account';
import { supabaseClient } from '../../../../data/src/helper/supabase';
import { useAccount } from '@app/queries/all';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@app/components/button';
import { Text } from '@app/components/text';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '@app/helper/translate';
import { Checkbox as CheckboxNew } from '@app/components/checkbox';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useQuery } from '@tanstack/react-query';
import { Field } from '@app/components/field';
import { showAlert } from '@app/helper/alert';

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

function getTwitchLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: 'yxslhhtxc8um77cg9k05uriupg6as3',
        // redirect_uri: `${getHost('aoe2companion')}auth/link/twitch`,
        redirect_uri: `https://www.aoe2companion.com/auth/link/twitch`,
        // redirect_uri: `http://localhost:8081/auth/link/twitch`,
        scope: 'user:read:email',
        allow_signup: 'false',
    }).toString();

    return `https://id.twitch.tv/oauth2/authorize?${queryString}`;
}


function getYoutubeLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: '488773703040-894cl8823vjasguo1i8cin0vv5tsqosv.apps.googleusercontent.com',
        // redirect_uri: `${getHost('aoe2companion')}auth/link/youtube`,
        redirect_uri: `https://www.aoe2companion.com/auth/link/youtube`,
        // redirect_uri: `http://localhost:8081/auth/link/youtube`,
        scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
        allow_signup: 'false',
    }).toString();

    return `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
}

function getDiscordLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: '1311364669465956442',
        // redirect_uri: `${getHost('aoe2companion')}auth/link/discord`,
        redirect_uri: `https://www.aoe2companion.com/auth/link/discord`,
        // redirect_uri: `http://localhost:8081/auth/link/discord`,
        scope: 'identify email guilds',
        allow_signup: 'false',
    }).toString();

    return `https://discord.com/oauth2/authorize?${queryString}`;
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
    const loggedIn = user && !user.is_anonymous && account.data;
    // console.log('user', user);
    // console.log('user.is_anonymous', user?.is_anonymous);
    // console.log('account', account.data);

    const saveAccountMutation = useSaveAccountMutation();

    const [relicVerification, setRelicVerification] = useState(false);
    const [discordInvitation, setDiscordInvitation] = useState('https://discord.gg/gCunWKx');
    const [discordInvitationError, setDiscordInvitationError] = useState('');

    const { data: relicVerificationData, isLoading, error } = useQuery({
        queryKey: ['accountRelicVerify'],
        queryFn: accountRelicVerify,
        enabled: relicVerification,
        refetchInterval: relicVerification ? 10000 : false, // poll every 10s
    });

    useEffect(() => {
        if (relicVerificationData?.verified) {
            setRelicVerification(false);
            account.refetch();
        }
    }, [relicVerificationData?.verified])

    // const account = useQuery({
    //     queryKey: QUERY_KEY_ACCOUNT(),
    //     staleTime: 0,
    //     queryFn: async () => await fetchAccount(),
    //     refetchOnMount: true,
    // });

    console.log('user', user);
    console.log('accountId', account.data?.accountId);

    const toggleSharedHistory = async () => {
        saveAccountMutation.mutate({
            sharedHistory: !account.data!.sharedHistory,
        });
    }

    const unlinkSteam = async () => {
        await accountUnlinkSteam();
        await account.refetch();
    }

    const unlinkPatreon = async () => {
        await accountUnlinkPatreon();
        await account.refetch();
    }

    const unlinkYoutube = async () => {
        await accountUnlinkYoutube();
        await account.refetch();
    }

    const unlinkDiscord = async () => {
        await accountUnlinkDiscord();
        await account.refetch();
    }

    const unlinkTwitch = async () => {
        await accountUnlinkTwitch();
        await account.refetch();
    }

    const updateDiscordInvitation = async (discordInvitation: string) => {
        const data = await accountDiscordInvitation(discordInvitation);
        console.log(data);
        if (data.error) {
            setDiscordInvitationError(data.error.message);
        } else {
            setDiscordInvitationError('');
            await account.refetch();
        }
    };

    const logout = async () => {
        await supabaseClient.auth.signOut();

        await AsyncStorage.removeItem('account');
        await AsyncStorage.removeItem('config');
        await AsyncStorage.removeItem('settings');
        await AsyncStorage.removeItem('following');
        await AsyncStorage.removeItem('prefs');

        await account.refetch();
    }

    const deleteAccount = async () => {
        console.log('deleteAccount');

        await accountDelete();
        await logout();
    }

    const showDeleteDialog = () => {
        showAlert(
            getTranslation('account.delete.title'),
            getTranslation('account.delete.note'),
            [
                { text: getTranslation('account.delete.action.cancel'), style: 'cancel' },
                { text: getTranslation('account.delete.action.delete'), onPress: deleteAccount },
            ],
            { cancelable: false }
        );
    };

    return (
        <ScrollView contentContainerStyle="min-h-full p-5">
            <Stack.Screen options={{ title: !loggedIn ? getTranslation('login.signin') : getTranslation('account.title')}} />

            {!loggedIn && <Login />}

            {loggedIn && (
                <View className="gap-6">
                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.profileinfo')}</Text>
                        <Text variant="label">Email</Text>
                        <MyText style={styles.content}>{user.email}</MyText>
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.patreon.title')}</Text>
                        <Text variant="body">{getTranslation('account.patreon.description')}</Text>
                        {
                            account.data?.patreonId &&
                            <>
                                <Text variant="label">{getTranslation('account.patreon.membershipstatus')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="heart" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{getTranslation('account.patreon.freestatus')}</Text>
                                </View>
                                <Button onPress={() => unlinkPatreon()}
                                        className={'self-start mt-2'}
                                >
                                    {getTranslation('account.patreon.unlink')}
                                </Button>
                            </>
                        }
                        {
                            !account.data?.patreonId &&
                            <Button onPress={() => openLink(getPatreonLoginUrl())}
                                    // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'self-start'}
                            >
                                {getTranslation('account.patreon.link')}
                            </Button>
                        }
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.steam.title')}</Text>


                        <Text variant="body">{getTranslation('account.steam.description')}</Text>
                        {
                            !(account.data?.steamId || account.data?.authRelicId) &&
                            <Button onPress={() => openLink(getSteamLoginUrl())}
                                    // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'self-start'}
                            >
                                {getTranslation('account.steam.link')}
                            </Button>
                        }


                        {
                            relicVerification &&
                            <>
                                <Text variant="body">{getTranslation('account.relic.link.description')}</Text>
                                <View className="flex-row gap-2">
                                    <Text variant="body">{getTranslation('account.relic.link.token', { token: relicVerificationData?.token })}</Text>
                                    <ActivityIndicator animating size="small" color="#999"/>
                                </View>
                                <Text variant="body" className="text-sm">{getTranslation('account.relic.link.note')}</Text>
                            </>
                        }

                        {
                            !(account.data?.steamId || account.data?.authRelicId) &&
                            <Button onPress={() => setRelicVerification((prev) => !prev)}
                                    // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'self-start'}
                            >
                                {!relicVerification ? getTranslation('account.relic.link') : getTranslation('account.relic.cancel')}
                            </Button>
                        }


                        {
                            account.data?.steamId &&
                            <>
                                <Text variant="label">{getTranslation('account.steam.id')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="steam" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.steamId}</Text>
                                </View>
                            </>
                        }
                        {
                            account.data?.authRelicId &&
                            <>
                                <Text variant="label">{getTranslation('account.relic.id')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="xbox" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.authRelicId}</Text>
                                </View>
                            </>
                        }
                        {
                            (account.data?.steamId || account.data?.authRelicId) &&
                            <>
                                <Button onPress={() => unlinkSteam()}
                                        className={'self-start mt-2'}
                                >
                                    {getTranslation('account.steam.unlink')}
                                </Button>
                            </>
                        }
                    </View>




                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.privacy.title')}</Text>
                        <Text variant="body">{getTranslation('account.privacy.description')}</Text>

                        <View className="flex-row items-center">
                            <View className="flex-1 justify-items-start gap-y-1">
                                <MyText className="text-default">{getTranslation('account.sharedhistory')}</MyText>
                                <MyText className="text-xs">{getTranslation('account.sharedhistory.note')}</MyText>
                            </View>
                            <View className="flex-1 justify-items-start">
                                <CheckboxNew
                                    disabled={!(account.data?.steamId || account.data?.authRelicId)}
                                    checked={account?.data?.sharedHistory}
                                    onPress={toggleSharedHistory}
                                />
                            </View>
                        </View>
                    </View>



                    {/*<View className="gap-2">*/}
                    {/*    <Text variant="header-sm">{getTranslation('account.youtube.title')}</Text>*/}
                    {/*    <Text variant="body">{getTranslation('account.youtube.description')}</Text>*/}
                    {/*    {*/}
                    {/*        account.data?.youtubeChannelName &&*/}
                    {/*        <>*/}
                    {/*            <Text variant="label">{getTranslation('account.youtube.channel')}</Text>*/}
                    {/*            <View className="flex-row gap-2 items-center">*/}
                    {/*                <FontAwesome5 name="youtube" size={14} color={theme.textNoteColor} />*/}
                    {/*                <Text variant="body">{account.data.youtubeChannelName}</Text>*/}
                    {/*            </View>*/}
                    {/*            <Button onPress={() => unlinkYoutube()}*/}
                    {/*                    className={'self-start mt-2'}*/}
                    {/*            >*/}
                    {/*                {getTranslation('account.youtube.unlink')}*/}
                    {/*            </Button>*/}
                    {/*        </>*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        !account.data?.youtubeChannelName &&*/}
                    {/*        <Button onPress={() => openLink(getYoutubeLoginUrl())}*/}
                    {/*            // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}*/}
                    {/*                className={'self-start'}*/}
                    {/*        >*/}
                    {/*            {getTranslation('account.youtube.link')}*/}
                    {/*        </Button>*/}
                    {/*    }*/}
                    {/*</View>*/}

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.discord.title')}</Text>
                        <Text variant="body">{getTranslation('account.discord.description')}</Text>
                        {
                            account.data?.discordName &&
                            <>
                                <Text variant="label">{getTranslation('account.discord.channel')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="discord" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.discordName}</Text>
                                </View>

                                {
                                    account.data.discordInvitation &&
                                    <>
                                        <TouchableOpacity className="flex-row gap-2 items-center" onPress={() => openLink(`https://discord.gg/${account.data.discordInvitation}`)}>
                                            <FontAwesome5 name="link" size={14} color={theme.textNoteColor} />
                                            <Text variant="body">{`https://discord.gg/${account.data.discordInvitation}`}</Text>
                                        </TouchableOpacity>
                                    </>
                                }

                                {
                                    !account.data.discordInvitation &&
                                    <>
                                        <View className="flex-row gap-2 items-center">
                                            <Field
                                                className="w-60"
                                                placeholder={getTranslation('account.discord.placeholder.invitation')}
                                                value={discordInvitation}
                                                onChangeText={(text) => setDiscordInvitation(text)}
                                            />
                                            <Button onPress={() => updateDiscordInvitation(discordInvitation)}
                                                    className={'self-start mt-2'}
                                            >
                                                {getTranslation('account.discord.save')}
                                            </Button>
                                        </View>
                                        {discordInvitationError ? <Text className="text-red-700">{discordInvitationError}</Text> : null}
                                    </>
                                }

                                <Button onPress={() => unlinkDiscord()}
                                        className={'self-start mt-2'}
                                >
                                    {getTranslation('account.discord.unlink')}
                                </Button>
                            </>
                        }
                        {
                            !account.data?.discordName &&
                            <Button onPress={() => openLink(getDiscordLoginUrl())}
                                // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'self-start'}
                            >
                                {getTranslation('account.discord.link')}
                            </Button>
                        }
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.twitch.title')}</Text>
                        <Text variant="body">{getTranslation('account.twitch.description')}</Text>
                        {
                            account.data?.twitchChannel &&
                            <>
                                <Text variant="label">{getTranslation('account.twitch.channel')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="twitch" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.twitchChannel}</Text>
                                </View>
                                <Button onPress={() => unlinkTwitch()}
                                        className={'self-start mt-2'}
                                >
                                    {getTranslation('account.twitch.unlink')}
                                </Button>
                            </>
                        }
                        {
                            !account.data?.twitchChannel &&
                            <Button onPress={() => openLink(getTwitchLoginUrl())}
                                // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                    className={'self-start'}
                            >
                                {getTranslation('account.twitch.link')}
                            </Button>
                        }
                    </View>



                    <View className="gap-2">
                        <Text variant="header-sm"></Text>
                        <Button onPress={() => logout()}
                                className={'self-start'}
                        >
                            {getTranslation('account.action.logout')}
                        </Button>
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm"></Text>
                        <Button onPress={() => showDeleteDialog()}
                                className={'self-start'}

                        >
                            {getTranslation('account.action.delete')}
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
