import {app, BrowserWindow, screen, ipcMain, globalShortcut, Tray, Menu} from 'electron';
import {serve, showDevTools} from "../main";


export function createOverlayWindow(): BrowserWindow {
    const size = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        resizable: false,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    // win.on('close', function (event) {
    //     if (forceQuitting) return;
    //     console.log('close preventDefault');
    //     event.preventDefault();
    //     win.minimize();
    //     win.setSkipTaskbar(true);
    // });

    // win.setAlwaysOnTop(true, 'pop-up-menu');
    if (!showDevTools) {
        win.setIgnoreMouseEvents(true);
    }

    if (serve) {
        if (showDevTools) {
            win.webContents.openDevTools();
        }
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../node_modules/electron`)
        });
        win.loadURL(serve ? 'http://localhost:19006/intro' : 'https://app.aoe2companion.com/intro');
    } else {
        win.loadURL('https://app.aoe2companion.com/intro');
    }

    return win;
}
