import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MyText } from '@app/view/components/my-text';
import Constants from 'expo-constants';
import { Button } from '@app/components/button';
import { maskAccountId, maskToken } from '../../service/push';
import Space from '@app/view/components/space';
import { createStylesheet } from '../../theming-new';
import { sendTestPushNotificationWeb } from '../../api/following';
import { initPusher } from '../../helper/pusher';
import { router, Stack } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import * as Device from 'expo-device';
import { useAccountData } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import {
    addNotificationReceivedListener,
    AndroidImportance,
    DEFAULT_ACTION_IDENTIFIER,
    EventSubscription,
    getExpoPushTokenAsync,
    getPermissionsAsync,
    Notification,
    requestPermissionsAsync,
    setNotificationChannelAsync,
    useLastNotificationResponse,
} from '@app/service/notifications';

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
    const getTranslation = useTranslation();
    const styles = useStyles();
    const [messages, setMessages] = useState<string[]>([]);
    const [pushToken, setPushToken] = useState<string>();
    const [notification, setNotification] = useState<Notification>();
    const notificationListener = useRef<EventSubscription>(undefined);
    const lastNotificationResponse = useLastNotificationResponse();
    const accountId = useAccountData((state) => state.accountId);

    const log = (...message: any) => {
        console.log('push', ...message);
        setMessages((messages) => [...messages, message.join(' ')]);
    };

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Device.isDevice) {
            // const settings = await getPermissionsAsync();
            // let newStatus = settings.granted || settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
            // log('newPermission', newStatus);
            // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            // log('existingPermission', existingStatus);
            // let finalStatus = existingStatus;
            // if (existingStatus !== 'granted') {
            //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            //     finalStatus = status;
            // }
            // log('finalPermission', finalStatus);
            // if (finalStatus !== 'granted') {
            //     log('Failed to get push token for push notification!');
            //     return;
            // }

            const { status: existingStatus } = await getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                log('Failed to get push token for push notification!');
                return;
            }

            // throw "Deliberate Error!";
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found');
            }
            log('projectId: ', projectId);
            token = (
                await getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            log(maskToken(token));

            if (Platform.OS === 'android') {
                await setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }

        return token;
    };

    const registerForPushNotificationsWebAsync = async () => {
        return await initPusher();
    };

    useEffect(() => {
        log('registerForPushNotificationsAsync');

        if (Device.isDevice) {
            if (Platform.OS === 'web') {
                registerForPushNotificationsWebAsync()
                    .then((token) => setPushToken(token))
                    .catch((e) => log(e, e.message));
            } else {
                registerForPushNotificationsAsync()
                    .then((token) => setPushToken(token))
                    .catch((e) => log(e, e.message));
            }
        } else {
            log('Must use physical device for Push Notifications');
        }

        try {
            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = addNotificationReceivedListener((notification2) => {
                log('notificationListener (PUSH)', notification2);
                setNotification(notification2);
            });
        } catch (e) {
            log(e);
        }

        return () => {
            try {
                notificationListener.current?.remove();
            } catch (e) {
                log(e);
            }
        };
    }, []);

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    useEffect(() => {
        if (lastNotificationResponse && lastNotificationResponse.actionIdentifier === DEFAULT_ACTION_IDENTIFIER) {
            log('responseListener (PUSH)', lastNotificationResponse.notification);
            setNotification(lastNotificationResponse.notification);
        }
    }, [lastNotificationResponse]);

    return (
        <ScrollView className="flex-1 p-5" contentContainerStyle="items-center">
            <Stack.Screen options={{ title: getTranslation('push.title') }} />

            <MyText>{accountId ? getTranslation('push.heading.account') : ''}</MyText>
            <MyText>{accountId ? maskAccountId(accountId) : getTranslation('push.error.noaccount')}</MyText>
            <Space />
            <MyText>{pushToken ? maskToken(pushToken) : getTranslation('push.error.nopushtoken')}</MyText>
            {notification && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Space />
                    <MyText>{getTranslation('push.heading.notification')}:</MyText>
                    <Space />
                    <MyText>Date: {notification.date} </MyText>
                    <MyText>Title: {notification.request.content.title} </MyText>
                    <MyText>Body: {notification.request.content.body}</MyText>
                    <MyText>Data: {JSON.stringify(notification.request.content.data)}</MyText>
                </View>
            )}
            <Space />
            {pushToken && (
                <>
                    <Button
                        onPress={async () => {
                            if (Platform.OS === 'web') {
                                await sendTestPushNotificationWeb(pushToken);
                            } else {
                                await sendTestPushNotification(pushToken);
                            }
                        }}
                    >
                        {getTranslation('push.action.sendtestnotification')}
                    </Button>
                    <Space />
                    <MyText style={styles.note}>{getTranslation('push.action.sendtestnotification.note')}</MyText>
                </>
            )}
            {__DEV__ && (
                <>
                    <Space />
                    <Button
                        onPress={async () => {
                            router.navigate(`/matches?match_id${'xxx' + new Date().getTime()}`);
                        }}
                    >
                        {getTranslation('push.action.sendtestnotification') + ' Direct'}
                    </Button>
                </>
            )}
            <Space />
            <MyText>{getTranslation('push.heading.troubleshoot')}:</MyText>
            <Space />
            {messages.map((message, i) => (
                <MyText key={i}>{message}</MyText>
            ))}
        </ScrollView>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
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
    } as const)
);
