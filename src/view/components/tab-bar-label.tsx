import {useNavigation} from "@react-navigation/native";
import {StyleSheet, Text} from "react-native";
import React from "react";


export function TabBarLabel({ title, focused, color }: any) {
    const navigation = useNavigation();
    return (
        <Text style={[styles.label, { color: color }]} onPress={() => navigation.navigate(title)}>{title.toUpperCase()}</Text>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 13,
        textAlign: 'center',
    },
});
