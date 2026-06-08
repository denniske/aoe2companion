import { Image, Platform, StyleSheet, View } from 'react-native';
import { MyText } from '../my-text';
import React from 'react';
import { createStylesheet } from '../../../theming-new';
import { SvgUri } from 'react-native-svg';
import { Icon } from '@app/components/icon';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


interface Props {
    label: string;
    labelColor: string;
    labelTextColor?: string;
    content?: string;
    contentColor?: string;
    contentTextColor?: string;
    logoPng?: any;
    logoSvg?: string;
    logoIcon?: IconDefinition;
    logoColor: string; // e.g. white or for fa icons accent-[#FFFFFF]
    dot?: boolean;
}


export default function Badge(props: Props) {
    const styles = useStyles();

    const {label, content, labelColor, labelTextColor = '#FCFCFC', contentColor = 'white', contentTextColor = '#FCFCFC', logoPng, logoSvg, logoIcon, logoColor, dot} = props;

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: labelColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 6,
                    paddingLeft: 6,
                    gap: 4,
                }}
            >
                {logoPng && <Image className="w-4 h-4" source={logoPng} />}
                {logoSvg && Platform.OS === 'web' && <Image tintColor={logoColor} source={{ uri: logoSvg, width: 16, height: 16 }} />}
                {logoSvg && Platform.OS !== 'web' && <SvgUri width={16} height={16} fill={logoColor} uri={logoSvg} />}
                {logoIcon && <Icon icon={logoIcon} color={logoColor} />}
                {label && <MyText style={[styles.labelText, { color: labelTextColor }]}>{label}</MyText>}
            </View>
            {(content || dot) && (
                <View
                    style={{
                        backgroundColor: contentColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 6,
                        paddingRight: 6,
                    }}
                >
                    {dot && <MyText style={{ color: '#e91a16', fontSize: 10, lineHeight: 14 }}> ● </MyText>}
                    <MyText style={[styles.contentText, { color: contentTextColor }]}>{content}</MyText>
                </View>
            )}
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
        fontSize: 11,
    },
    contentText: {
        fontSize: 11,
        lineHeight: 14,
    },
    logo: {
        paddingTop: 1,
        width: 16,
        height: 18,
        // ...(Platform.OS === 'web' ? {filter: 'brightness(0) invert()'} : {}),
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        paddingLeft: 6,
        gap: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        paddingRight: 6,
    },
} as const));
