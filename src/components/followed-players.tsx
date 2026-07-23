import PlayerList from '@app/view/components/player-list';
import { View } from 'react-native';
import { Text } from './text';
import { profileFastQueryOptions, profilesByProfileIdsQueryOptions, useAccountSuspense } from '@app/queries/all';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useTranslation } from '@app/helper/translate';
import { Link } from '@app/components/link';
import React from 'react';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { UserLoginWrapper } from './user-login-wrapper';
import { QueryBoundary } from '@app/components/query-boundary';
import { IProfilesResultProfile } from '@app/api/helper/api.types';

type ProfileIdListStr = 'select' | 'follow' | 'loading';

const FollowedPlayersList = ({ list }: { list?: (ProfileIdListStr | IProfilesResultProfile)[] }) => (
    <PlayerList variant="horizontal" showsHorizontalScrollIndicator={false} list={list || ['loading', 'loading']} />
);

const FollowedPlayersSection = () => {
    const { data: account } = useAccountSuspense();

    const authProfileId = account.profileId;
    const language = account.language;
    const followedIds = account.followedPlayers.map((f) => f.profileId);

    const [{ data: authProfile }, { data: followedProfiles }] = useSuspenseQueries({
        queries: [profileFastQueryOptions(authProfileId, language), profilesByProfileIdsQueryOptions(followedIds, language)],
    });

    const profileIdList = [authProfileId ? authProfile! : 'select', ...followedProfiles, 'follow'];

    return <FollowedPlayersList list={profileIdList as any} />;
};

export const FollowedPlayers = () => {
    const getTranslation = useTranslation();

    return (
        <View className="gap-2">
            <View className={cn('flex-row justify-between items-center', containerClassName)}>
                <Text variant="header-lg">{getTranslation('home.followedplayers')}</Text>
                <UserLoginWrapper Component={Link} href="/matches/live/following">
                    Open Following Dashboard
                </UserLoginWrapper>
            </View>
            <QueryBoundary loadingFallback={<FollowedPlayersList />} errorFallback={() => <FollowedPlayersList />}>
                <FollowedPlayersSection />
            </QueryBoundary>
        </View>
    );
};
