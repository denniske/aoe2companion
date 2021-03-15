import {globalShortcut} from "electron";
import {isAoeWindowFocused} from "./process";
import {IStoredConfig, store} from "./store";
import {createOrShowAppWindow, createOrShowQueryWindow, getAppWindow, getQueryWindow} from "../view/windows";


const acceleratorShowHide = 'F1';
const acceleratorSearch = 'CommandOrControl+F';

export function initShortcut() {
    setInterval(checkShortcuts, 500);
    checkShortcuts();
}

export async function checkShortcuts() {
    const config = store.get('config') as IStoredConfig;
    const aoeRunning = true; //await isAoeWindowFocused();
    const hotkeyShowHideEnabled = aoeRunning && config?.hotkeyShowHideEnabled;
    if (hotkeyShowHideEnabled != globalShortcut.isRegistered(acceleratorShowHide)) {
        console.log(hotkeyShowHideEnabled, '!=', globalShortcut.isRegistered(acceleratorShowHide));
        if (hotkeyShowHideEnabled) {
            console.log('Registered', acceleratorShowHide);
            globalShortcut.register(acceleratorShowHide, executeShowHide);
        } else {
            console.log('Unregistered', acceleratorShowHide);
            globalShortcut.unregister(acceleratorShowHide);
        }
    }
    const hotkeySearchEnabled = aoeRunning && config?.hotkeySearchEnabled;
    if (hotkeySearchEnabled != globalShortcut.isRegistered(acceleratorSearch)) {
        if (hotkeySearchEnabled) {
            globalShortcut.register(acceleratorSearch, executeSearch);
        } else {
            globalShortcut.unregister(acceleratorSearch);
        }
    }
}

async function executeShowHide() {
    console.log(acceleratorShowHide, 'is pressed');
    const appWindow = getAppWindow();
    if (appWindow == null) {
        await createOrShowAppWindow();
        return;
    }
    if (appWindow.isMinimized()) {
        appWindow.show();
        appWindow.setSkipTaskbar(false);
    } else {
        appWindow.minimize();
        appWindow.setSkipTaskbar(true);
    }
}

async function executeSearch() {
    console.log(acceleratorSearch, 'is pressed');
    const queryWindow = getQueryWindow();
    if (queryWindow == null) {
        await createOrShowQueryWindow();
        return;
    }
    if (queryWindow.isMinimized()) {
        queryWindow.show();
        queryWindow.setSkipTaskbar(false);
    } else {
        queryWindow.minimize();
        queryWindow.setSkipTaskbar(true);
    }
}

export function unregisterGlobalShortcuts() {
    globalShortcut.unregisterAll();
}
