import 'react-native-gesture-handler';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    NavigationContainer
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, LogBox, Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme, View} from 'react-native';
import {createStackNavigator, StackNavigationProp, TransitionPresets} from '@react-navigation/stack';
import Header from './src/view/components/header';
import UserPage, {userMenu} from './src/view/user.page';
import {useApi} from './src/hooks/use-api';
import {
    IAccount,
    IConfig,
    loadAccountFromStorage,
    loadConfigFromStorage,
    loadFollowingFromStorage,
    loadPrefsFromStorage,
    loadSettingsFromStorage
} from './src/service/storage';
import AboutPage from './src/view/about.page';
import store from './src/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {
    MD2DarkTheme as PaperDarkTheme,
    MD2LightTheme as PaperDefaultTheme,
    Portal,
    Provider as PaperProvider
} from 'react-native-paper';
import {addLoadedLanguage, useMutate, useSelector} from './src/redux/reducer';
import SearchPage from './src/view/search.page';
import PrivacyPage from './src/view/privacy.page';
import {FontAwesome5} from "@expo/vector-icons";
import LeaderboardPage, {leaderboardMenu, LeaderboardTitle} from "./src/view/leaderboard.page";
import {CivPage, CivTitle, civTitle} from "@nex/app/view";
import {
    Building,
    Civ,
    Environment,
    IHostService,
    IHttpService,
    ITranslationService,
    OS,
    registerService,
    SERVICE_NAME,
    Tech,
    Unit
} from "@nex/data";
import UnitPage, {UnitTitle, unitTitle} from "./src/view/unit/unit.page";
import {navigationRef} from "./src/service/navigation";
import Footer from "./src/view/components/footer";
import TechPage, {techTitle, TechTitle} from "./src/view/tech/tech.page";
import FeedPage, {feedMenu, feedTitle} from "./src/view/feed.page";
import UpdateSnackbar from "./src/view/components/snackbar/update-snackbar";
import {useAppThemeInverted} from "./src/theming";
import SettingsPage from "./src/view/settings.page";
import ChangelogPage from "./src/view/changelog.page";
import ChangelogSnackbar from "./src/view/components/snackbar/changelog-snackbar";
import BuildingPage, {BuildingTitle, buildingTitle} from "./src/view/building/building.page";
import LivePage from "./src/view/live.page";
import PushPage from "./src/view/push.page";
import SplashPage from "./src/view/splash.page";
import ErrorSnackbar from "./src/view/components/snackbar/error-snackbar";
import ErrorPage from "./src/view/error.page";
import WinratesPage, {WinratesTitle} from "./src/view/winrates.page";
import * as Notifications from "expo-notifications";
import * as TaskManager from 'expo-task-manager';
import TipsPage from "./src/view/tips.page";
import initSentry from "./src/helper/sentry";
import * as Device from 'expo-device';
import {LinkingOptions} from "@react-navigation/native/lib/typescript/src/types";
import {createStylesheet} from './src/theming-new';
import {getLanguageFromSystemLocale2, getTranslation} from './src/helper/translate';
import {getInternalAoeString, loadAoeStringsAsync} from './src/helper/translate-data';
import * as Localization from 'expo-localization';
import {getInternalLanguage, setInternalLanguage} from './src/redux/statecache';
import {ConditionalTester} from "./src/view/testing/tester";
import {getElectronPushToken, isElectron} from './src/helper/electron';
import {setAccountPushTokenElectron} from './src/api/following';
import {fetchJson2} from './src/api/util';
import UpdateElectronSnackbar from "./src/view/components/snackbar/update-electron-snackbar";
import OverlaySettingsPage from "./src/view/overlay.settings.page";
// import CurrentMatchSnackbar from "./src/view/components/snackbar/current-match-snackbar";
import {fetchAoeReferenceData} from './src/helper/reference';
import DonationPage from './src/view/donation.page';
import Constants from 'expo-constants';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import BuildPage, { BuildTitle, BuildMenu } from './src/view/build.page';
import OngoingMatchesPage from './src/view/ongoing.page';
import { liveActivity } from './src/service/live-game-activity';


