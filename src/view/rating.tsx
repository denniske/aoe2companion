import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from "victory-native";
import { getLeaderboardAbbr } from '../helper/util';
import ContentLoader, { Rect } from 'react-content-loader/native'
import { getLeaderboardColor } from '../helper/colors';
import { IRatingHistoryRow } from '../service/rating';
import { getString } from '../helper/strings';

interface IRatingProps {
    ratingHistories: IRatingHistoryRow[];
}

const MyLoader = () => {
    const parts = Array(5).fill(0);
    return (
            <ContentLoader viewBox="0 0 350 380" width={350} height={367}>
                <Rect x="0" y="0" rx="3" ry="3" width="350" height="340"/>
                {
                    parts.map((part, i) => (
                            <Rect key={i} x={i * 73} y="360" rx="3" ry="3" width="60" height="20"/>
                    ))
                }
            </ContentLoader>
    )
};

export default function Rating({ratingHistories}: IRatingProps) {
    console.log("render rating");

    if (!ratingHistories) {
        return <MyLoader/>;
    }

    return (
            <View style={styles.container}>
                <VictoryChart width={350} height={350} theme={VictoryTheme.material} padding={{left: 50, bottom: 50, top: 20, right: 30}}>
                    {
                        ratingHistories.map(ratingHistory => (
                                <VictoryLine
                                        key={'line-' + ratingHistory.leaderboard_id}
                                        data={ratingHistory.data}
                                        x="timestamp"
                                        y="rating" style={{
                                    data: {stroke: getLeaderboardColor(ratingHistory.leaderboard_id)}
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
                                            data: {fill: getLeaderboardColor(ratingHistory.leaderboard_id)}
                                        }}
                                />
                        ))
                    }
                </VictoryChart>
                <View style={styles.legend}>
                    {
                        ratingHistories.map(ratingHistory => (
                                <Text
                                        key={'legend-' + ratingHistory.leaderboard_id}
                                        style={{paddingHorizontal: 10, paddingVertical: 5, fontSize: 12, color: getLeaderboardColor(ratingHistory.leaderboard_id)}}
                                >
                                    {getLeaderboardAbbr(ratingHistory.leaderboard_id)}
                                </Text>
                        ))
                    }
                </View>
                <Text style={styles.legendDesc}>RM = Random Map DM = Death Match</Text>
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
        flexWrap: 'wrap',
        marginLeft: 10,
        marginRight: 10,
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12
    },
});
