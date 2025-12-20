import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import { createStylesheet } from '../../theming-new';
import { router, Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import useAuth from '@/data/src/hooks/use-auth';
import Login from '@app/components/login';
import { openLink } from '@app/helper/url';
import { useAppTheme } from '@app/theming';
import {
    accountDelete,
    accountDiscordInvitation,
    accountRelicVerify,
    accountUnlinkDiscord,
    accountUnlinkPatreon,
    accountUnlinkSteam,
    accountUnlinkTwitch,
    accountUnlinkYoutube,
} from '@app/api/account';
import { supabaseClient } from '@/data/src/helper/supabase';
import { useAccount, useAuthProfileId, useProfileFast } from '@app/queries/all';
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
import { useTwitchAuth } from '@app/helper/oauth/twitch';
import { useYoutubeAuth } from '@app/helper/oauth/youtube';
import { useDiscordAuth } from '@app/helper/oauth/discord';
import { usePatreonAuth } from '@app/helper/oauth/patreon';
import { useSteamAuth } from '@app/helper/oauth/steam';
import { useXboxAuth } from '@app/helper/oauth/xbox';
import { LinkedAoEAccount, LinkedPlatformAccount } from '@app/components/linked-account';

export default function AccountPage() {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const theme = useAppTheme();

    const user = useAuth();
    const account = useAccount();
    const loggedIn = user && !user.is_anonymous && account.data;

    const saveAccountMutation = useSaveAccountMutation();

    const [relicVerification, setRelicVerification] = useState(false);
    const [discordInvitation, setDiscordInvitation] = useState('https://discord.gg/gCunWKx');
    const [discordInvitationError, setDiscordInvitationError] = useState('');

    const authProfileId = useAuthProfileId();
    const { data: authProfile } = useProfileFast(authProfileId);

    const {
        data: relicVerificationData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['accountRelicVerify'],
        queryFn: accountRelicVerify,
        enabled: relicVerification,
        refetchInterval: relicVerification ? 10000 : false, // poll every 10s
    });

    const patreonPromptAsync = usePatreonAuth();
    const youtubePromptAsync = useYoutubeAuth();
    const twitchPromptAsync = useTwitchAuth();
    const discordPromptAsync = useDiscordAuth();
    const steamPromptAsync = useSteamAuth();
    const xboxPromptAsync = useXboxAuth();

    useEffect(() => {
        if (relicVerificationData?.verified) {
            setRelicVerification(false);
            account.refetch();
        }
    }, [relicVerificationData?.verified]);

    // console.log('account', account?.data);
    // console.log('accountId', account.data?.accountId);

    const toggleSharedHistory = async () => {
        saveAccountMutation.mutate({
            sharedHistory: !account?.data?.sharedHistory, // React compiler bug workaround https://github.com/facebook/react/issues/31205
        });
    };

    const unlinkSteam = async () => {
        await accountUnlinkSteam();
        await account.refetch();
    };

    const unlinkPatreon = async () => {
        await accountUnlinkPatreon();
        await account.refetch();
    };

    const unlinkYoutube = async () => {
        await accountUnlinkYoutube();
        await account.refetch();
    };

    const unlinkDiscord = async () => {
        await accountUnlinkDiscord();
        await account.refetch();
    };

    const unlinkTwitch = async () => {
        await accountUnlinkTwitch();
        await account.refetch();
    };

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

    const deleteAccount = async () => {
        console.log('deleteAccount');

        await accountDelete();
        await account.logout();
    };

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

    const linkedGameAccount = Boolean(account.data?.steamId || account.data?.authRelicId);

    return (
        <ScrollView contentContainerClassName="min-h-full p-5">
            <Stack.Screen options={{ title: !loggedIn ? getTranslation('login.signin') : getTranslation('account.title') }} />

            {!loggedIn && (
                <View className="max-w-2xl mx-auto w-full gap-4">
                    <Text variant="body-lg" align="center">
                        An account lets you follow players and save your favorites. Your information syncs automatically across devices.
                    </Text>
                    <Login />
                </View>
            )}

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
                        {account.data?.patreonId && (
                            <>
                                <Text variant="label">{getTranslation('account.patreon.membershipstatus')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="heart" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{getTranslation('account.patreon.freestatus')}</Text>
                                </View>
                                <Button onPress={() => unlinkPatreon()} className={'self-start mt-2'}>
                                    {getTranslation('account.patreon.unlink')}
                                </Button>
                            </>
                        )}
                        {!account.data?.patreonId && (
                            <Button onPress={() => patreonPromptAsync()} className={'self-start'}>
                                {getTranslation('account.patreon.link')}
                            </Button>
                        )}
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.link.title')}</Text>

                        <Text variant="body">{getTranslation('account.link.description')}</Text>

                        {!linkedGameAccount && (
                            <Button
                                onPress={() => steamPromptAsync()}
                                // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                className={'self-start'}
                            >
                                {getTranslation('account.steam.link')}
                            </Button>
                        )}

                        {!linkedGameAccount && (
                            <Button
                                onPress={() => xboxPromptAsync()}
                                // icon={()=><FontAwesome5 name="xbox" size={14} color={theme.backgroundColor} />}
                                className={'self-start'}
                            >
                                {getTranslation('account.xbox.link')}
                            </Button>
                        )}

                        {!linkedGameAccount && Platform.OS !== 'web' && (
                            <Button
                                href="/more/oauth/psn"
                                // icon={()=><FontAwesome5 name="psn" size={14} color={theme.backgroundColor} />}
                                className={'self-start'}
                            >
                                {getTranslation('account.psn.link')}
                            </Button>
                        )}

                        <Text variant="body">{getTranslation('account.link.description2')}</Text>

                        {relicVerification && (
                            <>
                                <Text variant="body">{getTranslation('account.relic.link.description')}</Text>
                                <View className="flex-row gap-2">
                                    <Text variant="body">{getTranslation('account.relic.link.token', { token: relicVerificationData?.token })}</Text>
                                    <ActivityIndicator animating size="small" color="#999" />
                                </View>
                                <Text variant="body" className="text-sm">
                                    {getTranslation('account.relic.link.note')}
                                </Text>
                            </>
                        )}

                        {!linkedGameAccount && (
                            <Button onPress={() => setRelicVerification((prev) => !prev)} className={'self-start'}>
                                {!relicVerification ? getTranslation('account.relic.link') : getTranslation('account.relic.cancel')}
                            </Button>
                        )}

                        {account.data?.steamId && authProfile?.platform && (
                            <LinkedPlatformAccount steamId={account.data.steamId} platform={authProfile.platform} />
                        )}
                        {account.data?.authRelicId && <LinkedAoEAccount profileId={account.data.authRelicId} />}

                        {(account.data?.steamId || account.data?.authRelicId) && (
                            <>
                                <Button onPress={() => unlinkSteam()} className={'self-start mt-2'}>
                                    {getTranslation('account.steam.unlink')}
                                </Button>
                            </>
                        )}
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
                    {/*    {account.data?.youtubeChannelName && (*/}
                    {/*        <>*/}
                    {/*            <Text variant="label">{getTranslation('account.youtube.channel')}</Text>*/}
                    {/*            <View className="flex-row gap-2 items-center">*/}
                    {/*                <FontAwesome5 name="youtube" size={14} color={theme.textNoteColor} />*/}
                    {/*                <Text variant="body">{account.data.youtubeChannelName}</Text>*/}
                    {/*            </View>*/}
                    {/*            <Button onPress={() => unlinkYoutube()} className={'self-start mt-2'}>*/}
                    {/*                {getTranslation('account.youtube.unlink')}*/}
                    {/*            </Button>*/}
                    {/*        </>*/}
                    {/*    )}*/}
                    {/*    {!account.data?.youtubeChannelName && (*/}
                    {/*        <Button*/}
                    {/*            onPress={() => youtubePromptAsync()}*/}
                    {/*            // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}*/}
                    {/*            className={'self-start'}*/}
                    {/*        >*/}
                    {/*            {getTranslation('account.youtube.link')}*/}
                    {/*        </Button>*/}
                    {/*    )}*/}
                    {/*</View>*/}

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.discord.title')}</Text>
                        <Text variant="body">{getTranslation('account.discord.description')}</Text>
                        {account.data?.discordName && (
                            <>
                                <Text variant="label">{getTranslation('account.discord.channel')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="discord" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.discordName}</Text>
                                </View>

                                {account.data.discordInvitation && (
                                    <>
                                        <TouchableOpacity
                                            className="flex-row gap-2 items-center"
                                            onPress={() => openLink(`https://discord.gg/${account.data.discordInvitation}`)}
                                        >
                                            <FontAwesome5 name="link" size={14} color={theme.textNoteColor} />
                                            <Text variant="body">{`https://discord.gg/${account.data.discordInvitation}`}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {!account.data.discordInvitation && (
                                    <>
                                        <View className="flex-row gap-2 items-center">
                                            <Field
                                                className="w-60"
                                                placeholder={getTranslation('account.discord.placeholder.invitation')}
                                                value={discordInvitation}
                                                onChangeText={(text) => setDiscordInvitation(text)}
                                            />
                                            <Button onPress={() => updateDiscordInvitation(discordInvitation)} className={'self-start mt-2'}>
                                                {getTranslation('account.discord.save')}
                                            </Button>
                                        </View>
                                        {discordInvitationError ? <Text className="text-red-700">{discordInvitationError}</Text> : null}
                                    </>
                                )}

                                <Button onPress={() => unlinkDiscord()} className={'self-start mt-2'}>
                                    {getTranslation('account.discord.unlink')}
                                </Button>
                            </>
                        )}
                        {!account.data?.discordName && (
                            <Button
                                onPress={() => discordPromptAsync()}
                                // icon={()=><FontAwesome5 name="steam" size={14} color={theme.backgroundColor} />}
                                className={'self-start'}
                            >
                                {getTranslation('account.discord.link')}
                            </Button>
                        )}
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm">{getTranslation('account.twitch.title')}</Text>
                        <Text variant="body">{getTranslation('account.twitch.description')}</Text>
                        {account.data?.twitchChannel && (
                            <>
                                <Text variant="label">{getTranslation('account.twitch.channel')}</Text>
                                <View className="flex-row gap-2 items-center">
                                    <FontAwesome5 name="twitch" size={14} color={theme.textNoteColor} />
                                    <Text variant="body">{account.data.twitchChannel}</Text>
                                </View>
                                <Button onPress={() => unlinkTwitch()} className={'self-start mt-2'}>
                                    {getTranslation('account.twitch.unlink')}
                                </Button>
                            </>
                        )}
                        {!account.data?.twitchChannel && (
                            <Button onPress={() => twitchPromptAsync()} className={'self-start'}>
                                {getTranslation('account.twitch.link')}
                            </Button>
                        )}
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm"></Text>
                        <Button onPress={() => account.logout()} className={'self-start'}>
                            {getTranslation('account.action.logout')}
                        </Button>
                    </View>

                    <View className="gap-2">
                        <Text variant="header-sm"></Text>
                        <Button onPress={() => showDeleteDialog()} className={'self-start'}>
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
