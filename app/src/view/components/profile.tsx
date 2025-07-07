import { FontAwesome5 } from '@expo/vector-icons';
import { getTwitchChannel, getVerifiedPlayer } from '@nex/data';
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
import useAuth from '../../../../data/src/hooks/use-auth';
import { useAccount } from '@app/queries/all';

interface ILeaderboardRowProps {
    data: IProfileLeaderboardResult;
}

const formatStreak = (streak: number) => {
    if (streak > 0) {
        return '+' + streak;
    }
    return streak;
};

function LeaderboardRow1({ data }: ILeaderboardRowProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    const leaderboardInfo = data;
    const color = { color: getLeaderboardTextColor(data.leaderboardId, theme.dark) };

    return (
        <View style={styles.leaderboardRow}>
            {/*<MyText tw="flex font-bold text-2xl" style={StyleSheet.flatten([styles.cellLeaderboard, color])}>*/}
            {/*    {data.abbreviation}*/}
            {/*</MyText>*/}
            <MyText style={StyleSheet.flatten([styles.cellLeaderboard, color])}>{data.abbreviation}</MyText>
            <MyText style={StyleSheet.flatten([styles.cellRank, color])}>#{leaderboardInfo.rank}</MyText>
            <MyText style={StyleSheet.flatten([styles.cellRating, color])}>{leaderboardInfo.rating}</MyText>
            <MyText style={StyleSheet.flatten([styles.cellRating2, color])}>
                {leaderboardInfo.maxRating == leaderboardInfo.rating ? '←' : leaderboardInfo.maxRating || '-'}
            </MyText>
            {/*<MyText style={StyleSheet.flatten([styles.cellRatingChange, color])}>*/}
            {/*    {leaderboardInfo.previousRating ? formatStreak(leaderboardInfo.rating-leaderboardInfo.previousRating) : '-'}*/}
            {/*</MyText>*/}
        </View>
    );
}

function LeaderboardRowSeason({ data }: ILeaderboardRowProps) {
    const styles = useStyles();

    // style={{ backgroundColor: data.rankLevelBackgroundColor }}

    return (
        <View className="flex-1 flex-col rounded p-2">
            <MyText className="text-white font-bold mb-2">{data.leaderboardName}</MyText>
            <View className="flex-1 flex-row w-20 h-20">
                <View className="flex w-20 h-20">
                    <Image style={styles.image as ImageStyle} source={data.rankLevelImageUrl} contentFit="contain" />
                </View>
                <View tw="flex">
                    <MyText tw="flex font-bold text-2xl" style={{ color: data.rankLevelColor }}>
                        {data.rankLevelName}
                    </MyText>
                </View>
            </View>
        </View>
    );
}

function LeaderboardRow2({ data }: ILeaderboardRowProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    const leaderboardInfo = data;
    const color = { color: getLeaderboardTextColor(data.leaderboardId, theme.dark) };

    return (
        <View style={styles.leaderboardRow}>
            <MyText style={StyleSheet.flatten([styles.cellLeaderboard, color])}>{data.abbreviation}</MyText>
            <MyText style={StyleSheet.flatten([styles.cellGames, color])}>{leaderboardInfo.games}</MyText>
            <MyText style={StyleSheet.flatten([styles.cellWon, color])} numberOfLines={1}>
                {((leaderboardInfo?.wins / leaderboardInfo?.games) * 100).toFixed(2)} %
            </MyText>
            <MyText style={StyleSheet.flatten([styles.cellStreak, color])} numberOfLines={1}>
                {formatStreak(leaderboardInfo?.streak)}
            </MyText>
            {/*<MyText style={StyleSheet.flatten([styles.cellStreak, color])} numberOfLines={1}>*/}
            {/*    {leaderboardInfo.highestStreak == leaderboardInfo.streak ? '←' : formatStreak(leaderboardInfo.highestStreak)}*/}
            {/*</MyText>*/}
            {/*<MyText style={StyleSheet.flatten([styles.cellLastMatch, color])} numberOfLines={1}>*/}
            {/*    {formatAgo(leaderboardInfo.lastMatch)}*/}
            {/*</MyText>*/}
        </View>
    );
}

// export interface IProfile {
//     clan: string;
//     country: Flag;
//     icon: any;
//     name: string;
//     profileId: number;
//     steamId: string;
//     leaderboards: ILeaderboard[];
//     games: number;
//     drops: number;
// }

interface IProfileProps {
    data?: IProfileResult | null;
    ready: boolean;
    profileId?: number;
}

export function ProfileLive({ data }: { data: IPlayerNew }) {
    const styles = useStyles();
    const verifiedPlayer = data ? getVerifiedPlayer(data?.profileId!) : null;

    const channel = verifiedPlayer ? getTwitchChannel(verifiedPlayer) : '';

    const { data: playerTwitchLive } = useQuery({
        queryKey: ['twitch-live', channel],
        queryFn: () => twitchLive(channel),
        enabled: !!channel,
    });

    if (!playerTwitchLive) {
        return <MyText />;
    }

    return (
        <MyText style={styles.row} onPress={() => openLink(`https://www.twitch.tv/${channel}`)}>
            {playerTwitchLive?.type === 'live' && (
                <>
                    <MyText style={{ color: '#e91a16' }}> ● </MyText>
                    <MyText>{playerTwitchLive.viewer_count} </MyText>
                    <FontAwesome5 solid name="twitch" size={14} style={styles.twitchIcon} />
                    <MyText> </MyText>
                </>
            )}
        </MyText>
    );
}

