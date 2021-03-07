import {app, BrowserWindow, ipcMain, Tray} from 'electron';
import {initUpdate} from "./util/update";
import {initElectrolytic} from "./util/electrolytic";
import {createAppWindow} from "./view/app.window";
import {createTray} from "./view/tray";
import {initShortcut, unregisterGlobalShortcuts} from "./util/shortcut";
import {createOverlayWindow} from "./view/overlay.window";
import {initProcess} from "./util/process";
import * as Sentry from "@sentry/electron";

let appWindow: BrowserWindow = null;
let overlayWindow: BrowserWindow = null;

let tray: Tray;
let forceQuitting = false;

const args = process.argv.slice(1);
export const serve = args.some(val => val === '--serve');
export const showDevTools = false && serve;
export const width = 450 + (showDevTools ? 557 : 0);
const startedViaAutostart = process.argv.includes('--autostart');

if (!serve) {
  Sentry.init({ dsn: "https://2ec5da86c7a344e6af4a11fc8ca2f510@o431543.ingest.sentry.io/5665269" });
}

// let myUndefinedFunction2 = undefined as any;
// myUndefinedFunction2();

export function getAppWindow() {
  return appWindow;
}

export function getOverlayWindow() {
  return overlayWindow;
}

export function isForceQuitting() {
  return forceQuitting;
}

export function createOrShowAppWindow() {
  if (appWindow == null) {
    appWindow = createAppWindow();
    appWindow.on('closed', () => appWindow = null);
  } else {
    appWindow.show();
  }
  return appWindow;
}

export function createOrShowOverlayWindow(match_id: string) {
  if (overlayWindow == null) {
    overlayWindow = createOverlayWindow(match_id);
    overlayWindow.on('closed', () => overlayWindow = null);
  } else {
    overlayWindow.show();
  }
  return overlayWindow;
}

export function forceQuit() {
  forceQuitting = true;
  app.quit();
}

try {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      createOrShowAppWindow();
    });

    app.whenReady().then(() => {
      initUpdate();
      initProcess();
      initElectrolytic();
      initShortcut();
      tray = createTray();
      if (startedViaAutostart) return;
      createOrShowAppWindow();
      // createOrShowOverlayWindow('74869116'); // 8 tg viper
      // createOrShowOverlayWindow('75049202'); // 8 free for all
      // createOrShowOverlayWindow('75046190'); // vs AI
      // createOrShowOverlayWindow('72704893');
    });

    ipcMain.handle('close-app-window', () => {
      appWindow.close();
    });

    app.on('will-quit', () => {
      unregisterGlobalShortcuts();
    });

    app.setLoginItemSettings({
      openAtLogin: true,
      path: process.execPath,
      args: [
        '--autostart',
      ],
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
      createOrShowAppWindow();
    });
  }
} catch (e) {
  // Catch Error
  throw e;
}
