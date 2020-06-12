import React from 'react';
import { Alert, AsyncStorage, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useApi } from '../hooks/use-api';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';
import SearchPage from './search.page';
import { composeUserId, UserId } from '../helper/user';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { setAuth, useMutate, useSelector } from '../redux/reducer';
import Profile from './profile';
import { loadRatingHistories } from '../service/rating';
import Rating from './rating';

// @refresh reset

function MainHome() {
    const auth = useSelector(state => state.auth!);
    const mutate = useMutate();

    const rating = useApi(
            state => state.user[auth.id]?.rating,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].rating = value;
            },
            loadRatingHistories, 'aoe2de', auth.steam_id
    );

    const profile = useApi(
            state => state.user[auth.id]?.profile,
            (state, value) => {
                if (state.user[auth.id] == null) {
                    state.user[auth.id] = {};
                }
                state.user[auth.id].profile = value;
            },
            loadProfile, 'aoe2de', auth.profile_id
    );

    const list = ['profile', 'rating', 'not-me'];//, ...(matches.data || [])];

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

    console.log("==> ON RENDER MainHome");

    return (
            // <Text>HELLO.... {settings?.steam_id} & {(new Date()).getSeconds()}</Text>
            // <Text>HELLO {(steam_id as Date).getSeconds()} & {(new Date()).getSeconds()}</Text>
            <View style={styles.container}>
                <View style={styles.content}>

                    {/*<Text>steam_id: {auth?.steam_id}</Text>*/}
                    {/*<Text/>*/}
                    {/*<SettingsDisplay/>*/}

                    <FlatList
                            onRefresh={() => {
                                console.log("==> ON REFRESHING");
                                rating.reload();
                                profile.reload();
                                // matches.reload();
                            }}
                            refreshing={rating.loading || profile.loading}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        if (profile.data == null) return <Text>...</Text>;
                                        return (
                                                <View>
                                                    {/*<Text>Test2</Text>*/}
                                                    {/*<Text/>*/}
                                                    <Profile data={profile.data}/>
                                                </View>
                                        );
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
    )
            ;
}


// function MainHome() {
//     const me = useApi(loadSettingsFromStorage);
//
//     if (me.loading) {
//         return <View style={styles.container}/>;
//     }
//
//     return (
//             <Main
//                     steam_id={me.data?.steam_id}
//                     profile_id={me.data?.profile_id}
//                     deletedUser={me.reload}
//             />
//     );
// }


function MainMatches() {
    console.log("==> ON RENDER MainMatches");
    // const me = useApi(loadSettingsFromStorage);
    //
    // if (me.loading) {
    //     return <View style={styles.container}/>;
    // }
    //
    // const matches = useLazyApi(fetchMatches, 'aoe2de', profile_id, 0, 10);

    // const { settings } = Settings.useContainer()
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


// function SettingsDisplay() {
//     let {settings} = Settings.useContainer()
//     return (
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 {/*<Button onPress={settings.decrement}>-</Button>*/}
//                 <Text>steam_id: {settings?.steam_id}</Text>
//                 {/*<Button onPress={settings.increment}>+</Button>*/}
//             </View>
//     )
// }


export default function MainPage() {
    // const settings = Settings.useContainer()
    const auth = useSelector(state => state.auth);
    const mutate = useMutate();

    console.log("==> MAIN PAGE");

    const onSelect = async (user: UserId) => {
        await AsyncStorage.setItem('settings', JSON.stringify({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
        }));
        mutate(setAuth(user));
    };

    console.log("==> ON RENDER MainPage");

    if (auth == null) {
        return <SearchPage selectedUser={onSelect}/>;
    }

    return (
            // <View>
            //     <Text/>
            //     <Text>Main Page</Text>
            //     <Text/>
            //     <Text/>
            //     <Text>steam_id: {auth?.steam_id}</Text>
            // </View>
            // <Settings.Provider initialState={me.data}>
            //     <SettingsDisplay />
            //     <Settings.Provider initialState={{ steam_id: 'abc' } as ISettings}>
            //         <View>
            //             <View>
            //                 <SettingsDisplay />
            //             </View>
            //         </View>
            //     </Settings.Provider>
            // </Settings.Provider>


            <Tab.Navigator swipeEnabled={false} lazy={true}>
                <Tab.Screen name="MainHome" options={{title: 'Profile'}} component={MainHome}/>
                <Tab.Screen name="MainMatches" options={{title: 'Matches'}} component={MainMatches}/>
                <Tab.Screen name="MainFollowing" options={{title: 'Following'}} component={MainFollowing}/>
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
