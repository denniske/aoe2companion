import PlayerList from '@app/view/components/player-list';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Text } from './text';
import { uniqBy } from 'lodash';
import { useAccount, useAuthProfileId, useProfileFast, useProfilesByProfileIds } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import { Link } from '@app/components/link';
import React from 'react';
import cn from 'classnames';
import { containerClassName } from '@app/styles';

export const FollowedPlayers = () => {
    const getTranslation = useTranslation();

    const authProfileId = useAuthProfileId();

    const { data: account, error, isLoading: isLoadingAccount } = useAccount();

    // console.log('followed players account', account?.followedPlayers.length);

    const { data: authProfile, isLoading: isLoadingAuthProfile, error: errorAuthProfile } = useProfileFast(authProfileId);
    const { data: followedProfiles, isLoading: isLoadingFollowedProfiles, error: errorFollowedProfiles } = useProfilesByProfileIds(
        account?.followedPlayers.map((f) => f.profileId)
    );

    // console.log('account.profileId', account?.profileId);
    // console.log('authProfileId', authProfileId);
    // console.log('authProfile', authProfile);

    const isLoading = isLoadingAccount || isLoadingAuthProfile || isLoadingFollowedProfiles ||
                      !!error || !!errorAuthProfile || !!errorFollowedProfiles;
    const profileIdList = isLoading ? ['loading', 'loading'] : [authProfileId ? authProfile! : 'select', ...(followedProfiles || []), 'follow'];

    return (
        <View className="gap-2">
            <View className={cn("flex-row justify-between items-center", containerClassName)}>
                <Text variant="header-lg">
                    {getTranslation('home.followedplayers')}
                </Text>
                <Link href="/matches/live/following">Open Following Dashboard</Link>
            </View>
            <PlayerList
                variant="horizontal"
                showsHorizontalScrollIndicator={false}
                list={profileIdList as any}
                selectedUser={(user) => router.navigate(`/players/${user.profileId}`)}
            />
        </View>
    );
};
