import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { formatDateShort, formatMonth, formatTime, formatYear, LeaderboardId } from '@nex/data';
import { getLeaderboardColor, getLeaderboardTextColor } from '../../helper/colors';
import { TextLoader } from './loader/text-loader';
import { usePaperTheme } from '../../theming';
import ButtonPicker from './button-picker';
import { isAfter, subDays, subMonths, subWeeks } from 'date-fns';
import { IProfileRatingsLeaderboard, IProfileResult } from '../../api/helper/api.types';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { orderBy } from 'lodash';

import { CartesianChart, Line, Scatter } from 'victory-native-date';
import { matchFont } from '@shopify/react-native-skia';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { useAuthProfileId } from '@app/queries/all';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-prefs';
import { getTranslation } from '@app/helper/translate';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const fontStyle = {
    fontFamily,
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal",
};
const font = matchFont(fontStyle as any);

interface IRatingProps {
    ratingHistories?: IProfileRatingsLeaderboard[] | null;
    profile?: IProfileResult | null;
    ready: boolean;
}

export default function Rating({ ratingHistories, profile, ready }: IRatingProps) {
    ratingHistories = ready ? ratingHistories : null;

    const paperTheme = usePaperTheme();
    const authProfileId = useAuthProfileId();

    const prefHiddenLeaderboardIds = usePrefData((state) => state.ratingHistoryHiddenLeaderboardIds);
    const savePrefsMutation = useSavePrefsMutation();
    const [hiddenLeaderboardIds, setHiddenLeaderboardIds] = useState<LeaderboardId[]>();

    useEffect(() => {
        if (!authProfileId) return;
        if (!profile) return;

        const isAuthProfile = authProfileId === profile?.profileId;
        if (hiddenLeaderboardIds == null) {
            if (isAuthProfile) {
                setHiddenLeaderboardIds(prefHiddenLeaderboardIds || []);
            } else {
                setHiddenLeaderboardIds([]);
            }
        }
    }, [authProfileId, profile, hiddenLeaderboardIds]);

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
        if (hiddenLeaderboardIds!.includes(leaderboardId)) {
            ids = hiddenLeaderboardIds!.filter((id) => id != leaderboardId);
        } else {
            ids = [...hiddenLeaderboardIds!, leaderboardId];
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

        return ratingHistories?.map((r) => ({
            ...r,
            leaderboardId: r.leaderboardId,
            ratings: r.ratings.filter((d) => since == null || isAfter(d.date!, since)),
        }))
            ;
    }, [ratingHistories, ratingHistoryDuration]);

    const dataset = useMemo(() => {
        const start = new Date();

        if (!filteredRatingHistories) {
            return { yKeys: [], data: [] };
        }

        const data = orderBy(
            filteredRatingHistories
                .flatMap((o) => o.ratings.map((r) => ({
                    x: r.date!,
                    [o.leaderboardId]: r.rating,
                }))),
            ['x'],
        );

        const end = new Date();
        console.log('MEMO CALC data', end.getTime() - start.getTime(), 'ms');

        return {
            yKeys: filteredRatingHistories.filter(h => h.ratings.length > 0).map((o) => o.leaderboardId),
            data,
        };
    }, [filteredRatingHistories]);

    // console.log('ratingHistories', ratingHistories[0]);
    // console.log('filteredRatingHistories', filteredRatingHistories?.[0].ratings.length);

    // if (!filteredRatingHistories?.[0]) {
    //     return <View></View>;
    // }

    // console.log('data', dataset);

    return (
        <View style={styles.container}>
            <View style={styles.durationRow}>
                <ButtonPicker value={ratingHistoryDuration} values={values} formatter={formatDuration} onSelect={nav} />
            </View>

            <ViewLoader ready={dataset.data?.length > 0}>
                <View style={{ width: windowWidth - 40, height: 300 }}>
                    {
                        dataset.data?.length > 0 &&
                        <CartesianChart
                            data={dataset.data}
                            xKey={"x" as never}
                            yKeys={dataset.yKeys as never}
                            axisOptions={{
                                // the chart needs this empty config for some reason
                            }}
                            xAxis={{
                                font,
                                labelColor: paperTheme.colors.onSurface,
                                formatXLabel: formatTick,
                                lineColor: paperTheme.dark? '#454545' : '#BBB',
                            }}
                            yAxis={[{
                                font,
                                labelColor: paperTheme.colors.onSurface,
                                lineColor: paperTheme.dark? '#454545' : '#BBB',
                            }]}
                        >
                            {({ points }) => (
                                <>
                                    {
                                        dataset.yKeys.filter(key => !hiddenLeaderboardIds?.includes(key)).map((key) => (
                                            <Fragment key={key}>
                                                <Line points={(points as any)[key].filter((p: any) => p.yValue != null)} color={getLeaderboardColor(key, paperTheme.dark)} strokeWidth={1.25} />
                                                <Scatter points={(points as any)[key]} shape="circle" radius={1} style="fill" color={getLeaderboardColor(key, paperTheme.dark)} />
                                            </Fragment>
                                        ))
                                    }
                                </>
                            )}
                        </CartesianChart>
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
                                color: getLeaderboardTextColor(ratingHistory.leaderboardId, paperTheme.dark),
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
