import { FlatList } from '@app/components/flat-list';
import { AnimatedValueText } from '@app/view/components/animated-value-text';
import { CountryImageForDropDown, CountryImageLoader, SpecialImageForDropDown } from '@app/view/components/country-image';
import { TextLoader } from '@app/view/components/loader/text-loader';
import { MyText } from '@app/view/components/my-text';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { TabBarLabel } from '@app/view/components/tab-bar-label';
import { FontAwesome5 } from '@expo/vector-icons';
import { countriesDistinct, Country } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { router, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList as FlatListRef,
    NativeScrollEvent,
    NativeSyntheticEvent,
    PanResponder,
    Platform,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchLeaderboard, fetchLeaderboards } from '../../api/helper/api';
import { ILeaderboardPlayer } from '../../api/helper/api.types';
import { getCountryName } from '../../helper/flags';
import { getTranslation } from '../../helper/translate';
import { getValue } from '../../helper/util-component';
import { useLazyAppendApi } from '../../hooks/use-lazy-append-api';
import { setLeaderboardCountry, useMutate, useSelector } from '../../redux/reducer';
import { createStylesheet } from '../../theming-new';
import { Dropdown } from '@app/components/dropdown';
import { leaderboardsByType } from '@app/helper/leaderboard';
import { useQuery } from '@tanstack/react-query';
import { useAuthProfileId, useFollowedAndMeProfileIds, useProfileFast } from '@app/queries/all';

const Tab = createMaterialTopTabNavigator<any>();

const countryEarth = null;

function isCountry(x: string | null) {
    return countriesDistinct.includes(x?.toUpperCase() as Country);
}

// Memoize? Maybe not needed because of react 19
export function LeaderboardMenu() {
    const mutate = useMutate();
    const country = useSelector((state) => state.leaderboardCountry) || null;
    const isFocused = useIsFocused();

    // console.log('LeaderboardMenu', country);
    
    const authProfileId = useAuthProfileId();
    const { data: authProfile } = useProfileFast(authProfileId);
    const authCountry = authProfile?.country;
    const authClan = authProfile?.clan;

    const formatCountry = (x: string | null, inList?: boolean) => {
        if (x == countryEarth) {
            return getTranslation('country.earth');
        }
        if (x == 'following') {
            return getTranslation('country.following');
        }
        if (x.startsWith('clan')) {
            return x;
        }
        return inList ? getCountryName(x as Country) : x?.toUpperCase();
    };
    const orderedCountriesDistinct = countriesDistinct.sort((a, b) => formatCountry(a, true).localeCompare(formatCountry(b, true)));
    const countryList: (string | null)[] = [
        countryEarth,
        'following',
        ...(authClan ? ['clan:' + authClan] : []),
        ...(authCountry ? [authCountry] : []),
        ...orderedCountriesDistinct,
    ];
    // const divider = (x: any, i: number) => i < (authCountry ? 2 : 1);
    const icon = (x: any) => {
        if (x == countryEarth) {
            return <CountryImageForDropDown country="EARTH" />;
        }
        if (x == 'following') {
            // return <FontAwesome name="heart" size={14} />;
            return <SpecialImageForDropDown emoji="🖤" />;
        }
        if (x.startsWith('clan')) {
            // return <FontAwesome name="trophy" size={14} />;
            return <SpecialImageForDropDown emoji="⚔️" />;
        }
        return <CountryImageForDropDown country={x} />;
    };
    const onCountrySelected = (country: string | null) => {
        mutate(setLeaderboardCountry(country));
    };

    if (appConfig.game === 'aoe4') {
        return <View />;
    }

    return (
        <Select
            style={{ flex: 1, marginRight: 16 }}
            size="small"
            selectedIndex={new IndexPath(countryList.indexOf(country))}
            onSelect={(index) => onCountrySelected(countryList[(index as IndexPath).row])}
            value={formatCountry(country, true)}
            accessoryLeft={icon(country)}
        >
            {countryList.map((country, i) => {
                return <SelectItem key={i} title={formatCountry(country, true)} accessoryLeft={icon(country)} />;
            })}
        </Select>
    );
}

const ROW_HEIGHT = 45;
const ROW_HEIGHT_MY_RANK = 52;

