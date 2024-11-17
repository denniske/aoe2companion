import * as React from 'react';
import { useEffect } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
import Snackbar from '../snackbar';
import {
    setUpdateAvailable,
    setUpdateManifest,
    setUpdateState,
    setUpdateStoreManifest,
    useMutate,
    useSelector,
} from '../../../redux/reducer';
import { reloadAsync } from 'expo-updates';
import {
    doCheckForStoreUpdate,
    doCheckForUpdateAsync,
    doFetchUpdateAsync,
    doStoreUpdate,
} from '../../../service/update';
import Constants from 'expo-constants';
import { getTranslation } from '../../../helper/translate';
import { openAppInStore } from 'expo-app-update';


export default function UpdateSnackbar() {
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
                mutate(setUpdateManifest(update.manifest!));
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
