import React from 'react';
import { AnimatedProp, FitBox, Group, Path, rect, Transforms3d } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';

interface FitPathProps {
    path: SkPath;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    strokeWidth?: number;
}

export const FitPath: React.FC<FitPathProps> = ({
                                                    path,
                                                    x,
                                                    y,
                                                    width,
                                                    height,
                                                    color = 'black',
                                                    strokeWidth = 50,
                                                }) => {
    const bounds = path.getBounds();

    return (
        <FitBox fit="contain" src={rect(0, 0, bounds.width, bounds.height)} dst={rect(-(width/2) + x, -(height/2) + y, width, height)}>
            <Path
                path={path}
                color={color}
                style={'fill'}
            />
            <Path
                path={path}
                color="black"
                style={'stroke'}
                strokeWidth={strokeWidth}
            />
        </FitBox>
    );
};
