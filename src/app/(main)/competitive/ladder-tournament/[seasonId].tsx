import { formatStage, groupVideosByStage, ladderSeasonPhase, useLadderTournament } from '@app/api/ladder-tournament';
import { Card } from '@app/components/card';
import { FlatList } from '@app/components/flat-list';
import { ScrollView } from '@app/components/scroll-view';
import { Skeleton } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import NotFound from '@app/app/(main)/+not-found';
import {
    formatLadderDate,
    LadderPlayerLink,
    LadderSeasonDetails,
    LadderSeasonStats,
    LadderStandingsTable,
    LadderStatusPill,
    LadderTournamentTitle,
    LadderVideoCard,
    useLadderSeasonTitle,
} from '@app/view/ladder-tournament/ladder-components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Icon } from '@app/components/icon';
import { faTrophy } from '@fortawesome/sharp-solid-svg-icons';

export default function LadderTournamentSeasonPage() {
    const getTranslation = useTranslation();
    const seasonTitle = useLadderSeasonTitle();
    const params = useLocalSearchParams<{ seasonId: string }>();
    const seasonId = Number(params.seasonId);
    const { data, isPending, isError } = useLadderTournament();

    const season = data?.seasons.find((item) => item.id === seasonId);

    if (isPending) {
        return (
            <ScrollView contentContainerClassName="p-4 gap-4">
                <Stack.Screen options={{ title: getTranslation('ladderTournament.title') }} />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-96 rounded-lg" />
            </ScrollView>
        );
    }

    if (isError) {
        return (
            <ScrollView contentContainerClassName="p-4">
                <Stack.Screen options={{ title: getTranslation('ladderTournament.title') }} />
                <Card>
                    <Text>{getTranslation('ladderTournament.unavailable')}</Text>
                </Card>
            </ScrollView>
        );
    }

    if (!season) {
        return <NotFound />;
    }

    const phase = ladderSeasonPhase(season);
    const stages = groupVideosByStage(data.videos.filter((video) => video.seasonId === season.id));

    return (
        <ScrollView contentContainerClassName="p-4 gap-6 pb-8">
            <Stack.Screen options={{ title: seasonTitle(season) }} />

            <View className="gap-3">
                <LadderTournamentTitle>
                    <LadderStatusPill season={season} />
                </LadderTournamentTitle>
                <LadderSeasonStats season={season} />
                {season.champions.length > 0 && (
                    <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
                        <Icon icon={faTrophy} size={14} color="brand" />
                        <Text variant="label-sm">{getTranslation('ladderTournament.champions')}</Text>
                        {season.champions.map((champion) => (
                            <LadderPlayerLink key={champion.profileId} player={champion} />
                        ))}
                    </View>
                )}
            </View>

            <LadderSeasonDetails season={season} />

            <View className="gap-2">
                <View className="flex-row items-center justify-between">
                    <Text variant="header-lg">{getTranslation('ladderTournament.standings')}</Text>
                    {season.standings.length > 0 && (
                        <Text variant="body-xs" color="brand">
                            {getTranslation('ladderTournament.sortedByScore')}
                        </Text>
                    )}
                </View>
                {season.standings.length > 0 ? (
                    <LadderStandingsTable standings={season.standings} />
                ) : (
                    <Card>
                        <Text color="subtle">
                            {season.ladderStart && phase !== 'ladder'
                                ? getTranslation('ladderTournament.noStandingsUntil', { date: formatLadderDate(season.ladderStart) })
                                : getTranslation('ladderTournament.noStandings')}
                        </Text>
                    </Card>
                )}
            </View>

            <View className="gap-3">
                <Text variant="header-lg">{getTranslation('ladderTournament.castedMatches')}</Text>
                {stages.length === 0 && (
                    <Card>
                        <Text color="subtle">{getTranslation('ladderTournament.noCasts')}</Text>
                    </Card>
                )}
                {stages.map(({ stage, videos }) => (
                    <View key={stage} className="gap-1.5">
                        <Text variant="label-sm" color="subtle" className="uppercase">
                            {stage ? formatStage(stage) : getTranslation('ladderTournament.stage.other')} · {videos.length}
                        </Text>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={videos}
                            keyExtractor={(video) => video.key}
                            contentContainerClassName="gap-2.5"
                            renderItem={({ item }) => <LadderVideoCard video={item} showStage={false} className="w-60" />}
                        />
                    </View>
                ))}
            </View>

            <Text variant="body-xs" color="subtle" className="self-center">
                {getTranslation('ladderTournament.source')}
            </Text>
        </ScrollView>
    );
}
