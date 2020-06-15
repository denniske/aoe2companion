import React, {useEffect, useRef, useState} from 'react';
import {Alert, AsyncStorage, FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button, Provider as PaperProvider} from 'react-native-paper';
import { useApi } from '../hooks/use-api';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';
import Search from './components/search';
import { composeUserId, UserId, UserInfo } from '../helper/user';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { setAuth, useMutate, useSelector } from '../redux/reducer';
import Profile from './components/profile';
import { loadRatingHistories } from '../service/rating';
import Rating from './components/rating';
import { fetchMatches } from '../api/matches';
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../App";
import {useCavy} from "cavy";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


function MainHome() {
    const auth = useSelector(state => state.auth!);
    const mutate = useMutate();
    const navigation = useNavigation<RootStackProp>();
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

    console.log("==> ON RENDER MainHome", rating.loading, profile.loading);

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
            fetchMatches, 'aoe2de', 0, 10, auth
    );

    // console.log(matches.data);

    const list = [...(matches.data || Array(5).fill(null))];

    return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                            onRefresh={() => {
                                matches.reload();
                            }}
                            refreshing={matches.loading}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    default:
                                        return <Game data={item as any} expanded={index === 0}/>;
                                }

                            }}
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

function TabBarLabel({ title }: any) {
    const generateTestHook = useCavy();
    const navigation = useNavigation();
    // ref={generateTestHook('Tab.'+title)}
    return (
        <View >
            <Text style={{fontSize: 13}} onPress={() => navigation.navigate(title)} >{title.toUpperCase()}</Text>
        </View>
    );
    // return <Text style={{fontSize: 13}} onPress={() => navigation.navigate(title)} ref={generateTestHook('Tab.'+title)}>{title.toUpperCase()}</Text>;
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
        return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect}/>;
    }

    return (
            <Tab.Navigator swipeEnabled={false} lazy={true}>
                {/*<Tab.Screen name="MainHome" options={{title: 'Profile'}} component={MainHome}/>*/}
                <Tab.Screen name="MainHome" options={{tabBarLabel: (_) => <TabBarLabel title="Profile"/>}} component={MainHome}/>
                <Tab.Screen name="MainMatches" options={{tabBarLabel: (_) => <TabBarLabel title="Matches"/>}} component={MainMatches}/>
            </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
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
