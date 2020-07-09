import {Linking, StyleSheet, Text, View} from "react-native";
import React from "react";
import {linkColor} from "../styles";
import {MyText} from "./my-text";


interface FandomProps {
    articleName: string;
}

export default function Fandom(props: FandomProps) {
    const { articleName } = props;
    return (
        <MyText style={styles.container}>
            <MyText style={styles.text}>This article uses material from the "{articleName}" article on the </MyText>
            <MyText style={styles.link} onPress={() => Linking.openURL('https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal')}>Age of Empires II Wiki</MyText>
            <MyText style={styles.text}> at </MyText>
            <MyText style={styles.link} onPress={() => Linking.openURL('https://www.fandom.com/')}>Fandom</MyText>
            <MyText style={styles.text}> and is licensed under the </MyText>
            <MyText style={styles.link} onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-sa/3.0/')}>Creative Commons Attribution-Share Alike License</MyText>
            <MyText style={styles.text}>.</MyText>
        </MyText>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
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
