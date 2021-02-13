import * as PusherPushNotifications from "@pusher/push-notifications-web"
import {TokenProviderResponse} from '@pusher/push-notifications-web';


let myserviceWorkerRegistration: any = null;

window.navigator.serviceWorker.ready.then(serviceWorkerRegistration =>
    myserviceWorkerRegistration = serviceWorkerRegistration
);

export async function initPusher() {
    console.log('initPusher', myserviceWorkerRegistration);

    const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
        serviceWorkerRegistration: myserviceWorkerRegistration,
    })

    try {
        await beamsClient.start();
        await beamsClient.addDeviceInterest('hello');

        const deviceId = await beamsClient.getDeviceId();
        console.log('beamsClient.getDeviceId: ', deviceId);

        await beamsClient.setUserId('user-' + deviceId, {
            async fetchToken(userId: string): Promise<TokenProviderResponse> {
                return { token: deviceId };
            }
        });

        console.log('Successfully registered and subscribed!');
    } catch (e) {
        console.error(e);
    }

    // beamsClient.start()
    //     .then(() => beamsClient.addDeviceInterest('hello'))
    //     .then(() => {
    //         console.log('beamsClient.getDeviceId: ', beamsClient.getDeviceId());
    //
    //         beamsClient.setUserId(beamsClient.getDeviceId(), {
    //             async fetchToken(userId: string): Promise<TokenProviderResponse> {
    //                 return beamsClient.getDeviceId();
    //             }
    //         })
    //
    //     })
    //     .then(() => console.log('Successfully registered and subscribed!'))
    //     .catch(console.error);
}
