import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {formatAgo} from '@nex/data';
import React, {useEffect} from 'react';
import {getLeaderboardTextColor} from '../../helper/colors';
import {Flag, getFlagIcon} from '../../helper/flags';
import {ILeaderboard, ILeaderboardInfoRaw} from "../../helper/data";
import {ImageLoader} from "./loader/image-loader";
import {TextLoader} from "./loader/text-loader";
import Icon from "react-native-vector-icons/FontAwesome5";
import {setFollowing, setPrefValue, useMutate, useSelector} from "../../redux/reducer";
import {sameUser} from "../../helper/user";
import {MyText} from "./my-text";
import {formatLeaderboardId} from "../../helper/leaderboards";
import {useAppTheme, usePaperTheme} from "../../theming";
import {toggleFollowing} from "../../service/following";
import Space from "./space";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import {createStylesheet} from '../../theming-new';

interface ILeaderboardRowProps {
    data: ILeaderboardInfoRaw;
}

const formatStreak = (streak: number) => {
  if (streak > 0) {
      return '+' + streak;
  }
  return streak;
};

function LeaderboardRow({data}: ILeaderboardRowProps) {
    const theme = usePaperTheme();
    const styles = useStyles();

    const leaderboardInfo = data;
    const color = {color: getLeaderboardTextColor(data.leaderboard_id, theme.dark)};

    return (
            <View style={styles.leaderboardRow}>
                <MyText style={StyleSheet.flatten([styles.cellLeaderboard, color])}>
                    {formatLeaderboardId(data.leaderboard_id)}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellRank, color])}>
                    #{leaderboardInfo.rank}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellRating, color])}>
                    {leaderboardInfo.rating}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellGames, color])}>
                    {leaderboardInfo.games}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellWon, color])} numberOfLines={1}>
                    {(leaderboardInfo?.wins / leaderboardInfo?.games * 100).toFixed(2)}%
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellStreak, color])} numberOfLines={1}>
                    {formatStreak(leaderboardInfo?.streak)}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellLastMatch, color])} numberOfLines={1}>
                    {formatAgo(leaderboardInfo.last_match)}
                </MyText>
            </View>
    )
}

function LeaderboardRow1({data}: ILeaderboardRowProps) {
    const theme = usePaperTheme();
    const styles = useStyles();

    const leaderboardInfo = data;
    const color = {color: getLeaderboardTextColor(data.leaderboard_id, theme.dark)};

    return (
            <View style={styles.leaderboardRow}>
                <MyText style={StyleSheet.flatten([styles.cellLeaderboard, color])}>
                    {formatLeaderboardId(data.leaderboard_id)}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellRank, color])}>
                    #{leaderboardInfo.rank}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellRating, color])}>
                    {leaderboardInfo.rating}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellRating2, color])}>
                    {leaderboardInfo.highest_rating == leaderboardInfo.rating ? '←' : leaderboardInfo.highest_rating}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellRatingChange, color])}>
                    {formatStreak(leaderboardInfo.rating-leaderboardInfo.previous_rating)}
                </MyText>
            </View>
    )
}


function LeaderboardRow2({data}: ILeaderboardRowProps) {
    const theme = usePaperTheme();
    const styles = useStyles();

    const leaderboardInfo = data;
    const color = {color: getLeaderboardTextColor(data.leaderboard_id, theme.dark)};

    return (
            <View style={styles.leaderboardRow}>
                <MyText style={StyleSheet.flatten([styles.cellLeaderboard, color])}>
                    {formatLeaderboardId(data.leaderboard_id)}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellGames, color])}>
                    {leaderboardInfo.games}
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellWon, color])} numberOfLines={1}>
                    {(leaderboardInfo?.wins / leaderboardInfo?.games * 100).toFixed(2)} %
                </MyText>
                <MyText style={StyleSheet.flatten([styles.cellStreak, color])} numberOfLines={1}>
                    {formatStreak(leaderboardInfo?.streak)}
                </MyText>
                {/*<MyText style={StyleSheet.flatten([styles.cellStreak, color])} numberOfLines={1}>*/}
                {/*    {leaderboardInfo.highest_streak == leaderboardInfo.streak ? '←' : formatStreak(leaderboardInfo.highest_streak)}*/}
                {/*</MyText>*/}
                {/*<MyText style={StyleSheet.flatten([styles.cellLastMatch, color])} numberOfLines={1}>*/}
                {/*    {formatAgo(leaderboardInfo.last_match)}*/}
                {/*</MyText>*/}
            </View>
    )
}


export interface IProfile {
    clan: string;
    country: Flag;
    icon: any;
    name: string;
    profile_id: number;
    steam_id: string;
    leaderboards: ILeaderboardInfoRaw[];
    games: number;
    drops: number;
}

interface IProfileProps {
    data?: IProfile | null;
    ready: boolean;
}

