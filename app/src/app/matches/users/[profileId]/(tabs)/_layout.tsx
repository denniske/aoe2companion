import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import { useLocalSearchParams, useNavigation, useRouter, withLayoutContext } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HeaderTitle } from '@app/components/header-title';
import { CountryImage } from '@app/view/components/country-image';
import { Country } from '@nex/data';
import { Text } from '@app/components/text';
import { useAccount, useAuthProfileId, useProfile, useProfileFast } from '@app/queries/all';
import { useFollowMutation } from '@app/mutations/follow';
import { useUnfollowMutation } from '@app/mutations/unfollow';
import Constants from 'expo-constants';
import { useColorScheme } from 'nativewind';
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
import { openLink } from '@app/helper/url';
import { FontAwesome5 } from '@expo/vector-icons';
import { createStylesheet } from '@app/theming-new';
import { useTournamentPlayer } from '@app/api/tournaments';
import { TournamentPlayerPopup } from '@app/view/tournaments/player-popup';
import { FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome';
import { MyText } from '@app/view/components/my-text';
import { Image } from 'expo-image';
import { getCountryName } from '@app/helper/flags';
import { useAppTheme } from '@app/theming';
import { MenuNew } from '@app/components/menu';
import { useTranslation } from '@app/helper/translate';

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
    const styles = useStyles();
    const [linkedProfilesVisible, setLinkedProfilesVisible] = useState(false);
    const theme = useAppTheme();

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
        if (account?.steamId) {
            if (Platform.OS === 'web') {
                if (confirm(getTranslation('main.profile.unlink.note'))) {
                    unlinkSteam();
                }
            } else {
                Alert.alert(
                    getTranslation('main.profile.unlink.title'),
                    getTranslation('main.profile.unlink.note'),
                    [
                        { text: getTranslation('main.profile.unlink.action.cancel'), style: 'cancel' },
                        { text: getTranslation('main.profile.unlink.action.reset'), onPress: unlinkSteam },
                    ],
                    { cancelable: false }
                );
            }
        } else {
            if (Platform.OS === 'web') {
                if (confirm(getTranslation('main.profile.reset.note'))) {
                    resetUser();
                }
            } else {
                Alert.alert(
                    getTranslation('main.profile.reset.title'),
                    getTranslation('main.profile.reset.note'),
                    [
                        { text: getTranslation('main.profile.reset.action.cancel'), style: 'cancel' },
                        { text: getTranslation('main.profile.reset.action.reset'), onPress: resetUser },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const unlinkSteam = async () => {
        unlinkSteamMutation.mutate();
        router.replace('/matches/users/select');
    };

    const resetUser = async () => {
        saveAccountMutation.mutate({ profileId: undefined });
        router.replace('/matches/users/select');
    };

    const [showTournamentPlayer, setShowTournamentPlayer] = useState(false);

    if (!profileId || !profile) {
        return null;
    }

    const steamProfileUrl = 'https://steamcommunity.com/profiles/' + profile?.steamId;
    const xboxProfileUrl = 'https://www.ageofempires.com/stats/?game=age2&profileId=' + profile?.profileId;

    const navigateToLinkedProfile = (profileId: number | undefined) => {
        setLinkedProfilesVisible(false);
        router.navigate(`/matches/users/${profileId}`);
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
                    <TouchableOpacity style={styles.menuButton} onPress={() => setShowTournamentPlayer(true)}>
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
                        <TouchableOpacity style={styles.menuButton} onPress={() => setLinkedProfilesVisible(true)}>
                            <Icon icon="family" color="brand" size={20} />
                        </TouchableOpacity>
                    }
                >
                    <View className="w-60">
                        <View className="gap-3">
                            {profile?.steamId && (
                                <>
                                    <Text variant="header-sm">Steam</Text>
                                    <TouchableOpacity className="flex-row gap-2 items-center" onPress={() => openLink(steamProfileUrl)}>
                                        <FontAwesome5 name="steam" size={14} color={theme.textNoteColor} />
                                        <Text variant="body">{profile?.steamId}</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {profileId && (
                                <>
                                    <Text variant="header-sm">ageofempires.com</Text>
                                    <TouchableOpacity className="flex-row gap-2 items-center" onPress={() => openLink(xboxProfileUrl)}>
                                        <FontAwesome5 name="xbox" size={14} color={theme.textNoteColor} />
                                        <Text variant="body">{profileId}</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {profileFull && profileFull.linkedProfiles && profileFull.linkedProfiles.length > 0 && (
                                <>
                                    <Text variant="header-sm">Linked Profiles</Text>

                                    {profileFull.linkedProfiles.map((linkedProfile) => {
                                        return (
                                            <TouchableOpacity
                                                key={linkedProfile.profileId}
                                                className="flex-row gap-1 items-center"
                                                onPress={() => navigateToLinkedProfile(linkedProfile.profileId)}
                                            >
                                                <CountryImage country={profileFull.verified ? profileFull?.country || linkedProfile.country : linkedProfile.country} />
                                                <Text variant="body">{linkedProfile.name}</Text>
                                                {linkedProfile.verified && (
                                                    <Icon
                                                        icon="check-circle"
                                                        color="brand"
                                                        size={14}
                                                        style={styles.verifiedIcon as FontAwesomeIconStyle}
                                                    />
                                                )}
                                                {!linkedProfile.verified && linkedProfile.shared && (
                                                    <Icon icon="family" color="brand" size={14} style={styles.verifiedIcon as FontAwesomeIconStyle} />
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
                                        <View className="flex-row items-center space-x-2">
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
                    style={styles.menuButton}
                    hitSlop={10}
                    onPress={followingThisUser ? () => unfollowMutation.mutate([profileId]) : () => followMutation.mutate([profileId])}
                >
                    <Icon prefix={followingThisUser ? 'fass' : 'fasr'} icon="heart" size={20} color="text-[#ef4444]" />
                </TouchableOpacity>
            </View>
        );
    }
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
        },
        menuButton: {
            // backgroundColor: 'blue',
            width: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        menuIcon: {
            color: theme.textNoteColor,
        },
        verifiedIcon: {
            marginLeft: 5,
            color: theme.linkColor,
        },
    } as const)
);

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
            iconComponent={<Image source={{ uri: profile?.avatarFullUrl }} style={{ width: 38, height: 38 }} className="rounded-full" />}
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
    const { colorScheme } = useColorScheme();
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
                <View className="bg-white dark:bg-blue-900 ">
                    <MaterialTopTabBar {...props} />
                </View>
            )}
            screenOptions={{
                lazy: false,
                swipeEnabled: true,
                tabBarInactiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
                tabBarActiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
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
