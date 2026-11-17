import {
    formatStage,
    LadderBadge,
    LadderPhase,
    ladderSeasonPhase,
    LadderSeasonInfo,
    LadderStanding,
    LadderVideo,
    ladderWinRate,
    LadderPlayer,
} from '@app/api/ladder-tournament';
import { Card } from '@app/components/card';
import { Icon } from '@app/components/icon';
import { Image } from '@app/components/uniwind/image';
import { Link } from '@app/components/link';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { CountryImage } from '@app/view/components/country-image';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faPlay } from '@fortawesome/sharp-solid-svg-icons';
import { formatCustom } from '@nex/data';
import { Link as ExpoLink } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, View } from 'react-native';

export const formatLadderDate = (value: string | null) => (value ? formatCustom(new Date(value), 'd MMM yyyy') : '—');

export const formatLadderRange = (start: string | null, end: string | null) => `${formatLadderDate(start)} – ${formatLadderDate(end)}`;

export const formatRecord = (record: { wins: number; losses: number } | null) => (record ? `${record.wins}–${record.losses}` : '—');

export function useLadderSeasonTitle() {
    const getTranslation = useTranslation();
    return (season: Pick<LadderSeasonInfo, 'id' | 'displayName'>) => {
        const number = getTranslation('ladderTournament.season', { id: season.id });
        return season.displayName ? `${number} · ${season.displayName}` : number;
    };
}

const PHASE_STYLES: Record<LadderPhase, [background: string, text: string]> = {
    upcoming: ['bg-blue-100 dark:bg-blue-800', 'text-blue-800 dark:text-blue-100'],
    registration: ['bg-green-100 dark:bg-green-900', 'text-green-800 dark:text-green-100'],
    ladder: ['bg-orange-100 dark:bg-orange-900', 'text-orange-800 dark:text-orange-100'],
    playoffs: ['bg-orange-100 dark:bg-orange-900', 'text-orange-800 dark:text-orange-100'],
    finished: ['bg-gray-200 dark:bg-gray-700', 'text-gray-700 dark:text-gray-200'],
    unknown: ['bg-gray-200 dark:bg-gray-700', 'text-gray-700 dark:text-gray-200'],
};

export const LadderStatusPill: React.FC<{ season: LadderSeasonInfo }> = ({ season }) => {
    const getTranslation = useTranslation();
    const phase = ladderSeasonPhase(season);
    const label = phase === 'unknown' ? season.status : getTranslation(`ladderTournament.status.${phase}`);
    if (!label) return null;
    const [background, text] = PHASE_STYLES[phase];
    return (
        <View className={`self-start rounded px-2 py-0.5 ${background}`}>
            <Text variant="label-xs" className={`uppercase ${text}`}>
                {label}
            </Text>
        </View>
    );
};

export const LadderPlayerLink: React.FC<{ player: LadderPlayer; variant?: 'body' | 'body-sm' | 'label-sm' }> = ({ player, variant = 'body-sm' }) => {
    const getTranslation = useTranslation();
    const name = player.name ?? getTranslation('ladderTournament.unknownPlayer', { id: player.profileId });
    return (
        <View className="flex-row items-center min-w-0 shrink">
            {!!player.country && <CountryImage country={player.country} />}
            <Link alt variant={variant} numberOfLines={1} className="shrink" href={`/players/${player.profileId}`}>
                {name}
            </Link>
        </View>
    );
};

// The organizer's medal art, used with their permission. Only the medals their API reports.
export const LADDER_MEDALS: Record<LadderBadge, number> = {
    ladderwinner: require('../../../assets/ladder-tournament/medal-ladder-winner.png'),
    thelegend: require('../../../assets/ladder-tournament/medal-legend.png'),
    liquipedia: require('../../../assets/ladder-tournament/medal-liquipedia.png'),
    paganini: require('../../../assets/ladder-tournament/medal-paganini.png'),
    discord: require('../../../assets/ladder-tournament/medal-discord.png'),
};

