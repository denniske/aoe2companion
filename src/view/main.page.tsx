import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, AsyncStorage, FlatList, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useApi} from '../hooks/use-api';
import {loadProfile} from '../service/profile';
import {Game} from './components/game';
import Search from './components/search';
import {composeUserId, UserInfo} from '../helper/user';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {setAuth, setPrefValue, useMutate, useSelector} from '../redux/reducer';
import Profile from './components/profile';
import {loadRatingHistories} from '../service/rating';
import Rating from './components/rating';
import {fetchMatches} from '../api/matches';
import {useNavigation} from "@react-navigation/native";
import {useCavy} from "cavy";
import {TabBarLabel} from "./components/tab-bar-label";
import FlatListLoadingIndicator from "./components/flat-list-loading-indicator";
import {useLazyApi} from "../hooks/use-lazy-api";
import StatsCiv from "./components/stats-civ";
import StatsMap from "./components/stats-map";
import StatsPlayer, {getStatsPlayerRows} from "./components/stats-player";
import {MyText} from "./components/my-text";
import {saveCurrentPrefsToStorage, saveSettingsToStorage} from "../service/storage";
import Picker from "./components/picker";
import {formatLeaderboardId, LeaderboardId, leaderboardList} from "../helper/leaderboards";
import {IMatch} from "../helper/data";
import { sleep } from '../helper/util';
import {getCacheEntry, setCacheEntry} from "../redux/cache";
import {usePrevious} from "../hooks/use-previous";

async function getFilteredMatches({matches, user, leaderboardId} : any) {
    const cacheKey = [composeUserId(user), leaderboardId.toString()];
    // const data = getCacheEntry(cacheKey);
    // if (data) {
    //     console.log("==> CACHED", cacheKey);
    //     // await sleep(2000);
    //     return data;
    // }

    console.log("==> CALC1", cacheKey);
    const matches2 = matches.data?.filter((m: any) => m.leaderboard_id === leaderboardId);

    const statsPlayerRows = await getStatsPlayerRows({matches: matches2, user, leaderboardId});

    const result = {
        statsPlayerRows,
    };

    setCacheEntry(cacheKey, result);

    return result;
}


