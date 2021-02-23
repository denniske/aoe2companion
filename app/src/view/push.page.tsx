import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import { makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {Button} from "react-native-paper";
import {AndroidNotificationPriority} from "expo-notifications";
import {IosAuthorizationStatus} from "expo-notifications/build/NotificationPermissions.types";
import {maskToken} from "../service/push";
import {useSelector} from "../redux/reducer";
import Space from "./components/space";
import {createStylesheet} from '../theming-new';
import {getTranslation} from '../helper/translate';
import {RootStackParamList} from '../../App';
import {getRootNavigation} from '../service/navigation';
import {sendTestPushNotificationElectron, sendTestPushNotificationWeb} from '../api/following';
import {initPusher} from '../helper/pusher';
import {getElectronPushToken, isElectron} from '../helper/electron';

interface FirebaseData {
    title?: string;
    message?: string;
    subtitle?: string;
    sound?: boolean | string;
    vibrate?: boolean | number[];
    priority?: AndroidNotificationPriority;
    badge?: number;
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendTestPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Test Notification',
        body: 'This is a test!',
        data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}



export default function PushPage() {
    const styles = useStyles();
    const [messages, setMessages] = useState<string[]>([]);
    const [pushToken, setPushToken] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef<any>();
    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    const account = useSelector(state => state.account);

    const log = (...message: any) => {
        console.log('push', ...message);
        setMessages(messages => [...messages, message.join(' ')]);
    };

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
            const settings = await Notifications.getPermissionsAsync();
            let newStatus = settings.granted || settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
            log('newPermission', newStatus);
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            log('existingPermission', existingStatus);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            log('finalPermission', finalStatus);
            if (finalStatus !== 'granted') {
                log('Failed to get push token for push notification!');
                return;
            }

            // throw "Deliberate Error!";

            token = (await Notifications.getExpoPushTokenAsync()).data;
            log(maskToken(token));

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }

        return token;
    }

    const registerForPushNotificationsWebAsync = async () => {
        return await initPusher();
    }

    const registerForPushNotificationsElectronAsync = async () => {
        return await getElectronPushToken();
    }

    useEffect(() => {
        log('registerForPushNotificationsAsync');

        if (Constants.isDevice) {
            if (Platform.OS === 'web') {
                if (isElectron()) {
                    registerForPushNotificationsElectronAsync().then(token => setPushToken(token)).catch(e => log(e, e.message));
                } else {
                    registerForPushNotificationsWebAsync().then(token => setPushToken(token)).catch(e => log(e, e.message));
                }
            } else {
                registerForPushNotificationsAsync().then(token => setPushToken(token)).catch(e => log(e, e.message));
            }
        } else {
            log('Must use physical device for Push Notifications');
        }

        try {
            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(notification2 => {
                log('notificationListener (PUSH)', notification2);
                setNotification(notification2);
            });
        } catch(e) {
            log(e);
        }

        return () => {
            try {
                Notifications.removeNotificationSubscription(notificationListener.current);
            } catch(e) {
                log(e);
            }
        };
    }, []);

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    useEffect(() => {
        if (lastNotificationResponse && lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            log('responseListener (PUSH)', lastNotificationResponse.notification);
            setNotification(lastNotificationResponse.notification);
        }
    }, [lastNotificationResponse]);

    const nav = async (route: keyof RootStackParamList, params: any) => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: route, params}]
        });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <MyText>{account ? getTranslation('push.heading.account') : ''}</MyText>
            <MyText>{account ? account.id : getTranslation('push.error.noaccount')}</MyText>
            <Space/>
            <MyText>{pushToken ? maskToken(pushToken) : getTranslation('push.error.nopushtoken')}</MyText>
            {
                notification &&
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Space/>
                    <MyText>{getTranslation('push.heading.notification')}:</MyText>
                    <Space/>
                    <MyText>Date: {notification.date} </MyText>
                    <MyText>Title: {notification.request.content.title} </MyText>
                    <MyText>Body: {notification.request.content.body}</MyText>
                    <MyText>Data: {JSON.stringify(notification.request.content.data)}</MyText>
                </View>
            }
            <Space/>
            {
                pushToken &&
                <>
                    <Button
                        mode="outlined"
                        onPress={async () => {
                            if (Platform.OS === 'web') {
                                if (isElectron()) {
                                    await sendTestPushNotificationElectron(pushToken);
                                } else {
                                    await sendTestPushNotificationWeb(pushToken);
                                }
                            } else {
                                await sendTestPushNotification(pushToken);
                            }
                        }}
                    >
                        {getTranslation('push.action.sendtestnotification')}
                    </Button>
                    <Space/>
                    <MyText style={styles.note}>{getTranslation('push.action.sendtestnotification.note')}</MyText>
                </>
            }
            {
                __DEV__ && Platform.OS !== 'web' &&
                <>
                    <Button
                        mode="outlined"
                        onPress={async () => {
                            nav('Feed', { match_id: 'xxx' + new Date().getTime() });
                        }}
                    >
                        {getTranslation('push.action.sendtestnotification')}
                    </Button>
                </>
            }
            <Space/>
            <MyText>{getTranslation('push.heading.troubleshoot')}:</MyText>
            <Space/>
            {
                messages.map((message, i) =>
                    <MyText key={i}>{message}</MyText>
                )
            }
        </ScrollView>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    note: {
        color: theme.textNoteColor,
        textAlign: 'center',
    },
}));
