import { LadderBadge, useLadderTournamentPlayer } from '@app/api/ladder-tournament';
import { Card } from '@app/components/card';
import { FlatList } from '@app/components/flat-list';
import { Link } from '@app/components/link';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import { LadderMedal, LadderStatusPill, LadderVideoCard, useLadderSeasonTitle } from '@app/view/ladder-tournament/ladder-components';
import { View } from 'react-native';

/** The player's Ladder Tournament seasons, titles and casts. Renders nothing for a player who never took part. */
export const LadderProfileSection: React.FC<{ profileId: number; className?: string }> = ({ profileId, className }) => {
    const getTranslation = useTranslation();
    const seasonTitle = useLadderSeasonTitle();
    const { data } = useLadderTournamentPlayer(profileId);

    if (!data || (data.seasons.length === 0 && data.videos.length === 0)) return null;

    // Medals belong to the player rather than to a season, though the API repeats them on every season row.
    const medalOrder: LadderBadge[] = ['ladderwinner', 'thelegend', 'liquipedia', 'paganini', 'discord'];
    const medals = medalOrder.filter((badge) => data.seasons.some(({ standing }) => standing.badges.includes(badge)));

    return (
        <View className={`gap-2 ${className ?? ''}`}>
            <View className="flex-row items-center justify-between">
                <Text variant="header-lg">{getTranslation('ladderTournament.title')}</Text>
                <Link href="/competitive/ladder-tournament">{getTranslation('ladderTournament.allSeasons')}</Link>
            </View>

            {data.seasons.map(({ season, standing }) => (
                <Card key={season.id} href={`/competitive/ladder-tournament/${season.id}`} direction="vertical" className="gap-1.5">
                    <View className="flex-row flex-wrap items-center gap-2">
                        <Text variant="header-sm">{seasonTitle(season)}</Text>
                        <LadderStatusPill season={season} />
                    </View>
                    <Text variant="body-sm">
                        {getTranslation('ladderTournament.profile.result', {
                            position: standing.position,
                            players: season.players,
                            wins: standing.wins,
                            losses: standing.losses,
                            score: standing.score,
                        })}
                    </Text>
                </Card>
            ))}

            {medals.length > 0 && (
                <Card direction="vertical" className="gap-2">
                    <Text variant="label-sm" color="subtle" className="uppercase">
                        {getTranslation('ladderTournament.medals')}
                    </Text>
                    <View className="flex-row flex-wrap gap-4">
                        {medals.map((badge) => (
                            <LadderMedal key={badge} badge={badge} />
                        ))}
                    </View>
                </Card>
            )}

            {data.videos.length > 0 && (
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={data.videos}
                    keyExtractor={(video) => video.key}
                    contentContainerClassName="gap-2.5"
                    renderItem={({ item }) => <LadderVideoCard video={item} className="w-60" />}
                />
            )}
        </View>
    );
};
