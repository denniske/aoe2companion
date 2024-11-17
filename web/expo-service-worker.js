/* eslint-env serviceworker */

self.addEventListener('install', function(event) {
    // noinspection JSIgnoredPromiseFromCall
    self.skipWaiting();
});

importScripts("https://js.pusher.com/beams/service-worker.js");


PusherPushNotifications.onNotificationReceived = ({payload, pushEvent, handleNotification}) => {
    console.log('Got notification');
    console.log(payload);
    // payload.notification.title = 'A new title!';
    // pushEvent.waitUntil(handleNotification(payload))

    const title = payload.notification.title;
    const options = {
        body: payload.notification.body,
        data: payload.data,
    };

    pushEvent.waitUntil(self.registration.showNotification(title, options));


    // pushEvent.waitUntil(
    //   (async () => {
    //     const allClients = await self.clients.matchAll({
    //       includeUncontrolled: true,
    //     });
    //
    //     let appClient;
    //     const path = '/';
    //
    //     // If we already have a window open, use it.
    //     for (const client of allClients) {
    //       const url = new URL(client.url);
    //
    //       console.log('Client', url);
    //
    //       if (url.pathname === path) {
    //         client.focus();
    //         appClient = client;
    //         break;
    //       }
    //     }
    //
    //     // If there is no existing window, open a new one.
    //     if (!appClient) {
    //         appClient = allClients[0];
    //       // appClient = await self.clients.openWindow(path);
    //     }
    //
    //     // Message the client:
    //     // `origin` will always be `'selected'` in this case.
    //     // https://docs.expo.io/versions/latest/sdk/notifications/#notification
    //     appClient.postMessage({
    //       origin: 'selected',
    //       data: payload.notification.data,
    //       remote: !payload.notification,
    //     });
    //   })()
    // );
}

console.log('Expo service worker', PusherPushNotifications);


// /**
//  * Store notification icon string in service worker.
//  * Ref: https://stackoverflow.com/a/35729334/2603230
//  */
// self.addEventListener('message', event => {
//   let data;
//   if (typeof event.data === 'string') {
//     try {
//       data = JSON.parse(event.data);
//     } catch (e) {}
//   }
//
//   if (data && data.fromExpoWebClient) {
//     self.notificationIcon = data.fromExpoWebClient.notificationIcon;
//   }
// });
//
// /**
//  * Add support for push notification.
//  */
// self.addEventListener('push', event => {
//   let payload = {};
//   try {
//     payload = event.data.json();
//   } catch (e) {
//     // If `event.data.text()` is not a JSON object, we just treat it
//     // as a plain string and display it as the body.
//     payload = { title: '', body: event.data.text() };
//   }
//
//   const title = payload.title;
//   const data = payload.data || payload.custom || {};
//   const options = {
//     body: payload.body,
//     data,
//   };
//   options.icon = data._icon || payload.icon || self.notificationIcon || null;
//   options.image =
//     data._richContent && data._richContent.image ? options.data._richContent.image : payload.image;
//   options.tag = data._tag || payload.collapseKey;
//   if (options.tag) {
//     options.renotify = data._renotify;
//   }
//
//   event.waitUntil(self.registration.showNotification(title, options));
// });

// https://developer.mozilla.org/en-US/docs/Web/API/Clients
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        (async () => {
            const allClients = await self.clients.matchAll({
                includeUncontrolled: true,
            });

            let appClient;

            const path = '/feed'; //event.notification.data._webPath || '/';

            // If we already have a window open, use it.
            for (const client of allClients) {
                const url = new URL(client.url);
                console.log('url', url);

                if (url.pathname === path) {
                    client.focus();
                    appClient = client;
                    break;
                }
            }

            // If there is no existing window, open a new one.
            if (!appClient) {
                if (allClients.length > 0) {
                    appClient = allClients[0];
                    appClient.focus();
                } else {
                    appClient = await self.clients.openWindow(path);
                }
            }

            // Message the client:
            // `origin` will always be `'selected'` in this case.
            // https://docs.expo.io/versions/latest/sdk/notifications/#notification
            appClient.postMessage({
                origin: 'selected',
                data: event.notification.data,
                remote: !event.notification._isLocal,
            });
        })()
    );
});

try {
    // TODO: Consider cache: https://github.com/expo/expo-cli/pull/844#issuecomment-515619883
    // Import the script generated by workbox.
    self.importScripts('service-worker.js');
} catch (e) {

}
