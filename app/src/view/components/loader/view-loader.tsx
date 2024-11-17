import {StyleSheet, Text, TextProps, View} from "react-native";
import React from "react";
import {makeVariants, useTheme} from "../../../theming";
import {createStylesheet} from '../../../theming-new';

type TextLoaderProps = TextProps & { children?: React.ReactNode, ready?: any }

export function ViewLoader(props: TextLoaderProps) {
    const styles = useStyles();
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

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        backgroundColor: theme.skeletonColor,
        borderRadius: 5,
        flexDirection: 'row',
    },
    view: {
        opacity: 0,
    },
}));
