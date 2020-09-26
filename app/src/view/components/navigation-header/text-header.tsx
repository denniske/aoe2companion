import {LayoutChangeEvent, Platform, StyleSheet, Text, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";

interface TextHeaderProps {
    text: string;
    onLayout: (e: LayoutChangeEvent) => void;
}

export default function TextHeader(props: TextHeaderProps) {
    const {text, onLayout} = props;
    return (
        <View style={styles.container} onLayout={onLayout}>
            <MyText style={styles.title} numberOfLines={1}>{text}</MyText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    // From react-navigation HeaderTitle.tsx
    title: Platform.select({
        ios: {
            // backgroundColor: 'yellow',
            fontSize: 17,
            fontWeight: '600',
        },
        android: {
            fontSize: 20,
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        default: {
            fontSize: 18,
            fontWeight: '500',
        },
    }),
});
