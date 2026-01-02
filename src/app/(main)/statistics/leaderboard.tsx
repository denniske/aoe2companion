import { countryEarth, CountrySelect, isCountry } from '@app/components/select/country-select';
import { LeaderboardSelect } from '@app/components/select/leaderboard-select';
import { leaderboardsByType } from '@app/helper/leaderboard';
import { useTranslation } from '@app/helper/translate';
import { useAuthProfileId, useFollowedAndMeProfileIds, useLanguage, useLeaderboards } from '@app/queries/all';
import { AnimatedValueText } from '@app/view/components/animated-value-text';
import { ImageLoader } from '@app/view/components/loader/image-loader';
import { TextLoader } from '@app/view/components/loader/text-loader';
import { MyText } from '@app/view/components/my-text';
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/core';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList as FlatListRN,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { fetchLeaderboard } from '../../../api/helper/api';
import { ILeaderboardPlayer } from '../../../api/helper/api.types';
import { useLazyAppendApi } from '../../../hooks/use-lazy-append-api';
import { useSelector } from '../../../redux/reducer';
import { createStylesheet } from '../../../theming-new';
import { FlatList } from '@app/components/flat-list';
import cn from 'classnames';
import { containerClassName, containerScrollClassName } from '@app/styles';
import { formatAgo } from '@nex/data';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { WebLeaderboard } from './_web-leaderboard';

