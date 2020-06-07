import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import { Button, Image, StyleSheet, Text, View, YellowBox } from 'react-native';
import NamePage from './src/view/name.page';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Header from './src/view/header';
import Constants from 'expo-constants';
import { parseUserId, printUserId } from './src/service/user';

YellowBox.ignoreWarnings(['Remote debugger']);

export type RootStackParamList = {
    Main: undefined;
    Profile: { steam_id: string, name: string };
    Name: { name: string };
};

const linking = {
    prefixes: ['https://aoe2companion.com', 'aoe2companion://'],
    config: {
        Profile: {
            path: 'profile/:id/:name',
            parse: {
                id: parseUserId,
                name: String,
            },
            stringify: {
                id: printUserId,
            },
        },
    },
};

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 60;

export default function App() {
    return (
            <PaperProvider>
                <NavigationContainer linking={linking}>
                    <Stack.Navigator screenOptions={{animationEnabled: false}}>
                        <Stack.Screen
                                name="Main"
                                component={MainPage}
                                options={{
                                    title: 'Me',
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                }}
                        />
                        <Stack.Screen
                                name="Profile"
                                component={NamePage}
                                options={({route}) => ({
                                    title: route.params.name,
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                })}
                        />
                        <Stack.Screen
                                name="Name"
                                component={NamePage}
                                options={{
                                    headerStatusBarHeight: headerStatusBarHeight,
                                    headerBackground: () => (
                                            <HeaderBackground><Header/></HeaderBackground>
                                    ),
                                }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
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
});
