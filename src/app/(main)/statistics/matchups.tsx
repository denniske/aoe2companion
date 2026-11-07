import { Card } from '@app/components/card';
import { Field } from '@app/components/field';
import { allCivs, civSummaries, matchupWinRate, MockCiv } from '@app/components/stats-overview/mock-detail-data';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { CivIcon, pct, WinRateHeatmap, WinRateLegend, winRateColor } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useState } from 'react';
import { View } from 'react-native';

const TOP_OPTIONS = [10, 25, allCivs.length];

export default function MatchupsPage() {
    const [top, setTop] = useState(25);
    const [search, setSearch] = useState('');

    // Most played first, so "Top 10" means the civs people actually meet.
    const civs = civSummaries.slice(0, top).map((c) => c.civ);
    const match = search.trim() ? allCivs.find((civ) => civ.toLowerCase().startsWith(search.trim().toLowerCase())) : undefined;

    // The selected civ's matchups as a ranked list, which reads better than a row
    // of 56 coloured cells on a phone.
    const selected = match
        ? allCivs
              .filter((civ) => civ !== match)
              .map((civ) => ({ civ, winRate: matchupWinRate(match, civ)! }))
              .sort((a, b) => b.winRate - a.winRate)
        : null;

    return (
        <StatsPage title="Matchups" description="How each civilization performs against the others. Rows are the player's civ, columns the opponent's.">
            <View className="flex-row flex-wrap gap-3 items-center">
                <ButtonPicker
                    value={top}
                    values={TOP_OPTIONS}
                    formatter={(value) => (value === allCivs.length ? 'All' : `Top ${value}`)}
                    onSelect={setTop}
                />
                <Field value={search} onChangeText={setSearch} placeholder="Search civilization" type="search" containerClassName="w-60" />
                <View className="flex-1" />
                <WinRateLegend />
            </View>

            {selected && match && (
                <Card direction="vertical">
                    <View className="flex-row items-center gap-2">
                        <CivIcon civ={match} size={28} />
                        <Text variant="label-lg">{match}</Text>
                    </View>
                    <View className="gap-4 md:flex-row">
                        {[
                            { title: 'Best matchups', list: selected.slice(0, 5) },
                            { title: 'Worst matchups', list: selected.slice(-5).reverse() },
                        ].map(({ title, list }) => (
                            <View key={title} className="flex-1 gap-1">
                                <Text variant="label-sm" color="subtle">
                                    {title}
                                </Text>
                                {list.map(({ civ, winRate }) => (
                                    <View key={civ} className="flex-row items-center gap-2 py-0.5">
                                        <CivIcon civ={civ} />
                                        <Text variant="label-sm" className="flex-1">
                                            vs {civ}
                                        </Text>
                                        <Text variant="label-sm" style={{ color: winRateColor(winRate) }}>
                                            {pct(winRate)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </Card>
            )}

            <Card direction="vertical">
                <WinRateHeatmap<MockCiv, MockCiv>
                    rows={civs}
                    columns={civs}
                    value={matchupWinRate}
                    highlightRow={match && civs.includes(match) ? match : null}
                    rowHeader={(civ) => (
                        <View className="items-center">
                            <CivIcon civ={civ} />
                        </View>
                    )}
                    columnHeader={(civ) => <CivIcon civ={civ} />}
                />
            </Card>
        </StatsPage>
    );
}
