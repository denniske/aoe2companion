import {BrowserWindow, screen} from 'electron';
import {serving, showDevTools, width} from "../main";
import {prefs, savePrefs} from "../util/prefs";
import {isForceQuitting} from "./windows";


export async function createAppWindow(path: string = '') {
    const size = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        x: size.width - width - 30,
        y: 100,
        frame: false,
        transparent: true,
        resizable: true,
        width: width,
        minWidth: width,
        maxWidth: width,
        height: prefs.app.windowHeight,
        minHeight: 400,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serving,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    win.on('resize', function (ev) {
        const [width, height] = win.getSize();
        prefs.app.windowHeight = height;
    });

    win.on('close', function (event) {
        console.log('tryclose force = ', isForceQuitting());
        savePrefs();
        // if (isForceQuitting()) return;
        // event.preventDefault();
        // win.minimize();
        // win.setSkipTaskbar(true);
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
        await win.loadURL(`http://localhost:19006/${path}`);
    } else {
        await win.loadURL(`app://-/${path}`);

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
