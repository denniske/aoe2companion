import React, { useEffect } from 'react';
import { Canvas, Circle, Rect, useCanvasRef } from '@shopify/react-native-skia';
import { TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { Button } from 'react-native-paper';
import { usePaperTheme } from '@app/theming';
import Animated, { Easing, useAnimatedProps, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import TimeScrubber from '@app/view/components/time-scrubber';
// import { useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';


// import { Text as Text2 } from 'react-native';

// const AnimatedText = Animated.createAnimatedComponent(Text2);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
    match: any;
    analysis: IAnalysis;
    analysisSvgUrl: string;
}

export default function MatchMap2() {
    const paperTheme = usePaperTheme();

    // const startAnim = () => {
    //     opacity.value = withDelay(1000, withTiming(1, { duration: 3000 }));
    // };
    //
    // const pauseAnim = () => {
    //     opacity.value = opacity.value;
    // };
    //
    // const revertAnim = () => {
    //     opacity.value = withDelay(1000, withTiming(0, { duration: 3000 }));
    // };
    //
    // const opacity = useSharedValue<number>(0);

    const matchDuration = 10*1000;

    const startAnim = () => {
        time.value = withTiming(matchDuration, { duration: matchDuration-time.value, easing: Easing.linear });
    };

    const pauseAnim = () => {
        time.value = time.value;
    };

    const revertAnim = () => {
        time.value = 0;
    };

    const time = useSharedValue<number>(1000);

    const opacity = useDerivedValue(() => {
        return (time.value - 0) / 1000 * 1/3;
        // return Math.max(0, (time.value - 1000) / 1000 * 1/3);
    });

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Time:', time.value);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // const animatedProps = useAnimatedProps(() => {
    //     return {
    //         text: `Time: ${Math.floor(time.value)}`,
    //     };
    // });

    const animatedProps = useAnimatedProps(() => {
        return {
            text: `${(time.value / 1000).toFixed(2)}s`, // this won't work with Text, only TextInput's "value"
            // value: `${time.value}s`,
        };
    });

    console.log('RERENDER');

    const size = 60 * 4 - 2;

    const dimension = 200;

    return (
        <View>
            <Button onPress={() => startAnim()}
                    mode="contained"
                    uppercase={false}
                    dark={true}
                    buttonColor={paperTheme.colors.primary}
            >
                Start
            </Button>
            <Button onPress={() => pauseAnim()}
                    mode="contained"
                    uppercase={false}
                    dark={true}
                    buttonColor={paperTheme.colors.primary}
            >
                Pause
            </Button>
            <Button onPress={() => revertAnim()}
                    mode="contained"
                    uppercase={false}
                    dark={true}
                    buttonColor={paperTheme.colors.primary}
            >
                Revert
            </Button>
            {/*<AnimatedText animatedProps={animatedProps} />*/}
            <AnimatedTextInput
                editable={false}
                animatedProps={animatedProps}
                style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'black',
                }}
            />

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
