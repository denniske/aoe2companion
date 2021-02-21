import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MyText} from "./components/my-text";
import {DarkMode, setConfig, useMutate, useSelector} from "../redux/reducer";
import {capitalize} from "lodash-es";
import {saveConfigToStorage} from "../service/storage";
import Picker from "./components/picker";
import {makeVariants, useTheme} from "../theming";
import {Button, Checkbox, Switch} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {appVariants} from "../styles";
import {getToken} from "../service/push";
import {
    follow, setAccountProfile, setAccountPushToken, setAccountPushTokenElectron, setAccountPushTokenWeb,
    setNotificationConfig
} from "../api/following";
import * as Notifications from "expo-notifications";
import {IosAuthorizationStatus} from "expo-notifications/build/NotificationPermissions.types";
import * as Permissions from "expo-permissions";
import ButtonPicker from "./components/button-picker";
import {createStylesheet} from '../theming-new';
import {getLanguageFromSystemLocale2, getTranslation} from '../helper/translate';
import {setlanguage} from '../redux/statecache';
import * as Localization from 'expo-localization';
import {deactivatePusher} from '../helper/pusher';
import {initPusher} from '../helper/pusher';
import {getElectronPushToken, isElectron} from '../helper/electron';


export default function SettingsPage() {
    const styles = useStyles();
    const mutate = useMutate();
    const auth = useSelector(state => state.auth);
    const config = useSelector(state => state.config);
    const accountId = useSelector(state => state.account.id);
    const navigation = useNavigation();
    const appStyles = useTheme(appVariants);
    const following = useSelector(state => state.following);
    const [loadingPushNotificationEnabled, setLoadingPushNotificationEnabled] = useState(false);

    const values: DarkMode[] = [
        'light',
        'dark',
        'system',
    ];

    const setDarkMode = async (darkMode: any) => {
        const newConfig = {
            ...config,
            darkMode: darkMode.toLowerCase(),
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    const togglePreventScreenLockOnGuidePage = async () => {
        const newConfig = {
            ...config,
            preventScreenLockOnGuidePage: !config.preventScreenLockOnGuidePage,
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    const enablePushNotificationsMobile = async (pushNotificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        try {
            if (pushNotificationsEnabled) {
                const settings = await Notifications.getPermissionsAsync();
                let newStatus = settings.granted || settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
                console.log('newPermission', newStatus);
                const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                console.log('existingPermission', existingStatus);
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                    finalStatus = status;
                }
                console.log('finalPermission', finalStatus);
                if (finalStatus !== 'granted') {
                    console.log('Failed to get push token for push notification!');
                    return;
                }

                const token = await getToken();
                if (!token) {
                    throw 'Could not create token';
                }

                if (Platform.OS === 'android') {
                    await Notifications.setNotificationChannelAsync('default', {
                        name: 'default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#FF231F7C',
                    });
                }

                await setAccountPushToken(accountId, token);
                if (auth && auth.profile_id) {
                    await setAccountProfile(accountId, auth.profile_id, auth.steam_id);
                }
                await follow(accountId, following.map(p => p.profile_id), true);
            }

            await setNotificationConfig(accountId, pushNotificationsEnabled);

            const newConfig = {
                ...config,
                pushNotificationsEnabled,
            };
            await saveConfigToStorage(newConfig)
            mutate(setConfig(newConfig));
        } catch (e) {
            alert('Changing Push Notification setting failed.\n\n' + e);
        }
        setLoadingPushNotificationEnabled(false);
    };

    const enablePushNotificationsWeb = async (pushNotificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        try {
            if (pushNotificationsEnabled) {
                const token = await initPusher();

                await setAccountPushTokenWeb(accountId, token);
                if (auth && auth.profile_id) {
                    await setAccountProfile(accountId, auth.profile_id, auth.steam_id);
                }
                await follow(accountId, following.map(p => p.profile_id), true);
            } else {
                await deactivatePusher();
            }

            await setNotificationConfig(accountId, pushNotificationsEnabled);

            const newConfig = {
                ...config,
                pushNotificationsEnabled,
            };
            await saveConfigToStorage(newConfig)
            mutate(setConfig(newConfig));
        } catch (e) {
            alert('Changing Push Notification setting failed.\n\n' + e);
        }
        setLoadingPushNotificationEnabled(false);
    };

    const enablePushNotificationsElectron = async (pushNotificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        try {
            if (pushNotificationsEnabled) {
                const token = await getElectronPushToken();

                await setAccountPushTokenElectron(accountId, token);
                if (auth && auth.profile_id) {
                    await setAccountProfile(accountId, auth.profile_id, auth.steam_id);
                }
                await follow(accountId, following.map(p => p.profile_id), true);
            }

            await setNotificationConfig(accountId, pushNotificationsEnabled);

            const newConfig = {
                ...config,
                pushNotificationsEnabled,
            };
            await saveConfigToStorage(newConfig)
            mutate(setConfig(newConfig));
        } catch (e) {
            alert('Changing Push Notification setting failed.\n\n' + e);
        }
        setLoadingPushNotificationEnabled(false);
    };

    const togglePushNotifications = () => {
        if (Platform.OS === 'web') {
            if (isElectron()) {
                return enablePushNotificationsElectron(!config.pushNotificationsEnabled);
            } else {
                return enablePushNotificationsWeb(!config.pushNotificationsEnabled);
            }
        }
        return enablePushNotificationsMobile(!config.pushNotificationsEnabled);
    };

    const languageMap: Record<string, string> = {
        'system': 'System (' + Localization.locale + ')',
        'ms': 'Bahasa Melayu',
        'de': 'Deutsch',
        'en': 'English',
        'es': 'Español',
        'es-mx': 'Español (Mexico)',
        'fr': 'Français',
        'it': 'Italiano',
        'pt': 'Português-Brasil',
        'ru': 'Pусский',
        'vi': 'Tiếng Việ',
        'tr': 'Türkçe',
        'hi': 'हिन्दी',
        'ja': '日本語',
        'ko': '한국어',
        'zh-hans': '简体中文',
        'zh-hant': '繁體字',
    };

    const formatLanguage = (x: (string | null), inList?: boolean) => {
        return x != null ? languageMap[x] : 'empty';
    };
    const languageList: (string | null)[] = Object.keys(languageMap);
    const divider = (x: any, i: number) => i === 0;
    const onLanguageSelected = async (language: string | null) => {

        const resultingLanguage = language == 'system' ? getLanguageFromSystemLocale2(Localization.locale) : language;
        setlanguage(resultingLanguage);

        const newConfig = {
            ...config,
            language: language!.toLowerCase(),
        };
        await saveConfigToStorage(newConfig)
        mutate(setConfig(newConfig));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>{getTranslation('settings.darkmode')}</MyText>
                    <MyText style={styles.small}>{getTranslation('settings.darkmode.note')}</MyText>
                </View>
                <View style={styles.cellValue}>
                    <ButtonPicker value={config.darkMode} values={values} formatter={x => getTranslation(`settings.darkmode.${x}`)} onSelect={setDarkMode}/>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>{getTranslation('settings.pushnotifications')}</MyText>
                    <MyText style={styles.small}>{getTranslation('settings.pushnotifications.note')}</MyText>
                </View>
                <View style={styles.cellValueCol}>
                    <View style={styles.row2}>
                        <Checkbox.Android
                            disabled={loadingPushNotificationEnabled}
                            status={config.pushNotificationsEnabled ? 'checked' : 'unchecked'}
                            onPress={togglePushNotifications}
                        />
                        <TouchableOpacity onPress={togglePushNotifications} disabled={Platform.OS === 'web'}>
                            <MyText style={[styles.testLink]}>{config.pushNotificationsEnabled ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive')}</MyText>
                        </TouchableOpacity>
                    </View>
                    <Button
                        onPress={() => navigation.navigate('Push')}
                        mode="contained"
                        compact
                        uppercase={false}
                        dark={true}
                    >
                        {getTranslation('settings.pushnotifications.action.test')}
                    </Button>
                </View>
            </View>

            {
                Platform.OS === 'web' &&
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <MyText>{getTranslation('settings.preventscreenlock')}</MyText>
                        <MyText style={styles.small}>{getTranslation('settings.preventscreenlock.note')}</MyText>
                    </View>
                    <View style={styles.cellValueCol}>
                        <View style={styles.row2}>
                            <Checkbox.Android
                                status={config.preventScreenLockOnGuidePage ? 'checked' : 'unchecked'}
                                onPress={togglePreventScreenLockOnGuidePage}
                            />
                            <TouchableOpacity onPress={togglePreventScreenLockOnGuidePage} disabled={Platform.OS === 'web'}>
                                <MyText style={[styles.testLink]}>{config.preventScreenLockOnGuidePage ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive')}</MyText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>{getTranslation('settings.language')}</MyText>
                    <MyText style={styles.small}>{getTranslation('settings.language.note')}</MyText>
                </View>
                <View style={styles.cellValueCol}>
                    <Picker itemHeight={40} textMinWidth={150} divider={divider} value={config.language || 'en'} values={languageList} formatter={formatLanguage} onSelect={onLanguageSelected}/>
                </View>
            </View>
        </ScrollView>
    );
}

const paddingHorizontal = 12;
const paddingVertical = 5;

const useStyles = createStylesheet(theme => StyleSheet.create({
    testLink: {
        // marginLeft: 10,
    },
    cellName: {
        // backgroundColor: 'grey',
        paddingHorizontal,
        paddingVertical,
        flex: 1,
    },
    cellValue: {
        paddingHorizontal,
        paddingVertical,
        flex: 1,
    },
    cellValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal,
        paddingVertical,
        flex: 1,
    },
    cellValueCol: {
        // backgroundColor: 'grey',
        // flexDirection: 'column',
        // alignItems: 'center',
        paddingHorizontal,
        paddingVertical,
        flex: 1,
    },
    row: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    row2: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: -8,
    },
    container: {
        minHeight: '100%',
        padding: 20,
    },
    small: {
        fontSize: 12,
        color: theme.textNoteColor,
    },
}));