export const LadderBadgeChip: React.FC<{ badge: LadderBadge }> = ({ badge }) => {
    const getTranslation = useTranslation();
    const champion = badge === 'ladderwinner';
    return (
        <View
            className={`flex-row items-center gap-1 rounded-full border pl-1 pr-2 py-0.5 ${
                champion ? 'border-gold-400 bg-gold-100 dark:bg-gold-900/40' : 'border-gray-300 dark:border-gray-600'
            }`}
        >
            <Image source={LADDER_MEDALS[badge]} className="w-4 h-4" contentFit="contain" />
            <Text variant="label-xs" numberOfLines={1}>
                {getTranslation(`ladderTournament.badge.${badge}`)}
            </Text>
        </View>
    );
};

/** A medal with its name and what it is awarded for, as the organizer describes it. */
export const LadderMedal: React.FC<{ badge: LadderBadge }> = ({ badge }) => {
    const getTranslation = useTranslation();
    return (
        <View className="items-center gap-1 w-32">
            <Image source={LADDER_MEDALS[badge]} className="w-14 h-14" contentFit="contain" />
            <Text variant="label-sm" align="center" numberOfLines={1}>
                {getTranslation(`ladderTournament.badge.${badge}`)}
            </Text>
            <Text variant="body-xs" color="subtle" align="center">
                {getTranslation(`ladderTournament.badgeDescription.${badge}`)}
            </Text>
        </View>
    );
};

const WinRateBar: React.FC<{ value: number }> = ({ value }) => (
    <View className="flex-row items-center gap-2">
        <Text variant="body-sm" className="w-10 text-right">
            {Math.round(value * 100)}%
        </Text>
        <View className="h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <View className={`h-full ${value >= 0.5 ? 'bg-green-600' : 'bg-red-600'}`} style={{ width: `${Math.round(value * 100)}%` }} />
        </View>
    </View>
);

const TITLES_WIDTH = 300;

/**
 * The standings as a table. On a narrow screen only position, player, W/L and score are shown, and below
 * a large screen the badges move under the name.
 */
export const LadderStandingsTable: React.FC<{ standings: LadderStanding[]; limit?: number }> = ({ standings, limit }) => {
    const getTranslation = useTranslation();
    const { isMedium, isLarge } = useBreakpoints();
    // The titles column needs room for three badges side by side; below that they go under the name.
    const showTitles = isLarge;
    const rows = limit ? standings.slice(0, limit) : standings;

    const header = (label: string, className: string, style?: { width: number }) => (
        <Text variant="label-xs" color="subtle" className={`uppercase ${className}`} style={style} numberOfLines={1}>
            {label}
        </Text>
    );

    return (
        <Card direction="vertical" className="px-0! py-0! gap-0! overflow-hidden">
            <View className="flex-row items-center gap-3 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                {header('#', 'w-6')}
                {header(getTranslation('ladderTournament.column.player'), 'flex-1')}
                {header(getTranslation('ladderTournament.column.wl'), 'w-14 text-center')}
                {!!isMedium && header(getTranslation('ladderTournament.column.winRate'), 'w-24')}
                {!!isMedium && header(getTranslation('ladderTournament.column.matches'), 'w-16 text-center')}
                {!!showTitles && header(getTranslation('ladderTournament.column.titles'), '', { width: TITLES_WIDTH })}
                {!!isMedium && header(getTranslation('ladderTournament.column.casts'), 'w-12 text-center')}
                {header(getTranslation('ladderTournament.column.score'), 'w-12 text-right')}
            </View>
            {rows.map((row, index) => (
                <View
                    key={row.profileId}
                    className={`flex-row items-center gap-3 px-4 py-2.5 ${index > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''} ${
                        row.badges.includes('ladderwinner') ? 'bg-gold-50 dark:bg-gold-900/20' : ''
                    }`}
                >
                    <Text variant="label-sm" className="w-6">
                        {row.position}
                    </Text>
                    <View className="flex-1 min-w-0 gap-1">
                        <LadderPlayerLink player={row} />
                        {!showTitles && row.badges.length > 0 && (
                            <View className="flex-row flex-wrap gap-1">
                                {row.badges.map((badge) => (
                                    <LadderBadgeChip key={badge} badge={badge} />
                                ))}
                            </View>
                        )}
                    </View>
                    <Text variant="body-sm" className="w-14 text-center">
                        <Text variant="body-sm" className="text-green-700 dark:text-green-400">
                            {row.wins}
                        </Text>
                        {' / '}
                        <Text variant="body-sm" className="text-red-700 dark:text-red-400">
                            {row.losses}
                        </Text>
                    </Text>
                    {!!isMedium && (
                        <View className="w-24">
                            <WinRateBar value={ladderWinRate(row)} />
                        </View>
                    )}
                    {!!isMedium && (
                        <Text variant="body-sm" className="w-16 text-center">
                            {row.matches}
                        </Text>
                    )}
                    {!!showTitles && (
                        <View className="flex-row flex-wrap gap-1" style={{ width: TITLES_WIDTH }}>
                            {row.badges.length > 0 ? row.badges.map((badge) => <LadderBadgeChip key={badge} badge={badge} />) : <Text color="subtle">—</Text>}
                        </View>
                    )}
                    {!!isMedium && (
                        <Text variant="body-sm" color={row.casts > 0 ? 'brand' : 'subtle'} className="w-12 text-center">
                            {row.casts > 0 ? row.casts : '—'}
                        </Text>
                    )}
                    <Text variant="label" className="w-12 text-right">
                        {row.score}
                    </Text>
                </View>
            ))}
        </Card>
    );
};

