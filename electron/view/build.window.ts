import {BrowserWindow, screen} from 'electron';
import {serving, showDevTools, width} from "../main";
import {prefs, savePrefs} from "../util/prefs";
import {isForceQuitting} from "./windows";


export function initBuild() {
    // ipcMain.handle('query-item-canceled', async (event, item) => {
    //     getQueryWindow().close();
    // });
}

export async function createBuildWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;

    const myWidth = width + 200;

    const win = new BrowserWindow({
        x: size.width / 2 - myWidth / 2,
        y: 520,
        frame: false,
        transparent: true,
        resizable: true,
        width: myWidth,
        // minWidth: width,
        // maxWidth: width,
        height: 800, //prefs.app.windowHeight,
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
        console.log('tryclose');
        savePrefs();
        if (isForceQuitting()) return;
        event.preventDefault();
        win.minimize();
        win.setSkipTaskbar(true);
    });

    // win.setAlwaysOnTop(true, 'pop-up-menu');

    const path = `build`;

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
