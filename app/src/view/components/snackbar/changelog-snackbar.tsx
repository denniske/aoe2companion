import * as React from 'react';
import {StyleSheet} from 'react-native';
import Snackbar from "../snackbar";
import {setPrefValue, useMutate, useSelector} from "../../../redux/reducer";
import {lt} from "semver";
import Constants from "expo-constants";
import {getRootNavigation} from "../../../service/navigation";
import {saveCurrentPrefsToStorage} from '../../../service/storage';


export default function ChangelogSnackbar() {
    const updateAvailable = useSelector(state => state.updateAvailable);
    const prefs = useSelector(state => state.prefs);
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
        saveCurrentPrefsToStorage();
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
