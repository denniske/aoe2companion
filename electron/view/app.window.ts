import {app, BrowserWindow, screen} from 'electron';
import {isForceQuitting, serve, showDevTools, width} from "../main";


export function createAppWindow(): BrowserWindow {
    const size = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        x: size.width - width - 30,
        y: 60, //100,
        frame: false,
        transparent: true,
        resizable: false,
        width: width,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    win.on('close', function (event) {
        if (isForceQuitting()) return;
        event.preventDefault();
        win.minimize();
        win.setSkipTaskbar(true);
    });

    // win.setAlwaysOnTop(true, 'pop-up-menu');

    if (serve) {
        if (showDevTools) {
            win.webContents.openDevTools();
        }
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../node_modules/electron`)
        });
        // win.loadURL('https://app.aoe2companion.com');
        win.loadURL(serve ? 'http://localhost:19006' : 'https://app.aoe2companion.com');
    } else {
        win.loadURL('https://app.aoe2companion.com');
    }

    return win;
}