SplashScreen.preventAutoHideAsync();

initSentry();

try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
        handleSuccess: notificationId => console.log('success:' + notificationId),
        handleError: notificationId => console.log('error:' + notificationId),
    });
} catch(e) {

}

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

if (Platform.OS !== 'web') {
    LogBox.ignoreLogs([
        'Native splash screen is already hidden. Call this method before rendering any view.',
        'Your project is accessing the following APIs from a deprecated global rather than a module import: Constants (expo- constants).',
        'Remote debugger',
        'Unable to activate keep awake',
    ]);

    TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
        if (data) {
            const { body } = data as { body: Record<string, any> };
            if (body.finished) {
                liveActivity.list().map((activity) => {
                    if (activity.data.matchId === body.match_id) {
                        liveActivity.end(activity.id);
                    }
                });
            }
        }
    });
}

class HttpService implements IHttpService {
    async fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
        return fetchJson2(title, input, init, reviver);
    }
}

class AoeDataService implements ITranslationService {
    getUiTranslation(str: string): string {
        return getTranslation(str as any);
    }
    getAoeString(str: string): string {
        return getInternalAoeString(str);
    }
    getLanguage(): string {
        return getInternalLanguage();
    }
}

class HostService implements IHostService {
    getPlatform(): OS {
        return Platform.OS;
    }

    getEnvironment(): Environment {
        return __DEV__ ? 'development' : 'production';
    }
}

// console.log('REGISTERING MAIN SERVICES');

registerService(SERVICE_NAME.TRANSLATION_SERVICE, new AoeDataService(), true);
registerService(SERVICE_NAME.HOST_SERVICE, new HostService(), true);
registerService(SERVICE_NAME.HTTP_SERVICE, new HttpService(), true);

const scheme = Constants.expoConfig?.scheme;
const website = Constants.expoConfig?.extra?.website;

const linking: LinkingOptions<any> = {
    prefixes: [`https://${website}`, `${scheme}://`],
    config: {
        screens: {
            User: {
                path: 'user/:profileId',
                parse: {
                    profileId: parseInt,
                },
                stringify: {
                    id: (x: number) => x.toString(),
                },
                screens: {
                    MainProfile: {
                        path: 'profile',
                    },
                    MainStats: {
                        path: 'stats',
                    },
                    MainMatches: {
                        path: 'matches',
                    },
                }
            },
            Settings: {
                path: 'settings',
            },
            Push: {
                path: 'push',
            },
            Search: {
                path: 'search',
            },
            Guide: {
                path: 'guide/:build?',
            },
            Live: {
                path: 'live',
            },
            Ongoing: {
                path: 'ongoing',
            },
            Tips: {
                path: 'tips',
            },
            Main: {
                path: 'main',
                screens: {
                    MainProfile: {
                        path: 'profile',
                    },
                    MainStats: {
                        path: 'stats',
                    },
                    MainMatches: {
                        path: 'matches',
                    },
                }
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
                // Just for debugging in web
                screens: {
                    Leaderboardunranked: {
                        path: 'unranked',
                    },
                    LeaderboardRm1v1: {
                        path: 'rm_1v1',
                    },
                    LeaderboardRmTeam: {
                        path: 'rm_team',
                    },
                    LeaderboardEw1v1: {
                        path: 'ew_1v1',
                    },
                    LeaderboardEwTeam: {
                        path: 'ew_team',
                    },
                    LeaderboardRoR1v1: {
                        path: 'ror_1v1',
                    },
                    LeaderboardRoRTeam: {
                        path: 'ror_team',
                    },

                    LeaderboardRmSolo: {
                        path: 'rm_solo',
                    },
                    // LeaderboardRmTeam: {
                    //     path: 'rm_team',
                    // },
                    // LeaderboardRm1v1: {
                    //     path: 'rm_1v1',
                    // },
                    LeaderboardRm2v2: {
                        path: 'rm_2v2',
                    },
                    LeaderboardRm3v3: {
                        path: 'rm_3v3',
                    },
                    LeaderboardRm4v4: {
                        path: 'rm_4v4',
                    },
                    LeaderboardQm1v1: {
                        path: 'qm_1v1',
                    },
                    LeaderboardQm2v2: {
                        path: 'qm_2v2',
                    },
                    LeaderboardQm3v3: {
                        path: 'qm_3v3',
                    },
                    LeaderboardQm4v4: {
                        path: 'qm_4v4',
                    },
                }
            },
            Civ: {
                path: 'civ/:civ?',
            },
            Building: {
                path: 'building/:building?',
            },
            Unit: {
                path: 'unit/:unit?',
            },
            Tech: {
                path: 'tech/:tech?',
            },
            Winrates: {
                path: 'winrates',
            },
            Overlay: {
                path: 'overlay',
            },
            Query: {
                path: 'query',
            },
            Match: {
                path: 'match/:match_id',
            },
            Intro: {
                path: 'intro/:match_id',
            },
            // Build: {
            //     path: 'build',
            // },
            OverlaySettings: {
                path: 'settings/overlay',
            },
        },
    },
};

