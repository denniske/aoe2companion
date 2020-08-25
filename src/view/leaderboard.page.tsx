import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator, Animated, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, PanResponder, StyleSheet,
    TextStyle,
    TouchableOpacity, View, ViewStyle
} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {fetchLeaderboard} from "../api/leaderboard";
import {minifyUserId, sameUserNull, userIdFromBase} from "../helper/user";
import {countriesDistinct, Country, getCountryName, getFlagIcon} from "../helper/flags";
import {ILeaderboardPlayer} from "../helper/data";
import {RootStackProp} from "../../App";
import IconFA from "react-native-vector-icons/FontAwesome";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import {useLazyApi} from "../hooks/use-lazy-api";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {TextLoader} from "./components/loader/text-loader";
import {ImageLoader} from "./components/loader/image-loader";
import {TabBarLabel} from "./components/tab-bar-label";
import {MyText} from "./components/my-text";
import {ITheme, makeVariants, usePaperTheme, useTheme} from "../theming";
import Picker from "./components/picker";
import {setLeaderboardCountry, useMutate, useSelector} from "../redux/reducer";
import TextHeader from "./components/navigation-header/text-header";
import {formatAgo, noop} from "../helper/util";
import RefreshControlThemed from "./components/refresh-control-themed";
import {AnimatedValueText} from "./components/animated-value-text";
import {getValue} from "../helper/util-component";

