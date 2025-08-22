import { fetchJson } from '@app/api/util';
import { Header } from '@app/components/header';
import { TabBar } from '@app/components/tab-bar';
import initSentry from '@app/helper/sentry';
import {
    getTranslationInternal,
    mmkvDefaultInstance,
    useMMKWTranslationCache,
} from '@app/helper/translate';
import { getInternalAoeString } from '@app/helper/translate-data';
import store from '@app/redux/store';
import { cacheLiveActivityAssets } from '@app/service/storage';
import tw from '@app/tailwind';
import { ConditionalTester } from '@app/view/testing/tester';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { Environment, IHostService, IHttpService, ITranslationService, OS, registerService, SERVICE_NAME } from '@nex/data';
import { DarkTheme, DefaultTheme, ThemeProvider, useNavigationState } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Notifications from '../service/notifications';
import { SplashScreen, Stack, useNavigation, usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { LiveActivity } from 'modules/widget';
import { useColorScheme as useTailwindColorScheme } from 'nativewind';
import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus, BackHandler, LogBox, Platform, StatusBar, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import '../../../global.css';
import { useAppColorScheme } from 'twrnc';
import { appConfig } from '@nex/dataset';
import UpdateSnackbar from '@app/view/components/snackbar/update-snackbar';
import ChangelogSnackbar from '@app/view/components/snackbar/changelog-snackbar';
import { useEventListener } from 'expo';
import { useAccountData } from '@app/queries/all';
import { PortalProvider } from '@app/components/portal/portal-host';
import { setAccountLiveActivityToken, storeLiveActivityStarted } from '@app/api/account';
import { queryClient } from '@app/service/query-client';
import { TranslationModeOverlay } from '@app/components/translation/translation-mode-overlay';
import { PostMessageTranslationsController } from '@app/components/translation/post-message-translation';
import { setMainPageShown, useMutate, useSelector } from '@app/redux/reducer';
import { useMMKV } from 'react-native-mmkv';
import { clearLastNotificationResponseAsync, useLastNotificationResponse } from '@app/service/notifications';
import * as WebBrowser from 'expo-web-browser';
import { getInternalLanguage } from '@app/queries/direct';
import { useDarkMode } from '@app/hooks/use-dark-mode';

initSentry();

console.error = (function (error) {
    return function (message) {
        if (!/findDOMNode is deprecated/.test(message)) {
            error.apply(console, arguments as any);
        }
    };
})(console.warn);

function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
    }
}

library.add(fass, fasr);

SplashScreen.preventAutoHideAsync();

// Introduced in SDK 52, but it seems to be not available when imported from expo router.
// SplashScreen.setOptions({
//     duration: 1000,
//     fade: true,
// });

WebBrowser.maybeCompleteAuthSession();

try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
        handleSuccess: (notificationId) => console.log('success:' + notificationId),
        handleError: (notificationId) => console.log('error:' + notificationId),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (e) {}

if (Platform.OS !== 'web') {
    LogBox.ignoreLogs([
        'Native splash screen is already hidden. Call this method before rendering any view.',
        'Your project is accessing the following APIs from a deprecated global rather than a module import: Constants (expo- constants).',
        'Remote debugger',
        'Unable to activate keep awake',

        // Just for making screenshots
        'Function components cannot be given',
        'Support for defaultProps',
    ]);
}

class HttpService implements IHttpService {
    async fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
        return fetchJson(input, init, reviver);
    }
}

