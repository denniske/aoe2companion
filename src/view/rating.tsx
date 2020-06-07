import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchRatingHistory } from '../api/rating-history';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryLegend } from "victory-native";
import { getLeaderboardAbbr } from '../service/util';

interface IRatingHistoryRow {
    leaderboard_id: number;
    data: IRatingHistoryEntry[];
}

interface IRatingProps {
    steam_id: string;
    profile_id: number;
}

export default function Rating({steam_id, profile_id}: IRatingProps) {

    const [loading, setLoading] = useState(true);
    const [ratingHistories, setRatingHistories] = useState(null as unknown as IRatingHistoryRow[]);

    const game = 'aoe2de';
    // const steam_id = '76561198081486543';
    // const steam_id = '76561197995781128';
    // const profile_id = 209525;

    console.log("render rating");

    const loadData = async () => {
        setLoading(true);

        console.log("loading ratings");

        let ratingHistories = await Promise.all([
            fetchRatingHistory(game, 0, 0, 500, {steam_id}),
            fetchRatingHistory(game, 1, 0, 500, {steam_id}),
            fetchRatingHistory(game, 2, 0, 500, {steam_id}),
            fetchRatingHistory(game, 3, 0, 500, {steam_id}),
            fetchRatingHistory(game, 4, 0, 500, {steam_id}),
        ]);

        let ratingHistoryRows = ratingHistories.map((rh, i) => ({
            leaderboard_id: i,
            data: rh,
        }));

        ratingHistoryRows = ratingHistoryRows.filter(rh => rh.data?.length);

        // console.log("ratingHistoryRows", ratingHistoryRows);

        setRatingHistories(ratingHistoryRows);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const strokes = [
        '#757476',
        '#D65154',
        '#E19659',
        '#6188C1',
        '#8970AE',
    ];

    return (
            <View style={styles.container}>
                {
                    !ratingHistories &&
                    <Text>Loading</Text>
                }
                {
                    ratingHistories &&
                    <VictoryChart width={350} theme={VictoryTheme.material}>
                        {
                            ratingHistories.map(ratingHistory => (
                                    <VictoryLine
                                            key={'line-' + ratingHistory.leaderboard_id}
                                            data={ratingHistory.data}
                                            x="timestamp"
                                            y="rating" style={{
                                        data: {stroke: strokes[ratingHistory.leaderboard_id]}
                                    }}
                                    />
                            ))
                        }

                        {
                            ratingHistories.map(ratingHistory => (
                                    <VictoryScatter
                                            name="ad"
                                            key={'scatter-' + ratingHistory.leaderboard_id}
                                            data={ratingHistory.data}
                                            x="timestamp"
                                            y="rating"
                                            size={1.5}
                                            style={{
                                                data: {fill: strokes[ratingHistory.leaderboard_id]}
                                            }}
                                    />
                            ))
                        }
                    </VictoryChart>
                }

                <View style={styles.legend}>
                {
                    ratingHistories && ratingHistories.map(ratingHistory => (
                            <Text
                                    key={'legend-' + ratingHistory.leaderboard_id}
                                    style={{fontSize: 12, color:strokes[ratingHistory.leaderboard_id]}}
                            >
                                {getLeaderboardAbbr(ratingHistory.leaderboard_id)}
                            </Text>
                    ))
                }
                </View>

                {/*<Text>{ratingHistories?.length}</Text>*/}
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green'
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginLeft: 10,
        marginRight: 10,
    },
});
