import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { formatDateShort, formatMonth, formatTime, formatYear } from '@nex/data';
import {getLeaderboardColor, getLeaderboardTextColor} from '../../helper/colors';
import {IRatingHistoryRow} from '../../service/rating';
import {TextLoader} from "./loader/text-loader";
import {ViewLoader} from "./loader/view-loader";
import {formatLeaderboardId} from "../../helper/leaderboards";
import {capitalize, merge} from "lodash-es";
import {useAppTheme, usePaperTheme} from "../../theming";
import {setPrefValue, useMutate, useSelector} from "../../redux/reducer";
import {MyText} from "./my-text";
import ButtonPicker from "./button-picker";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import {isAfter, subDays, subMonths, subWeeks} from "date-fns";
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "../../helper/victory";
import {windowWidth} from "../leaderboard.page";
import {getTranslation} from '../../helper/translate';

interface IRatingProps {
    ratingHistories: IRatingHistoryRow[] | null;
    ready: boolean;
}

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

export default function Rating({ratingHistories, ready}: IRatingProps) {
    ratingHistories = ready ? ratingHistories : null;

    const paperTheme = usePaperTheme();
    const appTheme = useAppTheme();
    const mutate = useMutate();

    const ratingHistoryDuration = useSelector(state => state.prefs.ratingHistoryDuration) || 'max';
    const values: string[] = [
        'max',
        '3m',
        '1m',
        '1w',
        '1d',
    ];
    const formatDuration = (duration: string) => getTranslation(`main.profile.ratinghistory.time.${duration}`);

    const nav = async (str: any) => {
        mutate(setPrefValue('ratingHistoryDuration', str));
        await saveCurrentPrefsToStorage();
    };

    let themeWithSystemFont = replaceRobotoWithSystemFont({...VictoryTheme.material});

    const themeCustomizations = {
        axis: {
            style: {
                tickLabels: {
                    fill: appTheme.textColor,
                },
            },
        },
    };

    themeWithSystemFont = merge(themeWithSystemFont, themeCustomizations);

    // We need to supply our custom tick formatter because otherwise victory native will
    // print too much ticks on the x-axis.
    const formatTick = (tick: any, index: number, ticks: any[]) => {
        const date = ticks[index] as Date;
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(ticks[index]);
    };

    // https://formidable.com/open-source/victory/guides/zoom-on-large-datasets/

    let since: any = null;
    switch (ratingHistoryDuration) {
        case '3m':
            since = subMonths(new Date(), 3);
            break;
        case '1m':
            since = subMonths(new Date(), 1);
            break;
        case '1w':
            since = subWeeks(new Date(), 1);
            break;
        case '1d':
            since = subDays(new Date(), 1);
            break;
    }

    if (ratingHistories && since != null) {
        ratingHistories = ratingHistories.map(r => ({
            leaderboard_id: r.leaderboard_id,
            data: r.data.filter(d => isAfter(d.timestamp!, since)),
        }));
    }

    return (
            <View style={styles.container}>
                <View style={styles.durationRow}>
                    <ButtonPicker value={ratingHistoryDuration} values={values} formatter={formatDuration} onSelect={nav}/>
                </View>

                <ViewLoader ready={ratingHistories}>
                    <VictoryChart width={windowWidth - 40} height={300} theme={themeWithSystemFont}
                                  padding={{left: 50, bottom: 30, top: 20, right: 20}}
                                  scale={{ x: "time" }}
                                  // containerComponent={
                                  //     <VictoryZoomContainer key={'zoom'}/>
                                  // }
                    >
                        <VictoryAxis crossAxis tickFormat={formatTick} fixLabelOverlap={true} />
                        <VictoryAxis dependentAxis crossAxis />
                        {
                            ratingHistories?.map(ratingHistory => (
                                <VictoryLine
                                    name={'line-' + ratingHistory.leaderboard_id}
                                    key={'line-' + ratingHistory.leaderboard_id}
                                    data={ratingHistory.data}
                                    x="timestamp"
                                    y="rating" style={{
                                    data: {stroke: getLeaderboardColor(ratingHistory.leaderboard_id, paperTheme.dark)}
                                }}
                                />
                            ))
                        }
                        {
                            ratingHistories?.map(ratingHistory => (
                                <VictoryScatter
                                    name={'scatter-' + ratingHistory.leaderboard_id}
                                    key={'scatter-' + ratingHistory.leaderboard_id}
                                    data={ratingHistory.data}
                                    x="timestamp"
                                    y="rating"
                                    size={1.5}
                                    style={{
                                        data: {fill: getLeaderboardColor(ratingHistory.leaderboard_id, paperTheme.dark)}
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
                                width={100}
                                key={'legend-' + i}
                                style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    fontSize: 12,
                                    color: getLeaderboardTextColor(ratingHistory.leaderboard_id, paperTheme.dark)
                                }}
                            >
                                {formatLeaderboardId(ratingHistory.leaderboard_id)}
                            </TextLoader>
                        ))
                    }
                </View>
                {/*<MyText style={styles.legendDesc}>RM = Random Map &nbsp;&nbsp;&nbsp; DM = Death Match</MyText>*/}
            </View>
    )
}


const styles = StyleSheet.create({
    chart: {
      backgroundColor: 'yellow',
      width: '100%',
    },
    durationRow: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        // justifyContent: 'flex-end',
        marginBottom: 10,
    },
    container: {
        // backgroundColor: 'green',
        // position: "relative"
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginTop: 10,
        // backgroundColor: 'red',
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12
    },
});
