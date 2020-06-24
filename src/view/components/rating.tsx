import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory-native";
import {formatDateShort, getLeaderboardAbbr, parseUnixTimestamp} from '../../helper/util';
import ContentLoader, {Rect} from 'react-content-loader/native'
import {getLeaderboardColor} from '../../helper/colors';
import {IRatingHistoryRow} from '../../service/rating';
import {TextLoader} from "../loader/text-loader";
import {ViewLoader} from "../loader/view-loader";

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

    // if (!ratingHistories) {
    //     return <MyLoader/>;
    // }

    const themeWithSystemFont = replaceRobotoWithSystemFont({...VictoryTheme.material});
    // console.log("themeWithSystemFont", themeWithSystemFont);

    // We need to supply our custom tick formatter because otherwise victory native will
    // print too much ticks on the x-axis.
    // const formatTick = (tick: any, index: number, ticks: any[]) => {
    //     return formatDateShort(parseUnixTimestamp(ticks[index]/1000));
    // };

    return (
            <View style={styles.container}>

                <ViewLoader ready={ratingHistories}>
                    <VictoryChart width={Dimensions.get('screen').width - 40} height={300} theme={themeWithSystemFont}
                                  padding={{left: 50, bottom: 30, top: 20, right: 20}}>
                        {/*<VictoryAxis crossAxis tickFormat={formatTick} />*/}
                        {/*<VictoryAxis dependentAxis crossAxis />*/}
                        {
                            ratingHistories?.map(ratingHistory => (
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
                            ratingHistories?.map(ratingHistory => (
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
                </ViewLoader>
                <View style={styles.legend}>
                    {
                        (ratingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                                <TextLoader
                                        key={'legend-' + i}
                                        style={{paddingHorizontal: 10, paddingVertical: 5, fontSize: 12, color: getLeaderboardColor(ratingHistory.leaderboard_id)}}
                                >
                                    {getLeaderboardAbbr(ratingHistory.leaderboard_id)}
                                </TextLoader>
                        ))
                    }
                </View>
                {/*<Text style={styles.legendDesc}>RM = Random Map &nbsp;&nbsp;&nbsp; DM = Death Match</Text>*/}
            </View>
    )
}


const styles = StyleSheet.create({
    chart: {
      backgroundColor: 'yellow',
      width: '100%',
    },
    container: {
        // backgroundColor: 'green',
        // position: "relative"
    },
    // container2: {
    //     backgroundColor: 'purple',
    //     width: '100%',
    //     height: 600,
    //     position: "relative"
    // },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        // backgroundColor: 'red',
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12
    },
});
