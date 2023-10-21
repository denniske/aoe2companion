import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    PanResponder,
    Platform,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getCountryName} from "../helper/flags";
import {countriesDistinct, Country, noop} from "@nex/data";
import {RootStackProp} from "../../App2";
import {FontAwesome5} from "@expo/vector-icons";
import {useLazyApi} from "../hooks/use-lazy-api";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {TextLoader} from "./components/loader/text-loader";
import {TabBarLabel} from "./components/tab-bar-label";
import {MyText} from "./components/my-text";
import {setLeaderboardCountry, useMutate, useSelector} from "../redux/reducer";
import TextHeader from "./components/navigation-header/text-header";
import RefreshControlThemed from "./components/refresh-control-themed";
import {AnimatedValueText} from "./components/animated-value-text";
import {getValue} from "../helper/util-component";
import {createStylesheet} from '../theming-new';
import {getTranslation} from '../helper/translate';
import {appConfig} from "@nex/dataset";
import {CountryImage, CountryImageLoader} from './components/country-image';
import {IndexPath, Select, SelectItem} from "@ui-kitten/components";
import {useLazyAppendApi} from "../hooks/use-lazy-append-api";
import {useApi} from "../hooks/use-api";
import {fetchLeaderboard, fetchLeaderboards} from '../api/helper/api';
import {ILeaderboardPlayer} from "../api/helper/api.types";

const Tab = createMaterialTopTabNavigator<any>();

export function leaderboardMenu() {
    return () => {
        return <LeaderboardMenu/>;
    }
}

const countryEarth = null;

export function LeaderboardMenu() {
    const mutate = useMutate();
    const country = useSelector(state => state.leaderboardCountry) || null;
    const authCountry = useSelector(state => state.prefs.country);

    const formatCountry = (x: (string | null), inList?: boolean) => {
        if (x == countryEarth) {
            return getTranslation('country.earth');
        }
        return inList ? getCountryName(x as Country) : x?.toUpperCase();
    };
    const orderedCountriesDistinct = countriesDistinct.sort((a, b) => formatCountry(a, true).localeCompare(formatCountry(b, true)));
    const countryList: (string | null)[] = [
        countryEarth,
        ...(authCountry ? [authCountry] : []),
        ...orderedCountriesDistinct
    ];
    // const divider = (x: any, i: number) => i < (authCountry ? 2 : 1);
    const icon = (x: any) => {
        if (x == countryEarth) {
            return <CountryImage country={'EARTH'} />;
        }
        return <CountryImage country={x} />;
    };
    const onCountrySelected = (country: string | null) => {
        mutate(setLeaderboardCountry(country));
    };

    if (appConfig.game == 'aoe4') {
        return <View></View>;
    }

    return (
        <Select
            style={{width: 190, marginRight: 16}}
            size={'small'}
            selectedIndex={new IndexPath(countryList.indexOf(country))}
            onSelect={index => onCountrySelected(countryList[(index as IndexPath).row])}
            value={formatCountry(country, true)}
            accessoryLeft={icon(country)}
        >
            {
                countryList.map((country, i) => {
                    return <SelectItem key={i} title={formatCountry(country, true)} accessoryLeft={icon(country)} />
                })
            }
        </Select>
    );
}

export function LeaderboardTitle(props: any) {
    return <TextHeader text={getTranslation('leaderboard.title')} onLayout={props.titleProps.onLayout}/>;
}

export default function LeaderboardPage() {

    const leaderboards = useApi(
        {},
        [],
        state => state.leaderboards,
        (state, value) => {
            state.leaderboards = value;
        },
        fetchLeaderboards
    );

    if (!leaderboards.data) {
        return <View></View>;
    }

    return (
        <Tab.Navigator screenOptions={{ lazy: false, swipeEnabled: false }}>
            {
                leaderboards.data.filter(leaderboard => leaderboard.active).map((leaderboard, i) => {
                    return <Tab.Screen key={i} name={`${leaderboard.leaderboardId}`} options={{tabBarLabel: (x) => <TabBarLabel {...x} title={leaderboard.abbreviation}/>}}>
                        {() => <Leaderboard leaderboardId={leaderboard.leaderboardId}/>}
                    </Tab.Screen>
                })
            }
        </Tab.Navigator>
    );
}

