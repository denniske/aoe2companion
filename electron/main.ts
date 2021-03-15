import {app, ipcMain, Tray} from 'electron';
import {initUpdate} from "./util/update";
import {initElectrolytic} from "./util/electrolytic";
import {createTray} from "./view/tray";
import {initShortcut, unregisterGlobalShortcuts} from "./util/shortcut";
import {initProcess} from "./util/process";
import * as Sentry from "@sentry/electron";
import * as path from 'path';
import {initPrefs} from "./util/prefs";
import {initQuery} from "./view/query.window";
import {createOrShowAppWindow, createOrShowBuildWindow, getAppWindow} from "./view/windows";
import {initBuild} from "./view/build.window";

const serve = require('electron-serve');


let tray: Tray;

const args = process.argv.slice(1);
export const serving = args.some(val => val === '--serve');
export const showDevTools = true && serving;
export const width = 450 + (showDevTools ? 757 : 0);
const startedViaAutostart = process.argv.includes('--autostart');

if (!serving) {
  Sentry.init({ dsn: "https://2ec5da86c7a344e6af4a11fc8ca2f510@o431543.ingest.sentry.io/5665269" });
}

// let myUndefinedFunction2 = undefined as any;
// myUndefinedFunction2();


try {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', async (event, commandLine, workingDirectory) => {
      console.log('second-instance');
      await createOrShowAppWindow();
    });

    serve({directory: path.join(__dirname, 'dist/')});

    app.whenReady().then(async () => {
      initPrefs();
      initElectrolytic();
      initUpdate();
      initProcess();
      initShortcut();
      initQuery();
      initBuild();
      tray = createTray();
      if (startedViaAutostart) return;
      console.log('createOrShowAppWindow');
      // await createOrShowQueryWindow();
      await createOrShowAppWindow();
      // await createOrShowBuildWindow();
      // await createOrShowOverlayWindow('74869116'); // 8 tg viper
      // await createOrShowOverlayWindow('75049202'); // 8 free for all
      // await createOrShowOverlayWindow('75046190'); // vs AI
      // await createOrShowOverlayWindow('72704893');
    });

    ipcMain.handle('close-app-window', () => {
      console.log('close-app-window', getAppWindow() != null);
      getAppWindow()?.destroy();
    });

    app.on('will-quit', () => {
      console.log('app will-quit');
      unregisterGlobalShortcuts();
    });

    app.setLoginItemSettings({
      openAtLogin: true,
      path: process.execPath,
      args: [
        '--autostart',
      ],
    });

    app.on('activate', async () => {
      console.log('activate');
      // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
      await createOrShowAppWindow();
    });
  }
} catch (e) {
  // Catch Error
  throw e;
}
