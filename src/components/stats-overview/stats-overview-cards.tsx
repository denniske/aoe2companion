import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { getCountryName } from '@app/helper/flags';
import { CountryImage } from '@app/view/components/country-image';
import { Country } from '@nex/data';
import { Href, Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { MetaCiv, MIN_CELL_GAMES, useMeta } from '@app/api/meta';
import { format } from 'date-fns';
import { cellLookup, indexBy, MIN_RANKED_GAMES, ratingGroupLabel } from './meta-helpers';
import { BalanceBar, CivIcon, EdgeText, goldAlpha, MapThumb, MetaPlaceholder, ShareBar, WinRateHeatmap } from './stats-ui';

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
                        style={{ height: `${((value - min) / (max - min || 1)) * 100}%`, backgroundColor: goldAlpha(i === values.length - 1 ? 1 : 0.4) }}
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

export const StatsTotals: React.FC = () => {
    const { data, error } = useMeta('activity');
    if (!data) {
        return (
            <Card>
                <MetaPlaceholder error={error} height={120} />
            </Card>
        );
    }
    const hourly = data.hourly.map((h) => h.players);
    const today = data.daily[data.daily.length - 1];
    return (
        <Card direction="vertical" className="md:flex-row gap-6">
            <View className="flex-1 gap-2">
                <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-gold-500" />
                    <Text variant="label-sm" color="subtle" className="uppercase">
                        In matches · last hour
                    </Text>
                </View>
                <Text variant="header-lg" className="tabular-nums">
                    {(hourly[hourly.length - 1] ?? 0).toLocaleString()}
                </Text>
                <ActivityBars values={hourly} labels={['48h ago', '24h ago', '1h ago']} />
            </View>
            <View className="hidden md:flex w-px bg-border" />
            <View className="flex-1 gap-2">
                <Text variant="label-sm" color="subtle" className="uppercase">
                    Matches today
                </Text>
                <Text variant="header-lg" className="tabular-nums">
                    {(today?.matches ?? 0).toLocaleString()}
                </Text>
                <ActivityBars
                    values={data.daily.map((d) => d.matches)}
                    labels={data.daily.map((d) => format(new Date(`${d.day}T12:00:00Z`), 'EEE'))}
                />
            </View>
        </Card>
    );
};

const CivEdgeRow: React.FC<{ civ: MetaCiv; winRate: number }> = ({ civ, winRate }) => (
    <View className="flex-row items-center gap-2 py-1">
        <CivIcon civ={civ} />
        <Text variant="label-sm" className="flex-1" numberOfLines={1}>
            {civ.civName}
        </Text>
        <BalanceBar winRate={winRate} className="w-16" />
        <View className="w-12 items-end">
            <EdgeText winRate={winRate} />
        </View>
    </View>
);

export const CivWinratesTeaser: React.FC = () => {
    const { data, error } = useMeta('civs');
    const byWinRate = [...(data?.civs ?? [])].filter((c) => c.games >= MIN_RANKED_GAMES).sort((a, b) => b.winRate - a.winRate);
    return (
        <TeaserCard title="Civilizations" subtitle="Strongest and weakest civs in ranked 1v1" href="/statistics/winrates" linkLabel="All civ win rates">
            {!data ? (
                <MetaPlaceholder error={error} />
            ) : (
                <>
                    <Text variant="label-xs" color="subtle" className="uppercase mb-1">
                        Strongest
                    </Text>
                    {byWinRate.slice(0, 4).map((c) => (
                        <CivEdgeRow key={c.civ} civ={c} winRate={c.winRate} />
                    ))}
                    <Text variant="label-xs" color="subtle" className="uppercase mt-3 mb-1">
                        Weakest
                    </Text>
                    {byWinRate
                        .slice(-3)
                        .reverse()
                        .map((c) => (
                            <CivEdgeRow key={c.civ} civ={c} winRate={c.winRate} />
                        ))}
                </>
            )}
        </TeaserCard>
    );
};

export const MatchupsTeaser: React.FC = () => {
    const { data, error } = useMeta('matchups');
    const civById = indexBy(data?.civs ?? [], (c) => c.civ);
    const value = cellLookup(data?.matchups ?? [], (m) => m.civ, (m) => m.opponent);
    const civs = (data?.civs ?? []).slice(0, 6).map((c) => c.civ);
    // The most lopsided pairing with enough games behind it, as the card's headline.
    const best = (data?.matchups ?? []).filter((m) => m.games >= MIN_RANKED_GAMES).sort((a, b) => b.winRate - a.winRate)[0];
    return (
        <TeaserCard title="Matchups" subtitle="The six most played civs against each other" href="/statistics/matchups" linkLabel="Full matchup table">
            {!data ? (
                <MetaPlaceholder error={error} />
            ) : (
                <>
                    <View className="items-center">
                        <WinRateHeatmap<string, string>
                            rows={civs}
                            columns={civs}
                            value={value}
                            rowHeader={(civ) => <CivIcon civ={civById.get(civ)} />}
                            columnHeader={(civ) => <CivIcon civ={civById.get(civ)} />}
                        />
                    </View>
                    {best && (
                        <View className="flex-row items-center gap-2 mt-3 rounded-lg bg-gray-100 dark:bg-blue-950 px-3 py-2">
                            <Text variant="body-xs" color="subtle" className="flex-1">
                                Most one-sided
                            </Text>
                            <CivIcon civ={civById.get(best.civ)} size={16} />
                            <Text variant="label-xs">vs</Text>
                            <CivIcon civ={civById.get(best.opponent)} size={16} />
                            <EdgeText winRate={best.winRate} mode="edge" variant="label-xs" />
                        </View>
                    )}
                </>
            )}
        </TeaserCard>
    );
};

export const MapCivTeaser: React.FC = () => {
    const { data, error } = useMeta('maps');
    const civById = indexBy(data?.civs ?? [], (c) => c.civ);
    const maxGames = data?.maps[0]?.games ?? 1;
    return (
        <TeaserCard title="Maps" subtitle="Most played maps and who wins on them" href="/statistics/maps" linkLabel="All maps">
            {!data ? (
                <MetaPlaceholder error={error} />
            ) : (
                data.maps.slice(0, 5).map((map) => {
                    const best = data.mapCivs.filter((c) => c.map === map.map && c.games >= MIN_RANKED_GAMES).sort((a, b) => b.winRate - a.winRate)[0];
                    return (
                        <View key={map.map} className="flex-row items-center gap-3 py-1">
                            <MapThumb map={map} size={34} />
                            <View className="flex-1 gap-1">
                                <View className="flex-row items-baseline justify-between">
                                    <Text variant="label-sm" numberOfLines={1} className="flex-1">
                                        {map.mapName}
                                    </Text>
                                    <Text variant="body-xs" color="subtle" className="tabular-nums">
                                        {(map.playRate * 100).toFixed(0)}% of games
                                    </Text>
                                </View>
                                <ShareBar fraction={map.games / maxGames} />
                            </View>
                            <View className="items-center w-12">
                                {best && (
                                    <>
                                        <CivIcon civ={civById.get(best.civ)} size={18} />
                                        <EdgeText winRate={best.winRate} mode="edge" variant="label-xs" />
                                    </>
                                )}
                            </View>
                        </View>
                    );
                })
            )}
        </TeaserCard>
    );
};

export const RatingGroupsTeaser: React.FC = () => {
    const { data, error } = useMeta('rating-groups');
    return (
        <TeaserCard title="By rating" subtitle="The strongest civ at each skill level" href="/statistics/rating" linkLabel="Civs by rating">
            {!data ? (
                <MetaPlaceholder error={error} />
            ) : (
                data.groups.map((group) => {
                    // The API sorts each group's civs by win rate; skip the ones with too few games to mean anything.
                    const best = group.civs.find((c) => c.games >= MIN_CELL_GAMES * 3);
                    const label = ratingGroupLabel(group);
                    return (
                        <View key={group.key} className="flex-row items-center gap-2 py-1.5">
                            <View className="w-24">
                                <Text variant="label-sm">{label.name}</Text>
                                <Text variant="body-tn" color="subtle">
                                    {label.range}
                                </Text>
                            </View>
                            {best ? (
                                <>
                                    <CivIcon civ={best} size={22} />
                                    <Text variant="label-sm" className="flex-1" numberOfLines={1}>
                                        {best.civName}
                                    </Text>
                                    <EdgeText winRate={best.winRate} />
                                </>
                            ) : (
                                <Text variant="body-xs" color="subtle" className="flex-1">
                                    Not enough games
                                </Text>
                            )}
                        </View>
                    );
                })
            )}
        </TeaserCard>
    );
};

export const CountriesTeaser: React.FC<{ className?: string }> = ({ className }) => {
    const { data, error } = useMeta('countries');
    const top = (data?.countries ?? []).slice(0, 6);
    const max = top[0]?.players ?? 1;
    return (
        <TeaserCard title="Countries" subtitle="Where ranked 1v1 players come from" href="/statistics/countries" linkLabel="All countries" className={className}>
            {!data ? (
                <MetaPlaceholder error={error} />
            ) : (
                top.map((country) => (
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
                ))
            )}
        </TeaserCard>
    );
};
