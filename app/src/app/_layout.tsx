import { fetchJson } from '@app/api/util';
import { Header } from '@app/components/header';
import { TabBar } from '@app/components/tab-bar';
import { fetchAoeReferenceData } from '@app/helper/reference';
import initSentry from '@app/helper/sentry';
import {
    getTranslationInternal,
    useSetTranslationStrings, useTranslations,
} from '@app/helper/translate';
import { getInternalAoeString } from '@app/helper/translate-data';
import { getInternalLanguage, setInternalLanguage } from '@app/redux/statecache';
import store from '@app/redux/store';
import { cacheLiveActivityAssets } from '@app/service/storage';
import tw from '@app/tailwind';
import { ConditionalTester } from '@app/view/testing/tester';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { Environment, IHostService, IHttpService, ITranslationService, OS, registerService, SERVICE_NAME } from '@nex/data';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Notifications from '../service/notifications';
import { SplashScreen, Stack, useNavigation, useRouter } from 'expo-router';
import { LiveActivity } from 'modules/widget';
import { useColorScheme as useTailwindColorScheme } from 'nativewind';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    AppState,
    AppStateStatus,
    BackHandler,
    LogBox,
    Platform,
    Pressable,
    StatusBar,
    useColorScheme,
    View,
} from 'react-native';
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
import { useMMKVString } from 'react-native-mmkv';
import { queryClient } from '@app/service/query-client';

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
        return fetchJson(title, input, init, reviver);
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
    const [cachedLanguage, setCachedLanguage] = useMMKVString('language');

    const language = useAccountData((account) => account.language);
    useTranslations(language);

    // useEffect(() => {
    //     console.log('ACCOUNT language', language);
    //     if (!language) return;
    //     console.log('ACCOUNT loading language');
    //     setInternalLanguage(language);
    //     fetchAoeReferenceData();
    //     loadTranslatonStringsAsync(language);
    //     setCachedLanguage(language);
    // }, [language]);

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

export function useDarkMode() {
    const deviceColorScheme = useColorScheme();
    return deviceColorScheme || 'light';
}

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

// export function useTranslations() {
//     const setTranslationStrings = useSetTranslationStrings();
//
//     useEffect(() => {
//         function handleMessage(event: MessageEvent) {
//             if (event.origin !== 'http://localhost:5173') return;
//
//             if (event.data?.type === 'translations') {
//                 console.log('✅ Translations received from', event.origin);
//                 console.log('📦', event.data.data);
//                 setTranslationStrings('de', event.data.data);
//             }
//         }
//
//         window.addEventListener('message', handleMessage);
//
//         return () => {
//             window.removeEventListener('message', handleMessage);
//         };
//     }, []);
// }

function PostMessageTranslationsController() {
    const setTranslationStrings = useSetTranslationStrings();

    useEffect(() => {
        if (window.self !== window.parent) {
            console.log("🧭 Inside iframe – requesting translations");

            window.parent.postMessage(
                { type: 'request-translations' },
                '*'
            );
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'translations') {
                console.log('✅ Translations received:', event.data.data);
                setTranslationStrings('de', event.data.data);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return <View />;
}

export function TranslationModeOverlay() {
    const [mode, setMode] = useMMKVString('translationMode');
    const keyHeldRef = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return; // Ignore repeated key presses

            if (e.key === "Control" || e.key === "Meta") {
                keyHeldRef.current = true;
                setMode('key');
                console.log('Translation mode activated');
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Control" || e.key === "Meta") {
                keyHeldRef.current = false;
                setMode(undefined);
            }
        };

        const handleClick = (e: MouseEvent) => {
            if (keyHeldRef.current) {
                e.stopPropagation()
                e.preventDefault()
                // console.log('Clicked translation key:', e.target);
                const target = e.target as HTMLElement;
                const key = target?.textContent?.trim();
                if (key) {
                    console.log('Clicked translation key:', key);
                    window.parent.postMessage(
                        { type: 'request-key', key },
                        '*'
                    );
                    keyHeldRef.current = false;
                    setMode(undefined);
                }
            }
        };

        if (Platform.OS === 'web') {
            console.log('ADD LISTENERS');
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            window.addEventListener('click', handleClick, true);
        }

        return () => {
            if (Platform.OS === 'web') {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                window.removeEventListener('click', handleClick, true);
            }
        };
    }, []);

    if (mode !== 'key') return null;

    return (
        <View
            pointerEvents="none"
            // style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
        >
            {/*<Pressable*/}
            {/*    onPress={(e) => {*/}
            {/*        console.log('Clicked translation key:', e.target);*/}
            {/*        const target = e.target as HTMLElement;*/}
            {/*        const text = target?.textContent;*/}
            {/*        if (text) {*/}
            {/*            console.log('Clicked translation key:', text);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    style={{ flex: 1, backgroundColor: 'rgba(255, 0, 0, 0.5)' }}*/}
            {/*/>*/}
        </View>
    );
}

function AppWrapper() {
    console.log('AppWrapper...');

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

    console.log();
    console.log();
    console.log('ROOT RENDER', appConfig.game);
    console.log();
    console.log();

    return (
        <GestureHandlerRootView className={`flex-1 ${Platform.OS === 'web' ? `bg-white dark:bg-black` : ``}`}>
            <ConditionalTester>
                <ThemeProvider value={customTheme}>
                    <View
                        className={`bg-gold-50 dark:bg-blue-950 ${Platform.OS === 'web' ? `overflow-hidden w-[450px] max-w-full h-[900px] mx-auto my-auto ${isMobile ? '' : 'border border-gray-200 dark:border-gray-800'} rounded-lg` : 'flex-1'}`}
                        style={{ paddingTop: insets.top }}
                        onLayout={onLayoutRootView}
                    >
                        <StatusBar barStyle={contentTheme} backgroundColor="transparent" translucent />

                        <LanguageController />
                        <LiveActivityController />
                        {/*<AccountController />*/}
                        {Platform.OS === 'web' && <PostMessageTranslationsController />}

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


                        <TranslationModeOverlay />

                        <PortalProvider>
                            <>
                                <Stack screenOptions={{ header: Header }}></Stack>
                                <TabBar></TabBar>
                            </>
                        </PortalProvider>
                    </View>
                </ThemeProvider>
            </ConditionalTester>
        </GestureHandlerRootView>
    );
}

function HomeLayout() {
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                router.replace('/');
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppWrapper />
            </QueryClientProvider>
        </ReduxProvider>
    );
}

export default Sentry.wrap(HomeLayout);
