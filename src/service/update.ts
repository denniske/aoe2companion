import Constants from 'expo-constants';
import {Platform} from "react-native";
import {sleep} from "../helper/util";
import {checkForUpdateAsync, fetchUpdateAsync, UpdateCheckResult} from "expo-updates";
import {lt} from "semver";

const packageName = Constants.manifest.android?.package;

export async function doCheckForUpdateAsync() {
    if (__DEV__) {
        await sleep(1000);
        return {
            isAvailable: false,
        } as UpdateCheckResult;
        // return {
        //     isAvailable: true,
        //     manifest: {
        //         version: '20.0.0',
        //     },
        // } as UpdateCheckResult;
    }
    return await checkForUpdateAsync();
}

export async function doFetchUpdateAsync() {
    if (__DEV__) {
        return await sleep(2000);
    }
    return await fetchUpdateAsync();
}


export async function doCheckForChangelog(changelogLastVersionRead: string) {
    return ;
}


export async function doCheckForStoreUpdate() {
    switch (Platform.OS) {
        case 'android': {
            const updateUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=en`;
            const response = await fetch(updateUrl);
            const result = await response.text();
            const match = result.match(/Current Version.+?>([\d.]+)<\/span>/);
            if (match) {
                const version = match[1].trim();
                if (lt(Constants.manifest.version!, version)) {
                    return {
                        version,
                        storeUrl: updateUrl,
                        url: updateUrl,
                    };
                }
            }
            return null;
        }
        case 'ios': {
            const updateUrl = `https://itunes.apple.com/lookup?bundleId=${packageName}`;
            const response = await fetch(updateUrl);
            const result = await response.json();
            if (result.resultCount) {
                const version = result.results[0].version;
                const appId = result.results[0].trackId;
                const storeUrl = `itms-apps://apps.apple.com/app/id${appId}`;
                const url = `https://apps.apple.com/app/id${appId}`;
                if (lt(Constants.manifest.version!, version)) {
                    return {
                        version,
                        storeUrl,
                        url,
                    };
                }
            }
            return null;
        }
    }
}
