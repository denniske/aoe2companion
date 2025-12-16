import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import DiscordBadge from './badge/discord-badge';
import DouyuBadge from './badge/doyou-badge';
import TwitchBadge from './badge/twitch-badge';
import YoutubeBadge from './badge/youtube-badge';
import { MyText } from './my-text';
import { IProfileLeaderboardResult, IProfileResult } from '../../api/helper/api.types';
import { getLeaderboardTextColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { router } from 'expo-router';
import { Button } from '@app/components/button';
import { useAccount, useAuthProfileId } from '@app/queries/all';
import { Text } from '@app/components/text';
import { Icon } from '@app/components/icon';
import { reverse, sumBy } from 'lodash';
import useAuth from '@/data/src/hooks/use-auth';
import { Skeleton } from '@app/view/components/loader/skeleton';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { AnimateIn } from '@app/components/animate-in';

interface ILeaderboardRowProps {
    data: IProfileLeaderboardResult;
}

const formatStreak = (streak: number) => {
    if (streak > 0) {
        return '+' + streak;
    }
    return streak;
};

const mappingBadgeStr: Record<string, string> = {
    'rm_1v1': '1v1',
    'rm_team': 'Team',
    'ew_1v1': '1v1',
    'ew_team': 'Team',
    'unranked': 'UNR',
    'qm_1v1': '1v1',
    'qm_2v2': '2v2',
    'qm_3v3': '3v3',
    'qm_4v4': '4v4',
}

const mappingIconName: Record<string, IconName> = {
    'rm_1v1': 'swords',
    'rm_team': 'swords',
    'ew_1v1': 'chess-rook',
    'ew_team': 'chess-rook',
    'unranked': 'swords',
}

function LeaderboardRow1({ data }: ILeaderboardRowProps) {
    const theme = useAppTheme();
    const [streakWidth, setStreakWidth] = useState(0)

    const leaderboardInfo = data;
    const color = { color: getLeaderboardTextColor(data.leaderboardId, theme.dark) };

    const last5MatchesWon = reverse(leaderboardInfo.last10MatchesWon?.filter((_, i) => i < 5));

    const leaderboardId = data.leaderboardId?.replace('_console', '');

    // console.log('leaderboardId', leaderboardId);
    // console.log('mappingIconName[leaderboardId]', mappingIconName[leaderboardId]);

    const mappedIconName = mappingIconName[leaderboardId] ?? 'swords';
    const mappedBadgeStr = mappingBadgeStr[leaderboardId] ?? '?';

    return (
        <View className="flex-row items-center py-0.5 mb-2 gap-x-4">
            <View className="w-10 -mr-2">
                <Icon icon={mappedIconName} size={24} color="subtle" />
                <View className="absolute -bottom-2 right-0 rounded-md p-[1.25px] bg-gold-50 dark:bg-blue-950">
                    <Text color="text-white" variant="body-tn" className="p-0.5 px-1 rounded-md bg-[#2E6CDD]" numberOfLines={1}>
                        {mappedBadgeStr}
                    </Text>
                </View>
            </View>

            <View className="flex-col min-w-16">
                <Text variant="body" className="truncate flex-1">
                    # {leaderboardInfo.rank}
                </Text>
                <Text variant="body-xs" className="ml-[13]">
                    Top {Math.max(1, (leaderboardInfo.rank / leaderboardInfo.total) * 100).toFixed()}%
                </Text>
            </View>

            <View className="flex-col min-w-12">
                <Text variant="label" color="brand">{leaderboardInfo.rating}</Text>
                <Text variant="body-xs" numberOfLines={1}>
                    max {leaderboardInfo.maxRating}
                </Text>
            </View>

            <View className="flex-col min-w-10">
                <Text variant="body">{leaderboardInfo.games}</Text>
                <Text variant="body-xs" numberOfLines={1}>
                    games
                </Text>
            </View>

            <View className="flex-col min-w-9">
                <Text variant="body">{((leaderboardInfo?.wins / leaderboardInfo?.games) * 100).toFixed(0)} %</Text>
                <Text variant="body-xs">wins</Text>
            </View>

            <View className="flex-row flex-1">
                <View className="flex-col justify-items-stretch gap-y-1">
                    <Text variant="body" className="self-end">
                        {formatStreak(leaderboardInfo?.streak)}
                    </Text>
                    <View className="flex-row gap-x-1">
                        {last5MatchesWon?.map(({ won }) => (
                            <View className={`${won ? 'bg-blue-500' : 'bg-gray-200'} rounded-full w-1.5 h-1.5`}></View>
                        ))}
                    </View>
                </View>
                <View className="flex-col hidden xs:flex">
                    <Text variant="body" className="text-right">
                        {' '}
                        {last5MatchesWon?.every((x) => x.won) ? '🔥' : last5MatchesWon?.every((x) => !x.won) ? '❄️' : ''}
                    </Text>
                    <Text variant="body-xs" className="text-right"></Text>
                </View>
            </View>
        </View>
    );
}

interface IProfileProps {
    data?: IProfileResult | null;
    ready: boolean;
    profileId?: number;
}

export default function Profile({ data, ready, profileId }: IProfileProps) {
    data = ready ? data : null;

    const theme = useAppTheme();
    const authProfileId = useAuthProfileId();

    const user = useAuth();
    const account = useAccount();
    const loggedIn = user && !user.is_anonymous && account.data;

    const leaderboardsPC = data?.leaderboards?.filter((l) => !l.leaderboardId?.includes('_console'));
    const leaderboardsConsole = data?.leaderboards?.filter((l) => l.leaderboardId?.includes('_console'));

    const pcGames = sumBy(leaderboardsPC, x => x.games);
    const consoleGames = sumBy(leaderboardsConsole, x => x.games);

    const pcDrops = sumBy(leaderboardsPC, x => x.drops);
    const consoleDrops = sumBy(leaderboardsConsole, x => x.drops);

    return (
        <View className="gap-y-3 min-w-xs">
            {(data?.socialDiscordInvitationUrl ||
                data?.socialYoutubeChannelUrl ||
                data?.socialDouyuChannelUrl ||
                data?.socialTwitchChannelUrl != null) && (
                <View className="flex-row gap-x-2">
                    {data?.socialDiscordInvitationUrl && data?.socialDiscordInvitation && (
                        <DiscordBadge invitationUrl={data?.socialDiscordInvitationUrl} invitation={data?.socialDiscordInvitation} />
                    )}
                    {data?.socialYoutubeChannelUrl && <YoutubeBadge channelUrl={data?.socialYoutubeChannelUrl} />}
                    {data?.socialDouyuChannelUrl && <DouyuBadge channelUrl={data?.socialDouyuChannelUrl} />}
                    {data?.socialTwitchChannelUrl && data?.socialTwitchChannel && (
                        <TwitchBadge channelUrl={data?.socialTwitchChannelUrl} channel={data?.socialTwitchChannel} />
                    )}
                </View>
            )}

            {!loggedIn && authProfileId === profileId && (
                <View className="gap-x-2 flex-row items-center">
                    <Button onPress={() => router.push('/more/account')}>Sign up</Button>
                    <MyText>to manage your profile.</MyText>
                </View>
            )}

            {!data && (
                <>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                </>
            )}

            {(!!leaderboardsPC?.length || leaderboardsConsole?.length === 0) && (
                <View className="flex-row items-center py-0.5 mt-2 gap-x-4">
                    <View className="flex-col w-8 items-center">
                        <FontAwesome6 name="computer-mouse" size={16} style={{ color: theme.textNoteColor }} />
                    </View>
                    <View className="flex-col">
                        <Text variant="body">{pcGames}</Text>
                        <Text variant="body-xs">games</Text>
                    </View>
                    <View className="flex-col">
                        <Text variant="body">{pcGames === 0 ? '0' : ((pcDrops / pcGames) * 100).toFixed(2)} %</Text>
                        <Text variant="body-xs">drops</Text>
                    </View>
                </View>
            )}

            {!!leaderboardsPC?.length && (
                <View className="py-1 gap-y-2">
                    {leaderboardsPC.map((leaderboard) => (
                        <LeaderboardRow1 key={leaderboard.leaderboardId} data={leaderboard} />
                    ))}
                </View>
            )}

            {!!leaderboardsConsole?.length && (
                <View className="flex-row items-center py-0.5 mt-2 gap-x-4">
                    <View className="flex-col w-8 items-center">
                        <FontAwesome6 name="gamepad" size={16} style={{ color: theme.textNoteColor }} />
                    </View>
                    <View className="flex-col w-10">
                        <Text variant="body">{consoleGames}</Text>
                        <Text variant="body-xs">games</Text>
                    </View>
                    <View className="flex-col w-12">
                        <Text variant="body">{(((consoleDrops as any) / (consoleGames as any)) * 100).toFixed(2)} %</Text>
                        <Text variant="body-xs">drops</Text>
                    </View>
                </View>
            )}

            {!!leaderboardsConsole?.length && (
                <View className="py-1 gap-y-2">
                    {leaderboardsConsole.map((leaderboard) => (
                        <LeaderboardRow1 key={leaderboard.leaderboardId} data={leaderboard} />
                    ))}
                </View>
            )}
        </View>
    );
}
