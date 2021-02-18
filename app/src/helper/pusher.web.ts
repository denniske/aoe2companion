import * as PusherPushNotifications from "@pusher/push-notifications-web"


let myserviceWorkerRegistration: any = null;

window.navigator.serviceWorker.addEventListener("message", (evt) => {
    console.log('APP GOT CALLED BY SW', evt);
});

window.navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
    return myserviceWorkerRegistration = serviceWorkerRegistration;
});

export async function initPusher() {
    console.log('initPusher', myserviceWorkerRegistration);

    const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
        serviceWorkerRegistration: myserviceWorkerRegistration,
    })

    try {
        await beamsClient.start();

        const deviceId = await beamsClient.getDeviceId();
        console.log('beamsClient.getDeviceId: ', deviceId);

        await beamsClient.addDeviceInterest('hello');
        console.log('addDeviceInterest', 'hello');
        await beamsClient.addDeviceInterest(`device-${deviceId}`);
        console.log('addDeviceInterest', `device-${deviceId}`);

        // await beamsClient.setUserId('user-' + deviceId, {
        //     async fetchToken(userId: string): Promise<TokenProviderResponse> {
        //         return { token: deviceId };
        //     }
        // });

        console.log('Successfully registered and subscribed!');

        return deviceId;
    } catch (e) {
        console.error(e);
    }
}

export async function deactivatePusher() {
    console.log('deactivatePusher', myserviceWorkerRegistration);

    const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
        serviceWorkerRegistration: myserviceWorkerRegistration,
    })

    try {
        await beamsClient.stop();
    } catch (e) {
        console.error(e);
    }
}
