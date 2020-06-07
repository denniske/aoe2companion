import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { formatAgo, getLeaderboardAbbr } from '../service/util';
import React from 'react';
import { getString } from '../service/strings';

interface ILeaderboardRowProps {
    data: ILeaderboard;
}

function LeaderboardRow({data}: ILeaderboardRowProps) {

    const leaderboardInfo = data.leaderboard ? data.leaderboard[0]:null;

    return (
            <View style={styles.row}>
                <Text style={styles.cellRating}>{leaderboardInfo ? leaderboardInfo.rating:''}</Text>
                <Text style={styles.cellLeaderboard}>{getLeaderboardAbbr(data.leaderboard_id)}</Text>
                {
                    leaderboardInfo && (
                            <>
                                <Text style={styles.cellGames}>{leaderboardInfo.games}</Text>
                                <Text style={styles.cellLastMatch}>{formatAgo(leaderboardInfo.last_match)}</Text>
                            </>
                    )
                }
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

export default function Profile({data}: IProfileProps) {

    console.log("leader", data.leaderboards);

    return (
            <View style={styles.container}>
                <Text>{data.country} {data.name}</Text>
                <Text>{data.games} Games, {data.drops} Drops ({(data.drops / data.games).toFixed()}%)</Text>

                <Text/>

                <View style={styles.row}>
                    <Text style={styles.cellRating}>Elo</Text>
                    <Text style={styles.cellLeaderboard}/>
                    <Text style={styles.cellGames}>Games</Text>
                    <Text style={styles.cellLastMatch}>Last Match</Text>
                </View>

                {
                    data.leaderboards.map(leaderboard =>
                            <LeaderboardRow key={leaderboard.leaderboard_id} data={leaderboard}/>
                    )
                }

                <Text/>
            </View>
    )
}


const styles = StyleSheet.create({
    cellLeaderboard: {
        width: 100,
    },
    cellRating: {
        width: 40,
    },
    cellGames: {
        width: 60,
    },
    cellLastMatch: {
        width: 110,
    },
    row: {
        flexDirection: 'row',
    },
    container: {},
});
