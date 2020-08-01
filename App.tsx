import 'react-native-gesture-handler';
import {DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, NavigationContainer, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import MainPage from './src/view/main.page';
import {
    AsyncStorage, BackHandler,
    Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, YellowBox
} from 'react-native';
import Search from './src/view/components/search';
import {createStackNavigator, StackNavigationProp, TransitionPresets} from '@react-navigation/stack';
import Header from './src/view/components/header';
import {composeUserId, parseUserId, UserId} from './src/helper/user';
import UserPage from './src/view/user.page';
import {useApi} from './src/hooks/use-api';
import {
    loadConfigFromStorage, loadFollowingFromStorage, loadPrefsFromStorage, loadSettingsFromStorage
} from './src/service/storage';
import AboutPage from './src/view/about.page';
import store from './src/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {
    DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme, Provider as PaperProvider, Portal
} from 'react-native-paper';
import {useSelector} from './src/redux/reducer';
import SearchPage from './src/view/search.page';
import PrivacyPage from './src/view/privacy.page';
import {AppLoading} from "expo";
import Icon5 from 'react-native-vector-icons/FontAwesome5';
// import {Tester, TestHookStore} from "cavy";
import ExampleSpec from './src/ci/exampleSpec';
import LeaderboardPage, {leaderboardMenu, LeaderboardTitle} from "./src/view/leaderboard.page";
import GuidePage from "./src/view/guide.page";
import CivPage, {CivTitle, civTitle} from "./src/view/civ.page";
import {Civ} from "./src/helper/civs";
import UnitPage, {UnitTitle, unitTitle} from "./src/view/unit/unit.page";
import {Unit} from "./src/helper/units";
import {navigationRef} from "./src/service/navigation";
import Footer from "./src/view/components/footer";
import {Tech} from "./src/helper/techs";
import TechPage, {techTitle, TechTitle} from "./src/view/tech/tech.page";
import FeedPage, {feedMenu, feedTitle} from "./src/view/feed.page";
import {MyText} from "./src/view/components/my-text";
import UpdateSnackbar from "./src/view/components/update-snackbar";
import {ITheme, makeVariants, useTheme} from "./src/theming";
import SettingsPage from "./src/view/settings.page";
import {appVariants} from "./src/styles";
import {AppearanceProvider, useColorScheme} from "react-native-appearance";
import {NavigationState} from "@react-navigation/routers";
import ChangelogPage from "./src/view/changelog.page";
import ChangelogSnackbar from "./src/view/components/changelog-snackbar";
import {Building} from "./src/helper/buildings";
import BuildingPage, {BuildingTitle, buildingTitle} from "./src/view/building/building.page";
import LivePage from "./src/view/live.page";

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
        Changelog: {
            path: 'changelog',
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
    Live: undefined;
    Welcome: undefined;
    Privacy: undefined;
    About: undefined;
    Changelog: { changelogLastVersionRead?: string };
    Settings: undefined;
    Main: undefined;
    Feed: { action?: string };
    Leaderboard: undefined;
    Civ: { civ: Civ };
    Unit: { unit: Unit };
    Building: { building: Building };
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
    const appStyles = useTheme(appVariants);
    return (
        <TouchableOpacity onPress={() => Linking.openURL('https://buildorderguide.com')}>
            <MyText style={appStyles.link}>buildorderguide.com</MyText>
        </TouchableOpacity>
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
    const styles = useTheme(variants);

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

    return (
        <SafeAreaView style={styles.container}>

            <Portal>
                <UpdateSnackbar/>
                <ChangelogSnackbar/>
            </Portal>

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
                    name="Changelog"
                    component={ChangelogPage}
                    options={{
                        title: 'Changelog',
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
                    name="Live"
                    component={LivePage}
                    options={{
                        title: 'Lobbies',
                    }}
                />
                <Stack.Screen
                    name="Leaderboard"
                    component={LeaderboardPage}
                    options={props => ({
                        title: 'Leaderboard',
                        headerRight: leaderboardMenu(props),
                        headerTitle: titleProps => <LeaderboardTitle {...props} titleProps={titleProps} />,
                    })}
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
                    name="Building"
                    component={BuildingPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params?.building,
                        title: buildingTitle(props),
                        headerTitle: titleProps => <BuildingTitle {...props} titleProps={titleProps} />,
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
                    name="Settings"
                    component={SettingsPage}
                    options={{
                        title: 'Settings',
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

// const testHookStore: TestHookStore | null = null;
// const testHookStore = new TestHookStore();

// function ConditionalTester({children}: any) {
//     if (testHookStore && __DEV__) {
//         return (
//             <Tester clearAsyncStorage={false} waitTime={1000} specs={[ExampleSpec]} store={testHookStore}>
//                 {children}
//             </Tester>
//         );
//     }
//     return children;
// }

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

const customDarkPaperTheme = {
    ...PaperDarkTheme,
    colors: {
        ...PaperDarkTheme.colors,
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

const customDarkNavigationTheme = {
    ...NavigationDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        background: 'rgb(1,1,1)',
    },
};



export function AppWrapper() {
    // AsyncStorage.removeItem('prefs');
    // AsyncStorage.removeItem('settings');
    // AsyncStorage.removeItem('following');

    console.log(' ');
    console.log(' ');

    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);
    const prefs = useSelector(state => state.prefs);
    const config = useSelector(state => state.config);
    const darkMode = useSelector(state => state.config?.darkMode);
    const colorScheme = useColorScheme();

    // Trigger loading of auth and following
    const _auth = useApi({}, [auth], state => state.auth, (state, value) => state.auth = value, () => loadSettingsFromStorage());
    const _following = useApi({}, [following], state => state.following, (state, value) => state.following = value, () => loadFollowingFromStorage());
    const _prefs = useApi({}, [prefs], state => state.prefs, (state, value) => state.prefs = value, () => loadPrefsFromStorage());
    const _config = useApi({}, [config], state => state.config, (state, value) => state.config = value, () => loadConfigFromStorage());

    if (auth === undefined || following === undefined || config === undefined || prefs === undefined) {
        return <AppLoading/>;
    }

    const finalDarkMode = darkMode === "system" && (colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : darkMode;

    // console.log('Dark mode', darkMode);
    // console.log('Appearance mode', colorScheme);
    // console.log('Final mode', finalDarkMode);

    return (
        <NavigationContainer ref={navigationRef}
                             theme={finalDarkMode === 'light' ? customNavigationTheme : customDarkNavigationTheme}
                             linking={linking}
        >
            {/*<ConditionalTester>*/}
                <PaperProvider
                    theme={finalDarkMode === 'light' ? customPaperTheme : customDarkPaperTheme}
                    settings={{
                        icon: props => <Icon5 {...props} />,
                    }}
                >
                    <StatusBar barStyle={finalDarkMode === 'light' ? 'dark-content' : 'light-content'} backgroundColor="transparent" translucent={true} />
                    {/*<StatusBar barStyle={finalDarkMode === 'light' ? 'dark-content' : 'light-content'} backgroundColor="transparent" translucent={true} />*/}
                    {/*<StatusBar barStyle="dark-content" backgroundColor="white" />*/}
                    {/*<StatusBar barStyle="light-content" backgroundColor="transparent" />*/}
                    <InnerApp/>
                </PaperProvider>
            {/*</ConditionalTester>*/}
        </NavigationContainer>
    );
}



export default function App() {

    // Prevent closing of app when back button is tapped.
    // View navigation using back button is still possible.
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true);
    }, []);

    return (
        <AppearanceProvider>
          <ReduxProvider store={store}>
                <AppWrapper/>
            </ReduxProvider>
        </AppearanceProvider>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            // backgroundColor: '#397AF9',
            backgroundColor: theme.backgroundColor,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            flex: 1,
        },
    });
};

const variants = makeVariants(getStyles);
