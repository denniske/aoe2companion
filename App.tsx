// const whyDidYouRender = require('@welldone-software/why-did-you-render');
// whyDidYouRender(React, {
//     trackHooks: true,
//     // trackAllPureComponents: true,
// });

import 'react-native-gesture-handler';
import {DefaultTheme as NavigationDefaultTheme, NavigationContainer, useLinkTo, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import MainPage from './src/view/main.page';
import {
    Image, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, YellowBox
} from 'react-native';
import Search from './src/view/components/search';
import {
    createStackNavigator, StackNavigationProp, TransitionPresets
} from '@react-navigation/stack';
import Header from './src/view/components/header';
import {composeUserId, parseUserId, UserId} from './src/helper/user';
import UserPage from './src/view/user.page';
import {useApi} from './src/hooks/use-api';
import {loadFollowingFromStorage, loadSettingsFromStorage} from './src/service/storage';
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
import {civs, getCivIconByIndex, Civ, getCivIcon, civList} from "./src/helper/civs";
import UnitPage from "./src/view/unit.page";
import {getUnitLineIcon, getUnitLineName, Unit} from "./src/helper/units";
import {navigationRef} from "./src/service/navigation";
import Footer from "./src/view/components/footer";
import {getTechIcon, getTechName, Tech} from "./src/helper/techs";
import TechPage from "./src/view/tech.page";
import { Asset } from 'expo-asset';
import FeedPage from "./src/view/feed.page";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
        Feed: {
            path: 'feed',
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
    Feed: { action?: string };
    Leaderboard: undefined;
    Civ: { civ: Civ };
    Unit: { unit: Unit };
    Tech: { tech: Tech };
    Guide: undefined;
    User: { id: UserId, name: string };
    Search: { name?: string };
};

export type RootTabParamList = {
    MainHome: undefined;
    MainMatches: undefined;
};

export type RootStackProp = StackNavigationProp<RootStackParamList, 'Main'>;


const Stack = createStackNavigator<RootStackParamList>();

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
                <Image style={styles.icon} source={getCivIconByIndex(civs.indexOf(props.route?.params?.civ))}/>
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

function feedTitle(props: any) {
    switch (props.route?.params?.action) {
        case 'add':
            return 'Follow Player';
        case 'config':
            return 'Manage Follows';
        default:
            return 'Following';
    }
}

function feedMenu(props: any) {
    return () => {
        if (props.route?.params?.action) {
            return <View/>;
        }
        return <FeedMenu/>;
    }
}

export function FeedMenu() {
    const navigation = useNavigation<RootStackProp>();
    return (
        <View style={styles.menu}>
            <TouchableOpacity onPress={() => navigation.push('Feed', { action: 'add' })}>
                <FontAwesomeIcon style={styles.menuButton} name="plus" size={18} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Feed', { action: 'config' })}>
                <FontAwesomeIcon style={styles.menuButton} name="cog" size={18} />
            </TouchableOpacity>
        </View>
    );
}

// function cacheImages(images: (string | number)[]) {
//     return images.map(image => {
//         if (typeof image === 'string') {
//             console.log("prefetch", image);
//             return Image.prefetch(image);
//         } else {
//             console.log("fromModule", image);
//             return Asset.fromModule(image).downloadAsync();
//         }
//     });
// }

export function InnerApp() {
    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);

    // Trigger loading of auth and following
    const me = useApi([], state => state.auth, (state, value) => state.auth = value, () => loadSettingsFromStorage());
    const meFollowing = useApi([], state => state.following, (state, value) => state.following = value, () => loadFollowingFromStorage());

    // let [fontsLoaded] = useFonts({
    //     Roboto: Roboto_400Regular,
    // });

    // console.log("==> APP PAGE me.loading =", me.loading, ', data =', me.data); //, ', fontsLoaded =', fontsLoaded);

    // if (!fontsLoaded) {
    //     return <AppLoading />;
    // }

    // const [ready, setReady] = useState(false);
    // const loadAssets = async () => {
    //     const imageAssets = cacheImages([...civList]);
    //     await Promise.all([...imageAssets]);
    //     const fontAssets = cacheFonts([FontAwesome.font]);
    //     await Promise.all([...imageAssets, ...fontAssets]);
    // }

    // if (auth === undefined || !ready) {
    //     return (
    //         <AppLoading
    //             startAsync={loadAssets}
    //             onFinish={() => {
    //                 console.log("READY TRUE");
    //                 setReady(true);
    //             }}
    //             onError={console.warn}
    //         />
    //     );
    // }

    if (auth === undefined || following === undefined) {
        return <AppLoading/>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header/>
            <Stack.Navigator screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                headerStatusBarHeight: 0,
                animationEnabled: false,
            }}>
                <Stack.Screen
                    name="Main"
                    component={MainPage}
                    options={{
                        title: 'Me',
                    }}
                />
                <Stack.Screen
                    name="Feed"
                    component={FeedPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.action,
                        title: feedTitle(props),
                        headerRight: feedMenu(props),
                    })}
                />
                <Stack.Screen
                    name="Leaderboard"
                    component={LeaderboardPage}
                    options={{
                        title: 'Leaderboard',
                    }}
                />
                <Stack.Screen
                    name="Tech"
                    component={TechPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.tech,
                        title: techTitle(props),
                        headerTitle: titleProps => <TechTitle {...props} />,
                    })}
                />
                <Stack.Screen
                    name="Unit"
                    component={UnitPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.unit,
                        title: unitTitle(props),
                        headerTitle: titleProps => <UnitTitle {...props} />,
                    })}
                />
                <Stack.Screen
                    name="Civ"
                    component={CivPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.civ,
                        title: civTitle(props),
                        headerTitle: titleProps => <CivTitle {...props} />,
                    })}
                />
                <Stack.Screen
                    name="Guide"
                    component={GuidePage}
                    options={{
                        animationEnabled: false,
                        headerTitle: props => <LinkTitle {...props} />,
                    }}
                />
                <Stack.Screen
                    name="User"
                    component={UserPage}
                    options={({route}) => ({
                        animationEnabled: true,
                        title: route.params.name,
                    })}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchPage}
                    options={{
                        title: 'Search',
                    }}
                />
                <Stack.Screen
                    name="About"
                    component={AboutPage}
                    options={{
                        title: 'About',
                    }}
                />
                <Stack.Screen
                    name="Privacy"
                    component={PrivacyPage}
                    options={{
                        title: 'Privacy',
                    }}
                />
            </Stack.Navigator>
            <Footer/>
        </SafeAreaView>
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
    container: {
        // backgroundColor: '#397AF9',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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

    menu: {
        flexDirection: 'row',
    },
    menuButton: {
        marginRight: 20,
    }
});
