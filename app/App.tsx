// For less than iOS 12
import 'array-flat-polyfill'

import 'react-native-gesture-handler';
import {DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, NavigationContainer, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import MainPage, {mainMenu} from './src/view/main.page';
import {
    BackHandler,
    Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Search from './src/view/components/search';
import {createStackNavigator, StackNavigationProp, TransitionPresets} from '@react-navigation/stack';
import Header from './src/view/components/header';
import {composeUserId, parseUserId, UserId} from './src/helper/user';
import UserPage, {userMenu} from './src/view/user.page';
import {useApi} from './src/hooks/use-api';
import {
    loadAccountFromStorage,
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
import AppLoading from 'expo-app-loading';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
// import { Notifications as LegacyNotifications } from 'expo';
// import {Tester, TestHookStore} from "cavy";
import ExampleSpec from './src/ci/exampleSpec';
import LeaderboardPage, {leaderboardMenu, LeaderboardTitle} from "./src/view/leaderboard.page";
import GuidePage, {GuideTitle} from "./src/view/guide.page";
import CivPage, {CivTitle, civTitle} from "./src/view/civ.page";
import {Civ, registerService, SERVICE_NAME} from "@nex/data";
import UnitPage, {UnitTitle, unitTitle} from "./src/view/unit/unit.page";
import {Unit} from "@nex/data";
import {navigationRef} from "./src/service/navigation";
import Footer from "./src/view/components/footer";
import {Tech} from "@nex/data";
import TechPage, {techTitle, TechTitle} from "./src/view/tech/tech.page";
import FeedPage, {feedMenu, feedTitle} from "./src/view/feed.page";
import {MyText} from "./src/view/components/my-text";
import UpdateSnackbar from "./src/view/components/snackbar/update-snackbar";
import {makeVariants, useTheme} from "./src/theming";
import SettingsPage from "./src/view/settings.page";
import {appVariants} from "./src/styles";
import {AppearanceProvider, useColorScheme} from "react-native-appearance";
import {NavigationState} from "@react-navigation/routers";
import ChangelogPage from "./src/view/changelog.page";
import ChangelogSnackbar from "./src/view/components/snackbar/changelog-snackbar";
import {Building} from "@nex/data";
import BuildingPage, {BuildingTitle, buildingTitle} from "./src/view/building/building.page";
import LivePage from "./src/view/live.page";
import PushPage from "./src/view/push.page";
import SplashPage from "./src/view/splash.page";
import ErrorSnackbar from "./src/view/components/snackbar/error-snackbar";
import ErrorPage from "./src/view/error.page";
import WinratesPage, {WinratesTitle} from "./src/view/winrates.page";
import * as Notifications from "expo-notifications";
import TipsPage from "./src/view/tips.page";
import {setSavedNotification} from "./src/helper/notification";
import initSentry from "./src/helper/sentry";
import * as Device from 'expo-device';
import {LinkingOptions} from "@react-navigation/native/lib/typescript/src/types";
import {createStylesheet} from './src/theming-new';
import { LogBox } from "react-native";
import {getLanguageFromSystemLocale2, getTranslation} from './src/helper/translate';
import {getInternalAoeString, loadAoeStringsAsync} from './src/helper/translate-data';
import * as Localization from 'expo-localization';
import {setlanguage} from './src/redux/statecache';
import {ITranslationService} from '../data/src/lib/aoe-data';

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

if (Platform.OS !== 'web') {
    LogBox.ignoreLogs([
        'Native splash screen is already hidden. Call this method before rendering any view.',
        'Your project is accessing the following APIs from a deprecated global rather than a module import: Constants (expo- constants).',
        'Remote debugger',
        'Unable to activate keep awake',
    ]);
}

class AoeDataService implements ITranslationService {
    getUiTranslation(str: string): string {
        return getTranslation(str as any);
    }
    getAoeString(str: string): string {
        return getInternalAoeString(str);
    }
}

registerService(SERVICE_NAME.TRANSLATION_SERVICE, new AoeDataService(), true);

// HACK: Prevent "Expo pasted from CoreSimulator" notification from spamming continuously
// if (__DEV__) {
//     Clipboard.setString('');
// }

// const h1 = 5;
// const h2: number = 5;

const linking: LinkingOptions = {
    prefixes: ['https://aoe2companion.com', 'aoe2companion://'],
    config: {
        screens: {
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
            Winrates: {
                path: 'winrates',
            },
        },
    },
};

export type RootStackParamList = {
    Error: undefined;
    Splash: undefined;
    Tips: undefined;
    Push: undefined;
    Live: undefined;
    Welcome: undefined;
    Privacy: undefined;
    About: undefined;
    Changelog: { changelogLastVersionRead?: string };
    Settings: undefined;
    Main: undefined;
    Winrates: undefined;
    Feed: { action?: string, match_id?: string };
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
    MainProfile: { user: string };
    MainStats: { user: string };
    MainMatches: { user: string };
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
                {
                    Platform.OS !== 'web' &&
                    <UpdateSnackbar/>
                }
                {
                    Platform.OS !== 'web' &&
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
                    name="Main"
                    component={MainPage}
                    options={{
                        title: getTranslation('main.title'),
                        headerRight: mainMenu(),
                    }}
                />
                <Stack.Screen
                    name="Leaderboard"
                    component={LeaderboardPage}
                    options={props => ({
                        title: getTranslation('leaderboard.title'),
                        headerRight: leaderboardMenu(props),
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
                    name="Changelog"
                    component={ChangelogPage}
                    options={{
                        title: getTranslation('changelog.title'),
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
                        headerTitle: props => <GuideTitle {...props} />,
                    }}
                />
                <Stack.Screen
                    name="User"
                    component={UserPage}
                    options={props => ({
                        animationEnabled: true,
                        title: props.route.params.name,
                        headerRight: userMenu(props),
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
                    name="Settings"
                    component={SettingsPage}
                    options={{
                        title: getTranslation('settings.title'),
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
    // AsyncStorage.removeItem('config');

    console.log(' ');

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

        // console.log('Localization.locale', Localization.locale);
        // console.log('Localization.locales', Localization.locales);

        const language = config.language == 'system' ? getLanguageFromSystemLocale2(Localization.locale) : config.language;
        // console.log('Loading AoeStrings for ' + language + ' (config.language: ' + config.language + ')');
        setlanguage(language);
        loadAoeStringsAsync(language);
    }, [config]);

    if (auth === undefined || following === undefined || config === undefined || prefs === undefined) {
        // console.log('LOADING');
        return <AppLoading/>;
    }

    // console.log('LOADED');

    const finalDarkMode = darkMode === "system" && (colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : darkMode;

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


// let notificationListenerAndroid: any = null;
// let notificationListenerIOS: any = null;

// Workaround notification not received when app is killed | Android
// try {
//     if (Platform.OS === 'android') {
//         notificationListenerAndroid = Notifications.addNotificationResponseReceivedListener(({notification}) => {
//             setSavedNotification(notification);
//         });
//     }
// } catch(e) {
//     console.log(e);
// }

export default function App() {
    // Workaround notification not received when app is killed | iOS
    // useEffect(() => {
    //     try {
    //         if (Platform.OS === 'ios') {
    //             notificationListenerIOS = LegacyNotifications.addListener(({data} : any) => {
    //                 setSavedNotification({
    //                     request: {content: {data: {body: data}}},
    //                 });
    //             });
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    //
    //     return () => {
    //         try {
    //             notificationListenerAndroid?.remove();
    //             notificationListenerIOS?.remove();
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };
    // }, []);

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

const isMobile = ['Android', 'iOS'].includes(Device.osName!);

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        ...(Platform.OS === 'web' ? {
                overflow: 'hidden',
                width: 450,
                maxWidth: '100%',
                maxHeight: 900,
                marginHorizontal: 'auto',
                marginVertical: 'auto',
                borderColor: '#CCC',
                borderWidth: isMobile ? 0 : 1,
                borderRadius: isMobile ? 0 : 10,
            } : {}
        ),

        // backgroundColor: '#397AF9',
        backgroundColor: theme.backgroundColor,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
    },
}));