export const LadderSeasonStats: React.FC<{ season: LadderSeasonInfo }> = ({ season }) => {
    const getTranslation = useTranslation();
    const stats = [
        [getTranslation('ladderTournament.stats.players'), season.players],
        [getTranslation('ladderTournament.stats.casts'), season.casts],
        [getTranslation('ladderTournament.stats.championsRecord'), formatRecord(season.championsRecord)],
        [getTranslation('ladderTournament.stats.topScore'), season.topScore ?? '—'],
    ] as const;
    return (
        <View className="flex-row flex-wrap gap-2">
            {stats.map(([label, value]) => (
                <View key={label} className="flex-row items-baseline gap-1.5 rounded-lg bg-gray-100 dark:bg-blue-800 px-3 py-1.5">
                    <Text variant="label">{value}</Text>
                    <Text variant="body-xs" color="subtle">
                        {label}
                    </Text>
                </View>
            ))}
        </View>
    );
};

/** Calendar, playoff cuts, match format and challenge rules. */
export const LadderSeasonDetails: React.FC<{ season: LadderSeasonInfo }> = ({ season }) => {
    const getTranslation = useTranslation();
    const { bestOf, challenge } = season;
    const items: [string, string][] = [
        [getTranslation('ladderTournament.registration'), formatLadderRange(season.registrationStart, season.registrationEnd)],
        [getTranslation('ladderTournament.ladderPhase'), formatLadderRange(season.ladderStart, season.ladderEnd)],
    ];
    if (season.playoffCut != null && season.semifinalCut != null) {
        items.push([
            getTranslation('ladderTournament.playoffs'),
            getTranslation('ladderTournament.playoffsValue', { playoffCut: season.playoffCut, semifinalCut: season.semifinalCut }),
        ]);
    }
    if (bestOf.ladder != null && bestOf.funnel != null && bestOf.semifinal != null && bestOf.final != null) {
        items.push([
            getTranslation('ladderTournament.matchFormat'),
            getTranslation('ladderTournament.matchFormatValue', { ladder: bestOf.ladder, funnel: bestOf.funnel, semifinal: bestOf.semifinal, final: bestOf.final }),
        ]);
    }
    const hasRules = Object.values(challenge).every((value) => value != null);

    return (
        <Card direction="vertical" className="gap-3">
            <View className="flex-row flex-wrap gap-x-8 gap-y-3">
                {items.map(([label, value]) => (
                    <View key={label} className="gap-0.5">
                        <Text variant="label-xs" color="subtle" className="uppercase">
                            {label}
                        </Text>
                        <Text variant="body-sm">{value}</Text>
                    </View>
                ))}
            </View>
            {hasRules && (
                <Text variant="body-sm" color="subtle">
                    {getTranslation('ladderTournament.challengeRules', challenge as Record<string, number>)}
                </Text>
            )}
        </Card>
    );
};

