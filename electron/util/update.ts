import fetch from "electron-fetch";
import {IRelease} from "./github.type";
import {compareBuild, lt, parse} from "semver";
import {downloadFile} from "./download-helper";
import {sleep} from "./util";
import {spawnDetached} from "./process";
import {app, ipcMain} from 'electron';
import * as path from "path";
import {forceQuit} from "../view/windows";

export function initUpdate() {
    ipcMain.handle('check-for-electron-update', async (event, arg) => {
        return await checkForUpdate();
    });
    ipcMain.handle('fetch-electron-update', async (event, arg) => {
        return await downloadUpdate();
    });
    ipcMain.handle('install-electron-update', async (event, arg) => {
        await triggerInstallUpdate();
    });
    ipcMain.handle('get-electron-version', async (event, arg) => {
        return app.getVersion();
    });
}


function getVersionFromAssetName(assetName: string) {
    const regex = /aoe2companion-(.+).exe/;
    const match = regex.exec(assetName);
    return match[1];
}

let updatePath = '';
let updateInstallTrigger = false;

async function getLatestRelease() {
    const response = await fetch('https://api.github.com/repos/denniske/aoe2companion/releases');
    const releases = await response.json() as IRelease[];
    const release = releases?.find(r => r.tag_name.startsWith('desktop-v'));
    const asset = release?.assets?.find(a => a.name.endsWith('.exe'));
    return { release, asset };
}

export async function checkForUpdate() {
    const { release, asset } = await getLatestRelease();

    console.log('Remote Asset', asset.name);

    const localVersion = app.getVersion();
    const remoteVersion = getVersionFromAssetName(asset.name);

    console.log('Local Version', localVersion);
    console.log('Remote Version', remoteVersion);

    const lessThan = -1;
    if (compareBuild(localVersion, remoteVersion) == lessThan) {
        return {
            version: remoteVersion,
        };
    }
    return null;
}

export async function downloadUpdate() {
    const { asset } = await getLatestRelease();

    console.log('Remote Asset', asset.name);

    const filePath = path.join(app.getPath('temp'), asset.name);
    await downloadFile(asset.browser_download_url, filePath);
    await sleep(1000);
    updatePath = filePath;
}

export function triggerInstallUpdate() {
    updateInstallTrigger = true;
    forceQuit();
}

export function maybeInstallUpdate() {
    if (updatePath && updateInstallTrigger) {
        console.log('Installing update...');
        const parameters = ['/S', '--force-run'];
        spawnDetached(updatePath, parameters);
    }
}

app.on('quit', (_: Event, exitCode: number) => {
  console.log('App quit with exit code', exitCode);
  if (exitCode !== 0) return;
  maybeInstallUpdate();
});
