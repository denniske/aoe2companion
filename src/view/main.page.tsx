import React, { useEffect, useState } from 'react';
import { Alert, AsyncStorage, FlatList, StyleSheet, Text, View } from 'react-native';
import {  Button } from 'react-native-paper';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { NavigationContainer, RouteProp, useLinkTo, useNavigation } from '@react-navigation/native';
import { fetchMatches } from '../api/matches';
import Profile from './profile';
import Rating from './rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';
import { loadSettingsFromStorage } from '../service/storage';
import SearchPage from './search.page';
import { UserId } from '../helper/user';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLazyApi } from '../hooks/use-lazy-api';
import { createContainer } from 'unstated-next';

// @refresh reset

function Main({steam_id, profile_id, deletedUser}: any) {
    const rating = useApi(loadRatingHistories, 'aoe2de', steam_id);
    const profile = useApi(loadProfile, 'aoe2de', profile_id);

    const list = ['profile', 'rating', 'not-me'];//, ...(matches.data || [])];

    const deleteUser = () => {
        Alert.alert("Delete Me?", "Do you want to reset me page?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset",  onPress: doDeleteUser, }
                ],
                { cancelable: false }
        );
    };

    useEffect(() => {
        console.log("==> USE EFFECT IN MAIN", steam_id, profile_id, deletedUser);
    }, []);

    const doDeleteUser = async () => {
        await AsyncStorage.removeItem('settings');
        deletedUser();
    };

    console.log("==> ON RENDER");

    return (
            // <Text>HELLO {steam_id} & {(new Date()).getSeconds()}</Text>
            // <Text>HELLO {(steam_id as Date).getSeconds()} & {(new Date()).getSeconds()}</Text>
            <View style={styles.container}>
                <View style={styles.content}>

                    <FlatList
                            onRefresh={() => {
                                console.log("==> ON REFRESHING");
                                rating.reload();
                                profile.reload();
                                // matches.reload();
                            }}
                            refreshing={rating.loading || profile.loading /*|| matches.loading*/}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        if (profile.data == null) return <Text>...</Text>;
                                        return <Profile data={profile.data}/>;
                                    case 'not-me':
                                        return <View>
                                            <Text/>
                                            <Button mode="outlined" onPress={deleteUser}>This is not me</Button>
                                        </View>;
                                        // if (profile.data == null) return <Text>...</Text>;
                                        // return <Profile data={profile.data}/>;
                                    default:
                                        return <Game data={item as any}/>;
                                }

                            }}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}


function MainHome() {
    const me = useApi(loadSettingsFromStorage);

    if (me.loading) {
        return <View style={styles.container}/>;
    }

    return (
            <Main
                    steam_id={me.data?.steam_id}
                    profile_id={me.data?.profile_id}
                    deletedUser={me.reload}
            />
    );
}


function MainMatches() {
    // const me = useApi(loadSettingsFromStorage);
    //
    // if (me.loading) {
    //     return <View style={styles.container}/>;
    // }
    //
    // const matches = useLazyApi(fetchMatches, 'aoe2de', profile_id, 0, 10);

    return (
            <Text>Matches</Text>
    );
}

function MainFollowing() {
    return (
            <Text>Following</Text>
    );
}

// export type MainTabParamList = {
//     MainHome: { };
//     MainMatches: { };
//     MainFollowing: { };
// };

const Tab = createMaterialTopTabNavigator();//<MainTabParamList>();


function useCounter(initialState = 0) {
    let [count, setCount] = useState(initialState)
    let decrement = () => setCount(count - 1)
    let increment = () => setCount(count + 1)
    return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

function CounterDisplay() {
    let counter = Counter.useContainer()
    return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Button onPress={counter.decrement}>-</Button>
                <Text>{counter.count}</Text>
                <Button onPress={counter.increment}>+</Button>
            </View>
    )
}




export default function MainPage() {
    const me = useApi(() => loadSettingsFromStorage());

    if (me.loading) {
        return <Text>Loading Me</Text>;
    }

    if (me.data == null) {
        return <SearchPage selectedUser={me.reload}/>;
    }

    return (

            <Counter.Provider>
                <CounterDisplay />
                <Counter.Provider initialState={2}>
                    <View>
                        <View>
                            <CounterDisplay />
                        </View>
                    </View>
                </Counter.Provider>
            </Counter.Provider>
            // <Tab.Navigator swipeEnabled={false} lazy={true}>
            //     <Tab.Screen name="MainHome" options={{ title: 'Profile' }} component={MainHome} />
            //     <Tab.Screen name="MainMatches" options={{ title: 'Matches' }} component={MainMatches} />
            //     <Tab.Screen name="MainFollowing" options={{ title: 'Following' }} component={MainFollowing} />
            // </Tab.Navigator>
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
