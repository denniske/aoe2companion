import { countryEarth, CountrySelect, isCountry } from '@app/components/select/country-select';
import { leaderboardsByType } from '@app/helper/leaderboard';
import { useTranslation } from '@app/helper/translate';
import { useAuthProfileId, useFollowedAndMeProfileIds, useLanguage, useLeaderboards } from '@app/queries/all';
import { AnimatedValueText } from '@app/view/components/animated-value-text';
import { MyText } from '@app/view/components/my-text';
import { useIsFocused } from 'expo-router/react-navigation';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { fetchLeaderboard } from '../../../api/helper/api';
import { ILeaderboardPlayer } from '../../../api/helper/api.types';
import { useLazyAppendApi } from '../../../hooks/use-lazy-append-api';
import { useSelector } from '../../../redux/reducer';
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
import { LeaderboardRow, ROW_HEIGHT, useLeaderboardRowStyles } from '@app/components/leaderboard/leaderboard-row';

const pageSize = 100;

export default function LeaderboardPage() {
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
    const leaderboardCountry = useSelector((state) => state.leaderboardCountry) || null;
    const [loadedLeaderboardCountry, setLoadedLeaderboardCountry] = useState(leaderboardCountry);
    // Which query the currently-held rows actually came from, so the focus effect
    // below can tell "came back to this screen" from "the query changed".
    const [loadedLeaderboardId, setLoadedLeaderboardId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const flatListRef = React.useRef<FlashListRef<any>>(null);
    const [contentOffsetY, setContentOffsetY] = useState<number>();
    const [rankWidth, setRankWidth] = useState<number>(43);
    const [myRankWidth, setMyRankWidth] = useState<number>(0);
    const [temp, setTemp] = useState<number>(43);
    const bottom = insets.bottom + 82;

    const list = useRef<any[]>([]);
    const fetchingPages = useRef<number[]>([]);

    // `list` stays the mutable paging buffer — the fetch/rank-width/scroll-handle
    // maths all index into it and must not churn per render. But render may not
    // read a ref, so every mutation of it is followed by publishAndRender(), and
    // the FlatList consumes this snapshot instead of `list.current`. Copying also
    // gives FlatList a new identity, so pages actually appear when they land
    // rather than waiting for some unrelated state change to force a re-render.
    const [rows, setRows] = useState<any[]>([]);
    const publishRows = () => setRows(list.current.slice());

    const isFocused = useIsFocused();

    const followingIds = useFollowedAndMeProfileIds();
    const authProfileId = useAuthProfileId();

    const getParams = (page: number, profileId?: number) => {
        if (leaderboardCountry == 'following') {
            return { page, profileId, profileIds: followingIds };
        }
        if (leaderboardCountry?.startsWith('Clan ')) {
            return { page, profileId, clan: leaderboardCountry?.replace('Clan ', '') };
        }
        if (leaderboardCountry == countryEarth) {
            return { page, profileId };
        }
        return { page, profileId, country: leaderboardCountry };
    };

    // const myRank = useLazyApi({}, fetchLeaderboard, { leaderboardId, ...getParams(1, auth?.profileId) });

    const calcRankWidth = (contentOffsetY: number | undefined) => {
        if (contentOffsetY === undefined) return;
        if (total.current === undefined) return;

        contentOffsetY -= headerHeightAndPadding;

        const index = Math.floor(contentOffsetY / ROW_HEIGHT);
        const indexTop = Math.max(0, index);
        const indexBottom = Math.min(total.current - 1, index + 15);

        if (total2.current === 0) return;

        // console.log('contentOffsetY', contentOffsetY);
        // console.log('current', list.current[indexBottom]?.rank.toFixed(0).length);

        const rankLen = list.current[indexBottom]?.rank.toFixed(0).length;
        if (rankLen != null) {
            setRankWidth((rankLen + 1) * 10);
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

    const leaderboard = useLazyAppendApi(
        {
            append: (data, newData, args) => {
                const [params] = args;
                // console.log('APPEND', data, newData, args);

                total.current = newData.total;
                total2.current = newData.total;
                list.current.length = newData.total;
                listLength.set(newData.total);
                newData.players.forEach((value, index) => (list.current[(params.page! - 1) * pageSize + index] = value));
                publishRows();

                calcRankWidth(contentOffsetY);

                setLoadedLeaderboardCountry(leaderboardCountry);
                setLoadedLeaderboardId(leaderboardId);

                // console.log('APPENDED', list.current);
                // console.log('APPENDED', params);
                return data;
            },
        },
        fetchLeaderboard,
        { language: language!, leaderboardId: leaderboardId ?? '', ...getParams(1) }
    );

    const onRefresh = async () => {
        setRefetching(true);
        // await Promise.all([leaderboard.reload(), auth ? myRank.reload() : noop()]);
        await Promise.all([leaderboard.reload()]);
        setRefetching(false);
    };

    // const myRankPlayer = myRank.data?.players[0];
    // const showMyRank =
    //     leaderboardCountry == countryEarth ||
    //     // (leaderboardCountry?.startsWith('clan:') && myRankPlayer?.clan == leaderboardCountry?.replace('clan:', '')) ||
    //     (leaderboardCountry == 'following' && followingIds.find((f) => f == myRankPlayer?.profileId) != null) ||
    //     leaderboardCountry == myRankPlayer?.country;

    const containerPadding = 20;
    const headerMyRankHeight = 0; //myRank.data?.players.length > 0 && showMyRank ? ROW_HEIGHT_MY_RANK : 0;
    const headerInfoHeight = 40;
    const headerHeightAndPadding = containerPadding + headerInfoHeight + headerMyRankHeight;

    // const scrollToIndex = (index: number) => {
    //     // TODO: Scrolling position is not accurate because the database is actually missing some ranks (sometimes).
    //     // HACK: We use viewPosition: 0.5 so that the user does not notice it.
    //     flatListRef.current?.scrollToIndex({ animated: false, index, viewPosition: 0, viewOffset: -headerHeightAndPadding });
    // };

    useEffect(() => {
        if (!leaderboardId) return;
        if (!isFocused) return;
        if (!showTabBar) return;
        // Skip the reload when nothing about the query changed — otherwise merely
        // returning to this screen (isFocused flipping back after visiting a
        // player) reloads and scrollToOffset(0) throws away the user's position.
        //
        // This used to compare `leaderboard.lastParams?.leaderboardCountry`, which
        // could never match: useLazyAppendApi stores `setLastParams(args)` — the
        // arguments *array* — so every property read off it is undefined, while
        // leaderboardCountry is a string or null. The guard was dead code and the
        // screen reloaded on every refocus. Compare against what was actually
        // loaded instead (both set in append). The id matters too, otherwise
        // switching leaderboards within one country would skip its reload.
        if (leaderboard.touched && loadedLeaderboardId === leaderboardId && loadedLeaderboardCountry === leaderboardCountry) return;
        list.current.length = Math.min(list.current.length, pageSize);
        listLength.set(Math.min(list.current.length, pageSize));
        publishRows();
        leaderboard.reload();
        // if (auth) {
        //     myRank.reload();
        // }
        console.log('RELOADING LEADERBOARD', leaderboardId, 'country:', leaderboardCountry);
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
        total2.current = 1000;
    }, [isFocused, leaderboardCountry, leaderboardId]);

    const total = useRef<number | undefined>(undefined);

    // When switching from on leaderboard to another we need to set this to something
    // greater 0 so that a fetch is not prevented
    const total2 = useRef<number>(1000);

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
    const showCountryRank = isCountry(loadedLeaderboardCountry);
    const finalRankWidth = Math.max(myRankWidth || 43, rankWidth || 43);

    // LeaderboardPage compiles now, so the compiler would keep this stable on its
    // own; the useCallback is kept only because its deps are already correct and
    // removing it buys nothing.
    const _renderRow = useCallback(
        (player: ILeaderboardPlayer, i: number) => {
            return (
                <LeaderboardRow
                    player={player}
                    i={i}
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
        const players = getTranslation('leaderboard.players', { players: total.current });
        // const updated = leaderboard.data?.updated ? getTranslation('leaderboard.updated', { updated: formatAgo(leaderboard.data.updated) }) : '';
        return (
            <>
                <View style={{ height: headerInfoHeight }} className="flex-row justify-center pl-4 pr-12 items-center">
                    <MyText style={styles.info}>
                        {total.current ? players : ''}
                        {/*{leaderboard.data?.updated ? ' (' + updated + ')' : ''}*/}
                    </MyText>
                </View>
                {/* {myRank.data?.players.length > 0 && showMyRank && _renderRow(myRank.data.players[0], 0, true)} */}
            </>
        );
    };

    const fetchPage = async (page: number) => {
        const index = (page - 1) * pageSize + 1;

        if (fetchingPages.current.includes(page)) {
            // console.log('FETCHPAGE', page, 'ALREADY FETCHING');
            return;
        }
        if (list.current[index]) {
            // console.log('FETCHPAGE', page, 'ALREADY HAVE');
            return;
        }
        if (leaderboard.loading) {
            // console.log('FETCHPAGE', page, 'LEADERBOARD LOADING');
            return;
        }

        // console.log('FETCHPAGE', page, 'WILL FETCH');

        fetchingPages.current = [...fetchingPages.current, page];
        await leaderboard.refetchAppend({ language: language!, leaderboardId: leaderboardId ?? '', ...getParams(page) });
        fetchingPages.current = fetchingPages.current.filter((p) => p !== page);

        setTemp((t) => t + 1);
    };

    const fetchByContentOffset = (contentOffsetY: number) => {
        if (!leaderboard.touched) return;
        if (!total.current) return;

        contentOffsetY -= headerHeightAndPadding;

        const index = Math.floor(contentOffsetY / ROW_HEIGHT);
        const indexTop = Math.max(0, index);
        const indexBottom = Math.min(total.current - 1, index + 15);

        if (total2.current === 0) return;

        // console.log('fetchByContentOffset', indexTop, '-', indexBottom);

        fetchPage(Math.ceil(indexTop / pageSize));
        fetchPage(Math.ceil(indexBottom / pageSize));
    };

    // `fetchingPages.current` used to be a dependency here. Mutating a ref does not
    // re-render, so it never scheduled this effect on its own — it only ever
    // changed the comparison when some *other* state had already caused a render,
    // which is why the compiler rejects reading a ref during render. Scrolling is
    // what should drive paging, and fetchPage() already de-dupes in-flight pages.
    useEffect(() => {
        if (contentOffsetY === undefined) return;
        fetchByContentOffset(contentOffsetY);
    }, [contentOffsetY]);

    const updateScrollHandlePosition = (contentOffsetY: number) => {
        if (movingScrollHandle.get()) return;
        positionY.set((contentOffsetY / (list.current.length * ROW_HEIGHT)) * scrollRange.get());
        console.log('updateScrollHandlePosition', 'contentOffsetY:', contentOffsetY, 'positionY:', positionY.get());
    };

    const handleOnScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setContentOffsetY(event.nativeEvent.contentOffset.y);
        updateTimer();
        updateScrollHandlePosition(event.nativeEvent.contentOffset.y);
    };

    const handleOnMomentumScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setContentOffsetY(event.nativeEvent.contentOffset.y);
        updateTimer();
        scollingFlatlist.current = true;
    };

    const handleOnMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setContentOffsetY(event.nativeEvent.contentOffset.y);
        updateTimer();
        updateScrollHandlePosition(event.nativeEvent.contentOffset.y);
        scollingFlatlist.current = false;
    };

    const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setContentOffsetY(event.nativeEvent.contentOffset.y);
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
    const [scrollRequest, setScrollRequest] = useState<{ offset: number } | null>(null);
    const scrollFlatListTo = (offset: number) => setScrollRequest({ offset });

    useEffect(() => {
        if (!scrollRequest) return;
        flatListRef.current?.scrollToOffset({ animated: false, offset: scrollRequest.offset });
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
                    console.log(
                        'onUpdate',
                        next,
                        'handleOffsetY:',
                        handleOffsetY.get(),
                        'e.translationY:',
                        e.translationY,
                        'scrollRange:',
                        scrollRange.get()
                    );
                })
                .onEnd(() => {
                    const offset = positionY.get();
                    // const newOffset = (offset / scrollRange.value) * total.value * ROW_HEIGHT;
                    const newOffset = (offset / scrollRange.get()) * listLength.get() * ROW_HEIGHT;
                    scheduleOnRN(scrollFlatListTo, newOffset);
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
        if (!leaderboard.touched) {
            return '';
        }
        if (leaderboard.error) {
            return getTranslation('leaderboard.error');
        }
        return getTranslation('leaderboard.noplayerfound');
    };

    // const text = useDerivedValue(() => `#${positionY.value}`);
    // const text = useDerivedValue(() => ((positionY.value / scrollRange.value)).toFixed());
    const handleStr = useDerivedValue(() => '#' + ((positionY.get() / scrollRange.get()) * listLength.get()).toFixed());

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
                    title: getTranslation('leaderboard.title'),
                    headerRight: () => null,
                }}
            />

            <View className={cn('items-center flex-row py-4 gap-2.5', containerClassName)}>
                <LeaderboardOfficialSelect leaderboardId={leaderboardId} onLeaderboardIdChange={setLeaderboardId} />
                <CountrySelect />
            </View>

            {/*<Button onPress={() => scrollFlatListTo(300)}>Scroll</Button>*/}

            <View style={[styles.content, { opacity: leaderboard.loading ? 0.7 : 1 }]}>
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
                    scrollEventThrottle={500}
                    // FlashList, not FlatList: commit cost here is rows-rendered x
                    // per-row cost, and FlatList's VirtualizedList re-rendered its
                    // whole window (up to ~69 rows in one commit) whenever a page
                    // landed mid-scroll. FlashList recycles instead, so no
                    // windowSize/maxToRenderPerBatch tuning is needed, and it needs
                    // no getItemLayout — it derives the extent itself, which the
                    // scroll handle depends on.
                    data={rows}
                    renderItem={({ item, index }: any) => _renderRow(item, index)}
                    keyExtractor={(item: { profileId: any }, index: any) => (item?.profileId || index).toString()}
                    // refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={refetching} />}
                    ListHeaderComponent={_renderHeader}
                    showsVerticalScrollIndicator={!handleVisible}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <MyText>{getEmptyListStr()}</MyText>
                        </View>
                    }
                />
            </View>
            <View className={cn(containerScrollClassName, 'absolute inset-0')} style={{ pointerEvents: Platform.OS === 'web' ? 'none' : 'box-none' }}>
                <View style={[styles.handleContainer, { bottom }]}>
                    <GestureDetector gesture={panGesture}>
                        <Animated.View style={[{ right: 0, opacity: handleVisible ? 1 : 0 }, styles.handle, handleAnimatedStyle]}>
                            <Icon icon={faArrowsAltV} size={22} className="mx-0 my-4.5" color="subtle" />
                            {!!(baseMoving) && (
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
