import * as React from 'react';
import {Platform, StyleSheet, ViewStyle} from 'react-native';
import Snackbar from "../snackbar";
import {setPrefValue, useMutate, useSelector} from "../../../redux/reducer";
import {compareBuild} from "semver";
import Constants from "expo-constants";
import {saveCurrentPrefsToStorage} from '../../../service/storage';
import {getTranslation} from '../../../helper/translate';
import {useEffect, useState} from "react";
import { sleep } from '@nex/data';
import { router } from 'expo-router';
import { IChangelogPageParams } from '@app/app/more/changelog';


export default function ChangelogSnackbar() {
    const updateAvailable = useSelector(state => state.updateAvailable);
    const prefs = useSelector(state => state.prefs);
    const changelogLastVersionRead = useSelector(state => state.prefs.changelogLastVersionRead);
    const [currentVersion, setCurrentVersion] = useState<string>();
    const mutate = useMutate();

    // mutate(setPrefValue('changelogLastVersionRead', '10.0.5'));
    // console.log('changelogLastVersionRead', changelogLastVersionRead);

    console.log('currentVersion', currentVersion);

    const lessThan = -1;
    const visible = currentVersion != null && (changelogLastVersionRead == null || compareBuild(changelogLastVersionRead, currentVersion) === lessThan);

    const openChangelog = () => {
        router.push({pathname: '/more/changelog', params: {changelogLastVersionRead} as IChangelogPageParams});
        close();
    };

    const initVersion = async () => {
        // Hack: Prevent harmless webkit-app-region css warning
        await sleep(100);
        setCurrentVersion(Constants.expoConfig?.version);
    };

    useEffect(() => {
        initVersion();
        // mutate(setPrefValue('changelogLastVersionRead', '26.0.0+0'));
        // saveCurrentPrefsToStorage();
    }, [])

    const close = () => {
        mutate(setPrefValue('changelogLastVersionRead', currentVersion));
        saveCurrentPrefsToStorage();
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
        <Snackbar
            style={styles.bar}
            visible={visible && !updateAvailable}
            onDismiss={close}
            actions={actions}>
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    bar: {
        ...(Platform.OS === 'web' ? {"-webkit-app-region": "no-drag"} : {}),
    } as ViewStyle,
});
