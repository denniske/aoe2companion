import { fetchJson } from '@app/api/util';
import initSentry from '@app/helper/sentry';
import { getTranslationInternal, mmkvDefaultInstance, useMMKWTranslationCache } from '@app/helper/translate';
import { getInternalAoeString } from '@app/helper/translate-data';
import store from '@app/redux/store';
import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
    useFonts,
} from '@expo-google-fonts/roboto';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    Environment,
    IHostService,
    IHttpService,
    ITranslationService,
    OS,
    registerService,
    SERVICE_NAME,
} from '@nex/data';
import { DarkTheme, DefaultTheme, ThemeProvider, useNavigationState } from 'expo-router/react-navigation';
import * as Sentry from '@sentry/react-native';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Notifications from '../service/notifications';
import { Slot, SplashScreen, usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus, BackHandler, LogBox, Platform, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from '@/src/components/uniwind/safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import '../../global.css';
import UpdateSnackbar from '@app/view/components/snackbar/update-snackbar';
import ChangelogSnackbar from '@app/view/components/snackbar/changelog-snackbar';
import { useAccountData } from '@app/queries/all';
import { PortalProvider } from '@app/components/portal/portal-host';
import { queryClient } from '@app/service/query-client';
import { TranslationModeOverlay } from '@app/components/translation/translation-mode-overlay';
import { PostMessageTranslationsController } from '@app/components/translation/post-message-translation';
import { setMainPageShown, useMutate, useSelector } from '@app/redux/reducer';
import { useMMKV } from 'react-native-mmkv';
import { clearLastNotificationResponse, useLastNotificationResponse } from '@app/service/notifications';
import * as WebBrowser from 'expo-web-browser';
import { getInternalLanguage } from '@app/queries/direct';
import { useDarkMode } from '@app/hooks/use-dark-mode';
// import { LiveActivity } from '@/modules/widget';
import { AvailableMainPage } from '@app/helper/routing';
import { useCSSVariable } from 'uniwind';
import { LoginPopupProvider } from '@app/providers/login-popup-provider';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { appConfig } from '@nex/dataset';
import { cacheLiveActivityAssets, widgetGroupDir } from '@app/service/storage';
import { addPushToStartTokenListener, ExpoWidgetsEvents } from 'expo-widgets';
import { setAccountLiveActivityToken } from '@app/api/account';
import MatchActivity, { MatchActivityProps } from '@app/widgets/AAMatchActivity.widget';
import { useEventListener } from 'expo';

initSentry();


if (Platform.OS === 'web') {
    polyfillCountryFlagEmojis();

    // Ignore pointer events deprecation warning probably from react-native-navigation on web
    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (args[0]?.includes('props.pointerEvents is deprecated')) return;
        originalWarn(...args);
    };
}

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

library.add(fass, fasr, fab);

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


