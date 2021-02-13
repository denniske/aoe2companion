import * as PusherPushNotifications from "@pusher/push-notifications-web"


let myserviceWorkerRegistration: any = null;

window.navigator.serviceWorker.ready.then(serviceWorkerRegistration =>
    myserviceWorkerRegistration = serviceWorkerRegistration
);

export function initPusher() {
    console.log('initPusher', myserviceWorkerRegistration);

    const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
        serviceWorkerRegistration: myserviceWorkerRegistration,
    })

    beamsClient.start()
        .then(() => beamsClient.addDeviceInterest('hello'))
        .then(() => {
            console.log('beamsClient.getDeviceId: ', beamsClient.getDeviceId());
        })
        .then(() => console.log('Successfully registered and subscribed!'))
        .catch(console.error);
}
