import {Image, ImageBackground, ImageSourcePropType, LayoutChangeEvent, Platform, StyleSheet, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";
import {iconHeight, iconWidth} from "@nex/data";
import {createStylesheet} from '../../../theming-new';

interface IconHeaderProps {
    icon: ImageSourcePropType;
    badgeIcon?: ImageSourcePropType;
    text: string;
    subtitle?: string;
    onLayout: (e: LayoutChangeEvent) => void;
}

export default function IconHeader(props: IconHeaderProps) {
    const styles = useStyles();
    const {icon, badgeIcon, text, subtitle, onLayout} = props;
    return (
        <View style={styles.container} onLayout={onLayout}>

            <ImageBackground source={icon}
                             imageStyle={styles.imageInner}
                             style={styles.image}>
                {
                    badgeIcon &&
                    <Image style={styles.unitIconBigBanner} source={badgeIcon}/>
                }
                <MyText style={subtitle ? styles.titleSmall : styles.title} numberOfLines={1}>{text}</MyText>
                {
                    subtitle &&
                    <MyText style={styles.subtitle} numberOfLines={1}>{subtitle}</MyText>
                }
            </ImageBackground>

        </View>
    );
}


const useStyles = createStylesheet(theme => StyleSheet.create({
    unitIconBigBanner: {
        position: 'absolute',
        width: iconWidth*0.5,
        height: iconHeight*0.5,
        left: iconWidth*0.50+5,
        bottom: 3,
    },

    container: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        // backgroundColor: 'blue',
        justifyContent: 'center',
        paddingLeft: iconWidth+15,
        height: 38,
    },
    imageInner: {
        // backgroundColor: 'blue',
        resizeMode: "contain",
        width: iconWidth,
        left: 5,
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

    titleSmall: Platform.select({
        ios: {
            // backgroundColor: 'yellow',
            fontSize: 15,
            fontWeight: '600',
        },
        android: {
            fontSize: 15,
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
            fontSize: 10,
            fontWeight: '600',
            color: theme.textNoteColor,
            marginTop: 0,
        },
        android: {
            fontSize: 10,
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
            color: theme.textNoteColor,
            marginTop: -2,
        },
        default: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.textNoteColor,
        },
    })
}));
