import * as React from 'react';
import {useEffect} from 'react';
import {Linking, Platform, StyleSheet} from 'react-native';
import Snackbar from "../snackbar";
import {
    setUpdateAvailable, setUpdateManifest, setUpdateState, setUpdateStoreManifest, useMutate, useSelector
} from "../../../redux/reducer";
import {reloadAsync} from "expo-updates";
import {doCheckForStoreUpdate, doCheckForUpdateAsync, doFetchUpdateAsync} from "../../../service/update";
import {lt} from "semver";
import Constants from "expo-constants";


export default function UpdateSnackbar() {
    const updateManifest = useSelector(state => state.updateManifest);
    const updateStoreManifest = useSelector(state => state.updateStoreManifest);
    const updateAvailable = useSelector(state => state.updateAvailable);
    const updateState = useSelector(state => state.updateState);
    const changelogLastVersionRead = useSelector(state => state.prefs.changelogLastVersionRead);
    const mutate = useMutate();

    const init = async () => {
        if (updateManifest !== undefined) return;
        const update = await doCheckForUpdateAsync();
        if (update.isAvailable) {
            mutate(setUpdateManifest(update.manifest));
            return;
        }
        const storeUpdate = await doCheckForStoreUpdate();
        if (storeUpdate) {
            mutate(setUpdateStoreManifest(storeUpdate));
            return;
        }
        if (changelogLastVersionRead == null || lt(changelogLastVersionRead, Constants.manifest.version!)) {

        }
        close();
    };

    useEffect(() => {
        init();
    }, []);

    const fetchUpdate = async () => {
        mutate(setUpdateState('downloading'));
        await doFetchUpdateAsync();
        mutate(setUpdateState('downloaded'));
    };

    const openStore = async () => {
        if (await Linking.canOpenURL(updateStoreManifest.storeUrl)) {
            await Linking.openURL(updateStoreManifest.storeUrl);
            return;
        }
        await Linking.openURL(updateStoreManifest.url);
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
        case 'expoUpdateAvailable':
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
        case 'storeUpdateAvailable':
            const store = Platform.select({ios: 'App Store', android: 'Play Store'});
            message = `Update v${updateStoreManifest.version} in ${store}!`;
            actions = [
                {
                    label: 'Open',
                    onPress: openStore,
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
            onDismiss={close}
            actions={actions}
            working={updateState === 'downloading'}>
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({

});