export type RootStackParamList = {
    Query: undefined;
    // Build: undefined;
    Match: { match_id: string };
    Intro: { match_id: string };
    Overlay: undefined;
    Error: undefined;
    Donation: { debug?: boolean };
    Splash: undefined;
    Tips: undefined;
    Push: undefined;
    Live: undefined;
    Ongoing: undefined;
    Welcome: undefined;
    Privacy: undefined;
    About: undefined;
    Changelog: { changelogLastVersionRead?: string };
    Settings: undefined;
    Main: undefined;
    Winrates: undefined;
    Feed: { action?: string, match_id?: string };
    Leaderboard: { leaderboardId: number }
    Civ: { civ: Civ };
    Unit: { unit: Unit };
    Building: { building: Building };
    Tech: { tech: Tech };
    Guide: { build?: number | string, focusMode?: boolean };
    User: { profileId: number };
    Search: { name?: string };
    OverlaySettings: { };
};

export type RootTabParamList = {
    MainProfile: { };
    MainStats: { };
    MainMatches: { };
};

export type RootStackProp = StackNavigationProp<RootStackParamList, 'Main'>;

const Stack = createStackNavigator<RootStackParamList>();

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
    const styles = useStyles();
    const theme = useAppThemeInverted();
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const existingStyle = document.getElementById('scrollbar-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'scrollbar-style'
        style.type = 'text/css';
        style.innerHTML = `
                ::-webkit-scrollbar { height: auto; }
                ::-webkit-scrollbar-button { height: 0; }
                ::-webkit-scrollbar-thumb { background-color: ${theme.textNoteColor};}
                ::-webkit-scrollbar-corner { background-color: transparent;}}
                ::-webkit-resizer { background-color: transparent;}`;
        document.getElementsByTagName('head')[0].appendChild(style);
    }, [theme]);

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
        <SafeAreaView style={styles.container} nativeID="container">

            <Portal>
                {/*{*/}
                {/*    isElectron() &&*/}
                {/*    <CurrentMatchSnackbar/>*/}
                {/*}*/}
                {
                    isElectron() &&
                    <UpdateElectronSnackbar/>
                }
                {
                    Platform.OS !== 'web' &&
                    <UpdateSnackbar/>
                }
                {
                    (Platform.OS !== 'web' || isElectron()) &&
                    <ChangelogSnackbar/>
                }
                <ErrorSnackbar/>
            </Portal>

            <Header/>
            <Stack.Navigator screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                headerStatusBarHeight: 0,
                animationEnabled: false,
            }}>

                <Stack.Screen
                    name="User"
                    component={UserPage}
                    options={props => ({
                        animationEnabled: !!props.route?.params,
                        title: ' ',
                        headerRight: userMenu(props),
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

                {/*<Stack.Screen*/}
                {/*    name="Match"*/}
                {/*    component={MatchPage}*/}
                {/*    options={{*/}
                {/*        title: getTranslation('match.title'),*/}
                {/*    }}*/}
                {/*/>*/}

                <Stack.Screen
                    name="Changelog"
                    component={ChangelogPage}
                    options={{
                        title: getTranslation('changelog.title'),
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsPage}
                    options={{
                        title: getTranslation('settings.title'),
                    }}
                />
                <Stack.Screen
                    name="OverlaySettings"
                    component={OverlaySettingsPage}
                    options={{
                        title: getTranslation('overlaysettings.title'),
                    }}
                />

                {/*<Stack.Screen*/}
                {/*    name="Overlay"*/}
                {/*    component={OverlayPage}*/}
                {/*    options={{*/}
                {/*        title: 'Overlay',*/}
                {/*        headerShown: false,*/}
                {/*        cardShadowEnabled: false,*/}
                {/*        cardOverlayEnabled: false,*/}
                {/*        cardStyle: { backgroundColor: 'rgba(0,0,0,0)'}*/}
                {/*    }}*/}
                {/*/>*/}

                <Stack.Screen
                    name="Leaderboard"
                    component={LeaderboardPage}
                    options={props => ({
                        title: getTranslation('leaderboard.title'),
                        headerTitleAlign: 'left',
                        headerRight: leaderboardMenu(),
                        headerTitle: titleProps => <LeaderboardTitle {...props} titleProps={titleProps} />,
                    })}
                />
                <Stack.Screen
                    name="Splash"
                    component={SplashPage}
                    options={{
                        title: '',
                    }}
                />
                <Stack.Screen
                    name="Tips"
                    component={TipsPage}
                    options={{
                        title: getTranslation('tips.title'),
                    }}
                />
                <Stack.Screen
                    name="About"
                    component={AboutPage}
                    options={{
                        title: getTranslation('about.title'),
                    }}
                />
                <Stack.Screen
                    name="Live"
                    component={LivePage}
                    options={{
                        title: getTranslation('lobbies.title'),
                    }}
                />
                <Stack.Screen
                    name="Ongoing"
                    component={OngoingMatchesPage}
                    options={{
                        title: getTranslation('ongoing.title'),
                    }}
                />
                <Stack.Screen
                    name="Push"
                    component={PushPage}
                    options={{
                        title: getTranslation('pushnotifications.title'),
                    }}
                />
                <Stack.Screen
                    name="Error"
                    component={ErrorPage}
                    options={{
                        title: getTranslation('errors.title'),
                    }}
                />
                <Stack.Screen
                    name="Donation"
                    component={DonationPage}
                    options={{
                        title: '',
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
                    component={BuildPage}
                    options={props => ({
                        animationEnabled: false,
                        headerTitleAlign: 'center',
                        headerTitle: titleProps => <BuildTitle {...props} titleProps={titleProps} />,
                        headerRight: () => props.route?.params?.build ? <BuildMenu {...props} /> : null,
                        headerBackTitle: 'Back'
                    })}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchPage}
                    options={{
                        title: getTranslation('search.title'),
                    }}
                />
                <Stack.Screen
                    name="Privacy"
                    component={PrivacyPage}
                    options={{
                        title: getTranslation('privacy.title'),
                    }}
                />
                <Stack.Screen
                    name="Winrates"
                    component={WinratesPage}
                    options={{
                        animationEnabled: false,
                        headerTitle: props => <WinratesTitle {...props} />,
                    }}
                />
            </Stack.Navigator>
            <Footer/>
        </SafeAreaView>
    );
}

// export function InnerAppForIntro() {
//     const styles = useStyles();
//
//     let [fontsLoaded] = useFonts({
//         Roboto: Roboto_700Bold,
//     });
//
//     return (
//         <View style={styles.containerIntro} nativeID="container">
//             <Stack.Navigator screenOptions={{
//                 ...TransitionPresets.SlideFromRightIOS,
//                 headerStatusBarHeight: 0,
//                 animationEnabled: false,
//             }}>
//                 <Stack.Screen
//                     name="Intro"
//                     component={IntroPage}
//                     options={{
//                         title: 'Intro',
//                         headerShown: false,
//                         cardShadowEnabled: false,
//                         cardOverlayEnabled: false,
//                         cardStyle: { backgroundColor: 'rgba(0,0,0,0)' }
//                     }}
//                 />
//             </Stack.Navigator>
//         </View>
//     );
// }

// export function InnerAppForBuild() {
//     const styles = useStyles();
//
//     let [fontsLoaded] = useFonts({
//         Roboto: Roboto_700Bold,
//     });
//
//     return (
//         <View style={styles.containerBuild} nativeID="container">
//             <Stack.Navigator screenOptions={{
//                 ...TransitionPresets.SlideFromRightIOS,
//                 headerStatusBarHeight: 0,
//                 animationEnabled: false,
//             }}>
//                 <Stack.Screen
//                     name="Build"
//                     component={BuildPage}
//                     options={{
//                         title: 'Build',
//                         headerShown: false,
//                         cardShadowEnabled: false,
//                         cardOverlayEnabled: false,
//                         cardStyle: { backgroundColor: 'rgba(0,0,0,0)' }
//                     }}
//                 />
//             </Stack.Navigator>
//         </View>
//     );
// }
//
// export function InnerAppForQuery() {
//     const styles = useStyles();
//
//     let [fontsLoaded] = useFonts({
//         Roboto: Roboto_700Bold,
//     });
//
//     useEffect(() => {
//         if (Platform.OS !== 'web') return;
//
//         const existingStyle = document.getElementById('scrollbar-style');
//         if (existingStyle) {
//             existingStyle.remove();
//         }
//
//         const style = document.createElement('style');
//         style.id = 'scrollbar-style'
//         style.type = 'text/css';
//         style.innerHTML = `
//                 input {outline: none}
//                 `;
//         document.getElementsByTagName('head')[0].appendChild(style);
//     }, []);
//
//     return (
//         <View style={[styles.appQuery]}>
//             <View style={[styles.containerQuery]} nativeID="container">
//                 <Stack.Navigator screenOptions={{
//                     ...TransitionPresets.SlideFromRightIOS,
//                     headerStatusBarHeight: 0,
//                     animationEnabled: false,
//                 }}>
//                     <Stack.Screen
//                         name="Query"
//                         component={QueryPage}
//                         options={{
//                             title: 'Query',
//                             headerShown: false,
//                             cardShadowEnabled: false,
//                             cardOverlayEnabled: false,
//                             cardStyle: { backgroundColor: 'rgba(0,0,0,0)' }
//                         }}
//                     />
//                 </Stack.Navigator>
//             </View>
//         </View>
//     );
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
        accent: '#3498db',
    },
};

const customDarkPaperTheme = {
    ...PaperDarkTheme,
    colors: {
        ...PaperDarkTheme.colors,
        primary: '#3498db',
        accent: '#3498db',
    },
};

const customNavigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        background: 'white'
        // background: 'rgba(0,0,0,0)'
    },
};

