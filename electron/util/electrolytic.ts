import {ipcMain, Notification} from 'electron';
import * as Electrolytic from 'electrolytic';
import {createOrShowAppWindow} from "../main";

let electrolyticToken = null;

const electrolytic = Electrolytic({
    appKey: 'IpANYN0DRa84xPpmvQ9Z',
});

electrolytic.on('token', token => {
    electrolyticToken = token;
    console.log('user token', token);
});

function showNotification (payload) {
    const notification = new Notification(payload);
    notification.once('click', (event) => {
        createOrShowAppWindow().webContents.send('electrolytic-notification', payload);
    });
    notification.show();
}

electrolytic.on('push', (payload) => {
    console.log('got push notification', payload);
    showNotification(payload);
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
}
