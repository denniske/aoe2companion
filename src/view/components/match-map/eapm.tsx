import { StyleSheet, View } from 'react-native';
import React, { Fragment, useMemo } from 'react';
import { orderBy } from 'lodash';
import { CartesianChart, Line, Scatter } from 'victory-native-current';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { ILegendInfo } from '@app/view/components/match-map/match-map';
import { useAppTheme } from '@app/theming';
import { Text } from '@app/components/text';
import { useChartFont } from '@app/view/components/match-map/map-utils';

interface Props {
    teams: ILegendInfo;
}

export default function Eapm({ teams }: Props) {
    const theme = useAppTheme();
    const font = useChartFont();

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
            [(x) => parseInt(x.x)]
        );

        const end = new Date();
        console.log('MEMO CALC data', end.getTime() - start.getTime(), 'ms');

        return {
            yKeys: teams.flatMap((team) => team.players).map((p) => p.color),
            data,
        };
    }, [teams]);

    if (font === null) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ViewLoader ready={dataset.data?.length > 0}>
                <Text className="" variant="header-sm">
                    eAPMs
                </Text>
                <Text className="" variant="body">
                    Effective Actions Per Minute
                </Text>

                <View style={{ height: 160, marginVertical: 12 }}>
                    {dataset.data?.length > 0 && (
                        <CartesianChart
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
                                labelColor: theme.textColor,
                                lineColor: theme.dark ? '#454545' : '#BBB',
                            }}
                            yAxis={[
                                {
                                    font,
                                    labelColor: theme.textColor,
                                    lineColor: theme.dark ? '#454545' : '#BBB',
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
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    container: {},
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginTop: 10,
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12,
    },
});