type TabParamList = {
    LeaderboardRm1v1: { leaderboardId: number };
    LeaderboardRmTeam: { leaderboardId: number };
    LeaderboardDm1v1: { leaderboardId: number };
    LeaderboardDmTeam: { leaderboardId: number };
    LeaderboardUnranked: { leaderboardId: number };
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

export function leaderboardMenu(props: any) {
    return () => {
        return <LeaderboardMenu/>;
    }
}

const countryEarth = null;

export function LeaderboardMenu() {
    const theme = usePaperTheme();
    const styles = useTheme(variants);
    const mutate = useMutate();
    const country = useSelector(state => state.leaderboardCountry) || null;

    const loadingMatchesOrStats = false;

    const formatCountry = (x: (string | null), inList?: boolean) => {
        if (x == countryEarth) {
            return 'Earth';
        }
        return inList ? getCountryName(x as Country) : x;
    };
    const orderedCountriesDistinct = countriesDistinct.sort((a, b) => formatCountry(a, true).localeCompare(formatCountry(b, true)));
    const countryList: (string | null)[] = [countryEarth, 'DE', ...orderedCountriesDistinct];
    const divider = (x: any, i: number) => i < 2;
    const icon = (x: any) => {
        if (x == countryEarth) {
            return <IconFA name="globe" size={21} style={{paddingLeft: 2, paddingRight: 12}} color={theme.colors.text} />;
        }
        return <Image fadeDuration={0} style={styles.countryIcon} source={getFlagIcon(x)}/>;
    };
    const onCountrySelected = (country: string | null) => {
        mutate(setLeaderboardCountry(country));
    };

    return (
        <View style={styles.menu}>
            <View style={styles.pickerRow}>
                <ActivityIndicator animating={loadingMatchesOrStats} size="small"/>
                <Picker itemHeight={40} textMinWidth={150} container="flatlist" divider={divider} icon={icon} disabled={loadingMatchesOrStats} value={country} values={countryList} formatter={formatCountry} onSelect={onCountrySelected}/>
            </View>
        </View>
    );
}

export function LeaderboardTitle(props: any) {
    return <TextHeader text={'Leaderboard'} onLayout={props.titleProps.onLayout}/>;
}

export default function LeaderboardPage() {
    const styles = useTheme(variants);
    return (
        <Tab.Navigator lazy={true} swipeEnabled={false}>
            <Tab.Screen name="LeaderboardRm1v1" initialParams={{leaderboardId: 3}} options={{tabBarLabel: (x) => <TabBarLabel {...x} title="RM 1v1"/>}}>
                {props => <Leaderboard leaderboardId={props.route?.params?.leaderboardId}/>}
            </Tab.Screen>
            <Tab.Screen name="LeaderboardRmTeam" initialParams={{leaderboardId: 4}} options={{tabBarLabel: (x) => <TabBarLabel {...x} title="RM Team"/>}}>
                {props => <Leaderboard leaderboardId={props.route?.params?.leaderboardId}/>}
            </Tab.Screen>
            <Tab.Screen name="LeaderboardDm1v1" initialParams={{leaderboardId: 1}} options={{tabBarLabel: (x) => <TabBarLabel {...x} title="DM 1v1"/>}}>
                {props => <Leaderboard leaderboardId={props.route?.params?.leaderboardId}/>}
            </Tab.Screen>
            <Tab.Screen name="LeaderboardDmTeam" initialParams={{leaderboardId: 2}} options={{tabBarLabel: (x) => <TabBarLabel {...x} title="DM Team"/>}}>
                {props => <Leaderboard leaderboardId={props.route?.params?.leaderboardId}/>}
            </Tab.Screen>
            <Tab.Screen name="LeaderboardUnranked" initialParams={{leaderboardId: 0}} options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Unr."/>}}>
                {props => <Leaderboard leaderboardId={props.route?.params?.leaderboardId}/>}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function Leaderboard({leaderboardId}: any) {
    const styles = useTheme(variants);
    const auth = useSelector(state => state.auth!);
    const [refetching, setRefetching] = useState(false);
    const leaderboardCountry = useSelector(state => state.leaderboardCountry) || null;
    const navigation = useNavigation<RootStackProp>();
    const flatListRef = React.useRef<FlatList>(null);
    const [fetchingPage, setFetchingPage] = useState<number>();
    const [contentOffsetY, setContentOffsetY] = useState<number>();
    const [rankWidth, setRankWidth] = useState<number>(43);

    const currentRouteLeaderboardId = useNavigationState(state => (state.routes[state.index].params as any)?.leaderboardId);

    const getParams = (start: number, count: number, rest: object = {}) => {
        // start -= 1;
        if (leaderboardCountry == countryEarth) {
            return {start, count, ...rest};
        }
        return {start, count, ...rest, country: leaderboardCountry};
    }

    const myRank = useLazyApi(
        {},
        fetchLeaderboard, 'aoe2de', leaderboardId, getParams(1, 1, auth ? minifyUserId(auth) : {})
    );

    const matches = useLazyApi(
        {
            append: (data, newData, args) => {
                const [game, leaderboard_id, params] = args;
                // console.log('APPEND', data, newData, params);
                newData.leaderboard.forEach((value, index) => data.leaderboard[index+params.start!-1] = value);
                console.log('APPENDED', params);
                return data;
            },
        },
        fetchLeaderboard, 'aoe2de', leaderboardId, getParams(1, 100)
    );

    const onRefresh = async () => {
        setRefetching(true);
        await Promise.all([matches.reload(), auth ? myRank.reload() : noop()]);
        setRefetching(false);
    };

    const rowHeight = 50;
    const headerMyRankHeight = myRank.data?.leaderboard.length > 0 ? 64 : 0;
    const headerInfoHeight = 30;
    const headerHeight = headerInfoHeight + headerMyRankHeight;

    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({ animated: true, index: index, viewOffset: -headerHeight-5 });
    };

    const scrollToMe = () => {
        scrollToIndex(myRank.data.leaderboard[0].rank-1);
    };

    useEffect(() => {
        if (currentRouteLeaderboardId != leaderboardId) return;
        if (matches.touched && matches.lastParams?.leaderboardCountry === leaderboardCountry) return;
        matches.reload();
        if (auth) {
            myRank.reload();
        }
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, [currentRouteLeaderboardId, leaderboardCountry]);

    const total = useRef<any>();

    const list = matches.data?.leaderboard || [];
    list.length = matches.data?.total || 200;
    total.current = matches.data?.total || 200;

    const onSelect = async (player: ILeaderboardPlayer) => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    const _renderRow = (player: ILeaderboardPlayer, i: number, isMyRankRow: boolean = false) => {
        const isMe = sameUserNull(player, auth);
        const rowStyle = { height: isMyRankRow ? headerMyRankHeight : rowHeight };
        const weightStyle = { fontWeight: isMe ? 'bold' : 'normal' } as TextStyle;
        const rankWidthStyle = { width: isMyRankRow ? undefined : rankWidth } as ViewStyle;
        return (
            <TouchableOpacity style={[styles.row, rowStyle]} disabled={player == null} onPress={() => isMyRankRow ? scrollToMe() : onSelect(player)}>
                <View style={isMyRankRow ? styles.innerRow : styles.innerRowWithBorder}>
                    <TextLoader numberOfLines={1} style={[styles.cellRank, weightStyle, rankWidthStyle]}>#{player?.rank || i+1}</TextLoader>
                    <TextLoader style={isMe ? styles.cellRatingMe : styles.cellRating}>{player?.rating}</TextLoader>
                    <View style={styles.cellName}>
                        <ImageLoader style={styles.countryIcon} ready={player} source={getFlagIcon(player?.country)}/>
                        <TextLoader style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>{player?.name}</TextLoader>
                    </View>
                    <TextLoader style={styles.cellGames}>{player?.games} games</TextLoader>
                </View>
            </TouchableOpacity>
        );
    };

    const _renderHeader = () => {
        return (
            <>
                <View style={{height: headerInfoHeight}}>
                    <MyText style={styles.info}>
                        {matches.data?.total} players{matches.data?.updated ? ' (updated ' + formatAgo(matches.data.updated) + ')' : ''}
                    </MyText>
                </View>
                {myRank.data?.leaderboard.length > 0 && _renderRow(myRank.data.leaderboard[0], 0, true)}
            </>
        )
    };

    const pageSize = 100;

    const fetchPage = async (page: number) => {
        if (fetchingPage !== undefined) return;
        if (matches.loading) return;
        console.log('FETCHPAGE', page);
        setFetchingPage(page);
        await matches.refetchAppend('aoe2de', leaderboardId, getParams(page * pageSize + 1, 100));
        setFetchingPage(undefined);
    };

    const fetchByContentOffset = (contentOffsetY: number) => {
        if (!matches.touched) return;

        contentOffsetY -= headerHeight;

        const index = Math.floor(contentOffsetY/rowHeight);
        const indexTop = Math.max(0, index);
        const indexBottom = Math.min(matches.data.total-1, index+15);

        const rankLen = indexBottom.toFixed(0).length;
        setRankWidth((rankLen+1) * 9 + 16);

        if (!list[indexTop]) {
            fetchPage(Math.floor(indexTop / pageSize));
            return;
        }
        if (!list[indexBottom]) {
            fetchPage(Math.floor(indexBottom / pageSize));
        }
    };

    useEffect(() => {
        if (contentOffsetY === undefined) return;
        fetchByContentOffset(contentOffsetY);
    }, [contentOffsetY, fetchingPage])

    const updateScrollHandlePosition = (contentOffsetY: number) => {
        if (movingScrollHandle.current) return;
        position.setValue({x: 0, y: contentOffsetY / (list.length * rowHeight) * scrollRange.current});
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
    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            const min = -handleOffsetY.current!;
            const max = min + scrollRange.current;
            position.setValue({x: gestureState.dx, y: Math.max(Math.min(gestureState.dy, max), min)});
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
            const newOffset = (offset / scrollRange.current) * total.current * rowHeight;
            flatListRef.current?.scrollToOffset({ animated: false, offset: newOffset });
            movingScrollHandle.current = false;
            setBaseMoving(false);
            handleOffsetY.current = 0;
        },
    }), []);

    const updateTimer = () => {
        setHandleVisible(false);
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        inactivityTimeout.current = setTimeout(() => setHandleVisible(true), 1000);
    };

    return (
        <View style={styles.container2}>
            <View style={[styles.content, {opacity: matches.loading ? 0.7 : 1}]}>
                {
                    matches.error &&
                    <View style={styles.centered}>
                        <MyText>Error occured when fetching data.</MyText>
                    </View>
                }
                {
                    matches.data?.total === 0 &&
                    <View style={styles.centered}>
                        <MyText>No players listed.</MyText>
                    </View>
                }
                {
                    matches.data?.total !== 0 &&
                    <FlatList
                        ref={flatListRef}
                        onScrollEndDrag={handleOnScrollEndDrag}
                        onMomentumScrollBegin={handleOnMomentumScrollBegin}
                        onMomentumScrollEnd={handleOnMomentumScrollEnd}
                        onScroll={handleOnScroll}
                        onLayout={({nativeEvent: {layout}}: any) => {
                            scrollRange.current = layout.height-HANDLE_RADIUS*2;
                        }}
                        scrollEventThrottle={500}
                        contentContainerStyle={styles.list}
                        data={list}
                        getItemLayout={(data: any, index: number) => ({length: rowHeight, offset: rowHeight * index, index})}
                        renderItem={({item, index}: any) => _renderRow(item, index)}
                        keyExtractor={(item: { profile_id: any; }, index: any) => (item?.profile_id || index).toString()}
                        refreshControl={
                            <RefreshControlThemed
                                onRefresh={onRefresh}
                                refreshing={refetching}
                            />
                        }
                        ListHeaderComponent={_renderHeader}
                        showsVerticalScrollIndicator={!handleVisible}
                    />
                }
            </View>
            <View style={styles.handleContainer} pointerEvents="box-none">
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[{top: position.y, right: -HANDLE_RADIUS, opacity: handleVisible ? 1 : 0}, styles.handle]}>
                    <IconFA5 name="arrows-alt-v" size={26} style={styles.arrows}/>
                    {
                        baseMoving &&
                        <View style={styles.textContainer}>
                            <View style={styles.textBox}>
                                <AnimatedValueText value={position.y} formatter={(offset: number) => ((offset / scrollRange.current) * list.length).toFixed()} style={styles.text}/>
                            </View>
                        </View>
                    }
                </Animated.View>
            </View>
        </View>
    );
}

const HANDLE_RADIUS = 36;

const padding = 8;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
            // backgroundColor: 'yellow',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
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
            paddingHorizontal: 15,
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
            alignItems: 'flex-end'
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
            width: 60,
        },
        cellRating: {
            margin: padding,
            width: 55,
        },
        cellRatingMe: {
            margin: padding,
            width: 55,
            fontWeight: 'bold',
        },
        flexRow: {
            flexDirection: 'row',
        },
        cellName: {
            // backgroundColor: 'yellow',
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
            height: 40,
            flex: 1,
        },
        innerRow: {
            // backgroundColor: 'red',
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 12,
        },
        innerRowWithBorder: {
            // backgroundColor: 'green',
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
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
            marginBottom: 15,
            color: theme.textNoteColor,
            fontSize: 12,
        },
    });
};

const variants = makeVariants(getStyles);