export default function Profile({data, ready}: IProfileProps) {
    data = ready ? data : null;

    const theme = useAppTheme();
    const styles = useStyles();
    const mutate = useMutate();
    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);
    const followingThisUser = !!following.find(f => data && sameUser(f, data));
    const authCountry = useSelector(state => state.prefs.country);

    const _toggleFollowing = async () => {
        const following = await toggleFollowing(data!);
        if (following) {
            mutate(setFollowing(following));
        }
    };

    // Set country for use in leaderboard country dropdown
    useEffect(() => {
        if (data?.country && data.country != authCountry) {
            mutate(setPrefValue('country', data.country));
            saveCurrentPrefsToStorage();
        }
    }, [data]);

    return (
            <View style={styles.container}>
                <View>

                    <View style={styles.row}>
                        <View>
                            <View style={styles.row}>
                                <ImageLoader style={styles.countryIcon} ready={data} source={getFlagIcon(data?.country)}/>
                                <TextLoader width={100}>{data?.name}</TextLoader>
                                {
                                    data?.clan &&
                                    <MyText> (Clan{':'} {data?.clan})</MyText>
                                }
                            </View>
                            <View style={styles.row}>
                                <TextLoader width={180} ready={data}>{data?.games} Games, {data?.drops} Drops
                                    ({(data?.drops as any / (data?.games as any) * 100).toFixed(2)} %)</TextLoader>
                            </View>
                        </View>
                        <View style={styles.expanded}/>
                        {
                            data && (auth == null || !sameUser(auth, data)) &&
                            <TouchableOpacity onPress={_toggleFollowing}>
                                <View style={styles.followButton}>
                                    <Icon solid={followingThisUser} name="heart" size={22} style={styles.followButtonIcon}/>
                                    <MyText style={styles.followButtonText}>
                                        {followingThisUser ? 'Unfollow' : 'Follow'}
                                    </MyText>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>

                    {/*<MyText style={styles.sectionHeader}>Rating</MyText>*/}
                    <Space/>

                    {/*<ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollContainer} horizontal={true} persistentScrollbar={true}>*/}
                    {/*    <View style={styles.leaderboardRow}>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellLeaderboard}/>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellRank}>Rank</MyText>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellRating}>Rating</MyText>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellGames}><IconFA5 name="fist-raised" size={14} style={{}} color={theme.textNoteColor} /></MyText>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellWon}><IconFA5 name="crown" size={14} style={{}} color={theme.textNoteColor} /></MyText>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellStreak}> </MyText>*/}
                    {/*        <MyText numberOfLines={1} style={styles.cellWon}><IconFA5 name="clock" size={14} style={{}} color={theme.textNoteColor} /></MyText>*/}
                    {/*    </View>*/}
                    {/*    {*/}
                    {/*        data?.leaderboards.map(leaderboard =>*/}
                    {/*                <LeaderboardRow key={leaderboard.leaderboard_id} data={leaderboard}/>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*</ScrollView>*/}

                    <View style={styles.leaderboardRow}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Board</MyText>
                        <MyText numberOfLines={1} style={styles.cellRank}>Rank</MyText>
                        <MyText numberOfLines={1} style={styles.cellRating}>Rating</MyText>
                        <MyText numberOfLines={1} style={styles.cellRating2}>max</MyText>
                        <MyText numberOfLines={1} style={styles.cellRatingChange}>change</MyText>
                    </View>
                    {
                        data?.leaderboards.map(leaderboard =>
                                <LeaderboardRow1 key={leaderboard.leaderboard_id} data={leaderboard}/>
                        )
                    }

                    {
                        !data && Array(2).fill(0).map((a, i) =>
                            <View key={i} style={styles.row}>
                                <TextLoader style={styles.cellLeaderboard}/>
                                <TextLoader style={styles.cellRank}/>
                                <TextLoader style={styles.cellRating}/>
                                <TextLoader style={styles.cellRating2}/>
                                <TextLoader style={styles.cellRatingChange}/>
                            </View>
                        )
                    }
                    <Space/>
                    <View style={styles.leaderboardRow}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Board</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        {/*<MyText numberOfLines={1} style={styles.cellWon}><IconFA5 name="crown" size={14} style={{}} color={theme.textNoteColor} /></MyText>*/}
                        <MyText numberOfLines={1} style={styles.cellWon}>Won</MyText>
                        <MyText numberOfLines={1} style={styles.cellStreak}>Streak</MyText>
                        {/*<MyText numberOfLines={1} style={styles.cellStreak}>max</MyText>*/}
                        {/*<MyText numberOfLines={1} style={styles.cellWon}><IconFA5 name="clock" size={14} style={{}} color={theme.textNoteColor} /></MyText>*/}
                    </View>
                    {
                        data?.leaderboards.map(leaderboard =>
                                <LeaderboardRow2 key={leaderboard.leaderboard_id} data={leaderboard}/>
                        )
                    }

                    {
                        !data && Array(2).fill(0).map((a, i) =>
                            <View key={i} style={styles.row}>
                                <TextLoader style={styles.cellLeaderboard}/>
                                <TextLoader style={styles.cellGames}/>
                                <TextLoader style={styles.cellWon}/>
                                <TextLoader style={styles.cellStreak}/>
                            </View>
                        )
                    }
                </View>
            </View>
    )
}

const useStyles = createStylesheet(theme => StyleSheet.create({
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
        marginTop: 3
    },
    followButtonIcon: {
        color: theme.textNoteColor,
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
    expanded: {
        flex: 1,
    },
}));
