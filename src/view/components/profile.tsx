import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Image, ImageStyle } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import DiscordBadge from './badge/discord-badge';
import DouyuBadge from './badge/doyou-badge';
import TwitchBadge from './badge/twitch-badge';
import YoutubeBadge from './badge/youtube-badge';
import { TextLoader } from './loader/text-loader';
import { MyText } from './my-text';
import { twitchLive } from '../../api/following';
import { IPlayerNew, IProfileLeaderboardResult, IProfileResult } from '../../api/helper/api.types';
import { getLeaderboardTextColor } from '../../helper/colors';
import { openLink } from '../../helper/url';
import { useAppTheme } from '../../theming';
import { createStylesheet } from '../../theming-new';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@app/helper/translate';
import { Button } from '@app/components/button';
import { useAccount, useAuthProfileId } from '@app/queries/all';
import { Text } from '@app/components/text';
import { Icon } from '@app/components/icon';
import { reverse, sumBy } from 'lodash';
import useAuth from "@/data/src/hooks/use-auth";

interface ILeaderboardRowProps {
    data: IProfileLeaderboardResult;
}

const formatStreak = (streak: number) => {
    if (streak > 0) {
        return '+' + streak;
    }
    return streak;
};

const mappingBadgeStr = {
    'rm_1v1': '1v1',
    'rm_team': 'Team',
    'ew_1v1': '1v1',
    'ew_team': 'Team',
    'unranked': 'UNR',
}

const mappingIconName = {
    'rm_1v1': 'swords',
    'rm_team': 'swords',
    'ew_1v1': 'chess-rook',
    'ew_team': 'chess-rook',
    'unranked': 'swords',
}

