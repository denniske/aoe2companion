import { View } from 'react-native';
import { Text } from './text';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '@app/api/helper/api';
import { useLanguage } from '@app/queries/all';
import { CountryImage } from '@app/view/components/country-image';
import { Link } from 'expo-router';

export const LeaderboardSnapshot: React.FC<{ leaderboardId: string | undefined }> = ({ leaderboardId }) => {
    const language = useLanguage();
    const { data } = useQuery({
        enabled: !!language && !!leaderboardId,
        queryKey: ['leaderboard-players', leaderboardId],
        queryFn: () => {
            return fetchLeaderboard({
                perPage: 5,
                leaderboardId: leaderboardId!,
                extend: ['players.verified'],
                language: language!,
            });
        },
    });

    return (
        <View>
            <View className="flex-row p-2 gap-4 items-center">
                <Text variant="label-xs" className="w-8">
                    Rank
                </Text>
                <Text variant="label-xs" className="flex-1">
                    Name
                </Text>
                <Text variant="label-xs" className="w-12">
                    Rating
                </Text>
                <Text variant="label-xs" className="w-12">
                    Games
                </Text>
                <Text variant="label-xs" className="w-12">
                    Win %
                </Text>
            </View>

            {data?.players.map((player) => (
                <View className="flex-row p-2 gap-4 items-center border-t border-border" key={player.profileId}>
                    <Text variant="label-lg" className="w-8">
                        #{player.rank}
                    </Text>
                    <Link className="flex flex-row items-center gap-1 flex-1 group" href={`/players/${player.profileId}`}>
                        <CountryImage country={player.country} />
                        <Text variant="label-lg" className="group-hover:underline">
                            {player.name}
                        </Text>
                    </Link>

                    <Text className="w-12">{player.rating}</Text>
                    <Text className="w-12">{player.games}</Text>
                    <Text className="w-12">{((player.wins / player.games) * 100).toFixed(0)}%</Text>
                </View>
            ))}
        </View>
    );
};
