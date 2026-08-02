import { fetchLeaderboard } from '@app/api/helper/api';
import { ILeaderboardDef } from '@app/api/helper/api.types';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { countryEarth, CountrySelect, isCountry } from '@app/components/select/country-select';
import { Text } from '@app/components/text';
import { Image } from '@app/components/uniwind/image';
import { useTranslation } from '@app/helper/translate';
import useDebounce from '@app/hooks/use-debounce';
import { useFollowedAndMeProfileIds, useLanguage, useLeaderboards } from '@app/queries/all';
import { containerClassName } from '@app/styles';
import ButtonPicker from '@app/view/components/button-picker';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { formatAgo } from '@nex/data';
import { useInfiniteQuery } from '@tanstack/react-query';
import cn from 'classnames';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { flatten } from 'lodash';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { LeaderboardOfficialSelect } from '@app/components/select/leaderboard-official-select';

function paramToString(value: string | string[] | undefined): string | null {
    return (Array.isArray(value) ? value[0] : value) ?? null;
}

export const WebLeaderboard: React.FC = () => {
    const getTranslation = useTranslation();
    const [leaderboardId, setLeaderboardId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const { leaderboard: initialLeaderboardId, country: initialCountry } = useLocalSearchParams<{ leaderboard?: string; country?: string }>();

    // Seeded from the URL on the first render rather than in an effect, so the
    // initial player query already carries the country instead of firing once
    // without it and immediately refetching.
    const [leaderboardCountry, setLeaderboardCountry] = useState<string | null>(() => {
        const country = paramToString(initialCountry)?.toUpperCase() ?? null;
        return isCountry(country) ? country : null;
    });

    const { data: leaderboards } = useLeaderboards();
    const selectedLeaderboard = leaderboards?.find((l) => l.leaderboardId === leaderboardId);

    const headerTitle = getTranslation('leaderboard.title');
    const title = selectedLeaderboard ? `${selectedLeaderboard.leaderboardName} ${getTranslation('leaderboard.title')}` : headerTitle;

    return (
        <View className={cn('py-4', containerClassName)}>
            <Stack.Screen
                options={{
                    title,
                    headerTitle,
                }}
            />

            <View className="flex xl:flex-row items-center gap-6">
                <View className="flex-row">
                    <Field value={search} onChangeText={setSearch} placeholder="Search for player" type="search" />
                </View>
                <View className="flex-1"></View>
                <View className="flex-row">
                    <LeaderboardOfficialSelect
                        leaderboardId={leaderboardId}
                        onLeaderboardIdChange={setLeaderboardId}
                        initialLeaderboardId={paramToString(initialLeaderboardId)}
                    />
                </View>
                <View className="flex-row">
                    <CountrySelect country={leaderboardCountry} onCountryChange={setLeaderboardCountry} />
                </View>
            </View>

            {!!(leaderboardId) && <PlayerList leaderboardId={leaderboardId} search={search} leaderboardCountry={leaderboardCountry} />}
        </View>
    );
};

function PlayerList({
    leaderboardId,
    search,
    leaderboardCountry,
}: {
    leaderboardId: string;
    search: string;
    leaderboardCountry: string | null;
}) {
    const getTranslation = useTranslation();
    const debouncedSearch = useDebounce(search, 600);
    const language = useLanguage();

    const followingIds = useFollowedAndMeProfileIds();

    const params = useMemo(() => {
        if (leaderboardCountry === 'following') {
            return { profileIds: followingIds };
        }
        if (leaderboardCountry?.startsWith('Clan ')) {
            return { clan: leaderboardCountry?.replace('Clan ', '') };
        }
        if (leaderboardCountry === countryEarth) {
            return {};
        }
        return { country: leaderboardCountry };
    }, [followingIds, leaderboardCountry]);

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['leaderboard-players', debouncedSearch, leaderboardId, params],
        queryFn: (context) => {
            return fetchLeaderboard({
                ...context,
                ...params,
                pageParam: `${context.pageParam}`,
                search: context.queryKey[1] as string,
                leaderboardId: context.queryKey[2] as string,
                extend: ['players.avatar_medium_url'],
                language: language!,
            });
        },
        enabled: !!language,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => (lastPage.players.length === lastPage.perPage ? lastPage.page + 1 : null),
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

            {!!(isFetchingNextPage) && <FlatListLoadingIndicator />}
        </View>
    );
}
