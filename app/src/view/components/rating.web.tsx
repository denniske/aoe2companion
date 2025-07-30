import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { formatDateShort, formatMonth, formatTime, formatYear, LeaderboardId } from '@nex/data';
import { getLeaderboardColor, getLeaderboardTextColor } from '../../helper/colors';
import { TextLoader } from './loader/text-loader';
import { useAppTheme } from '../../theming';
import ButtonPicker from './button-picker';
import { isAfter, subDays, subMonths, subWeeks, subYears } from 'date-fns';

import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from 'victory-native';

import { IProfileRatingsLeaderboard, IProfileResult } from '../../api/helper/api.types';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { useColorScheme } from 'nativewind';
import { cloneDeep, merge } from 'lodash';
import { ViewLoader } from '@app/view/components/loader/view-loader';

import tw from '@app/tailwind';
import { useAuthProfileId } from '@app/queries/all';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { useTranslation } from '@app/helper/translate';
import { getRatingTimespan } from '@app/utils/rating';

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

let themeWithSystemFont = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

themeWithSystemFont = merge(themeWithSystemFont, {
    axis: {
        style: {
            tickLabels: {
                fill: tw.color('text-black'),
            },
        },
    },
    line: {
        style: {
            labels: {
                fill: tw.color('text-black'),
            },
        },
    },
});

let themeWithSystemFontDark = replaceRobotoWithSystemFont(cloneDeep(VictoryTheme.material));

themeWithSystemFontDark = merge(themeWithSystemFontDark, {
    axis: {
        style: {
            tickLabels: {
                fill: tw.color('text-white'),
            },
        },
    },
    line: {
        style: {
            labels: {
                fill: tw.color('text-white'),
            },
        },
    },
});

const NewVictoryTheme = { ...VictoryTheme, custom: themeWithSystemFont, customDark: themeWithSystemFontDark };





interface IRatingProps {
    ratingHistories?: IProfileRatingsLeaderboard[] | null;
    profile?: IProfileResult | null;
    ready: boolean;
}

