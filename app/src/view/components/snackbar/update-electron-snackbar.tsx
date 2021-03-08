import * as React from 'react';
import {useEffect} from 'react';
import {Platform, StyleSheet, ViewStyle} from 'react-native';
import Snackbar from "../snackbar";
import {
    setUpdateAvailable,
    setUpdateElectronManifest,
    setUpdateState,
    useMutate,
    useSelector
} from "../../../redux/reducer";
import {getTranslation} from '../../../helper/translate';
import {
    doCheckForUpdateElectronAsync,
    doFetchUpdateElectronAsync,
    installUpdateElectronAsync
} from "../../../helper/electron";


export default function UpdateElectronSnackbar() {
    const updateElectronManifest = useSelector(state => state.updateElectronManifest);
    const updateAvailable = useSelector(state => state.updateAvailable);
    const updateState = useSelector(state => state.updateState);
    const mutate = useMutate();

    const init = async () => {
        console.log('UPDATE doCheckForUpdateElectronAsync');
        const update = await doCheckForUpdateElectronAsync();
        if (update) {
            console.log('MANIFEST', update);
            mutate(setUpdateElectronManifest(update));
            return;
        }
    };

    useEffect(() => {
        init();
    }, []);

    const fetchUpdate = async () => {
        mutate(setUpdateState('downloading'));
        await doFetchUpdateElectronAsync();
        mutate(setUpdateState('downloaded'));
    };

    const restart = async () => {
        await installUpdateElectronAsync();
    };

    const close = () => {
        mutate(setUpdateAvailable(false));
    };

    let message = '';
    let actions: any = [];
    switch (updateState) {
        case 'electronUpdateAvailable':
            message = getTranslation('updatesnackbar.update.updateavailable', { version: `v${updateElectronManifest?.version}` });
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
            style={styles.bar}
            visible={updateAvailable}
            onDismiss={close}
            actions={actions}
            working={updateState === 'downloading'}
        >
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    bar: {
        ...(Platform.OS === 'web' ? {"-webkit-app-region": "no-drag"} : {}),
    } as ViewStyle,
});
