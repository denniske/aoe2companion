import { LinearGradientProps } from 'expo-linear-gradient/src/LinearGradient';
import { ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { withUniwind } from 'uniwind';
import React from 'react';

type LinearGradientWithTwoColorsProps = Omit<LinearGradientProps, 'colors' | 'locations'> & {
    colorFrom?: ColorValue;
    colorTo?: ColorValue;
    locations?: [number, number];
}

export function LinearGradientWithTwoColors(props: LinearGradientWithTwoColorsProps) {
    const { colorFrom, colorTo, ...rest } = props;
    // console.log('color from to', colorFrom, colorTo);
    return (
        <LinearGradient
            {...rest}
            colors={[colorFrom as string, colorTo as string]}
        />
    );
}

export const StyledLinearGradientWithTwoColors = withUniwind(LinearGradientWithTwoColors, {
    colorFrom: {
        fromClassName: 'colorFromClassName',
        styleProperty: 'color',
    },
    colorTo: {
        fromClassName: 'colorToClassName',
        styleProperty: 'color',
    },
})
