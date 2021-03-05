import {globalShortcut} from "electron";
import {getAppWindow} from "../main";


export function registerGlobalShortcut() {
    globalShortcut.register('F1', () => {
        console.log('F1 is pressed');
        const appWindow = getAppWindow();
        if (appWindow.isMinimized()) {
            appWindow.show();
            appWindow.setSkipTaskbar(false);
        } else {
            appWindow.minimize();
            appWindow.setSkipTaskbar(true);
        }
    });
}

export function unregisterGlobalShortcuts() {
    globalShortcut.unregisterAll();
}
