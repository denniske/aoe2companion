import React from 'react';
import {Text, TextProps, View} from 'react-native';
import { useAppTheme } from '../../theming';

// Body 17


export interface MyTextProps extends TextProps {
    size?: MyFontSize;
    children?: React.ReactNode;
}

const fontDict = {
    'title1': { fontSize: 28, },
    'title2': { fontSize: 22, },
    'title3': { fontSize: 20, },
    'headline': { fontSize: 17, fontWeight: '600', },
    'body': { fontSize: 17, },
    'callout': { fontSize: 16, },
    'subhead': { fontSize: 15, },
    'footnote': { fontSize: 13, },
    'caption1': { fontSize: 12, },
    'caption2': { fontSize: 11, },
} as const;

export type MyFontSize = keyof typeof fontDict;

export function MyText(props: MyTextProps) {
    const theme = useAppTheme();
    const { children, style, size, ...rest } = props;

    let fontStyle: any = fontDict['body'];

    if (size) {
        fontStyle = fontDict[size];
    }

    fontStyle = {
        fontSize: 14,
        color: theme.textColor,
    };

    return (
        <Text {...rest} style={[fontStyle, style]}>{children}</Text>
    );
}
