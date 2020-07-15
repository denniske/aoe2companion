import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, AsyncStorage, FlatList, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useApi} from '../hooks/use-api';
import {loadProfile} from '../service/profile';
import {Game} from './components/game';
import Search from './components/search';
import {composeUserId, UserInfo} from '../helper/user';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {clearStatsPlayer, setAuth, setPrefValue, useMutate, useSelector} from '../redux/reducer';
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
import StatsPlayer from "./components/stats-player";
import {MyText} from "./components/my-text";
import {saveCurrentPrefsToStorage, saveSettingsToStorage} from "../service/storage";
import Picker from "./components/picker";
import {formatLeaderboardId, LeaderboardId, leaderboardList} from "../helper/leaderboards";
import {usePrevious} from "../hooks/use-previous";
import {useCachedConservedLazyApi} from "../hooks/use-cached-conserved-lazy-api";
import {get, set} from "lodash-es";
import {getStats} from "../service/stats";


function MainHome() {
    const auth = useSelector(state => state.auth!);
    const mutate = useMutate();
    const generateTestHook = useCavy();
    const prefLeaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;
    const [leaderboardId, setLeaderboardId] = useState(prefLeaderboardId);

    const rating = useApi(
            [],
            state => state.user[auth.id]?.rating,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].rating = value;
            },
            loadRatingHistories, 'aoe2de', auth
    );

    const profile = useApi(
            [],
            state => state.user[auth.id]?.profile,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].profile = value;
            },
            loadProfile, 'aoe2de', auth
    );

    let allMatches = useLazyApi(
        fetchMatches, 'aoe2de', 0, 1000, auth
    );

    const cachedData = useSelector(state => get(state.statsPlayer, [auth.id, leaderboardId]));

    const stats = useCachedConservedLazyApi(
            [allMatches.data, leaderboardId],
            () => allMatches.data != null,
            state => get(state, ['statsPlayer', auth.id, leaderboardId]),
            (state, value) => set(state, ['statsPlayer', auth.id, leaderboardId], value),
            getStats, {matches: allMatches.data, user: auth, leaderboardId}
    );

    let statsPlayer = stats.data?.statsPlayer;
    let statsCiv = stats.data?.statsCiv;
    let statsMap = stats.data?.statsMap;

    const hasMatches = allMatches.loading || (allMatches.data != null);
    const hasStats = cachedData != null;
    const hasMatchesOrStats = hasMatches || hasStats;
    const loadingMatchesOrStats = (allMatches.loading || stats.loading);

    const prevLeaderboardId = usePrevious(leaderboardId);

    const loadStats = () => allMatches.reload();

    useEffect(() => {
        console.log("FETCHING MATCHES TRY");
        if (!hasMatchesOrStats && prevLeaderboardId != null) {
            console.log("FETCHING MATCHES");
            allMatches.reload();
        }
    }, [leaderboardId]);

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        mutate(setPrefValue('leaderboardId', leaderboardId));
        await saveCurrentPrefsToStorage();
        setLeaderboardId(leaderboardId);
    };

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
    const [refreshing, setRefreshing] = useState(false);

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            onRefresh={async () => {
                                setRefreshing(true);
                                await mutate(clearStatsPlayer(auth));
                                await Promise.all([rating.reload(), profile.reload(), allMatches.reload()]);
                                setRefreshing(false);
                            }}
                            refreshing={refreshing}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'settings-header':
                                        return <MyText style={styles.sectionHeader}>Settings</MyText>;
                                    case 'rating-header':
                                        return <MyText style={styles.sectionHeader}>Rating History</MyText>;
                                    case 'stats-header':
                                        return <View>
                                            <MyText style={styles.sectionHeader}>Stats</MyText>

                                            <View style={styles.pickerRow}>
                                                <ActivityIndicator animating={loadingMatchesOrStats} size="small"/>
                                                <Picker disabled={loadingMatchesOrStats} value={leaderboardId} values={leaderboardList} formatter={formatLeaderboardId} onSelect={onLeaderboardSelected}/>
                                            </View>

                                            {
                                                !hasMatchesOrStats &&
                                                <Button
                                                    onPress={loadStats}
                                                    mode="contained"
                                                    compact
                                                    uppercase={false}
                                                    dark={true}
                                                >
                                                    Load Stats
                                                </Button>
                                            }
                                        </View>;
                                    case 'stats-civ':
                                        if (!hasMatchesOrStats) return <View/>;
                                        return <StatsCiv data={statsCiv} user={auth}/>;
                                    case 'stats-map':
                                        if (!hasMatchesOrStats) return <View/>;
                                        return <StatsMap data={statsMap} user={auth}/>;
                                    case 'stats-player':
                                        if (!hasMatchesOrStats) return <View/>;
                                        return <StatsPlayer data={statsPlayer} user={auth} leaderboardId={leaderboardId}/>;
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        return <Profile data={profile.data}/>;
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
    const [fetchedAll, setFetchedAll] = useState(false);

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
        const matchesLength = matches.data?.length ?? 0;
        const newMatchesData = await matches.refetch('aoe2de', 0, matchesLength + 15, auth);
        if (matchesLength === newMatchesData.length) {
            setFetchedAll(true);
        }
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
                            onEndReached={fetchedAll ? null : onEndReached}
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
            <Tab.Navigator lazy={true}>
                <Tab.Screen name="MainHome" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Profile"/>}} component={MainHome}/>
                <Tab.Screen name="MainMatches" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Matches"/>}} component={MainMatches}/>
            </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    pickerRow: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
        marginBottom: 10
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
