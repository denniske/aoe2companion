import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { formatAgo, getLeaderboardAbbr } from '../../helper/util';
import React from 'react';
import { getLeaderboardColor } from '../../helper/colors';
import {Flag, getFlagIcon} from '../../helper/flags';
import {ILeaderboard} from "../../helper/data";
import {ImageLoader} from "./loader/image-loader";
import {TextLoader} from "./loader/text-loader";
import Icon from "react-native-vector-icons/FontAwesome5";
import {setFollowing, useMutate, useSelector} from "../../redux/reducer";
import {sameUser} from "../../helper/user";
import {toggleFollowingInStorage} from "../../service/storage";
import {MyText} from "./my-text";

interface ILeaderboardRowProps {
    data: ILeaderboard;
}

function LeaderboardRow({data}: ILeaderboardRowProps) {

    const leaderboardInfo = data.leaderboard[0];
    const color = {color: getLeaderboardColor(data.leaderboard_id)};

    return (
            <View style={styles.row}>
                <MyText style={StyleSheet.flatten([styles.cellLeaderboard, color])}>
                    {getLeaderboardAbbr(data.leaderboard_id)}
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
                    {formatAgo(leaderboardInfo.last_match)}
                </MyText>
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
    leaderboards: ILeaderboard[];
    games: number;
    drops: number;
}

interface IProfileProps {
    data: IProfile;
}

export default function Profile({data}: IProfileProps) {
    const mutate = useMutate();
    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);
    const followingThisUser = !!following.find(f => data && sameUser(f, data));

    const toggleFollowing = async () => {
        const following = await toggleFollowingInStorage(data);
        if (following) {
            mutate(setFollowing(following));
        }
    };

    return (
            <View style={styles.container}>
                <View>

                    <View style={styles.row}>
                        <View>
                            <View style={styles.row}>
                                <ImageLoader style={styles.countryIcon} source={getFlagIcon(data?.country)}/>
                                <TextLoader width={100}>{data?.name}</TextLoader>
                                {
                                    data?.clan &&
                                    <MyText> (Clan{':'} {data?.clan})</MyText>
                                }
                            </View>
                            <View style={styles.row}>
                                <TextLoader width={180} ready={data}>{data?.games} Games, {data?.drops} Drops
                                    ({(data?.drops / data?.games).toFixed(2)}%)</TextLoader>
                            </View>
                        </View>
                        <View style={styles.expanded}/>
                        {
                            data && (auth == null || !sameUser(auth, data)) &&
                            <TouchableOpacity onPress={toggleFollowing}>
                                <View style={styles.followButton}>
                                    <Icon solid={followingThisUser} name="heart" size={22} style={styles.followButtonIcon}/>
                                    <MyText style={styles.followButtonText}>
                                        {followingThisUser ? 'Unfollow' : 'Follow'}
                                    </MyText>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>

                    <MyText/>

                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}/>
                        <MyText numberOfLines={1} style={styles.cellRank}>Rank</MyText>
                        <MyText numberOfLines={1} style={styles.cellRating}>Rating</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>Last Match</MyText>
                    </View>

                    {
                        data?.leaderboards.map(leaderboard =>
                                <LeaderboardRow key={leaderboard.leaderboard_id} data={leaderboard}/>
                        )
                    }

                    {
                        !data && Array(2).fill(0).map((a, i) =>
                            <View key={i} style={styles.row}>
                                <TextLoader style={styles.cellLeaderboard}/>
                                <TextLoader style={styles.cellRank}/>
                                <TextLoader style={styles.cellRating}/>
                                <TextLoader style={styles.cellGames}/>
                                <TextLoader style={styles.cellWon}/>
                            </View>
                        )
                    }
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
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
        color: '#666',
        marginTop: 3
    },
    followButtonIcon: {
        color: '#666',
    },
    cellLeaderboard: {
        // backgroundColor: 'red',
        width: 70,
        marginRight: 5,
    },
    cellRank: {
        width: 60,
        marginRight: 5,
    },
    cellRating: {
        width: 50,
        marginRight: 5,
    },
    cellGames: {
        width: 60,
        marginRight: 5,
    },
    cellWon: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
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
});
