import {createAppWindow} from "./app.window";
import {createQueryWindow} from "./query.window";
import {createOverlayWindow} from "./overlay.window";
import {app, BrowserWindow} from "electron";
import {createBuildWindow} from "./build.window";


let forceQuitting = false;

let queryWindow: BrowserWindow = null;
let appWindow: BrowserWindow = null;
let overlayWindow: BrowserWindow = null;
let buildWindow: BrowserWindow = null;


export function forceQuit() {
    console.log('FORCE QUIT', getAppWindow()?.closable);
    forceQuitting = true;
    getAppWindow()?.destroy();
    app.quit();
}

export function getQueryWindow() {
    return queryWindow;
}

export function getAppWindow() {
    return appWindow;
}

export function getOverlayWindow() {
    return overlayWindow;
}

export function getBuildWindow() {
    return buildWindow;
}

export function isForceQuitting() {
    return forceQuitting;
}

export async function createOrShowAppWindow(path: string = '') {
    if (appWindow == null) {
        appWindow = await createAppWindow(path);
        appWindow.on('closed', () => {
            console.log('appWindow.closed');
            return appWindow = null;
        });
    } else {
        appWindow?.show();
    }
    return appWindow;
}

export async function createOrShowQueryWindow() {
    if (queryWindow == null) {
        queryWindow = await createQueryWindow();
        queryWindow.on('closed', () => {
            console.log('queryWindow.closed');
            return queryWindow = null;
        });
    } else {
        queryWindow?.show();
    }
    return queryWindow;
}

export async function createOrShowOverlayWindow(match_id: string) {
    if (overlayWindow == null) {
        overlayWindow = await createOverlayWindow(match_id);
        overlayWindow.on('closed', () => overlayWindow = null);
    } else {
        overlayWindow.show();
    }
    return overlayWindow;
}

export async function createOrShowBuildWindow() {
    if (buildWindow == null) {
        buildWindow = await createBuildWindow();
        buildWindow.on('closed', () => buildWindow = null);
    } else {
        buildWindow.show();
    }
    return buildWindow;
}
