import {Linking, StyleSheet, Text, View} from "react-native";
import {getUnitLineName} from "../../helper/units";
import React from "react";
import {linkColor} from "../styles";


interface FandomProps {
    articleName: string;
}

export default function Fandom(props: FandomProps) {
    const { articleName } = props;
    return (
        <Text style={styles.container}>
            <Text style={styles.text}>This article uses material from the "{articleName}" article on the </Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>Age of Empires II Wiki</Text>
            <Text style={styles.text}> at </Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.fandom.com/')}>Fandom</Text>
            <Text style={styles.text}> and is licensed under the </Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-sa/3.0/')}>Creative Commons Attribution-Share Alike License</Text>
            <Text style={styles.text}>.</Text>
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginTop: 20,
        lineHeight: 16,
    },
    link: {
        fontSize: 12,
        color: linkColor,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
});
