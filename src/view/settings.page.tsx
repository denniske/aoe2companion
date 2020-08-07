import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {DarkMode, setConfig, useMutate, useSelector} from "../redux/reducer";
import {capitalize} from "lodash-es";
import {saveConfigToStorage} from "../service/storage";
import Picker from "./components/picker";
import {ITheme, makeVariants, useTheme} from "../theming";
import { Checkbox } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {appVariants} from "../styles";
import {getToken} from "../service/push";
import {follow, setAccountProfile, setAccountPushToken, setNotificationConfig} from "../api/following";
import * as Notifications from "expo-notifications";
import {IosAuthorizationStatus} from "expo-notifications/build/NotificationPermissions.types";
import * as Permissions from "expo-permissions";


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

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>Dark Mode</MyText>
                    <MyText style={styles.small}>(except build order guides)</MyText>
                </View>
                <View style={styles.cellValue}>
                    <Picker value={config.darkMode} values={values} formatter={capitalize} onSelect={setDarkMode}/>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cellName}>
                    <MyText>Push notifications</MyText>
                    <MyText style={styles.small}>Receive push notification when players you are following start a game.</MyText>
                </View>
                <View style={styles.cellValueRow}>
                    <Checkbox.Android
                        disabled={loadingPushNotificationEnabled}
                        status={config.pushNotificationsEnabled ? 'checked' : 'unchecked'}
                        onPress={() => {
                            enablePushNotifications(!config.pushNotificationsEnabled);
                        }}
                    />
                    <MyText style={appStyles.link} onPress={() => navigation.navigate('Push')}>Troubleshoot</MyText>
                </View>
            </View>
        </ScrollView>
    );
}

const padding = 5;

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        cellName: {
            padding: padding,
            flex: 1,
        },
        cellValue: {
            padding: padding,
            flex: 1,
        },
        cellValueRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: padding,
            flex: 1,
        },
        row: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        container: {
            minHeight: '100%',
            alignItems: 'center',
            padding: 20,
        },
        small: {
            fontSize: 12,
            color: theme.textNoteColor,
        },
    });
};

const variants = makeVariants(getStyles);