// const newUnits = [];
// const newTechs = [];
// const newBuildings = [];
//
// Object.entries(aoeData.civs)
//     .filter(([civ, civData], i) => !['Athenians', 'Spartans', 'Achaemenids', 'Macedonians', 'Thracians', 'Puru'].includes(civ))
//     .forEach(([civ, civData]) => {
//         // console.log('civ', civ);
//         // console.log('units');
//
//         // civData.Unit.forEach(dataId => {
//         //     const data = aoeData.data.Unit[dataId as any];
//         //     if (!data) {
//         //         console.warn(`Unit with data ID ${dataId} not found in aoeData`);
//         //         return;
//         //     }
//         //     const name1 = sanitizeGameName(getAoeString((data.LanguageNameId).toString()));
//         //     const name2 = sanitizeGameName(getAoeString((data.LanguageNameId+9000).toString()));
//         //     const name = name1 !== '???' ? name1 : name2;
//         //     if (name === '???') {
//         //         console.log(`Missing translation for ${data.LanguageNameId} ${data.LanguageNameId+9000}`);
//         //     }
//         //     const existing = Object.values(units).find(u => u.dataId === dataId.toString());
//         //     if (existing) return;
//         //     // console.log(`- ${name} ${data.LanguageNameId+9000} (${dataId}) ${existing ? 'exists' : 'new'}`);
//         //     newUnits.push(name.replace(/\s/, '') + ' ' +  dataId);
//         // });
//
//         // civData.Tech.forEach(dataId => {
//         //     const data = aoeData.data.Tech[dataId as any];
//         //     if (!data) {
//         //         console.warn(`Tech with data ID ${dataId} not found in aoeData`);
//         //         return;
//         //     }
//         //     const name1 = sanitizeGameName(getAoeString((data.LanguageNameId).toString()));
//         //     const name2 = sanitizeGameName(getAoeString((data.LanguageNameId+10000).toString()));
//         //     const name = name1 !== '???' ? name1 : name2;
//         //     if (name === '???') {
//         //         console.log(`Missing translation for ${data.LanguageNameId} ${data.LanguageNameId+10000}`);
//         //     }
//         //     const existing = Object.values(techs).find(u => u.dataId === dataId.toString());
//         //     if (existing) return;
//         //     // console.log(`- ${name} ${data.LanguageNameId+9000} (${dataId}) ${existing ? 'exists' : 'new'}`);
//         //     newTechs.push(name.replace(/\s/, '') + ' ' +  dataId);
//         // });
//
//         // civData.Building.forEach(dataId => {
//         //     const data = aoeData.data.Building[dataId as any];
//         //     if (!data) {
//         //         console.warn(`Building with data ID ${dataId} not found in aoeData`);
//         //         return;
//         //     }
//         //     const name1 = sanitizeGameName(getAoeString((data.LanguageNameId).toString()));
//         //     const name2 = sanitizeGameName(getAoeString((data.LanguageNameId+9000).toString()));
//         //     const name = name1 !== '???' ? name1 : name2;
//         //     if (name === '???') {
//         //         console.log(`Missing translation for ${data.LanguageNameId} ${data.LanguageNameId+9000}`);
//         //     }
//         //     const existing = Object.values(buildings).find(u => u.dataId === dataId.toString());
//         //     if (existing) return;
//         //     // console.log(`- ${name} ${data.LanguageNameId+9000} (${dataId}) ${existing ? 'exists' : 'new'}`);
//         //     newBuildings.push(name.replace(/\s/, '') + ' ' +  dataId);
//         // });
// });

// console.log(new Set(newUnits));
// console.log(new Set(newTechs));
// console.log(new Set(newBuildings));

// Object.entries(aoeTreeInternal).forEach(([civ, civData]) => {
//     console.log('civ', civ);
//     console.log('units');
//     civData.civ_techs_units.forEach(techUnit => {
//         const dataId = techUnit['Building ID'];
//         const data = aoeData.data.Unit[dataId as any];
//         if (!data) {
//             console.warn(`Unit with data ID ${dataId} not found in aoeData`);
//             return;
//         }
//         const name = sanitizeGameName(getAoeString((data.LanguageNameId+9000).toString()));
//         const existing = Object.values(units).find(u => u.dataId === dataId);
//         console.log(`- ${name} (${dataId}) ${existing ? 'exists' : 'new'}`);
//     });
// });

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

    // useEventListener(LiveActivity, 'onActivityStarted', async ({ token, data, type }) => {
    //     const { match } = JSON.parse(data);
    //     console.log('onActivityStarted', accountId, token, type, match.matchId);
    //     if (token && type && match) {
    //         await storeLiveActivityStarted(token, type, match.matchId);
    //     }
    // });

    console.log('instances', MatchActivity.getInstances());

    // useEventListener(ExpoWidgetsEvents, 'onExpoWidgetsPushToStartTokenReceived', async ({ token, data, type }) => {
    //     const { match } = JSON.parse(data);
    //     console.log('onActivityStarted', accountId, token, type, match.matchId);
    //     if (token && type && match) {
    //         await storeLiveActivityStarted(token, type, match.matchId);
    //     }
    // });

    useEffect(() => {
        const pushToStartSubscription = addPushToStartTokenListener(async (event) => {
            // console.log('widgetGroupDir', widgetGroupDir.uri);
            const iosAppGroupFolder = widgetGroupDir.uri.replace('file:///var/mobile/Containers/Shared/AppGroup/', '').replace('/', '');
            const token = event.activityPushToStartToken;
            console.log(`onTokenChanged account: ${accountId} token: ${token} folder: ${iosAppGroupFolder}`);
            if (token) {
                await setAccountLiveActivityToken(token, iosAppGroupFolder);
            }
        });

        return () => {
            pushToStartSubscription.remove();
        };
    }, [accountId]);

    useEffect(() => {
        if (Platform.OS === 'ios' && appConfig.game === 'aoe2' && accountId) {
            console.log('Registering LiveActivity for', accountId);
            // LiveActivity.enable();
            cacheLiveActivityAssets();
        }
    }, [accountId]);

    return <View />;
}

