import {StyleProp, StyleSheet, Text, TextProps, TextStyle, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {makeVariants, useTheme} from "../../../theming";
import {createStylesheet} from '../../../theming-new';

type TextLoaderProps = TextProps & {
    children?: React.ReactNode,
    ready?: any,
    textStyle?: StyleProp<TextStyle>,
    width?: number,
}

export function TextLoader(props: TextLoaderProps) {
    const styles = useStyles();
    const { children, ...rest } = props;

    const hostStyle: any = { color: 'transparent' };
    if ('width' in props) {
        hostStyle.width = props.width;
    }

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <MyText numberOfLines={1} style={[rest.style, hostStyle, styles.container]} ellipsizeMode="clip">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</MyText>
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

    const { ready, style, textStyle, ...restProps } = props;

    if (textStyle) {
        return (
            <MyText style={[style, textStyle]} {...restProps}/>
        )
    }

    return (
        <MyText style={style} {...restProps}/>
    )
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flexShrink: 1,
        backgroundColor: theme.skeletonColor,
        borderRadius: 5,
        overflow: 'hidden',
    },
}));
