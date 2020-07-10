import * as React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Snackbar from "./snackbar";
import {setUpdateAvailable, setUpdateManifest, setUpdateState, useMutate, useSelector} from "../../redux/reducer";
import {checkForUpdateAsync, fetchUpdateAsync, reloadAsync, UpdateCheckResult} from "expo-updates";
import {sleep} from "../../helper/util";


export async function doCheckForUpdateAsync() {
    if (__DEV__) {
        await sleep(1000);
        return {
            isAvailable: true,
            manifest: {
                version: '20.0.0',
            },
        } as UpdateCheckResult;
    }
    return await checkForUpdateAsync();
}

export async function doFetchUpdateAsync() {
    if (__DEV__) {
        return await sleep(2000);
    }
    return await fetchUpdateAsync();
}

export default function UpdateSnackbar() {
    const updateManifest = useSelector(state => state.updateManifest);
    const updateAvailable = useSelector(state => state.updateAvailable);
    const updateState = useSelector(state => state.updateState);
    const mutate = useMutate();

    console.log("UpdateSnackbar updateManifest", updateManifest);

    const init = async () => {
        if (updateManifest !== undefined) return;
        console.log("init");
        const update = await doCheckForUpdateAsync();
        if (update.isAvailable) {
            mutate(setUpdateManifest(update.manifest));
        } else {
            close();
        }
    };

    useEffect(() => {
        init();
    }, []);

    const fetchUpdate = async () => {
        mutate(setUpdateState('downloading'));
        await doFetchUpdateAsync();
        mutate(setUpdateState('downloaded'));
    };

    const restart = async () => {
        await reloadAsync();
    };

    const close = () => {
        mutate(setUpdateAvailable(false));
    };

    let message = '';
    let actions: any = [];
    switch (updateState) {
        case 'updateAvailable':
            message = `Update v${updateManifest?.version} available!`;
            actions = [
                {
                    label: 'Load',
                    onPress: fetchUpdate,
                },
                {
                    label: 'X',
                    onPress: close,
                },
            ];
            break;
        case 'downloading':
            message = 'Downloading update';
            actions = [];
            break;
        case 'downloaded':
            message = 'Update downloaded!';
            actions = [
                {
                    label: 'Restart',
                    onPress: restart,
                },
                {
                    label: 'X',
                    onPress: close,
                },
            ];
    }

    return (
        <Snackbar
            visible={updateAvailable}
            onDismiss={() => alert('dismiss')}
            actions={actions}
            working={updateState === 'downloading'}>
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({

});
