import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import { useLocalSearchParams, useNavigation, useRouter, withLayoutContext } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { HeaderTitle } from '@app/components/header-title';
import { CountryImage } from '@app/view/components/country-image';
import { Country } from '@nex/data';
import { Text } from '@app/components/text';
import { useAccount, useAuthProfileId, useProfile, useProfileFast } from '@app/queries/all';
import { useFollowMutation } from '@app/mutations/follow';
import { useUnfollowMutation } from '@app/mutations/unfollow';
import Constants from 'expo-constants';
import { TabBarLabel } from '@app/view/components/tab-bar-label';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useUnlinkSteamMutation } from '@app/mutations/unlink-steam';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabBar,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { useTournamentPlayer } from '@app/api/tournaments';
import { TournamentPlayerPopup } from '@app/view/tournaments/player-popup';
import { MyText } from '@app/view/components/my-text';
import { Image } from '@/src/components/uniwind/image';
import { getCountryName } from '@app/helper/flags';
import { MenuNew } from '@app/components/menu';
import { useTranslation } from '@app/helper/translate';
import { showAlert } from '@app/helper/alert';
import { useUniwind } from 'uniwind';
import { LinkedAoEAccount, LinkedAoECompanionAccount, LinkedPlatformAccount } from '@app/components/linked-account';
import cn from 'classnames';
import { containerScrollClassName } from '@app/styles';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

interface UserMenuProps {
    profile?: IProfilesResultProfile;
}

