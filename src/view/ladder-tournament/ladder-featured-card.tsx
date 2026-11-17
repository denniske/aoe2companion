import { ladderTournamentEnabled, useLadderTournament } from '@app/api/ladder-tournament';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { useTranslation } from '@app/helper/translate';
import {
    formatLadderRange,
    LadderPlayerLink,
    LadderStatusPill,
    LadderTournamentTitle,
    useLadderSeasonTitle,
} from '@app/view/ladder-tournament/ladder-components';
import { View } from 'react-native';

/** The Ladder Tournament's current season, linking to its page. Renders nothing while there is no data. */
export const LadderFeaturedCard: React.FC = () => {
    const getTranslation = useTranslation();
    const seasonTitle = useLadderSeasonTitle();
    const { data } = useLadderTournament();
    const featured = data?.seasons.find((season) => season.id === data.featuredSeasonId);

    if (!ladderTournamentEnabled || !featured) return null;

    const leaders = featured.standings.slice(0, 3);

    return (
        <Card href="/competitive/ladder-tournament" direction="vertical" className="gap-2">
            <LadderTournamentTitle subtitle={seasonTitle(featured)} />
            <View className="flex-row flex-wrap items-center gap-2">
                <LadderStatusPill season={featured} />
                <Text variant="body-sm" color="subtle">
                    {formatLadderRange(featured.ladderStart, featured.ladderEnd)}
                </Text>
            </View>
            {leaders.length > 0 && (
                <View className="flex-row flex-wrap gap-x-4 gap-y-1">
                    {leaders.map((row) => (
                        <View key={row.profileId} className="flex-row items-center gap-1">
                            <Text variant="label-sm">{row.position}.</Text>
                            <LadderPlayerLink player={row} />
                            <Text variant="body-sm" color="subtle">
                                {getTranslation('ladderTournament.points', { score: row.score })}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </Card>
    );
};
