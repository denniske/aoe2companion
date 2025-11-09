import { Circle, Group, Line, Rect, vec } from '@shopify/react-native-skia';
import React, { Fragment } from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

interface Props {
    unit: {
        position: { x: number; y: number };
        positionEnd: { x: number; y: number };
        color?: string;
    };
    coord: (value: number) => number;
}

export function getWallOrigin(props: Props) {
    const { unit, coord } = props;

    const x = coord(unit.position.x-1/2+1/2);
    const y = coord(unit.position.y-1/2+1/2);
    const xEnd = coord(unit.positionEnd.x-1/2+1/2);
    const yEnd = coord(unit.positionEnd.y-1/2+1/2);

    // return center of the wall
    const xCenter = (x + xEnd) / 2;
    const yCenter = (y + yEnd) / 2;
    return { x: xCenter, y: yCenter };
}

export default function Wall(props: Props) {

    const { unit, coord } = props;

    const x = coord(unit.position.x-1/2+1/2);
    const y = coord(unit.position.y-1/2+1/2);
    const xEnd = coord(unit.positionEnd.x-1/2+1/2);
    const yEnd = coord(unit.positionEnd.y-1/2+1/2);
    const lx = coord(unit.position.x+1/2);
    const ly = coord(unit.position.y+1/2);
    const lxEnd = coord(unit.positionEnd.x+1/2);
    const lyEnd = coord(unit.positionEnd.y+1/2);
    const isDiagonal = unit.position.x !== unit.positionEnd.x && unit.position.y !== unit.positionEnd.y;
    const strokeWidth = coord(isDiagonal ? 1.33 : 1);
    const one = coord(1);

    if (x === xEnd && y === yEnd) {
        return (
            <Rect
                x={x}
                y={y}
                width={one}
                height={one}
                color={unit.color}
            />
        );
    }

    return (
            <Group
            >
                <Rect
                    x={x}
                    y={y}
                    width={one}
                    height={one}
                    color={unit.color}
                    // color={'yellow'}
                />
                <Rect
                    x={xEnd}
                    y={yEnd}
                    width={one}
                    height={one}
                    color={unit.color}
                    // color={'red'}
                />
                <Line
                    p1={vec(lx, ly)}
                    p2={vec(lxEnd, lyEnd)}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    color={unit.color}
                    opacity={1}
                    // blendMode="dstATop"
                />
            </Group>
    );
}