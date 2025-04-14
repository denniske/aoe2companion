import { Platform, StyleSheet, View } from 'react-native';
import React, { Fragment, useMemo } from 'react';
import { formatDateShort, formatMonth, formatTime, formatYear } from '@nex/data';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { orderBy } from 'lodash';

import { CartesianChart, Line, Scatter } from 'victory-native-current';
import { matchFont } from '@shopify/react-native-skia';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { ILegendInfo } from '@app/view/components/match-map/match-map';
import { usePaperTheme } from '@app/theming';
import { Text } from '@app/components/text';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const fontStyle = {
    fontFamily,
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: 'normal',
};
const font = matchFont(fontStyle as any);

interface Props {
    teams: ILegendInfo;
    // eapmPerMinute?: Record<string, number>
}

export default function Eapm({ teams }: Props) {
    const paperTheme = usePaperTheme();

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

    const dataset = useMemo(() => {
        const start = new Date();

        if (!teams) {
            return { yKeys: [], data: [] };
        }

        const data = orderBy(
            teams
                .flatMap((team) => team.players)
                .flatMap((player) =>
                    Object.entries(player.eapmPerMinute).map(([min, eapm]) => ({
                        x: min!,
                        [player.color]: eapm,
                    }))
                ),
            [x => parseInt(x.x)]
        );

        const end = new Date();
        console.log('MEMO CALC data', end.getTime() - start.getTime(), 'ms');

        return {
            yKeys: teams.flatMap((team) => team.players).map((p) => p.color),
            data,
        };
    }, [teams]);

    // console.log('ratingHistories', ratingHistories[0]);
    // console.log('filteredRatingHistories', filteredRatingHistories?.[0].ratings.length);

    // if (!filteredRatingHistories?.[0]) {
    //     return <View></View>;
    // }

    console.log('data', dataset);

    return (
        <View style={styles.container}>
            <ViewLoader ready={dataset.data?.length > 0}>

                <Text className="" variant="header-sm">
                    eAPMs
                </Text>
                <Text className="" variant="body">
                    Effective Actions Per Minute
                </Text>

                <View style={{ width: windowWidth - 40, height: 160, marginVertical: 12 }}>
                    {dataset.data?.length > 0 && (
                        <CartesianChart
                            style={{height: 160}}
                            data={dataset.data}
                            xKey={'x' as never}
                            yKeys={dataset.yKeys as never}
                            axisOptions={
                                {
                                    // the chart needs this empty config for some reason
                                }
                            }
                            xAxis={{
                                font,
                                labelColor: paperTheme.colors.onSurface,
                                lineColor: paperTheme.dark ? '#454545' : '#BBB',
                            }}
                            yAxis={[
                                {
                                    font,
                                    labelColor: paperTheme.colors.onSurface,
                                    lineColor: paperTheme.dark ? '#454545' : '#BBB',
                                },
                            ]}
                        >
                            {({ points }) => (
                                <>
                                    {dataset.yKeys.map((key) => (
                                        <Fragment key={key}>
                                            <Line points={(points as any)[key].filter((p: any) => p.yValue != null)} color={key} strokeWidth={1.25} />
                                            <Scatter points={(points as any)[key]} shape="circle" radius={2} style="fill" color={key} />
                                        </Fragment>
                                    ))}
                                </>
                            )}
                        </CartesianChart>
                    )}
                </View>
            </ViewLoader>
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
