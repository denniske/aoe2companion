import * as React from 'react';
import { useEffect } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import Snackbar from '../snackbar';
import { useSelector } from '../../../redux/reducer';
import { compareBuild } from 'semver';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { IChangelogPageParams } from '@app/app/more/changelog';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { useAccountData } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';

export default function ChangelogSnackbar() {
    const getTranslation = useTranslation();
    const updateAvailable = useSelector((state) => state.updateAvailable);
    const accountId = useAccountData((state) => state?.accountId);
    const accountLoaded = accountId != null;
    const changelogLastVersionRead = usePrefData((state) => state?.changelogLastVersionRead);
    const savePrefsMutation = useSavePrefsMutation();

    const lessThan = -1;
    const currentVersion = Constants.expoConfig?.version;

    // console.log('accountLoaded', accountLoaded);
    // console.log('changelogLastVersionRead', changelogLastVersionRead);
    // console.log('currentVersion', currentVersion);

    const visible =
        currentVersion != null &&
        accountLoaded &&
        (changelogLastVersionRead == null || compareBuild(changelogLastVersionRead, currentVersion) === lessThan);

    const openChangelog = () => {
        router.push({ pathname: '/more/changelog', params: { changelogLastVersionRead } as IChangelogPageParams });
        close();
    };

    useEffect(() => {
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
        ...(Platform.OS === 'web' ? { '-webkit-app-region': 'no-drag' } : {}),
    } as ViewStyle,
});
