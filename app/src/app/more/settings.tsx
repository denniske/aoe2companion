import { ScrollView } from '@app/components/scroll-view';
import ButtonPicker from '@app/view/components/button-picker';
import { MyText } from '@app/view/components/my-text';
import Picker from '@app/view/components/picker';
import { clamp } from '@nex/data';
import { useNavigation } from '@react-navigation/native';
import * as Localization from 'expo-localization';
import * as Notifications from '../../service/notifications';
import { Stack, router } from 'expo-router';
import { capitalize, merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';

import {
    follow, setAccountLanguage,
    setAccountProfile,
    setAccountPushToken,
    setAccountPushTokenWeb,
    setNotificationConfig,
} from '../../api/following';
import { deactivatePusher, initPusher } from '../../helper/pusher';
import { getLanguageFromSystemLocale2, getTranslation } from '../../helper/translate';
import { DarkMode, setConfig, useMutate, useSelector } from '../../redux/reducer';
import { setInternalLanguage } from '../../redux/statecache';
import { getToken } from '../../service/push';
import { saveConfigToStorage } from '../../service/storage';
import { appVariants } from '../../styles';
import { useTheme } from '../../theming';
import { createStylesheet } from '../../theming-new';
import { appConfig } from '@nex/dataset';

export default function SettingsPage() {
    const styles = useStyles();
    const mutate = useMutate();
    const auth = useSelector((state) => state.auth);
    const config = useSelector((state) => state.config);
    const accountId = useSelector((state) => state.account.id);
    const navigation = useNavigation<any>();
    const appStyles = useTheme(appVariants);
    const following = useSelector((state) => state.following);
    const [loadingPushNotificationEnabled, setLoadingPushNotificationEnabled] = useState(false);
    const [overlayOpacityStr, setOverlayOpacityStr] = useState('');
    const [overlayOffsetStr, setOverlayOffsetStr] = useState('');
    const [overlayDurationStr, setOverlayDurationStr] = useState('');
    const [matchCacheSize, setMatchCacheSize] = useState(0);

    useEffect(() => {
        setOverlayOpacityStr(`${config.overlay.opacity}`);
        setOverlayOffsetStr(`${config.overlay.offset}`);
        setOverlayDurationStr(`${config.overlay.duration}`);
    }, [config]);

    const setOverlayOpacity = async (event: any) => {
        const opacity = clamp(parseInt(event.target.value), 1, 100);
        const newConfig = merge({}, config, { overlay: { opacity } });
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    const setOverlayOffset = async (event: any) => {
        const offset = clamp(parseInt(event.target.value), 0, 90);
        const newConfig = merge({}, config, { overlay: { offset } });
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    const setOverlayDuration = async (event: any) => {
        const duration = clamp(parseInt(event.target.value), 5, 1000);
        const newConfig = merge({}, config, { overlay: { duration } });
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    const values: DarkMode[] = ['light', 'dark', 'system'];

    const setDarkMode = async (darkMode: any) => {
        const newConfig = {
            ...config,
            darkMode: darkMode.toLowerCase(),
        };
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    const togglePreventScreenLockOnGuidePage = async () => {
        const newConfig = {
            ...config,
            preventScreenLockOnGuidePage: !config.preventScreenLockOnGuidePage,
        };
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    const enablePushNotificationsMobile = async (pushNotificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        try {
            if (pushNotificationsEnabled) {
                // const settings = await Notifications.getPermissionsAsync();
                // let newStatus = settings.granted || settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
                // console.log('newPermission', newStatus);
                // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                // console.log('existingPermission', existingStatus);
                // let finalStatus = existingStatus;
                // if (existingStatus !== 'granted') {
                //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                //     finalStatus = status;
                // }
                // console.log('finalPermission', finalStatus);
                // if (finalStatus !== 'granted') {
                //     console.log('Failed to get push token for push notification!');
                //     return;
                // }

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
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
                if (auth && auth.profileId) {
                    await setAccountProfile(accountId, { profile_id: auth.profileId });
                }
                await follow(
                    accountId,
                    following.map((p) => p.profileId),
                    true
                );
            }

            await setNotificationConfig(accountId, pushNotificationsEnabled);

            const newConfig = {
                ...config,
                pushNotificationsEnabled,
            };
            await saveConfigToStorage(newConfig);
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
                if (__DEV__) {
                    if (auth && auth.profileId) {
                        await setAccountProfile(accountId, { profile_id: auth.profileId });
                    }
                    await follow(
                        accountId,
                        following.map((p) => p.profileId),
                        true
                    );
                    return;
                }

                const token = await initPusher();

                await setAccountPushTokenWeb(accountId, token);
                if (auth && auth.profileId) {
                    await setAccountProfile(accountId, { profile_id: auth.profileId });
                }
                await follow(
                    accountId,
                    following.map((p) => p.profileId),
                    true
                );
            } else {
                await deactivatePusher();
            }

            await setNotificationConfig(accountId, pushNotificationsEnabled);

            const newConfig = {
                ...config,
                pushNotificationsEnabled,
            };
            await saveConfigToStorage(newConfig);
            mutate(setConfig(newConfig));
        } catch (e) {
            alert('Changing Push Notification setting failed.\n\n' + e);
        }
        setLoadingPushNotificationEnabled(false);
    };

    const togglePushNotifications = () => {
        if (Platform.OS === 'web') {
            return enablePushNotificationsWeb(!config.pushNotificationsEnabled);
        }
        return enablePushNotificationsMobile(!config.pushNotificationsEnabled);
    };

    const languageMap: Record<string, string> = {
        system: 'System (' + Localization.locale + ')',
        ms: 'Bahasa Melayu',
        de: 'Deutsch',
        en: 'English',
        es: 'Español',
        'es-mx': 'Español (Mexico)',
        fr: 'Français',
        it: 'Italiano',
        pt: 'Português-Brasil',
        ru: 'Pусский',
        vi: 'Tiếng Việ',
        tr: 'Türkçe',
        hi: 'हिन्दी',
        ja: '日本語',
        ko: '한국어',
        'zh-hans': '简体中文',
        'zh-hant': '繁體字',
    };

    const formatLanguage = (x: string | null, inList?: boolean) => {
        return x != null ? languageMap[x] : 'empty';
    };
    const languageList: string[] = Object.keys(languageMap);
    const divider = (x: any, i: number) => i === 0;
    const onLanguageSelected = async (language: string) => {
        const resultingLanguage = language == 'system' ? getLanguageFromSystemLocale2(Localization.locale) : language;
        setInternalLanguage(resultingLanguage);

        const newConfig = {
            ...config,
            language: language!.toLowerCase(),
        };
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));

        setAccountLanguage(accountId, resultingLanguage);
    };
    const onMainPageSelected = async (page: string) => {
        const newConfig = {
            ...config,
            mainPage: page,
        };
        await saveConfigToStorage(newConfig);
        mutate(setConfig(newConfig));
    };

    return (
        <ScrollView contentContainerStyle="min-h-full p-5">
            <Stack.Screen options={{ title: getTranslation('settings.title') }} />

            {Platform.OS !== 'web' ? (
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <MyText>{getTranslation('settings.darkmode')}</MyText>
                        <MyText style={styles.small}>{getTranslation('settings.darkmode.note')}</MyText>
                    </View>
                    <View style={styles.cellValue}>
                        <ButtonPicker
                            value={config.darkMode}
                            values={values}
                            formatter={(x) => getTranslation(`settings.darkmode.${x}` as any)}
                            onSelect={setDarkMode}
                        />
                    </View>
                </View>
            ) : null}

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
                        <TouchableOpacity onPress={togglePushNotifications} disabled={loadingPushNotificationEnabled}>
                            <MyText style={[styles.testLink]}>
                                {config.pushNotificationsEnabled ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive')}
                            </MyText>
                        </TouchableOpacity>
                    </View>
                    <Button onPress={() => router.navigate('/more/push')} mode="contained" compact uppercase={false} dark>
                        {getTranslation('settings.pushnotifications.action.test')}
                    </Button>
                </View>
            </View>

            {Platform.OS === 'web' && (
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
                                <MyText style={[styles.testLink]}>
                                    {config.preventScreenLockOnGuidePage ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive')}
                                </MyText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>{getTranslation('settings.language')}</MyText>
                    <MyText style={styles.small}>{getTranslation('settings.language.note')}</MyText>
                </View>
                <View style={styles.cellValueCol}>
                    <Picker
                        itemHeight={40}
                        textMinWidth={150}
                        divider={divider}
                        value={config.language || 'en'}
                        values={languageList}
                        formatter={formatLanguage}
                        onSelect={onLanguageSelected}
                    />
                </View>
            </View>

            {Platform.OS !== 'web' && (
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <MyText>{getTranslation('settings.mainpage')}</MyText>
                        <MyText style={styles.small}>{getTranslation('settings.mainpage.note')}</MyText>
                    </View>
                    <View style={styles.cellValueCol}>
                        <Picker
                            itemHeight={40}
                            textMinWidth={150}
                            divider={divider}
                            value={config.mainPage || '/'}
                            values={appConfig.game === 'aoe2de' ? [
                                '/',
                                '/matches',
                                '/matches/live',
                                '/matches/users',
                                '/explore',
                                '/explore/civilizations',
                                '/explore/units',
                                '/explore/buildings',
                                '/explore/technologies',
                                '/explore/build-orders',
                                '/explore/tips',
                                '/statistics',
                                '/competitive',
                                '/competitive/games',
                                '/competitive/tournaments',
                            ] : [
                                '/',
                                '/matches',
                                '/matches/live',
                                '/matches/users',
                                '/explore',
                                // '/explore/civilizations',
                                // '/explore/units',
                                // '/explore/buildings',
                                // '/explore/technologies',
                                // '/explore/build-orders',
                                // '/explore/tips',
                                '/statistics',
                                '/competitive',
                                // '/competitive/games',
                                '/competitive/tournaments',
                            ]}
                            formatter={(value) =>
                                value === '/'
                                    ? 'Home'
                                    : value
                                          .split('/')
                                          .map((segment) => capitalize(segment.replace('-', ' ')))
                                          .filter((segment) => segment)
                                          .join(' > ')
                            }
                            onSelect={onMainPageSelected}
                        />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const paddingHorizontal = 12;
const paddingVertical = 5;

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        testLink: {
            // marginLeft: 10,
        },
        cellName: {
            // backgroundColor: 'grey',
            paddingHorizontal,
            paddingVertical,
            flex: 1,
            alignSelf: 'flex-start',
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
    } as const)
);
