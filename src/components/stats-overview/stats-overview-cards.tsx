import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { getCountryName } from '@app/helper/flags';
import { CountryImage } from '@app/view/components/country-image';
import { Country } from '@nex/data';
import { Href, Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { mockCurrentlyPlayingHourly, mockTotals } from './mock-data';
import { allCivs, civSummaries, countryStats, mapCivWinRate, mapSummaries, matchupWinRate, MockCiv, ratingCivWinRate, ratingGroups } from './mock-detail-data';
import { BalanceBar, CivIcon, EdgeText, goldAlpha, MapThumb, ShareBar, WinRateHeatmap } from './stats-ui';

/**
 * One overview card: a heading, a one-line explanation, the preview, and a link
 * along the bottom edge into the page it summarises.
 */
export const TeaserCard: React.FC<{ title: string; subtitle: string; href?: Href; linkLabel?: string; className?: string; children: React.ReactNode }> = ({
    title,
    subtitle,
    href,
    linkLabel,
    className,
    children,
}) => (
    <Card direction="vertical" className={`flex-1 gap-3 ${className ?? ''}`}>
        <View>
            <Text variant="label-lg">{title}</Text>
            <Text variant="body-sm" color="subtle">
                {subtitle}
            </Text>
        </View>
        {/* grow, not flex-1: flex-1 is a zero basis on web, which collapses the body under its content. */}
        <View className="grow">{children}</View>
        {href && (
            <Link href={href} className="group self-start">
                <Text variant="label-sm" className="text-gold-700! dark:text-gold-400! group-hover:underline">
                    {linkLabel ?? 'Show more'} →
                </Text>
            </Link>
        )}
    </Card>
);

// Bars scaled from 80% of the series minimum, not zero: activity never drops near
// zero, so a zero baseline flattens the daily curve into a solid block.
const ActivityBars: React.FC<{ values: number[]; labels: string[] }> = ({ values, labels }) => {
    const max = Math.max(...values);
    const min = Math.min(...values) * 0.8;
    return (
        <View className="gap-1">
            <View className="flex-row items-end gap-0.5 h-14">
                {values.map((value, i) => (
                    <View
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{ height: `${((value - min) / (max - min)) * 100}%`, backgroundColor: goldAlpha(i === values.length - 1 ? 1 : 0.4) }}
                    />
                ))}
            </View>
            <View className="flex-row justify-between">
                {labels.map((label, i) => (
                    <Text key={i} variant="body-tn" color="subtle">
                        {label}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export const StatsTotals: React.FC = () => (
    <Card direction="vertical" className="md:flex-row gap-6">
        <View className="flex-1 gap-2">
            <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-gold-500" />
                <Text variant="label-sm" color="subtle" className="uppercase">
                    Playing now
                </Text>
            </View>
            <Text variant="header-lg" className="tabular-nums">
                {mockTotals.currentlyPlaying.toLocaleString()}
            </Text>
            <ActivityBars values={mockCurrentlyPlayingHourly} labels={['48h ago', '24h ago', 'now']} />
        </View>
        <View className="hidden md:flex w-px bg-border" />
        <View className="flex-1 gap-2">
            <Text variant="label-sm" color="subtle" className="uppercase">
                Matches today
            </Text>
            <Text variant="header-lg" className="tabular-nums">
                {mockTotals.dailyMatches.toLocaleString()}
            </Text>
            <ActivityBars values={mockTotals.dailyMatchesWeek.map((d) => d.matches)} labels={mockTotals.dailyMatchesWeek.map((d) => d.day)} />
        </View>
    </Card>
);

const CivEdgeRow: React.FC<{ civ: string; winRate: number }> = ({ civ, winRate }) => (
    <View className="flex-row items-center gap-2 py-1">
        <CivIcon civ={civ} />
        <Text variant="label-sm" className="flex-1" numberOfLines={1}>
            {civ}
        </Text>
        <BalanceBar winRate={winRate} className="w-16" />
        <View className="w-12 items-end">
            <EdgeText winRate={winRate} />
        </View>
    </View>
);

export const CivWinratesTeaser: React.FC = () => {
    const byWinRate = [...civSummaries].sort((a, b) => b.winRate - a.winRate);
    return (
        <TeaserCard title="Civilizations" subtitle="Strongest and weakest civs in RM 1v1" href="/statistics/winrates" linkLabel="All civ win rates">
            <Text variant="label-xs" color="subtle" className="uppercase mb-1">
                Strongest
            </Text>
            {byWinRate.slice(0, 4).map((c) => (
                <CivEdgeRow key={c.civ} civ={c.civ} winRate={c.winRate} />
            ))}
            <Text variant="label-xs" color="subtle" className="uppercase mt-3 mb-1">
                Weakest
            </Text>
            {byWinRate
                .slice(-3)
                .reverse()
                .map((c) => (
                    <CivEdgeRow key={c.civ} civ={c.civ} winRate={c.winRate} />
                ))}
        </TeaserCard>
    );
};

export const MatchupsTeaser: React.FC = () => {
    const civs = civSummaries.slice(0, 6).map((c) => c.civ);
    // The most lopsided pairing among all civs, as the card's headline.
    let best = { civ: allCivs[0] as MockCiv, opponent: allCivs[1] as MockCiv, winRate: 0.5 };
    for (const civ of allCivs) {
        for (const opponent of allCivs) {
            const winRate = matchupWinRate(civ, opponent);
            if (winRate != null && winRate > best.winRate) best = { civ, opponent, winRate };
        }
    }
    return (
        <TeaserCard title="Matchups" subtitle="The six most played civs against each other" href="/statistics/matchups" linkLabel="Full matchup table">
            <View className="items-center">
                <WinRateHeatmap<MockCiv, MockCiv>
                    rows={civs}
                    columns={civs}
                    value={matchupWinRate}
                    rowHeader={(civ) => <CivIcon civ={civ} />}
                    columnHeader={(civ) => <CivIcon civ={civ} />}
                />
            </View>
            <View className="flex-row items-center gap-2 mt-3 rounded-lg bg-gray-100 dark:bg-blue-950 px-3 py-2">
                <Text variant="body-xs" color="subtle" className="flex-1">
                    Most one-sided
                </Text>
                <CivIcon civ={best.civ} size={16} />
                <Text variant="label-xs">vs</Text>
                <CivIcon civ={best.opponent} size={16} />
                <EdgeText winRate={best.winRate} mode="edge" variant="label-xs" />
            </View>
        </TeaserCard>
    );
};

export const MapCivTeaser: React.FC = () => {
    const maxGames = mapSummaries[0].games;
    return (
        <TeaserCard title="Maps" subtitle="Most played maps and who wins on them" href="/statistics/maps" linkLabel="All maps">
            {mapSummaries.slice(0, 5).map((map) => {
                const best = allCivs.reduce((a, b) => (mapCivWinRate(map.map, a) >= mapCivWinRate(map.map, b) ? a : b));
                return (
                    <View key={map.map} className="flex-row items-center gap-3 py-1">
                        <MapThumb map={map.map} size={34} />
                        <View className="flex-1 gap-1">
                            <View className="flex-row items-baseline justify-between">
                                <Text variant="label-sm">{map.map}</Text>
                                <Text variant="body-xs" color="subtle" className="tabular-nums">
                                    {(map.playRate * 100).toFixed(0)}% of games
                                </Text>
                            </View>
                            <ShareBar fraction={map.games / maxGames} />
                        </View>
                        <View className="items-center w-12">
                            <CivIcon civ={best} size={18} />
                            <EdgeText winRate={mapCivWinRate(map.map, best)} mode="edge" variant="label-xs" />
                        </View>
                    </View>
                );
            })}
        </TeaserCard>
    );
};

export const RatingGroupsTeaser: React.FC = () => (
    <TeaserCard title="By rating" subtitle="The strongest civ at each skill level" href="/statistics/rating" linkLabel="Civs by rating">
        {ratingGroups.map((group, i) => {
            const best = allCivs.reduce((a, b) => (ratingCivWinRate(i, a) >= ratingCivWinRate(i, b) ? a : b));
            const winRate = ratingCivWinRate(i, best);
            return (
                <View key={group.key} className="flex-row items-center gap-2 py-1.5">
                    <View className="w-24">
                        <Text variant="label-sm">{group.label}</Text>
                        <Text variant="body-tn" color="subtle">
                            {group.range}
                        </Text>
                    </View>
                    <CivIcon civ={best} size={22} />
                    <Text variant="label-sm" className="flex-1" numberOfLines={1}>
                        {best}
                    </Text>
                    <EdgeText winRate={winRate} />
                </View>
            );
        })}
    </TeaserCard>
);

export const CountriesTeaser: React.FC<{ className?: string }> = ({ className }) => {
    const top = countryStats.slice(0, 6);
    const max = top[0].players;
    return (
        <TeaserCard title="Countries" subtitle="Where RM 1v1 players come from" href="/statistics/countries" linkLabel="All countries" className={className}>
            {top.map((country) => (
                <View key={country.country} className="flex-row items-center gap-2 py-1">
                    <CountryImage country={country.country} />
                    <View className="flex-1 gap-1">
                        <View className="flex-row justify-between">
                            <Text variant="label-sm" numberOfLines={1} className="flex-1">
                                {getCountryName(country.country as Country)}
                            </Text>
                            <Text variant="body-xs" color="subtle" className="tabular-nums">
                                {country.players.toLocaleString()}
                            </Text>
                        </View>
                        <ShareBar fraction={country.players / max} />
                    </View>
                </View>
            ))}
        </TeaserCard>
    );
};
