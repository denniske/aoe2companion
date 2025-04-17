import React, { useEffect } from 'react';
import { Canvas, Circle, Rect, useCanvasRef } from '@shopify/react-native-skia';
import { TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { usePaperTheme } from '@app/theming';
import Animated, { Easing, useAnimatedProps, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import TimeScrubber from '@app/view/components/match-map/time-scrubber';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
    match: any;
    analysis: IAnalysis;
    analysisSvgUrl: string;
}

export default function MatchMap2() {
    const time = useSharedValue<number>(1000);

    const opacity = useDerivedValue(() => {
        return (time.value - 0) / (5 * 60 * 1000);
        // return Math.max(0, (time.value - 1000) / 1000 * 1/3);
    });

    console.log('RERENDER');

    const size = 60 * 4 - 2;

    return (
        <View>
            <View className="flex-row justify-center border border-gray-300">
                <View className="relative w-60 h-60 border border-gray-700">
                        <Canvas
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: size,
                                height: size,
                            }}
                        >
                            <Circle
                                opacity={opacity}
                                key={'circle'}
                                r={size/2}
                                cx={size/2}
                                cy={size/2}
                                color={'red'}
                            />
                        </Canvas>
                </View>
            </View>
            <TimeScrubber time={time}></TimeScrubber>
        </View>
    );
}
