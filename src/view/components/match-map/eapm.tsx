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
                data: Object.entries(player.eapmPerMinute ?? {})
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
            </ViewLoader>
        </View>
    );
}

/**
 * Each player's eAPM over the whole match, one bar per player in their chart colour, so the
 * averages compare at a glance and the rows double as the eAPM chart's legend. Its own card:
 * beside Uptimes on desktop, under the eAPM chart on mobile. Renders nothing without data.
 */
export function EapmAverages({ teams }: Props) {
    const getTranslation = useTranslation();
    // Bars are scaled to the busiest player, so the longest bar always fills the row.
    const maxAverage = Math.max(0, ...(teams ?? []).flatMap((team) => team.players).map((player) => player.averageEapm ?? 0));
    if (maxAverage <= 0) return null;

    return (
        <View className="gap-2">
            <View>
                <Text variant="header-sm">{getTranslation('matchanalysis.eapm.average')}</Text>
                <Text variant="body">{getTranslation('matchanalysis.eapm.description')}</Text>
            </View>
            {/* Teams are kept together, the way the Uptimes table groups them. */}
            {teams.map((team, teamIndex) => {
                const players = team.players.filter((player) => player.averageEapm != null);
                if (players.length === 0) return null;
                return (
                    <View key={team.teamId ?? teamIndex} className="gap-1">
                        {players.map((player) => (
                            <View key={player.color} className="flex-row items-center gap-2">
                                <Text variant="body-sm" numberOfLines={1} className="w-28">
                                    {player.name}
                                </Text>
                                <View className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-blue-800 overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{ width: `${(player.averageEapm! / maxAverage) * 100}%`, backgroundColor: player.color }}
                                    />
                                </View>
                                <Text variant="label-sm" className="w-8 text-right tabular-nums">
                                    {player.averageEapm}
                                </Text>
                            </View>
                        ))}
                    </View>
                );
            })}
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
