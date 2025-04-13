import { Circle, Group, Line, Rect, vec } from '@shopify/react-native-skia';
import React, { Fragment } from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

interface Props {
    unit: {
        position: { x: number; y: number };
        width: number;
        height: number;
        color?: string;
        time: number;
    };
    coord: (value: number) => number;
}

export function getBuildingOrigin(props: Props) {
    const { unit, coord } = props;

    // return center of the building
    const xCenter = coord(unit.position.x);
    const yCenter = coord(unit.position.y);
    return { x: xCenter, y: yCenter };
}

export default function Building(props: Props) {
    const { unit, coord } = props;

    const x = coord(unit.position.x-unit.width/2);
    const y = coord(unit.position.y-unit.height/2);
    const width = coord(unit.width);
    const height = coord(unit.height);
    return (
        <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            color={unit.color}
        />
    );
}