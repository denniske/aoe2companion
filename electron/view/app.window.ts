import {app, BrowserWindow, screen} from 'electron';
import {isForceQuitting, serving, showDevTools, width} from "../main";


export async function createAppWindow() {
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
            allowRunningInsecureContent: serving,
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

    if (serving) {
        if (showDevTools) {
            win.webContents.openDevTools();
        }
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../node_modules/electron`)
        });

        // await win.loadURL(`app://-`);
        await win.loadURL('http://localhost:19006');
    } else {
        await win.loadURL(`app://-`);

        // const urlStr = url.format({
        //     pathname: path.join(__dirname, '../../web-build/index.html'),
        //     protocol: 'file:',
        //     slashes: true,
        // });
        // win.loadURL(urlStr);

        // win.loadURL('https://app.aoe2companion.com');
    }

    return win;
}
