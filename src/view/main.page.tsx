import React, {useState} from 'react';
import {ActivityIndicator, Alert, AsyncStorage, FlatList, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useApi} from '../hooks/use-api';
import {loadProfile} from '../service/profile';
import {Game} from './components/game';
import Search from './components/search';
import {composeUserId, UserInfo} from '../helper/user';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {setAuth, useMutate, useSelector} from '../redux/reducer';
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


function MainHome() {
    const auth = useSelector(state => state.auth!);
    const mutate = useMutate();
    const generateTestHook = useCavy();

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

    const matches = useLazyApi(
        // [],
        // state => state.user[auth.id]?.matches,
        // (state, value) => {
        //     if (state.user[auth.id] == null) {
        //         state.user[auth.id] = {};
        //     }
        //     state.user[auth.id].matches = value;
        // },
        fetchMatches, 'aoe2de', 0, 1000, auth
    );

    const list = ['profile', 'rating-header', 'rating', 'stats-header', 'stats-player', 'stats-civ', 'stats-map', 'not-me'];

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

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            onRefresh={() => {
                                rating.reload();
                                profile.reload();
                            }}
                            refreshing={rating.loading || profile.loading}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating-header':
                                        return <Text style={styles.sectionHeader}>Rating History</Text>;
                                    case 'stats-header':
                                        return <View>
                                            <Text style={styles.sectionHeader}>Stats</Text>
                                            {
                                                !matches.touched && !matches.loading &&
                                                <Button
                                                    labelStyle={{fontSize: 13, marginVertical: 0}}
                                                    contentStyle={{height: 22}}
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
                                    case 'stats-civ':
                                        if (!matches.touched && !matches.loading) return <View/>;
                                        return <StatsCiv matches={matches.data}/>;
                                    case 'stats-map':
                                        if (!matches.touched && !matches.loading) return <View/>;
                                        return <StatsMap matches={matches.data}/>;
                                    case 'stats-player':
                                        if (!matches.touched && !matches.loading) return <View/>;
                                        return <StatsPlayer matches={matches.data}/>;
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        return <Profile data={profile.data}/>;
                                    case 'not-me':
                                        return (
                                            <View>
                                                <Text/>
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
        await AsyncStorage.setItem('settings', JSON.stringify({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
        }));
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
    sectionHeader: {
        marginTop: 20,
        marginBottom: 20,
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
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});
