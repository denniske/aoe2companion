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

    const list = ['profile', 'rating', 'not-me'];

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

    // console.log("==> ON RENDER MainHome", rating.loading, profile.loading);

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
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        return <Profile data={profile.data}/>;
                                    case 'not-me':
                                        return (
                                            <View>
                                                <Text/>
                                                <Button mode="outlined" ref={generateTestHook('abc')} onPress={deleteUser}>This is not me</Button>
                                                {
                                                    __DEV__ &&
                                                    <View>
                                                        <Text/>
                                                        {/*<Button mode="outlined" onPress={() => capture(navigation)}>Capture</Button>*/}
                                                    </View>
                                                }
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
    // console.log("==> ON RENDER MainMatches");
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
        console.log('onReload');
        setRefetching(true);
        await matches.reload();
        setRefetching(false);
        console.log('onReload DONE');
    };

    const onEndReached = async () => {
        console.log('endReached TRY');
        if (fetchingMore) return;
        console.log('endReached');
        setFetchingMore(true);
        await matches.refetch('aoe2de', 0, (matches.data?.length ?? 0) + 15, auth);
        setFetchingMore(false);
        console.log('endReached DONE');
    };

    // console.log(matches.data);

    const list = [...(matches.data || Array(15).fill(null))];

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return (
            <View style={styles.loadMoreIndicator}>
                <ActivityIndicator animating size="large" />
            </View>
        );
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
                                        return <Game data={item as any} expanded={index === 0}/>;
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

// export type MainTabParamList = {
//     MainHome: { };
//     MainMatches: { };
// };

const Tab = createMaterialTopTabNavigator();//<MainTabParamList>();

export function TabBarLabel({ title, focused, color }: any) {
    const navigation = useNavigation();
    return (
        <Text style={{fontSize: 13, color: color}} onPress={() => navigation.navigate(title)} >{title.toUpperCase()}</Text>
    );
}

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
    loadMoreIndicator: {
        paddingTop: 50,
        paddingBottom: 30,
        justifyContent: 'center',
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
