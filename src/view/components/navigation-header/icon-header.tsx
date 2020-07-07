import {ImageBackground, ImageSourcePropType, LayoutChangeEvent, Platform, StyleSheet, Text, View} from "react-native";
import React from "react";

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
                <Text style={styles.title} numberOfLines={1}>{text}</Text>
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
        paddingLeft: 35,
        height: 38,
    },
    imageInner: {
        // backgroundColor: 'blue',
        resizeMode: "contain",
        width: 30,
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
