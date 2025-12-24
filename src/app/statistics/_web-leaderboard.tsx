import { fetchLeaderboard } from '@app/api/helper/api';
import { ILeaderboardDef } from '@app/api/helper/api.types';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { Text } from '@app/components/text';
import { Image } from '@app/components/uniwind/image';
import { useTranslation } from '@app/helper/translate';
import useDebounce from '@app/hooks/use-debounce';
import { useLanguage } from '@app/queries/all';
import { containerClassName } from '@app/styles';
import ButtonPicker from '@app/view/components/button-picker';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { formatAgo } from '@nex/data';
import { useInfiniteQuery } from '@tanstack/react-query';
import cn from 'classnames';
import { Link, Stack } from 'expo-router';
import { flatten } from 'lodash';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export const WebLeaderboard: React.FC<{ leaderboards: ILeaderboardDef[] | undefined }> = ({ leaderboards }) => {
    const getTranslation = useTranslation();
    const [leaderboard, setLeaderboard] = useState<ILeaderboardDef | null>(null);
    const [search, setSearch] = useState('');
    const leaderboardIds = leaderboards?.map((l) => l.leaderboardId);

    useEffect(() => {
        if (leaderboards) {
            setLeaderboard(leaderboards[0]);
        }
    }, [leaderboards]);

    return (
        <View className={cn('py-4', containerClassName)}>
            <Stack.Screen
                options={{
                    title: getTranslation('leaderboard.title'),
                }}
            />

            <View className="flex lg:flex-row items-center gap-6">
                <Field value={search} onChangeText={setSearch} placeholder="Search for player" type="search" />

                {leaderboards && leaderboard && (
                    <View className="w-full lg:flex-1">
                        <ButtonPicker
                            flex={true}
                            value={leaderboard?.leaderboardId}
                            values={leaderboardIds ?? []}
                            formatter={(value) => leaderboards?.find((l) => l.leaderboardId === value)?.abbreviation ?? ''}
                            onSelect={(value) => {
                                const newLeaderboard = leaderboards?.find((l) => l.leaderboardId === value);
                                if (newLeaderboard) {
                                    setLeaderboard(newLeaderboard);
                                }
                            }}
                        />
                    </View>
                )}
            </View>

            {leaderboard && <PlayerList leaderboard={leaderboard} search={search} />}
        </View>
    );
};

function PlayerList({ leaderboard, search }: { leaderboard: ILeaderboardDef; search: string }) {
    const getTranslation = useTranslation();
    const debouncedSearch = useDebounce(search, 600);
    const language = useLanguage();

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['leaderboard-players', debouncedSearch, leaderboard.leaderboardId],
        queryFn: (context) => {
            return fetchLeaderboard({
                ...context,
                pageParam: `${context.pageParam}`,
                search: context.queryKey[1] as string,
                leaderboardId: context.queryKey[2] as string,
                extend: ['players.avatar_medium_url'],
                language: language!,
            });
        },
        enabled: !!language,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.page + 1,
    });

    const isLoading = (isFetching && !isFetchingNextPage) || debouncedSearch !== search;

    return (
        <View>
            {isLoading ? (
                <FlatListLoadingIndicator />
            ) : (
                <table className={`w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-4`}>
                    <thead className={`text-xs text-gray-700 uppercase dark:text-gray-400`}>
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Rank
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Rating
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Highest Rating
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Wins
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Games
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Last Match
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {flatten(data?.pages?.map((p) => p.players) || []).map((player) => (
                            <tr key={player.profileId} className="border-b border-border">
                                <td className="py-4 px-6">
                                    <Text variant="label-lg">#{player.rank}</Text>
                                </td>
                                <th scope="row" className="py-4 px-6">
                                    <Link
                                        href={`/players/${player.profileId}`}
                                        className="flex flex-row gap-3 items-center text-default hover:underline"
                                    >
                                        <Image source={{ uri: player?.avatarMediumUrl }} className="w-10 h-10 rounded-full" />
                                        <Text variant="label-lg" color="inherit">
                                            {player.name}
                                        </Text>
                                    </Link>
                                </th>
                                <td className="py-4 px-6">
                                    <Text variant="label">{player.rating}</Text>
                                </td>
                                <td className="py-4 px-6">
                                    <Text>{player.maxRating}</Text>
                                </td>
                                <td className="py-4 px-6">
                                    <Text>{((player.wins / player.games) * 100).toFixed(0)} %</Text>
                                </td>
                                <td className="py-4 px-6">
                                    <Text>{player.games}</Text>
                                </td>
                                <td className="py-4 px-6">
                                    <Text>{formatAgo(player.lastMatchTime)}</Text>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {hasNextPage && !search && !isFetchingNextPage && !isLoading && (
                <View className="py-4 flex-row justify-center">
                    <Button onPress={() => fetchNextPage()}>{getTranslation('footer.loadMore')}</Button>
                </View>
            )}

            {isFetchingNextPage && <FlatListLoadingIndicator />}
        </View>
    );
}
