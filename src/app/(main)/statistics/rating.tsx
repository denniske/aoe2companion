import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { allCivs, ratingCivWinRate, ratingGroups } from '@app/components/stats-overview/mock-detail-data';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { CivIcon, pct, winRateColor } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import React, { useState } from 'react';
import { View } from 'react-native';

const GROUP_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#a855f7'];

export default function RatingPage() {
    const [showAll, setShowAll] = useState(false);

    const ranked = ratingGroups.map((_, groupIndex) =>
        [...allCivs].map((civ) => ({ civ, winRate: ratingCivWinRate(groupIndex, civ) })).sort((a, b) => b.winRate - a.winRate)
    );

    return (
        <StatsPage title="By rating" description="How civilizations perform at each skill level.">
            <View className="flex-row flex-wrap gap-4">
                {ratingGroups.map((group, i) => (
                    <Card key={group.key} direction="vertical" className="flex-1 min-w-56">
                        <View className="flex-row items-center gap-2">
                            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS[i] }} />
                            <Text variant="label-lg" className="flex-1">
                                {group.label}
                            </Text>
                            <Text variant="body-xs" color="subtle">
                                {group.range}
                            </Text>
                        </View>
                        {[
                            ['Players', group.players.toLocaleString()],
                            ['Games', group.games.toLocaleString()],
                            ['Avg duration', `${group.avgDurationMinutes}m`],
                            ['Avg rating', String(group.avgRating)],
                        ].map(([label, value]) => (
                            <View key={label} className="flex-row justify-between">
                                <Text variant="body-sm" color="subtle">
                                    {label}
                                </Text>
                                <Text variant="label-sm">{value}</Text>
                            </View>
                        ))}
                        <View className="flex-row items-center gap-2 pt-2 mt-1 border-t border-border">
                            <Text variant="body-sm" color="subtle" className="flex-1">
                                Best civ
                            </Text>
                            <CivIcon civ={ranked[i][0].civ} />
                            <Text variant="label-sm">{ranked[i][0].civ}</Text>
                            <Text variant="label-sm" style={{ color: winRateColor(ranked[i][0].winRate) }}>
                                {pct(ranked[i][0].winRate)}
                            </Text>
                        </View>
                    </Card>
                ))}
            </View>

            <Text variant="header-sm">Top civilizations by rating group</Text>
            <View className="flex-row flex-wrap gap-4">
                {ratingGroups.map((group, i) => (
                    <Card key={group.key} direction="vertical" className="flex-1 min-w-56">
                        <View className="flex-row items-center gap-2 mb-1">
                            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS[i] }} />
                            <Text variant="label-sm" className="uppercase">
                                {group.label}
                            </Text>
                        </View>
                        {ranked[i].slice(0, showAll ? undefined : 10).map(({ civ, winRate }, rank) => (
                            <View key={civ} className="flex-row items-center gap-2 py-1">
                                <Text variant="body-xs" color="subtle" className="w-7">
                                    #{rank + 1}
                                </Text>
                                <CivIcon civ={civ} />
                                <Text variant="label-sm" className="flex-1" numberOfLines={1}>
                                    {civ}
                                </Text>
                                <Text variant="label-sm" style={{ color: winRateColor(winRate) }}>
                                    {pct(winRate)}
                                </Text>
                            </View>
                        ))}
                    </Card>
                ))}
            </View>
            <View className="items-center">
                <Button onPress={() => setShowAll(!showAll)}>{showAll ? 'Show top 10' : `Show all ${allCivs.length}`}</Button>
            </View>
        </StatsPage>
    );
}
