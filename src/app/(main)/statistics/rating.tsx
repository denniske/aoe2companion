import { Card } from '@app/components/card';
import { allCivs, MockCiv, ratingCivWinRate, ratingGroups } from '@app/components/stats-overview/mock-detail-data';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { BalanceBar, CivIcon, EdgeText, goldAlpha, SectionTitle } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function RatingPage() {
    const [groupIndex, setGroupIndex] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const group = ratingGroups[groupIndex];

    // A civ's rank in every group, so each row can show how it climbs or falls
    // between skill levels -- the part a single group's list cannot tell you.
    const ranksByCiv = useMemo(() => {
        const ranks = new Map<MockCiv, number[]>();
        ratingGroups.forEach((_, g) => {
            [...allCivs]
                .sort((a, b) => ratingCivWinRate(g, b) - ratingCivWinRate(g, a))
                .forEach((civ, rank) => ranks.set(civ, [...(ranks.get(civ) ?? []), rank + 1]));
        });
        return ranks;
    }, []);

    const ranked = [...allCivs].map((civ) => ({ civ, winRate: ratingCivWinRate(groupIndex, civ) })).sort((a, b) => b.winRate - a.winRate);

    return (
        <StatsPage title="By rating" description="Civilizations rise and fall with skill level. Pick a rating group to see its ranking.">
            {/* Five groups do not fit a phone's width; let the picker scroll instead of overflowing. */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0">
                <ButtonPicker
                    value={groupIndex}
                    values={ratingGroups.map((_, i) => i)}
                    formatter={(i) => ratingGroups[i].label}
                    onSelect={(i) => {
                        setGroupIndex(i);
                        setShowAll(false);
                    }}
                />
            </ScrollView>

            <Card className="flex-wrap gap-6">
                {[
                    ['Rating', group.range],
                    ['Players', group.players.toLocaleString()],
                    ['Games', group.games.toLocaleString()],
                    ['Avg rating', String(group.avgRating)],
                    ['Avg game', `${group.avgDurationMinutes} min`],
                ].map(([label, value]) => (
                    <View key={label} className="min-w-24">
                        <Text variant="label-xs" color="subtle" className="uppercase">
                            {label}
                        </Text>
                        <Text variant="header-sm" className="tabular-nums">
                            {value}
                        </Text>
                    </View>
                ))}
            </Card>

            <SectionTitle title={`Civilizations at ${group.label}`} />
            <Card direction="vertical" className="gap-0">
                <View className="flex-row items-end gap-3 pb-2 border-b border-border">
                    <Text variant="label-xs" color="subtle" className="w-8">
                        #
                    </Text>
                    <Text variant="label-xs" color="subtle" className="flex-1">
                        Civilization · edge over 50%
                    </Text>
                    <View className="hidden md:flex items-center gap-1">
                        <Text variant="label-xs" color="subtle">
                            Rank in each group
                        </Text>
                        <View className="flex-row gap-1">
                            {ratingGroups.map((g, i) => (
                                <Text
                                    key={g.key}
                                    variant="body-tn"
                                    color="subtle"
                                    className={`w-8 ${i === groupIndex ? 'font-bold' : ''}`}
                                    align="center"
                                >
                                    {g.label.slice(0, 3)}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
                {ranked.slice(0, showAll ? undefined : 15).map(({ civ, winRate }, rank) => (
                    <View key={civ} className="flex-row items-center gap-3 py-2 border-b border-border">
                        <Text variant="label-sm" color="subtle" className="w-8 tabular-nums">
                            {rank + 1}
                        </Text>
                        <CivIcon civ={civ} size={24} />
                        <Text variant="label-sm" className="w-24 md:w-36" numberOfLines={1}>
                            {civ}
                        </Text>
                        <BalanceBar winRate={winRate} className="flex-1" />
                        <View className="w-12 items-end">
                            <EdgeText winRate={winRate} />
                        </View>
                        {/* Rank in each group; the selected group's pill is filled. */}
                        <View className="hidden md:flex flex-row gap-1 ml-3">
                            {ranksByCiv.get(civ)!.map((r, g) => (
                                <View
                                    key={g}
                                    className="w-8 items-center rounded py-0.5"
                                    style={{ backgroundColor: g === groupIndex ? goldAlpha(0.9) : goldAlpha(r <= 10 ? 0.25 : 0.06) }}
                                >
                                    <Text variant="label-xs" className={`tabular-nums ${g === groupIndex ? 'text-blue-950!' : ''}`}>
                                        {r}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
                <Text variant="label-sm" className="pt-3 self-center text-gold-700! dark:text-gold-400!" onPress={() => setShowAll(!showAll)}>
                    {showAll ? 'Show top 15' : `Show all ${allCivs.length} civs`}
                </Text>
            </Card>
        </StatsPage>
    );
}
