import { IProfilesResult, IProfilesResultProfile } from '@app/api/helper/api.types';
import { Icon } from '@app/components/icon';
import Search from '@app/view/components/search';
import { MainPageInner } from '@app/view/main.page';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';

import { setAccountProfile } from '../../../api/following';
import { fetchProfiles } from '../../../api/helper/api';
import { getTranslation } from '../../../helper/translate';
import { setAuth, setFollowing, setPrefValue, useMutate, useSelector } from '../../../redux/reducer';
import { clearSettingsInStorage, saveCurrentPrefsToStorage, saveAuthToStorage } from '../../../service/storage';
import { HeaderTitle } from '@app/components/header-title';
import { CountryImage } from '../../../view/components/country-image';
import { getVerifiedPlayer, isVerifiedPlayer } from '@nex/data';
import { Text } from '@app/components/text';
import { Link } from '@app/components/link';
import { QUERY_KEY_ACCOUNT, useAccount } from '@app/app/_layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followV2, IAccount, saveAccountThrottled, unfollowV2 } from '@app/api/account';
import produce from 'immer';
import { useFollowMutation } from '@app/mutations/follow';
import { useUnfollowMutation } from '@app/mutations/unfollow';

interface UserMenuProps {
    profileId: number;
}

// Due to some bug in expo-router we cannot use useLocalSearchParams
// so we need to pass the params as a prop
export function UserMenu({ profileId }: UserMenuProps) {
    const auth = useSelector((state) => state.auth!);

    const { data: account } = useAccount();
    const followingThisUser = !!account?.followedPlayers.find((f) => f.profileId === profileId);

    const followMutation = useFollowMutation();
    const unfollowMutation = useUnfollowMutation();

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

    if (!profile) {
        return null;
    }

    if (Number(profileId) === Number(auth?.profileId)) {
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

type UserPageParams = {
    profileId: string;
    name?: string;
    country?: string
}

export default function UserPage() {
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = Number(params.profileId ?? 0);
    const name = params.name;
    const country = params.country;

    const mutate = useMutate();
    const [loadedProfile, setLoadedProfile] = useState<IProfilesResultProfile>();
    const auth = useSelector((state) => state.auth);
    const account = useSelector((state) => state.account);
    const isVerified = isVerifiedPlayer(profileId);
    const verified = getVerifiedPlayer(profileId);
    const isMainAccount = verified?.platforms.rl?.[0] === params.profileId;

    const onSelect = async (user: any) => {
        await saveAuthToStorage({
            profileId: user.profileId,
        });
        mutate(setAuth(user));
        setAccountProfile(account.id, { profile_id: user.profileId!, steam_id: user.steamId });
    };

    // Reset country for use in leaderboard country dropdown
    useEffect(() => {
        if (auth == null) {
            mutate(setPrefValue('country', undefined));
            mutate(setPrefValue('clan', undefined));
            saveCurrentPrefsToStorage();
        }
    }, [auth]);

    const navigateToAuthUser = async () => {
        console.log('==> NAVIGATE');
        // @ts-ignore
        router.navigate(`/matches/users/${auth?.profileId}`);
        console.log('==> NAVIGATED');
    };

    useEffect(() => {
        if (auth != null && profileId == null) {
            navigateToAuthUser();
        }
    }, [auth]);

    const completeUserIdInfo = async () => {
        const loaded = await fetchProfiles({ profileId });
        if (loaded) {
            setLoadedProfile(loaded.profiles[0]);
        }
    };

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HeaderTitle
                    iconComponent={
                        <CountryImage
                            style={{ fontSize: 21 }}
                            country={getVerifiedPlayer(profileId)?.country || loadedProfile?.country || country}
                        />
                    }
                    title={loadedProfile?.name || name || ''}
                    subtitle={
                        isVerified &&
                        !isMainAccount && (
                            <Text variant="label" numberOfLines={1} allowFontScaling={false}>
                                <Link href={`/matches/users/${getVerifiedPlayer(profileId)?.platforms.rl?.[0]}`}>
                                    {getVerifiedPlayer(profileId)?.name}
                                </Link>{' '}
                                - Alternate account
                            </Text>
                        )
                    }
                />
            ),
            headerRight: () => <UserMenu profileId={profileId} />,
        });
    }, [navigation, loadedProfile, isVerified, isMainAccount, country, name]);

    useEffect(() => {
        completeUserIdInfo();
    }, [profileId]);

    if (profileId) {
        return <MainPageInner profileId={profileId} />;
    }

    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');
    console.log('NO AUTH IN PROFILE PAGE');

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return null;
}
