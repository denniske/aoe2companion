import * as React from 'react';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import Snackbar from '../snackbar';
import { useSelector } from '../../../redux/reducer';
import { compareBuild } from 'semver';
import Constants from 'expo-constants';
import { getTranslation } from '../../../helper/translate';
import { sleep } from '@nex/data';
import { router } from 'expo-router';
import { IChangelogPageParams } from '@app/app/more/changelog';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-prefs';

export default function ChangelogSnackbar() {
    const updateAvailable = useSelector((state) => state.updateAvailable);
    const changelogLastVersionRead = usePrefData((state) => state.changelogLastVersionRead);
    const [currentVersion, setCurrentVersion] = useState<string>();
    const savePrefsMutation = useSavePrefsMutation();

    console.log('currentVersion', currentVersion);

    const lessThan = -1;
    const visible =
        currentVersion != null && (changelogLastVersionRead == null || compareBuild(changelogLastVersionRead, currentVersion) === lessThan);

    const openChangelog = () => {
        router.push({ pathname: '/more/changelog', params: { changelogLastVersionRead } as IChangelogPageParams });
        close();
    };

    const initVersion = async () => {
        // Hack: Prevent harmless webkit-app-region css warning
        await sleep(100);
        setCurrentVersion(Constants.expoConfig?.version);
    };

    useEffect(() => {
        initVersion();
        // savePrefsMutation.mutate({changelogLastVersionRead: '26.0.0+0'});
    }, []);

    const close = () => {
        savePrefsMutation.mutate({ changelogLastVersionRead: currentVersion });
    };

    let message = getTranslation('changelogsnackbar.appupdated');
    let actions: any = [
        {
            label: getTranslation('changelogsnackbar.showchanges'),
            onPress: openChangelog,
        },
        {
            label: 'X',
            onPress: close,
        },
    ];

    return (
        <Snackbar style={styles.bar} visible={visible && !updateAvailable} onDismiss={close} actions={actions}>
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    bar: {
        ...(Platform.OS === 'web' ? {"-webkit-app-region": "no-drag"} : {}),
    } as ViewStyle,
});