export default function LeaderboardPage() {
    const { colorScheme } = useColorScheme();

    const { data: leaderboards } = useQuery({
        queryKey: ['leaderboards'],
        queryFn: fetchLeaderboards,
    });

    const [leaderboardType, setLeaderboardType] = useState<'pc' | 'xbox'>('pc');

    if (!leaderboards) {
        return <View />;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Leaderboards',
                    headerRight: () => (
                        <Dropdown
                            style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 6 }}
                            value={leaderboardType}
                            onChange={setLeaderboardType}
                            options={[
                                { value: 'pc', label: 'PC' },
                                { value: 'xbox', label: 'Xbox' },
                            ]}
                        />
                    ),
                }}
            />
            <Tab.Navigator
                key={leaderboardType}
                tabBar={(props) => (
                    <View className="bg-white dark:bg-blue-900 ">
                        <MaterialTopTabBar {...props} />
                    </View>
                )}
                screenOptions={{
                    lazy: false,
                    swipeEnabled: false,
                    tabBarStyle: { backgroundColor: 'transparent' },
                    tabBarInactiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
                    tabBarActiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
                }}
            >
                {leaderboardsByType(leaderboards, leaderboardType).map((leaderboard, i) => {
                    return (
                        <Tab.Screen
                            key={i}
                            name={`${leaderboard.leaderboardId}`}
                            options={{ tabBarLabel: (x) => <TabBarLabel {...x} title={leaderboard.abbreviation.replace('🎮', '').trim()} /> }}
                        >
                            {() => <Leaderboard leaderboardId={leaderboard.leaderboardId} />}
                        </Tab.Screen>
                    );
                })}
            </Tab.Navigator>
        </>
    );
}

export const windowWidth = Platform.OS === 'web' ? 450 : Dimensions.get('window').width;

const pageSize = 100;

