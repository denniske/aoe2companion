import { MetaCiv, MIN_CELL_GAMES, useMeta } from '@app/api/meta';
import { Card } from '@app/components/card';
import { Field } from '@app/components/field';
import { cellLookup, indexBy } from '@app/components/stats-overview/meta-helpers';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { BalanceBar, CivIcon, EdgeLegend, EdgeText, MetaPlaceholder, SectionTitle, WinRateHeatmap } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

const TOP_OPTIONS = [10, 25, 0];

const MatchupRow: React.FC<{ civ?: MetaCiv; winRate: number; games: number }> = ({ civ, winRate, games }) => (
    <View className="flex-row items-center gap-2 py-1">
        <CivIcon civ={civ} />
        <Text variant="label-sm" className="w-28 md:w-36" numberOfLines={1}>
            {civ?.civName}
        </Text>
        <BalanceBar winRate={winRate} className="flex-1" />
        <View className="w-12 items-end">
            <EdgeText winRate={winRate} />
        </View>
        <Text variant="body-tn" color="subtle" className="w-12 tabular-nums" align="right">
            {games.toLocaleString()}
        </Text>
    </View>
);

export default function MatchupsPage() {
    const { data, error } = useMeta('matchups');
    const [top, setTop] = useState(10);
    const [search, setSearch] = useState('');
    // The spotlight starts on the most played civ, so the page opens on an answer
    // rather than on an empty search box.
    const [focusChoice, setFocus] = useState<string | null>(null);

    if (!data) {
        return (
            <StatsPage title="Matchups" description="How each civilization does against every other one.">
                <MetaPlaceholder error={error} height={400} />
            </StatsPage>
        );
    }

    const civById = indexBy(data.civs, (c) => c.civ);
    const value = cellLookup(data.matchups, (m) => m.civ, (m) => m.opponent);
    const focus = focusChoice ?? data.civs[0]?.civ;
    const civs = data.civs.slice(0, top || undefined).map((c) => c.civ);
    const matches = search.trim() ? data.civs.filter((c) => c.civName.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 8) : [];

    const ranked = data.matchups.filter((m) => m.civ === focus && m.games >= MIN_CELL_GAMES).sort((a, b) => b.winRate - a.winRate);
    const focusGames = data.matchups.filter((m) => m.civ === focus);
    const games = focusGames.reduce((sum, m) => sum + m.games, 0);
    const wins = focusGames.reduce((sum, m) => sum + m.wins, 0);

    return (
        <StatsPage title="Matchups" description="How each civilization does against every other one." matches={data.matches}>
            <Card direction="vertical" className="gap-4">
                <View className="flex-row flex-wrap items-center gap-4">
                    <CivIcon civ={civById.get(focus)} size={48} />
                    <View className="flex-1 min-w-40">
                        <Text variant="header-sm">{civById.get(focus)?.civName}</Text>
                        <View className="flex-row items-center gap-2">
                            <Text variant="body-sm" color="subtle">
                                Overall
                            </Text>
                            {games > 0 && <EdgeText winRate={wins / games} />}
                            <Text variant="body-sm" color="subtle">
                                · {games.toLocaleString()} games
                            </Text>
                        </View>
                    </View>
                    <View className="w-full md:w-72">
                        <Field value={search} onChangeText={setSearch} placeholder="Pick another civilization" type="search" />
                        {matches.length > 0 && (
                            <View className="flex-row flex-wrap gap-1 mt-2">
                                {matches.map((civ) => (
                                    <Pressable
                                        key={civ.civ}
                                        onPress={() => {
                                            setFocus(civ.civ);
                                            setSearch('');
                                        }}
                                        className="flex-row items-center gap-1 rounded-full px-2 py-1 bg-gray-100 dark:bg-blue-800 hover:bg-gray-200 dark:hover:bg-blue-700"
                                    >
                                        <CivIcon civ={civ} size={16} />
                                        <Text variant="label-xs">{civ.civName}</Text>
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
                            <MatchupRow key={m.opponent} civ={civById.get(m.opponent)} winRate={m.winRate} games={m.games} />
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
                                <MatchupRow key={m.opponent} civ={civById.get(m.opponent)} winRate={m.winRate} games={m.games} />
                            ))}
                    </View>
                </View>
            </Card>

            <SectionTitle title="Matchup table" />
            <View className="flex-row flex-wrap gap-3 items-center justify-between">
                <ButtonPicker value={top} values={TOP_OPTIONS} formatter={(value) => (value === 0 ? 'All civs' : `${value} most played`)} onSelect={setTop} />
                <EdgeLegend />
            </View>
            <Card direction="vertical">
                <Text variant="body-xs" color="subtle">
                    Rows are the player's civ, columns the opponent's. Tap a row to put that civ in the spotlight. Empty cells have fewer than{' '}
                    {MIN_CELL_GAMES} games.
                </Text>
                <WinRateHeatmap<string, string>
                    rows={civs}
                    columns={civs}
                    value={value}
                    highlightRow={civs.includes(focus) ? focus : null}
                    rowHeader={(civ) => (
                        <Pressable onPress={() => setFocus(civ)} className="items-center">
                            <CivIcon civ={civById.get(civ)} />
                        </Pressable>
                    )}
                    columnHeader={(civ) => <CivIcon civ={civById.get(civ)} />}
                />
            </Card>
        </StatsPage>
    );
}
