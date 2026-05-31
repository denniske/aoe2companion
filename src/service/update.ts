import Constants from 'expo-constants';
import { sleep } from '@nex/data';
import { checkForUpdateAsync, fetchUpdateAsync } from 'expo-updates';
// import { doAppUpdate, getAppUpdateInfo, UpdateAvailability } from 'expo-app-update';
import { Linking, Platform } from 'react-native';
import { AppUpdate } from '@/modules/app-update/src';

// const { Hello } = Platform.OS !== 'web' ? requireNativeModule('AppUpdateModule') : {
//     Hello: 'WEB Hello',
// };

// const { Hello } = false ? requireNativeModule('AppUpdateModule') : {
//     Hello: 'WEB Hello',
// };

// const { Hello, getAppUpdateInfo } = requireNativeModule('AppUpdateModule');

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
    AppUpdate.doAppUpdate();
}

export async function doCheckForStoreUpdate() {
    if (Constants.expoConfig == null) return null;
    try {
        // console.log('INLINE', Hello);
        // return null;

        const appUpdateInfo = await AppUpdate.getAppUpdateInfo();
        console.log('appUpdateInfo', appUpdateInfo);

        return {
            isAvailable: appUpdateInfo.updateAvailable,
            version: Platform.OS === 'android' ? androidVersionCodeToSemver(appUpdateInfo.android!.availableVersionCode) : appUpdateInfo.ios?.version,
        };
    } catch (e) {
        console.log('doCheckForStoreUpdate', 'error', e);
        return null;
    }
}

export async function openAppInStore(): Promise<void> {
    if (Platform.OS === 'android' && Constants.expoConfig?.android?.playStoreUrl) {
        await Linking.openURL(Constants.expoConfig?.android?.playStoreUrl);
    } else if (Platform.OS === 'ios' && Constants.expoConfig?.ios?.appStoreUrl) {
        await Linking.openURL(Constants.expoConfig?.ios?.appStoreUrl);
    } else {
        console.log('openAppInStore: no store url found. Note: This method can only be used in production / test flight build.');
    }

    // const packageName = Constants.expoConfig?.android?.package;
    // if (Platform.OS === "android") {
    //     // Implement in native later:
    //     // https://developer.android.com/distribute/marketing-tools/linking-to-google-play#android-app
    //     await Linking.openURL(`https://play.google.com/store/apps/details?id=${packageName}&hl=en`);
    // } else {
    //     // const appUpdateInfo = await getAppUpdateInfo();
    //     // const appId = appUpdateInfo.
    //     // const storeUrl = `itms-apps://apps.apple.com/app/id${appId}`;
    //     // const url = `https://apps.apple.com/app/id${appId}`;
    //     // if (await Linking.canOpenURL(updateStoreManifest.storeUrl)) {
    //     //     await Linking.openURL(updateStoreManifest.storeUrl);
    //     //     return;
    //     // }
    //     // await Linking.openURL(updateStoreManifest.url);
    //     await Linking.openURL('https://apps.apple.com/app/id1518463195');
    // }

    //     const updateUrl = `https://itunes.apple.com/lookup?bundleId=${packageName}`;
    //     const response = await fetch(updateUrl);
    //     const result = await response.json();
    //     if (result.resultCount) {
    //         const version = result.results[0].version;
    //         const appId = result.results[0].trackId;
    //         const storeUrl = `itms-apps://apps.apple.com/app/id${appId}`;
    //         const url = `https://apps.apple.com/app/id${appId}`;
    //         return {
    //             isAvailable: lt(Constants.expoConfig.version!, version),
    //             version,
    //             storeUrl,
    //             url,
    //         };
    //     }
}