function useColorSchemes() {
    // const { setColorScheme: setTailwindColorScheme } = useTailwindColorScheme();
    // const [, , setTailwindReactNativeColorScheme] = useAppColorScheme(tw);
    const darkMode = useDarkMode();

    useEffect(() => {
        // setTailwindColorScheme(darkMode);

        // This does not seem to work anymore
        // setTailwindReactNativeColorScheme(darkMode);
    }, [darkMode]);


    // const { data: account, isLoading: isLoadingAccount } = useAccount();
    // const favoriteIds = compact(account?.favoriteBuildIds);
    //
    // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteBuilds({
    //     build_ids: favoriteIds,
    // });
    // const builds = data?.pages?.flatMap((p) => p.builds) ?? [];
    //
    // const colorGold50 = Uniwind.getCSSVariable('--color-gold-50') as string;
    // const colorBlue950 = Uniwind.getCSSVariable('--color-blue-950') as string;
    //
    // const colorWhite = Uniwind.getCSSVariable('--color-white') as string;
    // const colorBlue900 = Uniwind.getCSSVariable('--color-blue-900') as string;
    //
    // const colorGray200 = Uniwind.getCSSVariable('--color-gray-200') as string;
    // const colorGray800 = Uniwind.getCSSVariable('--color-gray-800') as string;
    //
    // const groupDir = Paths.appleSharedContainers['group.com.aoe2companion'];
    //
    // (async () => {
    //     const favoriteBuilds = [];
    //
    //     for (const build of builds) {
    //         const imagePath = Paths.join(groupDir, `${await md5(build.imageURL)}.png`);
    //         const imageSource = () => build.imageURL;
    //
    //         // The path actually can also be any string like an md5 of the actual path
    //         const civilizationPath = Paths.join(groupDir, `${camelCase(build.civilization)}.png`);
    //         const civilizationSource = () => Image.resolveAssetSource(getCivIconLocal(build.civilization) ?? genericCivIcon).uri;
    //
    //         favoriteBuilds.push({
    //             ...build,
    //             imageUrl: await widgetSetFileIfNotExists(imagePath, imageSource),
    //             civilizationImageUrl: await widgetSetFileIfNotExists(civilizationPath, civilizationSource),
    //         });
    //     }
    //
    //     AABuilds.updateSnapshot({
    //         count: 5,
    //         style: {
    //             light: {
    //                 backgroundColor: colorGold50,
    //                 foregroundColor: '#000000',
    //                 foregroundNoteColor: '#888888',
    //                 cardBackgroundColor: colorWhite,
    //                 cardBorderColor: colorGray200,
    //             },
    //             dark: {
    //                 backgroundColor: colorBlue950,
    //                 foregroundColor: '#ffffff',
    //                 foregroundNoteColor: '#888888',
    //                 cardBackgroundColor: colorBlue900,
    //                 cardBorderColor: colorGray800,
    //             }
    //         },
    //         builds: favoriteBuilds,
    //     });
    //
    //     console.log('favoriteBuilds', favoriteBuilds?.length);
    //     console.log('favoriteBuilds', favoriteBuilds);
    // })();

    const colorGold50 = useCSSVariable('--color-gold-50') as string;
    const colorBlue950 = useCSSVariable('--color-blue-950') as string;

    const customLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: colorGold50 ?? 'white',
        },
    };

    const customDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: colorBlue950 ?? 'black',
        },
    };

    return {
        customTheme: darkMode === 'light' ? customLightTheme : customDarkTheme,
        contentTheme: darkMode === 'light' ? 'dark-content' : 'light-content',
    } as const;
}

