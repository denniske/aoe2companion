import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";


export default function SplashPage() {
    const styles = useTheme(variants);
    const theme = useAppTheme();

    return (
        <View style={styles.container}/>
    );
}


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
    });
};

const variants = makeVariants(getStyles);
