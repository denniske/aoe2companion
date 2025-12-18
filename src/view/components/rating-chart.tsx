import { Platform, View } from 'react-native';
import React, { Fragment, useMemo } from 'react';
import { LeaderboardId } from '@nex/data';
import { getLeaderboardColor } from '../../helper/colors';
import { useAppTheme } from '../../theming';
import { IProfileRatingsLeaderboard } from '../../api/helper/api.types';
import { orderBy } from 'lodash';

import { CartesianChart, Line, Scatter } from 'victory-native-date';
import { matchFont } from '@shopify/react-native-skia';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const fontStyle = {
    fontFamily,
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal",
};
const font = matchFont(fontStyle as any);

interface IRatingChartProps {
    formatTick: (date: Date) => string;
    ratingHistoryDuration?: string;
    filteredRatingHistories: Array<IProfileRatingsLeaderboard & {label?: string, color?: string}> | null | undefined;
    hiddenLeaderboardIds: LeaderboardId[];
    width: number;
}

export default function RatingChart(props: IRatingChartProps) {
    const {
        formatTick,
        ratingHistoryDuration,
        filteredRatingHistories,
        hiddenLeaderboardIds,
    } = props;

    const theme = useAppTheme();

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

        if (data.length > 0) {
            data.push({ x: new Date() });
        }

        const end = new Date();
        console.log('MEMO CALC data', end.getTime() - start.getTime(), 'ms');

        return {
            yKeys: filteredRatingHistories.filter(h => h.ratings.length > 0).map((o) => o.leaderboardId),
            data,
        };
    }, [filteredRatingHistories]);

    // console.log('dataset', dataset);

    if (dataset.data?.length === 0) {
        return <View></View>;
    }

    return (
        <CartesianChart
            data={dataset.data}
            xKey={"x" as never}
            yKeys={dataset.yKeys as never}
            axisOptions={{
                // the chart needs this empty config for some reason
            }}
            xAxis={{
                font,
                labelColor: theme.textColor,
                formatXLabel: formatTick,
                lineColor: theme.dark? '#454545' : '#BBB',
            }}
            yAxis={[{
                font,
                labelColor: theme.textColor,
                lineColor: theme.dark? '#454545' : '#BBB',
            }]}
        >
            {({ points }) => (
                <>
                    {
                        dataset.yKeys.filter(key => !hiddenLeaderboardIds?.includes(key)).map((key) => {
                            // console.log('Rendering line for', key, !!(points as any)[key]);
                            return (
                                <Fragment key={key}>
                                    <Line
                                        points={(points as any)[key].filter((p: any) => p.yValue != null)}
                                        color={
                                            filteredRatingHistories?.find((h) => h.leaderboardId === key)?.color ??
                                            getLeaderboardColor(key, theme.dark)
                                        }
                                        strokeWidth={1.25}
                                    />
                                    <Scatter
                                        points={(points as any)[key]}
                                        shape="circle"
                                        radius={1}
                                        style="fill"
                                        color={
                                            filteredRatingHistories?.find((h) => h.leaderboardId === key)?.color ??
                                            getLeaderboardColor(key, theme.dark)
                                        }
                                    />
                                </Fragment>
                            );
                        })
                    }
                </>
            )}
        </CartesianChart>
    );
}
