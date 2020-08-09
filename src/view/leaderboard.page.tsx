import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View
} from 'react-native';
import {useNavigation, useRoute, useNavigationState} from '@react-navigation/native';
import {fetchLeaderboard} from "../api/leaderboard";
import {minifyUserId, sameUserNull, userIdFromBase} from "../helper/user";
import {countriesDistinct, Country, getCountryName, getFlagIcon} from "../helper/flags";
import {ILeaderboardPlayer} from "../helper/data";
import {RootStackProp} from "../../App";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconFA from "react-native-vector-icons/FontAwesome";
import {useLazyApi} from "../hooks/use-lazy-api";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {IconButton} from "react-native-paper";
import {TextLoader} from "./components/loader/text-loader";
import {ImageLoader} from "./components/loader/image-loader";
import {TabBarLabel} from "./components/tab-bar-label";
import {MyText} from "./components/my-text";
import {ITheme, makeVariants, usePaperTheme, useTheme} from "../theming";
import Picker from "./components/picker";
import {orderBy} from "lodash-es";
import {setLeaderboardCountry, useMutate, useSelector} from "../redux/reducer";
import SubtitleHeader from "./components/navigation-header/subtitle-header";
import {useNavigationStateExternal} from "../hooks/use-navigation-state-external";
import {getString} from "../helper/strings";
import TextHeader from "./components/navigation-header/text-header";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import {formatAgo, formatDate, formatDateShort, formatDayAndTime, noop} from "../helper/util";
import RefreshControlThemed from "./components/refresh-control-themed";

type TabParamList = {
    LeaderboardRm1v1: { leaderboardId: number };
    LeaderboardRmTeam: { leaderboardId: number };
    LeaderboardDm1v1: { leaderboardId: number };
    LeaderboardDmTeam: { leaderboardId: number };
    LeaderboardUnranked: { leaderboardId: number };
};

// const Tab = createMaterialTopTabNavigator();
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
            return <IconFA name="globe" size={21} style={{paddingLeft: 2, paddingRight: 7}} color={theme.colors.text} />;
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
                <Picker itemHeight={40} textMinWidth={150} flatlist={true} divider={divider} icon={icon} disabled={loadingMatchesOrStats} value={country} values={countryList} formatter={formatCountry} onSelect={onCountrySelected}/>
            </View>
        </View>
    );
}

function findState(state: any, routeName: string): any {
    if (state == null) return null;
    const activeRoute = state.routes[state.index];
    const activeRouteName = activeRoute?.name;
    if (activeRouteName == routeName) {
        return activeRoute.state;
    }
    return findState(activeRoute.state, routeName);
}

function getActiveRouteName(state: any): any {
    if (state == null) return null;
    const activeRoute = state.routes[state.index];
    return activeRoute?.name;
}

function getActiveRoute(state: any): any {
    if (state == null) return null;
    return state.routes[state.index];
}

export function LeaderboardTitle(props: any) {
    // const navigationState = useNavigationStateExternal();
    // const leaderboardState = findState(navigationState, 'Leaderboard');
    // const activeRoute = getActiveRoute(leaderboardState);
    // const leaderboardId = activeRoute?.params?.leaderboardId;

    // console.log('activeRoute', activeRoute);
    // console.log('leaderboardId', leaderboardId);

    // const subtitle = getString('leaderboard', leaderboardId) || '';

    return <TextHeader text={'Leaderboard'} onLayout={props.titleProps.onLayout}/>;
    // return <SubtitleHeader text={'Leaderboard'} subtitle={subtitle} onLayout={props.titleProps.onLayout}/>;
}

