import { FitBox, Group, ImageSVG, Path, rect, useSVG, Skia, SkPath } from '@shopify/react-native-skia';
import React from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { FitPath } from '@app/view/components/match-map/draw/fit-path';

interface Props {
    unit: {
        position: { x: number; y: number };
        unit: string;
        color?: string;
        time: number;
    };
    coord: (value: number) => number;
}

interface PropsOrigin {
    unit: {
        position: { x: number; y: number };
        unit: string;
        color?: string;
        time: number;
    };
    coord: (value: number) => number;
}

export function getSpecialOrigin(props: PropsOrigin) {
    const { unit, coord } = props;

    // return center of the building
    const xCenter = coord(unit.position.x);
    const yCenter = coord(unit.position.y);
    return { x: xCenter, y: yCenter };
}


export default function Special(props: Props) {
    const { unit, coord } = props;

    const specialPaths: Record<string, SkPath> = {
        // house
        'Town Center': Skia.Path.MakeFromSVGString(
            'M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
        )!,
        // fort-awesome-brands
        'Castle': Skia.Path.MakeFromSVGString(
            'M489.2 287.9h-27.4c-2.6 0-4.6 2-4.6 4.6v32h-36.6V146.2c0-2.6-2-4.6-4.6-4.6h-27.4c-2.6 0-4.6 2-4.6 4.6v32h-36.6v-32c0-2.6-2-4.6-4.6-4.6h-27.4c-2.6 0-4.6 2-4.6 4.6v32h-36.6v-32c0-6-8-4.6-11.7-4.6v-38c8.3-2 17.1-3.4 25.7-3.4 10.9 0 20.9 4.3 31.4 4.3 4.6 0 27.7-1.1 27.7-8v-60c0-2.6-2-4.6-4.6-4.6-5.1 0-15.1 4.3-24 4.3-9.7 0-20.9-4.3-32.6-4.3-8 0-16 1.1-23.7 2.9v-4.9c5.4-2.6 9.1-8.3 9.1-14.3 0-20.7-31.4-20.8-31.4 0 0 6 3.7 11.7 9.1 14.3v111.7c-3.7 0-11.7-1.4-11.7 4.6v32h-36.6v-32c0-2.6-2-4.6-4.6-4.6h-27.4c-2.6 0-4.6 2-4.6 4.6v32H128v-32c0-2.6-2-4.6-4.6-4.6H96c-2.6 0-4.6 2-4.6 4.6v178.3H54.8v-32c0-2.6-2-4.6-4.6-4.6H22.8c-2.6 0-4.6 2-4.6 4.6V512h182.9v-96c0-72.6 109.7-72.6 109.7 0v96h182.9V292.5c.1-2.6-1.9-4.6-4.5-4.6zm-288.1-4.5c0 2.6-2 4.6-4.6 4.6h-27.4c-2.6 0-4.6-2-4.6-4.6v-64c0-2.6 2-4.6 4.6-4.6h27.4c2.6 0 4.6 2 4.6 4.6v64zm146.4 0c0 2.6-2 4.6-4.6 4.6h-27.4c-2.6 0-4.6-2-4.6-4.6v-64c0-2.6 2-4.6 4.6-4.6h27.4c2.6 0 4.6 2 4.6 4.6v64z',
        )!,
        // chess-rook-solid
        'Watch Tower': Skia.Path.MakeFromSVGString(
            'M32 192L32 48c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16l0 40c0 4.4 3.6 8 8 8l32 0c4.4 0 8-3.6 8-8l0-40c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16l0 40c0 4.4 3.6 8 8 8l32 0c4.4 0 8-3.6 8-8l0-40c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16l0 144c0 10.1-4.7 19.6-12.8 25.6L352 256l16 144L80 400 96 256 44.8 217.6C36.7 211.6 32 202.1 32 192zm176 96l32 0c8.8 0 16-7.2 16-16l0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48c0 8.8 7.2 16 16 16zM22.6 473.4L64 432l320 0 41.4 41.4c4.2 4.2 6.6 10 6.6 16c0 12.5-10.1 22.6-22.6 22.6L38.6 512C26.1 512 16 501.9 16 489.4c0-6 2.4-11.8 6.6-16z',
        )!,
    }

    const x = coord(unit.position.x);
    const y = coord(unit.position.y);
    // const size = coord(15);
    // const half = size / 2;

    const path = specialPaths[unit.unit];

    if (!path) {
        return null;
    }

    let scale = 1;

    if (unit.unit === 'Watch Tower') {
        scale = 0.8;
    }
    if (unit.unit === 'Castle') {
        scale = 1.2;
    }

    const size = 15*scale;

    return (
        // <Group origin={{x, y}} transform={[{ rotateZ: (2 * Math.PI) / 8 }, { scaleY: 2 }]}>
        //     <FitBox src={rect(0, 0, 576, 512)} dst={rect(-10 + x, -10 + y, 20, 20)}>
        //         <Path
        //             path="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
        //             color={unit.color}
        //             style={'fill'}
        //         />
        //         <Path
        //             path="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
        //             color="black"
        //             style={'stroke'}
        //             strokeWidth={50}
        //         />
        //     </FitBox>
        // </Group>

        <Group origin={{x, y}} transform={[{ rotateZ: (2 * Math.PI) / 8 }, { scaleY: 2 }]}>
            <FitPath
                path={path}
                x={x}
                y={y}
                width={size}
                height={size}
                color={unit.color}
                strokeWidth={30}
            />
        </Group>

        // <ImageSVG
        //     opacity={opacity}
        //     svg={svg}
        //     x={x-half}
        //     y={y-half}
        //
        //
        //     // style={'stroke'}
        //     // strokeWidth={20}
        //
        //     // color={'red'}
        //     // color={unit.color}
        //     width={size}
        //     height={size}
        //     origin={{x, y}}
        //     transform={[{ rotateZ: 2*Math.PI/8 }, { scaleY: 2 }]}
        // />

        // <Path
        //     style={'stroke'}
        //     path="M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
        //     color="lightblue"
        //     transform={[{scale:0.25}]}
        //     // start={0.25}
        //     strokeWidth={2}
        //     // stroke={{
        //     //     width: 10,
        //     // }}
        //
        // />
    );
}