function MainHome() {
    const auth = useSelector(state => state.auth!);
    const mutate = useMutate();
    const generateTestHook = useCavy();
    const leaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;

    // const rating = useApi(
    //         [],
    //         state => state.user[auth.id]?.rating,
    //         (state, value) => {
    //             if (state.user[auth.id] == null) {
    //                 state.user[auth.id] = {};
    //             }
    //             state.user[auth.id].rating = value;
    //         },
    //         loadRatingHistories, 'aoe2de', auth
    // );
    //
    // const profile = useApi(
    //         [],
    //         state => state.user[auth.id]?.profile,
    //         (state, value) => {
    //             if (state.user[auth.id] == null) {
    //                 state.user[auth.id] = {};
    //             }
    //             state.user[auth.id].profile = value;
    //         },
    //         loadProfile, 'aoe2de', auth
    // );

    let matches = useLazyApi(
        fetchMatches, 'aoe2de', 0, 1000, auth
    );

    const _filteredMatches = useLazyApi(getFilteredMatches, {matches, user: auth, leaderboardId});
    let statsPlayerRows = _filteredMatches.data?.statsPlayerRows;

    const cacheKey = [composeUserId(auth), leaderboardId.toString()];
    const data = getCacheEntry(cacheKey);
    const hasStats1 = data != null;
    const hasStats2 = (matches.loading || matches.data) || data != null;
    // const hasStats2 = !matches.loading && !matches.data && data == null;

    if (hasStats1) {
        // console.log("USING CACHED DATA", data.statsPlayerRows);
        statsPlayerRows = data.statsPlayerRows;
    }

    const prevLeaderboardId = usePrevious(leaderboardId);

    useEffect(() => {
        console.log("FETCHING MATCHES TRY");
        if (!matches.data && !hasStats1 && prevLeaderboardId != null) {
            console.log("FETCHING MATCHES");
            matches.reload();
        }
    }, [leaderboardId]);

    useEffect(() => {
        console.log("FILTERING MATCHES TRY");
        // if (matches.data || hasStats1) {
        if (matches.data && !hasStats1) {
            console.log("FILTERING MATCHES", matches?.data?.length);
            _filteredMatches.reload();
        }
    }, [matches.data, leaderboardId]);

    const list = ['profile', 'rating-header', 'rating', 'stats-header', 'stats-player', 'stats-civ', 'stats-map', 'settings-header', 'not-me'];

    const deleteUser = () => {
        Alert.alert("Delete Me?", "Do you want to reset me page?",
                [
                    {text: "Cancel", style: "cancel"},
                    {text: "Reset", onPress: doDeleteUser,}
                ],
                {cancelable: false}
        );
    };

    const doDeleteUser = async () => {
        await AsyncStorage.removeItem('settings');
        mutate(setAuth(null))
    };

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        mutate(setPrefValue('leaderboardId', leaderboardId));
        await saveCurrentPrefsToStorage();
    };

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            onRefresh={() => {
                                matches.reload();
                            }}
                            refreshing={matches.loading}
                            // refreshing={rating.loading || profile.loading}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'settings-header':
                                        return <MyText style={styles.sectionHeader}>Settings</MyText>;
                                    // case 'rating-header':
                                    //     return <MyText style={styles.sectionHeader}>Rating History</MyText>;
                                    case 'stats-header':
                                        const loading = (matches.loading ||_filteredMatches.loading);
                                        return <View>
                                            <MyText style={styles.sectionHeader}>Stats</MyText>
                                            {/*<MyText>{matches.loading ? 'LOADING MATCHES' : 'DONE'}</MyText>*/}
                                            {/*<MyText>{_filteredMatches.loading ? 'FILTERING' : 'DONE'}</MyText>*/}

                                            <View style={styles.row}>
                                                <ActivityIndicator style={styles.indicator} animating={loading} size="small"/>
                                                <Picker style={styles.statsPicker} disabled={loading} value={leaderboardId} values={leaderboardList} formatter={formatLeaderboardId} onSelect={onLeaderboardSelected}/>
                                            </View>

                                            {
                                                // !matches.touched && !matches.loading &&
                                                !hasStats2 &&
                                                <Button
                                                    onPress={() => matches.reload()}
                                                    mode="contained"
                                                    compact
                                                    uppercase={false}
                                                    dark={true}
                                                >
                                                    Load Stats
                                                </Button>
                                            }
                                        </View>;
                                    // case 'stats-civ':
                                    //     // if (!matches.touched && !matches.loading) return <View/>;
                                    //     if (!hasStats2) return <View/>;
                                    //     return <StatsCiv data={statsPlayerRows} user={auth} leaderboardId={leaderboardId}/>;
                                    // case 'stats-map':
                                    //     if (!matches.touched && !matches.loading) return <View/>;
                                    //     return <StatsMap matches={filteredMatches} user={auth}/>;
                                    case 'stats-player':
                                        // if (!matches.touched && !matches.loading) return <View/>;
                                        if (!matches.touched && !matches.loading && !hasStats1) return <View/>;
                                        return <StatsPlayer data={statsPlayerRows} user={auth} leaderboardId={leaderboardId}/>;
                                    // case 'rating':
                                    //     return <Rating ratingHistories={rating.data}/>;
                                    // case 'profile':
                                    //     return <Profile data={profile.data}/>;
                                    case 'not-me':
                                        return (
                                            <View>
                                                <MyText/>
                                                <Button mode="outlined" ref={generateTestHook('abc')} onPress={deleteUser}>This is not me</Button>
                                            </View>
                                        );
                                    default:
                                        return <View/>;
                                }

                            }}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}


function MainMatches() {
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);

    const auth = useSelector(state => state.auth!);

    const matches = useApi(
            [],
            state => state.user[auth.id]?.matches,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].matches = value;
            },
            fetchMatches, 'aoe2de', 0, 15, auth
    );

    const onRefresh = async () => {
        setRefetching(true);
        await matches.reload();
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (fetchingMore) return;
        setFetchingMore(true);
        await matches.refetch('aoe2de', 0, (matches.data?.length ?? 0) + 15, auth);
        setFetchingMore(false);
    };

    const list = [...(matches.data || Array(15).fill(null))];

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            onRefresh={onRefresh}
                            refreshing={refetching}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    default:
                                        return <Game data={item as any} expanded={index === -1}/>;
                                }
                            }}
                            ListFooterComponent={_renderFooter}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.1}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}

const Tab = createMaterialTopTabNavigator();

export default function MainPage() {
    const auth = useSelector(state => state.auth);
    const mutate = useMutate();

    const generateTestHook = useCavy();
    const navigation = useNavigation();
    generateTestHook('Navigation')(navigation);

    // console.log("==> MAIN PAGE");

    const onSelect = async (user: UserInfo) => {
        await saveSettingsToStorage({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
        });
        mutate(setAuth(user));
    };

    // console.log("==> ON RENDER MainPage");

    if (auth == null) {
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
    }

    return (
            <Tab.Navigator swipeEnabled={false} lazy={true}>
                <Tab.Screen name="MainHome" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Profile"/>}} component={MainHome}/>
                <Tab.Screen name="MainMatches" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Matches"/>}} component={MainMatches}/>
            </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    indicator: {
        // backgroundColor: 'green',
    },
    row: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
        marginBottom: 10
    },
    statsPicker: {
    },
    sectionHeader: {
        marginTop: 30,
        marginBottom: 15,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
    outlineButton: {
        backgroundColor: 'red',
    },
    list: {
        padding: 20,
    },
    container: {
        flex: 1,
        // backgroundColor: '#B89579',
    },
    content: {
        flex: 1,
    },
});
