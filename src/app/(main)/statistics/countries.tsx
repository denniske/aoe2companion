import { Card } from '@app/components/card';
import { useMeta } from '@app/api/meta';
import { StatsPage } from '@app/components/stats-overview/stats-page';
import { MetaPlaceholder, pct, ShareBar } from '@app/components/stats-overview/stats-ui';
import { Text } from '@app/components/text';
import { getCountryName } from '@app/helper/flags';
import ButtonPicker from '@app/view/components/button-picker';
import { CountryImage } from '@app/view/components/country-image';
import { Country } from '@nex/data';
import { orderBy } from 'lodash';
import React, { useState } from 'react';
import { View } from 'react-native';

type SortKey = 'players' | 'games' | 'avgRating';
const SORT_LABELS: Record<SortKey, string> = { players: 'Players', games: 'Games', avgRating: 'Avg rating' };

export default function CountriesPage() {
    const { data, error } = useMeta('countries');
    const [sort, setSort] = useState<SortKey>('players');
    const description = 'Where ranked 1v1 players come from and how they perform. The top 100 countries by players.';

    if (!data) {
        return (
            <StatsPage title="Countries" description={description} mirrorsExcluded={false}>
                <MetaPlaceholder error={error} height={400} />
            </StatsPage>
        );
    }

    const rows = orderBy(data.countries, (r) => r[sort] ?? 0, 'desc');
    const max = Math.max(...rows.map((r) => r[sort] ?? 0));

    return (
        <StatsPage title="Countries" description={description} mirrorsExcluded={false}>
            <ButtonPicker value={sort} values={Object.keys(SORT_LABELS) as SortKey[]} formatter={(key) => SORT_LABELS[key]} onSelect={setSort} />
            <Card direction="vertical" className="gap-0">
                {/* The extra columns only fit from md up; a phone keeps flag, name and the sorted value. */}
                <View className="flex-row items-center gap-3 pb-2 border-b border-border">
                    <Text variant="label-xs" color="subtle" className="w-8">
                        #
                    </Text>
                    <Text variant="label-xs" color="subtle" className="flex-1">
                        Country
                    </Text>
                    <Text variant="label-xs" color="subtle" className="hidden md:flex w-20" align="right">
                        Players
                    </Text>
                    <Text variant="label-xs" color="subtle" className="hidden md:flex w-20" align="right">
                        Games
                    </Text>
                    <Text variant="label-xs" color="subtle" className="hidden md:flex w-20" align="right">
                        Avg rating
                    </Text>
                    <Text variant="label-xs" color="subtle" className="hidden md:flex w-16" align="right">
                        Win %
                    </Text>
                    <Text variant="label-xs" color="subtle" className="hidden md:flex w-16" align="right">
                        Duration
                    </Text>
                    <Text variant="label-xs" color="subtle" className="md:hidden w-24" align="right">
                        {SORT_LABELS[sort]}
                    </Text>
                </View>
                {rows.map((row, i) => (
                    <View key={row.country} className="py-2 gap-1 border-b border-border">
                        <View className="flex-row items-center gap-3">
                            <Text variant="label-sm" color="subtle" className="w-8">
                                #{i + 1}
                            </Text>
                            <View className="flex-1 flex-row items-center gap-2">
                                <CountryImage country={row.country} />
                                <Text variant="label-sm" numberOfLines={1} className="flex-1">
                                    {getCountryName(row.country as Country)}
                                </Text>
                            </View>
                            <Text variant="body-sm" className="hidden md:flex w-20" align="right">
                                {row.players.toLocaleString()}
                            </Text>
                            <Text variant="body-sm" className="hidden md:flex w-20" align="right">
                                {row.games.toLocaleString()}
                            </Text>
                            <Text variant="body-sm" className="hidden md:flex w-20" align="right">
                                {row.avgRating ?? '–'}
                            </Text>
                            <Text variant="body-sm" className="hidden md:flex w-16" align="right">
                                {pct(row.winRate)}
                            </Text>
                            <Text variant="body-sm" className="hidden md:flex w-16" align="right">
                                {row.avgDurationMinutes != null ? `${Math.round(row.avgDurationMinutes)}m` : '–'}
                            </Text>
                            <Text variant="body-sm" className="md:hidden w-24" align="right">
                                {(row[sort] ?? 0).toLocaleString()}
                            </Text>
                        </View>
                        <ShareBar fraction={(row[sort] ?? 0) / max} className="ml-11" />
                    </View>
                ))}
            </Card>
        </StatsPage>
    );
}
