import * as React from 'react';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Snackbar from '../snackbar';
import {
    setUpdateAvailable,
    setUpdateManifest,
    setUpdateState,
    setUpdateStoreManifest,
    useMutate,
    useSelector,
} from '@app/redux/reducer';
import { reloadAsync } from 'expo-updates';
import {
    doCheckForStoreUpdate,
    doCheckForUpdateAsync,
    doFetchUpdateAsync,
    doStoreUpdate,
} from '@app/service/update';
import Constants from 'expo-constants';
import { openAppInStore } from 'expo-app-update';
import { useTranslation } from '@app/helper/translate';
import { ExpoUpdatesManifest } from 'expo-manifests';


export default function UpdateSnackbar() {
    const getTranslation = useTranslation();
    const updateManifest = useSelector(state => state.updateManifest);
    const updateStoreManifest = useSelector(state => state.updateStoreManifest);
    const updateAvailable = useSelector(state => state.updateAvailable);
    const updateState = useSelector(state => state.updateState);
    const mutate = useMutate();

    const init = async () => {
        if (Constants.expoConfig == null) return;
        if (updateManifest !== undefined) return;

        try {
            const update = await doCheckForUpdateAsync();
            if (update.isAvailable) {
                mutate(setUpdateManifest(update.manifest! as ExpoUpdatesManifest));
                return;
            }
        } catch (e) {
        }

        const storeUpdate = await doCheckForStoreUpdate();
        if (storeUpdate?.isAvailable) {
            mutate(setUpdateStoreManifest(storeUpdate));
            return;
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
            message = getTranslation('updatesnackbar.update.updateavailable', { version: `v${updateManifest?.extra?.expoClient?.version}` });
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
            const store = getTranslation(`updatesnackbar.store.${Platform.OS}` as any);
            message = getTranslation('updatesnackbar.update.updateavailableinstore', {
                version: `v${updateStoreManifest.version}`,
                store,
            });
            actions = [
                ...(
                    Platform.OS === 'android' ?
                        [
                            {
                                label: 'Load',
                                onPress: doStoreUpdate,
                            },
                        ] : [
                            {
                                label: 'Open',
                                onPress: openAppInStore,
                            },
                        ]
                ),
                {
                    label: 'X',
                    onPress: close,
                },
            ];
            break;
        case 'downloading':
            message = getTranslation('updatesnackbar.update.downloadingupdate');
            actions = [];
            break;
        case 'downloaded':
            message = getTranslation('updatesnackbar.update.updatedownloaded');
            actions = [
                {
                    label: getTranslation('updatesnackbar.action.restart'),
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

const styles = StyleSheet.create({});
