import { countryEarth, CountrySelect, isCountry } from '@app/components/select/country-select';
import { withCacheBust } from '@app/api/util';
import { leaderboardsByType } from '@app/helper/leaderboard';
import { useTranslation } from '@app/helper/translate';
import { useAuthProfileId, useFollowedAndMeProfileIds, useLanguage, useLeaderboards } from '@app/queries/all';
import { AnimatedValueText } from '@app/view/components/animated-value-text';
import { MyText } from '@app/view/components/my-text';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, StyleSheet, useWindowDimensions, View, ViewToken } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { fetchLeaderboard } from '../../../api/helper/api';
import { ILeaderboardPlayer } from '../../../api/helper/api.types';
import { createStylesheet } from '../../../theming-new';
import { FlashList } from '@app/components/flash-list';
import type { FlashListRef } from '@shopify/flash-list';
import cn from 'classnames';
import { containerClassName, containerScrollClassName } from '@app/styles';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { WebLeaderboard } from '../../../components/leaderboard/web-leaderboard';
import { LeaderboardOfficialSelect } from '@app/components/select/leaderboard-official-select';
import { Icon } from '@app/components/icon';
import { faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import { LeaderboardListRow, LeaderboardRow, ROW_HEIGHT, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';

// A copy of ./leaderboard.tsx as it stood when the screen ran on FlashList, kept
// so the two list implementations can be compared on a real device. leaderboard.tsx
// itself now uses react-native's FlatList; everything else about the two files —
// the react-query paging, the row buffer, the scroll handle — is the same.
//
// Not linked from the tab bar; reachable from More.
const pageSize = 100;

// A row counts as visible as soon as any part of it is, so the pages being paged
// in are the ones actually under the viewport. FlashList does not support changing
// this on the fly, hence module scope.
const viewabilityConfig = { itemVisiblePercentThreshold: 0 };

// Stable identity, so switching leaderboards hands useQueries the same array
// rather than a new one-element array per render.
const firstPageOnly = [1];

// Pages are immutable once fetched — a rank does not change under you mid-scroll —
// and every page stays mounted while it is in `requestedPages`. This keeps a page
// you scroll back to from refetching, and pairs with refetchOnWindowFocus: false in
// the shared query client.
const pageStaleTime = 5 * 60 * 1000;

export default function LeaderboardFlashListPage() {
    const showTabBar = useShowTabBar();

    // const flatListRef = useRef<FlatList>(null);
    //
    // const scrollToOffset = (offset: number) => {
    //     console.log('scrollToOffset', offset);
    //     flatListRef.current?.scrollToOffset({offset, animated: false});
    // }
    //
    // return (
    //     <View
    //         style={{height: 800, flexDirection: 'column', paddingTop:60, backgroundColor:'yellow', }}
    //     >
    //         <Pressable onPress={() => scrollToOffset(200)} style={{backgroundColor:'lightblue', padding: 10, margin: 10, borderRadius: 5}}>
    //             <Text>Scroll To Offset 200</Text>
    //         </Pressable>
    //         <FlatList
    //             ref={flatListRef}
    //             style={{flex: 1}}
    //             data={[...Array(100).keys()]}
    //             keyExtractor={(item) => item.toString()}
    //             renderItem={({item}) => (
    //                 <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
    //                     <Text style={{}}>Item {item}</Text>
    //                 </View>
    //             )}
    //         />
    //     </View>
    // );

    const getTranslation = useTranslation();

    const { data: allLeaderboards } = useLeaderboards();
    const leaderboards = useMemo(() => allLeaderboards?.filter((l) => l.official), [allLeaderboards]);

    const [leaderboardId, setLeaderboardId] = useState<string | null>(null);

    useEffect(() => {
        const firstLeaderboardId = leaderboardsByType(leaderboards ?? [], 'pc')?.[0]?.leaderboardId;
        setLeaderboardId(firstLeaderboardId);
    }, [leaderboards]);

    const styles = useStyles();
    const [refetching, setRefetching] = useState(false);
    const [leaderboardCountry, setLeaderboardCountry] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const flatListRef = React.useRef<FlashListRef<any>>(null);
    const [rankWidth, setRankWidth] = useState<number>(43);
    const [myRankWidth, setMyRankWidth] = useState<number>(0);
    const bottom = insets.bottom + 82;

    const list = useRef<LeaderboardListRow[]>([]);
    // Pages already spliced into `list`, so a re-render that hands back the same
    // query results does not splice them again. Cleared when the query identity
    // changes, since page 1 of another leaderboard is a different page 1.
    const appliedPages = useRef(new Set<number>());
    // The bottom row currently on screen, kept by onViewableItemsChanged. Read when
    // a page lands, to size the rank column against what is actually visible.
    const lastVisibleIndex = useRef<number>(0);

    // `list` stays the mutable paging buffer — the fetch/rank-width/scroll-handle
    // maths all index into it and must not churn per render. But render may not
    // read a ref, so every mutation of it is followed by publishAndRender(), and
    // the FlatList consumes this snapshot instead of `list.current`. Copying also
    // gives FlatList a new identity, so pages actually appear when they land
    // rather than waiting for some unrelated state change to force a re-render.
    const [rows, setRows] = useState<LeaderboardListRow[]>([]);
    const publishRows = () => setRows(list.current.slice());

    // Grows the list to `length`, giving every new row its own object — see
    // LeaderboardListRow for why a hole in the array will not do. Shrinking just
    // truncates; the rows that survive keep whatever they were holding.
    const resizeList = (length: number) => {
        const rows = list.current;
        if (length <= rows.length) {
            rows.length = length;
            return;
        }
        for (let index = rows.length; index < length; index++) {
            rows[index] = { index };
        }
    };

    const followingIds = useFollowedAndMeProfileIds();
    const authProfileId = useAuthProfileId();
    const queryClient = useQueryClient();

    // Everything that selects *which* leaderboard, minus the page. Same shape as
    // web-leaderboard.tsx builds for its infinite query.
    const queryParams = useMemo(() => {
        if (leaderboardCountry == 'following') {
            return { profileIds: followingIds };
        }
        if (leaderboardCountry?.startsWith('Clan ')) {
            return { clan: leaderboardCountry?.replace('Clan ', '') };
        }
        if (leaderboardCountry == countryEarth) {
            return {};
        }
        return { country: leaderboardCountry };
    }, [leaderboardCountry, followingIds]);

    // const myRank = useLazyApi({}, fetchLeaderboard, { leaderboardId, ...getParams(1, auth?.profileId) });

    // Sized against the bottom row on screen: it has the longest rank of the ones
    // visible, so the column is exactly as wide as it needs to be. This used to
    // derive that row from the scroll offset — offset minus the header, divided by
    // ROW_HEIGHT, plus a guessed 15 rows for the viewport — which is what
    // onViewableItemsChanged reports outright.
    const calcRankWidth = (index: number) => {
        const rank = list.current[index]?.player?.rank;
        if (rank != null) {
            setRankWidth((rank.toFixed(0).length + 1) * 10);
        }
    };

    const language = useLanguage();

    // Declared above their first use: the append callback below and several
    // handlers read these, and referencing them before declaration made React
    // Compiler bail out on the whole screen.
    const handleOffsetY = useSharedValue<number>(0);
    const movingScrollHandle = useSharedValue(false);
    const scrollRange = useSharedValue(0);
    const listLength = useSharedValue(0);
    const positionY = useSharedValue(0);

    // One query per page, which is what a leaderboard actually is: random access
    // into a list you already know the length of. An infinite query cannot express
    // that — it can only walk outwards from where it started, so jumping the scroll
    // handle to rank 30000 would have to fetch every page on the way there.
    //
    // This replaces useLazyAppendApi, which fetched into a single mutable blob and
    // hand-rolled the parts react-query already has: in-flight de-duplication (it
    // needed a `fetchingPages` ref), caching (an `if (list.current[index]) return`
    // guard), cancellation, and retries.
    //
    // `queryIdentity` is every part of the key except the page. It is what "the
    // list you are looking at changed" means here — see the reset effect below.
    const queryIdentity = useMemo(() => JSON.stringify([language, leaderboardId, queryParams]), [language, leaderboardId, queryParams]);
    const [requested, setRequested] = useState<{ identity: string; pages: number[] }>({ identity: '', pages: firstPageOnly });
    // Derived, not reset in an effect: the moment the identity changes this is back
    // to page 1, so the render that switches leaderboards cannot start fetches for
    // the pages the *previous* leaderboard happened to be scrolled to.
    const requestedPages = requested.identity === queryIdentity ? requested.pages : firstPageOnly;

    const results = useQueries({
        queries: requestedPages.map((page) => ({
            queryKey: ['leaderboard', language, leaderboardId, queryParams, page],
            // `signal` keeps the cancellation useLazyAppendApi did by hand with an
            // AbortController; fetchLeaderboard passes it through to fetch().
            queryFn: ({ signal }) => fetchLeaderboard({ language: language!, leaderboardId: leaderboardId ?? '', page, signal, ...queryParams }),
            // showTabBar is false on web, where WebLeaderboard renders instead and
            // runs its own query.
            enabled: !!language && !!leaderboardId && showTabBar,
            staleTime: pageStaleTime,
        })),
    });

    // Only ever call this from something React re-creates every render — a prop, an
    // effect. It closes over `queryIdentity`, and a caller holding on to an older
    // copy of it would write pages tagged with an identity that no longer matches,
    // which the line above then silently discards. That is exactly what the scroll
    // handle used to do; see scrollFlatListTo.
    const requestPage = (page: number) => {
        setRequested((current) => {
            const pages = current.identity === queryIdentity ? current.pages : firstPageOnly;
            if (pages.includes(page)) return current;
            return { identity: queryIdentity, pages: [...pages, page] };
        });
    };

    // The page that is always requested, so its state is the list's state.
    const firstPage = results[0];
    const total = results.find((result) => result.data != null)?.data?.total;
    const loading = firstPage?.isFetching ?? false;
    const touched = firstPage?.isFetched ?? false;
    const error = results.some((result) => result.isError);

    const onRefresh = async () => {
        setRefetching(true);
        await withCacheBust(() => queryClient.refetchQueries({ queryKey: ['leaderboard', language, leaderboardId, queryParams] }));
        setRefetching(false);
    };

    // const myRankPlayer = myRank.data?.players[0];
    // const showMyRank =
    //     leaderboardCountry == countryEarth ||
    //     // (leaderboardCountry?.startsWith('clan:') && myRankPlayer?.clan == leaderboardCountry?.replace('clan:', '')) ||
    //     (leaderboardCountry == 'following' && followingIds.find((f) => f == myRankPlayer?.profileId) != null) ||
    //     leaderboardCountry == myRankPlayer?.country;

    const headerInfoHeight = 40;

    // The header height used to matter here as well: paging and the rank column
    // were computed from the scroll offset, so both had to subtract it before
    // dividing by ROW_HEIGHT. onViewableItemsChanged reports row indices, which owe
    // nothing to the header.
    //
    // const scrollToIndex = (index: number) => {
    //     // TODO: Scrolling position is not accurate because the database is actually missing some ranks (sometimes).
    //     // HACK: We use viewPosition: 0.5 so that the user does not notice it.
    //     flatListRef.current?.scrollToIndex({ animated: false, index, viewPosition: 0 });
    // };

    // The list being looked at changed: throw the buffer away and go back to the
    // top. Nothing is reloaded here — useQueries switched keys in the same render,
    // so page 1 of the new leaderboard is already either in the cache or in flight.
    //
    // Declared before the effect that applies landed pages, because when the new
    // page 1 is a cache hit both run in the same commit and this one has to go
    // first.
    //
    // This used to hang off isFocused, with a guard so that merely returning to the
    // screen would not reload and scrollToOffset(0) away the user's position. The
    // cache is that guard now: coming back re-renders with the same keys and the
    // same data, and neither effect does anything.
    useEffect(() => {
        appliedPages.current = new Set();
        resizeList(0);
        listLength.set(0);
        publishRows();
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }, [queryIdentity, listLength]);

    // Where a page lands — the successor to useLazyAppendApi's `append`. react-query
    // owns the fetching, this owns the buffer the list reads from. Same shape as
    // /statistics/leaderboard-row-skeleton-list.
    useEffect(() => {
        const landed = results.map((result) => result.data).filter((page) => page != null && !appliedPages.current.has(page.page));
        if (landed.length === 0) return;

        landed.forEach((page) => appliedPages.current.add(page!.page));

        resizeList(landed[0]!.total);
        listLength.set(list.current.length);
        landed.forEach((page) => {
            const offset = (page!.page - 1) * pageSize;
            page!.players.forEach((player, i) => (list.current[offset + i] = { index: offset + i, player }));
        });
        publishRows();

        calcRankWidth(lastVisibleIndex.current);
    }, [results, listLength]);

    const onSelect = async (player: ILeaderboardPlayer) => {
        router.push(`/players/${player.profileId}`);
    };

    // Everything a row used to look up for itself is resolved once here instead.
    // A row is rendered up to 50x per commit, so a per-row hook is 50 query
    // subscriptions or 50 Appearance listeners, and isCountry() is a scan over
    // ~250 countries. See components/leaderboard/leaderboard-row.tsx.
    const rowStyles = useLeaderboardRowStyles();
    // Fetched with its `{games}` placeholder intact; the row fills in the number.
    const gamesLabel = getTranslation('leaderboard.games') ?? '';
    const { width: windowWidth } = useWindowDimensions();
    const showGames = windowWidth >= 360;
    // The selected country, not a separate "country the rows came from" state: the
    // reset effect empties the list the moment the selection changes, so there is no
    // window in which rows from the previous country are still on screen.
    const showCountryRank = isCountry(leaderboardCountry);
    const finalRankWidth = Math.max(myRankWidth || 43, rankWidth || 43);

    // LeaderboardPage compiles now, so the compiler would keep this stable on its
    // own; the useCallback is kept only because its deps are already correct and
    // removing it buys nothing.
    const _renderRow = useCallback(
        (row: LeaderboardListRow) => {
            return (
                <LeaderboardRow
                    player={row.player}
                    // row.index, not the renderItem index: the two are the same
                    // number, but FlashList does not re-render a recycled cell for
                    // an index change alone. See LeaderboardListRow.
                    i={row.index}
                    showCountryRank={showCountryRank}
                    showGames={showGames}
                    gamesLabel={gamesLabel}
                    authProfileId={authProfileId}
                    rankWidth={finalRankWidth}
                    styles={rowStyles}
                    onSelect={onSelect}
                />
            );
        },
        [finalRankWidth, showCountryRank, showGames, gamesLabel, authProfileId, rowStyles]
    );

    // useEffect(() => {
    //     setMyRankWidth(showMyRank ? (myRankPlayer?.rank.toFixed(0).length + 1) * 10 : 0);
    // }, [myRankPlayer, showMyRank]);

    const _renderHeader = () => {
        const players = getTranslation('leaderboard.players', { players: total });
        // const updated = leaderboard.data?.updated ? getTranslation('leaderboard.updated', { updated: formatAgo(leaderboard.data.updated) }) : '';
        return (
            <>
                <View style={{ height: headerInfoHeight }} className="flex-row justify-center pl-4 pr-12 items-center">
                    <MyText style={styles.info}>
                        {total ? players : ''}
                        {/*{leaderboard.data?.updated ? ' (' + updated + ')' : ''}*/}
                    </MyText>
                </View>
                {/* {myRank.data?.players.length > 0 && showMyRank && _renderRow(myRank.data.players[0], 0, true)} */}
            </>
        );
    };

    // Paging is driven by which rows are on screen, reported by the list itself.
    //
    // It used to be derived from the scroll offset instead: every scroll event set
    // a contentOffsetY state — a re-render of this whole screen per event — and an
    // effect turned that offset back into row indices with the header height and
    // ROW_HEIGHT, then guessed the bottom of the viewport as `index + 15`. The list
    // knows all of that exactly, and reports it only when the set of visible rows
    // actually changes, so the scroll handlers no longer set state at all.
    //
    // The page maths is also fixed here: `Math.ceil(index / pageSize)` made row 0
    // ask for page 0, and every row at an exact page boundary ask for the page
    // before its own.
    //
    // Asking for a page is now just adding it to `requestedPages`; whether that
    // costs a request is react-query's business, so the checks that used to guard
    // this — in flight already, already loaded, something else loading — are gone.
    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length === 0) return;
        if (!total) return;

        const first = viewableItems[0].index ?? 0;
        const last = viewableItems[viewableItems.length - 1].index ?? first;

        lastVisibleIndex.current = last;
        calcRankWidth(last);

        requestPage(Math.floor(first / pageSize) + 1);
        requestPage(Math.floor(last / pageSize) + 1);
    };

    const updateScrollHandlePosition = (contentOffsetY: number) => {
        if (movingScrollHandle.get()) return;
        positionY.set((contentOffsetY / (list.current.length * ROW_HEIGHT)) * scrollRange.get());
    };

    const handleOnScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        updateTimer();
        updateScrollHandlePosition(event.nativeEvent.contentOffset.y);
    };

    const handleOnMomentumScrollBegin = () => {
        updateTimer();
        scollingFlatlist.current = true;
    };

    const handleOnMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        updateTimer();
        updateScrollHandlePosition(event.nativeEvent.contentOffset.y);
        scollingFlatlist.current = false;
    };

    const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (scollingFlatlist.current) {
            updateTimer();
        }
        updateScrollHandlePosition(event.nativeEvent.contentOffset.y);
    };

    const inactivityTimeout = useRef<number | undefined>(undefined);
    const scollingFlatlist = useRef<boolean>(false);
    const [handleVisible, setHandleVisible] = useState(true);
    const [baseMoving, setBaseMoving] = useState(false);

    const handleAnimatedStyle = useAnimatedStyle(() => {
        return { top: positionY.get() };
    });

    // The pan gesture below is built during render, so handing it a function that
    // touches flatListRef would be a ref read during render. Instead the worklet
    // only records where it wants to go, and the effect — a legal place to touch a
    // ref — does the scrolling. A fresh object per request on purpose: dragging to
    // the same offset twice must still re-fire the effect.
    const [scrollRequest, setScrollRequest] = useState<{ row: number } | null>(null);

    // Nothing but the target row, handed over through a React setter. The gesture
    // that calls this is built during render and its worklet keeps whatever closure
    // it captured, so everything else in scope here is a closure from some earlier
    // render: calling requestPage() from here wrote pages tagged with a
    // `queryIdentity` that no longer matched, and the derived `requestedPages`
    // dropped them. Only a React setter is safe, because it never goes stale.
    const scrollFlatListTo = (row: number) => setScrollRequest({ row });

    useEffect(() => {
        if (!scrollRequest) return;

        // scrollToIndex, not scrollToOffset. scrollToOffset only calls the native
        // scrollTo (see useRecyclerViewController.tsx) and FlashList learns where it
        // is from its own scroll handler — so a jump left the list showing nothing
        // at all until a real scroll event arrived, which for a programmatic scroll
        // may never happen. scrollToIndex walks its internal offset to the target in
        // steps and commits a layout there, which renders the rows.
        //
        // That commit is also why the jump needs no paging code of its own:
        // committing a layout runs computeItemViewability() (RecyclerView.tsx,
        // onCommitEffect), so onViewableItemsChanged reports the new position and
        // the pages are requested by the same path that handles ordinary scrolling.
        // A jump used to ask for its pages here, back when it went through
        // scrollToOffset and no commit — and so no viewability — ever happened.
        //
        // Working in rows also means the handle no longer has to assume the content
        // is exactly `rows * ROW_HEIGHT` tall to find its target.
        flatListRef.current?.scrollToIndex({
            index: Math.max(0, Math.min(scrollRequest.row, list.current.length - 1)),
            animated: false,
        });
    }, [scrollRequest]);

    // No useMemo: the `[]` deps were a lie (the worklets capture shared values and
    // scrollFlatListTo), which the compiler rejects as unpreservable memoization.
    // It memoizes this itself from the real dependencies, all of which are stable.
    const panGesture = Gesture.Pan()
                .onBegin(() => {
                    handleOffsetY.set(positionY.get());
                    console.log('onBegin', 'handleOffsetY:', handleOffsetY.get(), 'positionY:', positionY.get());
                    movingScrollHandle.set(true);
                    scheduleOnRN(setBaseMoving, true);
                })
                .onUpdate((e) => {
                    // const min = -handleOffsetY.value;
                    // const max = min + scrollRange.value;
                    // const next = Math.max(Math.min(handleOffsetY.value + e.translationY, max), min);
                    // positionY.value = next;

                    const min = 0;
                    const max = scrollRange.get();
                    const next = Math.max(Math.min(handleOffsetY.get() + e.translationY, max), min);
                    positionY.set(next);
                })
                .onEnd(() => {
                    // The row under the handle, which is what the handle's own label
                    // has always shown. It used to convert that to a pixel offset
                    // here — the same maths, then undone on the other side — which
                    // only worked as long as the list's content was exactly
                    // `rows * ROW_HEIGHT` tall.
                    const row = Math.round((positionY.get() / scrollRange.get()) * listLength.get());
                    scheduleOnRN(scrollFlatListTo, row);
                    movingScrollHandle.set(false);
                    scheduleOnRN(setBaseMoving, false);
                    handleOffsetY.set(0);
                    console.log('onEnd', 'listLength:', listLength.get());
                });

    const updateTimer = () => {
        setHandleVisible(false);
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        inactivityTimeout.current = setTimeout(() => setHandleVisible(true), 1000) as any;
    };

    const getEmptyListStr = () => {
        if (!touched) {
            return '';
        }
        if (error) {
            return getTranslation('leaderboard.error');
        }
        return getTranslation('leaderboard.noplayerfound');
    };

    // const text = useDerivedValue(() => `#${positionY.value}`);
    // const text = useDerivedValue(() => ((positionY.value / scrollRange.value)).toFixed());
    const handleStr = useDerivedValue(() => '#' + ((positionY.get() / scrollRange.get()) * (listLength.get() - 1) + 1).toFixed());

    if (!showTabBar) {
        return <WebLeaderboard />;
    }

    if (!leaderboards || !leaderboardId) {
        return <View />;
    }

    return (
        <View style={styles.container2}>
            <Stack.Screen
                options={{
                    title: `${getTranslation('leaderboard.title')} (FlashList)`,
                    headerRight: () => null,
                }}
            />

            <View className={cn('items-center flex-row py-4 gap-2.5', containerClassName)}>
                <LeaderboardOfficialSelect leaderboardId={leaderboardId} onLeaderboardIdChange={setLeaderboardId} />
                <CountrySelect country={leaderboardCountry} onCountryChange={setLeaderboardCountry} />
            </View>

            {/*<Button onPress={() => scrollFlatListTo(300)}>Scroll</Button>*/}

            <View style={[styles.content, { opacity: loading ? 0.7 : 1 }]}>
                <FlashList
                    ref={flatListRef}
                    onScrollEndDrag={handleOnScrollEndDrag}
                    onMomentumScrollBegin={handleOnMomentumScrollBegin}
                    onMomentumScrollEnd={handleOnMomentumScrollEnd}
                    onScroll={handleOnScroll}
                    onLayout={({ nativeEvent: { layout }, currentTarget, ...rest }) => {
                        // console.log('FlatList onLayout', layout, currentTarget, rest);

                        // onLayout gets also called for the header component which we want to ignore
                        // on mobile the header is not scrollable
                        // on web currentTarget is null for both header and body, but the body layout gets
                        // called later so it will work anyway
                        if (currentTarget && !(currentTarget as any)?.scrollTo) return;

                        scrollRange.set(layout.height - HANDLE_RADIUS * 2 - bottom);
                    }}
                    // FlashList, not FlatList: commit cost here is rows-rendered x
                    // per-row cost, and FlatList's VirtualizedList re-rendered its
                    // whole window (up to ~69 rows in one commit) whenever a page
                    // landed mid-scroll. FlashList recycles instead, so no
                    // windowSize/maxToRenderPerBatch tuning is needed, and it needs
                    // no getItemLayout — it derives the extent itself, which the
                    // scroll handle depends on.
                    data={rows}
                    renderItem={({ item }: { item: LeaderboardListRow }) => _renderRow(item)}
                    // By index, not by profile id: the key then does not change when
                    // a page lands, so the cell keeps its view and updates props
                    // rather than being recycled mid-transition.
                    keyExtractor={(item: LeaderboardListRow) => item.index.toString()}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    // refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={refetching} />}
                    ListHeaderComponent={_renderHeader}
                    showsVerticalScrollIndicator={!handleVisible}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <MyText>{getEmptyListStr()}</MyText>
                        </View>
                    }
                />
                <View
                    className={cn(containerScrollClassName, 'absolute inset-0')}
                    style={{ pointerEvents: Platform.OS === 'web' ? 'none' : 'box-none' }}
                >
                    <View style={[styles.handleContainer, { bottom }]}>
                        <GestureDetector gesture={panGesture}>
                            <Animated.View style={[{ right: 0, opacity: handleVisible ? 1 : 0 }, styles.handle, handleAnimatedStyle]}>
                                <Icon icon={faArrowsAltV} size={22} className="mx-0 my-4.5" color="subtle" />
                                {!!baseMoving && (
                                    <View style={styles.textContainer}>
                                        <View style={styles.textBox}>
                                            <AnimatedValueText value={handleStr} style={styles.text} />
                                        </View>
                                    </View>
                                )}
                            </Animated.View>
                        </GestureDetector>
                    </View>
                </View>
            </View>
        </View>
    );
}

