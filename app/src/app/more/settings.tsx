import { ScrollView } from '@app/components/scroll-view';
import { MyText } from '@app/view/components/my-text';
import Picker from '@app/view/components/picker';
import * as Notifications from '../../service/notifications';
import { router, Stack } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '@app/components/button';
import { deactivatePusher, initPusher } from '@app/helper/pusher';
import { setMainPageShown, useMutate } from '@app/redux/reducer';
import { getToken } from '@app/service/push';
import { createStylesheet } from '@app/theming-new';
import { appConfig } from '@nex/dataset';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useAccount } from '@app/queries/all';
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useAppTheme } from '@app/theming';
import { Icon } from '@app/components/icon';
import { Checkbox as CheckboxNew } from '@app/components/checkbox';
import { useTranslation } from '@app/helper/translate';
import { showAlert } from '@app/helper/alert';

export default function SettingsPage() {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const mutate = useMutate();
    const [loadingPushNotificationEnabled, setLoadingPushNotificationEnabled] = useState(false);
    const { data: account } = useAccount();
    const theme = useAppTheme();

    const saveAccountMutation = useSaveAccountMutation();

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
                notificationsEnabled,
                pushToken: token,
            });
        } catch (e) {
            showAlert(getTranslation('settings.error.pushnotification', { error: e as string }));
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
                notificationsEnabled,
                pushTokenWeb: token,
            });
        } catch (e) {
            showAlert(getTranslation('settings.error.pushnotification', { error: e as string }));
        }
        setLoadingPushNotificationEnabled(false);
    };

    const togglePushNotifications = () => {
        // if (Platform.OS === 'web') {
        //     return enablePushNotificationsWeb(!account?.notificationsEnabled);
        // }
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

    const onLanguageSelected = async (language: string) => {
        saveAccountMutation.mutate({
            ...account!,
            language,
        });
    };

    const onMainPageSelected = async (mainPage: string) => {
        saveAccountMutation.mutate({
            mainPage,
        });
        mutate(setMainPageShown(true));
    };

    // const [booly, setBooly] = useState(false);

    return (
        <ScrollView contentContainerStyle="min-h-full p-5">
            <Stack.Screen options={{ title: getTranslation('settings.title') }} />

            {Platform.OS !== 'web' && (
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <MyText>{getTranslation('settings.pushnotifications')}</MyText>
                        <MyText style={styles.small}>{getTranslation('settings.pushnotifications.note')}</MyText>
                    </View>
                    <View style={styles.cellValueCol}>
                        <View style={styles.row2}>
                            <CheckboxNew
                                disabled={loadingPushNotificationEnabled}
                                checked={account?.notificationsEnabled}
                                onPress={togglePushNotifications}
                            />
                            <View className="flex-1" />
                            <Button onPress={() => router.navigate('/more/push')}>
                                {getTranslation('settings.pushnotifications.action.test')}
                            </Button>
                        </View>
                    </View>
                </View>
            )}

            {/*<View style={styles.row}>*/}
            {/*    <View style={styles.cellName}>*/}
            {/*        <MyText>{getTranslation('settings.pusher')}</MyText>*/}
            {/*        <MyText style={styles.small}>{getTranslation('settings.pusher.note')}</MyText>*/}
            {/*    </View>*/}
            {/*    <View style={styles.cellValueCol}>*/}
            {/*        <View style={styles.row2}>*/}
            {/*            <CheckboxNew checked={account?.pusherEnabled} onPress={() => togglePusher()} />*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</View>*/}

            {/*<View style={styles.row2}>*/}
            {/*    <CheckboxNew checked={booly} onPress={() => setBooly(!booly)} />*/}
            {/*</View>*/}
            {/*<View style={styles.row2}>*/}
            {/*    /!*<FontAwesome6 name="check" size={14} color={theme.textNoteColor} />*!/*/}
            {/*    /!*<FontAwesome5 name="check" size={14} color={theme.textNoteColor} />*!/*/}
            {/*    /!*<FontAwesome name="check"  size={14} color={theme.textNoteColor}/>*!/*/}
            {/*    /!*<FontAwesome6 name="square-check" size={24} color="black" />*!/*/}
            {/*    /!*<FontAwesome6 name="check" size={24} color="black" />*!/*/}
            {/*    /!*<Icon icon="check-circle" color="brand" size={20}  />*!/*/}
            {/*    /!*<Icon icon="check" color="brand" size={20}  />*!/*/}
            {/*    /!*<Icon icon="square" color="brand" size={20}  />*!/*/}
            {/*    /!*<Icon icon="square" color="brand" prefix="fass" size={20}  />*!/*/}
            {/*    <Icon icon="square-check" color="brand" size={20}  />*/}
            {/*    <Icon icon="square-check" color="brand" prefix="fasr" size={20}  />*/}
            {/*    <Icon icon="square" color="brand" prefix="fasr" size={20}  />*/}
            {/*</View>*/}


            {/*<Button onPress={() => router.navigate('/more/push')}>*/}
            {/*    {getTranslation('settings.pushnotifications.action.test')}*/}
            {/*</Button>*/}

            {/*<Button onPress={() => router.navigate('/more/push')} mode="contained" compact uppercase={false} dark>*/}
            {/*    {getTranslation('settings.pushnotifications.action.test')}*/}
            {/*</Button>*/}

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
                        popupAlign="right"
                        container="flatlist"
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
                            popupAlign="right"
                            container="flatlist"
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
        cellValueCol: {
            // backgroundColor: 'grey',
            // flexDirection: 'column',
            // alignItems: 'center',
            // justifyContent: 'flex-start',
            paddingHorizontal,
            // paddingVertical,
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
