
// const whyDidYouRender = require('@welldone-software/why-did-you-render');
// whyDidYouRender(React, {
//     trackHooks: true,
//     // trackAllPureComponents: true,
// });

import 'react-native-gesture-handler';
import { Link, NavigationContainer, useLinkTo } from '@react-navigation/native';
import React, { useState } from 'react';
import MainPage from './src/view/main.page';
import { Alert, Button, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, YellowBox } from 'react-native';
import SearchPage from './src/view/search.page';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Header from './src/view/header';
import Constants from 'expo-constants';
import { parseUserId, composeUserId, UserId } from './src/helper/user';
import { FontAwesome } from '@expo/vector-icons';
import UserPage from './src/view/user.page';
import AsyncStorage from '@react-native-community/async-storage';
import { useApi } from './src/hooks/use-api';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ISettings, loadSettingsFromStorage } from './src/service/storage';
import SplashPage from './src/view/splash.page';
import { NativeModules } from 'react-native';
import store from './src/redux/store';
import { Provider } from 'react-redux';
import { useSelector } from './src/redux/reducer';

YellowBox.ignoreWarnings(['Remote debugger']);

const linking = {
    prefixes: ['https://aoe2companion.com', 'aoe2companion://'],
    config: {
        User: {
            path: 'user/:id/:name',
            parse: {
                id: parseUserId,
                name: String,
            },
            stringify: {
                id: composeUserId,
            },
        },
        Search: {
            path: 'search',
        },
        Main: {
            path: 'main',
        },
    },
};

export type RootStackParamList = {
    Splash: undefined;
    Main: undefined;
    User: { id: UserId, name: string };
    Search: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 60;

export function Menu() {
    const linkTo = useLinkTo();

    return (
            <View style={styles.menu}>
                {/*<TouchableOpacity onPress={() => linkTo('/search')}>*/}
                {/*    <FontAwesome style={styles.menuButton} name="search" size={18} />*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity onPress={() => linkTo('/main')}>*/}
                {/*    <FontAwesome style={styles.menuButton} name="user" size={18} />*/}
                {/*</TouchableOpacity>*/}
            </View>
    );
}

export default function App() {
    return (
            <Provider store={store}>
                <NavigationContainer linking={linking}>
                    <App2/>
                </NavigationContainer>
            </Provider>
    );
}

export function App2() {
    const auth = useSelector(state => state.auth);
    const me = useApi([], state => state.auth, (state, value) => state.auth = value, () => loadSettingsFromStorage());

    console.log("==> APP PAGE me.loading =", me.loading, ', data =', me.data);

    if (auth === undefined) {
        return (
                <View>
                    <Text/>
                    <Text/>
                    <Text>loading auth</Text>
                </View>
        );
    }

    return (
            <Stack.Navigator screenOptions={{animationEnabled: false}}>
                {/*<Stack.Screen*/}
                {/*        name="Splash"*/}
                {/*        component={SplashPage}*/}
                {/*        options={{*/}
                {/*            title: 'Splash',*/}
                {/*            headerStatusBarHeight: headerStatusBarHeight,*/}
                {/*            headerBackground: () => (*/}
                {/*                    <HeaderBackground><Header/></HeaderBackground>*/}
                {/*            ),*/}
                {/*        }}*/}
                {/*/>*/}
                <Stack.Screen
                        name="Main"
                        component={MainPage}
                        options={{
                            title: 'Me',
                            headerStatusBarHeight: headerStatusBarHeight,
                            headerBackground: () => (
                                    <HeaderBackground><Header/></HeaderBackground>
                            ),
                            headerRight: () => (
                                    <Menu/>
                            ),
                        }}
                />
                <Stack.Screen
                        name="User"
                        component={UserPage}
                        options={({route}) => ({
                            title: route.params.name,
                            headerStatusBarHeight: headerStatusBarHeight,
                            headerBackground: () => (
                                    <HeaderBackground><Header/></HeaderBackground>
                            ),
                        })}
                />
                <Stack.Screen
                        name="Search"
                        component={SearchPage}
                        options={{
                            title: 'Search',
                            headerStatusBarHeight: headerStatusBarHeight,
                            headerBackground: () => (
                                    <HeaderBackground><Header/></HeaderBackground>
                            ),
                        }}
                />
            </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    menu: {
        flexDirection: 'row',
    },
    menuButton: {
        marginRight: 20,
    }
});
