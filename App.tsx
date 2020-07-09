import 'react-native-gesture-handler';
import {DefaultTheme as NavigationDefaultTheme, NavigationContainer, useNavigation} from '@react-navigation/native';
import React from 'react';
import MainPage from './src/view/main.page';
import {
    Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, YellowBox
} from 'react-native';
import Search from './src/view/components/search';
import {createStackNavigator, StackNavigationProp, TransitionPresets} from '@react-navigation/stack';
import Header from './src/view/components/header';
import {composeUserId, parseUserId, UserId} from './src/helper/user';
import UserPage from './src/view/user.page';
import {useApi} from './src/hooks/use-api';
import {loadFollowingFromStorage, loadSettingsFromStorage} from './src/service/storage';
import AboutPage from './src/view/about.page';
import store from './src/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme, Provider as PaperProvider} from 'react-native-paper';
import {useSelector} from './src/redux/reducer';
import SearchPage from './src/view/search.page';
import PrivacyPage from './src/view/privacy.page';
import {AppLoading} from "expo";
import {Tester, TestHookStore} from "cavy";
import ExampleSpec from './src/ci/exampleSpec';
import LeaderboardPage from "./src/view/leaderboard.page";
import GuidePage from "./src/view/guide.page";
import CivPage, {CivTitle, civTitle} from "./src/view/civ.page";
import {Civ} from "./src/helper/civs";
import UnitPage, {UnitTitle, unitTitle} from "./src/view/unit/unit.page";
import {Unit} from "./src/helper/units";
import {navigationRef} from "./src/service/navigation";
import Footer from "./src/view/components/footer";
import {Tech} from "./src/helper/techs";
import TechPage, {techTitle, TechTitle} from "./src/view/tech/tech.page";
import FeedPage from "./src/view/feed.page";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {appStyles} from "./src/view/styles";
import {MyText} from "./src/view/components/my-text";

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
            <MyText style={appStyles.link}>buildorderguide.com</MyText>
        </TouchableOpacity>
    );
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

    // AsyncStorage.removeItem('settings');
    // AsyncStorage.removeItem('following');

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
                    name="Feed"
                    component={FeedPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.action,
                        title: feedTitle(props),
                        headerRight: feedMenu(props),
                    })}
                />
                <Stack.Screen
                    name="Main"
                    component={MainPage}
                    options={{
                        title: 'Me',
                    }}
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
                        headerTitle: titleProps => <TechTitle {...props} titleProps={titleProps} />,
                    })}
                />
                <Stack.Screen
                    name="Unit"
                    component={UnitPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.unit,
                        title: unitTitle(props),
                        headerTitle: titleProps => <UnitTitle {...props} titleProps={titleProps} />,
                    })}
                />
                <Stack.Screen
                    name="Civ"
                    component={CivPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.civ,
                        title: civTitle(props),
                        headerTitle: titleProps => <CivTitle {...props} titleProps={titleProps} />,
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

// const customPaperTheme = {
//     ...PaperDarkTheme,
//     colors: {
//         ...PaperDarkTheme.colors,
//         // primary: '#3498db',
//     },
// };

const customPaperTheme = {
    ...PaperDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: '#3498db',
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
    menu: {
        flexDirection: 'row',
    },
    menuButton: {
        marginRight: 20,
    },
});