export default function LeaderboardPage() {
    const styles = useTheme(variants);
    return (
        <Tab.Navigator lazy={true}>
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
    const [fetchingMore, setFetchingMore] = useState(false);
    const [fetchedAll, setFetchedAll] = useState(false);
    const leaderboardCountry = useSelector(state => state.leaderboardCountry) || null;
    const navigation = useNavigation<RootStackProp>();
    const flatListRef = React.useRef<FlatList>(null);

    // console.log('leaderboardCountry', leaderboardCountry);

    // const navigationState = useNavigationStateExternal();
    // const leaderboardState = findState(navigationState, 'Leaderboard');
    // const activeRoute = getActiveRoute(leaderboardState);
    // const navLeaderboardId = activeRoute?.params?.leaderboardId;

    // const route = useRoute();

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
            append: (data, newData) => {
                // console.log('APPEND', data, newData);
                data.leaderboard.push(...newData.leaderboard);
                return data;
            },
        },
        fetchLeaderboard, 'aoe2de', leaderboardId, getParams(1, 100)
    );

    const onRefresh = async () => {
        setFetchedAll(false);
        setRefetching(true);
        await Promise.all([matches.reload(), auth ? myRank.reload() : noop()]);
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (fetchingMore) return;
        const matchesLength = matches.data?.leaderboard?.length ?? 0;
        if (matchesLength < 100) return;
        setFetchingMore(true);
        const newMatchesData = await matches.refetchAppend('aoe2de', leaderboardId, getParams(matchesLength+1, 100));
        if (matchesLength === newMatchesData?.leaderboard?.length) {
            setFetchedAll(true);
        }
        setFetchingMore(false);
    };

    useEffect(() => {
        // console.log('useffect', currentRouteLeaderboardId, leaderboardId);
        // console.log('useffect2', prevLeaderboardCountry, leaderboardCountry);
        if (currentRouteLeaderboardId != leaderboardId) return;
        if (matches.touched && matches.lastParams?.leaderboardCountry === leaderboardCountry) return;
        setFetchedAll(false);
        matches.reload();
        if (auth) {
            myRank.reload();
        }
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        // flatListRef.current?.scrollToOffset({ animated: true, offset: 10000 });
        // flatListRef.current?.scrollToIndex({ animated: true, index: 80 });
    }, [currentRouteLeaderboardId, leaderboardCountry]);

    const list = ['info', ...(myRank.data?.leaderboard || []), ...(matches.data?.leaderboard || Array(15).fill(null))];

    console.log(matches?.error);

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    const onSelect = async (player: ILeaderboardPlayer) => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    const _renderRow = (player: ILeaderboardPlayer, i: number) => {
        const isMe = sameUserNull(player, auth);
        const isMyRankRow = isMe && i === 1;
        return (
            <TouchableOpacity style={styles.row} key={i} onPress={() => onSelect(player)}>
                <View style={isMyRankRow ? styles.innerRow : styles.innerRowWithBorder}>
                    <TextLoader style={isMe ? styles.cellRankMe : styles.cellRank}>#{player?.rank}</TextLoader>
                    <TextLoader style={isMe ? styles.cellRatingMe : styles.cellRating}>{player?.rating}</TextLoader>
                    <View style={styles.cellName}>
                        <ImageLoader style={styles.countryIcon} source={getFlagIcon(player?.country)}/>
                        <TextLoader style={isMe ? styles.nameMe : styles.name} numberOfLines={1}>{player?.name}</TextLoader>
                    </View>
                    <TextLoader style={styles.cellGames}>{player?.games} games</TextLoader>
                </View>
            </TouchableOpacity>
        );
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
                        contentContainerStyle={styles.list}
                        data={list}
                        renderItem={({item, index}) => {
                            switch (item) {
                                case 'info':
                                    return (
                                        <MyText style={styles.info}>
                                            {matches.data?.total} players{matches.data?.updated ? ' (updated ' + formatAgo(matches.data.updated) + ')' : ''}
                                        </MyText>
                                    );
                                default:
                                    return _renderRow(item, index);
                            }
                        }}
                        ListFooterComponent={_renderFooter}
                        onEndReached={fetchedAll ? null : onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControlThemed
                                onRefresh={onRefresh}
                                refreshing={refetching}
                            />
                        }
                    />
                }
            </View>
        </View>
    );
}


const padding = 8;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
            padding: padding,
            textAlign: 'left',
            minWidth: 60,
            fontWeight: 'bold',
        },
        cellRank: {
            padding: padding,
            textAlign: 'left',
            width: 60,
        },
        cellRating: {
            padding: padding,
            width: 55,
        },
        cellRatingMe: {
            padding: padding,
            width: 55,
            fontWeight: 'bold',
        },
        flexRow: {
            flexDirection: 'row',
        },
        cellName: {
            // backgroundColor: 'yellow',
            padding: padding,
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cellName2: {
            padding: padding,
            flex: 4,
        },
        cellGames: {
            padding: padding,
            width: 90,
            textAlign: 'right',
            fontSize: 12,
            color: theme.textNoteColor,
        },
        cellWins: {
            padding: padding,
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
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 12,
        },
        innerRowWithBorder: {
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
            marginRight: 5,
        },
        title: {
            marginBottom: 10,
            fontSize: 16,
            fontWeight: 'bold',
        },
        container: {
            display: 'flex',
            flex: 1,
            // backgroundColor: 'red',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 5,
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

