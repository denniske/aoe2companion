import PlayerList from '@app/view/components/player-list';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Text } from './text';
import { uniqBy } from 'lodash';
import { useAccount, useAuthProfileId, useProfileFast, useProfiles } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import { Link } from '@app/components/link';
import React from 'react';

export const FollowedPlayers = () => {
    const getTranslation = useTranslation();

    const authProfileId = useAuthProfileId();

    const { data: account, error, isLoading: isLoadingAccount } = useAccount();

    // console.log('followed players account', account?.followedPlayers.length);

    const { data: authProfile, isLoading: isLoadingAuthProfile } = useProfileFast(authProfileId);
    const { data: followedProfiles, isLoading: isLoadingFollowedProfiles } = useProfiles(
        account?.followedPlayers.map((f) => f.profileId)
    );

    // console.log('account.profileId', account?.profileId);
    // console.log('authProfileId', authProfileId);
    // console.log('authProfile', authProfile);

    const isLoading = isLoadingAccount || isLoadingAuthProfile || isLoadingFollowedProfiles;
    const profileIdList = isLoading ? ['loading', 'loading'] : [authProfileId ? authProfile! : 'select', ...(followedProfiles || []), 'follow'];

    return (
        <View className="gap-2">
            <View className="flex-row justify-between items-center px-4">
                <Text variant="header-lg">
                    {getTranslation('home.followedplayers')}
                </Text>
                <Link href="/matches/current-following">Open Following Dashboard</Link>
            </View>
            <PlayerList
                footer={(player) => {
                    return (
                        <Text color="subtle" variant="body-xs" numberOfLines={1} allowFontScaling={false}>
                            {player?.games} Games
                        </Text>
                    );
                }}
                variant="horizontal"
                showsHorizontalScrollIndicator={false}
                list={profileIdList as any}
                selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}?name=${user.name}&country=${user.country}`)}
            />
        </View>
    );
};
