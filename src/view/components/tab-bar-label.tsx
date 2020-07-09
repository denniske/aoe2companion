import {useNavigation} from "@react-navigation/native";
import {StyleSheet, Text} from "react-native";
import React from "react";
import {MyText} from "./my-text";


export function TabBarLabel({ title, focused, color }: any) {
    const navigation = useNavigation();
    return (
        <MyText style={[styles.label, { color: color }]} onPress={() => navigation.navigate(title)}>{title.toUpperCase()}</MyText>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 13,
        textAlign: 'center',
    },
});
