import { ScrollView } from '@app/components/scroll-view';
import ButtonPicker from '@app/view/components/button-picker';
import { MyText } from '@app/view/components/my-text';
import Picker from '@app/view/components/picker';
import * as Notifications from '../../service/notifications';
import { router, Stack } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { deactivatePusher, initPusher } from '@app/helper/pusher';
import { getTranslation } from '@app/helper/translate';
import { DarkMode, setMainPageShown, useMutate, useSelector } from '@app/redux/reducer';
import { setInternalLanguage } from '@app/redux/statecache';
import { getToken } from '@app/service/push';
import { createStylesheet } from '@app/theming-new';
import { appConfig } from '@nex/dataset';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAccount, saveAccount, saveAccountThrottled } from '@app/api/account';
import { QUERY_KEY_ACCOUNT, useAccount } from '@app/app/_layout';


export default function SettingsPage() {
    const styles = useStyles();
    const mutate = useMutate();
    const auth = useSelector((state) => state.auth);
    const accountId = useSelector((state) => state.account.id);
    const following = useSelector((state) => state.following);
    const [loadingPushNotificationEnabled, setLoadingPushNotificationEnabled] = useState(false);
    const { data: account } = useAccount();

    const queryClient = useQueryClient();

    const saveAccountMutation = useMutation({
        mutationKey: ['saveAccount'],
        mutationFn: saveAccountThrottled,
        onMutate: async (_account) => {
            console.log('ON MUTATE', _account.darkMode);
            await queryClient.cancelQueries({ queryKey: QUERY_KEY_ACCOUNT() });
            const previousAccount = queryClient.getQueryData(QUERY_KEY_ACCOUNT());
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), _account);
            return { previousAccount, _account };
        },
        onError: (err, _account, context) => {
            console.log('ON ERROR');
            queryClient.setQueryData(QUERY_KEY_ACCOUNT(), context?.previousAccount);
        },
        onSettled: async (_account) => {
            console.log('ON SETTLED');
            console.log('ON SETTLED IS PENDING', queryClient.isMutating({ mutationKey: ['saveAccount'] }));
            if (queryClient.isMutating({ mutationKey: ['saveAccount'] }) === 1) {
                await queryClient.invalidateQueries({ queryKey: QUERY_KEY_ACCOUNT() }); // , refetchType: 'all'
                console.log('ON SETTLED INVALIDATED');
            }
        },
    });

    // const togglePreventScreenLockOnGuidePage = async () => {
    //     const newConfig = {
    //         ...config,
    //         preventScreenLockOnGuidePage: !config.preventScreenLockOnGuidePage,
    //     };
    //     await saveConfigToStorage(newConfig);
    //     mutate(setConfig(newConfig));
    // };

    const enablePushNotificationsMobile = async (notificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        try {
            let token: string | undefined = undefined;
            if (notificationsEnabled) {
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

                token = await getToken();
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
            }

            saveAccountMutation.mutate({
                ...account!,
                notificationsEnabled,
                pushToken: token,
            });
        } catch (e) {
            alert('Changing Push Notification setting failed.\n\n' + e);
        }
        setLoadingPushNotificationEnabled(false);
    };

    const enablePushNotificationsWeb = async (notificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        try {
            let token: string | undefined = undefined;

            if (notificationsEnabled) {
                // if (__DEV__) {
                //     if (auth && auth.profileId) {
                //         await setAccountProfile(accountId, { profile_id: auth.profileId });
                //     }
                //     await follow(
                //         accountId,
                //         following.map((p) => p.profileId),
                //         true
                //     );
                //     return;
                // }

                token = await initPusher();
            } else {
                await deactivatePusher();
            }

            saveAccountMutation.mutate({
                ...account!,
                notificationsEnabled,
                pushTokenWeb: token,
            });
        } catch (e) {
            alert('Changing Push Notification setting failed.\n\n' + e);
        }
        setLoadingPushNotificationEnabled(false);
    };

    const togglePushNotifications = () => {
        if (Platform.OS === 'web') {
            return enablePushNotificationsWeb(!account?.notificationsEnabled);
        }
        return enablePushNotificationsMobile(!account?.notificationsEnabled);
    };

    const languageMap: Record<string, string> = {
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

    const values: DarkMode[] = ['light', 'dark', 'system'];

    const setDarkMode = async (darkMode: any) => {
        saveAccountMutation.mutate({
            ...account!,
            darkMode,
        });
    };

    const onLanguageSelected = async (language: string) => {
        saveAccountMutation.mutate({
            ...account!,
            language,
        });
        setInternalLanguage(language);
    };

    const onMainPageSelected = async (mainPage: string) => {
        saveAccountMutation.mutate({
            ...account!,
            mainPage,
        });
        mutate(setMainPageShown(true));
    };

    return (
        <ScrollView contentContainerStyle="min-h-full p-5">
            <Stack.Screen options={{ title: getTranslation('settings.title') }} />

            {(true || Platform.OS !== 'web') ? (
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <MyText>{getTranslation('settings.darkmode')}</MyText>
                        <MyText style={styles.small}>{getTranslation('settings.darkmode.note')}</MyText>
                    </View>
                    <View style={styles.cellValue}>
                        <ButtonPicker
                            value={account?.darkMode}
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
                            status={account?.notificationsEnabled ? 'checked' : 'unchecked'}
                            onPress={togglePushNotifications}
                        />
                        <TouchableOpacity onPress={togglePushNotifications} disabled={loadingPushNotificationEnabled}>
                            <MyText style={[styles.testLink]}>
                                {account?.notificationsEnabled ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive')}
                            </MyText>
                        </TouchableOpacity>
                    </View>
                    <Button onPress={() => router.navigate('/more/push')} mode="contained" compact uppercase={false} dark>
                        {getTranslation('settings.pushnotifications.action.test')}
                    </Button>
                </View>
            </View>

            {/*<View style={styles.row}>*/}
            {/*    <View style={styles.cellName}>*/}
            {/*        <MyText>{getTranslation('settings.preventscreenlock')}</MyText>*/}
            {/*        <MyText style={styles.small}>{getTranslation('settings.preventscreenlock.note')}</MyText>*/}
            {/*    </View>*/}
            {/*    <View style={styles.cellValueCol}>*/}
            {/*        <View style={styles.row2}>*/}
            {/*            <Checkbox.Android*/}
            {/*                status={config.preventScreenLockOnGuidePage ? 'checked' : 'unchecked'}*/}
            {/*                onPress={togglePreventScreenLockOnGuidePage}*/}
            {/*            />*/}
            {/*            <TouchableOpacity onPress={togglePreventScreenLockOnGuidePage} disabled={Platform.OS === 'web'}>*/}
            {/*                <MyText style={[styles.testLink]}>*/}
            {/*                    {config.preventScreenLockOnGuidePage ? getTranslation('checkbox.active') : getTranslation('checkbox.inactive')}*/}
            {/*                </MyText>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</View>*/}

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
                        value={account?.language}
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
                            value={account?.mainPage || '/'}
                            values={
                                appConfig.game === 'aoe2de'
                                    ? [
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
                                      ]
                                    : [
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
                                      ]
                            }
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
