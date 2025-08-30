import {
    Circle,
    ColorMatrix,
    Group,
    Line,
    OpacityMatrix,
    Paint,
    Rect,
    Transforms3d,
    vec,
} from '@shopify/react-native-skia';
import React, { Fragment } from 'react';
import { processColor } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

interface Props {
    time: SharedValue<number>;
    children: React.ReactNode;
    timeStart: number;
    origin: { x: number, y: number };
    coord: (value: number) => number; // needed?
    color?: string;
}

export const solidColorMatrix = (color: string): number[] => {
    // 'worklet';

    const raw = processColor(color);
    if (typeof raw !== 'number') {
        console.warn(`[solidColorMatrix] Invalid color: ${color}`);
        return [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0,
        ];
    }

    const r = ((raw >> 16) & 255) / 255;
    const g = ((raw >> 8) & 255) / 255;
    const b = (raw & 255) / 255;

    return [
        0, 0, 0, 0, r,
        0, 0, 0, 0, g,
        0, 0, 0, 0, b,
        0, 0, 0, 1, 0,
    ];
};

export const tintExceptBlackMatrix = (color: string): number[] => {
    // 'worklet';

    const raw = processColor(color);
    if (typeof raw !== 'number') {
        console.warn(`[tintExceptBlackMatrix] Invalid color: ${color}`);
        return [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
        ];
    }

    const r = ((raw >> 16) & 255) / 255;
    const g = ((raw >> 8) & 255) / 255;
    const b = (raw & 255) / 255;

    // Multiplier makes black stay black, and color gets blended toward tint
    const boost = 1;

    return [
        boost * r, 0, 0, 0, 0,
        0, boost * g, 0, 0, 0,
        0, 0, boost * b, 0, 0,
        0, 0, 0, 1, 0,
    ];
};
export default function Faded(props: Props) {

    const { origin, time, timeStart, children, color } = props;

    // console.log('unit.time', unit)

    const opacity = useDerivedValue(() => {
        // return 1;
        // if (!timeStart) return 1;
        return (time.value - timeStart) / (1 * 60 * 1000);
    });

    const scale = useDerivedValue<Transforms3d>(() => {
        return [{scale: Math.max(1, 3 - (time.value - timeStart) / (1 * 60 * 1000) * 2) }];
        // return (time.value - timeStart) / (1 * 60 * 1000) * 4;
    });

    // const makeOpacityMatrix = (opacity: number): number[] => {
    //     'worklet';
    //     return [
    //         1, 0, 0, 0, 0,
    //         0, 1, 0, 0, 0,
    //         0, 0, 1, 0, 0,
    //         0, 0, 0, opacity, 0,
    //     ];
    // };

    // const opacityMatrix = useDerivedValue(() => {
    //     return makeOpacityMatrix(opacity.value);
    // });

    // const redPaintMatrix = [
    //     0, 0, 0, 0, 1, // Red stays the same
    //     0, 0, 0, 0, 0, // Green zeroed out
    //     0, 0, 0, 0, 0, // Blue zeroed out
    //     0, 0, 0, 1, 0, // Alpha unchanged
    // ];

    // const redMatrix = solidColorMatrix(color?.toLowerCase() ?? 'black');
    const redMatrix = tintExceptBlackMatrix(color?.toLowerCase() ?? 'black');

    return (
            <Group
                // layer={<Paint><ColorMatrix matrix={opacityMatrix} /><ColorMatrix matrix={redMatrix} /></Paint>}
                opacity={opacity}
                // opacity={1}
                origin={origin}
                transform={scale}
                // transform={[{    scale: 4 }]}
            >
                {children}
            </Group>
    );
}
