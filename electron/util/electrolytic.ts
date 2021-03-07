import {ipcMain, Notification} from 'electron';
import * as Electrolytic from 'electrolytic';
import {createOrShowAppWindow, createOrShowOverlayWindow} from "../main";
import {IStoredConfig, IStoredSettings, store} from "./store";
import {checkShortcuts} from "./shortcut";


interface IPushNotificationPayload {
    title: string;
    body: string;
    data: {
        match_id: string;
        player_ids: number[];
    };
}


let electrolyticToken = null;

const electrolytic = Electrolytic({
    appKey: 'IpANYN0DRa84xPpmvQ9Z',
});

electrolytic.on('token', token => {
    electrolyticToken = token;
    console.log('user token', token);
});

async function showNotification (payload: IPushNotificationPayload) {
    const notification = new Notification(payload);
    notification.once('click', async (event) => {
        (await createOrShowAppWindow()).webContents.send('electrolytic-notification', payload);
    });
    notification.show();

    const config = store.get('config') as IStoredConfig;
    console.log('config', config);
    const settings = store.get('settings') as IStoredSettings;
    console.log('settings', settings);

    console.log('payload', payload);

    const authUserInMatch = payload.data.player_ids?.includes(settings.profile_id);

    if (config?.overlayEnabled && authUserInMatch) {
        await createOrShowOverlayWindow(payload.data.match_id);
    }
    if (payload.title === 'Test Notification') {
        await createOrShowOverlayWindow('72704893');
    }
}

electrolytic.on('push', async (payload) => {
    console.log('got push notification', payload);
    await showNotification(payload);
})

electrolytic.on('config', (updatedConfig) => {
    console.log('look ma, updated config!', updatedConfig);
});

export function initElectrolytic() {
    ipcMain.handle('get-electrolytic-token', async (event, arg) => {
        return new Promise((resolve) => {
            const sendTokenToApp = token => {
                resolve(token);
                electrolytic.off('token', sendTokenToApp);
            };
            if (electrolyticToken) {
                sendTokenToApp(electrolyticToken);
            } else {
                electrolytic.on('token', sendTokenToApp);
            }
        });
    });
    ipcMain.handle('send-config', async (event, arg) => {
        store.set('config', arg);
        checkShortcuts();
    });
    ipcMain.handle('send-settings', async (event, arg) => {
        store.set('settings', arg);
    });
}
