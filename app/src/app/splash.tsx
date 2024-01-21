import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createStylesheet} from '../theming-new';


export default function SplashPage() {
    const styles = useStyles();

    return (
        <View style={styles.container}/>
    );
}


const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flex: 1,
    },
}));
