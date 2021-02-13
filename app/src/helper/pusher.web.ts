import * as PusherPushNotifications from "@pusher/push-notifications-web"

export function initPusher() {
    const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
    })

    beamsClient.start()
        .then(() => beamsClient.addDeviceInterest('hello'))
        .then(() => console.log('Successfully registered and subscribed!'))
        .catch(console.error);
}
