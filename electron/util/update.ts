import fetch from "electron-fetch";
import {IRelease} from "./github.type";
import {compareBuild, lt, parse} from "semver";
import {downloadFile} from "./download-helper";
import {sleep} from "./util";
import {spawnDetached} from "./process";
import {app, ipcMain} from 'electron';
import {forceQuit} from "../main";

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

let updateName = '';
let updateInstallTrigger = false;

export async function checkForUpdate() {
    const response = await fetch('https://api.github.com/repos/denniske/aoe2companion/releases');
    const releases = await response.json() as IRelease[];
    const release = releases?.find(r => r.tag_name.startsWith('desktop-v'));
    const asset = release?.assets?.find(a => a.name.endsWith('.exe'));

    console.log('Remote Asset', asset.name);

    const localVersion = app.getVersion();
    const remoteVersion = getVersionFromAssetName(asset.name);

    console.log('Local Version', localVersion);
    console.log('Remote Version', remoteVersion);
    // console.log('lt', parse('22.0.8+0').);
    // console.log('lt', lt('22.0.8-0', '22.0.8-10'));
    // console.log('lt', compareBuild('22.0.8', '22.0.8+1'));

    const lessThan = -1;
    if (compareBuild(localVersion, remoteVersion) == lessThan) {
        return {
            version: remoteVersion,
        };
    }
    return null;
}

export async function downloadUpdate() {
    const response = await fetch('https://api.github.com/repos/denniske/aoe2companion/releases');
    const releases = await response.json() as IRelease[];
    const release = releases?.find(r => r.tag_name.startsWith('v'));
    const asset = release?.assets?.find(a => a.name.endsWith('.exe'));

    console.log('Remote Asset', asset.name);

    await downloadFile(asset.browser_download_url, asset.name);
    await sleep(1000);
    updateName = asset.name;
}

export function triggerInstallUpdate() {
    updateInstallTrigger = true;
    forceQuit();
}

export function maybeInstallUpdate() {
    if (updateName && updateInstallTrigger) {
        console.log('Installing update...');
        const parameters = ['/S', '--force-run'];
        spawnDetached(updateName, parameters);
    }
}

app.on('quit', (_: Event, exitCode: number) => {
  console.log('App quit with exit code', exitCode);
  if (exitCode !== 0) return;
  maybeInstallUpdate();
});
