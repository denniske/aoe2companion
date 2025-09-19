import Constants from 'expo-constants';
import { sleep } from '@nex/data';
import { checkForUpdateAsync, fetchUpdateAsync } from 'expo-updates';
import { doAppUpdate, getAppUpdateInfo, UpdateAvailability } from 'expo-app-update';
import { Platform } from 'react-native';

const packageName = Constants.expoConfig?.android?.package;

export async function doCheckForUpdateAsync() {
    // if (__DEV__) {
    //     await sleep(1000);
    //     return {
    //         isAvailable: false,
    //     } as UpdateCheckResult;
    //     // return {
    //     //     isAvailable: true,
    //     //     manifest: {
    //     //         version: '20.0.0',
    //     //     },
    //     // } as UpdateCheckResult;
    // }
    return await checkForUpdateAsync();
}

export async function doFetchUpdateAsync() {
    if (__DEV__) {
        return await sleep(2000);
    }
    return await fetchUpdateAsync();
}

function androidVersionCodeToSemver(versionCode: number) {
    const major = parseInt(versionCode.toString().slice(0, -4));
    const minor = parseInt(versionCode.toString().slice(-4, -2));
    const patch = parseInt(versionCode.toString().slice(-2));
    return `${major}.${minor}.${patch}`;
}

export async function doStoreUpdate() {
    await doAppUpdate();
}

export async function doCheckForStoreUpdate() {
    if (Constants.expoConfig == null) return null;
    try {
        const appUpdateInfo = await getAppUpdateInfo();
        // console.log('appUpdateInfo', appUpdateInfo);

        return {
            isAvailable: appUpdateInfo.updateAvailable,
            version: Platform.OS === 'android' ?
                androidVersionCodeToSemver(appUpdateInfo.android!.availableVersionCode)
                : appUpdateInfo.ios?.version,
        };
    } catch (e) {
        console.log('doCheckForStoreUpdate', 'error', e);
        return null;
    }
}
