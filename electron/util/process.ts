import {spawn} from "child_process";
import {BrowserWindow, ipcMain, remote} from "electron";
const psList = require('ps-list');
const activeWindows = require('electron-active-window');


export function initProcess() {
    ipcMain.handle('is-aoe-running', async (event, arg) => {
        return await isAoeProcessRunning();
    });
}

let wasAoeWindowFocused = false;

export async function isAoeWindowFocused() {
    // console.log('remote', remote.getCurrentWindow());
    // console.log('BrowserWindow', focusedCompanionWindow);
    // console.log('activeWindow', activeWindow);

    // const start = new Date();

    const companionWindowFocused = BrowserWindow.getFocusedWindow() != null;

    const activeWindow = await activeWindows().getActiveWindow();
    const aoe2DeFocused = activeWindow.windowClass?.toLowerCase().includes('aoe2de');

    if (!(aoe2DeFocused || companionWindowFocused)) {
        // Do still count as focused when new window has empty windowClass
        if (wasAoeWindowFocused && activeWindow.windowClass == '') {
            console.log('CATCHED');
            return true;
        }
    }

    // console.log(new Date().getTime() - start.getTime());

    wasAoeWindowFocused = aoe2DeFocused || companionWindowFocused;
    return aoe2DeFocused || companionWindowFocused;
}

export async function isAoeProcessRunning() {
    const processList = await psList();
    const aoe = processList.find(p => p.name.toLowerCase().includes('aoe2de'));
    // console.log('ProcessRunning', aoe != null);
    return aoe != null;
}

export async function spawnDetached(exe: string, args: Array<string>): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const process = spawn(exe, args, {
                detached: true,
                stdio: "ignore",
            })
            process.on("error", error => {
                reject(error)
            })
            process.unref()

            if (process.pid !== undefined) {
                resolve(true)
            }
        }
        catch (error) {
            reject(error)
        }
    })
}
