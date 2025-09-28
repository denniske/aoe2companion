import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { Fragment, useMemo } from 'react';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { orderBy } from 'lodash';
import { CartesianChart, Line, Scatter } from 'victory-native-current';
import { matchFont } from '@shopify/react-native-skia';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { getTimestampMs, ILegendInfo } from '@app/view/components/match-map/match-map';
import { useAppTheme } from '@app/theming';
import { Text } from '@app/components/text';
import { chartFontStyle } from '@app/view/components/match-map/map-utils';
import { description } from '@eva-design/eva/package';
import { Icon } from '@app/components/icon';
import { showAlert } from '@app/helper/alert';

interface Props {
    teams: ILegendInfo;
    title: string;
    description?: string;
    explanation?: string;
    metric: 'totalResources' | 'totalObjects';
}

export default function Timeseries({ teams, metric, title, description, explanation }: Props) {
    const theme = useAppTheme();

    console.log('Timeseries', 'metric', metric, 'teams', teams?.length);

    const font = Platform.OS === 'web' ? undefined : matchFont(chartFontStyle);

    const dataset = useMemo(() => {
        const start = new Date();

        if (!teams) {
            return { yKeys: [], data: [] };
        }

        const data = orderBy(
            teams
                .flatMap((team) => team.players)
                .flatMap((player) =>
                    player.timeseries.map((entry) => ({
                        x: getTimestampMs(entry.timestamp) / 1000 / 60,
                        [player.color]: entry[metric],
                    }))
                ),
            [(x) => x]
        );

        const end = new Date();
        console.log('MEMO CALC data', end.getTime() - start.getTime(), 'ms');

        return {
            yKeys: teams.flatMap((team) => team.players).map((p) => p.color),
            data,
        };
    }, [teams]);

    const showExplanation = () => {
        showAlert(
            title,
            explanation || 'No additional explanation available.'
        );
    }

    return (
        <View style={styles.container}>
            <ViewLoader ready={dataset.data?.length > 0}>
                <Text className="" variant="header-sm">
                    {title}
                </Text>
                <View className="flex-row justify-between">
                    <Text className="" variant="body">
                        {description}
                    </Text>
                    {
                        explanation && (
                            <TouchableOpacity onPress={showExplanation}>
                                <Icon icon="info-circle" color="subtle"></Icon>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={{ width: windowWidth - 75, height: 160, marginVertical: 12 }}>
                    {dataset.data?.length > 0 && (
                        <CartesianChart
                            // style={{ height: 160 }}
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
