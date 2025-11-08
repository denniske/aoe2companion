import { StyleSheet } from 'react-native';
import React from 'react';
import { MyText } from './my-text';


export function TabBarLabel({ title, focused, color }: any) {
    return (
        <MyText style={[styles.label, { color: color }]}>{title.toUpperCase()}</MyText>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 13,
        textAlign: 'center',
        // whiteSpace: 'pre-line',
    },
});
