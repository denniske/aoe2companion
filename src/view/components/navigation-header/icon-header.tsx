import {ImageBackground, ImageSourcePropType, LayoutChangeEvent, Platform, StyleSheet, Text, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {iconWidth} from "../../../helper/theme";

interface IconHeaderProps {
    icon: ImageSourcePropType;
    text: string;
    onLayout: (e: LayoutChangeEvent) => void;
}

export default function IconHeader(props: IconHeaderProps) {
    const {icon, text, onLayout} = props;
    return (
        <View style={styles.container} onLayout={onLayout}>
            <ImageBackground source={icon}
                             imageStyle={styles.imageInner}
                             style={styles.image}>
                <MyText style={styles.title} numberOfLines={1}>{text}</MyText>
            </ImageBackground>
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
    image: {
        // backgroundColor: 'blue',
        justifyContent: 'center',
        paddingLeft: iconWidth*1.15,
        height: 38,
    },
    imageInner: {
        // backgroundColor: 'blue',
        resizeMode: "contain",
        width: iconWidth,
        left: 0,
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
