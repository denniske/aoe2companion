import {LayoutChangeEvent, Platform, StyleSheet, Text, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {ITheme, makeVariants, useTheme} from "../../../theming";

interface SubtitleHeaderProps {
    text: string;
    subtitle: string;
    onLayout: (e: LayoutChangeEvent) => void;
}

export default function SubtitleHeader(props: SubtitleHeaderProps) {
    const styles = useTheme(variants);
    const {text, subtitle, onLayout} = props;
    return (
        <View style={styles.container} onLayout={onLayout}>
            <MyText style={styles.title} numberOfLines={1}>{text}</MyText>
            <MyText style={styles.subtitle} numberOfLines={1}>{subtitle}</MyText>
        </View>
    );
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            // backgroundColor: 'red',
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
        subtitle: Platform.select({
            ios: {
                // backgroundColor: 'yellow',
                fontSize: 13,
                fontWeight: '600',
                color: theme.textNoteColor,
                marginTop: 2,
            },
            android: {
                fontSize: 16,
                fontFamily: 'sans-serif-medium',
                fontWeight: 'normal',
                color: theme.textNoteColor,
            },
            default: {
                fontSize: 14,
                fontWeight: '500',
                color: theme.textNoteColor,
            },
        })
    });
};

const variants = makeVariants(getStyles);
