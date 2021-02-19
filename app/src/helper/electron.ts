import {useLayoutEffect, useState} from 'react';

export function isElectron() {
    return eval('typeof require !== "undefined" && typeof require("electron") === "object"');
}

export function getElectron() {
    return eval(`require('electron')`);
}

export function getElectronPushToken() {
    return new Promise<string>((resolve, reject) => {
        const ipcRenderer = getElectron().ipcRenderer;

        ipcRenderer.once('get-electrolytic-token-response', (event: any, arg: string) => {
            resolve(arg);
        });

        ipcRenderer.send('get-electrolytic-token');
    });
}

export function useLastNotificationResponseElectron() {
    const [lastNotificationResponse, setLastNotificationResponse] = useState<any | null | undefined>(undefined);

    const notificationCallback = (event: any, arg: any) => {
        setLastNotificationResponse(arg);
    };

    useLayoutEffect(() => {
        const ipcRenderer = getElectron().ipcRenderer;
        ipcRenderer.on('electrolytic-notification', notificationCallback);
        return () => {
            ipcRenderer.removeListener('electrolytic-notification', notificationCallback);
        };
    }, []);

    return lastNotificationResponse;
}
