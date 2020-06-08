import 'react-native-gesture-handler';
import { Link, NavigationContainer, useLinkTo } from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import { Button, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, YellowBox } from 'react-native';
import NamePage from './src/view/name.page';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Header from './src/view/header';
import Constants from 'expo-constants';
import { parseUserId, printUserId } from './src/service/user';
import { FontAwesome } from '@expo/vector-icons';

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
        Name: {
            path: 'name',
        },
        Main: {
            path: 'main',
        },
    },
};

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 60;

export function Menu() {
    const linkTo = useLinkTo();

    return (
            <View style={styles.menu}>
                <TouchableOpacity onPress={() => linkTo('/name')}>
                    <FontAwesome style={styles.menuButton} name="search" size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => linkTo('/main')}>
                    <FontAwesome style={styles.menuButton} name="user" size={18} />
                </TouchableOpacity>
            </View>
    );
}

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
                                    headerRight: () => (
                                            <Menu />
                                            // <Button title="asd" onPress={() => alert('This is a button!')}><FontAwesome name="search" size={18} /></Button>

                                            // <FontAwesome.Button name="facebook"  onPress={() => alert('This is a button!')}>
                                            // </FontAwesome.Button>
                                            // <Icon name="rocket" size={30} color="#900" />
                                            // <Button
                                            //         onPress={() => alert('This is a button!')}
                                            //         title="Info"
                                            //         // color="#fff"
                                            // />
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
                                    title: 'Search',
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
    menu: {
        flexDirection: 'row',
    },
    menuButton: {
        marginRight: 20,
    }
});
