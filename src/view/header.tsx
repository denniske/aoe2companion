import { Image, Picker, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';


export default function Header() {
    const [game, setGame] = useState('aoe2de');
    const [view, setView] = useState('my-matches');

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.icon} source={require('../../assets/icon.png')}/>
                    <Text>AoE II Companion</Text>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    container: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        // backgroundColor: '#f00',
        alignItems: 'center',
        // justifyContent: 'center',
    },
});