const ROW_HEIGHT = 45;
const ROW_HEIGHT_MY_RANK = 52;

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

    const { data: leaderboards } = useLeaderboards();

    const [leaderboardId, setLeaderboardId] = useState<string | null>(null);

    useEffect(() => {
        const firstLeaderboardId = leaderboardsByType(leaderboards ?? [], 'pc')?.[0]?.leaderboardId;
        setLeaderboardId(firstLeaderboardId);
    }, [leaderboards]);

    const styles = useStyles();
    const [refetching, setRefetching] = useState(false);
    const leaderboardCountry = useSelector((state) => state.leaderboardCountry) || null;
    const [loadedLeaderboardCountry, setLoadedLeaderboardCountry] = useState(leaderboardCountry);
    const insets = useSafeAreaInsets();
    const flatListRef = React.useRef<FlatListRN>(null);
    const [contentOffsetY, setContentOffsetY] = useState<number>();
    const [rankWidth, setRankWidth] = useState<number>(43);
    const [myRankWidth, setMyRankWidth] = useState<number>(0);
    const [temp, setTemp] = useState<number>(43);
    const bottom = insets.bottom + 82;

    const list = useRef<any[]>([]);
    const fetchingPages = useRef<number[]>([]);

    const isFocused = useIsFocused();

    const followingIds = useFollowedAndMeProfileIds();

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

    const leaderboard = useLazyAppendApi(
        {
            append: (data, newData, args) => {
                const [params] = args;
                // console.log('APPEND', data, newData, args);

                total.current = newData.total;
                total2.current = newData.total;
                list.current.length = newData.total;
                listLength.value = newData.total;
                newData.players.forEach((value, index) => (list.current[(params.page! - 1) * pageSize + index] = value));

                calcRankWidth(contentOffsetY);

                setLoadedLeaderboardCountry(leaderboardCountry);

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

    const scrollToMe = () => {
        // scrollToIndex(101-1);
        // console.log('leaderboardCountry', leaderboardCountry);
        // if (leaderboardCountry == 'following') {
        //     const meIndex = list.current?.findIndex((p: any) => p.profileId == auth.profileId);
        //     if (meIndex >= 0) {
        //         scrollToIndex(meIndex);
        //     }
        // } else if (leaderboardCountry?.startsWith('clan:')) {
        //     const meIndex = list.current?.findIndex((p: any) => p.profileId == auth.profileId);
        //     if (meIndex >= 0) {
        //         scrollToIndex(meIndex);
        //     }
        // } else if (leaderboardCountry == countryEarth) {
        //     scrollToIndex(myRank.data.players[0].rank - 1);
        // } else {
        //     scrollToIndex(myRank.data.players[0].rankCountry - 1);
        // }
    };

    useEffect(() => {
        if (!leaderboardId) return;
        if (!isFocused) return;
        if (!showTabBar) return;
        if (leaderboard.touched && leaderboard.lastParams?.leaderboardCountry === leaderboardCountry) return;
        list.current.length = Math.min(list.current.length, pageSize);
        listLength.value = Math.min(list.current.length, pageSize);
        leaderboard.reload();
        // if (auth) {
        //     myRank.reload();
        // }
        console.log('RELOADING LEADERBOARD', leaderboardCountry);
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

    const _renderRow = useCallback(
        (player: ILeaderboardPlayer, i: number, isMyRankRow?: boolean) => {
            logPlayer('INIT', i, player);
            return (
                <MemoizedRenderRow
                    player={player}
                    i={i}
                    leaderboardCountry={loadedLeaderboardCountry}
                    isMyRankRow={isMyRankRow}
                    rankWidth={rankWidth}
                    myRankWidth={myRankWidth}
                    onSelect={onSelect}
                    scrollToMe={scrollToMe}
                />
            );
        },
        [myRankWidth, rankWidth, loadedLeaderboardCountry]
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

    useEffect(() => {
        if (contentOffsetY === undefined) return;
        fetchByContentOffset(contentOffsetY);
    }, [contentOffsetY, fetchingPages.current]);

    const updateScrollHandlePosition = (contentOffsetY: number) => {
        if (movingScrollHandle.value) return;
        positionY.value = (contentOffsetY / (list.current.length * ROW_HEIGHT)) * scrollRange.value;
        console.log('updateScrollHandlePosition', 'contentOffsetY:', contentOffsetY, 'positionY:', positionY.value);
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
    const handleOffsetY = useSharedValue<number>(0);

    // const movingScrollHandle = useRef<boolean>();
    const movingScrollHandle = useSharedValue(false);

    // const scrollRange = useRef<number>(0);
    const scrollRange = useSharedValue(0);

    const listLength = useSharedValue(0);

    const scollingFlatlist = useRef<boolean>(false);
    const [handleVisible, setHandleVisible] = useState(true);
    const [baseMoving, setBaseMoving] = useState(false);

    const positionY = useSharedValue(0);
    const handleAnimatedStyle = useAnimatedStyle(() => {
        return { top: positionY.value };
    });

    const scrollFlatListTo = (offset: number) => {
        console.log('scrollFlatListTo', offset, flatListRef.current != null, flatListRef.current!.scrollToOffset != null);
        flatListRef.current?.scrollToOffset({ animated: false, offset });
        // flatListRef.current!.scrollToOffset({ animated: true, offset: 300 });
    };

    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .onBegin(() => {
                    handleOffsetY.value = positionY.value;
                    console.log('onBegin', 'handleOffsetY:', handleOffsetY.value, 'positionY:', positionY.value);
                    movingScrollHandle.value = true;
                    scheduleOnRN(setBaseMoving, true);
                })
                .onUpdate((e) => {
                    // const min = -handleOffsetY.value;
                    // const max = min + scrollRange.value;
                    // const next = Math.max(Math.min(handleOffsetY.value + e.translationY, max), min);
                    // positionY.value = next;

                    const min = 0;
                    const max = scrollRange.value;
                    const next = Math.max(Math.min(handleOffsetY.value + e.translationY, max), min);
                    positionY.value = next;
                    console.log('onUpdate', next, 'handleOffsetY:', handleOffsetY.value, 'e.translationY:', e.translationY, 'scrollRange:', scrollRange.value);
                })
                .onEnd(() => {
                    const offset = positionY.value;
                    // const newOffset = (offset / scrollRange.value) * total.value * ROW_HEIGHT;
                    const newOffset = (offset / scrollRange.value) * listLength.value * ROW_HEIGHT;
                    scheduleOnRN(scrollFlatListTo, newOffset);
                    movingScrollHandle.value = false;
                    scheduleOnRN(setBaseMoving, false);
                    handleOffsetY.value = 0;
                    console.log('onEnd', 'listLength:', listLength.value);
                }),
        []
    );

    const updateTimer = () => {
        setHandleVisible(false);
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        inactivityTimeout.current = setTimeout(() => setHandleVisible(true), 1000);
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
    const handleStr = useDerivedValue(() => '#' + ((positionY.value / scrollRange.value) * listLength.value).toFixed());

    if (!showTabBar) {
        return <WebLeaderboard leaderboards={leaderboards} />;
    }

    if (!leaderboards || !leaderboardId) {
        return <View />;
    }


    return (
        <View style={styles.container2}>
            <Stack.Screen
                options={{
                    title: getTranslation('leaderboard.title'),
                }}
            />

            <View className={cn('items-center flex-row py-4 gap-2.5', containerClassName)}>
                <LeaderboardSelect leaderboardId={leaderboardId} onLeaderboardIdChange={setLeaderboardId} />
                <CountrySelect />
            </View>

            {/*<Button onPress={() => scrollFlatListTo(300)}>Scroll</Button>*/}

            <View style={[styles.content, { opacity: leaderboard.loading ? 0.7 : 1 }]}>
                <FlatList
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

                        scrollRange.value = layout.height - HANDLE_RADIUS * 2 - bottom;
                    }}
                    scrollEventThrottle={500}
                    // contentContainerClassName="pt-2 pb-4"
                    data={list.current}
                    getItemLayout={(_data: any, index: number) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
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
            <View className={cn(containerScrollClassName, 'absolute inset-0')} pointerEvents="box-none">
                <View style={[styles.handleContainer, { bottom }]}>
                    <GestureDetector gesture={panGesture}>
                        <Animated.View style={[{ right: 0, opacity: handleVisible ? 1 : 0 }, styles.handle, handleAnimatedStyle]}>
                            <FontAwesome5 name="arrows-alt-v" size={26} style={styles.arrows} />
                            {baseMoving && (
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

interface RenderRowProps {
    player: ILeaderboardPlayer;
    i: number;
    leaderboardCountry: string | null;
    isMyRankRow?: boolean;
    rankWidth?: number;
    myRankWidth?: number;
    onSelect: (player: ILeaderboardPlayer) => void;
    scrollToMe: () => void;
}

function logPlayer(str: string, i: number, player: ILeaderboardPlayer, leaderboardCountry?: string | null) {
    // if (i == 1 && player?.leaderboardId == 'rm_1v1') {
    //     console.log(str.padEnd(8, ' '), 'ROW', i, player.rank, player?.name, player != null,
    //         isCountry(leaderboardCountry), isCountry(leaderboardCountry) ? player?.rankCountry : player?.rank || i + 1);
    // }
}

function RenderRow(props: RenderRowProps) {
    const getTranslation = useTranslation();
    const { player, i, isMyRankRow, rankWidth, myRankWidth, onSelect, scrollToMe, leaderboardCountry } = props;

    const styles = useStyles();
    const authProfileId = useAuthProfileId();

    const isMe = player?.profileId != null && player?.profileId === authProfileId;
    const rowStyle = { minHeight: isMyRankRow ? ROW_HEIGHT_MY_RANK : ROW_HEIGHT };
    const weightStyle = { fontWeight: isMe ? 'bold' : 'normal' } as TextStyle;
    const rankWidthStyle = { width: Math.max(myRankWidth || 43, rankWidth || 43) } as TextStyle;

    // console.log('Math.max(myRankWidth, rankWidth)', myRankWidth, rankWidth);
    // console.log('Math.max(myRankWidth, rankWidth)', Math.max(myRankWidth, rankWidth));

    logPlayer('RENDER', i, player, leaderboardCountry);

    return (
        <TouchableOpacity style={[styles.row, rowStyle]} disabled={player == null} onPress={() => (isMyRankRow ? scrollToMe() : onSelect(player))}>
            <View style={isMyRankRow ? styles.innerRow : styles.innerRowWithBorder}>
                <TextLoader numberOfLines={1} style={[styles.cellRank, weightStyle, rankWidthStyle]}>
                    #{isCountry(leaderboardCountry) ? player?.rankCountry : player?.rank || i + 1}
                </TextLoader>

                <TextLoader style={isMe ? styles.cellRatingMe : styles.cellRating}>{player?.rating}</TextLoader>
                <View style={styles.cellName}>
                    <ImageLoader source={{ uri: player?.avatarSmallUrl }} ready={player} className="w-5 h-5 mr-2 rounded-full" />
                    <TextLoader style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>
                        {player?.name}
                    </TextLoader>
                </View>
                
                {Dimensions.get('window').width >= 360 && (
                    <TextLoader ready={player?.games} style={styles.cellGames}>
                        {getTranslation('leaderboard.games', { games: player?.games })}
                    </TextLoader>
                )}
            </View>
        </TouchableOpacity>
    );
}

const MemoizedRenderRow = React.memo(RenderRow);

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
        arrows: {
            color: theme.textNoteColor,
            paddingHorizontal: 7,
            paddingVertical: 14,
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
        name: {
            flex: 1,
        },
        nameMe: {
            flex: 1,
            fontWeight: 'bold',
        },
        cellRankMe: {
            margin: padding,
            textAlign: 'left',
            minWidth: 60,
            // width: 60,
            fontWeight: 'bold',
        },
        cellRank: {
            margin: padding,
            textAlign: 'left',
            // backgroundColor: 'yellow',
        },
        cellRating: {
            margin: padding,
            width: 38,
            // backgroundColor: 'yellow',
        },
        cellRatingMe: {
            margin: padding,
            width: 38,
            fontWeight: 'bold',
            // backgroundColor: 'yellow',
        },
        flexRow: {
            flexDirection: 'row',
        },
        cellName: {
            margin: padding,
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cellName2: {
            margin: padding,
            flex: 4,
        },
        cellGames: {
            margin: padding,
            width: 90,
            textAlign: 'right',
            fontSize: 12,
            color: theme.textNoteColor,
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
        row: {
            // marginRight: 30,
            // marginLeft: 30,
            // width: '100%',
            // flex: 3,
            flex: 1,
        },
        innerRow: {
            // backgroundColor: 'red',
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
        },
        innerRowWithBorder: {
            // backgroundColor: 'green',
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.lightBorderColor,
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
