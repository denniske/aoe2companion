import {Image, Platform, StyleSheet, View} from "react-native";
import {MyText} from "../my-text";
import React from "react";
import {shadeColor} from "@nex/data";
import {createStylesheet} from '../../../theming-new';
import {LinearGradient} from 'expo-linear-gradient';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {SvgUri} from 'react-native-svg';


interface Props {
    label: string;
    labelColor: string;
    content?: string;
    contentColor?: string;
    logoSvg?: string;
    logoIcon?: string;
    logoColor: string;
    dot?: boolean;
}


export default function Badge(props: Props) {
    const styles = useStyles();

    const {label, content, labelColor, contentColor = 'white', logoSvg, logoIcon, logoColor, dot} = props;

    return (
        <View style={styles.container}>
            <LinearGradient
                style={styles.label}
                colors={[labelColor, shadeColor(labelColor, -20)]}
            >
                {
                    logoSvg && Platform.OS === 'web' &&
                    <Image style={styles.logo} source={{uri: logoSvg, width: 14, height: 14}} />
                }
                {
                    logoSvg && Platform.OS !== 'web' &&
                    <SvgUri style={styles.logo} width={14} height={14} fill={logoColor} uri={logoSvg}/>
                }
                {
                    logoIcon &&
                    <Icon5 style={styles.logo} name={logoIcon} color={logoColor} />
                }
                <MyText style={styles.labelText}>{label}</MyText>
            </LinearGradient>
            {
                content &&
                <LinearGradient
                    style={styles.content}
                    colors={[contentColor, shadeColor(contentColor, -20)]}
                >
                    {
                        dot &&
                        <MyText style={{color: '#e91a16', fontSize: 10}}> ● </MyText>
                        // <Icon5 solid name="circle" size={8} style={styles.liveIcon} />
                    }
                    <MyText style={styles.contentText}>{content}</MyText>
                </LinearGradient>
            }
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    liveIcon: {
        marginLeft: 3,
        marginRight: 3,
        color: '#e91a16',
    },
    container: {
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 4,
        overflow: 'hidden',
        alignSelf: 'flex-start',
    },
    labelText: {
        color: 'white',
        fontSize: 11,
    },
    contentText: {
        color: 'white',
        fontSize: 11,
    },
    logo: {
        marginRight: 4,
        ...(Platform.OS === 'web' ? {filter: 'brightness(0) invert()'} : {}),
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        paddingLeft: 6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        paddingRight: 6,
    },
}));
