import {Image, ImageProps, StyleSheet, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {createStylesheet} from '../../../theming-new';

// interface ImageLoaderProps extends ImageProps {
//     source?: ImageSourcePropType;
// }

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type ImageLoaderProps = Optional<ImageProps, 'source'> & {
    ready?: any,
}

export function ImageLoader(props: ImageLoaderProps) {
    const styles = useStyles();
    if (props.source == null || ('ready' in props && !props.ready)) {
        return (
            <View {...props} style={[props.style, styles.container, {height: 'auto'}]}>
                <MyText style={styles.text} numberOfLines={1}>....................................</MyText>
            </View>
        );
    }
    return (
        <Image fadeDuration={0} {...(props as ImageProps)}/>
    )
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        backgroundColor: theme.skeletonColor,
        borderRadius: 5,
        flexDirection: 'row',
    },
    text: {
        color: 'transparent',
    },
}));
