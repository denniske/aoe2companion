import {app, BrowserWindow, Tray} from 'electron';
import {initUpdate} from "./util/update";
import {initElectrolytic} from "./util/electrolytic";
import {createAppWindow} from "./view/app.window";
import {createTray} from "./view/tray";
import {registerGlobalShortcut, unregisterGlobalShortcuts} from "./util/shortcut";
import {createOverlayWindow} from "./view/overlay.window";


let appWindow: BrowserWindow = null;
let overlayWindow: BrowserWindow = null;

let tray: Tray;
let forceQuitting = false;

const startedViaAutostart = process.argv.includes('--autostart');

const args = process.argv.slice(1);
export const serve = args.some(val => val === '--serve');
export const showDevTools = false && serve;
export const width = 450 + (showDevTools ? 557 : 0);

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

export function createOrShowOverlayWindow() {
  if (overlayWindow == null) {
    overlayWindow = createOverlayWindow();
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
      initElectrolytic();
      registerGlobalShortcut();
      tray = createTray();
      if (startedViaAutostart) return;
      // createOrShowAppWindow();
      createOrShowOverlayWindow();
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


    app.on('ready', () => {
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