class AoeDataService implements ITranslationService {
    getUiTranslation(str: string): string {
        return getTranslationInternal(str as any);
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

registerService(SERVICE_NAME.TRANSLATION_SERVICE, new AoeDataService(), true);
registerService(SERVICE_NAME.HOST_SERVICE, new HostService(), true);
registerService(SERVICE_NAME.HTTP_SERVICE, new HttpService(), true);

const isMobile = ['Android', 'iOS'].includes(Device.osName!);

// If we use these hooks in the AppWrapper, every change will trigger
// a rerender of the AppWrapper which costs performance.
function LanguageController() {
    useMMKWTranslationCache();

    return <View />;
}

function AccountController() {
    useMMKWAccountCache();

    return <View />;
}

// If we use these hooks in the AppWrapper, every change will trigger
// a rerender of the AppWrapper which costs performance.
// function AccountController() {
//     // const { data: configMainPage } = useAccount(data => data.mainPage);
//     // console.log('ACCOUNT in layout configMainPage', configMainPage);
//     // console.log('ACCOUNT in layout configMainPage');
//     // console.log('account in layout', account);
//     return <View />;
// }

function LiveActivityController() {
    const accountId = useAccountData((state) => state.accountId);

    useEventListener(LiveActivity, 'onTokenChanged', async ({ token }) => {
        console.log('onTokenChanged', accountId, token);
        if (token) {
            await setAccountLiveActivityToken(token);
        }
    });

    useEventListener(LiveActivity, 'onActivityStarted', async ({ token, data, type }) => {
        const { match } = JSON.parse(data);
        console.log('onActivityStarted', accountId, token, type, match.matchId);
        if (token && type && match) {
            await storeLiveActivityStarted(token, type, match.matchId);
        }
    });

    useEffect(() => {
        if (Platform.OS === 'ios' && appConfig.game === 'aoe2de' && accountId) {
            console.log('Registering LiveActivity for', accountId);
            LiveActivity.enable();
            cacheLiveActivityAssets();
        }
    }, [accountId]);

    return <View />;
}

const customLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: tw.color('gold-50') ?? 'white',
    },
};

const customDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: tw.color('blue-950') ?? 'black',
    },
};

function useColorSchemes() {
    const { setColorScheme: setTailwindColorScheme } = useTailwindColorScheme();
    const [, , setTailwindReactNativeColorScheme] = useAppColorScheme(tw);
    const darkMode = useDarkMode();

    useEffect(() => {
        setTailwindColorScheme(darkMode);
        setTailwindReactNativeColorScheme(darkMode);
    }, [darkMode]);

    return {
        customTheme: darkMode === 'light' ? customLightTheme : customDarkTheme,
        contentTheme: darkMode === 'light' ? 'dark-content' : 'light-content',
    } as const;
}

function AppWrapper() {
    // console.log('AppWrapper...');

    // const [languageLoaded, setLanguageLoaded] = useState(false);
    // const [appIsReady, setAppIsReady] = useState(false);
    const insets = useSafeAreaInsets();
    const { customTheme, contentTheme } = useColorSchemes();

    // const [rerender] = useMMKVString('rerender');
    // const [cachedLanguage, setCachedLanguage] = useMMKVString('language');
    // useEffect(() => {
    //     if (languageLoaded) return;
    //     if (!cachedLanguage) return;
    //     console.log('CACHED language', cachedLanguage);
    //     setInternalLanguage(cachedLanguage);
    //     loadTranslatonStringsAsync(cachedLanguage, () => {
    //         setLanguageLoaded(true);
    //     });
    // }, [cachedLanguage]);
    //
    // useTranslations();

    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
        Roboto_900Black,
    });

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange);
        return () => subscription.remove();
    }, []);

    // useEffect(() => {
    //     if (fontsLoaded) {
    //         console.log('Fonts loaded');
    //         setAppIsReady(true);
    //     }
    // }, [fontsLoaded]);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            SplashScreen.hide();
        }
    }, [fontsLoaded]);

    // if (!fontsLoaded || (cachedLanguage && !languageLoaded)) {
    if (!fontsLoaded) {
        return null;
    }

    // console.log();
    // console.log();
    // console.log('ROOT RENDER', appConfig.game);
    // console.log();
    // console.log();

    return (
        <GestureHandlerRootView className={`flex-1 ${Platform.OS === 'web' ? `bg-white dark:bg-black ${isMobile ? '' : 'py-5'}` : ``}`}>
            <ConditionalTester>
                <ThemeProvider value={customTheme}>
                    <View
                        className={`bg-gold-50 dark:bg-blue-950 ${Platform.OS === 'web' ? `overflow-hidden w-[450px] max-w-full mx-auto my-auto flex-1 ${isMobile ? '' : 'max-h-[900px] border border-gray-200 dark:border-gray-800'} rounded-lg` : 'flex-1'}`}
                        style={{ paddingTop: insets.top }}
                        onLayout={onLayoutRootView}
                    >
                        <StatusBar barStyle={contentTheme} backgroundColor="transparent" translucent />

                        <StartupNavigationController />
                        <AccountController />
                        <LanguageController />
                        <LiveActivityController />
                        {Platform.OS === 'web' && <PostMessageTranslationsController />}
                        {Platform.OS === 'web' && <TranslationModeOverlay />}

                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                width: '100%',
                                zIndex: 9999,
                            }}
                        >
                            {Platform.OS !== 'web' && <UpdateSnackbar />}
                            {Platform.OS !== 'web' && <ChangelogSnackbar />}
                            {/*<ErrorSnackbar />*/}
                        </View>

                        <PortalProvider>
                            <>
                                <Stack screenOptions={{ header: (props) => <Header {...props} /> }}></Stack>
                                <TabBar></TabBar>
                            </>
                        </PortalProvider>
                    </View>
                </ThemeProvider>
            </ConditionalTester>
        </GestureHandlerRootView>
    );
}


