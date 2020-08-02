import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
import {MyText} from "./components/my-text";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {Button} from "react-native-paper";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

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

    const log = (...message: any) => {
        setMessages(messages => [...messages, message.join(' ')]);
    };

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            log(existingStatus);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            log(finalStatus);
            if (finalStatus !== 'granted') {
                log('Failed to get push token for push notification!');
                return;
            }

            // throw "Deliberate Error!";

            token = (await Notifications.getExpoPushTokenAsync()).data;
            log(token);

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }
        // else {
        //     alert('Must use physical device for Push Notifications');
        // }

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
            style={{
                flex: 1,
                padding: 20,
            }}
            contentContainerStyle={{
                alignItems: 'center',
            }}>
            <MyText style={{textAlign: 'center'}}>Secret expo push token: {expoPushToken}</MyText>
            <MyText/>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MyText>Title: {notification && notification.request.content.title} </MyText>
                <MyText>Body: {notification && notification.request.content.body}</MyText>
                <MyText>Data: {notification && JSON.stringify(notification.request.content.data)}</MyText>
            </View>
            <MyText/>
            {
                expoPushToken &&
                <Button
                    onPress={async () => {
                        await sendPushNotification(expoPushToken);
                    }}
                >
                    Press to Send Notification
                </Button>
            }
            <MyText/>
            <MyText>Messages:</MyText>
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

    });
};

const variants = makeVariants(getStyles);
