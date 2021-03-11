import {BrowserWindow, screen} from 'electron';
import {serving, showDevTools} from "../main";


export async function createOverlayWindow(match_id: string) {
    const size = screen.getPrimaryDisplay().size;

    console.log('size.width', size.width);
    console.log('size.height', size.height);

    const win = new BrowserWindow({
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        resizable: false,
        width: size.width-1, // Hack: Window was not transparent when full width
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serving,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        // fullscreen: true,
    });

    win.setAlwaysOnTop(true, 'pop-up-menu');
    if (!showDevTools) {
        win.setIgnoreMouseEvents(true);
    }

    const path = `intro/${match_id}`;

    if (serving) {
        if (showDevTools) {
            win.webContents.openDevTools();
        }
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/../node_modules/electron`)
        });

        // await win.loadURL(`app://-/${path}`);
        await win.loadURL(`http://localhost:19006/${path}`);
    } else {
        await win.loadURL(`app://-/${path}`);

        // const urlStr = url.format({
        //     pathname: path.join(__dirname, '../../web-build/index.html'),
        //     protocol: 'file:',
        //     slashes: true,
        //     query: `?page=intro&match_id=${match_id}`,
        // });
        // win.loadURL(urlStr);

        // win.loadURL(`https://app.aoe2companion.com/${path}`);
    }

    return win;
}
