import { Image, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';
import { formatAgo, getLeaderboardAbbr } from '../../helper/util';
import React from 'react';
import { getString } from '../../helper/strings';
import { getLeaderboardColor, getPlayerBackgroundColor } from '../../helper/colors';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { getCivIcon } from '../../helper/civs';
import {Flag, getFlagIcon} from '../../helper/flags';
import {ILeaderboard} from "../../helper/data";
import {composeUserId} from "../../helper/user";
import {Button} from "react-native-paper";
import {ImageLoader} from "../loader/image-loader";
import {TextLoader} from "../loader/text-loader";

interface ILeaderboardRowProps {
    data: ILeaderboard;
}

function LeaderboardRow({data}: ILeaderboardRowProps) {

    const leaderboardInfo = data.leaderboard[0];
    const color = {color: getLeaderboardColor(data.leaderboard_id)};

    return (
            <View style={styles.row}>
                <Text style={StyleSheet.flatten([styles.cellLeaderboard, color])}>
                    {getLeaderboardAbbr(data.leaderboard_id)}
                </Text>
                <Text style={StyleSheet.flatten([styles.cellRank, color])}>
                    #{leaderboardInfo.rank}
                </Text>
                <Text style={StyleSheet.flatten([styles.cellRating, color])}>
                    {leaderboardInfo.rating}
                </Text>
                <Text style={StyleSheet.flatten([styles.cellGames, color])}>
                    {leaderboardInfo.games}
                </Text>
                <Text style={StyleSheet.flatten([styles.cellLastMatch, color])} numberOfLines={1}>
                    {formatAgo(leaderboardInfo.last_match)}
                </Text>
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
    return (
            <View style={styles.container}>
                <View>

                    <View style={styles.row}>
                        <ImageLoader style={styles.countryIcon} source={getFlagIcon(data?.country)}/>
                        <TextLoader ready={data}>{data?.name}</TextLoader>
                        {
                            data?.clan &&
                            <Text> (Clan{':'} {data?.clan})</Text>
                        }

                        {/*<Text>{data.steam_id} {data.profile_id}</Text>*/}
                        {/*<Button*/}
                        {/*    labelStyle={{fontSize: 13, marginVertical: 0}}*/}
                        {/*    contentStyle={{height: 22}}*/}
                        {/*    onPress={() => {}}*/}
                        {/*    mode="contained"*/}
                        {/*    compact*/}
                        {/*    uppercase={false}*/}
                        {/*    dark={true}*/}
                        {/*>*/}
                        {/*    Steam*/}
                        {/*</Button>*/}
                    </View>

                    <View style={styles.row}>
                        <TextLoader ready={data}>{data?.games} Games, {data?.drops} Drops ({(data?.drops / data?.games).toFixed(2)}%)</TextLoader>
                    </View>

                    <Text/>

                    <View style={styles.row}>
                        <Text style={styles.cellLeaderboard}/>
                        <Text style={styles.cellRank}>Rank</Text>
                        <Text style={styles.cellRating}>Rating</Text>
                        <Text style={styles.cellGames}>Games</Text>
                        <Text style={styles.cellLastMatch}>Last Match</Text>
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
                                <TextLoader style={styles.cellLastMatch}/>
                            </View>
                        )
                    }
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    cellLeaderboard: {
        width: 80,
        marginRight: 8,
    },
    cellRank: {
        width: 60,
        marginRight: 8,
    },
    cellRating: {
        width: 50,
        marginRight: 8,
    },
    cellGames: {
        width: 60,
        marginRight: 8,
    },
    cellLastMatch: {
        flex: 1,
        // width: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    container: {
        // marginBottom: 12,
        // backgroundColor: 'red',
    },
    countryIcon: {
        width: 21,
        height: 15,
        marginRight: 5,
    },
});
