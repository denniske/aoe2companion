import {app, Tray, Menu} from 'electron';
import {createOrShowAppWindow, forceQuit} from "../main";
import * as path from 'path';


export function createTray() {
    let appIcon = new Tray(path.join(__dirname, "..", "cloud_fun.ico"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show', click: async () => {
               await createOrShowAppWindow();
            }
        },
        {
            label: 'Exit', click: async () => {
                forceQuit();
            }
        }
    ]);

    appIcon.on('double-click', async (event) => {
        await createOrShowAppWindow();
    });
    appIcon.setToolTip('AoE II Companion');
    appIcon.setContextMenu(contextMenu);
    return appIcon;
}
