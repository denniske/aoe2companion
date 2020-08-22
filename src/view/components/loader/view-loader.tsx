import {StyleSheet, Text, TextProps, View} from "react-native";
import React from "react";
import {ITheme, makeVariants, useTheme} from "../../../theming";

type TextLoaderProps = TextProps & { children?: React.ReactNode, ready?: any }

export function ViewLoader(props: TextLoaderProps) {
    const styles = useTheme(variants);
    const { children, ...rest } = props;

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, { flexDirection: 'row', display: 'flex'}]}>
                <View style={styles.container}>
                    <View style={styles.view}>{children}</View>
                </View>
            </View>
        );
    }
    return (
        <View>{children}</View>
    )
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.skeletonColor,
            borderRadius: 5,
            flexDirection: 'row',
        },
        view: {
            opacity: 0,
        },
    });
};

const variants = makeVariants(getStyles);
