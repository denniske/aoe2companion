import {useLayoutEffect, useState} from 'react';
import {Platform} from "react-native";

export function isElectron() {
    return Platform.OS === 'web' && eval('typeof require !== "undefined" && typeof require("electron") === "object"');
}

export function getElectron() {
    return eval(`require('electron')`);
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

export function getElectronPushToken() {
    return getElectron().ipcRenderer.invoke('get-electrolytic-token');
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