const customDarkNavigationTheme = {
    ...NavigationDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        background: 'rgb(1,1,1)',
        // background: 'rgba(0,0,0,0)'
    },
};

let updatedPushTokenForElectron = false;

async function updatePushTokenForElectron(config: IConfig, account: IAccount) {
    if (!isElectron()) return;
    if (updatedPushTokenForElectron) return;

    console.log('getElectronPushToken');
    const token = await getElectronPushToken();

    try {
        console.log('Updating push token for electron', account.id, token);
        await setAccountPushTokenElectron(account.id, token);
    } catch (e) {
        console.error(e);
    }

    updatedPushTokenForElectron = true;
}

type AppType = 'intro' | 'query' | 'build' | 'app';

function getAppType(): AppType {
    if (Platform.OS === 'web') {
        if ((global as any).location.pathname.startsWith('/intro')) {
            return 'intro';
        }
        if ((global as any).location.pathname.startsWith('/query')) {
            return 'query';
        }
        // if ((global as any).location.pathname.startsWith('/build')) {
        //     return 'build';
        // }
    }
    return 'app';
}

const queryClient = new QueryClient();

export function AppWrapper() {
    // AsyncStorage.removeItem('prefs');
    // AsyncStorage.removeItem('settings');
    // AsyncStorage.removeItem('following');
    // AsyncStorage.removeItem('config');

    // console.log(' ');

    const mutate = useMutate();

    const [appIsReady, setAppIsReady] = useState(false);
    const loadedLanguages = useSelector(state => state.loadedLanguages);
    const account = useSelector(state => state.account);
    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);
    const prefs = useSelector(state => state.prefs);
    const config = useSelector(state => state.config);
    const darkMode = useSelector(state => state.config?.darkMode);
    const colorScheme = useColorScheme();

    // Trigger loading of auth and following
    const _account = useApi({}, [account], state => state.account, (state, value) => state.account = value, () => loadAccountFromStorage());
    const _auth = useApi({}, [auth], state => state.auth, (state, value) => state.auth = value, () => loadSettingsFromStorage());
    const _following = useApi({}, [following], state => state.following, (state, value) => state.following = value, () => loadFollowingFromStorage());
    const _prefs = useApi({}, [prefs], state => state.prefs, (state, value) => state.prefs = value, () => loadPrefsFromStorage());
    const _config = useApi({}, [config], state => state.config, (state, value) => state.config = value, () => loadConfigFromStorage());

    useEffect(() => {
        if (config == null) return;
        if (account == null) return;
        updatePushTokenForElectron(config, account);
    }, [config, account]);

    useEffect(() => {
        if (config == null) return;

        // console.log('LOCAL ==> Localization.locale', Localization.locale);
        // console.log('LOCAL ==> Localization.locales', Localization.locales);

        const language = config.language == 'system' ? getLanguageFromSystemLocale2(Localization.locale) : config.language;
        // console.log('LOCAL ==> Loading AoeStrings for ' + language + ' (config.language: ' + config.language + ')');
        setInternalLanguage(language);
        Promise.all([loadAoeStringsAsync(language)]).then(() => mutate(addLoadedLanguage(language)));
        fetchAoeReferenceData();
    }, [config]);

    useEffect(() => {
        if (auth === undefined || following === undefined || config === undefined || prefs === undefined || !loadedLanguages) {
            return;
        }
        setAppIsReady(true);
    }, [auth, following, config, prefs, loadedLanguages]);

    const onLayoutRootView = useCallback(async () => {
        // console.log('onLayoutRootView', appIsReady);
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    // const list = [{"leaderboardId":"unranked","leaderboardName":"Unranked","abbreviation":"UNR"},{"leaderboardId":"rm_1v1","leaderboardName":"Ranked Elo 1v1","abbreviation":"RM 1v1"},{"leaderboardId":"rm_2v2","leaderboardName":"Ranked Elo 2v2","abbreviation":"RM 2v2"},{"leaderboardId":"rm_3v3","leaderboardName":"Ranked Elo 3v3","abbreviation":"RM 3v3"},{"leaderboardId":"rm_4v4","leaderboardName":"Ranked Elo 4v4","abbreviation":"RM 4v4"},{"leaderboardId":"qm_1v1","leaderboardName":"Quick Match 1v1","abbreviation":"QM 1v1"},{"leaderboardId":"qm_2v2","leaderboardName":"Quick Match 2v2","abbreviation":"QM 2v2"},{"leaderboardId":"qm_3v3","leaderboardName":"Quick Match 3v3","abbreviation":"QM 3v3"},{"leaderboardId":"qm_4v4","leaderboardName":"Quick Match 4v4","abbreviation":"QM 4v4"}];

    // useEffect(() => {
    //     if (!appIsReady) return;
    //     const newLinking = cloneDeep(linking);
    //     newLinking.config.screens.Leaderboard.screens = {};
    //     list.forEach(leaderboard => {
    //         newLinking.config.screens.Leaderboard.screens[`Leaderboard${leaderboard.leaderboardId}`] = {
    //             path: `${leaderboard.leaderboardId}`,
    //         };
    //     });
    //     // setMyLinking(newLinking);
    //     console.log(newLinking);
    // }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    // console.log('loadedLanguages', loadedLanguages, loadedLanguages?.length < 1);
    // console.log('LOADED');

    const finalDarkMode = darkMode === 'system' && (colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : darkMode;

    const appType = getAppType();

    // console.log('global.location', JSON.stringify((global as any).location));

    return (
        <NavigationContainer ref={navigationRef}
                             theme={finalDarkMode === 'light' ? customNavigationTheme : customDarkNavigationTheme}
                             linking={linking}
        >
            <ConditionalTester>
                <PaperProvider
                    theme={finalDarkMode === 'light' ? customPaperTheme : customDarkPaperTheme}
                    settings={{
                        icon: props => <FontAwesome5 {...props} />,
                    }}
                >
                    <ApplicationProvider {...eva} theme={finalDarkMode === 'light' ? eva.light : eva.dark}>
                        <QueryClientProvider client={queryClient}>
                            <GestureHandlerRootView style={{flex: 1}}>
                                <StatusBar barStyle={finalDarkMode === 'light' ? 'dark-content' : 'light-content'}
                                           backgroundColor="transparent" translucent={true}/>
                                <View style={{flex: 1}} onLayout={onLayoutRootView}>
                                    {/*{*/}
                                    {/*    appType == 'query' &&*/}
                                    {/*    <InnerAppForQuery/>*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    appType == 'build' &&*/}
                                    {/*    <InnerAppForBuild/>*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    appType == 'intro' &&*/}
                                    {/*    <InnerAppForIntro/>*/}
                                    {/*}*/}
                                    {
                                        appType == 'app' &&
                                        <InnerApp/>
                                    }
                                </View>
                            </GestureHandlerRootView>
                        </QueryClientProvider>
                    </ApplicationProvider>
                </PaperProvider>
            </ConditionalTester>
        </NavigationContainer>
    );
}


export default function App() {
    // Prevent closing of app when back button is tapped.
    // View navigation using back button is still possible.
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        if (Platform.OS !== 'web') {
            Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        }

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true);
    }, []);

    return (
        <ReduxProvider store={store}>
            <AppWrapper/>
        </ReduxProvider>
    );
}

