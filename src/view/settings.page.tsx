import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MyText} from "./components/my-text";
import {DarkMode, setConfig, useMutate, useSelector} from "../redux/reducer";
import {capitalize} from "lodash-es";
import {saveConfigToStorage} from "../service/storage";
import Picker from "./components/picker";
import {ITheme, makeVariants, useTheme} from "../theming";
import {Button, Checkbox, Switch} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {appVariants} from "../styles";
import {getToken} from "../service/push";
import {follow, setAccountProfile, setAccountPushToken, setNotificationConfig} from "../api/following";
import * as Notifications from "expo-notifications";
import {IosAuthorizationStatus} from "expo-notifications/build/NotificationPermissions.types";
import * as Permissions from "expo-permissions";
import ButtonPicker from "./components/button-picker";


export default function SettingsPage() {
    const styles = useTheme(variants);
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

    const enablePushNotifications = async (pushNotificationsEnabled: any) => {
        setLoadingPushNotificationEnabled(true);
        // try {
        //     if (pushNotificationsEnabled) {
        //         const settings = await Notifications.getPermissionsAsync();
        //         let newStatus = settings.granted || settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
        //         console.log('newPermission', newStatus);
        //         const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        //         console.log('existingPermission', existingStatus);
        //         let finalStatus = existingStatus;
        //         if (existingStatus !== 'granted') {
        //             const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        //             finalStatus = status;
        //         }
        //         console.log('finalPermission', finalStatus);
        //         if (finalStatus !== 'granted') {
        //             console.log('Failed to get push token for push notification!');
        //             return;
        //         }
        //
                const token = await getToken();
        //         if (!token) {
        //             throw 'Could not create token';
        //         }
        //
        //         if (Platform.OS === 'android') {
        //             await Notifications.setNotificationChannelAsync('default', {
        //                 name: 'default',
        //                 importance: Notifications.AndroidImportance.MAX,
        //                 vibrationPattern: [0, 250, 250, 250],
        //                 lightColor: '#FF231F7C',
        //             });
        //         }
        //
        //         await setAccountPushToken(accountId, token);
        //         if (auth && auth.profile_id) {
        //             await setAccountProfile(accountId, auth.profile_id, auth.steam_id);
        //         }
        //         await follow(accountId, following.map(p => p.profile_id), true);
        //     }
        //
        //     await setNotificationConfig(accountId, pushNotificationsEnabled);
        //
            const newConfig = {
                ...config,
                pushNotificationsEnabled,
            };
            await saveConfigToStorage(newConfig)
            mutate(setConfig(newConfig));
        // } catch (e) {
        //     alert('Changing Push Notification setting failed.\n\n' + e);
        // }
        setLoadingPushNotificationEnabled(false);
    };

    const togglePushNotifications = () => enablePushNotifications(!config.pushNotificationsEnabled);

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>Dark Mode</MyText>
                    <MyText style={styles.small}>(except build order guides)</MyText>
                </View>
                <View style={styles.cellValue}>
                    <ButtonPicker value={config.darkMode} values={values} formatter={capitalize} onSelect={setDarkMode}/>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>Push Notifications</MyText>
                    <MyText style={styles.small}>Receive push notifications when players you are following start a game.</MyText>
                </View>
                <View style={styles.cellValueCol}>
                    {/*<Switch*/}
                    {/*    disabled={loadingPushNotificationEnabled}*/}
                    {/*    value={config.pushNotificationsEnabled}*/}
                    {/*    onValueChange={() => {*/}
                    {/*        enablePushNotifications(!config.pushNotificationsEnabled);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <View style={styles.row2}>
                        <Checkbox.Android
                            disabled={loadingPushNotificationEnabled}
                            status={config.pushNotificationsEnabled ? 'checked' : 'unchecked'}
                            onPress={togglePushNotifications}
                        />
                        <TouchableOpacity onPress={togglePushNotifications}>
                            <MyText style={[styles.testLink]}>{config.pushNotificationsEnabled ? 'Enabled' : 'Disabled'}</MyText>
                        </TouchableOpacity>
                    </View>
                    <Button
                        onPress={() => navigation.navigate('Push')}
                        mode="contained"
                        compact
                        uppercase={false}
                        dark={true}
                    >
                        Test
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const paddingHorizontal = 12;
const paddingVertical = 5;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);
