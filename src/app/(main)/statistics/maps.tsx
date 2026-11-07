import { Card } from '@app/components/card';
import { allCivs, civSummaries, mapCivWinRate, mapNames, mapSummaries, MockCiv, MockMap } from '@app/components/stats-overview/mock-detail-data';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { BalanceBar, CivIcon, EdgeLegend, EdgeText, goldAlpha, MapThumb, SectionTitle, ShareBar, WinRateHeatmap } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

const MAP_OPTIONS = [10, mapNames.length];
const CIV_OPTIONS = [10, 25, allCivs.length];

const civsOnMap = (map: MockMap) => [...allCivs].map((civ) => ({ civ, winRate: mapCivWinRate(map, civ) })).sort((a, b) => b.winRate - a.winRate);

export default function MapsPage() {
    const [selected, setSelected] = useState<MockMap>(mapSummaries[0].map);
    const [mapCount, setMapCount] = useState(10);
    const [civCount, setCivCount] = useState(10);

    const maps = mapSummaries.slice(0, mapCount).map((m) => m.map);
    const civs = civSummaries.slice(0, civCount).map((c) => c.civ);
    const maxGames = mapSummaries[0].games;
    const selectedSummary = mapSummaries.find((m) => m.map === selected)!;
    const ranked = civsOnMap(selected);

    return (
        <StatsPage title="Maps" description="How often each map is played, and which civilizations it favours.">
            {/* Map tiles: pick one to see its civ ranking below. */}
            <View className="flex-row flex-wrap gap-3">
                {mapSummaries.map((map) => {
                    const active = map.map === selected;
                    return (
                        <Pressable
                            key={map.map}
                            onPress={() => setSelected(map.map)}
                            className={`w-36 grow rounded-lg border p-3 gap-2 bg-white dark:bg-blue-900 ${active ? 'border-gold-500' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800'}`}
                        >
                            <View className="flex-row items-center gap-2">
                                <MapThumb map={map.map} size={36} />
                                <View className="flex-1">
                                    <Text variant="label-sm" numberOfLines={1}>
                                        {map.map}
                                    </Text>
                                    <Text variant="body-tn" color="subtle">
                                        {(map.playRate * 100).toFixed(1)}% · {map.avgDurationMinutes}m
                                    </Text>
                                </View>
                            </View>
                            <ShareBar fraction={map.games / maxGames} />
                        </Pressable>
                    );
                })}
            </View>

            <Card direction="vertical" className="gap-4" style={{ borderColor: goldAlpha(0.5) }}>
                <View className="flex-row items-center gap-3">
                    <MapThumb map={selected} size={56} />
                    <View className="flex-1">
                        <Text variant="header-sm">{selected}</Text>
                        <Text variant="body-sm" color="subtle">
                            {selectedSummary.games.toLocaleString()} games · {(selectedSummary.playRate * 100).toFixed(1)}% of all games · average{' '}
                            {selectedSummary.avgDurationMinutes} minutes
                        </Text>
                    </View>
                </View>
                <View className="gap-6 md:flex-row">
                    {[
                        { title: 'Best civs here', list: ranked.slice(0, 6) },
                        { title: 'Worst civs here', list: ranked.slice(-6).reverse() },
                    ].map(({ title, list }) => (
                        <View key={title} className="flex-1">
                            <Text variant="label-xs" color="subtle" className="uppercase mb-1">
                                {title}
                            </Text>
                            {list.map(({ civ, winRate }) => (
                                <View key={civ} className="flex-row items-center gap-2 py-1">
                                    <CivIcon civ={civ} />
                                    <Text variant="label-sm" className="w-28 md:w-36" numberOfLines={1}>
                                        {civ}
                                    </Text>
                                    <BalanceBar winRate={winRate} className="flex-1" />
                                    <View className="w-12 items-end">
                                        <EdgeText winRate={winRate} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </Card>

            <SectionTitle title="Map × civilization table" />
            <View className="flex-row flex-wrap gap-3 items-center">
                <ButtonPicker value={mapCount} values={MAP_OPTIONS} formatter={(v) => (v === mapNames.length ? 'All maps' : `${v} maps`)} onSelect={setMapCount} />
                <ButtonPicker value={civCount} values={CIV_OPTIONS} formatter={(v) => (v === allCivs.length ? 'All civs' : `${v} civs`)} onSelect={setCivCount} />
                <View className="flex-1" />
                <EdgeLegend />
            </View>
            <Card direction="vertical">
                <WinRateHeatmap<MockMap, MockCiv>
                    rows={maps}
                    columns={civs}
                    value={mapCivWinRate}
                    rowHeaderWidth={150}
                    highlightRow={maps.includes(selected) ? selected : null}
                    rowHeader={(map) => (
                        <Pressable onPress={() => setSelected(map)} className="flex-row items-center gap-2 pl-1">
                            <MapThumb map={map} size={22} />
                            <Text variant="label-xs" numberOfLines={1} className="flex-1">
                                {map}
                            </Text>
                        </Pressable>
                    )}
                    columnHeader={(civ) => <CivIcon civ={civ} />}
                />
            </Card>
        </StatsPage>
    );
}
