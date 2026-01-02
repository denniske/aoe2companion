import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import MainMatches from './(tabs)/main-matches';
import { useAccount, useAuthProfileId, useProfile, useProfileFast } from '@app/queries/all';
import { useState } from 'react';
import { UserMenu, UserTitle } from './(tabs)/_layout';
import { LeaderboardsSelect } from '@app/components/select/leaderboards-select';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { ScrollView } from '@app/components/scroll-view';
import { AnimateIn } from '@app/components/animate-in';
import { ProfileLeaderboards } from '@app/components/profile-leaderboards';
import DiscordBadge from '@app/view/components/badge/discord-badge';
import YoutubeBadge from '@app/view/components/badge/youtube-badge';
import DouyuBadge from '@app/view/components/badge/doyou-badge';
import TwitchBadge from '@app/view/components/badge/twitch-badge';
import useAuth from '@/data/src/hooks/use-auth';
import { Button } from '@app/components/button';
import { Text } from '@app/components/text';
import { sumBy } from 'lodash';
import { Skeleton, SkeletonText } from '@app/components/skeleton';
import NotFound from '@app/app/(main)/+not-found';

type UserPageParams = {
    profileId: string;
};

export default function ProfilePage() {
    const showTabBar = useShowTabBar();
    const [leaderboardIds, setLeaderboardIds] = useState<string[]>([]);
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = !Number.isInteger(Number(params.profileId)) ? NaN : Number(params.profileId);

    const authProfileId = useAuthProfileId();

    const user = useAuth();
    const account = useAccount();
    const loggedIn = user && !user.is_anonymous && account.data;

    const { data: fullProfile, isPending: isFullProfilePending } = useProfile(
        profileId,
        'avatar_medium_url,avatar_full_url,last_10_matches_won,stats'
    );
    const { data: profile, isPending: isProfilePending } = useProfileFast(profileId);
    const isPending = isFullProfilePending || isProfilePending;

    const leaderboards = fullProfile?.leaderboards.filter((l) => leaderboardIds.length === 0 || leaderboardIds.includes(l.leaderboardId));

    const games = sumBy(leaderboards, (x) => x.games);
    const drops = sumBy(leaderboards, (x) => x.drops);

    const TextComponent = fullProfile ? Text : SkeletonText;

    if (showTabBar) {
        return <Redirect href={`/players/${profileId}/main-profile`} />;
    }

    if ((!isPending && !fullProfile && !profile) || isNaN(profileId)) {
        return <NotFound />;
    }

    return (
        <ScrollView>
            <Stack.Screen
                options={{
                    title: profile?.name,
                    headerTitle: () => <UserTitle profile={profile} />,
                    headerRight: () => <UserMenu profile={profile} fullProfile={fullProfile} />,
                }}
            />

            <View className="flex flex-row justify-between items-center px-4 pt-4">
                <View className="flex-row gap-4 items-center">
                    <View className="flex-col">
                        <TextComponent alt variant="label-lg" className="min-w-24">
                            {games} Matches
                        </TextComponent>
                        <TextComponent alt variant="label-sm" className="min-w-24">
                            {drops} Drops ({games === 0 ? '0' : ((drops / games) * 100).toFixed(2)}%)
                        </TextComponent>
                    </View>

                    {(fullProfile?.socialDiscordInvitationUrl ||
                        fullProfile?.socialYoutubeChannelUrl ||
                        fullProfile?.socialDouyuChannelUrl ||
                        fullProfile?.socialTwitchChannelUrl != null) && (
                        <View className="flex-row gap-x-2">
                            {fullProfile?.socialDiscordInvitationUrl && fullProfile?.socialDiscordInvitation && (
                                <DiscordBadge
                                    invitationUrl={fullProfile?.socialDiscordInvitationUrl}
                                    invitation={fullProfile?.socialDiscordInvitation}
                                />
                            )}
                            {fullProfile?.socialYoutubeChannelUrl && <YoutubeBadge channelUrl={fullProfile?.socialYoutubeChannelUrl} />}
                            {fullProfile?.socialDouyuChannelUrl && <DouyuBadge channelUrl={fullProfile?.socialDouyuChannelUrl} />}
                            {fullProfile?.socialTwitchChannelUrl && fullProfile?.socialTwitchChannel && (
                                <TwitchBadge channelUrl={fullProfile?.socialTwitchChannelUrl} channel={fullProfile?.socialTwitchChannel} />
                            )}
                        </View>
                    )}

                    {!loggedIn && authProfileId === profileId && (
                        <View className="gap-x-1 flex-row items-center">
                            <Button size="small" href="/more/account" className="min-h-[26px]">
                                Sign up
                            </Button>
                            <TextComponent>to manage your profile.</TextComponent>
                        </View>
                    )}
                </View>

                {fullProfile ? (
                    <LeaderboardsSelect leaderboardIdList={leaderboardIds} onLeaderboardIdChange={setLeaderboardIds} />
                ) : (
                    <Skeleton alt className="w-48 h-11" />
                )}
            </View>

            <AnimateIn skipFirstAnimation>
                <ProfileLeaderboards profile={fullProfile} leaderboardIds={leaderboardIds} />
            </AnimateIn>

            <MainMatches profile={fullProfile || null} leaderboardIds={leaderboardIds} />
        </ScrollView>
    );
}
