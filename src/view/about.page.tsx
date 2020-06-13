import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Constant } from '../constant';
import Constants from 'expo-constants';

export default function AboutPage() {
    return (
            <View style={styles.container}>
                <Text style={styles.title}>AoE II Companion</Text>

                <Text style={styles.heading}>Created by</Text>
                <Text style={styles.content}>Dennis Keil</Text>
                <Text style={styles.content}>Niklas Ohlrogge</Text>

                <Text style={styles.heading}>Version</Text>
                <Text style={styles.content}>{Constant.version}n{Constants.nativeAppVersion}+{Constants.nativeBuildVersion}</Text>
                <Text/>

                <Text style={styles.textJustify}>This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or
                    registered trademarks of Microsoft Corporation in the U.S. and other countries.</Text>

                <Text/>
                <View style={styles.row}>
                    <Text style={styles.content}>All data in this app is fetched from </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://aoe2.net')}>
                        <Text style={styles.link}>aoe2.net</Text>
                    </TouchableOpacity>
                    {/*<Text style={styles.content}>.</Text>*/}

                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    heading: {
        marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        marginBottom: 5,
    },
    textJustify: {
        textAlign: 'justify',
    },
    row: {
        flexDirection: 'row',
    },
    link: {
        color: '#397AF9',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },
});
