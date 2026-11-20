import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import MainMatches from '@app/components/profile-matches';
import NativeProfile from '@app/components/native-profile';
import { useAccount, useAuthProfileId, useProfilePage, useProfileFast } from '@app/queries/all';
import { useState } from 'react';
import { UserMenu, UserTitle } from '@app/components/profile-header';
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
import { useTranslation } from '@app/helper/translate';
import { Translated } from '@app/components/translated';
import { LadderProfileSection } from '@app/view/ladder-tournament/ladder-profile-section';

type UserPageParams = {
    profileId: string;
};

export default function ProfilePage() {
    const getTranslation = useTranslation();
    const showTabBar = useShowTabBar();
    const [leaderboardIds, setLeaderboardIds] = useState<string[]>([]);
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = !Number.isInteger(Number(params.profileId)) ? NaN : Number(params.profileId);

    const authProfileId = useAuthProfileId();

    const user = useAuth();
    const account = useAccount();
    const loggedIn = user && !user.is_anonymous && account.data;

    const fullProfileQuery = useProfilePage(profileId);
    const profileQuery = useProfileFast(profileId);
    const { data: fullProfile, isPending: isFullProfilePending } = fullProfileQuery;
    const { data: profile, isPending: isProfilePending } = profileQuery;
    const isPending = isFullProfilePending || isProfilePending;
    // A failed request is not a missing profile. Only a 404 means the player does not exist; anything
    // else (a timeout, no network) used to land on Not Found too, with nothing to retry.
    const loadError = [fullProfileQuery.error, profileQuery.error].find((e) => e && (e as any).status !== 404);

    const leaderboards = fullProfile?.leaderboards.filter((l) => leaderboardIds.length === 0 || leaderboardIds.includes(l.leaderboardId));

    const games = sumBy(leaderboards, (x) => x.games);
    const drops = sumBy(leaderboards, (x) => x.drops);

    const TextComponent = fullProfile ? Text : SkeletonText;

    if (loadError && !fullProfile && !profile) {
        return (
            <View className="flex-1 justify-center items-center gap-4 p-4">
                <Text variant="label-lg" color="subtle">
                    {getTranslation('error.somethingwentwrong')}
                </Text>
                <Button
                    onPress={() => {
                        fullProfileQuery.refetch();
                        profileQuery.refetch();
                    }}
                >
                    {getTranslation('matchanalysis.retry')}
                </Button>
            </View>
        );
    }

    if ((!isPending && !fullProfile && !profile) || isNaN(profileId)) {
        return <NotFound />;
    }

    const header = (
        <Stack.Screen
            options={{
                title: profile?.name,
                headerTitle: () => <UserTitle profile={profile} />,
                headerRight: () => <UserMenu profile={profile} fullProfile={fullProfile} />,
            }}
        />
    );

    // On a phone the profile is its own layout, rendered here rather than redirected to,
    // so the screen that slides in already holds its skeletons and they fill in place.
    if (showTabBar) {
        return (
            <>
                {header}
                <NativeProfile />
            </>
        );
    }

    return (
        <ScrollView>
            {header}

            <View className="flex flex-row justify-between items-center px-4 pt-4">
                <View className="flex-row gap-4 items-center">
                    <View className="flex-col">
                        <TextComponent alt variant="label-lg" className="min-w-24">
                            {getTranslation('main.profile.games', { games, count: games })}
                        </TextComponent>
                        <TextComponent alt variant="label-sm" className="min-w-24">
                            {getTranslation('main.profile.drops', { drops, count: drops })} ({games === 0 ? '0' : ((drops / games) * 100).toFixed(2)}%)
                        </TextComponent>
                    </View>

                    {(fullProfile?.socialDiscordInvitationUrl ||
                        fullProfile?.socialYoutubeChannelUrl ||
                        fullProfile?.socialDouyuChannelUrl ||
                        fullProfile?.socialTwitchChannelUrl != null) && (
                        <View className="flex-row gap-x-2">
                            {!!(fullProfile?.socialDiscordInvitationUrl && fullProfile?.socialDiscordInvitation) && (
                                <DiscordBadge
                                    invitationUrl={fullProfile?.socialDiscordInvitationUrl}
                                    invitation={fullProfile?.socialDiscordInvitation}
                                />
                            )}
                            {!!fullProfile?.socialYoutubeChannelUrl && <YoutubeBadge channelUrl={fullProfile?.socialYoutubeChannelUrl} />}
                            {!!fullProfile?.socialDouyuChannelUrl && <DouyuBadge channelUrl={fullProfile?.socialDouyuChannelUrl} />}
                            {!!(fullProfile?.socialTwitchChannelUrl && fullProfile?.socialTwitchChannel) && (
                                <TwitchBadge channelUrl={fullProfile?.socialTwitchChannelUrl} channel={fullProfile?.socialTwitchChannel} />
                            )}
                        </View>
                    )}

                    {!loggedIn && authProfileId === profileId && (
                        <View className="gap-x-1 flex-row items-center">
                            <Translated
                                text={getTranslation('main.profile.signup')}
                                components={{
                                    button: (label) => (
                                        <Button size="small" href="/more/account" className="min-h-[26px]">
                                            {label}
                                        </Button>
                                    ),
                                }}
                            />
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

            <LadderProfileSection profileId={profileId} className="px-4 pt-4" />

            <MainMatches profile={fullProfile || null} leaderboardIds={leaderboardIds} />
        </ScrollView>
    );
}