const HANDLE_RADIUS = 36;

const padding = 8;

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        textContainer: {
            position: 'absolute',
            padding: 5,
            borderRadius: 5,
            top: 25,
            right: 85,
            width: 150,
        },
        textBox: {
            backgroundColor: theme.skeletonColor,
            position: 'absolute',
            padding: 5,
            borderRadius: 5,
            right: 0,
        },
        text: {
            color: theme.textNoteColor,
        },
        handleContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: HANDLE_RADIUS,
            pointerEvents: 'box-none',
        },
        handle: {
            padding: 8,
            backgroundColor: theme.skeletonColor,
            // backgroundColor: '#1abc9c',
            width: HANDLE_RADIUS * 2,
            height: HANDLE_RADIUS * 2,
            borderRadius: HANDLE_RADIUS,
        },
        list: {
            paddingVertical: 20,
        },
        container2: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },

        menuButton: {
            // backgroundColor: 'blue',
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginHorizontal: 2,
        },
        menuIcon: {
            color: theme.textColor,
        },

        measureContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'visible',
            // backgroundColor: 'yellow',
            padding: 5,
            width: '100%',
        },
        activityInfo: {
            flex: 1,
            alignItems: 'flex-end',
        },
        pageInfo: {
            flex: 0,
            textAlign: 'right',
            marginLeft: 15,
        },
        arrowIcon: {
            marginLeft: 25,
            // backgroundColor: 'red',
        },
        cellRankMe: {
            margin: padding,
            textAlign: 'left',
            minWidth: 60,
            // width: 60,
            fontWeight: 'bold',
        },
        flexRow: {
            flexDirection: 'row',
        },
        cellName2: {
            margin: padding,
            flex: 4,
        },
        cellWins: {
            margin: padding,
            flex: 1,
        },
        footerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            // marginBottom: 3,
            // padding: 3,
            // paddingVertical: 5,
            paddingHorizontal: 5,
            borderRadius: 5,
            marginRight: 30,
            marginLeft: 30,
            width: '100%',
            // backgroundColor: 'blue',
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 3,
            padding: 3,
            borderRadius: 5,
            marginRight: 30,
            marginLeft: 30,
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        countryIcon: {
            width: 21,
            height: 15,
            // paddingBottom: 4,
            marginRight: 10,
        },
        title: {
            marginBottom: 10,
            fontSize: 16,
            fontWeight: 'bold',
        },
        centered: {
            // backgroundColor: 'yellow',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },

        info: {
            textAlign: 'center',
            color: theme.textNoteColor,
            fontSize: 12,
            minWidth: 75,
        },

        col: {
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        h1: {},
        h2: {
            fontSize: 11,
        },
    } as const)
);