function Leaderboard({ leaderboardId }: any) {
    const styles = useStyles();
    const [refetching, setRefetching] = useState(false);
    const leaderboardCountry = useSelector((state) => state.leaderboardCountry) || null;
    const [loadedLeaderboardCountry, setLoadedLeaderboardCountry] = useState(leaderboardCountry);
    const insets = useSafeAreaInsets();
    const flatListRef = React.useRef<FlatListRef>(null);
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
        if (leaderboardCountry?.startsWith('clan:')) {
            return { page, profileId, clan: leaderboardCountry?.replace('clan:', '') };
        }
        if (leaderboardCountry == countryEarth) {
            return { page, profileId };
        }
        return { page, profileId, country: leaderboardCountry };
    };

    // const myRank = useLazyApi({}, fetchLeaderboard, { leaderboardId, ...getParams(1, auth?.profileId) });

    const calcRankWidth = (contentOffsetY: number | undefined) => {
        if (contentOffsetY === undefined) return;

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

    const leaderboard = useLazyAppendApi(
        {
            append: (data, newData, args) => {
                const [params] = args;
                // console.log('APPEND', data, newData, args);

                total.current = newData.total;
                total2.current = newData.total;
                list.current.length = newData.total;
                newData.players.forEach((value, index) => (list.current[(params.page! - 1) * pageSize + index] = value));

                calcRankWidth(contentOffsetY);

                setLoadedLeaderboardCountry(leaderboardCountry);

                // console.log('APPENDED', list.current);
                // console.log('APPENDED', params);
                return data;
            },
        },
        fetchLeaderboard,
        { leaderboardId, ...getParams(1) }
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

    const scrollToIndex = (index: number) => {
        // TODO: Scrolling position is not accurate because the database is actually missing some ranks (sometimes).
        // HACK: We use viewPosition: 0.5 so that the user does not notice it.
        flatListRef.current?.scrollToIndex({ animated: false, index, viewPosition: 0, viewOffset: -headerHeightAndPadding });
    };

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
        if (!isFocused) return;
        if (leaderboard.touched && leaderboard.lastParams?.leaderboardCountry === leaderboardCountry) return;
        list.current.length = Math.min(list.current.length, pageSize);
        leaderboard.reload();
        // if (auth) {
        //     myRank.reload();
        // }
        console.log('RELOADING LEADERBOARD', leaderboardCountry);
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
        total2.current = 1000;
    }, [isFocused, leaderboardCountry]);

    const total = useRef<any>();

    // When switching from on leaderboard to another we need to set this to something
    // greater 0 so that a fetch is not prevented
    const total2 = useRef<any>(1000);

    const onSelect = async (player: ILeaderboardPlayer) => {
        router.push(`/matches/users/${player.profileId}?name=${player.name}&country=${player.country}`);
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
                <View style={{ height: headerInfoHeight }} className="flex-row justify-between pl-4 pr-12 items-center">
                    <LeaderboardMenu />
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
        await leaderboard.refetchAppend({ leaderboardId, ...getParams(page) });
        fetchingPages.current = fetchingPages.current.filter((p) => p !== page);

        setTemp((t) => t + 1);
    };

    const fetchByContentOffset = (contentOffsetY: number) => {
        if (!leaderboard.touched) return;

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
        if (movingScrollHandle.current) return;
        position.setValue({ x: 0, y: (contentOffsetY / (list.current.length * ROW_HEIGHT)) * scrollRange.current });
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

    const inactivityTimeout = useRef<any>();
    const scrollRange = useRef<number>(0);
    const handleOffsetY = useRef<number>();
    const movingScrollHandle = useRef<boolean>();
    const scollingFlatlist = useRef<boolean>();
    const [handleVisible, setHandleVisible] = useState(true);
    const [baseMoving, setBaseMoving] = useState(false);

    const position = useRef(new Animated.ValueXY()).current;
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                // TODO: Currently when start the pan responder the handle is jumping. I think this is due to a bug in react-native-gesture-handler.
                //       To fix this we only move handle once the user is moving the handle because this will move the handle to the correct position.
                onStartShouldSetPanResponder: () => false,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderMove: (_evt, gestureState) => {
                    const min = -handleOffsetY.current!;
                    const max = min + scrollRange.current;
                    position.setValue({ x: gestureState.dx, y: Math.max(Math.min(gestureState.dy, max), min) });
                },
                onPanResponderGrant: () => {
                    handleOffsetY.current = getValue(position.y);
                    position.setOffset({
                        x: getValue(position.x),
                        y: getValue(position.y),
                    });
                    movingScrollHandle.current = true;
                    setBaseMoving(true);
                },
                onPanResponderRelease: () => {
                    position.flattenOffset();
                    const offset = getValue(position.y);
                    const newOffset = (offset / scrollRange.current) * total.current * ROW_HEIGHT;
                    flatListRef.current?.scrollToOffset({ animated: false, offset: newOffset });
                    movingScrollHandle.current = false;
                    setBaseMoving(false);
                    handleOffsetY.current = 0;
                },
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

    return (
        <View style={styles.container2}>
            {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
            <View style={[styles.content, { opacity: leaderboard.loading ? 0.7 : 1 }]}>
                <FlatList
                    ref={flatListRef}
                    onScrollEndDrag={handleOnScrollEndDrag}
                    onMomentumScrollBegin={handleOnMomentumScrollBegin}
                    onMomentumScrollEnd={handleOnMomentumScrollEnd}
                    onScroll={handleOnScroll}
                    onLayout={({ nativeEvent: { layout } }) => {
                        scrollRange.current = layout.height - HANDLE_RADIUS * 2 - bottom;
                    }}
                    scrollEventThrottle={500}
                    contentContainerStyle="pt-2 pb-4"
                    data={list.current}
                    getItemLayout={(_data: any, index: number) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
                    renderItem={({ item, index }: any) => _renderRow(item, index)}
                    keyExtractor={(item: { profileId: any }, index: any) => (item?.profileId || index).toString()}
                    refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={refetching} />}
                    ListHeaderComponent={_renderHeader}
                    showsVerticalScrollIndicator={!handleVisible}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <MyText>{getEmptyListStr()}</MyText>
                        </View>
                    }
                />
            </View>
            <View style={[styles.handleContainer, { bottom }]} pointerEvents="box-none">
                <Animated.View {...panResponder.panHandlers} style={[{ top: position.y, right: 0, opacity: handleVisible ? 1 : 0 }, styles.handle]}>
                    <FontAwesome5 name="arrows-alt-v" size={26} style={styles.arrows} />
                    {baseMoving && (
                        <View style={styles.textContainer}>
                            <View style={styles.textBox}>
                                <AnimatedValueText
                                    value={position.y}
                                    formatter={(offset: number) => ((offset / scrollRange.current) * list.current.length).toFixed()}
                                    style={styles.text}
                                />
                            </View>
                        </View>
                    )}
                </Animated.View>
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
                    <CountryImageLoader country={player?.country} ready={player} />
                    <TextLoader style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>
                        {player?.name}
                    </TextLoader>
                </View>
                {windowWidth >= 360 && (
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
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },

        pickerRow: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
        },

        menu: {
            // backgroundColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            marginRight: 10,
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
            textAlign: 'right',
            color: theme.textNoteColor,
            fontSize: 12,
            minWidth: 75,
        },
    } as const)
);
