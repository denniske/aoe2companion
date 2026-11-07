import { Card } from '@app/components/card';
import { Field } from '@app/components/field';
import { allCivs, civSummaries, matchupWinRate, MockCiv } from '@app/components/stats-overview/mock-detail-data';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { BalanceBar, CivIcon, EdgeLegend, EdgeText, SectionTitle, WinRateHeatmap } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

const TOP_OPTIONS = [10, 25, allCivs.length];

const MatchupRow: React.FC<{ civ: MockCiv; winRate: number }> = ({ civ, winRate }) => (
    <View className="flex-row items-center gap-2 py-1">
        <CivIcon civ={civ} />
        <Text variant="label-sm" className="w-28 md:w-36" numberOfLines={1}>
            {civ}
        </Text>
        <BalanceBar winRate={winRate} className="flex-1" />
        <View className="w-12 items-end">
            <EdgeText winRate={winRate} />
        </View>
    </View>
);

export default function MatchupsPage() {
    const [top, setTop] = useState(10);
    const [search, setSearch] = useState('');
    // The spotlight starts on the most played civ, so the page opens on an answer
    // rather than on an empty search box.
    const [focus, setFocus] = useState<MockCiv>(civSummaries[0].civ);

    const civs = civSummaries.slice(0, top).map((c) => c.civ);
    const matches = search.trim() ? allCivs.filter((civ) => civ.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 8) : [];

    const ranked = allCivs
        .filter((civ) => civ !== focus)
        .map((civ) => ({ civ, winRate: matchupWinRate(focus, civ)! }))
        .sort((a, b) => b.winRate - a.winRate);
    const overall = civSummaries.find((c) => c.civ === focus)!;

    return (
        <StatsPage title="Matchups" description="How each civilization does against every other one.">
            <Card direction="vertical" className="gap-4">
                <View className="flex-row flex-wrap items-center gap-4">
                    <CivIcon civ={focus} size={48} />
                    <View className="flex-1 min-w-40">
                        <Text variant="header-sm">{focus}</Text>
                        <View className="flex-row items-center gap-2">
                            <Text variant="body-sm" color="subtle">
                                Overall
                            </Text>
                            <EdgeText winRate={overall.winRate} />
                            <Text variant="body-sm" color="subtle">
                                · {overall.games.toLocaleString()} games
                            </Text>
                        </View>
                    </View>
                    <View className="w-full md:w-72">
                        <Field value={search} onChangeText={setSearch} placeholder="Pick another civilization" type="search" />
                        {matches.length > 0 && (
                            <View className="flex-row flex-wrap gap-1 mt-2">
                                {matches.map((civ) => (
                                    <Pressable
                                        key={civ}
                                        onPress={() => {
                                            setFocus(civ);
                                            setSearch('');
                                        }}
                                        className="flex-row items-center gap-1 rounded-full px-2 py-1 bg-gray-100 dark:bg-blue-800 hover:bg-gray-200 dark:hover:bg-blue-700"
                                    >
                                        <CivIcon civ={civ} size={16} />
                                        <Text variant="label-xs">{civ}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                <View className="gap-6 md:flex-row">
                    <View className="flex-1">
                        <Text variant="label-xs" color="subtle" className="uppercase mb-1">
                            Favoured against
                        </Text>
                        {ranked.slice(0, 6).map((m) => (
                            <MatchupRow key={m.civ} {...m} />
                        ))}
                    </View>
                    <View className="flex-1">
                        <Text variant="label-xs" color="subtle" className="uppercase mb-1">
                            Struggles against
                        </Text>
                        {ranked
                            .slice(-6)
                            .reverse()
                            .map((m) => (
                                <MatchupRow key={m.civ} {...m} />
                            ))}
                    </View>
                </View>
            </Card>

            <SectionTitle title="Matchup table" />
            <View className="flex-row flex-wrap gap-3 items-center justify-between">
                <ButtonPicker value={top} values={TOP_OPTIONS} formatter={(value) => (value === allCivs.length ? 'All civs' : `${value} most played`)} onSelect={setTop} />
                <EdgeLegend />
            </View>
            <Card direction="vertical">
                <Text variant="body-xs" color="subtle">
                    Rows are the player's civ, columns the opponent's. Tap a row to put that civ in the spotlight.
                </Text>
                <WinRateHeatmap<MockCiv, MockCiv>
                    rows={civs}
                    columns={civs}
                    value={matchupWinRate}
                    highlightRow={civs.includes(focus) ? focus : null}
                    rowHeader={(civ) => (
                        <Pressable onPress={() => setFocus(civ)} className="items-center">
                            <CivIcon civ={civ} />
                        </Pressable>
                    )}
                    columnHeader={(civ) => <CivIcon civ={civ} />}
                />
            </Card>
        </StatsPage>
    );
}
