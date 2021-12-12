import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {createStylesheet} from '../theming-new';
import Purchases from 'react-native-purchases';


export default function PurchasePage() {
    const styles = useStyles();
    const [offerings, setOfferings] = useState({});

    const getOfferings = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            const products = await Purchases.getProducts(['coffee']);
            setOfferings(offerings);
            console.log('offerings', offerings);
            console.log('products', products);
        } catch (e) {
            setOfferings({ text: 'Offerings error: ' + e });
            console.log('offerings error', e);
        }
    };

    useEffect(() => {
        console.log('Purchases configure start');
        Purchases.setDebugLogsEnabled(true);
        Purchases.setup(Platform.OS === 'android' ? 'goog_zplywHQQpwVFHSSxskZzKlRuwZO' : 'appl_kOclOwIXEyXVRYYmCPGyRtMxXsH');
        console.log('Purchases configure end2');
        getOfferings();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <MyText>{JSON.stringify(offerings, null, 4)}</MyText>
        </ScrollView>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        // alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
    note: {
        color: theme.textNoteColor,
        textAlign: 'center',
    },
}));
