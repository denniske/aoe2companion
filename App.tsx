// const whyDidYouRender = require('@welldone-software/why-did-you-render');
// whyDidYouRender(React, {
//     trackHooks: true,
//     // trackAllPureComponents: true,
// });

import 'react-native-gesture-handler';
import {NavigationContainer, useLinkTo} from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import {StyleSheet, View, YellowBox} from 'react-native';
import Search from './src/view/components/search';
import {createStackNavigator, HeaderBackground, StackNavigationProp} from '@react-navigation/stack';
import Header from './src/view/components/header';
import Constants from 'expo-constants';
import {composeUserId, parseUserId, UserId} from './src/helper/user';
import UserPage from './src/view/user.page';
import {useApi} from './src/hooks/use-api';
import {loadSettingsFromStorage} from './src/service/storage';
import AboutPage from './src/view/about.page';
import store from './src/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {useSelector} from './src/redux/reducer';
import SearchPage from './src/view/search.page';
import PrivacyPage from './src/view/privacy.page';
import {AppLoading} from "expo";

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
        About: {
            path: 'about',
        },
        Privacy: {
            path: 'privacy',
        },
        Welcome: {
            path: 'welcome',
        },
    },
};

export type RootStackParamList = {
    Welcome: undefined;
    Privacy: undefined;
    About: undefined;
    Main: undefined;
    User: { id: UserId, name: string };
    Search: { name: string };
};

export type RootStackProp = StackNavigationProp<RootStackParamList, 'Main'>;

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 60;

export function Menu() {
    const linkTo = useLinkTo();
    return (
            <View style={styles.menu}>
                {/*<TouchableOpacity onPress={() => linkTo('/search')}>*/}
                {/*    <FontAwesome style={styles.menuButton} name="search" size={18} />*/}
                {/*</TouchableOpacity>*/}
            </View>
    );
}

export default function App() {
    return (
            <ReduxProvider store={store}>
                    <NavigationContainer linking={linking}>
                        <PaperProvider theme={DefaultTheme}>
                        <App2/>
                        </PaperProvider>
                    </NavigationContainer>
            </ReduxProvider>
    );
}

export function App2() {
    const auth = useSelector(state => state.auth);
    const me = useApi([], state => state.auth, (state, value) => state.auth = value, () => loadSettingsFromStorage());

    // let [fontsLoaded] = useFonts({
    //     Roboto: Roboto_400Regular,
    // });

    console.log("==> APP PAGE me.loading =", me.loading, ', data =', me.data); //, ', fontsLoaded =', fontsLoaded);

    // if (!fontsLoaded) {
    //     return <AppLoading />;
    // }

    if (auth === undefined) {
        return <AppLoading />;
    }

    return (
            <Stack.Navigator screenOptions={{animationEnabled: false}}>
                {/*<Stack.Screen*/}
                {/*        name="Welcome"*/}
                {/*        component={WelcomePage}*/}
                {/*        options={{*/}
                {/*            title: '',*/}
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
                            title: 'Me',//(!auth || userIdEmpty(auth)) ? 'Welcome' : 'Me',
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
                <Stack.Screen
                        name="About"
                        component={AboutPage}
                        options={{
                            title: 'About',
                            headerStatusBarHeight: headerStatusBarHeight,
                            headerBackground: () => (
                                    <HeaderBackground><Header/></HeaderBackground>
                            ),
                        }}
                />
                <Stack.Screen
                        name="Privacy"
                        component={PrivacyPage}
                        options={{
                            title: 'Privacy',
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
