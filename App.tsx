// const whyDidYouRender = require('@welldone-software/why-did-you-render');
// whyDidYouRender(React, {
//     trackHooks: true,
//     // trackAllPureComponents: true,
// });

import 'react-native-gesture-handler';
import {DefaultTheme as NavigationDefaultTheme, NavigationContainer} from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import {Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View, YellowBox} from 'react-native';
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
import {DefaultTheme as PaperDefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {useSelector} from './src/redux/reducer';
import SearchPage from './src/view/search.page';
import PrivacyPage from './src/view/privacy.page';
import {AppLoading} from "expo";
import {Tester, TestHookStore} from "cavy";
import ExampleSpec from './src/ci/exampleSpec';
import LeaderboardPage from "./src/view/leaderboard.page";
import GuidePage from "./src/view/guide.page";
import CivPage from "./src/view/civ.page";
import {civs, getCivIcon} from "./src/helper/civs";

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
        Leaderboard: {
            path: 'leaderboard',
        },
        Civ: {
            path: 'civ/:civ',
        },
    },
};

export type RootStackParamList = {
    Welcome: undefined;
    Privacy: undefined;
    About: undefined;
    Main: undefined;
    Leaderboard: undefined;
    Civ: { civ: string };
    Guide: undefined;
    User: { id: UserId, name: string };
    Search: { name: string };
};

export type RootStackProp = StackNavigationProp<RootStackParamList, 'Main'>;

const Stack = createStackNavigator<RootStackParamList>();

const headerStatusBarHeight = 30 + Constants.statusBarHeight;

// export function Menu() {
//     const linkTo = useLinkTo();
//     return (
//         <View style={styles.menu}>
//             {/*<TouchableOpacity onPress={() => linkTo('/search')}>*/}
//             {/*    <FontAwesome style={styles.menuButton} name="search" size={18} />*/}
//             {/*</TouchableOpacity>*/}
//         </View>
//     );
// }

function LinkTitle(props: any) {
    return (
        <TouchableOpacity onPress={() => Linking.openURL('https://buildorderguide.com')}>
            <Text style={styles.link}>buildorderguide.com</Text>
        </TouchableOpacity>
    );
}

function CivTitle(props: any) {
    if (props.route?.params?.civ) {
        return (
            <View style={styles.civRow}>
                <Image style={styles.icon} source={getCivIcon(civs.indexOf(props.route?.params?.civ))}/>
                <Text style={styles.title}>{props.route.params?.civ}</Text>
            </View>
        );
    }
    return <Text style={styles.title}>Civs</Text>
}

export function InnerApp() {
    const auth = useSelector(state => state.auth);

    // Trigger loading of auth
    const me = useApi([], state => state.auth, (state, value) => state.auth = value, () => loadSettingsFromStorage());

    // let [fontsLoaded] = useFonts({
    //     Roboto: Roboto_400Regular,
    // });

    // console.log("==> APP PAGE me.loading =", me.loading, ', data =', me.data); //, ', fontsLoaded =', fontsLoaded);

    // if (!fontsLoaded) {
    //     return <AppLoading />;
    // }

    if (auth === undefined) {
        return <AppLoading/>;
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
                    title: 'Me',
                    headerStatusBarHeight: headerStatusBarHeight,
                    headerBackground: () => (
                        <HeaderBackground><Header/></HeaderBackground>
                    ),
                }}
            />
            <Stack.Screen
                name="Leaderboard"
                component={LeaderboardPage}
                options={{
                    title: 'Leaderboard',
                    headerStatusBarHeight: headerStatusBarHeight,
                    headerBackground: () => (
                        <HeaderBackground><Header/></HeaderBackground>
                    ),
                }}
            />
            <Stack.Screen
                name="Civ"
                component={CivPage}
                options={props => ({
                    headerTitle: props2 => <CivTitle {...props} />,
                    // title: props.route.params?.civ || 'Civs',
                    headerStatusBarHeight: headerStatusBarHeight,
                    headerBackground: () => (
                        <HeaderBackground><Header/></HeaderBackground>
                    ),
                })}
            />
            <Stack.Screen
                name="Guide"
                component={GuidePage}
                options={{
                    headerTitle: props => <LinkTitle {...props} />,
                    headerStatusBarHeight: headerStatusBarHeight,
                    headerBackground: () => (
                        <HeaderBackground><Header/></HeaderBackground>
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

const testHookStore: TestHookStore | null = null;
// const testHookStore = new TestHookStore();

function ConditionalTester({children}: any) {
    if (testHookStore && __DEV__) {
        return (
            <Tester clearAsyncStorage={false} waitTime={1000} specs={[ExampleSpec]} store={testHookStore}>
                {children}
            </Tester>
        );
    }
    return children;
}

const customPaperTheme = {
    ...PaperDefaultTheme,
    // roundness: 2,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: '#3498db',
        // accent: '#f1c40f',
    },
};

const customNavigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        background: 'white'
    },
};

export default function App() {
    return (
        <NavigationContainer theme={customNavigationTheme} linking={linking}>
            <ConditionalTester>
                <ReduxProvider store={store}>
                    <PaperProvider theme={customPaperTheme}>
                        <InnerApp/>
                    </PaperProvider>
                </ReduxProvider>
            </ConditionalTester>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    link: {
        color: '#397AF9',
    },
    civRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 5,
        width: 30,
        height: 30,
    },

    // From react-navigation HeaderTitle.tsx
    title: Platform.select({
        ios: {
            fontSize: 17,
            fontWeight: '600',
        },
        android: {
            fontSize: 20,
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        default: {
            fontSize: 18,
            fontWeight: '500',
        },
    }),

    // menu: {
    //     flexDirection: 'row',
    // },
    // menuButton: {
    //     marginRight: 20,
    // }
});
