import {StyleProp, StyleSheet, Text, TextProps, TextStyle, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {ITheme, makeVariants, useTheme} from "../../theming";

type TextLoaderProps = TextProps & {
    children?: React.ReactNode,
    ready?: any,
    textStyle?: StyleProp<TextStyle>,
    width?: number,
}

export function TextLoader(props: TextLoaderProps) {
    const styles = useTheme(variants);
    const { children, ...rest } = props;

    const hostStyle: any = { flexDirection: 'row', display: 'flex' };
    if ('width' in props) {
        hostStyle.width = props.width;
    }

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, hostStyle]}>
                <View style={styles.container}>
                    <MyText numberOfLines={1} style={styles.text}>....................................</MyText>
                </View>
            </View>
        );
    }
    return (
        <MyText {...props}/>
    )
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.skeletonColor,
            borderRadius: 5,
            flexDirection: 'row',
            flex: 1
        },
        text: {
            color: 'transparent',
        },
    });
};

const variants = makeVariants(getStyles);
