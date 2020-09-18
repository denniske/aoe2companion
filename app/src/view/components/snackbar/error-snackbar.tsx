import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Snackbar from "../snackbar";
import {setError, useMutate, useSelector} from "../../../redux/reducer";


export default function ErrorSnackbar() {
    const error = useSelector(state => state.error);
    const mutate = useMutate();

    if (error == null) {
        return <View/>;
    }

    const close = () => {
        mutate(setError(null));
    };

    let message = `${error.title}`;

    // if (__DEV__) {
    //     message += `\n\n${error.actionDetails}`;
    //     message += `\n\n${error.error}`;
    // }

    let actions: any = [
                {
                    label: 'X',
                    onPress: close,
                },
            ];

    return (
        <Snackbar
            visible={true}
            onDismiss={close}
            actions={actions}>
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({

});