export const LadderVideoCard: React.FC<{ video: LadderVideo; className?: string; showStage?: boolean }> = ({ video, className, showStage = true }) => {
    const date = video.publishedAt ? formatCustom(new Date(video.publishedAt), 'd MMM yyyy') : null;
    const content = (
        <Pressable className="flex-1 overflow-hidden rounded-lg bg-white dark:bg-blue-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 hover:dark:bg-blue-800 transition-colors">
            <View className="w-full aspect-video bg-gray-200 dark:bg-blue-950 items-center justify-center">
                {video.thumbnailUrl ? (
                    <Image source={{ uri: video.thumbnailUrl }} className="absolute inset-0 w-full h-full" contentFit="cover" />
                ) : (
                    <Icon icon={video.twitchUrl ? faTwitch : faPlay} size={28} color="subtle" />
                )}
                {!!video.stage && showStage && (
                    <View className="absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1.5 py-0.5">
                        <Text variant="label-xs" color="white">
                            {formatStage(video.stage)}
                        </Text>
                    </View>
                )}
            </View>
            <View className="gap-0.5 px-3 py-2">
                <Text variant="header-xs" numberOfLines={2}>
                    {video.title}
                </Text>
                <Text variant="body-xs" color="subtle" numberOfLines={1}>
                    {[video.castedBy, date].filter(Boolean).join(' · ')}
                </Text>
                {video.players.length > 0 && (
                    <Text variant="body-xs" numberOfLines={1}>
                        {video.players.map((player, index) => (
                            <Fragment key={player.profileId}>
                                {index > 0 && ' vs '}
                                {player.name ?? `#${player.profileId}`}
                            </Fragment>
                        ))}
                    </Text>
                )}
            </View>
        </Pressable>
    );

    if (!video.url) return <View className={className}>{content}</View>;
    return (
        <View className={className}>
            <ExpoLink asChild href={video.url as any} target="_blank">
                {content}
            </ExpoLink>
        </View>
    );
};

export const LadderVideoGrid: React.FC<{ videos: LadderVideo[]; showStage?: boolean }> = ({ videos, showStage }) => {
    const { isMedium, isLarge } = useBreakpoints();
    const columns = isLarge ? 4 : isMedium ? 3 : 2;
    const rows: LadderVideo[][] = [];
    for (let i = 0; i < videos.length; i += columns) rows.push(videos.slice(i, i + columns));
    return (
        <View className="gap-2.5">
            {rows.map((row, index) => (
                <View key={index} className="flex-row gap-2.5">
                    {row.map((video) => (
                        <LadderVideoCard key={video.key} video={video} className="flex-1" showStage={showStage} />
                    ))}
                    {Array.from({ length: columns - row.length }).map((_, i) => (
                        <View key={`empty-${i}`} className="flex-1" />
                    ))}
                </View>
            ))}
        </View>
    );
};

// The organizer's logo, used with their permission.
export const LADDER_TOURNAMENT_LOGO = require('../../../assets/ladder-tournament/logo.png');

export const LadderTournamentTitle: React.FC<{ subtitle?: string; children?: React.ReactNode }> = ({ subtitle, children }) => {
    const getTranslation = useTranslation();
    return (
        <View className="flex-row items-center gap-3">
            <Image source={LADDER_TOURNAMENT_LOGO} className="w-14 h-14" contentFit="contain" />
            <View className="flex-1 gap-0.5">
                <Text variant="header-lg">{getTranslation('ladderTournament.title')}</Text>
                {!!subtitle && (
                    <Text variant="body-sm" color="subtle" numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
                {children}
            </View>
        </View>
    );
};
