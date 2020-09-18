import {
    Image, ImageProps, ImageSourcePropType, StyleProp, StyleSheet, Text, TextProps, TextStyle, View
} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {ITheme, makeVariants, useTheme} from "../../../theming";

// interface ImageLoaderProps extends ImageProps {
//     source?: ImageSourcePropType;
// }

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type ImageLoaderProps = Optional<ImageProps, 'source'> & {
    ready?: any,
}

export function ImageLoader(props: ImageLoaderProps) {
    const styles = useTheme(variants);
    if (props.source == null || ('ready' in props && !props.ready)) {
        return (
            <View {...props} style={[props.style, styles.container, {height: 'auto'}]}>
                <MyText style={styles.text} numberOfLines={1}>....................................</MyText>
            </View>
        );
    }
    return (
        <Image {...(props as ImageProps)}/>
    )
}

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.skeletonColor,
            borderRadius: 5,
            flexDirection: 'row',
        },
        text: {
            color: 'transparent',
        },
    });
};

const variants = makeVariants(getStyles);