import { Header } from '@app/components/header';
import { Tabs } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@app/redux/store';
import { ConditionalTester } from '@app/view/testing/tester';
import { PaperProvider, MD2DarkTheme as PaperDarkTheme, MD2LightTheme as PaperDefaultTheme } from 'react-native-paper';
import { ApplicationProvider } from '@ui-kitten/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogBox, Platform, View, useColorScheme } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as eva from '@eva-design/eva';
import { useCallback, useEffect, useState } from 'react';
import { addLoadedLanguage, useMutate, useSelector } from '@app/redux/reducer';
import { useApi } from '@app/hooks/use-api';
import * as Localization from 'expo-localization';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { useColorScheme as useTailwindColorScheme } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../../global.css';

library.add(fass, fasr);

import {
    IAccount,
    IConfig,
    loadAccountFromStorage,
    loadConfigFromStorage,
    loadFollowingFromStorage,
    loadPrefsFromStorage,
    loadSettingsFromStorage,
} from '@app/service/storage';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from '@expo-google-fonts/roboto';
import 'react-native-gesture-handler';
import { Environment, IHostService, IHttpService, ITranslationService, OS, registerService, SERVICE_NAME } from '@nex/data';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import initSentry from '@app/helper/sentry';
import { getLanguageFromSystemLocale2, getTranslation } from '@app/helper/translate';
import { getInternalAoeString, loadAoeStringsAsync } from '@app/helper/translate-data';
import { getInternalLanguage, setInternalLanguage } from '@app/redux/statecache';
import { fetchJson2 } from '@app/api/util';
import * as SplashScreen from 'expo-splash-screen';
import { liveActivity } from '@app/service/live-game-activity';
import { getElectronPushToken, isElectron } from '@app/helper/electron';
import { setAccountPushTokenElectron } from '@app/api/following';
import { fetchAoeReferenceData } from '@app/helper/reference';
import { TabBar } from '@app/components/tab-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeviceContext } from 'twrnc';
import tw from '@app/tailwind';

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

initSentry();

try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
        handleSuccess: (notificationId) => console.log('success:' + notificationId),
        handleError: (notificationId) => console.log('error:' + notificationId),
    });
} catch (e) {}

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

function AppWrapper() {
    const mutate = useMutate();
    const { setColorScheme } = useTailwindColorScheme();

    const [appIsReady, setAppIsReady] = useState(false);
    const loadedLanguages = useSelector((state) => state.loadedLanguages);
    const account = useSelector((state) => state.account);
    const auth = useSelector((state) => state.auth);
    const following = useSelector((state) => state.following);
    const prefs = useSelector((state) => state.prefs);
    const config = useSelector((state) => state.config);
    const darkMode = useSelector((state) => state.config?.darkMode);
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
        Roboto_900Black,
    });

    // Trigger loading of auth and following
    const _account = useApi(
        {},
        [account],
        (state) => state.account,
        (state, value) => (state.account = value),
        () => loadAccountFromStorage()
    );
    const _auth = useApi(
        {},
        [auth],
        (state) => state.auth,
        (state, value) => (state.auth = value),
        () => loadSettingsFromStorage()
    );
    const _following = useApi(
        {},
        [following],
        (state) => state.following,
        (state, value) => (state.following = value),
        () => loadFollowingFromStorage()
    );
    const _prefs = useApi(
        {},
        [prefs],
        (state) => state.prefs,
        (state, value) => (state.prefs = value),
        () => loadPrefsFromStorage()
    );
    const _config = useApi(
        {},
        [config],
        (state) => state.config,
        (state, value) => (state.config = value),
        () => loadConfigFromStorage()
    );

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
        if (auth === undefined || following === undefined || config === undefined || prefs === undefined || !loadedLanguages || !fontsLoaded) {
            return;
        }
        setAppIsReady(true);
    }, [auth, following, config, prefs, loadedLanguages, fontsLoaded]);

    const finalDarkMode = darkMode === 'system' && (colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : darkMode;

    useEffect(() => {
        setColorScheme(finalDarkMode);
    }, [finalDarkMode]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    // useDeviceContext(tw); // <- 👋

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

    if (!appIsReady) {
        return null;
    }

    return (
        <GestureHandlerRootView className="flex-1">
            <ConditionalTester>
                <PaperProvider
                    theme={finalDarkMode === 'light' ? customPaperTheme : customDarkPaperTheme}
                    settings={{
                        icon: (props) => <FontAwesome5 {...props} />,
                    }}
                >
                    <ApplicationProvider {...eva} theme={finalDarkMode === 'light' ? eva.light : eva.dark}>
                        <QueryClientProvider client={queryClient}>
                            <View className="bg-gold-50 dark:bg-blue-950 flex-1" style={{ paddingTop: insets.top }} onLayout={onLayoutRootView}>
                                <Tabs
                                    tabBar={(props) => <TabBar {...props} />}
                                    sceneContainerStyle={{ backgroundColor: 'transparent' }}
                                    screenOptions={{
                                        headerShown: false,
                                    }}
                                >
                                    <Tabs.Screen name="index" options={{ headerShown: true, header: Header, tabBarIcon: () => 'home' }} />
                                    <Tabs.Screen name="matches" options={{ tabBarLabel: 'Matches', tabBarIcon: () => 'chess' }} />
                                    <Tabs.Screen name="explore" options={{ tabBarLabel: 'Explore', tabBarIcon: () => 'landmark' }} />
                                    <Tabs.Screen name="statistics" options={{ tabBarLabel: 'Stats', tabBarIcon: () => 'chart-simple' }} />
                                    <Tabs.Screen name="competitive" options={{ tabBarLabel: 'Pros', tabBarIcon: () => 'ranking-star' }} />
                                    <Tabs.Screen name="(more)" options={{ tabBarLabel: 'More', tabBarIcon: () => 'bars' }} />
                                </Tabs>
                            </View>
                        </QueryClientProvider>
                    </ApplicationProvider>
                </PaperProvider>
            </ConditionalTester>
        </GestureHandlerRootView>
    );
}

export default function HomeLayout() {
    return (
        <ReduxProvider store={store}>
            <AppWrapper />
        </ReduxProvider>
    );
}
