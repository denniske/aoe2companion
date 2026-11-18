import { LADDER_TOURNAMENT_DISCORD_URL, LADDER_TOURNAMENT_URL, ladderSeasonPhase, useLadderTournament } from '@app/api/ladder-tournament';
import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { Link } from '@app/components/link';
import { ScrollView } from '@app/components/scroll-view';
import { Skeleton } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import {
    formatLadderDate,
    formatLadderRange,
    formatRecord,
    LadderPlayerLink,
    LadderSourceLink,
    LadderSeasonStats,
    LadderStandingsTable,
    LadderStatusPill,
    LADDER_TOURNAMENT_LOGO,
    LadderVideoGrid,
    useLadderSeasonTitle,
} from '@app/view/ladder-tournament/ladder-components';
import { Image } from '@app/components/uniwind/image';
import { Stack, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

const TOP_PLAYERS = 5;
const LATEST_CASTS = 4;

export default function LadderTournamentPage() {
    const getTranslation = useTranslation();
    const seasonTitle = useLadderSeasonTitle();
    const { isMedium } = useBreakpoints();
    const router = useRouter();
    const { data, isPending, isError } = useLadderTournament();

    const featured = data?.seasons.find((season) => season.id === data.featuredSeasonId);
    const featuredPhase = featured && ladderSeasonPhase(featured);

    return (
        <ScrollView contentContainerClassName="p-4 gap-6 pb-8">
            <Stack.Screen options={{ title: getTranslation('ladderTournament.title') }} />

            <View className="flex-row items-center gap-4">
                <Image source={LADDER_TOURNAMENT_LOGO} className="w-20 h-20" contentFit="contain" />
                <View className="flex-1 gap-2">
                    <Text variant="body-sm" color="subtle">
                        {getTranslation('ladderTournament.description')}
                    </Text>
                    <View className="flex-row gap-4">
                        <Link href={LADDER_TOURNAMENT_URL} target="_blank">
                            {getTranslation('ladderTournament.officialSite')}
                        </Link>
                        <Link href={LADDER_TOURNAMENT_DISCORD_URL} target="_blank">
                            Discord
                        </Link>
                    </View>
                </View>
            </View>

            {!!isPending && <Skeleton className="h-64 rounded-lg" />}

            {!isPending && (isError || !featured) && (
                <Card>
                    <Text>{getTranslation('ladderTournament.unavailable')}</Text>
                </Card>
            )}

            {!!featured && (
                <View className="gap-3">
                    <View className="flex-row items-end justify-between gap-3">
                        <View className="gap-1 flex-1">
                            <Text variant="label-xs" color="subtle" className="uppercase">
                                {getTranslation(featured.finished ? 'ladderTournament.latestSeason' : 'ladderTournament.currentSeason')}
                            </Text>
                            <Text variant="header">{seasonTitle(featured)}</Text>
                            <View className="flex-row flex-wrap items-center gap-2">
                                <LadderStatusPill season={featured} />
                                <Text variant="body-sm" color="subtle">
                                    {featuredPhase === 'upcoming' || featuredPhase === 'registration'
                                        ? `${getTranslation('ladderTournament.registration')} ${formatLadderRange(featured.registrationStart, featured.registrationEnd)}`
                                        : `${getTranslation('ladderTournament.ladderPhase')} ${formatLadderRange(featured.ladderStart, featured.ladderEnd)}`}
                                </Text>
                            </View>
                        </View>
                        <Button href={`/competitive/ladder-tournament/${featured.id}`}>{getTranslation('ladderTournament.openSeason')}</Button>
                    </View>

                    <LadderSeasonStats season={featured} />

                    {featured.standings.length > 0 ? (
                        <View className="gap-2">
                            <LadderStandingsTable standings={featured.standings} limit={TOP_PLAYERS} />
                            {featured.standings.length > TOP_PLAYERS && (
                                <Link className="self-center" href={`/competitive/ladder-tournament/${featured.id}`}>
                                    {getTranslation('ladderTournament.showAllPlayers', { count: featured.standings.length })}
                                </Link>
                            )}
                        </View>
                    ) : (
                        <Card>
                            <Text color="subtle">
                                {featured.ladderStart && featuredPhase !== 'ladder'
                                    ? getTranslation('ladderTournament.noStandingsUntil', { date: formatLadderDate(featured.ladderStart) })
                                    : getTranslation('ladderTournament.noStandings')}
                            </Text>
                        </Card>
                    )}
                </View>
            )}

            {!!data && data.seasons.length > 0 && (
                <View className="gap-2">
                    <Text variant="header-lg">{getTranslation('ladderTournament.allSeasons')}</Text>
                    <Card direction="vertical" className="px-0! py-0! gap-0! overflow-hidden">
                        {data.seasons.map((season, index) => (
                            <Pressable
                                key={season.id}
                                onPress={() => router.push(`/competitive/ladder-tournament/${season.id}`)}
                                className={`flex-row flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-3 hover:bg-gray-50 hover:dark:bg-blue-800 transition-colors ${index > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
                            >
                                <View className={isMedium ? 'w-64 gap-1' : 'w-full gap-1'}>
                                    <Link alt href={`/competitive/ladder-tournament/${season.id}`} numberOfLines={1}>
                                        {seasonTitle(season)}
                                    </Link>
                                    <LadderStatusPill season={season} />
                                </View>
                                <Text variant="body-sm" color="subtle" className={isMedium ? 'w-52' : ''}>
                                    {formatLadderRange(season.ladderStart, season.ladderEnd)}
                                </Text>
                                <Text variant="body-sm" color="subtle" className={isMedium ? 'w-40' : ''}>
                                    {season.players} {getTranslation('ladderTournament.stats.players')} · {season.casts}{' '}
                                    {getTranslation('ladderTournament.column.casts')}
                                </Text>
                                {season.champions.length > 0 && (
                                    <View className="flex-1 flex-row flex-wrap items-center gap-x-3 gap-y-1 min-w-40">
                                        {season.champions.map((champion) => (
                                            <LadderPlayerLink key={champion.profileId} player={champion} />
                                        ))}
                                        <Text variant="body-sm" color="subtle">
                                            {formatRecord(season.championsRecord)}
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </Card>
                </View>
            )}

            {!!data && data.videos.length > 0 && (
                <View className="gap-2">
                    <Text variant="header-lg">{getTranslation('ladderTournament.latestCasts')}</Text>
                    <LadderVideoGrid videos={data.videos.slice(0, LATEST_CASTS)} />
                </View>
            )}

            {!!data && (
                <LadderSourceLink />
            )}
        </ScrollView>
    );
}
