import * as React from 'react';
import {useEffect} from 'react';
import {Linking, Platform, StyleSheet} from 'react-native';
import Snackbar from "./snackbar";
import {
    setPrefValue,
    setUpdateAvailable, setUpdateManifest, setUpdateState, setUpdateStoreManifest, useMutate, useSelector
} from "../../redux/reducer";
import {reloadAsync} from "expo-updates";
import {doCheckForStoreUpdate, doCheckForUpdateAsync, doFetchUpdateAsync} from "../../service/update";
import {lt} from "semver";
import Constants from "expo-constants";
import {RootStackParamList} from "../../../App";
import {getRootNavigation} from "../../service/navigation";


export default function ChangelogSnackbar() {
    const updateAvailable = useSelector(state => state.updateAvailable);
    const changelogLastVersionRead = useSelector(state => state.prefs.changelogLastVersionRead);
    const mutate = useMutate();

    // mutate(setPrefValue('changelogLastVersionRead', '10.0.5'));
    // console.log('changelogLastVersionRead', changelogLastVersionRead);

    const visible = (changelogLastVersionRead == null || lt(changelogLastVersionRead, Constants.manifest.version!));

    const openChangelog = () => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: 'Changelog', params: {changelogLastVersionRead}}],
        });
        close();
    };

    const close = () => {
        mutate(setPrefValue('changelogLastVersionRead', Constants.manifest.version));
    };

    let message = 'App has been updated.';
    let actions: any = [
                {
                    label: 'Show Changes',
                    onPress: openChangelog,
                },
                {
                    label: 'X',
                    onPress: close,
                },
            ];

    return (
        <Snackbar
            visible={visible && !updateAvailable}
            onDismiss={close}
            actions={actions}>
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({

});
