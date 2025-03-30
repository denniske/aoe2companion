import { setAccountLiveActivityToken, storeLiveActivityStarted } from '@app/api/following';
import { fetchJson } from '@app/api/util';
import { Header } from '@app/components/header';
import { TabBar } from '@app/components/tab-bar';
import { fetchAoeReferenceData } from '@app/helper/reference';
import initSentry from '@app/helper/sentry';
import { getTranslation } from '@app/helper/translate';
import { getInternalAoeString } from '@app/helper/translate-data';
import { getInternalLanguage, setInternalLanguage } from '@app/redux/statecache';
import store from '@app/redux/store';
import { cacheLiveActivityAssets } from '@app/service/storage';
import tw from '@app/tailwind';
import { ConditionalTester } from '@app/view/testing/tester';
import * as eva from '@eva-design/eva';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { Environment, IHostService, IHttpService, ITranslationService, OS, registerService, SERVICE_NAME } from '@nex/data';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Device from 'expo-device';
import * as Notifications from '../service/notifications';
import { SplashScreen, Stack, useNavigation, useRouter } from 'expo-router';
import { LiveActivity } from 'modules/widget';
import { useColorScheme as useTailwindColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus, BackHandler, LogBox, Platform, StatusBar, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD2DarkTheme as PaperDarkTheme, MD2LightTheme as PaperDefaultTheme, PaperProvider, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Provider as ReduxProvider } from 'react-redux';
import '../../../global.css';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { appConfig } from '@nex/dataset';
import UpdateSnackbar from '@app/view/components/snackbar/update-snackbar';
import ChangelogSnackbar from '@app/view/components/snackbar/changelog-snackbar';
import ErrorSnackbar from '@app/view/components/snackbar/error-snackbar';
import { useEventListener } from 'expo';
import { useAccountData } from '@app/queries/all';

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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // retry: (failureCount, error) => {
            //     if (error.message == 'Unauthorized') return false;
            //     if (failureCount < 2) return true;
            //     return false;
            // }
        },
    },
});

SplashScreen.preventAutoHideAsync();

// Introduced in SDK 52, but it seems to be not available when imported from expo router.
// SplashScreen.setOptions({
//     duration: 1000,
//     fade: true,
// });

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

registerService(SERVICE_NAME.TRANSLATION_SERVICE, new AoeDataService(), true);
registerService(SERVICE_NAME.HOST_SERVICE, new HostService(), true);
registerService(SERVICE_NAME.HTTP_SERVICE, new HttpService(), true);

const isMobile = ['Android', 'iOS'].includes(Device.osName!);

// If we use these hooks in the AppWrapper, every change will trigger
// a rerender of the AppWrapper which costs performance.
function LanguageController() {
    const language = useAccountData(account => account.language);

    useEffect(() => {
        if (!language) return;
        setInternalLanguage(language);
        fetchAoeReferenceData();
    }, [language]);

    return <View />;
}

// If we use these hooks in the AppWrapper, every change will trigger
// a rerender of the AppWrapper which costs performance.
function AccountController() {

    // const { data: configMainPage } = useAccount(data => data.mainPage);
    // console.log('ACCOUNT in layout configMainPage', configMainPage);

    // console.log('ACCOUNT in layout configMainPage');


    // const account = useAccount();
    // console.log('account in layout', account);
    return <View />;
}

function LiveActivityController() {
    const accountId = useAccountData((state) => state.accountId);

    useEventListener(LiveActivity, 'onTokenChanged', async ({ token }) => {
        console.log('onTokenChanged', accountId, token);
        if (token) {
            await setAccountLiveActivityToken(accountId!, token);
        }
    });

    useEventListener(LiveActivity, 'onActivityStarted', async ({ token, data, type }) => {
        const { match } = JSON.parse(data);
        console.log('onActivityStarted', accountId, token, type, match.matchId);
        if (token && type && match) {
            await storeLiveActivityStarted(accountId!, token, type, match.matchId);
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
    const [ , , setTailwindReactNativeColorScheme] = useAppColorScheme(tw);
    const deviceColorScheme = useColorScheme();

    const darkMode = deviceColorScheme || 'light';

    useEffect(() => {
        setTailwindColorScheme(darkMode);
        setTailwindReactNativeColorScheme(darkMode);
    }, [darkMode]);

    return {
        paperTheme: darkMode === 'light' ? customPaperTheme : customDarkPaperTheme,
        evaTheme: darkMode === 'light' ? eva.light : eva.dark,
        customTheme: darkMode === 'light' ? customLightTheme : customDarkTheme,
        contentTheme: darkMode === 'light' ? 'dark-content' : 'light-content',
    } as const;
}

function AppWrapper() {
    const [appIsReady, setAppIsReady] = useState(false);
    const insets = useSafeAreaInsets();
    const { paperTheme, evaTheme, customTheme, contentTheme } = useColorSchemes();

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

    useEffect(() => {
        if (fontsLoaded) {
            setAppIsReady(true);
        }
    }, [fontsLoaded]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            SplashScreen.hide();
        }
    }, [appIsReady]);

    if (!appIsReady) {
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
                <PaperProvider
                    theme={paperTheme}
                    settings={{
                        icon: (props) => <FontAwesome5 {...props} />,
                    }}
                >
                    <ApplicationProvider {...eva} theme={evaTheme}>
                        <ThemeProvider value={customTheme}>
                            <View
                                className={`bg-gold-50 dark:bg-blue-950 ${Platform.OS === 'web' ? `overflow-hidden w-[450px] max-w-full h-[900px] mx-auto my-auto ${isMobile ? '' : 'border border-gray-200 dark:border-gray-800'} rounded-lg` : 'flex-1'}`}
                                style={{ paddingTop: insets.top }}
                                onLayout={onLayoutRootView}
                            >
                                <StatusBar
                                    barStyle={contentTheme}
                                    backgroundColor="transparent"
                                    translucent
                                />

                                <LanguageController />
                                <LiveActivityController />
                                <AccountController />

                                <Portal>
                                    {Platform.OS !== 'web' && <UpdateSnackbar />}
                                    {Platform.OS !== 'web' && <ChangelogSnackbar />}
                                    <ErrorSnackbar />
                                </Portal>

                                <Stack screenOptions={{ header: Header,  }}></Stack>

                                <TabBar></TabBar>
                            </View>
                        </ThemeProvider>
                    </ApplicationProvider>
                </PaperProvider>
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
                <Dummy />
            </QueryClientProvider>
        </ReduxProvider>
    );
}

// Can be removed later. Is just for checking rerender lag reason.
function Dummy() {
    return <AppWrapper />;
}

export default Sentry.wrap(HomeLayout);
