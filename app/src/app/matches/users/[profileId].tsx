import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';
import { fetchProfiles } from '../../../api/helper/api';
import { getTranslation } from '../../../helper/translate';
import { useSelector } from '../../../redux/reducer';
import { HeaderTitle } from '@app/components/header-title';
import { CountryImage } from '../../../view/components/country-image';
import { getVerifiedPlayer, isVerifiedPlayer } from '@nex/data';
import { Text } from '@app/components/text';
import { Link } from '@app/components/link';
import { useAccount, useAuthProfileId } from '@app/queries/all';
import { useQuery } from '@tanstack/react-query';
import { useFollowMutation } from '@app/mutations/follow';
import { useUnfollowMutation } from '@app/mutations/unfollow';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs';
import Constants from 'expo-constants';
import { useColorScheme } from 'nativewind';
import { TabBarLabel } from '@app/view/components/tab-bar-label';
import MainProfile from '@app/view/main/main-profile';
import MainStats from '@app/view/main/main-stats';
import MainMatches from '@app/view/main/main-matches';
import { useProfileFast } from '@app/queries/all';

interface UserMenuProps {
    profile?: IProfilesResultProfile;
}

// Due to some bug in expo-router we cannot use useLocalSearchParams
// so we need to pass the params as a prop
export function UserMenu({ profile }: UserMenuProps) {
    const profileId = profile?.profileId;
    const authProfileId = useAuthProfileId();

    const { data: account } = useAccount();
    console.log('account?.followedPlayers', account?.followedPlayers);

    const followingThisUser = !!account?.followedPlayers.find((f) => f.profileId === profileId);

    const followMutation = useFollowMutation();
    const unfollowMutation = useUnfollowMutation();

    // Reset country for use in leaderboard country dropdown
    // useEffect(() => {
    //     if (auth == null) {
    //         mutate(setPrefValue('country', undefined));
    //         mutate(setPrefValue('clan', undefined));
    //         saveCurrentPrefsToStorage();
    //     }
    // }, [auth]);

    const deleteUser = () => {
        if (account?.steamId) {
            if (Platform.OS === 'web') {
                if (confirm('Do you really want to unlink your steam account?')) {
                    doUnlinkSteam();
                }
            } else {
                Alert.alert(
                    getTranslation('main.profile.reset.title'),
                    getTranslation('main.profile.reset.note'),
                    [
                        { text: getTranslation('main.profile.reset.action.cancel'), style: 'cancel' },
                        { text: getTranslation('main.profile.reset.action.reset'), onPress: doUnlinkSteam },
                    ],
                    { cancelable: false }
                );
            }
        } else {
            if (Platform.OS === 'web') {
                if (confirm('Do you want to reset me page?')) {
                    doDeleteUser();
                }
            } else {
                Alert.alert(
                    getTranslation('main.profile.reset.title'),
                    getTranslation('main.profile.reset.note'),
                    [
                        { text: getTranslation('main.profile.reset.action.cancel'), style: 'cancel' },
                        { text: getTranslation('main.profile.reset.action.reset'), onPress: doDeleteUser },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const doUnlinkSteam = async () => {
        // await clearSettingsInStorage();
        // mutate(setAuth(null));
        // router.replace('/matches/users/select');
        // setAccountProfile(account.id, { profile_id: null, steam_id: null });
    };

    const doDeleteUser = async () => {
        // await clearSettingsInStorage();
        // mutate(setAuth(null));
        // router.replace('/matches/users/select');
        // setAccountProfile(account.id, { profile_id: null, steam_id: null });
    };

    if (!profileId) {
        return null;
    }

    if (profileId === authProfileId) {
        return (
            <TouchableOpacity onPress={deleteUser}>
                <Icon icon="user-times" size={20} color="subtle" />
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity hitSlop={10} onPress={followingThisUser ? () => unfollowMutation.mutate(profileId) : () => followMutation.mutate(profileId)}>
                <Icon prefix={followingThisUser ? 'fass' : 'fasr'} icon="heart" size={20} color="text-[#ef4444]" />
            </TouchableOpacity>
        );
    }
}

const Tab = createMaterialTopTabNavigator();

type UserPageParams = {
    profileId: string;
}

function UserTitle({ profile }: UserMenuProps) {
    const profileId = profile?.profileId;
    const isVerified = profileId ? isVerifiedPlayer(profileId) : false;
    const verifiedPlayer = profileId ? getVerifiedPlayer(profileId) : null;
    const isMainAccount = verifiedPlayer?.platforms.rl?.[0] === profileId;
    return (
        <HeaderTitle
            iconComponent={
                <CountryImage
                    style={{ fontSize: 21 }}
                    country={verifiedPlayer?.country || profile?.country}
                />
            }
            title={profile?.name || name || ''}
            subtitle={
                isVerified &&
                !isMainAccount && (
                    <Text variant="label" numberOfLines={1} allowFontScaling={false}>
                        <Link href={`/matches/users/${verifiedPlayer?.platforms.rl?.[0]}`}>
                            {verifiedPlayer?.name}
                        </Link>{' '}
                        - Alternate account
                    </Text>
                )
            }
        />
    );
}

export default function UserPage() {
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = parseInt(params.profileId);
    const appName = Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name;
    const { colorScheme } = useColorScheme();
    const { tab } = useLocalSearchParams<{ tab: string }>();
    const navigation = useNavigation();

    useEffect(() => {
        if (!tab) return;
        setTimeout(() => {
            navigation.navigate(tab as never);
        });
    }, [tab]);

    const { data: profile } = useProfileFast(profileId);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <UserTitle profile={profile} />,
            headerRight: () => <UserMenu profile={profile} />,
        });
    }, [profile]);

    return (
        <Tab.Navigator
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
            <Tab.Screen
                name="MainProfile"
                options={{ title: appName, tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.profile')} /> }}
            >
                {() => <MainProfile profileId={profileId} />}
            </Tab.Screen>
            <Tab.Screen
                name="MainStats"
                options={{ title: appName, tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.stats')} /> }}
            >
                {() => <MainStats profileId={profileId} />}
            </Tab.Screen>
            <Tab.Screen
                name="MainMatches"
                options={{ title: appName, tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.matches')} /> }}
            >
                {() => <MainMatches profileId={profileId} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