// Due to some bug in expo-router we cannot use useLocalSearchParams
// so we need to pass the params as a prop
export function UserMenu({ profile }: UserMenuProps) {
    const getTranslation = useTranslation();
    const profileId = profile?.profileId;
    const authProfileId = useAuthProfileId();
    const [linkedProfilesVisible, setLinkedProfilesVisible] = useState(false);

    const { data: account } = useAccount();

    const followingThisUser = !!account?.followedPlayers.find((f) => f.profileId === profileId);

    const followMutation = useFollowMutation();
    const unfollowMutation = useUnfollowMutation();

    const saveAccountMutation = useSaveAccountMutation();
    const unlinkSteamMutation = useUnlinkSteamMutation();

    const router = useRouter();

    const { data: liquipediaProfile } = useTournamentPlayer(profile?.socialLiquipedia);

    const { data: profileFull } = useProfile(profileId!);

    const showResetOrUnlinkDialog = () => {
        if (account?.steamId || account?.authRelicId) {
            showAlert(
                getTranslation('main.profile.unlink.title'),
                getTranslation('main.profile.unlink.note'),
                [
                    { text: getTranslation('main.profile.unlink.action.cancel'), style: 'cancel' },
                    { text: getTranslation('main.profile.unlink.action.reset'), onPress: unlinkSteam },
                ],
                { cancelable: false }
            );
        } else {
            showAlert(
                getTranslation('main.profile.reset.title'),
                getTranslation('main.profile.reset.note'),
                [
                    { text: getTranslation('main.profile.reset.action.cancel'), style: 'cancel' },
                    { text: getTranslation('main.profile.reset.action.reset'), onPress: resetUser },
                ],
                { cancelable: false }
            );
        }
    };

    const unlinkSteam = async () => {
        unlinkSteamMutation.mutate();
        router.replace('/matches/users/select');
    };

    const resetUser = async () => {
        saveAccountMutation.mutate({ profileId: null });
        router.replace('/matches/users/select');
    };

    const [showTournamentPlayer, setShowTournamentPlayer] = useState(false);

    if (!profileId || !profile) {
        return null;
    }

    const navigateToLinkedProfile = (profileId: number | undefined) => {
        setLinkedProfilesVisible(false);
        router.navigate(`/matches/users/${profileId}` as any);
    };

    if (profileId === authProfileId) {
        return (
            <TouchableOpacity onPress={showResetOrUnlinkDialog}>
                <Icon icon="user-times" size={20} color="subtle" />
            </TouchableOpacity>
        );
    } else {
        return (
            <View className="flex flex-row gap-2">
                {liquipediaProfile && (
                    <TournamentPlayerPopup
                        id={liquipediaProfile.name}
                        title={liquipediaProfile.name}
                        isActive={showTournamentPlayer}
                        onClose={() => setShowTournamentPlayer(false)}
                    />
                )}

                {profile.verified && (
                    <TouchableOpacity className="w-8 items-center justify-center"onPress={() => setShowTournamentPlayer(true)}>
                        <Icon icon="check-circle" color="brand" size={20} />
                        {/*<FontAwesome5 style={styles.menuIcon} name="check-circle" color="brand" size={20} />*/}
                    </TouchableOpacity>
                )}

                <MenuNew
                    contentStyle={{
                        padding: 15,
                        paddingTop: 15,
                        paddingBottom: 15,
                        marginTop: 30,
                        left: 'auto',
                    }}
                    visible={linkedProfilesVisible}
                    onDismiss={() => setLinkedProfilesVisible(false)}
                    anchor={
                        <TouchableOpacity className="w-8 items-center justify-center" onPress={() => setLinkedProfilesVisible(true)}>
                            <Icon icon="family" color="brand" size={20} />
                        </TouchableOpacity>
                    }
                >
                    <View className="w-60">
                        <View className="gap-3">
                            {profile?.steamId && profile?.platform && (
                                <LinkedPlatformAccount
                                    steamId={profile?.steamId}
                                    platform={profile?.platform}
                                />
                            )}
                            {profileId && <LinkedAoEAccount profileId={profileId} />}
                            {profileId && <LinkedAoECompanionAccount profileId={profileId} />}

                            {profileFull && profileFull.linkedProfiles && profileFull.linkedProfiles.length > 0 && (
                                <>
                                    <Text variant="header-sm">Linked Profiles</Text>

                                    {profileFull.linkedProfiles.map((linkedProfile) => {
                                        return (
                                            <TouchableOpacity
                                                key={linkedProfile.profileId}
                                                className="flex-row gap-2 items-center"
                                                onPress={() => navigateToLinkedProfile(linkedProfile.profileId)}
                                            >
                                                <Image source={{ uri: linkedProfile.avatarMediumUrl }} className="w-5 h-5 rounded-full" />
                                                <Text variant="body">{linkedProfile.name}</Text>
                                                {linkedProfile.verified && (
                                                    <Icon
                                                        icon="check-circle"
                                                        color="brand"
                                                        size={14}
                                                    />
                                                )}
                                                {!linkedProfile.verified && linkedProfile.shared && (
                                                    <Icon icon="family" color="brand" size={14} />
                                                )}
                                                {!!linkedProfile.clan && (
                                                    <MyText>
                                                        {' '}
                                                        ({getTranslation('main.profile.clan')}: {linkedProfile.clan})
                                                    </MyText>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}

                                    {!profileFull?.verified && profileFull?.shared && (
                                        <View className="flex-row items-center gap-x-2">
                                            <Icon icon="family" color="brand" size={14} />
                                            <MyText>{getTranslation('main.profile.steamfamilysharing')}</MyText>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                </MenuNew>

                <TouchableOpacity
                    className="w-8 items-center justify-center"
                    hitSlop={10}
                    onPress={followingThisUser ? () => unfollowMutation.mutate([profileId]) : () => followMutation.mutate([profileId])}
                >
                    <Icon prefix={followingThisUser ? 'fass' : 'fasr'} icon="heart" size={20} color="accent-[#ef4444]" />
                </TouchableOpacity>
            </View>
        );
    }
}

type UserPageParams = {
    profileId: string;
};

function UserTitle({ profile }: UserMenuProps) {
    const getTranslation = useTranslation();

    if (!profile) {
        return <View />;
    }

    return (
        <HeaderTitle
            iconComponent={<Image source={{ uri: profile?.avatarFullUrl }} className="rounded-full w-[38px] h-[38px]" />}
            title={profile?.name || ''}
            subtitle={
                <>
                    <CountryImage style={{ fontSize: 14 }} country={profile?.country} />
                    <MyText> {getCountryName(profile.country as Country)}</MyText>
                    <MyText>{profile.clan ? ', ' + getTranslation('main.profile.clan') + ' ' + profile.clan : ''}</MyText>
                </>
            }
        />
    );
}

// isVerified &&
// !isMainAccount && (
//     <Text variant="label" numberOfLines={1} allowFontScaling={false}>
//         <Link href={`/matches/users/${verifiedPlayer?.platforms.rl?.[0]}`}>
//             {verifiedPlayer?.name}
//         </Link>{' '}
//         - Alternate account
//     </Text>
// )

export default function UserPage() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = parseInt(params.profileId);
    const appName = Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name;
    const { theme } = useUniwind();
    const navigation = useNavigation();

    const { data: profile } = useProfileFast(profileId);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <UserTitle profile={profile} />,
            headerRight: () => <UserMenu profile={profile} />,
        });
    }, [profile]);

    // console.log('PROFILE LAYOUT', profileId);

    return (
        <MaterialTopTabs
            tabBar={(props) => (
                <View className={cn('bg-white dark:bg-blue-900', containerScrollClassName)}>
                    <MaterialTopTabBar {...props} />
                </View>
            )}
            screenOptions={{
                lazy: Platform.OS === 'web', // on web we need lazy so it will not break flatlist and infinitely loops
                swipeEnabled: true,
                tabBarInactiveTintColor: theme === 'dark' ? 'white' : 'black',
                tabBarActiveTintColor: theme === 'dark' ? 'white' : 'black',
            }}
        >
            <MaterialTopTabs.Screen
                name="main-profile"
                initialParams={{ profileId }}
                options={{
                    title: appName,
                    tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.profile')} />,
                }}
            />
            <MaterialTopTabs.Screen
                name="main-stats"
                initialParams={{ profileId }}
                options={{
                    title: appName,
                    tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.stats')} />,
                }}
            />
            <MaterialTopTabs.Screen
                name="main-matches"
                initialParams={{ profileId }}
                options={{
                    title: appName,
                    tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.matches')} />,
                }}
            />
        </MaterialTopTabs>
    );
}
