import {globalShortcut} from "electron";
import {getAppWindow} from "../main";
import {isAoeWindowFocused} from "./process";
import {IStoredConfig, store} from "./store";


const acceleratorShowHide = 'F1';
const acceleratorSearch = 'CommandOrControl+F';

export function initShortcut() {
    setInterval(checkShortcuts, 500);
    checkShortcuts();
}

export async function checkShortcuts() {
    const config = store.get('config') as IStoredConfig;
    const aoeRunning = await isAoeWindowFocused();
    const hotkeyShowHideEnabled = aoeRunning && config.hotkeyShowHideEnabled;
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
    const hotkeySearchEnabled = aoeRunning && config.hotkeySearchEnabled;
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
    // if (!await isAoeProcessRunning()) return;
    const appWindow = getAppWindow();
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
    // if (!await isAoeProcessRunning()) return;
    const appWindow = getAppWindow();
    if (appWindow.isMinimized()) {
        appWindow.show();
        appWindow.setSkipTaskbar(false);
    } else {
        appWindow.minimize();
        appWindow.setSkipTaskbar(true);
    }
}

export function unregisterGlobalShortcuts() {
    globalShortcut.unregisterAll();
}
