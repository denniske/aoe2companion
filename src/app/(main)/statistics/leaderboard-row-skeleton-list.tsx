import { Button } from '@app/components/button';
import { fetchFakeLeaderboardPage, PAGE_DELAY_MS } from '@app/components/leaderboard/benchmark-data';
import { LeaderboardListRow, LeaderboardRow, useLeaderboardGamesLabel, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';
import { Text } from '@app/components/text';
import { containerClassName } from '@app/styles';
import { FlashList } from '@shopify/flash-list';
import { useQueries } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View, ViewToken } from 'react-native';

/**
 * The leaderboard's paging model, minus the leaderboard.
 *
 * The list is `TOTAL` rows long from the first frame — every row that has no data
 * yet renders as a skeleton — and pages are fetched for whatever is on screen.
 * Scroll fast enough and you outrun the fetches, so you scroll through skeletons
 * and they fill in underneath you. That transition is the thing to watch here:
 * it is the commit that used to stutter, and a row whose height disagreed with
 * the list's estimate used to yank the scroll position back when it landed.
 *
 * Nothing else from the real screen is here: no country/leaderboard selects, no
 * scroll handle, no rank-width maths, no network. Paging is react-query
 * (`useQueries`, one query per page — random access, unlike an infinite query)
 * and the fetch is fake with a fixed {@link PAGE_DELAY_MS} delay.
 *
 * FlashList is the raw one, not @app/components/flash-list: the wrapper restores
 * scroll position across focus and drives the tab bar, both of which would move
 * the list out from under a measurement.
 */

const PAGE_SIZE = 100;
const TOTAL = 5000;

const noopSelect = () => {};

// Same rule the real screen's viewability would use: a row counts as visible as
// soon as any of it is.
const viewabilityConfig = { itemVisiblePercentThreshold: 0 };

// One object per row, never a hole in the array — see LeaderboardListRow for what
// goes wrong otherwise (recycled cells keep a stale rank while they are skeletons,
// which is exactly what this page is here to watch).
const makeSkeletonRows = () => Array.from({ length: TOTAL }, (_, index): LeaderboardListRow => ({ index }));

export default function LeaderboardRowSkeletonListPage() {
    // Bumped by Reset: a new key means empty caches, so every page is fetched
    // again and the whole list goes back to skeletons.
    const [run, setRun] = useState(0);

    // Pages the list has asked for. Grows as you scroll and is never pruned —
    // like the real screen, which keeps every page it ever loaded.
    const [requestedPages, setRequestedPages] = useState<number[]>([1]);

    const results = useQueries({
        queries: requestedPages.map((page) => ({
            queryKey: ['leaderboard-row-skeleton-list', run, page],
            queryFn: () => fetchFakeLeaderboardPage({ page, pageSize: PAGE_SIZE, total: TOTAL }),
            staleTime: Infinity,
            gcTime: Infinity,
        })),
    });

    // The sparse list itself. Held in state and patched page by page rather than
    // rebuilt from the query results every render: rebuilding would hand FlashList
    // a new array on every scroll event, and this way the identity changes exactly
    // when a page lands — which is the commit being watched.
    const [rows, setRows] = useState<LeaderboardListRow[]>(makeSkeletonRows);
    const appliedPages = useRef(new Set<number>());

    // useQueries structurally shares its result array, so this only runs when a
    // query actually changes — and `appliedPages` makes it exact anyway: a page is
    // spliced in once, on the render after it resolves.
    useEffect(() => {
        const landed = results.map((result) => result.data).filter((page) => page != null && !appliedPages.current.has(page.page));
        if (landed.length === 0) return;

        landed.forEach((page) => appliedPages.current.add(page!.page));
        setRows((current) => {
            const next = current.slice();
            landed.forEach((page) => {
                const offset = (page!.page - 1) * PAGE_SIZE;
                page!.players.forEach((player, i) => (next[offset + i] = { index: offset + i, player }));
            });
            return next;
        });
    }, [results]);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length === 0) return;

        const first = viewableItems[0].index ?? 0;
        const last = viewableItems[viewableItems.length - 1].index ?? first;
        const firstPage = Math.floor(first / PAGE_SIZE) + 1;
        const lastPage = Math.floor(last / PAGE_SIZE) + 1;

        setRequestedPages((current) => {
            const missing: number[] = [];
            for (let page = firstPage; page <= lastPage; page++) {
                if (!current.includes(page)) missing.push(page);
            }
            // Same array back when there is nothing new, so a scroll event that
            // stays inside a loaded page costs no render at all.
            return missing.length === 0 ? current : [...current, ...missing];
        });
    }, []);

    // Hoisted out of the row, as on the real screen.
    const styles = useLeaderboardRowStyles();
    const gamesLabel = useLeaderboardGamesLabel();
    const { width } = useWindowDimensions();
    const showGames = width >= 360;

    const renderItem = useCallback(
        ({ item }: { item: LeaderboardListRow }) => (
            <LeaderboardRow
                player={item.player}
                // item.index, not the renderItem index: see LeaderboardListRow. They are
                // the same number, but only this one is guaranteed to be current.
                i={item.index}
                showCountryRank={false}
                showGames={showGames}
                gamesLabel={gamesLabel}
                authProfileId={null}
                rankWidth={(String(TOTAL).length + 1) * 10}
                styles={styles}
                onSelect={noopSelect}
            />
        ),
        [showGames, gamesLabel, styles]
    );

    const reset = () => {
        appliedPages.current = new Set();
        setRows(makeSkeletonRows());
        setRequestedPages([1]);
        setRun((value) => value + 1);
    };

    const loaded = results.filter((result) => result.data != null).length;
    const fetching = results.filter((result) => result.isFetching).length;

    return (
        <View className="flex-1">
            <Stack.Screen options={{ title: 'Row skeleton list' }} />

            <View className={`gap-2 py-3 ${containerClassName}`}>
                <View className="flex-row flex-wrap gap-2">
                    <Button size="small" onPress={reset}>
                        Reset
                    </Button>
                </View>

                <Text variant="body-sm" color="subtle">
                    {TOTAL} rows, pages of {PAGE_SIZE}, {PAGE_DELAY_MS / 1000}s each — {loaded}/{requestedPages.length} loaded
                    {fetching > 0 ? `, ${fetching} in flight` : ''}
                </Text>
            </View>

            <FlashList
                data={rows}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.index)}
                // No estimatedItemSize: FlashList v2 measures the extent itself, and
                // every row is exactly ROW_HEIGHT tall whether it holds data or a
                // skeleton — which is why filling one in cannot move the list.
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
        </View>
    );
}
