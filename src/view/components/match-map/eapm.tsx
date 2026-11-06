import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { PlayerLineChart } from '@app/view/components/match-map/player-line-chart';
import type { ChartSeries } from '@app/view/components/perf-chart/types';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { ILegendInfo } from '@app/view/components/match-map/match-map';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';

interface Props {
    teams: ILegendInfo;
}

export default function Eapm({ teams }: Props) {
    const getTranslation = useTranslation();

    const series = useMemo<ChartSeries[]>(() => {
        if (!teams) return [];

        return teams
            .flatMap((team) => team.players)
            .map((player) => ({
                id: player.color,
                color: player.color,
                scatter: true,
                strokeWidth: 1.25,
                data: Object.entries(player.eapmPerMinute)
                    .map(([min, eapm]) => ({ x: parseInt(min), y: eapm as number }))
                    .sort((a, b) => a.x - b.x),
            }));
    }, [teams]);

    const hasData = series.some((s) => s.data.length > 0);

    return (
        <View style={styles.container}>
            <ViewLoader ready={hasData}>
                <Text className="" variant="header-sm">
                    {getTranslation('matchanalysis.eapm.title')}
                </Text>
                <Text className="" variant="body">
                    {getTranslation('matchanalysis.eapm.description')}
                </Text>

                {hasData && <PlayerLineChart series={series} />}

                {hasData && (
                    <View className="gap-0.5 mt-2">
                        <Text variant="label-sm" color="subtle">
                            {getTranslation('matchanalysis.eapm.average')}
                        </Text>
                        <View className="flex-row flex-wrap gap-x-4 gap-y-0.5">
                            {teams
                                .flatMap((team) => team.players)
                                .filter((player) => player.averageEapm != null)
                                .map((player) => (
                                    <View key={player.color} className="flex-row items-center gap-1">
                                        <View className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }} />
                                        <Text variant="body-sm">{player.name}</Text>
                                        <Text variant="body-sm" color="subtle">
                                            {player.averageEapm}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                )}
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
