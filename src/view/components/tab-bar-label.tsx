import {useNavigation} from "@react-navigation/native";
import {Text} from "react-native";
import React from "react";

export function TabBarLabel({ title, focused, color }: any) {
    const navigation = useNavigation();
    return (
        <Text style={{fontSize: 13, color: color}} onPress={() => navigation.navigate(title)} >{title.toUpperCase()}</Text>
    );
}