export default function Profile({ data, ready, profileId }: IProfileProps) {
    const getTranslation = useTranslation();
    data = ready ? data : null;

    const styles = useStyles();

    // const verifiedPlayer = getVerifiedPlayer(profileId!);

    // Set country for use in leaderboard country dropdown
    // useEffect(() => {
    //     if ((data?.country && data.country != authCountry) || (data?.clan && data.clan != authClan)) {
    //         mutate(setPrefValue('country', data?.country));
    //         mutate(setPrefValue('clan', data?.clan));
    //         savePrefsToStorage();
    //     }
    // }, [data]);

    // console.log('verifiedPlayer===>', verifiedPlayer);
    // console.log('data?.linkedProfiles===>', data?.linkedProfiles);

    const user = useAuth();
    const account = useAccount();
    const loggedIn = user && !user.is_anonymous && account.data;

    return (
        <View style={styles.container}>
            <View className="space-y-3">
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

                {/*<TouchableOpacity className="flex-row gap-3 py-4 items-center" onPress={() => router.push(path)}>*/}

                {/*<View className="space-y-3">*/}

                {/*    <Link href="/profile">*/}
                {/*        Sign up*/}
                {/*    </Link> to manage your profile.*/}

                {/*</View>*/}

                {/*<MyText>*/}
                {/*    <Link href="/more/account" asChild>*/}
                {/*        <MyText className="text-blue-600 underline">Sign up</MyText>*/}
                {/*    </Link>*/}
                {/*    {' '}to manage your data and socials.*/}
                {/*</MyText>*/}

                {(false || !loggedIn) && (
                    <View className="space-x-2 flex-row items-center">
                        {/*<Pressable*/}
                        {/*    onPress={() => router.push('/more/account')}*/}
                        {/*    className="bg-blue-600 px-4 py-2 rounded"*/}
                        {/*>*/}
                        {/*    <MyText className="text-white text-center">Sign up</MyText>*/}
                        {/*</Pressable>*/}

                        <Button onPress={() => router.push('/more/account')}>Sign up</Button>

                        <MyText>to manage your profile.</MyText>
                    </View>
                )}

                {/*{liquipediaProfileOverview && (*/}
                {/*    <View className="justify-center">*/}
                {/*        <TournamentMarkdown>{liquipediaProfileOverview}</TournamentMarkdown>*/}

                {/*        <Button onPress={() => setShowTournamentPlayer(true)} align="center" size="small">*/}
                {/*            Competitive Overview*/}
                {/*        </Button>*/}

                {/*        {liquipediaProfile && (*/}
                {/*            <TournamentPlayerPopup*/}
                {/*                id={liquipediaProfile.name}*/}
                {/*                title={liquipediaProfile.name}*/}
                {/*                isActive={showTournamentPlayer}*/}
                {/*                onClose={() => setShowTournamentPlayer(false)}*/}
                {/*            />*/}
                {/*        )}*/}
                {/*    </View>*/}
                {/*)}*/}

                <View>
                    <View style={styles.leaderboardRow}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>
                            {getTranslation('main.profile.heading.board')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellRank}>
                            {getTranslation('main.profile.heading.rank')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellRating}>
                            {getTranslation('main.profile.heading.rating')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellRating2}>
                            {getTranslation('main.profile.heading.max')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellRatingChange}>
                            {getTranslation('main.profile.heading.change')}
                        </MyText>
                    </View>
                    {data?.leaderboards.map((leaderboard) => <LeaderboardRow1 key={leaderboard.leaderboardId} data={leaderboard} />)}

                    {!data &&
                        Array(2)
                            .fill(0)
                            .map((a, i) => (
                                <View key={i} style={styles.row}>
                                    <TextLoader style={styles.cellLeaderboard} />
                                    <TextLoader style={styles.cellRank} />
                                    <TextLoader style={styles.cellRating} />
                                    <TextLoader style={styles.cellRating2} />
                                    <TextLoader style={styles.cellRatingChange} />
                                </View>
                            ))}
                </View>

                <View>
                    <View style={styles.leaderboardRow}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>
                            {getTranslation('main.profile.heading.board')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>
                            {getTranslation('main.profile.heading.games')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>
                            {getTranslation('main.profile.heading.won')}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.cellStreak}>
                            {getTranslation('main.profile.heading.streak')}
                        </MyText>
                    </View>
                    {data?.leaderboards.map((leaderboard) => <LeaderboardRow2 key={leaderboard.leaderboardId} data={leaderboard} />)}

                    {!data &&
                        Array(2)
                            .fill(0)
                            .map((a, i) => (
                                <View key={i} style={styles.row}>
                                    <TextLoader style={styles.cellLeaderboard} />
                                    <TextLoader style={styles.cellGames} />
                                    <TextLoader style={styles.cellWon} />
                                    <TextLoader style={styles.cellStreak} />
                                </View>
                            ))}
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
            // width: 100,
            // height: 100,
            // width: '100%',
            // backgroundColor: '#0553',
        },
        sectionHeader: {
            marginVertical: 25,
            fontSize: 15,
            fontWeight: '500',
            // textAlign: 'center',
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
            width: 75,
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
