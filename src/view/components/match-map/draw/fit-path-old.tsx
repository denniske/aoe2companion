import React from 'react';
import { AnimatedProp, Group, Path, Transforms3d } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';

interface FitPathProps {
    path: SkPath;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    strokeWidth?: number;
    style?: 'stroke' | 'fill';
    origin?: { x: number; y: number };
    transform?: AnimatedProp<Transforms3d | undefined>;
}

export const FitPathOld: React.FC<FitPathProps> = ({
                                                    path,
                                                    x,
                                                    y,
                                                    width,
                                                    height,
                                                    color = 'black',
                                                    strokeWidth = 2,
                                                    style = 'stroke',
                                                }) => {
    const bounds = path.getBounds();

    const scaleX = width / bounds.width;
    const scaleY = height / bounds.height;
    const scale = Math.min(scaleX, scaleY); // maintain aspect ratio

    const offsetX = x - bounds.x * scale + (width - bounds.width * scale) / 2;
    const offsetY = y - bounds.y * scale + (height - bounds.height * scale) / 2;

    return (
        <Group
            transform={[
                { translateX: offsetX },
                { translateY: offsetY },
                { scale },
            ]}
        >
            <Path
                path={path}
                color={color}
                style={style}
                strokeWidth={strokeWidth}
            />
        </Group>
    );
};
