import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { getCountryName } from '@app/helper/flags';
import { CountryImage } from '@app/view/components/country-image';
import { Country } from '@nex/data';
import { Href } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { CivIcon, pct, winRateColor } from './stats-ui';
import { mockCivs, mockCountries, mockCurrentlyPlayingHourly, mockMaps, mockMatchupCivs, mockMatchups, mockRatingGroups, mockTotals } from './mock-data';

export const TeaserCard: React.FC<{ title: string; subtitle: string; href?: Href; className?: string; children: React.ReactNode }> = ({
    title,
    subtitle,
    href,
    className,
    children,
}) => (
    <Card href={href} direction="vertical" className={`flex-1 ${className ?? ''}`}>
        <View className="flex-row items-baseline justify-between gap-2">
            <Text variant="label-lg">{title}</Text>
            {href && (
                <Text variant="label-sm" color="subtle">
                    View all ›
                </Text>
            )}
        </View>
        <Text variant="body-sm" color="subtle" className="mb-1">
            {subtitle}
        </Text>
        {children}
    </Card>
);

// Bars scaled from the series minimum, not zero: activity never drops near zero,
// so a zero baseline flattens the daily curve into a solid block.
const BarChart: React.FC<{ values: number[]; labels?: string[]; highlightLast?: boolean }> = ({ values, labels, highlightLast }) => {
    const max = Math.max(...values);
    const min = Math.min(...values) * 0.8;
    return (
        <View className="gap-1">
            <View className="flex-row items-end gap-px h-12">
                {values.map((value, i) => (
                    <View
                        key={i}
                        className={`flex-1 rounded-sm ${highlightLast && i === values.length - 1 ? 'bg-gold-500' : 'bg-gold-500/50'}`}
                        style={{ height: `${((value - min) / (max - min)) * 100}%` }}
                    />
                ))}
            </View>
            {labels && (
                <View className="flex-row gap-px">
                    {labels.map((label, i) => (
                        <Text key={i} variant="body-tn" color="subtle" className="flex-1" align="center">
                            {label}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

export const StatsTotals: React.FC = () => (
    <View className="flex-row flex-wrap gap-4">
        <Card direction="vertical" className="flex-1 min-w-72">
            <View className="flex-row items-baseline justify-between">
                <Text variant="header-sm">{mockTotals.currentlyPlaying.toLocaleString()}</Text>
                <Text variant="body-xs" color="subtle">
                    last 48 hours
                </Text>
            </View>
            <Text variant="body-sm" color="subtle">
                Currently playing
            </Text>
            <BarChart values={mockCurrentlyPlayingHourly} labels={['-48h', '', '', '-24h', '', '', 'now']} highlightLast />
        </Card>
        <Card direction="vertical" className="flex-1 min-w-72">
            <View className="flex-row items-baseline justify-between">
                <Text variant="header-sm">{mockTotals.dailyMatches.toLocaleString()}</Text>
                <Text variant="body-xs" color="subtle">
                    last 7 days
                </Text>
            </View>
            <Text variant="body-sm" color="subtle">
                Matches today
            </Text>
            <BarChart
                values={mockTotals.dailyMatchesWeek.map((d) => d.matches)}
                labels={mockTotals.dailyMatchesWeek.map((d) => d.day)}
                highlightLast
            />
        </Card>
    </View>
);

export const CivWinratesTeaser: React.FC = () => {
    const top = [...mockCivs].sort((a, b) => b.winRate - a.winRate).slice(0, 7);
    return (
        <TeaserCard title="Civ win rates" subtitle="Highest win rate in RM 1v1, last 30 days" href="/statistics/winrates">
            {top.map((civ, i) => (
                <View key={civ.civ} className="flex-row items-center gap-2 py-1">
                    <Text variant="label-sm" color="subtle" className="w-6">
                        #{i + 1}
                    </Text>
                    <CivIcon civ={civ.civ} />
                    <Text variant="label-sm" className="flex-1">
                        {civ.civ}
                    </Text>
                    <Text variant="body-xs" color="subtle">
                        {civ.games.toLocaleString()} games
                    </Text>
                    <Text variant="label-sm" style={{ color: winRateColor(civ.winRate) }} className="w-12" align="right">
                        {pct(civ.winRate)}
                    </Text>
                </View>
            ))}
        </TeaserCard>
    );
};

export const MatchupsTeaser: React.FC = () => {
    const cell = 34;
    return (
        <TeaserCard title="Matchups" subtitle="How each civ fares against the others" href="/statistics/matchups">
            <View className="self-center">
                <View className="flex-row">
                    <View style={{ width: cell, height: cell }} />
                    {mockMatchupCivs.map((civ) => (
                        <View key={civ} style={{ width: cell, height: cell }} className="items-center justify-center">
                            <CivIcon civ={civ} />
                        </View>
                    ))}
                </View>
                {mockMatchups.map((row, r) => (
                    <View key={r} className="flex-row">
                        <View style={{ width: cell, height: cell }} className="items-center justify-center">
                            <CivIcon civ={mockMatchupCivs[r]} />
                        </View>
                        {row.map((value, c) => (
                            <View
                                key={c}
                                style={{ width: cell - 2, height: cell - 2, margin: 1, backgroundColor: value == null ? 'transparent' : winRateColor(value) }}
                                className="items-center justify-center rounded-sm"
                            >
                                <Text variant="body-tn" className="text-white!">
                                    {value == null ? '–' : Math.round(value * 100)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </TeaserCard>
    );
};

export const MapCivTeaser: React.FC = () => (
    <TeaserCard title="Maps" subtitle="Most played maps and their best civ" href="/statistics/maps">
        {mockMaps.map((map) => (
            <View key={map.map} className="py-1 gap-1">
                <View className="flex-row items-center gap-2">
                    <Text variant="label-sm" className="flex-1">
                        {map.map}
                    </Text>
                    <Text variant="body-xs" color="subtle">
                        {pct(map.playRate)}
                    </Text>
                    <CivIcon civ={map.bestCiv} size={16} />
                    <Text variant="body-xs" className="w-10" align="right" style={{ color: winRateColor(map.bestWinRate) }}>
                        {pct(map.bestWinRate)}
                    </Text>
                </View>
                <View className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <View className="h-full bg-gold-500" style={{ width: `${(map.playRate / mockMaps[0].playRate) * 100}%` }} />
                </View>
            </View>
        ))}
    </TeaserCard>
);

export const RatingGroupsTeaser: React.FC = () => (
    <TeaserCard title="By rating" subtitle="Best civ per rating group" href="/statistics/rating">
        {mockRatingGroups.map((group) => (
            <View key={group.label} className="flex-row items-center gap-2 py-1.5">
                <Text variant="label-sm" color="subtle" className="w-20">
                    {group.label}
                </Text>
                <CivIcon civ={group.bestCiv} size={24} />
                <Text variant="label-sm" className="flex-1">
                    {group.bestCiv}
                </Text>
                <Text variant="body-xs" color="subtle">
                    {group.games.toLocaleString()} games
                </Text>
                <Text variant="label-sm" className="w-12" align="right" style={{ color: winRateColor(group.winRate) }}>
                    {pct(group.winRate)}
                </Text>
            </View>
        ))}
    </TeaserCard>
);

export const CountriesTeaser: React.FC<{ className?: string }> = ({ className }) => {
    const max = mockCountries[0].players;
    return (
        <TeaserCard title="Countries" subtitle="Players by country in RM 1v1" href="/statistics/countries" className={className}>
            {mockCountries.slice(0, 6).map((country) => (
                <View key={country.country} className="py-1 gap-1">
                    <View className="flex-row items-center gap-2">
                        <CountryImage country={country.country} />
                        <Text variant="label-sm" className="flex-1" numberOfLines={1}>
                            {getCountryName(country.country as Country)}
                        </Text>
                        <Text variant="body-xs" color="subtle">
                            {country.players.toLocaleString()} players
                        </Text>
                    </View>
                    <View className="h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <View className="h-full bg-gold-500" style={{ width: `${(country.players / max) * 100}%` }} />
                    </View>
                </View>
            ))}
        </TeaserCard>
    );
};
