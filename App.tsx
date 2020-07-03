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
import {DefaultTheme as PaperDefaultTheme, IconButton, Provider as PaperProvider} from 'react-native-paper';
import {useSelector} from './src/redux/reducer';
import SearchPage from './src/view/search.page';
import PrivacyPage from './src/view/privacy.page';
import {AppLoading} from "expo";
import {Tester, TestHookStore} from "cavy";
import ExampleSpec from './src/ci/exampleSpec';
import LeaderboardPage from "./src/view/leaderboard.page";
import GuidePage from "./src/view/guide.page";
import CivPage from "./src/view/civ.page";
import {civs, getCivIcon, Civ} from "./src/helper/civs";
import UnitPage from "./src/view/unit.page";
import {getUnitLineIcon, getUnitLineName} from "./src/helper/units";

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
        Unit: {
            path: 'unit/:unit',
        },
        Tech: {
            path: 'tech/:tech',
        },
    },
};

export type RootStackParamList = {
    Welcome: undefined;
    Privacy: undefined;
    About: undefined;
    Main: undefined;
    Leaderboard: undefined;
    Civ: { civ: Civ };
    Unit: { unit: string };
    Tech: { tech: string };
    Guide: undefined;
    User: { id: UserId, name: string };
    Search: { name?: string };
};

export type RootTabParamList = {
    MainHome: undefined;
    MainMatches: undefined;
};

export type RootStackProp = StackNavigationProp<RootStackParamList, 'Main'>;

import {navigationRef} from "./src/service/navigation";
import Header2 from "./src/view/components/header2";
import {getTechIcon, getTechName} from "./src/helper/techs";
import TechPage from "./src/view/tech.page";

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

function civTitle(props: any) {
    return props.route?.params?.civ || 'Civs';
}

function UnitTitle(props: any) {
    if (props.route?.params?.unit) {
        return (
            <View style={styles.civRow}>
                <Image style={styles.icon} source={getUnitLineIcon(props.route?.params?.unit)}/>
                <Text style={styles.title}>{getUnitLineName(props.route.params?.unit)}</Text>
            </View>
        );
    }
    return <Text style={styles.title}>Units</Text>
}

function unitTitle(props: any) {
    return props.route?.params?.unit || 'Units';
}

function TechTitle(props: any) {
    if (props.route?.params?.tech) {
        return (
            <View style={styles.civRow}>
                <Image style={styles.icon} source={getTechIcon(props.route?.params?.tech)}/>
                <Text style={styles.title}>{getTechName(props.route.params?.tech)}</Text>
            </View>
        );
    }
    return <Text style={styles.title}>Techs</Text>
}

function techTitle(props: any) {
    return props.route?.params?.tech || 'Techs';
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

        // <Tab.Navigator lazy={true}>
        //     <Tab.Screen
        //     name="Main"
        //     component={MainPage}
        //     options={{
        //         title: 'Me',
        //         tabBarIcon: ({size, color}) => (<Icon name="user" color={color} size={size}/>)
        //         // headerStatusBarHeight: headerStatusBarHeight,
        //         // headerBackground: () => (
        //         //     <HeaderBackground><Header/></HeaderBackground>
        //         // ),
        //     }}
        // />
        //     <Tab.Screen
        //         name="Leaderboard"
        //         component={LeaderboardPage}
        //         options={{
        //             title: 'Leaderboard',
        //             tabBarIcon: ({size, color}) => (<Icon name="trophy" color={color} size={size}/>)
        //
        //             // headerStatusBarHeight: headerStatusBarHeight,
        //             // headerBackground: () => (
        //             //     <HeaderBackground><Header/></HeaderBackground>
        //             // ),
        //         }}
        //     />
        // </Tab.Navigator>

        <View style={styles.box}>
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
                name="Tech"
                component={TechPage}
                options={props => ({
                    title: techTitle(props),
                    headerTitle: titleProps => <TechTitle {...props} />,
                    headerStatusBarHeight: headerStatusBarHeight,
                    headerBackground: () => (
                        <HeaderBackground><Header/></HeaderBackground>
                    ),
                })}
            />
            <Stack.Screen
                name="Unit"
                component={UnitPage}
                options={props => ({
                    title: unitTitle(props),
                    headerTitle: titleProps => <UnitTitle {...props} />,
                    headerStatusBarHeight: headerStatusBarHeight,
                    headerBackground: () => (
                        <HeaderBackground><Header/></HeaderBackground>
                    ),
                })}
            />
            <Stack.Screen
                name="Civ"
                component={CivPage}
                options={props => ({
                    title: civTitle(props),
                    headerTitle: titleProps => <CivTitle {...props} />,
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
            <Header2/>
        </View>
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
        <NavigationContainer ref={navigationRef} theme={customNavigationTheme} linking={linking}>
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
    box: {
        // backgroundColor: '#397AF9',
        // height: '100%',
        flex: 1,
    },
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
