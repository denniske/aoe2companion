import { Button } from '@app/components/button';
import { fetchFakeLeaderboardPage, PAGE_DELAY_MS } from '@app/components/leaderboard/benchmark-data';
import { LeaderboardRow, ROW_HEIGHT, useLeaderboardGamesLabel, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';
import { Text } from '@app/components/text';
import { containerClassName } from '@app/styles';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { ILeaderboardPlayer } from '../../../api/helper/api.types';

/**
 * The leaderboard row in the shape the real screen uses it — a list, paged in —
 * but with everything else stripped out: no country/leaderboard selects, no
 * scroll handle, no rank-width maths, no network.
 *
 * A page is 50 synthetic rows handed back after a fixed 2s delay, which is the
 * point of the page: you press the button, you have two seconds to get a
 * profiler recording or your eyes on the list, and then 50 rows land in a single
 * commit. That commit is what the leaderboard costs.
 *
 * Companion to /statistics/leaderboard-row-benchmark, which times the same
 * commit in isolation. This one keeps a real FlatList in the way, so it also
 * shows the part the benchmark cannot: native view creation and layout for the
 * rows, which is where the mobile time goes once the JS side is cheap.
 */

const PAGE_SIZE = 50;
const MAX_PAGES = 20;
const TOTAL = PAGE_SIZE * MAX_PAGES;

const noopSelect = () => {};

export default function LeaderboardRowFlatListPage() {
    // Bumped by Reset. A fresh key means a fresh query: back to one page, and the
    // first load goes through the same 2s delay as every page after it.
    const [run, setRun] = useState(0);

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['leaderboard-row-flatlist', run],
        queryFn: ({ pageParam }) => fetchFakeLeaderboardPage({ page: pageParam, pageSize: PAGE_SIZE, total: TOTAL }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => (lastPage.page < MAX_PAGES ? lastPage.page + 1 : null),
        gcTime: 0,
    });

    // One flat array of players. React Query hands back the same page objects until
    // a page actually lands, so this only rebuilds when there is something new.
    const players = React.useMemo(() => data?.pages.flatMap((page) => page.players) ?? [], [data?.pages]);

    // Everything a row would otherwise look up for itself, resolved once here — the
    // whole reason the current row takes no hooks. See leaderboard-row.tsx.
    const styles = useLeaderboardRowStyles();
    const gamesLabel = useLeaderboardGamesLabel();
    const { width } = useWindowDimensions();
    const showGames = width >= 360;

    const renderItem = useCallback(
        ({ item, index }: { item: ILeaderboardPlayer; index: number }) => (
            <LeaderboardRow
                player={item}
                i={index}
                showCountryRank={false}
                showGames={showGames}
                gamesLabel={gamesLabel}
                authProfileId={null}
                rankWidth={43}
                styles={styles}
                onSelect={noopSelect}
            />
        ),
        [showGames, gamesLabel, styles]
    );

    // The row height is fixed, so FlatList never has to measure one.
    const getItemLayout = useCallback(
        (_data: ArrayLike<ILeaderboardPlayer> | null | undefined, index: number) => ({
            length: ROW_HEIGHT,
            offset: ROW_HEIGHT * index,
            index,
        }),
        []
    );

    const pageCount = data?.pages.length ?? 0;

    return (
        <View className="flex-1">
            <Stack.Screen options={{ title: 'Row flat list' }} />

            <View className={`gap-2 py-3 ${containerClassName}`}>
                <View className="flex-row flex-wrap gap-2">
                    <Button size="small" disabled={!hasNextPage || isFetching} onPress={() => fetchNextPage()}>
                        {isFetchingNextPage ? 'Loading…' : 'Load next page'}
                    </Button>
                    <Button size="small" disabled={isFetching} onPress={() => setRun((value) => value + 1)}>
                        Reset
                    </Button>
                </View>

                <Text variant="body-sm" color="subtle">
                    {players.length} rows, {pageCount} {pageCount === 1 ? 'page' : 'pages'} of {PAGE_SIZE}, {PAGE_DELAY_MS / 1000}s per page
                    {isFetching ? ' — fetching…' : ''}
                    {!hasNextPage && !isFetching ? ' — no more pages' : ''}
                </Text>
            </View>

            <FlatList
                className="flex-1"
                data={players}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.profileId)}
                getItemLayout={getItemLayout}
                ListEmptyComponent={
                    <View className="py-8 items-center">
                        <Text color="subtle">{isFetching ? 'Loading first page…' : 'No rows'}</Text>
                    </View>
                }
            />
        </View>
    );
}
