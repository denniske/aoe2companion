import { Image, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';
import { formatAgo, getLeaderboardAbbr } from '../../helper/util';
import React from 'react';
import { getString } from '../../helper/strings';
import { getLeaderboardColor, getPlayerBackgroundColor } from '../../helper/colors';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { getCivIcon } from '../../helper/civs';
import { getFlagIcon } from '../../helper/flags';
import {ILeaderboard} from "../../helper/data";

interface ILeaderboardRowProps {
    data: ILeaderboard;
}

function LeaderboardRow({data}: ILeaderboardRowProps) {

    const leaderboardInfo = data.leaderboard[0];
    const color = {color: getLeaderboardColor(data.leaderboard_id)};

    return (
            <View style={styles.row}>
                <Text style={StyleSheet.flatten([styles.cellRank, color])}>
                    #{leaderboardInfo.rank}
                </Text>
                <Text style={StyleSheet.flatten([styles.cellRating, color])}>
                    {leaderboardInfo.rating}
                </Text>
                <Text style={StyleSheet.flatten([styles.cellLeaderboard, color])}>
                    {getLeaderboardAbbr(data.leaderboard_id)}
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
    country: string;
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

const MyLoader = () => {
    return (
            <ContentLoader viewBox="0 0 350 150" width={350} height={150}>
                <Rect x="0" y="0" rx="3" ry="3" width="100" height="20"/>
                <Rect x="0" y="30" rx="3" ry="3" width="200" height="20"/>
                <Rect x="0" y="70" rx="3" ry="3" width="350" height="20"/>
                <Rect x="0" y="100" rx="3" ry="3" width="350" height="20"/>
                <Rect x="0" y="130" rx="3" ry="3" width="350" height="20"/>
            </ContentLoader>
    )
};

export default function Profile({data}: IProfileProps) {
    if (!data) {
        return <View style={styles.container}><MyLoader/></View>;
    }

    return (
            <View style={styles.container}>
                <View>
                    {/*<Text>{data.steam_id} {data.profile_id}</Text>*/}

                    <View style={styles.row}>
                        {
                            data.country &&
                            <Image style={styles.countryIcon} source={getFlagIcon(data.country)}/>
                        }
                        <Text>{data.name}</Text>
                    </View>

                    <Text>{data.games} Games, {data.drops} Drops ({(data.drops / data.games).toFixed(2)}%)</Text>

                    <Text/>

                    <View style={styles.row}>
                        <Text style={styles.cellRank}>Elo</Text>
                        <Text style={styles.cellRating}/>
                        <Text style={styles.cellLeaderboard}/>
                        <Text style={styles.cellGames}>Games</Text>
                        <Text style={styles.cellLastMatch}>Last Match</Text>
                    </View>

                    {
                        data.leaderboards.map(leaderboard =>
                                <LeaderboardRow key={leaderboard.leaderboard_id} data={leaderboard}/>
                        )
                    }
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    cellLeaderboard: {
        width: 100,
    },
    cellRank: {
        width: 60,
    },
    cellRating: {
        width: 40,
    },
    cellGames: {
        width: 60,
    },
    cellLastMatch: {
        flex: 1,
        // width: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        marginBottom: 12,
        // backgroundColor: 'red',
    },
    countryIcon: {
        width: 21,
        height: 15,
        marginRight: 5,
    },
});
