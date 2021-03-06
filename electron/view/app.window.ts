import {app, BrowserWindow, screen} from 'electron';
import {isForceQuitting, serve, showDevTools, width} from "../main";


export function createAppWindow(): BrowserWindow {
    const size = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        x: size.width - width - 30,
        y: 100,
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
        console.log('tryclose');
        if (isForceQuitting()) return;
        event.preventDefault();
        win.minimize();
        win.setSkipTaskbar(true);
    });

    win.setAlwaysOnTop(true, 'pop-up-menu');

    if (serve) {
        if (showDevTools) {
            win.webContents.openDevTools();
        }
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../node_modules/electron`)
        });
        win.loadURL('http://localhost:19006');
    } else {
        win.loadURL('https://app.aoe2companion.com');
    }

    return win;
}
