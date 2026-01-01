import { View } from 'react-native';
import { Text } from './text';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '@app/api/helper/api';
import { useLanguage } from '@app/queries/all';
import { CountryImage } from '@app/view/components/country-image';
import { Link } from 'expo-router';
import { SkeletonText } from './skeleton';

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

    const players = data?.players ?? Array<null>(5).fill(null);

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

            {players.map((player, index) => {
                const TextComponent = player ? Text : SkeletonText;

                return (
                    <View className="flex-row p-2 gap-4 items-center border-t border-border" key={player ? player.profileId : index}>
                        <TextComponent variant="label-lg" className="w-8!" alt>
                            #{player?.rank}
                        </TextComponent>
                        <Link className="flex flex-row items-center gap-1 flex-1 group" href={`/players/${player?.profileId}`}>
                            <CountryImage country={player?.country} />
                            <TextComponent variant="label-lg" className="group-hover:underline w-auto! min-w-24" alt>
                                {player?.name}
                            </TextComponent>
                        </Link>

                        <TextComponent className="w-12!" alt>
                            {player?.rating}
                        </TextComponent>
                        <TextComponent className="w-12!" alt>
                            {player?.games}
                        </TextComponent>
                        <TextComponent className="w-12!" alt>
                            {player ? ((player.wins / player.games) * 100).toFixed(0) : ''}%
                        </TextComponent>
                    </View>
                );
            })}
        </View>
    );
};
