import { MIN_CELL_GAMES, useMeta } from '@app/api/meta';
import { Card } from '@app/components/card';
import { cellLookup, indexBy } from '@app/components/stats-overview/meta-helpers';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import {
    BalanceBar,
    CivIcon,
    EdgeLegend,
    EdgeText,
    goldAlpha,
    MapThumb,
    MetaPlaceholder,
    SectionTitle,
    ShareBar,
    WinRateHeatmap,
} from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

// Maps beyond the first dozen or so are a long tail of a few hundred games each.
const TILE_COUNT = 15;
const MAP_OPTIONS = [10, 0];
const CIV_OPTIONS = [10, 25, 0];

export default function MapsPage() {
    const { data, error } = useMeta('maps');
    const civStats = useMeta('civs');
    const [selectedChoice, setSelected] = useState<string | null>(null);
    const [mapCount, setMapCount] = useState(10);
    const [civCount, setCivCount] = useState(10);

    if (!data) {
        return (
            <StatsPage title="Maps" description="How often each map is played, and which civilizations it favours.">
                <MetaPlaceholder error={error} height={400} />
            </StatsPage>
        );
    }

    const mapById = indexBy(data.maps, (m) => m.map);
    const civById = indexBy(data.civs, (c) => c.civ);
    const value = cellLookup(data.mapCivs, (c) => c.map, (c) => c.civ);
    const selected = mapById.get(selectedChoice ?? '') ?? data.maps[0];
    const maps = data.maps.slice(0, mapCount || undefined).map((m) => m.map);
    // Columns by overall popularity, so "10 civs" means the ten most played everywhere.
    const civOrder = civStats.data?.civs.map((c) => c.civ) ?? data.civs.map((c) => c.civ);
    const civs = civOrder.slice(0, civCount || undefined);
    const maxGames = data.maps[0]?.games ?? 1;
    const ranked = data.mapCivs.filter((c) => c.map === selected?.map && c.games >= MIN_CELL_GAMES).sort((a, b) => b.winRate - a.winRate);

    return (
        <StatsPage title="Maps" description="How often each map is played, and which civilizations it favours." matches={data.matches}>
            {/* Map tiles: pick one to see its civ ranking below. */}
            <View className="flex-row flex-wrap gap-3">
                {data.maps.slice(0, TILE_COUNT).map((map) => {
                    const active = map.map === selected?.map;
                    return (
                        <Pressable
                            key={map.map}
                            onPress={() => setSelected(map.map)}
                            className={`w-36 grow rounded-lg border p-3 gap-2 bg-white dark:bg-blue-900 ${active ? 'border-gold-500' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800'}`}
                        >
                            <View className="flex-row items-center gap-2">
                                <MapThumb map={map} size={36} />
                                <View className="flex-1">
                                    <Text variant="label-sm" numberOfLines={1}>
                                        {map.mapName}
                                    </Text>
                                    <Text variant="body-tn" color="subtle">
                                        {(map.playRate * 100).toFixed(1)}%{map.avgDurationMinutes != null ? ` · ${Math.round(map.avgDurationMinutes)}m` : ''}
                                    </Text>
                                </View>
                            </View>
                            <ShareBar fraction={map.games / maxGames} />
                        </Pressable>
                    );
                })}
            </View>

            {selected && (
                <Card direction="vertical" className="gap-4" style={{ borderColor: goldAlpha(0.5) }}>
                    <View className="flex-row items-center gap-3">
                        <MapThumb map={selected} size={56} />
                        <View className="flex-1">
                            <Text variant="header-sm">{selected.mapName}</Text>
                            <Text variant="body-sm" color="subtle">
                                {selected.games.toLocaleString()} games · {(selected.playRate * 100).toFixed(1)}% of all games
                                {selected.avgDurationMinutes != null ? ` · average ${Math.round(selected.avgDurationMinutes)} minutes` : ''}
                            </Text>
                        </View>
                    </View>
                    {ranked.length < 2 ? (
                        <Text variant="body-sm" color="subtle">
                            Not enough games on this map to rank civilizations.
                        </Text>
                    ) : (
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
                                            <CivIcon civ={civById.get(civ)} />
                                            <Text variant="label-sm" className="w-28 md:w-36" numberOfLines={1}>
                                                {civById.get(civ)?.civName}
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
                    )}
                </Card>
            )}

            <SectionTitle title="Map × civilization table" />
            <View className="flex-row flex-wrap gap-3 items-center">
                <ButtonPicker value={mapCount} values={MAP_OPTIONS} formatter={(v) => (v === 0 ? 'All maps' : `${v} maps`)} onSelect={setMapCount} />
                <ButtonPicker value={civCount} values={CIV_OPTIONS} formatter={(v) => (v === 0 ? 'All civs' : `${v} civs`)} onSelect={setCivCount} />
                <View className="flex-1" />
                <EdgeLegend />
            </View>
            <Card direction="vertical">
                <Text variant="body-xs" color="subtle">
                    Empty cells have fewer than {MIN_CELL_GAMES} games.
                </Text>
                <WinRateHeatmap<string, string>
                    rows={maps}
                    columns={civs}
                    value={value}
                    rowHeaderWidth={150}
                    highlightRow={selected && maps.includes(selected.map) ? selected.map : null}
                    rowHeader={(map) => (
                        <Pressable onPress={() => setSelected(map)} className="flex-row items-center gap-2 pl-1">
                            <MapThumb map={mapById.get(map)} size={22} />
                            <Text variant="label-xs" numberOfLines={1} className="flex-1">
                                {mapById.get(map)?.mapName}
                            </Text>
                        </Pressable>
                    )}
                    columnHeader={(civ) => <CivIcon civ={civById.get(civ)} />}
                />
            </Card>
        </StatsPage>
    );
}
