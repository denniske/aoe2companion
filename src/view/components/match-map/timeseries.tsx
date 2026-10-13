import { PressableOpacity } from '@app/components/pressable-opacity';
import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { PlayerLineChart } from '@app/view/components/match-map/player-line-chart';
import type { ChartSeries } from '@app/view/components/perf-chart/types';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { getTimestampMs, ILegendInfo } from '@app/view/components/match-map/match-map';
import { Text } from '@app/components/text';
import { Icon } from '@app/components/icon';
import { faInfoCircle } from '@fortawesome/sharp-solid-svg-icons';
import { showAlert } from '@app/helper/alert';

interface Props {
    teams: ILegendInfo;
    title: string;
    description?: string;
    explanation?: string;
    metric: 'totalResources' | 'totalObjects';
}

export default function Timeseries({ teams, metric, title, description, explanation }: Props) {

    const series = useMemo<ChartSeries[]>(() => {
        if (!teams) return [];

        return teams
            .flatMap((team) => team.players)
            .map((player) => ({
                id: player.color,
                color: player.color,
                scatter: true,
                strokeWidth: 1.25,
                data: player.timeseries
                    .map((entry) => ({ x: getTimestampMs(entry.timestamp) / 1000 / 60, y: entry[metric] as number }))
                    .sort((a, b) => a.x - b.x),
            }));
    }, [teams, metric]);

    const showExplanation = () => {
        showAlert(title, explanation || 'No additional explanation available.');
    };

    const hasData = series.some((s) => s.data.length > 0);

    return (
        <View style={styles.container}>
            <ViewLoader ready={hasData}>
                <Text className="" variant="header-sm">
                    {title}
                </Text>
                <View className="flex-row justify-between">
                    <Text className="" variant="body">
                        {description}
                    </Text>
                    {!!(explanation) && (
                        <PressableOpacity onPress={showExplanation}>
                            <Icon icon={faInfoCircle} color="subtle"></Icon>
                        </PressableOpacity>
                    )}
                </View>
                {hasData && <PlayerLineChart series={series} />}
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
