import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory-native";
import {formatDateShort, getLeaderboardAbbr, parseUnixTimestamp} from '../../helper/util';
import ContentLoader, {Rect} from 'react-content-loader/native'
import {getLeaderboardColor} from '../../helper/colors';
import {IRatingHistoryRow} from '../../service/rating';

interface IRatingProps {
    ratingHistories: IRatingHistoryRow[];
}

const MyLoader = () => {
    const legendParts = Array(5).fill(0);
    return (
            <ContentLoader viewBox="0 0 350 360" width={350} height={360}>
                <Rect x="0" y="0" rx="3" ry="3" width="350" height="320"/>
                {
                    legendParts.map((part, i) => (
                            <Rect key={i} x={i * 73} y="340" rx="3" ry="3" width="60" height="20"/>
                    ))
                }
            </ContentLoader>
    )
};


function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function(key) {
        const value = obj[key];
        if (key === 'fontFamily') {
            obj[key] = obj[key].replace("'Roboto',", "'System',");
        }
        if (typeof value === 'object') {
            replaceRobotoWithSystemFont(obj[key]);
        }
    });
    return obj;
}


export default function Rating({ratingHistories}: IRatingProps) {
    // console.log("render rating");

    if (!ratingHistories) {
        return <MyLoader/>;
    }

    const themeWithSystemFont = replaceRobotoWithSystemFont({...VictoryTheme.material});

    // We need to supply our custom tick formatter because otherwise victory native will
    // print too much ticks on the x-axis.
    const formatTick = (tick: any, index: number, ticks: any[]) => {
        return formatDateShort(parseUnixTimestamp(ticks[index]/1000));
    };

    return (
            <View style={styles.container}>
                <VictoryChart width={350} height={350} theme={themeWithSystemFont} padding={{left: 50, bottom: 50, top: 20, right: 30}}>
                    <VictoryAxis crossAxis tickFormat={formatTick} />
                    <VictoryAxis dependentAxis crossAxis />
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