let consoleIntercepted = false;

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

    // const mutate = useMutate();
    // if (!consoleIntercepted) {
    //     consoleIntercepted = true;
    //
    //     // Preserve original console methods
    //     const originalLog = console.log;
    //     const originalWarn = console.warn;
    //     const originalError = console.error;
    //
    //     // Helper to push and print
    //     function intercept(
    //         type: 'log' | 'warn' | 'error',
    //         originalFn: (...args: any[]) => void,
    //     ) {
    //         return (...args: any[]) => {
    //             const message = args
    //                 .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
    //                 .join(' ');
    //             mutate(addLog(message));
    //             // logs.push(`[${type.toUpperCase()}] ${message}`);
    //
    //             // Keep native behavior
    //             originalFn(...args);
    //         };
    //     }
    //
    //     console.log = intercept('log', originalLog);
    //     console.warn = intercept('warn', originalWarn);
    //     console.error = intercept('error', originalError);
    // }

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

    return (
        <GestureHandlerRootView className="flex-1">
            <ThemeProvider value={customTheme}>
                <View
                    className={`flex-1 ${Platform.OS === 'web' ? '' : 'bg-gold-50 dark:bg-blue-950'}`}
                    style={{ paddingTop: insets.top }}
                    onLayout={onLayoutRootView}
                >
                    <StatusBar barStyle={contentTheme} backgroundColor="transparent" translucent />

                    {/*<FloatingDevTools*/}
                    {/*    apps={[*/}
                    {/*        {*/}
                    {/*            id: "network",*/}
                    {/*            name: "NETWORK",*/}
                    {/*            description: "Network request logger",*/}
                    {/*            slot: "both",*/}
                    {/*            icon: ({ size }) => <Globe size={size} color="#38bdf8" />,*/}
                    {/*            component: NetworkModal,*/}
                    {/*            props: {},*/}
                    {/*        },*/}
                    {/*        // {*/}
                    {/*        //     id: "console",*/}
                    {/*        //     name: "CONSOLE",*/}
                    {/*        //     description: "Console logger",*/}
                    {/*        //     slot: "both",*/}
                    {/*        //     icon: ({ size }) => <Activity size={size} />,*/}
                    {/*        //     component: ConsoleModal,*/}
                    {/*        //     props: {},*/}
                    {/*        // },*/}
                    {/*        // {*/}
                    {/*        //     id: "storage",*/}
                    {/*        //     name: "STORAGE",*/}
                    {/*        //     description: "AsyncStorage browser",*/}
                    {/*        //     slot: "both",*/}
                    {/*        //     icon: ({ size }) => <StorageStackIcon size={size} color="#38f8a7" />,*/}
                    {/*        //     component: StorageModalWithTabs,*/}
                    {/*        //     props: {*/}
                    {/*        //         requiredStorageKeys: [*/}
                    {/*        //             {*/}
                    {/*        //                 key: "favoritedBuilds",*/}
                    {/*        //                 description: "Favorited Builds",*/}
                    {/*        //                 expectedType: "array",*/}
                    {/*        //                 storageType: "async",*/}
                    {/*        //             },*/}
                    {/*        //         ],*/}
                    {/*        //     },*/}
                    {/*        // },*/}
                    {/*    ]}*/}
                    {/*    actions={{}}*/}
                    {/*    environment="local"*/}
                    {/*    userRole="admin"*/}
                    {/*/>*/}

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
                        <LoginPopupProvider>
                            <Slot />
                        </LoginPopupProvider>
                    </PortalProvider>
                </View>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

function useIsNavigationReady() {
    // useRootNavigationState does not trigger a re-render when the route changes, but usePathname does
    const pathname = usePathname();

    const rootNavigationState = useRootNavigationState();
    return rootNavigationState?.key != null;
}

const mmkvConfigMainPage = typeof window !== "undefined" ? mmkvDefaultInstance.getString('configMainPage') as AvailableMainPage : undefined;
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
        // Android: There are notifications e.g. when opening the app by deeplink from a redirect that we want to ignore
        //          "notification.request".content.data['com.android.browser.application_id']: "com.android.chrome"
        //          So we only handle notifications where the match_id is set
        if (
            notificationResponse &&
            notificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
            notificationResponse.notification.request.content?.data?.match_id
        ) {
            if (router.canDismiss()) router.dismissAll();

            console.log('Navigating to matches page because of notification');
            router.replace(`/matches?match_id=${notificationResponse.notification.request.content?.data?.match_id}`);
            clearLastNotificationResponse();
            return;
        }

        if (Platform.OS !== 'web' && configMainPage && mainPageShown !== true) {
            if (router.canDismiss()) router.dismissAll();

            console.log('Navigating to main page:', configMainPage);
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
            // There is root node > main node > ...route info
            const stackLength = routes[0]?.state?.routes?.[0]?.state?.routes.length;
            console.log('back routes', routes);
            console.log('back stackLength', stackLength);

            if (!stackLength || stackLength <= 1) {
                // You're at the root — override default back to prevent exit
                console.log('You\'re at the root — override default back to prevent exit');
                router.replace('/');
            } else {
                // You're at a nested route — override default back to prevent it to navigate through tabs
                console.log('You\'re at a nested route — override default back to prevent it to navigate through tabs');
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