// registerRootComponent(App);

const isMobile = ['Android', 'iOS'].includes(Device.osName!);

const useStyles = createStylesheet((theme, darkMode) => StyleSheet.create({
    container: {
        ...(Platform.OS === 'web' && !isElectron() ? {
                overflow: 'hidden',
                width: 450,
                maxWidth: '100%',
                maxHeight: 900,
                marginHorizontal: 'auto',
                marginVertical: 'auto',
                borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
                borderWidth: isMobile ? 0 : 1,
                borderRadius: isMobile ? 0 : 10,
            } : {}
        ),
        ...(Platform.OS === 'web' && isElectron() ? {
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                marginHorizontal: 'auto',
                marginVertical: 'auto',
                borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
                borderWidth: isMobile ? 0 : 1,
                borderRadius: isMobile ? 0 : 10,
            } : {}
        ),
        backgroundColor: theme.backgroundColor,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
    },
    appQuery: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        paddingHorizontal: 5,
        paddingVertical: 5,
        flex: 1,
        // backgroundColor: 'yellow',
    },
    containerQuery: {
        overflow: 'hidden',
        width: '100%',
        // height: '100%',
        // borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
        // borderWidth: isMobile ? 0 : 1,
        // borderRadius: isMobile ? 0 : 10,
        // backgroundColor: theme.backgroundColor,
        // backgroundColor: 'blue',
        paddingTop: 0,
        flex: 1,
    },
    containerBuild: {
        overflow: 'hidden',
        width: '100%',
        // height: '100%',
        // borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
        // borderWidth: isMobile ? 0 : 1,
        // borderRadius: isMobile ? 0 : 10,
        // backgroundColor: theme.backgroundColor,
        // backgroundColor: 'blue',
        paddingTop: 0,
        flex: 1,
    },
    containerIntro: {
        ...(Platform.OS === 'web' ?
            {
                overflow: 'hidden',
                width: '100%',
                height: '100%',
            }
            : {}
        ),
    },
}));

// Alternative Overlay
// {
//     overflow: 'hidden',
//     width: 450,
//     maxWidth: '100%',
//     maxHeight: 900,
//     marginHorizontal: 'auto',
//     marginVertical: 'auto',
//     // borderColor: '#CCC',
//     // borderWidth: isMobile ? 0 : 1,
//     borderRadius: isMobile ? 0 : 10,
// }
