import { MIN_CELL_GAMES, useMeta } from '@app/api/meta';
import { Card } from '@app/components/card';
import { ratingGroupLabel } from '@app/components/stats-overview/meta-helpers';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { BalanceBar, CivIcon, EdgeText, goldAlpha, MetaPlaceholder, SectionTitle } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import ButtonPicker from '@app/view/components/button-picker';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function RatingPage() {
    const { data, error } = useMeta('rating-groups');
    const [groupIndex, setGroupIndex] = useState(1);
    const [showAll, setShowAll] = useState(false);

    // A civ's rank in every group, so each row can show how it climbs or falls
    // between skill levels -- the part a single group's list cannot tell you. Civs
    // with too few games in a group get no rank there.
    const ranksByCiv = useMemo(() => {
        const ranks = new Map<string, (number | null)[]>();
        data?.groups.forEach((group, g) => {
            group.civs
                .filter((c) => c.games >= MIN_CELL_GAMES)
                .forEach((c, rank) => {
                    const list = ranks.get(c.civ) ?? data.groups.map(() => null);
                    list[g] = rank + 1;
                    ranks.set(c.civ, list);
                });
        });
        return ranks;
    }, [data]);

    const description = 'Civilizations rise and fall with skill level. Pick a rating group to see its ranking. Groups use the average rating of both players.';

    if (!data) {
        return (
            <StatsPage title="By rating" description={description}>
                <MetaPlaceholder error={error} height={400} />
            </StatsPage>
        );
    }

    const group = data.groups[groupIndex];
    const label = ratingGroupLabel(group);
    const ranked = group.civs.filter((c) => c.games >= MIN_CELL_GAMES);

    return (
        <StatsPage title="By rating" description={description} matches={data.matches}>
            {/* Five groups do not fit a phone's width; let the picker scroll instead of overflowing. */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0">
                <ButtonPicker
                    value={groupIndex}
                    values={data.groups.map((_, i) => i)}
                    formatter={(i) => ratingGroupLabel(data.groups[i]).name}
                    onSelect={(i) => {
                        setGroupIndex(i);
                        setShowAll(false);
                    }}
                />
            </ScrollView>

            <Card className="flex-wrap gap-6">
                {[
                    ['Rating', label.range],
                    ['Players', group.players.toLocaleString()],
                    ['Games', group.games.toLocaleString()],
                    ['Avg rating', group.avgRating != null ? String(group.avgRating) : '–'],
                    ['Avg game', group.avgDurationMinutes != null ? `${Math.round(group.avgDurationMinutes)} min` : '–'],
                ].map(([title, value]) => (
                    <View key={title} className="min-w-24">
                        <Text variant="label-xs" color="subtle" className="uppercase">
                            {title}
                        </Text>
                        <Text variant="header-sm" className="tabular-nums">
                            {value}
                        </Text>
                    </View>
                ))}
            </Card>

            <SectionTitle title={`Civilizations at ${label.name}`} />
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
                            {data.groups.map((g, i) => (
                                <Text
                                    key={g.key}
                                    variant="body-tn"
                                    color="subtle"
                                    className={`w-8 ${i === groupIndex ? 'font-bold' : ''}`}
                                    align="center"
                                >
                                    {ratingGroupLabel(g).name.slice(0, 3)}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
                {ranked.length === 0 && (
                    <Text variant="body-sm" color="subtle" className="py-3">
                        Not enough games in this group yet.
                    </Text>
                )}
                {ranked.slice(0, showAll ? undefined : 15).map((civ, rank) => (
                    <View key={civ.civ} className="flex-row items-center gap-3 py-2 border-b border-border">
                        <Text variant="label-sm" color="subtle" className="w-8 tabular-nums">
                            {rank + 1}
                        </Text>
                        <CivIcon civ={civ} size={24} />
                        <Text variant="label-sm" className="w-24 md:w-36" numberOfLines={1}>
                            {civ.civName}
                        </Text>
                        <BalanceBar winRate={civ.winRate} className="flex-1" />
                        <View className="w-12 items-end">
                            <EdgeText winRate={civ.winRate} />
                        </View>
                        {/* Rank in each group; the selected group's pill is filled. */}
                        <View className="hidden md:flex flex-row gap-1 ml-3">
                            {(ranksByCiv.get(civ.civ) ?? []).map((r, g) => (
                                <View
                                    key={g}
                                    className="w-8 items-center rounded py-0.5"
                                    style={{ backgroundColor: g === groupIndex ? goldAlpha(0.9) : goldAlpha(r != null && r <= 10 ? 0.25 : 0.06) }}
                                >
                                    <Text variant="label-xs" className={`tabular-nums ${g === groupIndex ? 'text-blue-950!' : ''}`}>
                                        {r ?? '–'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
                {ranked.length > 15 && (
                    <Text variant="label-sm" className="pt-3 self-center text-gold-700! dark:text-gold-400!" onPress={() => setShowAll(!showAll)}>
                        {showAll ? 'Show top 15' : `Show all ${ranked.length} civs`}
                    </Text>
                )}
            </Card>
        </StatsPage>
    );
}
