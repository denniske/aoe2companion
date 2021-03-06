import {BrowserWindow, screen} from 'electron';
import {serve, showDevTools} from "../main";


export function createOverlayWindow(match_id: string): BrowserWindow {
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

    win.setAlwaysOnTop(true, 'pop-up-menu');
    if (!showDevTools) {
        win.setIgnoreMouseEvents(true);
    }

    const path = `intro/${match_id}`;

    if (serve) {
        if (showDevTools) {
            win.webContents.openDevTools();
        }
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../node_modules/electron`)
        });
        win.loadURL(`http://localhost:19006/${path}`);
    } else {
        win.loadURL(`https://app.aoe2companion.com/${path}`);
    }

    return win;
}