export default function Rating({ ratingHistories, profile, ready }: IRatingProps) {
    const getTranslation = useTranslation();
    ratingHistories = ready ? ratingHistories : null;

    const theme = useAppTheme();
    const { colorScheme } = useColorScheme();
    const authProfileId = useAuthProfileId();

    const prefHiddenLeaderboardIds = usePrefData((state) => state?.ratingHistoryHiddenLeaderboardIds);
    const savePrefsMutation = useSavePrefsMutation();
    const [hiddenLeaderboardIds, setHiddenLeaderboardIds] = useState<LeaderboardId[]>([]);
    const [appliedHiddenLeaderboardIds, setAppliedHiddenLeaderboardIds] = useState(false);

    useEffect(() => {
        if (!authProfileId) return;
        if (!profile) return;
        if (appliedHiddenLeaderboardIds) return;

        if (authProfileId === profile?.profileId) {
            setHiddenLeaderboardIds(prefHiddenLeaderboardIds || []);
        } else {
            setHiddenLeaderboardIds([]);
        }
        setAppliedHiddenLeaderboardIds(true);
    }, [authProfileId, profile, appliedHiddenLeaderboardIds]);

    // Changing the pref will trigger a rerender on every chart. Should we do this?
    // const ratingHistoryDuration = useSelector((state) => state.prefs.ratingHistoryDuration) || 'max';
    const [ratingHistoryDuration, setRatingHistoryDuration] = useState<string>('max');
    const values: string[] = ['max', '3m', '1m', '1w', '1d'];
    const formatDuration = (duration: string) => getTranslation(`main.profile.ratinghistory.time.${duration}` as any);

    const nav = async (str: any) => {
        setRatingHistoryDuration(str);
        savePrefsMutation.mutate({ ratingHistoryDuration: str });
    };

    const toggleLeaderboard = (leaderboardId: LeaderboardId) => {
        let ids = [];
        if (hiddenLeaderboardIds.includes(leaderboardId)) {
            ids = hiddenLeaderboardIds.filter((id) => id != leaderboardId);
        } else {
            ids = [...hiddenLeaderboardIds, leaderboardId];
        }
        setHiddenLeaderboardIds(ids);
        if (authProfileId === profile?.profileId) {
            savePrefsMutation.mutate({ ratingHistoryHiddenLeaderboardIds: hiddenLeaderboardIds });
        }
    };

    // We need to supply our custom tick formatter because otherwise victory native will
    // print too much ticks on the x-axis.
    const formatTick = (date: Date) => {
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(date);
    };

    const filteredRatingHistories = useMemo(() => {
        const since = getRatingTimespan(ratingHistoryDuration);

        return ratingHistories?.map((r) => ({
            ...r,
            leaderboardId: r.leaderboardId,
            ratings: r.ratings.filter((d) => since == null || isAfter(d.date!, since)),
        }))
            ;
    }, [ratingHistories, ratingHistoryDuration]);

    // console.log('ratingHistories', ratingHistories[0]);
    // console.log('filteredRatingHistories', filteredRatingHistories?.[0].ratings.length);

    // console.log('------');
    // console.log('filteredRatingHistories', filteredRatingHistories?.[0].ratings);
    // console.log('filteredRatingHistories', filteredRatingHistories?.[0].ratings.length);

    const since = getRatingTimespan(ratingHistoryDuration);
    let firstDate = since ?? filteredRatingHistories?.[0]?.ratings?.[0]?.date ?? subYears(new Date(), 1);

    // console.log('filteredRatingHistories?.[0]', filteredRatingHistories?.[0])

    // if (!filteredRatingHistories?.[0]) {
    //     return <View></View>;
    // }

    const hasData = filteredRatingHistories?.some((rh) => rh.ratings.length > 0);

    return (
        <View style={styles.container}>
            <View style={styles.durationRow}>
                <ButtonPicker value={ratingHistoryDuration} values={values} formatter={formatDuration} onSelect={nav} />
            </View>

            <ViewLoader ready={hasData}>
                <View style={{ width: windowWidth - 40, height: 300 }}>
                    {
                        hasData &&

                        <VictoryChart
                            width={windowWidth - 40}
                            height={300}
                            theme={colorScheme === 'dark' ? NewVictoryTheme.customDark : NewVictoryTheme.custom}
                            padding={{ left: 50, bottom: 30, top: 20, right: 20 }}
                            scale={{ x: 'time' }}
                            // containerComponent={
                            //     <VictoryZoomContainer key={'zoom'}/>
                            // }
                        >
                            <VictoryAxis crossAxis tickFormat={formatTick} fixLabelOverlap={true} scale={'time'} domain={[firstDate, new Date()] as any} />
                            <VictoryAxis dependentAxis crossAxis />
                            {filteredRatingHistories
                                ?.filter((rh) => !hiddenLeaderboardIds?.includes(rh.leaderboardId))
                                .map((ratingHistory) => (
                                    <VictoryLine
                                        name={'line-' + ratingHistory.leaderboardId}
                                        key={'line-' + ratingHistory.leaderboardId}
                                        data={ratingHistory.ratings}
                                        x="date"
                                        y="rating"
                                        style={{
                                            data: { stroke: getLeaderboardColor(ratingHistory.leaderboardId, theme.dark) },
                                        }}
                                    />
                                ))}
                            {filteredRatingHistories
                                ?.filter((rh) => !hiddenLeaderboardIds?.includes(rh.leaderboardId))
                                .map((ratingHistory) => (
                                    <VictoryScatter
                                        name={'scatter-' + ratingHistory.leaderboardId}
                                        key={'scatter-' + ratingHistory.leaderboardId}
                                        data={ratingHistory.ratings}
                                        x="date"
                                        y="rating"
                                        size={1.5}
                                        style={{
                                            data: { fill: getLeaderboardColor(ratingHistory.leaderboardId, theme.dark) },
                                        }}
                                    />
                                ))}
                        </VictoryChart>
                    }

                </View>
            </ViewLoader>
            <View style={styles.legend}>
                {(filteredRatingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                    <TouchableOpacity key={'legend-' + i} onPress={() => toggleLeaderboard(ratingHistory.leaderboardId)}>
                        <TextLoader
                            width={100}
                            key={'legend-' + i}
                            style={{
                                opacity: hiddenLeaderboardIds?.includes(ratingHistory.leaderboardId) ? 0.5 : 1,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                fontSize: 12,
                                color: getLeaderboardTextColor(ratingHistory.leaderboardId, theme.dark),
                            }}
                        >
                            {ratingHistory.abbreviation}
                        </TextLoader>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
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
        marginBottom: 10,
    },
    container: {
        // backgroundColor: 'green',
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
        fontSize: 12,
    },
});