export const windowWidth = Platform.OS === 'web' ? 450 : Dimensions.get('window').width;

const pageSize = 100;

function Leaderboard({leaderboardId}: any) {
    const styles = useStyles();
    const auth = useSelector(state => state.auth!);
    const [refetching, setRefetching] = useState(false);
    const leaderboardCountry = useSelector(state => state.leaderboardCountry) || null;
    const navigation = useNavigation<RootStackProp>();
    const flatListRef = React.useRef<FlatList>(null);
    const [contentOffsetY, setContentOffsetY] = useState<number>();
    const [rankWidth, setRankWidth] = useState<number>(43);
    const [temp, setTemp] = useState<number>(43);

    const list = useRef<any[]>([]);
    const fetchingPages = useRef<number[]>([]);

    const isFocused = useIsFocused();

    const getParams = (page: number, profileId?: number) => {
        if (leaderboardCountry == countryEarth) {
            return {page, profileId};
        }
        return {page, profileId, country: leaderboardCountry};
    }

    const myRank = useLazyApi(
        {},
        fetchLeaderboard, { leaderboardId, ...getParams(1, auth?.profileId) }
    );

    const leaderboard = useLazyAppendApi(
        {
            append: (data, newData, args) => {
                const [ params ] = args;
                // console.log('APPEND', data, newData, args);

                total.current = newData.total;
                list.current.length = newData.total;
                newData.players.forEach((value, index) => list.current[(params.page!-1)*pageSize+index] = value);

                // console.log('APPENDED', list.current);
                // console.log('APPENDED', params);
                return data;
            },
        },
        fetchLeaderboard, { leaderboardId, ...getParams(1) }
    );

    const onRefresh = async () => {
        setRefetching(true);
        await Promise.all([leaderboard.reload(), auth ? myRank.reload() : noop()]);
        setRefetching(false);
    };

    const rowHeight = 45;
    const headerMyRankHeight = myRank.data?.players.length > 0 ? 64 : 0;
    const headerInfoHeight = 30;
    const headerHeight = headerInfoHeight + headerMyRankHeight;

    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({ animated: true, index: index, viewOffset: -headerHeight-5 });
    };

    const scrollToMe = () => {
        scrollToIndex(myRank.data.players[0].rank-1);
    };

    useEffect(() => {
        if (!isFocused) return;
        if (leaderboard.touched && leaderboard.lastParams?.leaderboardCountry === leaderboardCountry) return;
        leaderboard.reload();
        if (auth) {
            myRank.reload();
        }
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, [isFocused, leaderboardCountry]);

    const total = useRef<any>();

    const onSelect = async (player: ILeaderboardPlayer) => {
        navigation.push('User', {
            profileId: player.profileId,
        });
    };

    const _renderRow = (player: ILeaderboardPlayer, i: number, isMyRankRow: boolean = false) => {
        const isMe = player?.profileId === auth?.profileId;
        const rowStyle = { minHeight: isMyRankRow ? headerMyRankHeight : rowHeight };
        const weightStyle = { fontWeight: isMe ? 'bold' : 'normal' } as TextStyle;
        const rankWidthStyle = { width: isMyRankRow ? undefined : rankWidth } as ViewStyle;
        return (
            <TouchableOpacity style={[styles.row, rowStyle]} disabled={player == null} onPress={() => isMyRankRow ? scrollToMe() : onSelect(player)}>
                <View style={isMyRankRow ? styles.innerRow : styles.innerRowWithBorder}>
                    <TextLoader numberOfLines={1} style={[styles.cellRank, weightStyle, rankWidthStyle]}>#{player?.rank || i+1}</TextLoader>
                    <TextLoader style={isMe ? styles.cellRatingMe : styles.cellRating}>{player?.rating}</TextLoader>
                    <View style={styles.cellName}>
                        <CountryImageLoader country={player?.country} ready={player} />
                        <TextLoader style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>{player?.name}</TextLoader>
                    </View>
                    {
                        windowWidth >= 360 &&
                        <TextLoader ready={player?.games} style={styles.cellGames}>{getTranslation('leaderboard.games', { games: player?.games })}</TextLoader>
                    }
                </View>
            </TouchableOpacity>
        );
    };

    const _renderHeader = () => {
        const players = getTranslation('leaderboard.players', { players: total.current });
        // const updated = leaderboard.data?.updated ? getTranslation('leaderboard.updated', { updated: formatAgo(leaderboard.data.updated) }) : '';
        return (
            <>
                <View style={{height: headerInfoHeight}}>
                    <MyText style={styles.info}>
                        {total.current ? players : ''}{/*{leaderboard.data?.updated ? ' (' + updated + ')' : ''}*/}
                    </MyText>
                </View>
                {myRank.data?.players.length > 0 && _renderRow(myRank.data.players[0], 0, true)}
            </>
        )
    };

    const fetchPage = async (page: number) => {
        if (fetchingPages.current.includes(page)) return;
        if (leaderboard.loading) return;
        // console.log('FETCHPAGE', page);

        // const index = (page-1)*pageSize+1;
        // const has = list.current[index] != null;

        // console.log('HAS', page, 'ALREADY', index, list.current[index]);

        fetchingPages.current = [...fetchingPages.current, page];
        await leaderboard.refetchAppend({ leaderboardId, ...getParams(page) });
        fetchingPages.current = fetchingPages.current.filter(p => p !== page);

        setTemp(t => t + 1);
    };

    const fetchByContentOffset = (contentOffsetY: number) => {
        if (!leaderboard.touched) return;

        contentOffsetY -= headerHeight;
        contentOffsetY -= 20; // padding top

        const index = Math.floor(contentOffsetY/rowHeight);
        const indexTop = Math.max(0, index);
        const indexBottom = Math.min(total.current-1, index+15);

        const rankLen = indexBottom.toFixed(0).length;
        setRankWidth((rankLen+1) * 10);

        // console.log('indexTop', indexTop, '-', indexBottom);

        if (!list.current[indexTop]) {
            fetchPage(Math.ceil(indexTop / pageSize));
            return;
        }
        if (!list.current[indexBottom]) {
            fetchPage(Math.ceil(indexBottom / pageSize));
        }
    };

    useEffect(() => {
        if (contentOffsetY === undefined) return;
        fetchByContentOffset(contentOffsetY);
    }, [contentOffsetY, fetchingPages.current])

    const updateScrollHandlePosition = (contentOffsetY: number) => {
        if (movingScrollHandle.current) return;
        position.setValue({x: 0, y: contentOffsetY / (list.current.length * rowHeight) * scrollRange.current});
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
        onPanResponderMove: (_evt, gestureState) => {
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
            {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
            <View style={[styles.content, {opacity: leaderboard.loading ? 0.7 : 1}]}>
                {
                    leaderboard.error &&
                    <View style={styles.centered}>
                        <MyText>{getTranslation('leaderboard.error')}</MyText>
                    </View>
                }
                {
                    total.current === 0 &&
                    <View style={styles.centered}>
                        <MyText>{getTranslation('leaderboard.noplayerfound')}</MyText>
                    </View>
                }
                {
                    total.current !== 0 &&
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
                        data={list.current}
                        getItemLayout={(_data: any, index: number) => ({length: rowHeight, offset: rowHeight * index, index})}
                        renderItem={({item, index}: any) => _renderRow(item, index)}
                        keyExtractor={(item: { profileId: any; }, index: any) => (item?.profileId || index).toString()}
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
                    <FontAwesome5 name="arrows-alt-v" size={26} style={styles.arrows}/>
                    {
                        baseMoving &&
                        <View style={styles.textContainer}>
                            <View style={styles.textBox}>
                                <AnimatedValueText value={position.y} formatter={(offset: number) => ((offset / scrollRange.current) * list.current.length).toFixed()} style={styles.text}/>
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

const useStyles = createStylesheet(theme => StyleSheet.create({
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
        // backgroundColor: 'yellow',
    },
    cellRating: {
        margin: padding,
        width: 36,
        // backgroundColor: 'yellow',
    },
    cellRatingMe: {
        margin: padding,
        width: 36,
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
        height: 40,
        flex: 1,
    },
    innerRow: {
        // backgroundColor: 'red',
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    innerRowWithBorder: {
        // backgroundColor: 'green',
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
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
}));
