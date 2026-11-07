import { Card } from '@app/components/card';
import { allCivs, civSummaries, mapCivWinRate, mapNames, mapSummaries, MockCiv, MockMap } from '@app/components/stats-overview/mock-detail-data';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { CivIcon, pct, WinRateHeatmap, WinRateLegend, winRateColor } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useState } from 'react';
import { View } from 'react-native';

const MAP_OPTIONS = [10, mapNames.length];
const CIV_OPTIONS = [10, 25, allCivs.length];

export default function MapsPage() {
    const [mapCount, setMapCount] = useState(10);
    const [civCount, setCivCount] = useState(10);

    const maps = mapSummaries.slice(0, mapCount).map((m) => m.map);
    const civs = civSummaries.slice(0, civCount).map((c) => c.civ);
    const maxGames = mapSummaries[0].games;

    return (
        <StatsPage title="Maps" description="Which civilizations excel on which maps, and how often each map is played.">
            <Card direction="vertical">
                <View className="flex-row flex-wrap gap-3 items-center">
                    <Text variant="label-lg" className="flex-1">
                        Map × civilization
                    </Text>
                    <ButtonPicker
                        value={mapCount}
                        values={MAP_OPTIONS}
                        formatter={(v) => (v === mapNames.length ? 'All maps' : `${v} maps`)}
                        onSelect={setMapCount}
                    />
                    <ButtonPicker
                        value={civCount}
                        values={CIV_OPTIONS}
                        formatter={(v) => (v === allCivs.length ? 'All civs' : `${v} civs`)}
                        onSelect={setCivCount}
                    />
                </View>
                <WinRateLegend />
                <WinRateHeatmap<MockMap, MockCiv>
                    rows={maps}
                    columns={civs}
                    value={mapCivWinRate}
                    rowHeaderWidth={120}
                    rowHeader={(map) => (
                        <Text variant="label-sm" numberOfLines={1}>
                            {map}
                        </Text>
                    )}
                    columnHeader={(civ) => <CivIcon civ={civ} />}
                />
            </Card>
            <Card direction="vertical">
                <Text variant="label-lg">Most played maps</Text>
                {/* Two columns from lg up; one list of 15 maps is too tall next to nothing. */}
                <View className="lg:flex-row lg:gap-8">
                    {[mapSummaries.slice(0, Math.ceil(mapSummaries.length / 2)), mapSummaries.slice(Math.ceil(mapSummaries.length / 2))].map(
                        (column, c) => (
                            <View key={c} className="lg:flex-1">
                                {column.map((map) => {
                                    const best = allCivs.reduce((a, b) => (mapCivWinRate(map.map, a) >= mapCivWinRate(map.map, b) ? a : b));
                                    return (
                                        <View key={map.map} className="py-1 gap-1">
                                            <View className="flex-row items-center gap-2">
                                                <Text variant="label-sm" className="flex-1">
                                                    {map.map}
                                                </Text>
                                                <Text variant="body-xs" color="subtle">
                                                    {map.games.toLocaleString()} games · {map.avgDurationMinutes}m
                                                </Text>
                                                <Text variant="body-xs" className="w-12" align="right">
                                                    {pct(map.playRate)}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center gap-2">
                                                <View className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                    <View className="h-full bg-gold-500" style={{ width: `${(map.games / maxGames) * 100}%` }} />
                                                </View>
                                                <CivIcon civ={best} size={16} />
                                                <Text
                                                    variant="body-xs"
                                                    className="w-12"
                                                    align="right"
                                                    style={{ color: winRateColor(mapCivWinRate(map.map, best)) }}
                                                >
                                                    {pct(mapCivWinRate(map.map, best))}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )
                    )}
                </View>
            </Card>
        </StatsPage>
    );
}