function LeaderboardRow1({ data }: ILeaderboardRowProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    const leaderboardInfo = data;
    const color = { color: getLeaderboardTextColor(data.leaderboardId, theme.dark) };

    const last5MatchesWon = reverse(leaderboardInfo.last10MatchesWon?.filter((_, i) => i < 5));

    const leaderboardId = data.leaderboardId?.replace('_console', '');

    return (
        <View style={styles.leaderboardRow} className="mb-2 gap-x-4">

            <View className="w-8">
                <Icon icon={mappingIconName[leaderboardId]} size={24} color={theme.textNoteColor} />
                <Text color="subtle"
                      variant="body-tn"
                      className="absolute -bottom-2 -right-2 p-0.5 px-1 rounded-md border-2 border-gold-50 dark:border-blue-950 bg-[#2E6CDD] text-white"
                      numberOfLines={1}>
                    {mappingBadgeStr[leaderboardId]}
                </Text>
            </View>

            <View className="flex-col w-16">
                <Text variant="body-md" className="truncate flex-1">🌐 {leaderboardInfo.rank}</Text>
                {/*<Text variant="body-md">🌎 {leaderboardInfo.rank}</Text>*/}
                <Text variant="body-xs" className="ml-[18]">Top {Math.max(1, leaderboardInfo.rank/leaderboardInfo.total*100).toFixed()}%</Text>
            </View>

            <View className="flex-col w-12">
                <Text variant="body-md">{leaderboardInfo.rating}</Text>
                <Text variant="body-xs">max {leaderboardInfo.maxRating}</Text>
            </View>

            <View className="flex-col w-10">
                <Text variant="body-md">{leaderboardInfo.games}</Text>
                <Text variant="body-xs">games</Text>
            </View>

            <View className="flex-col w-9">
                <Text variant="body-md">{((leaderboardInfo?.wins / leaderboardInfo?.games) * 100).toFixed(0)} %</Text>
                <Text variant="body-xs">wins</Text>
            </View>

            <View className="flex-row w-16">
                <View className="flex-col justify-items-stretch gap-y-1">
                    <Text variant="body-md" className="self-end">{formatStreak(leaderboardInfo?.streak)}</Text>
                    <View variant="body-xs" className="flex-row gap-x-1">
                        {
                            last5MatchesWon?.map(({ won }) =>(
                                <View className={`${won ? 'bg-blue-500' : 'bg-gray-200'} rounded-full w-1.5 h-1.5`}></View>
                                ))
                        }
                    </View>
                </View>
                <View className="flex-col">
                    <Text variant="body-md" className="text-right"> {last5MatchesWon?.every(x => x.won) ? '🔥' : last5MatchesWon?.every(x => !x.won) ? '❄️' : ''}</Text>
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
    const getTranslation = useTranslation();
    data = ready ? data : null;

    const styles = useStyles();
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
        <View style={styles.container}>
            <View className="gap-y-3">
                {(data?.socialDiscordInvitationUrl ||
                    data?.socialYoutubeChannelUrl ||
                    data?.socialDouyuChannelUrl ||
                    data?.socialTwitchChannelUrl != null) && (
                    <View style={styles.row}>
                        {data?.socialDiscordInvitationUrl && data?.socialDiscordInvitation && (
                            <View style={styles.badge}>
                                <DiscordBadge invitationUrl={data?.socialDiscordInvitationUrl} invitation={data?.socialDiscordInvitation} />
                            </View>
                        )}
                        {data?.socialYoutubeChannelUrl && (
                            <View style={styles.badge}>
                                <YoutubeBadge channelUrl={data?.socialYoutubeChannelUrl} />
                            </View>
                        )}
                        {data?.socialDouyuChannelUrl && (
                            <View style={styles.badge}>
                                <DouyuBadge channelUrl={data?.socialDouyuChannelUrl} />
                            </View>
                        )}
                        {data?.socialTwitchChannelUrl && data?.socialTwitchChannel && (
                            <View style={styles.badge}>
                                <TwitchBadge channelUrl={data?.socialTwitchChannelUrl} channel={data?.socialTwitchChannel} />
                            </View>
                        )}
                    </View>
                )}

                {!loggedIn && authProfileId === profileId && (
                    <View className="gap-x-2 flex-row items-center">
                        <Button onPress={() => router.push('/more/account')}>Sign up</Button>
                        <MyText>to manage your profile.</MyText>
                    </View>
                )}

                {/*<View className="flex-col items-center w-[393px] -mx-4 bg-red-400">*/}
                {/*    <Text>asdsad</Text>*/}
                {/*</View>*/}

                {/*<View className="flex-col items-center w-10 -mx-4 bg-red-400">*/}
                {/*    <Text>asdsad</Text>*/}
                {/*</View>*/}

                {/*<View className="flex-col items-center w-[40px] -mx-4 bg-red-400">*/}
                {/*    <Text>asdsad</Text>*/}
                {/*</View>*/}

                <View style={styles.leaderboardRow} className="mt-2 gap-x-4">
                    <View className="flex-col w-8 items-center">
                        <FontAwesome6
                            name="computer-mouse" size={16} style={{color: theme.textNoteColor}} />
                    </View>
                    <View className="flex-col w-10">
                        <Text variant="body-md">{pcGames}</Text>
                        <Text variant="body-xs">games</Text>
                    </View>
                    <View className="flex-col w-12">
                        <Text variant="body-md">{((pcDrops as any) / (pcGames as any) * 100).toFixed(2)} %</Text>
                        <Text variant="body-xs">drops</Text>
                    </View>
                </View>

                <View className="py-1 gap-y-2">
                    {leaderboardsPC?.map((leaderboard) => <LeaderboardRow1 key={leaderboard.leaderboardId} data={leaderboard} />)}
                </View>

                {
                    leaderboardsConsole && leaderboardsConsole.length > 0 && (
                        <View style={styles.leaderboardRow} className="mt-2 gap-x-4">
                            <View className="flex-col w-8 items-center">
                                <FontAwesome6
                                    className="px-1 rounded-md border-2 border-gold-50 bg-[#2E6CDD] text-white"
                                    name="gamepad" size={16} style={{color: 'black'}} />
                            </View>
                            <View className="flex-col w-10">
                                <Text variant="body-md">{consoleGames}</Text>
                                <Text variant="body-xs">games</Text>
                            </View>
                            <View className="flex-col w-12">
                                <Text variant="body-md">{((consoleDrops as any) / (consoleGames as any) * 100).toFixed(2)} %</Text>
                                <Text variant="body-xs">drops</Text>
                            </View>
                        </View>
                    )
                }

                <View className="py-1 gap-y-2">
                    {leaderboardsConsole?.map((leaderboard) => <LeaderboardRow1 key={leaderboard.leaderboardId} data={leaderboard} />)}
                </View>
            </View>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        icontainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
            marginBottom: 10,
            padding: 5,
            borderRadius: 5,
        },
        itext: {
            fontWeight: 'bold',
            fontSize: 18,
        },
        image: {
            flex: 1,
            width: '100%',
            // backgroundColor: '#0553',
        },
        sectionHeader: {
            marginVertical: 25,
            fontSize: 15,
            fontWeight: '500',
        },
        followButton: {
            // backgroundColor: 'blue',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginHorizontal: 2,
        },
        followButtonText: {
            fontSize: 12,
            color: theme.textNoteColor,
            marginTop: 3,
        },
        followButtonIcon: {
            color: theme.textNoteColor,
        },
        verifiedIcon: {
            marginLeft: 5,
            color: theme.linkColor,
        },
        liveTitle: {
            marginLeft: 10,
            color: theme.textNoteColor,
            flex: 1,
        },
        liveIcon: {
            marginLeft: 10,
            marginRight: 5,
            color: '#e91a16',
        },
        liveIconOff: {
            marginLeft: 5,
            marginRight: 5,
            color: 'grey',
        },
        twitchIcon: {
            marginRight: 5,
            color: '#6441a5',
        },
        discordIcon: {
            marginRight: 5,
            color: '#7289DA',
        },
        youtubeIcon: {
            marginRight: 5,
            color: '#FF0000',
        },
        badge: {
            marginRight: 10,
        },
        cellLeaderboard: {
            // backgroundColor: 'red',
            width: 85,
            marginRight: 5,
        },
        cellRank: {
            width: 60,
            marginRight: 5,
            fontVariant: ['tabular-nums'],
            display: 'flex',
        },
        cellRating: {
            width: 50,
            marginRight: 5,
            fontVariant: ['tabular-nums'],
        },
        cellRating2: {
            width: 60,
            marginRight: 5,
            fontVariant: ['tabular-nums'],
        },
        cellRatingChange: {
            flex: 1,
            marginRight: 5,
            fontVariant: ['tabular-nums'],
        },
        cellGames: {
            width: 60,
            marginRight: 5,
            fontVariant: ['tabular-nums'],
        },
        cellWon: {
            width: 60,
            marginRight: 5,
            fontVariant: ['tabular-nums'],
        },
        cellStreak: {
            width: 45,
            marginRight: 10,
            textAlign: 'right',
            fontVariant: ['tabular-nums'],
        },
        cellLastMatch: {
            flex: 1,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 2,
            // backgroundColor: 'pink',
        },
        leaderboardRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 3,
        },
        scrollContainer: {
            marginHorizontal: -20,
        },
        scrollContent: {
            flexDirection: 'column',
            paddingBottom: 10,
            paddingHorizontal: 20,
        },
        container: {
            // backgroundColor: 'red',
        },
        countryIcon: {
            width: 21,
            height: 15,
            marginRight: 5,
        },
        profileIcon: {
            width: 35,
            height: 35,
            marginRight: 7,
            marginTop: -2,
            borderWidth: 1,
            borderColor: theme.textNoteColor,
        },
        expanded: {
            flex: 1,
        },
        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
            // flex: 1,
            // marginRight: 10,
        },
        menuButton: {
            // backgroundColor: 'blue',
            width: 35,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginHorizontal: 2,
        },
        menuIcon: {
            color: theme.textNoteColor,
        },
    })
);
