import {StyleProp, StyleSheet, Text, TextProps, TextStyle, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {ITheme, makeVariants, useTheme} from "../../../theming";

type TextLoaderProps = TextProps & {
    children?: React.ReactNode,
    ready?: any,
    textStyle?: StyleProp<TextStyle>,
    width?: number,
}

export function TextLoader(props: TextLoaderProps) {
    const styles = useTheme(variants);
    const { children, ...rest } = props;

    const hostStyle: any = { color: 'transparent' };//{ flexDirection: 'row', display: 'flex', flexShrink: 1, };
    if ('width' in props) {
        hostStyle.width = props.width;
    }

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <MyText numberOfLines={1} style={[rest.style, hostStyle, styles.container]}>......................................</MyText>
        );
    }
    // if (props.children == null || ('ready' in props && !props.isReady)) {
    //     return (
    //         <View {...rest} style={[rest.style, hostStyle]}>
    //             <View style={styles.container}>
    //                 <MyText numberOfLines={1} style={styles.text}>sdffffffffffffffffffffffffffffffffffffffffffffffffffff</MyText>
    //             </View>
    //         </View>
    //     );
    // }

    const { ready, ...restProps } = props;

    return (
        <MyText {...restProps}/>
    )
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            flexShrink: 1,
            backgroundColor: theme.skeletonColor,
            borderRadius: 5,
            // flexDirection: 'row',
            // flex: 1
        },
        text: {
            // color: 'transparent',
        },
    });
};

const variants = makeVariants(getStyles);
