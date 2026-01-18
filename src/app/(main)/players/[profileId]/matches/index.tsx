import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import MainMatches from '../(tabs)/main-matches';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { useProfile } from '@app/queries/all';
import NotFound from '@app/app/(main)/+not-found';
import { Header } from '@app/components/header';
import { HeaderTitle } from '@app/components/header-title';
import { LeaderboardsSelect } from '@app/components/select/leaderboards-select';
import { Skeleton } from '@app/components/skeleton';
import { useState } from 'react';
import { View } from 'react-native';

type UserPageParams = {
    profileId: string;
};

export default function Matches() {
    const showTabBar = useShowTabBar();
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = !Number.isInteger(Number(params.profileId)) ? NaN : Number(params.profileId);
    const { data: profile, isPending } = useProfile(profileId);
    const [leaderboardIds, setLeaderboardIds] = useState<string[]>([]);

    if (showTabBar) {
        return <Redirect href={`/players/${profileId}/main-profile`} />;
    }

    if ((!isPending && !profile) || isNaN(profileId)) {
        return <NotFound />;
    }

    return (
        <View className='py-4'>
            <Stack.Screen
                options={{
                    title: profile?.name ? 'Matches' : undefined,
                    headerTitle: () => <HeaderTitle title={profile?.name ?? true} subtitle={profile?.name ? 'Matches' : null} />,
                    header: (props) => <Header {...props} paramReplacements={{ profileId: profile?.name || null }} />,
                    headerRight: () =>
                        profile ? (
                            <LeaderboardsSelect leaderboardIdList={leaderboardIds} onLeaderboardIdChange={setLeaderboardIds} />
                        ) : (
                            <Skeleton alt className="w-48 h-11" />
                        ),
                }}
            />
            <MainMatches profile={profile} leaderboardIds={leaderboardIds} />
        </View>
    );
}
