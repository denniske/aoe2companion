import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
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
async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
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
    const styles = useTheme(variants);
    const theme = useAppTheme();
    const [messages, setMessages] = useState<string[]>([]);
    const [expoPushToken, setExpoPushToken] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const account = useSelector(state => state.account);

    const log = (...message: any) => {
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

    useEffect(() => {
        log('registerForPushNotificationsAsync');

        if (Constants.isDevice) {
            registerForPushNotificationsAsync().then(token => setExpoPushToken(token)).catch(e => log(e, e.message));
        } else {
            log('Must use physical device for Push Notifications');
        }

        try {
            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(notification2 => {
                log('notificationListener', notification2);
                setNotification(notification2);
            });

            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                log('responseListener', response.notification);
                setNotification(response.notification);
            });
        } catch(e) {
            log(e);
        }

        return () => {
            try {
                log('remove', notificationListener.current);
                Notifications.removeNotificationSubscription(notificationListener.current);
                log('remove2', responseListener);
                Notifications.removeNotificationSubscription(responseListener.current);
            } catch(e) {
                log(e);
            }
        };
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <MyText>{account ? 'Account' : ''}</MyText>
            <MyText>{account ? account.id : 'Could not retrieve account.'}</MyText>
            <Space/>
            <MyText>{expoPushToken ? maskToken(expoPushToken) : 'Could not retrieve push token.'}</MyText>
            {
                notification &&
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Space/>
                    <MyText>Last received notification:</MyText>
                    <Space/>
                    <MyText>Date: {notification.date} </MyText>
                    <MyText>Title: {notification.request.content.title} </MyText>
                    <MyText>Body: {notification.request.content.body}</MyText>
                    <MyText>Data: {JSON.stringify(notification.request.content.data)}</MyText>
                </View>
            }
            <Space/>
            {
                expoPushToken &&
                <>
                    <Button
                        mode="outlined"
                        onPress={async () => {
                            await sendPushNotification(expoPushToken);
                        }}
                    >
                        Send Test Notification
                    </Button>
                    <Space/>
                    <MyText style={styles.note}>Test notification may take a minute to reach your phone.</MyText>
                </>
            }
            <Space/>
            <MyText>Troubleshoot info:</MyText>
            <Space/>
            {
                messages.map((message, i) =>
                    <MyText key={i}>{message}</MyText>
                )
            }
        </ScrollView>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);
