import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList, RootStackProp } from '../../App';

export default function WelcomePage() {
    const navigation = useNavigation<RootStackProp>();

    const nav = async (route: keyof RootStackParamList) => {
        navigation.reset({
            index: 0,
            routes: [{name: route}]
        });
    };

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to AoE II Companion</Text>

                <View style={styles.expanded}/>

                {/*<Text></Text>*/}

                {/*<TouchableOpacity style={styles.feature} onPress={() => nav('Search')}>*/}
                <View style={styles.feature}>
                    <FontAwesomeIcon style={styles.featureIcon} name="search" size={18} />
                    <Text>Search for users</Text>
                </View>

                <Text/>
                {/*<TouchableOpacity style={styles.feature} onPress={() => nav('Main')}>*/}
                <View style={styles.feature}>
                    <FontAwesomeIcon style={styles.featureIcon} name="user" size={18} />
                    <Text>Track your matches</Text>
                </View>

                <View style={styles.expanded}/>

                <Text style={styles.textJustify}>This app is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or
                    registered trademarks of Microsoft Corporation in the U.S. and other countries.</Text>

            </View>
    );
}

const styles = StyleSheet.create({
    feature: {
        flexDirection: 'row',
    },
    featureIcon: {
        // backgroundColor: 'blue',
        marginRight: 10,
        paddingLeft: 4,
        paddingRight: 4,
    },
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
