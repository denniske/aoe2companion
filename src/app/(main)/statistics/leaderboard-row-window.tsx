import { Button } from '@app/components/button';
import { fetchFakeLeaderboardPage, PAGE_DELAY_MS } from '@app/components/leaderboard/benchmark-data';
import { LeaderboardRow, useLeaderboardGamesLabel, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';
import { Text } from '@app/components/text';
import { containerClassName } from '@app/styles';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { ILeaderboardPlayer } from '../../../api/helper/api.types';

/**
 * The other way to page a leaderboard: hold a window instead of the whole thing.
 *
 * Jump lands you at a random page — rank ~7000, say — and only that page exists.
 * Scrolling down loads the page below, scrolling up loads the page above, and
 * react-query's `maxPages` drops the page at the far end, so the list stays
 * {@link MAX_PAGES} pages long no matter how far you travel. Rows are only ever
 * created for what is near you, unlike /statistics/leaderboard-row-skeleton-list
 * which is `total` rows long from the first frame.
 *
 * Two things make this work and neither is in a plain FlatList:
 *
 *  - `useInfiniteQuery` with both `getNextPageParam` and `getPreviousPageParam`,
 *    plus `maxPages` — a bounded, two-ended window. FlatList's onEndReached only
 *    ever points one way.
 *  - FlashList v2's `maintainVisibleContentPosition`, on by default. Prepending
 *    50 rows above the viewport, or dropping 50, moves everything below by
 *    50 x ROW_HEIGHT; without compensation the content jumps under your finger.
 *    That compensation is the thing to check on this page.
 *
 * Fake data, {@link PAGE_DELAY_MS} per page, no network.
 */

const PAGE_SIZE = 50;
const TOTAL_PAGES = 200;
const TOTAL = PAGE_SIZE * TOTAL_PAGES;
/** How many pages stay mounted. 4 x 50 rows is a few screens either side. */
const MAX_PAGES = 4;

const noopSelect = () => {};

export default function LeaderboardRowWindowPage() {
    const listRef = useRef<FlashListRef<ILeaderboardPlayer>>(null);
    const [anchorPage, setAnchorPage] = useState(1);

    // The list sits at the top right after a jump, which is inside
    // onStartReachedThreshold, so onStartReached fires before the user has done
    // anything. Only let it through once they have actually scrolled — otherwise
    // every jump silently pulls the page above it too.
    const hasScrolled = useRef(false);

    const { data, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage, isFetching, isFetchingNextPage, isFetchingPreviousPage } =
        useInfiniteQuery({
            // The anchor is part of the key: a jump is a different query, not a
            // refetch of this one, so the old window is thrown away rather than
            // paged across half the leaderboard to reach the new position.
            queryKey: ['leaderboard-row-window', anchorPage],
            queryFn: ({ pageParam }) => fetchFakeLeaderboardPage({ page: pageParam, pageSize: PAGE_SIZE, total: TOTAL }),
            initialPageParam: anchorPage,
            getNextPageParam: (lastPage) => (lastPage.page < TOTAL_PAGES ? lastPage.page + 1 : null),
            getPreviousPageParam: (firstPage) => (firstPage.page > 1 ? firstPage.page - 1 : null),
            maxPages: MAX_PAGES,
            gcTime: 0,
        });

    const pages = data?.pages;
    const rows = React.useMemo(() => pages?.flatMap((page) => page.players) ?? [], [pages]);

    // Hoisted out of the row, as on the real screen.
    const styles = useLeaderboardRowStyles();
    const gamesLabel = useLeaderboardGamesLabel();
    const { width } = useWindowDimensions();
    const showGames = width >= 360;
    // Fixed rather than measured per window: rank text jumping from 3 to 4 digits
    // would resize the column mid-scroll, which is a different bug to chase.
    const rankWidth = (String(TOTAL).length + 1) * 10;

    const renderItem = useCallback(
        ({ item, index }: { item: ILeaderboardPlayer; index: number }) => (
            <LeaderboardRow
                player={item}
                i={index}
                showCountryRank={false}
                showGames={showGames}
                gamesLabel={gamesLabel}
                authProfileId={null}
                rankWidth={rankWidth}
                styles={styles}
                onSelect={noopSelect}
            />
        ),
        [showGames, gamesLabel, styles, rankWidth]
    );

    const jump = () => {
        hasScrolled.current = false;
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
        setAnchorPage(1 + Math.floor(Math.random() * TOTAL_PAGES));
    };

    const onScroll = useCallback(() => {
        hasScrolled.current = true;
    }, []);

    const onStartReached = useCallback(() => {
        if (!hasScrolled.current) return;
        fetchPreviousPage();
    }, [fetchPreviousPage]);

    const onEndReached = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    const firstRank = rows[0]?.rank;
    const lastRank = rows[rows.length - 1]?.rank;
    const pageNumbers = pages?.map((page) => page.page) ?? [];

    return (
        <View className="flex-1">
            <Stack.Screen options={{ title: 'Row window' }} />

            <View className={`gap-2 py-3 ${containerClassName}`}>
                <View className="flex-row flex-wrap gap-2">
                    <Button size="small" onPress={jump}>
                        Jump to random position
                    </Button>
                </View>

                <Text variant="body-sm" color="subtle">
                    {rows.length > 0 ? `#${firstRank} – #${lastRank}` : `page ${anchorPage}`}, {pageNumbers.length}/{MAX_PAGES} pages
                    {pageNumbers.length > 0 ? ` (${pageNumbers[0]}–${pageNumbers[pageNumbers.length - 1]})` : ''} of {TOTAL_PAGES}, {PAGE_SIZE} rows
                    each, {PAGE_DELAY_MS / 1000}s to load
                </Text>
                <Text variant="body-xs" color="subtle">
                    {isFetchingPreviousPage
                        ? 'loading page above…'
                        : isFetchingNextPage
                          ? 'loading page below…'
                          : isFetching
                            ? 'loading…'
                            : `${hasPreviousPage ? '↑' : '—'} scroll to load ${hasNextPage ? '↓' : '—'}`}
                </Text>
            </View>

            <FlashList
                ref={listRef}
                data={rows}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.profileId)}
                onScroll={onScroll}
                scrollEventThrottle={100}
                onStartReached={onStartReached}
                onStartReachedThreshold={0.5}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <View className="py-8 items-center">
                        <Text color="subtle">{isFetching ? `Loading page ${anchorPage}…` : 'No rows'}</Text>
                    </View>
                }
            />
        </View>
    );
}
