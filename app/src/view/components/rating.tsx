import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {formatDateShort, formatMonth, formatTime, formatYear, LeaderboardId} from '@nex/data';
import {getLeaderboardColor, getLeaderboardTextColor} from '../../helper/colors';
import {TextLoader} from "./loader/text-loader";
import {ViewLoader} from "./loader/view-loader";
import {merge} from 'lodash';
import {useAppTheme, usePaperTheme} from "../../theming";
import {setPrefValue, useMutate, useSelector} from "../../redux/reducer";
import ButtonPicker from "./button-picker";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import {isAfter, subDays, subMonths, subWeeks} from "date-fns";
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "../../helper/victory";
import {getTranslation} from '../../helper/translate';
import {IProfileRatingsLeaderboard, IProfileResult} from "../../api/helper/api.types";
import { windowWidth } from '@app/app/statistics';

interface IRatingProps {
    ratingHistories?: IProfileRatingsLeaderboard[] | null;
    profile?: IProfileResult | null;
    ready: boolean;
}

function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function (key) {
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

export default function Rating({ratingHistories, profile, ready}: IRatingProps) {
    ratingHistories = ready ? ratingHistories : null;

    // console.log('ratingHistories', ratingHistories);

    const paperTheme = usePaperTheme();
    const appTheme = useAppTheme();
    const mutate = useMutate();
    const auth = useSelector(state => state.auth);

    const prefHiddenLeaderboardIds = useSelector(state => state.prefs.ratingHistoryHiddenLeaderboardIds);
    const [hiddenLeaderboardIds, setHiddenLeaderboardIds] = useState<LeaderboardId[]>();

    useEffect(() => {
        if (!auth) return;
        if (!profile) return;

        // console.log('auth', auth);
        // console.log('profile', profile);
        // console.log('prefHiddenLeaderboardIds', prefHiddenLeaderboardIds);
        // console.log('hiddenLeaderboardIds', hiddenLeaderboardIds);

        const isAuthProfile = auth?.profileId === profile?.profileId;
        if (hiddenLeaderboardIds == null) {
            if (isAuthProfile) {
                setHiddenLeaderboardIds(prefHiddenLeaderboardIds || []);
                // console.log('setHiddenLeaderboardIds', prefHiddenLeaderboardIds);
            } else {
                setHiddenLeaderboardIds([]);
                // console.log('setHiddenLeaderboardIds', []);
            }
        } else {
            if (isAuthProfile) {
                mutate(setPrefValue('ratingHistoryHiddenLeaderboardIds', hiddenLeaderboardIds));
                saveCurrentPrefsToStorage();
                // console.log('SAVED setHiddenLeaderboardIds', hiddenLeaderboardIds);
            }
        }
    }, [auth, profile, hiddenLeaderboardIds]);

    const [filteredRatingHistories, setFilteredRatingHistories] = useState<IProfileRatingsLeaderboard[] | null | undefined>();

    const ratingHistoryDuration = useSelector(state => state.prefs.ratingHistoryDuration) || 'max';
    const values: string[] = [
        'max',
        '3m',
        '1m',
        '1w',
        '1d',
    ];
    const formatDuration = (duration: string) => getTranslation(`main.profile.ratinghistory.time.${duration}` as any);

    const nav = async (str: any) => {
        mutate(setPrefValue('ratingHistoryDuration', str));
        await saveCurrentPrefsToStorage();
    };

    const toggleLeaderboard = (leaderboardId: LeaderboardId) => {
        if (hiddenLeaderboardIds!.includes(leaderboardId)) {
            setHiddenLeaderboardIds(hiddenLeaderboardIds!.filter(id => id != leaderboardId));
        } else {
            setHiddenLeaderboardIds([...hiddenLeaderboardIds!, leaderboardId]);
        }
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

    useEffect(() => {
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

        // console.log('since', since);
        // console.log('ratingHistories', ratingHistories[0]);
        setFilteredRatingHistories(
            ratingHistories?.map(r => ({
                ...r,
                leaderboardId: r.leaderboardId,
                ratings: r.ratings.filter(d => since == null || isAfter(d.date!, since)),
            }))
        );
    }, [ratingHistories, ratingHistoryDuration]);

    // console.log('ratingHistories', ratingHistories[0]);
    // console.log('filteredRatingHistories', filteredRatingHistories?.[0]);

    return (
        <View style={styles.container}>
            <View style={styles.durationRow}>
                <ButtonPicker value={ratingHistoryDuration} values={values} formatter={formatDuration} onSelect={nav}/>
            </View>

            <ViewLoader ready={filteredRatingHistories}>
                <VictoryChart width={windowWidth - 40} height={300} theme={themeWithSystemFont}
                              padding={{left: 50, bottom: 30, top: 20, right: 20}}
                              scale={{x: "time"}}
                    // containerComponent={
                    //     <VictoryZoomContainer key={'zoom'}/>
                    // }
                >
                    <VictoryAxis crossAxis tickFormat={formatTick} fixLabelOverlap={true}/>
                    <VictoryAxis dependentAxis crossAxis/>
                    {
                        filteredRatingHistories?.filter(rh => !hiddenLeaderboardIds?.includes(rh.leaderboardId)).map(ratingHistory => (
                            <VictoryLine
                                name={'line-' + ratingHistory.leaderboardId}
                                key={'line-' + ratingHistory.leaderboardId}
                                data={ratingHistory.ratings}
                                x="date"
                                y="rating" style={{
                                data: {stroke: getLeaderboardColor(ratingHistory.leaderboardId, paperTheme.dark)}
                            }}
                            />
                        ))
                    }
                    {
                        filteredRatingHistories?.filter(rh => !hiddenLeaderboardIds?.includes(rh.leaderboardId)).map(ratingHistory => (
                            <VictoryScatter
                                name={'scatter-' + ratingHistory.leaderboardId}
                                key={'scatter-' + ratingHistory.leaderboardId}
                                data={ratingHistory.ratings}
                                x="date"
                                y="rating"
                                size={1.5}
                                style={{
                                    data: {fill: getLeaderboardColor(ratingHistory.leaderboardId, paperTheme.dark)}
                                }}
                            />
                        ))
                    }
                </VictoryChart>
            </ViewLoader>
            <View style={styles.legend}>
                {
                    (filteredRatingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                        <TouchableOpacity key={'legend-' + i}
                                          onPress={() => toggleLeaderboard(ratingHistory.leaderboardId)}>
                            <TextLoader
                                width={100}
                                key={'legend-' + i}
                                style={{
                                    opacity: hiddenLeaderboardIds?.includes(ratingHistory.leaderboardId) ? 0.5 : 1,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    fontSize: 12,
                                    color: getLeaderboardTextColor(ratingHistory.leaderboardId, paperTheme.dark)
                                }}
                            >
                                {ratingHistory.abbreviation}
                            </TextLoader>
                        </TouchableOpacity>
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
