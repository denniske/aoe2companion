import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchRatingHistory } from '../api/rating-history';
import { VictoryChart, VictoryTheme, VictoryLine, VictoryScatter } from "victory-native";
import { getLeaderboardAbbr } from '../service/util';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'

interface IRatingHistoryRow {
    leaderboard_id: number;
    data: IRatingHistoryEntry[];
}

interface IRatingProps {
    steam_id: string;
    profile_id: number;
}

const MyLoader = () => {
    const parts = Array(5).fill(0);
    return (
        <ContentLoader viewBox="0 0 350 380" width={350} height={367}>
            <Rect x="0" y="0" rx="3" ry="3" width="350" height="340" />
            {
                parts.map((part, i) => (
                    <Rect key={i} x={i* 73} y="360" rx="3" ry="3" width="60" height="20" />
                ))
            }
        </ContentLoader>
)}

export default function Rating({steam_id, profile_id}: IRatingProps) {

    const [loading, setLoading] = useState(true);
    const [ratingHistories, setRatingHistories] = useState(null as unknown as IRatingHistoryRow[]);

    const game = 'aoe2de';

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
    // {left: 50, top: 50}
    return (
            <View style={styles.container}>
                {
                    !ratingHistories &&
                    <MyLoader/>
                }
                {
                    ratingHistories &&
                    <VictoryChart width={350} height={350} theme={VictoryTheme.material} padding={{left: 50, bottom: 50, top: 15, right: 25}}>
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
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'green'
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginLeft: 10,
        marginRight: 10,
    },
});