function useIsNavigationReady() {
    // useRootNavigationState does not trigger a re-render when the route changes, but usePathname does
    const pathname = usePathname();

    const rootNavigationState = useRootNavigationState();
    return rootNavigationState?.key != null;
}

const mmkvConfigMainPage = mmkvDefaultInstance.getString('configMainPage');
// console.log('mmkvConfigMainPage', mmkvConfigMainPage);

export function useMMKWAccountCache() {
    const mmkv = useMMKV();
    const setConfigMainPage = (value: string) => mmkv.set('configMainPage', value);

    const configMainPage = useAccountData(data => data.mainPage);

    useEffect(() => {
        if (!configMainPage) {
            // console.log('No configMainPage available, skipping cache update');
            return;
        }
        setConfigMainPage(configMainPage);
    }, [configMainPage]);
}

function StartupNavigationController() {
    const router = useRouter();

    const notificationResponse = useLastNotificationResponse();
    const configMainPage = useAccountData(data => data.mainPage) ?? mmkvConfigMainPage;
    const mainPageShown = useSelector((state) => state.mainPageShown);
    const mutate = useMutate();
    const isNavigationReady = useIsNavigationReady();

    useEffect(() => {
        if (!isNavigationReady) return;

        // Prioritize notification handling over main page config
        if (
            notificationResponse &&
            notificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
            if (router.canDismiss()) router.dismissAll();

            router.replace(`/matches?match_id=${notificationResponse.notification.request.content?.data?.match_id}`);
            clearLastNotificationResponseAsync();
            return;
        }

        if (Platform.OS !== 'web' && configMainPage && mainPageShown !== true) {
            if (router.canDismiss()) router.dismissAll();

            router.replace(configMainPage);
            mutate(setMainPageShown(true));
        }
    }, [isNavigationReady, notificationResponse, configMainPage, mainPageShown]);

    return <View />;
}

function HomeLayout() {
    const router = useRouter();
    const routes = useNavigationState(state => state.routes);

    useEffect(() => {
        const backAction = () => {
            const stackLength = routes[0]?.state?.routes.length;
            // console.log('back stackLength', stackLength);

            if (!stackLength || stackLength <= 1) {
                // You're at the root — override default back to prevent exit
                router.replace('/');
            } else {
                // You're at a nested route — override default back to prevent it to navigate through tabs
                router.dismiss();
            }

            // Prevent default back action
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => subscription.remove();
    }, [routes]);

    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppWrapper />
            </QueryClientProvider>
        </ReduxProvider>
    );
}

export default Sentry.wrap(HomeLayout);
