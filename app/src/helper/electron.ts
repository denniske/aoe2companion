import {useLayoutEffect, useState} from 'react';
import {Platform} from "react-native";

export function isElectron() {
    return Platform.OS === 'web' && eval('typeof require !== "undefined" && typeof require("electron") === "object"');
}

export function getElectron() {
    return eval(`require('electron')`);
}

export function closeOverlayWindow() {
    return eval(`require('electron').remote.getCurrentWindow().destroy()`);
}

// export function closeAppWindow() {
//     return eval(`require('electron').remote.getCurrentWindow().close()`);
// }

export async function showOverlayWindowAsync() {
    return getElectron().ipcRenderer.invoke('show-overlay-window');
}

export async function closeOverlayWindowAsync() {
    return getElectron().ipcRenderer.invoke('close-overlay-window');
}

export async function closeAppWindowAsync() {
    return getElectron().ipcRenderer.invoke('close-app-window');
}

export async function getElectronVersion() {
    return getElectron().ipcRenderer.invoke('get-electron-version');
}

export async function doCheckForUpdateElectronAsync() {
    if (__DEV__) return null;
    return getElectron().ipcRenderer.invoke('check-for-electron-update');
}

export async function doFetchUpdateElectronAsync() {
    return getElectron().ipcRenderer.invoke('fetch-electron-update');
}

export async function installUpdateElectronAsync() {
    return getElectron().ipcRenderer.invoke('install-electron-update');
}

export async function isAoeRunningAsync() {
    return getElectron().ipcRenderer.invoke('is-aoe-running');
}

export async function sendConfig(config: any) {
    return getElectron().ipcRenderer.invoke('send-config', config);
}

export async function sendSettings(config: any) {
    return getElectron().ipcRenderer.invoke('send-settings', config);
}

export async function getElectronPushToken() {
    return getElectron().ipcRenderer.invoke('get-electrolytic-token');
}

// When user clicked on notification
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

// When notification is received by electrolytic
export function useLastNotificationReceivedElectron() {
    const [lastNotificationReceived, setLastNotificationReceived] = useState<any | null | undefined>(undefined);

    const notificationCallback = (event: any, arg: any) => {
        setLastNotificationReceived(arg);
    };

    useLayoutEffect(() => {
        const ipcRenderer = getElectron().ipcRenderer;
        ipcRenderer.on('electrolytic-notification-received', notificationCallback);
        return () => {
            ipcRenderer.removeListener('electrolytic-notification-received', notificationCallback);
        };
    }, []);

    return lastNotificationReceived;
}
