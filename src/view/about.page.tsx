import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useLinkTo } from '@react-navigation/native';

// const doChange = throttle(
//         (v) => {
//             field.input.onChange(v);
//         },
//         250,
//         {
//             leading: false,
//             trailing: true,
//         }
// );

export default function AboutPage() {
    const linkTo = useLinkTo();

    return (
            <View style={styles.container}>
                <Text style={styles.title}>AoE II Companion</Text>

                <Text style={styles.heading}>Created by</Text>
                <Text style={styles.content}>Dennis Keil</Text>
                <Text style={styles.content}>Niklas Ohlrogge</Text>

                <Text style={styles.heading}>Version</Text>
                <Text style={styles.content}>{Constants.manifest.version}n{Constants.nativeAppVersion}+{Constants.nativeBuildVersion}</Text>

                <Text/>
                <View style={styles.row}>
                    <Text style={styles.content}>Data from </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://aoe2.net')}>
                        <Text style={styles.link}>aoe2.net</Text>
                    </TouchableOpacity>
                </View>

                <Text/>
                <View style={styles.row}>
                    <Text style={styles.content}>Icons from </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/madebybowtie/FlagKit')}>
                        <Text style={styles.link}>FlagKit</Text>
                    </TouchableOpacity>
                </View>

                <Text/>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => linkTo('/privacy')}>
                        <Text style={styles.link}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.expanded}/>

                <Text style={styles.textJustify}>This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or
                    registered trademarks of Microsoft Corporation in the U.S. and other countries.</Text>

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
        fontSize: 12,
    },
    expanded: {
        flex: 1,
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
